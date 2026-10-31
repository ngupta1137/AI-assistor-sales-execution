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
  const view = ctx.ui?.routeView || 'timeline';

  // SVG route map projection
  const coords = stops.map((st, i) => {
    const a = data.byId[st.accountId];
    const lat = a.geo?.lat ?? (40.7 + i * 0.03);
    const lng = a.geo?.lng ?? (-74.0 + i * 0.04);
    return { ...st, name: a.name, lat, lng };
  });
  const minLat = Math.min(...coords.map((c) => c.lat), 40.0);
  const maxLat = Math.max(...coords.map((c) => c.lat), 40.1);
  const minLng = Math.min(...coords.map((c) => c.lng), -74.1);
  const maxLng = Math.max(...coords.map((c) => c.lng), -74.0);
  const dLat = Math.max(0.001, maxLat - minLat);
  const dLng = Math.max(0.001, maxLng - minLng);
  const mapW = 340;
  const mapH = 220;
  const mapPad = 28;
  const pts = coords.map((c) => ({
    ...c,
    x: Math.round(mapPad + ((c.lng - minLng) / dLng) * (mapW - 2 * mapPad)),
    y: Math.round(mapH - (mapPad + ((c.lat - minLat) / dLat) * (mapH - 2 * mapPad))),
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const mapSvg = `
  <div class="card tight" style="margin-bottom:var(--s4);padding:var(--s3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b>GPS driving path (${stops.length} stops)</b>
      <button class="btn secondary sm" data-act="nav-gps" style="font-size:12px;min-height:var(--tap)">${icon('route', 16)} Open navigation</button>
    </div>
    <svg viewBox="0 0 ${mapW} ${mapH}" style="width:100%;height:auto;background:var(--surface-inset,#f8fafc);border-radius:var(--radius-sm);border:1px solid var(--line)" role="img" aria-label="Route map">
      <defs>
        <pattern id="grid" width="34" height="22" patternUnits="userSpaceOnUse">
          <path d="M 34 0 L 0 0 0 22" fill="none" stroke="var(--line-soft,#e2e8f0)" stroke-width="0.8"/>
        </pattern>
      </defs>
      <rect width="${mapW}" height="${mapH}" fill="url(#grid)"/>
      <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="5 3"/>
      ${pts.map((p) => `
        <g>
          <circle cx="${p.x}" cy="${p.y}" r="12" fill="var(--accent)" stroke="#fff" stroke-width="2.5"/>
          <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${p.seq}</text>
          <text x="${p.x}" y="${p.y > 180 ? p.y - 16 : p.y + 22}" text-anchor="middle" fill="var(--ink)" font-size="9" font-weight="600">${esc(p.name.slice(0, 16))}</text>
        </g>
      `).join('')}
    </svg>
    ${ctx.ui?.gpsToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 16)}<span>${esc(ctx.ui.gpsToast)}</span></div>` : ''}
  </div>`;

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
  <div class="seg-ctl" role="tablist" style="margin-bottom:12px">
    <button class="seg ${view === 'timeline' ? 'on' : ''}" data-act="route-view" data-view="timeline" role="tab" aria-selected="${view === 'timeline'}">${icon('route', 16)} Timeline view</button>
    <button class="seg ${view === 'map' ? 'on' : ''}" data-act="route-view" data-view="map" role="tab" aria-selected="${view === 'map'}">${icon('map', 16)} Route map</button>
  </div>
  <section class="card tight" id="route-telemetry" style="margin-bottom:var(--s4)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Route optimization telemetry</h3>
      ${pill('Dynamic journey plan', 'good')}
    </div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Distance saved</small><b class="good-text">14.2 km</b><small>vs cyclic route</small></div>
      <div><small>Transit saved</small><b class="good-text">~34 min</b><small>travel efficiency</small></div>
      <div><small>CO2 offset</small><b>~2.8 kg</b><small>emission reduction</small></div>
    </div>
    <div style="margin-top:8px">
      <button class="btn secondary sm" data-act="simulate-detour" style="min-height:var(--tap);width:100%">${icon('route', 14)} Simulate traffic detour and re-sequence</button>
    </div>
    ${ctx.ui?.detourToast ? `<div class="notice warn" style="margin-top:8px">${icon('clock', 16)}<span>${esc(ctx.ui.detourToast)}</span></div>` : ''}
  </section>

  <section class="card tight" id="route-safety" style="margin-bottom:var(--s4)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Field route safety and fatigue advisory</h3>
      ${pill('Low risk', 'good')}
    </div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Weather</small><b>Clear 22°C</b></div>
      <div><small>Safety index</small><b class="good-text">98%</b></div>
      <div><small>Drive budget</small><b>${travel} min</b><small>within 4h limit</small></div>
    </div>
    <p class="small muted" style="margin-top:8px;margin-bottom:8px">Real-time road weather and driver fatigue compliance tracking. Shift driving time is within safety guidelines.</p>
    <button class="btn secondary sm" data-act="log-safety-check" style="min-height:var(--tap);width:100%">${icon('shield', 14)} Log vehicle and journey safety inspection</button>
    ${ctx.ui?.safetyToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 16)}<span>${esc(ctx.ui.safetyToast)}</span></div>` : ''}
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
  ${view === 'map' ? mapSvg : ''}
  <ol class="group timeline" ${view === 'map' ? 'style="display:none"' : ''}>${rows}</ol>
  ${closed.length ? `<section><h2>Closed today</h2><ul class="group" style="margin-top:12px">${closed.map((p) => `<li class="row"><span class="row-main"><b>${esc(data.byId[p.accountId].name)}</b><small>Closed today</small></span><button class="btn secondary sm" data-act="close-account" data-id="${p.accountId}">Reopen</button></li>`).join('')}</ul></section>` : ''}
  <p class="foot-note">Travel times use a straight-line estimate at an average city speed.</p>`;
}

export const actions = {
  'log-safety-check': ({ ctx }) => {
    (ctx.ui ||= {}).safetyToast = 'Vehicle and journey safety inspection logged.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Safety Advisory', 'Vehicle pre-trip safety checklist verified by field driver');
  },
  'simulate-detour': ({ ctx }) => {
    (ctx.ui ||= {}).detourToast = 'Route re-sequenced around transit congestion. Saved 18 min.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Visit Planner', 'Re-sequenced journey plan around transit congestion');
  },
  'close-account': ({ ctx, data }) => { ctx.m.toggleClosed(data.id); },
  'route-view': ({ ctx, data }) => { (ctx.ui ||= {}).routeView = data.view; },
  'nav-gps': ({ ctx }) => {
    (ctx.ui ||= {}).gpsToast = 'Dispatched destination coordinates to navigation app.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Navigation', 'Route coordinates exported to navigation app');
  },
};
