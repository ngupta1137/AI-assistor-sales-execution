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
    return `<li class="row static route-stop${done ? ' done' : ''}" data-stop="${a.id}">
      <span class="rank sm">${st.seq}</span>
      <span class="row-main"><b>${esc(a.name)}</b>
        <small>${esc(fmt.time(st.start))} to ${esc(fmt.time(st.end))} · ${a.visitMinutes} min budget</small>
        <small class="row-meta">${icon('route', 14)} ${st.travelMin} min, ${esc(fmt.distance(st.km))} from the previous stop</small></span>
      <span class="row-end">${done ? pill('Done', 'good') : `<button class="btn ghost sm" data-act="close-account" data-id="${a.id}">Closed today</button>`}</span>
    </li>`;
  }).join('');

  return `
  <a class="back" href="#/today">${icon('back', 18)} Today</a>
  <section class="hello">
    <h1>Route plan</h1>
    <p class="muted">${esc(t('Ordered by the Visit Planner for opening hours and travel. The ranking on Today is by value.'))}</p>
  </section>
  <section class="cards3 card" id="route-summary">
    <div><small>${esc(t('{Visits}'))}</small><b data-route="stops">${stops.length}</b></div>
    <div><small>Travel</small><b>${travel} min</b><small>${esc(fmt.distance(km))}</small></div>
    <div><small>Day ends</small><b>${stops.length ? esc(fmt.time(end)) : '-'}</b><small>${budget} min with ${esc(t('{accounts}'))}</small></div>
  </section>
  ${closed.length ? `<div class="notice warn" id="replanned">${icon('route', 18)} ${esc(t(`Re-planned without ${closed.map((p) => data.byId[p.accountId].name).join(', ')}.`))}</div>` : ''}
  ${dropped.length ? `<div class="notice warn">${esc(t(`${dropped.length} {accounts} no longer fit before closing and move to tomorrow.`))}</div>` : ''}
  <ol class="list">${rows}</ol>
  ${closed.length ? `<section><h2>Closed today</h2><ul class="list">${closed.map((p) => `<li class="row static"><span class="row-main"><b>${esc(data.byId[p.accountId].name)}</b></span><button class="btn ghost sm" data-act="close-account" data-id="${p.accountId}">Reopen</button></li>`).join('')}</ul></section>` : ''}
  <p class="foot-note">Sample data. Travel times use a straight-line estimate at an average city speed.</p>`;
}

export const actions = {
  'close-account': ({ ctx, data }) => { ctx.m.toggleClosed(data.id); },
};
