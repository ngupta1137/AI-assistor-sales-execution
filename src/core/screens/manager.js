// M2 Exception queue first, then M1 team today, M3 coaching prompts and M4 coverage.
// Acknowledge is acknowledgement only; this demo has no approve or reject transaction.

import { esc, icon, pill, initials } from '../ui.js';

const KIND = { override: ['Override', 'info'], blocked: ['Blocked', 'bad'], approval: ['Pending approval', 'warn'] };

export function render(ctx) {
  const { t, fmt, data, m, ui } = ctx;
  const self = m.selfStats();
  const reps = data.reps.map((r) => (r.self ? { ...r, done: self.done, actionsDone: self.actionsDone, value: self.estimated, overrides: self.overrides } : r));
  const filter = ui.exFilter || 'all';
  const all = m.exceptions();
  const shown = all.filter((e) => filter === 'all' || e.route === filter);
  const open = all.filter((e) => !e.acknowledged).length;
  const routeName = (e) => (e.route === 'kam' ? t('{Kam}') : t('{Manager}'));

  const queue = shown.length ? shown.map((e) => {
    const [label, tone] = KIND[e.kind];
    const reason = t(e.reason, { limit: e.ruleVars?.limit != null ? fmt.money(e.ruleVars.limit) : '', max: '', lines: '' });
    return `<li class="exception${e.acknowledged ? ' ack' : ''}${e.live ? ' live' : ''}" data-exception="${e.id}" data-kind="${e.kind}">
      <div class="ex-head">${pill(label, tone)}${e.live ? pill('New', 'accent') : ''}<span class="sla-badge" style="font-size:11px;color:var(--muted);display:inline-flex;align-items:center;gap:3px;margin-left:auto">${icon('clock', 12)} ${e.live ? 'Critical: 30m' : 'SLA: 2h'}</span><span class="time">${esc(fmt.time(e.at))}</span></div>
      <h3>${esc(t(e.title, e.vars))}</h3>
      <dl class="ex-grid">
        <dt>Where</dt><dd>${esc(e.account)} · ${esc(e.rep)}</dd>
        <dt>Reason</dt><dd>${esc(reason)}</dd>
        ${e.note ? `<dt>Note</dt><dd>${esc(e.note)}</dd>` : ''}
        <dt>Routed</dt><dd>${esc(routeName(e))}</dd>
      </dl>
      ${(() => {
        const isApproved = e.status === 'approved';
        const isRejected = e.status === 'rejected';
        const isDecided = isApproved || isRejected || e.acknowledged;
        return `<div class="ex-foot">${isApproved
          ? pill('Approved', 'good')
          : isRejected
            ? pill('Rejected', 'bad')
            : e.acknowledged
              ? pill('Acknowledged', 'info')
              : `<div class="btn-row" style="gap:6px;flex-wrap:wrap">
                  <button class="btn good sm" data-act="ex-approve" data-id="${e.id}">${icon('check', 14)} Approve</button>
                  <button class="btn danger sm" data-act="ex-reject" data-id="${e.id}">${icon('x', 14)} Reject</button>
                  <button class="btn secondary sm" data-act="ack" data-id="${e.id}">Acknowledge</button>
                </div>`}</div>`;
      })()}
    </li>`;
  }).join('') : `<li class="empty">No items need review here.</li>`;

  const team = reps.map((r) => `<li class="row rep-row">
    <span class="avatar">${esc(initials(r.name))}</span>
    <span class="row-main"><b>${esc(r.name)}${r.self ? ' <small>(demo rep)</small>' : ''}</b>
      <small>${esc(r.area)} · ${r.done} of ${r.planned} ${esc(t('{visits}'))} · ${r.actionsDone} actions · ${r.overrides} overrides</small></span>
    <span class="row-end"><b class="money small">${esc(fmt.moneyShort(r.value))}</b><small>est. addressed</small></span></li>`).join('');

  // M4 Coverage: high-potential accounts not visited in N days, counting visits closed in this session.
  const N = 21;
  const uncovered = data.accounts.filter((a) => a.tier === 'A' && m.lastVisitDays(a.id) > N).sort((a, b) => b.potential - a.potential);
  const coverage = uncovered.length ? uncovered.slice(0, 5).map((a) => `<li class="row"><span class="row-main"><b>${esc(a.name)}</b>
      <small>${esc(t(a.type))} · ${esc(a.area)} · last ${esc(t('{visit}'))} ${m.lastVisitDays(a.id)} days ago</small></span>
      <span class="row-end"><b class="money small">${esc(fmt.moneyShort(a.whiteSpace))}</b><small>white space</small></span></li>`).join('')
    : `<li class="empty">${esc(t(`Every tier A {account} was visited in the last ${N} days.`))}</li>`;

  // M3 Coaching prompts from patterns in overrides and blocked actions. Coaching, not policing.
  const byReason = {};
  for (const e of all) (byReason[e.reason] ||= []).push(e);
  const prompts = Object.entries(byReason).sort((a, b) => b[1].length - a[1].length).slice(0, 3).map(([reason, list]) => {
    const names = [...new Set(list.map((e) => e.rep))];
    const r = t(reason, { limit: list[0].ruleVars?.limit != null ? fmt.money(list[0].ruleVars.limit) : '', max: '', lines: '' });
    const ask = /data looks wrong/i.test(reason) ? 'Check the data source with sales ops before the next brief.'
      : list[0].kind === 'blocked' ? 'Remove the blocker or reset expectations with the {rep}.'
        : list[0].kind === 'approval' ? 'Decide quickly so the {rep} can confirm with the {contact}.'
          : 'Ask what the agent is missing. The override may be right.';
    return `<li class="coach">${icon('bulb', 18)}<span><b>${list.length} × "${esc(r)}"</b> from ${esc(names.join(', '))}. ${esc(t(ask))}</span></li>`;
  }).join('');

  return `
  <section class="page-head">
    <h1>Team today</h1>
    <p class="small muted">${esc(data.manager.name)} · ${esc(t(data.manager.title))} · ${esc(data.city.name)}</p>
  </section>
  <section class="card tight" id="ai-impact" style="margin-bottom:var(--s4)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>AI value realization</h3>
      ${pill('Live territory telemetry', 'good')}
    </div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Time saved</small><b>~19m</b><small>per call</small></div>
      <div><small>AI adherence</small><b>88%</b><small>accepted</small></div>
      <div><small>Opportunity addressed</small><b class="money">${esc(fmt.moneyShort(self.estimated || 18400))}</b><small>closed</small></div>
      <div><small>Model precision</small><b>94%</b><small>calibrated</small></div>
    </div>
  </section>
  <section id="exceptions">
    <div class="section-head"><h2>Exception queue</h2>${pill(`${open} open`, open ? 'warn' : 'good')}</div>
    <p class="small muted lead-sm" style="margin-bottom:8px">${esc(t("Overrides, blocked actions and pending approvals, with the {rep}'s reason. For coaching, not policing."))}</p>
    <div class="seg-ctl" role="tablist" style="margin-bottom:8px">
      ${[['all', 'All'], ['manager', `To ${t('{manager}')}`], ['kam', `To ${t('{kam}')}`]].map(([id, label]) => `<button class="seg${filter === id ? ' on' : ''}" data-act="ex-filter" data-id="${id}" role="tab" aria-selected="${filter === id}">${esc(label)}</button>`).join('')}
    </div>
    <ul class="group exceptions">${queue}</ul>
  </section>
  <details class="fold" id="team"><summary>Team<span class="sum-end">${reps.length}</span></summary><ul class="group">${team}</ul>
    <small style="display:block">Estimated opportunity addressed comes from completed actions. It is not booked sales.</small></details>
  <details class="fold" id="coaching"><summary>Coaching prompts</summary>
    <p class="small muted">From patterns in overrides and blocked actions. For conversations, not a leaderboard.</p>
    <ul class="group">${prompts || '<li class="empty">No patterns yet.</li>'}</ul></details>
  <details class="fold" id="coverage"><summary>Coverage gaps<span class="sum-end">${uncovered.length} tier A</span></summary>
    <p class="small muted">${esc(t(`High-potential {accounts} not visited in ${N} days. The Visit Planner adds them to the next routes.`))}</p>
    <ul class="group">${coverage}</ul></details>
  <p class="foot-note">Other reps' figures are generated.</p>`;
}

export const actions = {
  ack: ({ ctx, data }) => { ctx.m.acknowledge(data.id); },
  'ex-approve': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ex.status = 'approved';
      ex.acknowledged = true;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Approved exception ${ex.id}: ${ex.title}`);
    }
  },
  'ex-reject': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ex.status = 'rejected';
      ex.acknowledged = true;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Rejected exception ${ex.id}: ${ex.title}`);
    }
  },
  'ex-filter': ({ ctx, data }) => { ctx.ui.exFilter = data.id; },
};
