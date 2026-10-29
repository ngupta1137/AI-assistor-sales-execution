// R8 Route plan: today's visits in driving order with travel and time budget.
// Marking an account closed re-plans the rest with the same Visit Planner rules.

import { esc, icon, pill } from '../ui.js';
import { scheduleVisits } from '../../data/generate.js';

export function render(ctx) {
  const { t, fmt, data, m } = ctx;
  const open = data.planned.filter((p) => !m.closedToday(p.accountId)).map((p) => p.accountId);
  const { stops, dropped } = scheduleVisits(open, data.byId, data.city, ctx.country);
  const closed = data.planned.filter((p) => m.closedToday(p.accountId));
  const travel = stops.reduce((s, x) => s + x.travelMin, 0);
  const km = stops.reduce((s, x) => s + x.km, 0);
  const budget = stops.reduce((s, x) => s + data.byId[x.accountId].visitMinutes, 0);
  const end = stops.length ? stops.at(-1).end : 0;

  const rows = stops.map((st) => {
    const a = data.byId[st.accountId];
    const done = m.visitDone(a.id);
    return `<li class="stop${done ? ' done' : ''}" data-stop="${a.id}">
      <span class="rank${st.seq === 1 ? ' first' : ''}">${st.seq}</span>
      <span class="row-main"><b>${esc(a.name)}</b>
        <small>${esc(fmt.time(st.start))} to ${esc(fmt.time(st.end))} · ${a.visitMinutes} min</small>
        <span class="travel">${icon('route', 16)} ${st.travelMin} min, ${esc(fmt.distance(st.km))} from the previous stop</span>
        <span class="btn-row" style="margin-top:8px">${done ? pill('Done', 'good') : `<a class="btn secondary sm" href="#/brief/${a.id}">Open brief</a><button class="btn secondary sm" data-act="close-account" data-id="${a.id}">Mark closed today</button>`}</span></span>
    </li>`;
  }).join('');

  return `
  <a class="back" href="#/today">${icon('back', 18)} Today</a>
  <section class="page-head">
    <h1>Route plan</h1>
    <p class="small muted">${esc(t('Time order from the Visit Planner, by opening hours and travel. Today ranks by estimated opportunity.'))}</p>
  </section>
  <section class="card tight" id="route-summary">
    <div class="facts">
      <div><small>${esc(t('{Visits}'))}</small><b data-route="stops">${stops.length}</b></div>
      <div><small>Day ends</small><b>${stops.length ? esc(fmt.time(end)) : '-'}</b></div>
      <div><small>Travel</small><b>${travel} min</b><small>${esc(fmt.distance(km))}</small></div>
      <div><small>With ${esc(t('{accounts}'))}</small><b>${budget} min</b></div>
    </div>
  </section>
  ${closed.length ? `<div class="notice warn" id="replanned">${icon('route', 18)}<span>${esc(t(`Route updated without ${closed.map((p) => data.byId[p.accountId].name).join(', ')}.`))}</span></div>` : ''}
  ${dropped.length ? `<div class="notice warn">${icon('clock', 18)}<span>${esc(t(`${dropped.length} {accounts} no longer fit before closing and move to tomorrow.`))}</span></div>` : ''}
  <ol class="group timeline">${rows}</ol>
  ${closed.length ? `<section><h2>Closed today</h2><ul class="group" style="margin-top:12px">${closed.map((p) => `<li class="row"><span class="row-main"><b>${esc(data.byId[p.accountId].name)}</b><small>Closed today</small></span><button class="btn secondary sm" data-act="close-account" data-id="${p.accountId}">Reopen</button></li>`).join('')}</ul></section>` : ''}
  <p class="foot-note">Sample data. Travel times use a straight-line estimate at an average city speed.</p>`;
}

export const actions = {
  'close-account': ({ ctx, data }) => { ctx.m.toggleClosed(data.id); },
};
