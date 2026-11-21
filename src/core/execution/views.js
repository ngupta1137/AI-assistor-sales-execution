// Execution system pieces shown on existing screens: foundation signals on Account 360 (X7)
// and the merged-plan panel on the visit brief (X5). Tokenized; sample data only.

import { esc, icon, pill } from '../ui.js';
import { CAPS, signals, conflicts, exOf, ARCHETYPES, flowOfAction } from './model.js';

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
    <p class="small" id="offer-decision"><b>${esc(t(CAPS.offers.name))}:</b> ${pill(t(OFFER_LABEL[sg.offer.decision]), OFFER_TONE[sg.offer.decision])} ${esc(t(sg.offer.t, sg.offer.v))}</p>
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
