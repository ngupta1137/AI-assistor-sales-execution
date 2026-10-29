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
  <p class="foot-note">Sample data. Other reps' figures are generated.</p>`;
}

export const actions = {
  ack: ({ ctx, data }) => { ctx.m.acknowledge(data.id); },
  'ex-filter': ({ ctx, data }) => { ctx.ui.exFilter = data.id; },
};
