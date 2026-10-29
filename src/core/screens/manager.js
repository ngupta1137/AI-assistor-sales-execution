// M1 Team today and M2 exception queue: overrides, blocked actions and approvals, each with its reason and route.

import { esc, icon, pill, initials } from '../ui.js';

const KIND = { override: ['Override', 'bad'], blocked: ['Blocked', 'warn'], approval: ['Needs approval', 'info'] };

export function render(ctx) {
  const { t, fmt, data, m, ui } = ctx;
  const self = m.selfStats();
  const reps = data.reps.map((r) => (r.self ? { ...r, done: self.done, actionsDone: self.actionsDone, value: self.value, overrides: self.overrides } : r));
  const filter = ui.exFilter || 'all';
  const all = m.exceptions();
  const shown = all.filter((e) => filter === 'all' || e.route === filter);
  const open = all.filter((e) => !e.acknowledged).length;

  const team = reps.map((r) => `<li class="row static rep-row">
    <span class="avatar sm">${esc(initials(r.name))}</span>
    <span class="row-main"><b>${esc(r.name)}${r.self ? ' <small class="muted">(demo rep)</small>' : ''}</b><small>${esc(r.area)}</small>
      <small class="row-meta">${r.done} of ${r.planned} ${esc(t('{visits}'))} · ${r.actionsDone} actions · ${r.overrides} overrides</small></span>
    <span class="row-end"><b class="money">${esc(fmt.moneyShort(r.value))}</b><small class="muted">captured</small></span></li>`).join('');

  const routeName = (e) => (e.route === 'kam' ? t('{Kam}') : t('{Manager}'));
  const queue = shown.length ? shown.map((e) => {
    const [label, tone] = KIND[e.kind];
    const reason = t(e.reason, { limit: e.ruleVars?.limit != null ? fmt.money(e.ruleVars.limit) : '', max: '', lines: '' });
    return `<li class="exception${e.acknowledged ? ' ack' : ''}${e.live ? ' live' : ''}" data-exception="${e.id}" data-kind="${e.kind}">
      <div class="ex-head">${pill(label, tone)}${e.live ? pill('New', 'accent') : ''}<small class="muted">${esc(fmt.time(e.at))}</small></div>
      <b>${esc(t(e.title, e.vars))}</b>
      <small>${esc(e.account)} · ${esc(e.rep)}</small>
      <p class="ex-reason"><span class="muted">Reason:</span> ${esc(reason)}</p>
      ${e.note ? `<p class="small">Note: ${esc(e.note)}</p>` : ''}
      <div class="ex-foot"><small>${icon('flag', 14)} Routed to ${esc(routeName(e))}</small>
      ${e.acknowledged ? pill('Acknowledged', 'good') : `<button class="btn ghost sm" data-act="ack" data-id="${e.id}">Acknowledge</button>`}</div>
    </li>`;
  }).join('') : '<li class="empty">Nothing here.</li>';

  // M4 Coverage: high-potential accounts not visited in N days.
  const N = 21;
  const uncovered = data.accounts.filter((a) => a.tier === 'A' && a.lastVisitDays > N).sort((a, b) => b.potential - a.potential);
  const coverage = uncovered.length ? uncovered.slice(0, 5).map((a) => `<li class="row static"><span class="row-main"><b>${esc(a.name)}</b>
      <small>${esc(t(a.type))} · ${esc(a.area)} · last ${esc(t('{visit}'))} ${a.lastVisitDays} days ago</small></span>
      <span class="row-end"><b class="money">${esc(fmt.moneyShort(a.whiteSpace))}</b><small class="muted">white space</small></span></li>`).join('')
    : `<li class="empty">${esc(t(`Every tier A {account} was visited in the last ${N} days.`))}</li>`;

  // M3 Coaching prompts from patterns in overrides and blocked actions. Coaching, not policing.
  const byReason = {};
  for (const e of all) { const k = e.reason; (byReason[k] ||= []).push(e); }
  const prompts = Object.entries(byReason).sort((a, b) => b[1].length - a[1].length).slice(0, 3).map(([reason, list]) => {
    const reps = [...new Set(list.map((e) => e.rep))];
    const r = t(reason, { limit: list[0].ruleVars?.limit != null ? fmt.money(list[0].ruleVars.limit) : '', max: '', lines: '' });
    const ask = /data looks wrong/i.test(reason) ? 'Check the data source with sales ops before the next brief.'
      : list[0].kind === 'blocked' ? 'Remove the blocker or reset expectations with the {rep}.'
        : list[0].kind === 'approval' ? 'Decide quickly so the {rep} can confirm with the {contact}.'
          : 'Ask what the agent is missing. The override may be right.';
    return `<li class="coach">${icon('bulb', 18)}<span><b>${list.length} × "${esc(r)}"</b> from ${esc(reps.join(', '))}. ${esc(t(ask))}</span></li>`;
  }).join('');

  return `
  <section class="hello">
    <h1>Team today</h1>
    <p class="muted">${esc(data.manager.name)} · ${esc(t(data.manager.title))} · ${esc(data.city.name)}</p>
  </section>
  <section><ul class="list">${team}</ul></section>
  <section id="exceptions">
    <div class="section-head"><h2>Exception queue</h2>${pill(`${open} open`, open ? 'warn' : 'good')}</div>
    <p class="small muted">Overrides and blocked actions come here with the ${esc(t('{rep}'))}'s reason. Use them to coach, not to police.</p>
    <div class="seg-ctl" role="tablist">
      ${[['all', 'All'], ['manager', `To ${t('{manager}')}`], ['kam', `To ${t('{kam}')}`]].map(([id, label]) => `<button class="seg${filter === id ? ' on' : ''}" data-act="ex-filter" data-id="${id}" role="tab" aria-selected="${filter === id}">${esc(label)}</button>`).join('')}
    </div>
    <ul class="exceptions">${queue}</ul>
  </section>
  <section id="coaching"><h2>Coaching prompts</h2>
    <p class="small muted">From patterns in overrides and blocked actions. For conversations, not a leaderboard.</p>
    <ul class="list">${prompts}</ul></section>
  <section id="coverage"><div class="section-head"><h2>Coverage gaps</h2>${pill(`${uncovered.length} tier A`, uncovered.length ? 'warn' : 'good')}</div>
    <p class="small muted">${esc(t(`High-potential {accounts} not visited in ${N} days. The Visit Planner adds them to the next routes.`))}</p>
    <ul class="list">${coverage}</ul></section>
  <p class="foot-note">Sample data. Other reps' figures are generated.</p>`;
}

export const actions = {
  ack: ({ ctx, data }) => { ctx.m.acknowledge(data.id); },
  'ex-filter': ({ ctx, data }) => { ctx.ui.exFilter = data.id; },
};
