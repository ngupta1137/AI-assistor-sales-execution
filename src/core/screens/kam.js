// Key account lead (X13): key {accounts} and their agreements, blockers routed from the field,
// and offer targeting: budget, approved offer, which {accounts} at which tier, and which are
// held back as "would buy anyway". Releasing sends the targets to the field. Sample data only.

import { esc, icon, pill } from '../ui.js';
import { roles } from '../execution/roles.js';
import { signals, exOf, archetypeOf } from '../execution/model.js';

const INCLUDE_REASONS = ['Agreement commitment', 'Strategic relationship', 'Competitor activity', 'New listing support'];

export const actions = {
  'kam-release': ({ ctx }) => { roles(ctx).release(); },
  'kam-include': ({ ctx, data }) => { ctx.ui.includeFor = data.id; },
  'kam-include-cancel': ({ ctx }) => { ctx.ui.includeFor = null; },
  'kam-include-reason': ({ ctx, data }) => { roles(ctx).include(data.id, ctx.t(data.reason)); ctx.ui.includeFor = null; },
};

export function render(ctx) {
  const { t, data, fmt, industry, m } = ctx;
  const R = roles(ctx);
  const sg = signals(ctx);
  const ex = exOf(industry);
  const canAct = ctx.persona === 'kam';
  const keys = data.accounts.filter((a) => archetypeOf(industry, a.segmentId) === 'consultative').sort((a, b) => b.potential - a.potential).slice(0, 6);
  const keyRows = keys.map((a) => `<li class="watch-row" data-key-acc="${a.id}"><div class="row-main"><a class="tap-link" href="#/account/${a.id}"><b>${esc(a.name)}</b></a>
    <small>${esc(t('{seg} · Tier {tier} · {pct}% of potential captured', { seg: t(a.segment), tier: R.tierOf(a.id), pct: sg[a.id].captured }))}</small></div>
    ${pill(t('Risk {band}', { band: t(sg[a.id].risk.band) }), sg[a.id].risk.band === 'High' ? 'bad' : sg[a.id].risk.band === 'Watch' ? 'warn' : 'good')}</li>`).join('');
  const blockers = m.exceptions().filter((e) => e.route === 'kam');
  const blockHtml = blockers.length ? `<ul class="bullets small">${blockers.slice(0, 5).map((e) => `<li><b>${esc(e.account)}</b> ${esc(t(e.title, e.vars))}. <span class="muted">${esc(t(e.reason))}</span></li>`).join('')}</ul>` : `<p class="small muted">${esc(t('No items routed to you yet. A {rep} who records a refusal under an agreement sends it here.'))}</p>`;

  let offerHtml;
  if (ex.offers.mode === 'off') {
    offerHtml = `<section class="card" id="kam-offers" data-mode="off"><h2>${esc(t('Offer targeting'))}</h2><p class="small">${esc(t(ex.offers.note))}</p></section>`;
  } else {
    const targets = R.targets();
    const held = R.held();
    const released = R.released();
    const chain = ex.offers.mode === 'on'
      ? ['Budget set by finance', 'Approved offer plan', 'Offer tiers', 'Targeted {accounts}', 'Field']
      : ['Approved program', 'Eligible {accounts}', 'People decide terms', 'Field'];
    const pick = ctx.ui.includeFor;
    const tRows = targets.slice(0, 10).map((a) => { const o = R.offerOf(a.id); return `<li class="watch-row" data-target="${a.id}"><div class="row-main"><b>${esc(a.name)}</b><small>${esc(t(o.t, o.v))}</small></div>${o.tier ? pill(t(o.tier), 'accent') : pill(t('Eligible'), 'info')}</li>`; }).join('');
    const hRows = held.slice(0, 8).map((a) => `<li class="watch-row" data-held="${a.id}"><div class="row-main"><b>${esc(a.name)}</b><small>${esc(t(sg[a.id].offer.t, sg[a.id].offer.v))}</small></div>
      ${canAct ? `<button class="btn secondary sm" data-act="kam-include" data-id="${a.id}" style="min-height:var(--tap)">${esc(t('Include'))}</button>` : ''}</li>
      ${pick === a.id ? `<li class="include-pick" id="include-pick"><span class="small">${esc(t('Why include {name}? Logged with your name.', { name: a.name }))}</span><div class="cap-chips">${INCLUDE_REASONS.map((r) => `<button class="btn secondary sm" data-act="kam-include-reason" data-id="${a.id}" data-reason="${esc(r)}" style="min-height:var(--tap)">${esc(t(r))}</button>`).join('')}<button class="btn text sm" data-act="kam-include-cancel" style="min-height:var(--tap)">${esc(t('Cancel'))}</button></div></li>` : ''}`).join('');
    offerHtml = `<section class="card" id="kam-offers" data-mode="${ex.offers.mode}" data-released="${released}">
      <div class="section-head"><h2>${esc(t('Offer targeting'))}</h2>${released ? pill(t('Released'), 'good') : pill(t('Not released'), 'warn')}</div>
      <div class="phase-strip small">${chain.map((c) => `<span class="phase">${esc(t(c))}</span>`).join('<span aria-hidden="true">›</span>')}</div>
      <p class="small">${esc(ex.offers.mode === 'on' ? t('{n} {accounts} targeted, {h} held back because they would buy anyway or the gain is small.', { n: targets.length, h: held.length }) : t('{n} {accounts} eligible for {program}. Terms are decided by {decider}.', { n: targets.length, program: ex.offers.program, decider: ex.offers.decider.replace(/^The /, 'the ') }))}</p>
      <h3>${esc(t(ex.offers.mode === 'on' ? 'Targeted' : 'Eligible'))}</h3><ul class="watch-list">${tRows}</ul>
      <h3>${esc(t('Held back'))}</h3><ul class="watch-list">${hRows || `<li class="small muted">${esc(t('None held back.'))}</li>`}</ul>
      ${!R.capOn('offers') ? `<p class="small muted">${esc(t('Offer Targeting is switched off in this market by sales ops.'))}</p>` : released ? `<p class="small good-text" id="kam-released">${esc(t('Released. Reps see the offer on the brief and the order-led {rep} sees the tiers on the {order}.'))}</p>` : canAct ? `<button class="btn primary block" data-act="kam-release" id="kam-release" style="min-height:var(--tap)">${esc(t(ex.offers.mode === 'on' ? 'Release targets to the field' : 'Pass the eligible list on'))}</button>` : ''}
      <p class="small muted">${esc(t('Offers come only from the approved plan. Nobody here changes a price or term. Sample data.'))}</p>
    </section>`;
  }
  return `
  <section class="page-head"><h1>${esc(t('Key {accounts}'))}</h1>
    <p class="muted">${esc(t('{name}, {title}. Agreements, blockers and offer targeting.', { name: data.kam.name, title: t(data.kam.title) }))}</p></section>
  <section class="card" id="kam-keys"><h2>${esc(t('Largest {accounts} by potential'))}</h2><ul class="watch-list">${keyRows}</ul>
    <p class="small muted">${esc(t('Total white space: {amount}. Sample data.', { amount: fmt.moneyShort(data.territory.opportunity) }))}</p></section>
  <section class="card" id="kam-blockers"><h2>${esc(t('Routed to you from the field'))}</h2>${blockHtml}</section>
  ${offerHtml}
  <a class="btn secondary block" href="#/system/flows/price" style="min-height:var(--tap)">${esc(t('See the agreed terms flow'))} ${icon('chevron', 14)}</a>`;
}
