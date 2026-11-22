// Manager: {account} health (X12). Retention watch list with "assign a retention visit"
// (it lands on the rep's Today), tier changes to approve, {visits} against plan by tier,
// and new {accounts} added in the field. Sample data only.

import { esc, icon, pill } from '../ui.js';
import { roles, LIFE } from '../execution/roles.js';
import { signals, cycleDays } from '../execution/model.js';

export const actions = {
  'assign-retention': ({ ctx, data }) => { roles(ctx).assign(data.id); },
  'approve-tier': ({ ctx, data }) => { roles(ctx).approveTier(data.id, data.to); },
};

export function render(ctx) {
  const { t, data, m } = ctx;
  const R = roles(ctx);
  const sg = signals(ctx);
  const canAct = ctx.persona === 'manager';
  const planned = new Set(data.planned.map((p) => p.accountId));
  const watch = R.watch().slice(0, 8);
  const assigned = new Set(R.assigned().map((a) => a.id));
  const rows = watch.map((a) => {
    const s = sg[a.id];
    const done = assigned.has(a.id);
    return `<li class="watch-row" data-watch="${a.id}"><div class="row-main"><a class="tap-link" href="#/account/${a.id}"><b>${esc(a.name)}</b></a>
      <small>${esc(t('Tier {tier} · {seg} · {driver}', { tier: R.tierOf(a.id), seg: t(a.segment), driver: t(s.risk.drivers[0].t, s.risk.drivers[0].v) }))}</small></div>
      ${pill(t('{band} {score}', { band: t(s.risk.band), score: s.risk.score }), s.risk.band === 'High' ? 'bad' : 'warn')}
      ${done ? pill(t('Assigned'), 'good') : planned.has(a.id) ? pill(t('On today\'s plan'), 'muted') : canAct ? `<button class="btn secondary sm" data-act="assign-retention" data-id="${a.id}" style="min-height:var(--tap)">${esc(t('Assign visit'))}</button>` : ''}</li>`;
  }).join('');
  const props = R.tierProposals();
  const tierRows = props.map((p) => {
    const ok = R.tierOf(p.a.id) === p.to;
    return `<li class="watch-row" data-tier-prop="${p.a.id}"><div class="row-main"><b>${esc(p.a.name)}</b><small>${esc(t('Tier {from} to {to}. {why}', { from: p.from, to: p.to, why: t(p.why, p.v) }))}</small></div>
      ${ok ? pill(t('Approved'), 'good') : canAct ? `<button class="btn secondary sm" data-act="approve-tier" data-id="${p.a.id}" data-to="${p.to}" style="min-height:var(--tap)">${esc(t('Approve'))}</button>` : pill(t('Waiting'), 'muted')}</li>`;
  }).join('');
  const byTier = ['A', 'B', 'C'].map((tier) => {
    const list = data.planned.filter((p) => data.byId[p.accountId].tier === tier);
    const done = list.filter((p) => m.visitDone(p.accountId)).length;
    const overdue = data.accounts.filter((a) => a.tier === tier && a.lastVisitDays > cycleDays(tier)).length;
    return `<div data-by-tier="${tier}"><small>${esc(t('Tier {tier}', { tier }))}</small><b>${done} / ${list.length}</b><span class="small muted">${esc(t('{n} overdue', { n: overdue }))}</span></div>`;
  }).join('');
  const news = R.newAccounts();
  return `
  <section class="page-head"><h1>${esc(t('{Account} health'))}</h1>
    <p class="muted">${esc(t('Who may leave, which tiers should change, and whether {visits} follow the plan.'))}</p></section>
  <section class="card" id="retention-watch"><div class="section-head"><h2>${esc(t('Retention watch'))}</h2>${pill(t('Sample data'), 'muted')}</div>
    <p class="small">${esc(t('Ranked by Retention Risk. Assigning a visit puts it on {name}\'s Today with the reason.', { name: data.rep.first }))}</p>
    <ul class="watch-list">${rows || `<li class="small muted">${esc(t('No {accounts} at risk.'))}</li>`}</ul></section>
  <section class="card" id="tier-changes"><div class="section-head"><h2>${esc(t('Tier changes to approve'))}</h2></div>
    <p class="small">${esc(t('Account Tiering proposes. A person approves. Cadence and the standard change from the next cycle.'))}</p>
    <ul class="watch-list">${tierRows || `<li class="small muted">${esc(t('No tier changes proposed.'))}</li>`}</ul></section>
  <section class="card" id="visits-by-tier"><h2>${esc(t('{Visits} against plan by tier'))}</h2><div class="facts">${byTier}</div>
    <p class="small muted">${esc(t('Done today out of planned. Overdue counts every {account} past its tier cycle.'))}</p></section>
  <section class="card" id="field-new"><h2>${esc(t('New {accounts} from the field'))}</h2>
    ${news.length ? `<ul class="bullets small">${news.map((n) => `<li><b>${esc(n.name)}</b> ${esc(t('{area}, provisional tier {tier}. Stage {s}: {stage}', { area: n.area, tier: n.tier, s: n.stage, stage: t(LIFE[n.stage - 1]) }))}</li>`).join('')}</ul>` : `<p class="small muted">${esc(t('None yet. The order-led {rep} adds them from the route.'))}</p>`}</section>
  <a class="btn secondary block" href="#/system" style="min-height:var(--tap)">${esc(t('How the eight capabilities work'))} ${icon('chevron', 14)}</a>`;
}
