// Execution system pieces shown on existing screens: foundation signals on Account 360 (X7)
// and the merged-plan panel on the visit brief (X5). Tokenized; sample data only.

import { esc, icon, pill } from '../ui.js';
import { CAPS, signals, conflicts, exOf, ARCHETYPES, flowOfAction } from './model.js';
import { roles, FEEDS } from './roles.js';

const TONE = { High: 'bad', Watch: 'warn', Low: 'good' };
const OFFER_TONE = { target: 'accent', eligible: 'info', hold: 'muted', off: 'muted' };
const OFFER_LABEL = { target: 'Target', eligible: 'Eligible', hold: 'Held back', off: 'Not used' };

/** Foundation signals for one account: tier, retention risk, growth drivers, offer decision. */
export function foundationCard(ctx, accountId) {
  const { t, data, industry } = ctx;
  const a = data.byId[accountId];
  const sg = signals(ctx)[accountId];
  const forRep = ctx.persona === 'rep';
  const offersOff = exOf(industry).offers.mode === 'off';
  return `<section class="card" id="acc-foundation" data-risk="${sg.risk.band}" data-offer="${sg.offer.decision}">
    <div class="section-head"><h2>${esc(t('Foundation signals'))}</h2>${pill(t('Sample data'), 'muted')}</div>
    <div class="signals-grid">
      <div data-sig="tier"><small class="muted">${esc(t(CAPS.tiering.name))}</small><b>${esc(t('Tier {tier}', { tier: a.tier }))}</b><span class="small">${esc(t('{cluster}. Due every {d} days', { cluster: t(sg.cluster), d: sg.cycle }))}</span></div>
      <div data-sig="retention"><small class="muted">${esc(t(CAPS.retention.name))}</small><b>${pill(t('{band} · {score}', { band: t(sg.risk.band), score: sg.risk.score }), TONE[sg.risk.band])}</b></div>
      <div data-sig="potential"><small class="muted">${esc(t(CAPS.potential.name))}</small><b>${esc(t('{pct}% captured', { pct: sg.captured }))}</b></div>
      <div data-sig="type"><small class="muted">${esc(t('{Visit} type'))}</small><b class="small">${esc(t(ARCHETYPES[sg.archetype].name))}</b></div>
    </div>
    <p class="small"><b>${esc(t('Risk drivers'))}:</b></p>
    <ul class="bullets small" id="risk-drivers">${sg.risk.drivers.map((d) => `<li>${esc(t(d.t, d.v))}</li>`).join('')}</ul>
    <p class="small"><b>${esc(t(CAPS.diagnostics.name))}:</b> ${sg.growth.map((d) => esc(t(d.t, d.v))).join('. ')}.</p>
    ${(() => {
      const R = roles(ctx);
      const o = R.offerOf(accountId);
      const status = offersOff ? '' : !R.capOn('offers') ? t('Switched off in this market.') : R.released() ? t('Released to the field.') : t('Not released yet by the {kam}.');
      const lost = R.lost();
      const lostCaps = Object.keys(lost).filter((c) => ['diagnostics', 'retention', 'potential'].includes(c));
      return `<p class="small" id="offer-decision"><b>${esc(t(CAPS.offers.name))}:</b> ${pill(t(OFFER_LABEL[o.decision]), OFFER_TONE[o.decision])} ${esc(t(o.t, o.v))} <span class="muted">${esc(status)}</span></p>
      ${R.tierOf(accountId) !== a.tier ? `<p class="small" id="tier-approved">${pill(t('Tier {tier} approved', { tier: R.tierOf(accountId) }), 'accent')} ${esc(t('Tier change approved by the {manager}. The cadence changes next cycle.'))}</p>` : ''}
      ${lostCaps.length ? `<p class="small muted" id="feed-lost">${icon('sync', 14)} ${esc(t('Partner data feed off: lower confidence in {caps}.', { caps: lostCaps.map((c) => t(CAPS[c].name)).join(', ') }))}</p>` : ''}`;
    })()}
    ${forRep ? `<p class="small muted">${esc(t('Foundation scores are a {manager} view. They decide where your {visits} go; you see their effect in the ranked brief.'))}</p>` : ''}
    ${offersOff ? '' : `<p class="small muted">${esc(t('Offers come only from the approved plan. The agent never creates terms.'))}</p>`}
    <a class="btn secondary sm" href="#/system" style="min-height:var(--tap)">${esc(t('How the eight capabilities work'))} ${icon('chevron', 14)}</a>
  </section>`;
}

/** How the orchestrator merged eight capabilities into this one brief. */
export function mergePanel(ctx, accountId) {
  const { t, data, industry } = ctx;
  const p = data.planned.find((x) => x.accountId === accountId);
  if (!p) return '';
  const sg = signals(ctx)[accountId];
  const a = data.byId[accountId];
  const cs = conflicts(ctx, accountId);
  const ex = exOf(industry);
  const flowsHit = [...new Set(p.actions.map((x) => flowOfAction(industry, x.defId)).filter(Boolean))];
  const fed = [
    ['potential', t('Tier {tier}, {pct}% of potential captured', { tier: a.tier, pct: sg.captured })],
    ['retention', t('Risk {band}, {score} of 100', { band: t(sg.risk.band), score: sg.risk.score })],
    ['diagnostics', t('{n} gaps found', { n: p.actions.filter((x) => x.agent === 'gap').length })],
    ['actions', t('{n} actions ranked, {f} fit {m} min', { n: p.actions.length, f: p.actions.filter((x) => !x.overBudget).length, m: a.visitMinutes })],
    ['planning', t('Slot and time budget set')],
    ['order', t('{n} lines drafted', { n: p.order.length })],
    ...(ex.offers.mode === 'off' ? [] : [['offers', t(sg.offer.t, sg.offer.v)]]),
  ];
  return `<details class="fold" id="merge-panel" data-conflicts="${cs.length}">
    <summary>${esc(t('How this plan was merged'))}<span class="sum-end">${cs.length ? esc(t('{n} resolved', { n: cs.length })) : esc(t('No conflicts'))}</span></summary>
    <p class="small">${esc(t('The orchestrator asked every capability about this {account}, resolved the conflicts and gave you one list.'))}</p>
    <ul class="bullets small">${fed.map(([c, s]) => `<li><b>${esc(t(CAPS[c].name))}:</b> ${esc(s)}</li>`).join('')}</ul>
    ${cs.length ? `<ul class="conflict-list">${cs.map((k) => `<li class="conflict-row" data-between="${k.between.join('-')}"><span class="small"><b>${esc(t(CAPS[k.between[0]].name))}</b> ${esc(t('vs'))} <b>${esc(t(CAPS[k.between[1]].name))}</b></span><span class="small muted">${esc(t(k.saw, k.v))}</span><span class="small"><b>${esc(t('Resolved'))}:</b> ${esc(t(k.resolved, k.v))}</span></li>`).join('')}</ul>` : `<p class="small muted">${esc(t('Every capability agreed on this {visit}.'))}</p>`}
    ${flowsHit.length ? `<p class="small muted">${esc(t('Process flows in this brief'))}: ${flowsHit.map((f) => `<a href="#/system/flows/${f}">${esc(t(ex.flows[f].name))}</a>`).join(', ')}</p>` : ''}
  </details>`;
}

/** What other roles changed that this field user must see: retention visits, event mode, switched-off capabilities, released offers. */
export function fieldNotices(ctx, accountId) {
  const { t, data, industry } = ctx;
  const R = roles(ctx);
  const out = [];
  const asg = R.assigned();
  if (!accountId && asg.length) {
    out.push(`<section class="card" id="assigned-visits"><div class="section-head"><h2>${esc(t('Retention visits from the {manager}'))}</h2>${pill(String(asg.length), 'warn')}</div>
      <ul class="bullets small">${asg.map((a) => `<li><a class="tap-link" href="#/account/${a.id}"><b>${esc(a.name)}</b></a> ${esc(t('Risk {score} of 100. Open with what changed, not a sales push.', { score: signals(ctx)[a.id].risk.score }))}</li>`).join('')}</ul></section>`);
  }
  if (accountId && asg.some((a) => a.id === accountId)) out.push(`<div class="notice warn" id="assigned-here">${icon('flag', 18)}<span>${esc(t('The {manager} assigned this as a retention visit. Start with what changed for the {contact}.'))}</span></div>`);
  if (R.season()) out.push(`<div class="notice" id="season-on">${icon('calendar', 18)}<span>${esc(t('Event mode on for {event}. Event actions rank first and suggested quantities are higher. Set by sales ops.', { event: data.event.name }))}</span></div>`);
  const off = R.off();
  if (off.length) out.push(`<div class="notice" id="caps-off">${icon('stop', 18)}<span>${esc(t('Switched off in this market by sales ops: {caps}.', { caps: off.map((c) => t(CAPS[c].name)).join(', ') }))}</span></div>`);
  if (accountId) {
    const o = R.fieldOffer(accountId);
    if (o && ['target', 'eligible'].includes(o.decision)) out.push(`<div class="notice" id="offer-released">${icon('check', 18)}<span>${esc(t('Offer released by the {kam}: {text}', { text: t(o.t, o.v) }))}</span></div>`);
  }
  return out.join('');
}
