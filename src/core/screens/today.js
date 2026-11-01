// R1 Today: next brief first, then the month, then today's accounts ranked by estimated opportunity.
// Month actual comes from source data only. Completed actions are shown as an estimate, never added to actuals.

import { esc, icon, pill, bar, kpiValue, AGENT_LABEL } from '../ui.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function render(ctx) {
  const { t, fmt, data, m, industry } = ctx;
  const today = fmt.today;
  const ordered = data.planned.slice().sort((a, b) => a.rank - b.rank);
  const totalActions = ordered.reduce((s, p) => s + p.actions.length, 0);
  const pending = ordered.reduce((s, p) => s + m.counts(p.accountId).pending, 0);
  const done = ordered.filter((p) => m.visitDone(p.accountId)).length;
  const next = m.nextAccount(null);
  const nextAcc = data.byId[(next || ordered[0]).accountId];
  const kpi = industry.kpis.find((k) => k.id === data.territory.headlineKpi.id);
  const stopped = data.agents.filter((a) => m.agentStopped(a.id));
  const tr = data.territory;
  const self = m.selfStats();
  const pct = Math.round((tr.achieved / tr.target) * 100);

  const rows = ordered.map((p) => {
    const a = data.byId[p.accountId];
    const c = m.counts(p.accountId);
    const isDone = m.visitDone(p.accountId);
    const status = isDone ? pill('Done', 'good')
      : m.closedToday(p.accountId) ? pill('Closed today', 'muted')
        : c.pending === 0 ? pill('Reviewed', 'info') : pill(`${c.pending} to review`, 'warn');
    return `<li><a class="row acc-row${isDone ? ' done' : ''}" href="#/brief/${a.id}" data-account="${a.id}">
      <span class="rank${p.rank === 1 ? ' first' : ''}">${p.rank}</span>
      <span class="row-main">
        <b>${esc(a.name)}</b>
        <small>${esc(fmt.time(p.start))} · ${esc(t(a.type))} · ${esc(fmt.distance(p.km))}</small>
        <span class="row-line"><span class="small">Est. <b class="money">${esc(fmt.moneyShort(p.opportunity))}</b> · ${p.actions.length} actions</span>${status}</span>
      </span>
    </a></li>`;
  }).join('');

  const unplanned = data.accounts.filter((a) => !data.planned.some((p) => p.accountId === a.id)).slice(0, 3);
  const adhocModal = ctx.ui?.adhocOpen ? `
  <div class="presenter-backdrop" data-act="close-adhoc" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="adhoc-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="adhoc-title">${icon('route', 18)} Add ad-hoc customer drop-in</h2>
        <small>Select an unscheduled account in your territory to insert into today's journey.</small>
      </div>
      <button class="icon-btn" data-act="close-adhoc" aria-label="Close dialog">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <ul class="group list">
        ${unplanned.map((acc) => `<li class="row" style="flex-direction:column;align-items:stretch">
          <div style="display:flex;align-items:center"><span class="row-main"><b>${esc(acc.name)}</b>
            <small>${esc(t(acc.type))} · Tier ${acc.tier} · ${esc(acc.area)}</small></span>
            <span class="row-end"><b class="money small">${esc(fmt.moneyShort(acc.potential))}</b><small>annual potential</small></span>
          </div>
          <div style="margin-top:6px;display:flex;justify-content:flex-end">
            <button class="btn primary sm" data-act="add-adhoc-stop" data-id="${acc.id}" style="min-height:var(--tap)">Add to today</button>
          </div>
        </li>`).join('')}
      </ul>
      <button class="btn secondary block" data-act="close-adhoc" style="min-height:var(--tap)">Cancel</button>
    </div>
  </section>` : '';

  return `${adhocModal}
  ${ctx.ui?.todayToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ctx.ui.todayToast)}</span></div>` : ''}
  <section class="page-head">
    <h1>${greeting()}, ${esc(data.rep.first)}</h1>
    <p class="muted">${esc(fmt.weekday(today))} ${esc(fmt.dateShort(today))} · ${esc(data.city.name)} · ${ordered.length} ${esc(t('{visits}'))} planned</p>
  </section>

  ${stopped.length ? `<div class="notice warn">${icon('stop', 18)}<span>${esc(stopped.map((a) => AGENT_LABEL[a.id]).join(', '))} stopped. Its items are paused in every brief.</span></div>` : ''}

  <section class="hero">
    <div class="hero-top">
      <span class="hero-ic">${icon('agent', 22)}</span>
      <span class="row-main"><b>Briefs ready</b>
      <small>${esc(t(`${ordered.length} {visit} briefs, ${totalActions} ranked actions, prepared overnight by 3 agents.`))}</small></span>
      ${pill(`${pending} to review`, pending ? 'warn' : 'good')}
    </div>
    <a class="btn primary block" href="#/brief/${nextAcc.id}" id="overnight-banner">${esc(t(`Open next brief: ${nextAcc.name}`))}${icon('chevron', 18)}</a>
  </section>

  <div class="quick tight">
    <a class="btn secondary" href="#/route" id="open-route">${icon('route', 20)}Route plan</a>
    <a class="btn secondary" href="#/ask" id="open-ask">${icon('ask', 20)}Ask AI</a>
  </div>
  <button class="btn secondary sm" data-act="open-adhoc" style="min-height:var(--tap);margin-bottom:var(--s3);width:100%">${icon('route', 16)} Log ad-hoc customer drop-in</button>

  <section class="card tight">
    <div class="stat-row"><span class="small muted">Month to date</span><span class="small"><b class="money">${esc(fmt.moneyShort(tr.achieved))}</b> of ${esc(fmt.moneyShort(tr.target))} · ${pct}%</span></div>
    ${bar(tr.achieved, tr.target)}
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:6px;border-top:1px solid var(--line-soft)">
      <small class="muted" style="display:flex;align-items:center;gap:4px">${icon('agent', 14)} AI Confidence: 88% avg</small>
      <small class="muted" style="display:flex;align-items:center;gap:4px">${icon('clock', 14)} ~19m prep saved</small>
    </div>
    <small>${done} of ${ordered.length} ${esc(t('{visits}'))} recorded · ${self.actionsDone} actions done</small>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center">
      <span class="small muted">${icon('clock', 12)} Shift finish: 17:15 (On track)</span>
      <button class="btn secondary sm" data-act="time-crunch" style="min-height:var(--tap);font-size:11px">${icon('route', 12)} Re-balance for time crunch</button>
    </div>
  </section>

  <section>
    <div class="section-head"><h2>${esc(t("Today's {accounts}"))}</h2><small>Ranked by estimated opportunity</small></div>
    <ol class="group list">${rows}</ol>
  </section>

  <details class="fold" id="territory">
    <summary>${esc(t('{Territory}'))}<span class="sum-end">${esc(kpiValue(kpi, tr.headlineKpi.value, fmt))}</span></summary>
    <div class="facts">
      <div><small>${esc(t(kpi.label))}</small><b>${esc(kpiValue(kpi, tr.headlineKpi.value, fmt))}</b><small>Target ${esc(kpiValue(kpi, kpi.target, fmt))}</small></div>
      <div><small>Untapped potential</small><b>${esc(fmt.moneyShort(tr.opportunity))}</b><small>${esc(t(`Across ${data.accounts.length} {accounts}`))}</small></div>
      ${self.estimated ? `<div class="wide"><small>Estimated opportunity addressed today</small><b>${esc(fmt.moneyShort(self.estimated))}</b><small>An estimate from completed actions. Not booked sales, and not added to the month figure.</small></div>` : ''}
    </div>
  </details>
  <p class="foot-note">Values are generated for this demo.</p>`;
}

export const actions = {
  'time-crunch': ({ ctx }) => {
    (ctx.ui ||= {}).todayToast = 'Re-balanced journey itinerary. Saved 35 minutes to preserve shift finish time.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Visit Planner', 'Re-balanced itinerary for time crunch; deferred non-critical tasks');
  },
  'open-adhoc': ({ ctx }) => { (ctx.ui ||= {}).adhocOpen = true; },
  'close-adhoc': ({ ctx }) => { (ctx.ui ||= {}).adhocOpen = false; },
  'add-adhoc-stop': ({ ctx, data }) => {
    const acc = ctx.data.byId[data.id];
    if (acc) {
      const exists = ctx.data.planned.some((p) => p.accountId === acc.id);
      if (!exists) {
        ctx.data.planned.push({
          accountId: acc.id,
          rank: ctx.data.planned.length + 1,
          km: 1.8,
          opportunity: Math.round(acc.potential / 12),
          start: 16 * 60,
          end: 17 * 60,
          actions: [],
          brief: [],
          order: [],
        });
      }
      (ctx.ui ||= {}).todayToast = `Added ${acc.name} to today's journey plan.`;
      ctx.ui.adhocOpen = false;
      if (ctx.m?.logAudit) ctx.m.logAudit('Visit Planner', `Rep added ad-hoc stop for ${acc.name} to today's route`);
    }
  },
};
