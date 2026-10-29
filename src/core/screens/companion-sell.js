// Sales Companion, Growth: sell. Call plan, dynamic pitch, local overlay, customer value story and a
// clearly separate mock-up of the customer self-service view.
// Everything here reads the capabilities' outputs (ranked actions, KPIs, the order draft). Nothing is re-planned.

import { esc, icon, pill, confBadge } from '../ui.js';
import { head, accountOf, picker, powered } from './companion-ui.js';
import { buildPitch, buildStories } from '../companion/pitch.js';
import { checkRequest } from '../companion/claims.js';
import { nearby } from '../companion/data.js';
import { localPrice } from '../../data/generate.js';

// ---- Call plan -----------------------------------------------------------------
export function callplan(ctx, id) {
  const { t, fmt, m, industry } = ctx;
  const a = accountOf(ctx, id);
  const plan = m.plannedFor(a.id);
  const contact = a.contacts[0];
  const actions = (plan?.actions || []).slice(0, 3);
  const later = (plan?.actions || []).filter((x) => x.overBudget).length;
  const lines = plan ? m.orderLines(a.id) : [];
  const total = lines.reduce((s, l) => s + l.total, 0);
  const guard = actions[0] ? (industry.actions.find((x) => x.id === actions[0].defId).guardrail || industry.guardrails.find((g) => g.agent === actions[0].agent || g.agent === 'all').text) : null;
  return head(ctx, { title: 'Call plan', lead: 'A one-page summary of this {visit}, from the ranked actions and the {order} draft.' }) + `
  ${picker(ctx, 'callplan', a)}
  ${powered(ctx, ['ranking', 'planning'])}
  <section class="card" data-card="callplan">
    <div class="section-head"><h2>${esc(a.name)}</h2>${plan ? pill(`${esc(fmt.time(plan.start))}, ${a.visitMinutes} min`, 'info') : pill('Not on today\'s plan', 'muted')}</div>
    <p class="small muted">${esc(contact.name)}, ${esc(t(contact.role))}. ${esc(t(contact.preference))}.</p>
  </section>
  <section class="card"><h2>Goals for this ${esc(t('{visit}'))}</h2>
    ${actions.length ? `<ol class="why">${actions.map((x) => `<li><a href="#/action/${esc(x.id)}">${esc(t(x.title, x.vars))}</a><br><small>Est. ${esc(fmt.money(x.value))}, about ${x.effort} min. ${confBadge(x.confidence)}</small></li>`).join('')}</ol>${later ? `<p class="small muted">${later} more ${later === 1 ? 'action is' : 'actions are'} marked "If time allows".</p>` : ''}` : `<p class="small">${esc(t('No prepared actions for this {account} today.'))}</p>`}
  </section>
  <section class="card"><h2>${esc(t('{Order}'))} draft</h2>
    <p class="small">${lines.length ? `${lines.length} suggested lines. Priced lines total ${esc(fmt.money(total))}. Nothing is sent until you submit.` : 'No draft for this {account}.'}</p>
    <a class="btn secondary sm" href="#/order/${esc(a.id)}">${esc(t('Open the {order} builder'))}</a></section>
  ${guard ? `<div class="guardrail">${icon('shield', 20)}<span><b>Guardrail.</b> ${esc(t(guard))}</span></div>` : ''}
  <div class="stack">
    <a class="btn primary block" href="#/brief/${esc(a.id)}">${esc(t('Open the {visit} brief'))}</a>
    <a class="btn secondary block" href="#/companion/pitch/${esc(a.id)}">Dynamic pitch</a>
  </div>
  <p class="foot-note">Sample data. Values are estimates, not booked sales.</p>`;
}

// ---- Dynamic pitch ---------------------------------------------------------------
export function pitch(ctx, id) {
  const { t, ui } = ctx;
  const a = accountOf(ctx, id);
  const points = buildPitch(ctx, a);
  const mine = ((ui.pitchOwn ||= {})[a.id] ||= { points: [], text: '', refusal: null });
  const list = points.map((p) => `<li class="row" data-point="${esc(p.id)}"${p.withheld ? ' data-withheld="true"' : ''}><span class="row-main"><b class="small">${esc(p.text)}</b>
    <small data-source>Source: ${esc(p.sources.join('; '))}</small></span></li>`).join('');
  const own = mine.points.map((x, i) => `<li class="row" data-point="own${i}"><span class="row-main"><b class="small">${esc(x)}</b><small data-source>Source: your own point. It was checked against the restricted claims for this pack. It has not been checked against approved material.</small></span></li>`).join('');
  return head(ctx, { title: 'Dynamic pitch', lead: "Talking points from this {account}'s sample performance, the current range and the trend. Each shows its source." }) + `
  ${picker(ctx, 'pitch', a)}
  ${powered(ctx, ['potential', 'gaps'])}
  <ul class="group" id="pitch-points">${list}${own}</ul>
  <section class="card">
    <h2>Add your own point</h2>
    <label class="field">Your point<textarea class="input" id="pitch-own" rows="2" maxlength="240" data-input="pitch-draft" data-id="${esc(a.id)}">${esc(mine.text)}</textarea></label>
    <button class="btn secondary block" data-act="pitch-add" data-id="${esc(a.id)}" id="pitch-add">Check and add</button>
    ${mine.refusal ? `<div class="notice warn" id="pitch-refusal" role="alert">${icon('shield', 18)}<span>${esc(mine.refusal.text)}<br><small>Guardrail ${esc(mine.refusal.guardrailId)}: ${esc(mine.refusal.guardrailText)}</small></span></div>` : ''}
  </section>
  <div class="guardrail">${icon('shield', 20)}<span><b>Guardrails.</b> ${esc(ctx.industry.companion.guardrails.map((g) => t(g.text)).join(' '))}</span></div>
  <div class="stack"><a class="btn secondary block" href="#/companion/story/${esc(a.id)}">Customer value story</a>
    <a class="btn secondary block" href="#/companion/callplan/${esc(a.id)}">Call plan</a></div>
  <p class="foot-note">Sample data. Points come from templates and generated data, not a language model.</p>`;
}

// ---- Local overlay ----------------------------------------------------------------
export function local(ctx, id) {
  const { t, fmt } = ctx;
  const a = accountOf(ctx, id);
  const near = nearby(ctx, a, 6);
  const pts = [{ a, focus: true, share: a.current / a.potential }, ...near];
  const lat = pts.map((p) => (p.focus ? p.a.geo.lat : p.a.geo.lat)); const lng = pts.map((p) => p.a.geo.lng);
  const [la0, la1] = [Math.min(...lat), Math.max(...lat)]; const [ln0, ln1] = [Math.min(...lng), Math.max(...lng)];
  const W = 300; const H = 190; const pad = 22;
  const x = (v) => pad + ((v - ln0) / Math.max(1e-6, ln1 - ln0)) * (W - 2 * pad);
  const y = (v) => H - pad - ((v - la0) / Math.max(1e-6, la1 - la0)) * (H - 2 * pad);
  const dots = near.map((p, i) => `<g><circle cx="${x(p.a.geo.lng).toFixed(1)}" cy="${y(p.a.geo.lat).toFixed(1)}" r="9" fill="${p.share >= 0.65 ? 'var(--good)' : p.share >= 0.45 ? 'var(--muted)' : 'var(--warn)'}"/><text x="${x(p.a.geo.lng).toFixed(1)}" y="${(y(p.a.geo.lat) + 4).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${i + 1}</text></g>`).join('');
  const focus = `<circle cx="${x(a.geo.lng).toFixed(1)}" cy="${y(a.geo.lat).toFixed(1)}" r="12" fill="var(--accent)" stroke="#fff" stroke-width="3"/>`;
  const ranked = near.slice().sort((p, q) => q.share - p.share);
  const rows = ranked.map((p) => `<li><a class="row" href="#/account/${esc(p.a.id)}"><span class="rank sm">${near.indexOf(p) + 1}</span><span class="row-main"><b>${esc(p.a.name)}</b>
    <small>${esc(t(p.a.type))} · ${esc(fmt.distance(p.km))} away · Tier ${p.a.tier}</small>
    <span class="row-line"><small>${Math.round(p.share * 100)}% of potential · last ${esc(t('{order}'))} ${p.trend >= 0 ? 'up' : 'down'} ${Math.abs(p.trend)}%</small>${p.planned ? pill('On today\'s plan', 'info') : ''}</span></span></a></li>`).join('');
  return head(ctx, { title: 'Local overlay', lead: "The nearest {accounts} and how each is performing. Distances are straight-line estimates." }) + `
  ${picker(ctx, 'local', a)}
  ${powered(ctx, ['potential'])}
  <section class="card" data-card="map"><h2>Map (concept)</h2>
    <svg class="mini-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('Schematic map of the nearest {accounts}'))}"><rect width="${W}" height="${H}" rx="12" fill="var(--surface-inset)"/>${dots}${focus}</svg>
    <p class="small muted">Schematic only, not to scale. The large dot is ${esc(a.name)}. Green: at least 65% of potential. Grey: 45% to 64%. Amber: under 45%.</p></section>
  <section><h2>Nearby, best performing first</h2><ul class="group" style="margin-top:12px" id="nearby">${rows}</ul></section>
  <p class="foot-note">Sample data. Performance is share of estimated potential, from generated data.</p>`;
}

// ---- Customer value story ----------------------------------------------------------
export function story(ctx, id) {
  const { t, ui } = ctx;
  const a = accountOf(ctx, id);
  const stories = buildStories(ctx, a);
  const cur = stories.find((s) => s.id === ui.storyTpl) || stories[0];
  const tabs = stories.map((s) => `<button class="seg${s.id === cur.id ? ' on' : ''}" data-act="story-pick" data-id="${esc(s.id)}" role="tab" aria-selected="${s.id === cur.id}">${esc(s.title)}</button>`).join('');
  return head(ctx, { title: 'Customer value story', lead: "A short narrative in this {account}'s terms. The data used is shown under it." }) + `
  ${picker(ctx, 'story', a)}
  ${powered(ctx, ['potential'])}
  <div class="seg-ctl" role="tablist">${tabs}</div>
  <section class="card" data-card="story"><h2>${esc(cur.title)}</h2>
    <p id="story-text"${cur.withheld ? ' data-withheld="true"' : ''}>${esc(cur.text)}</p></section>
  <section class="card"><h2>Data used</h2><ul class="kpi-list" id="story-data">${cur.used.map((u) => `<li><span class="small">${esc(u.label)}<br><small>${esc(u.source)}</small></span><span class="kv"><b>${esc(u.value)}</b></span></li>`).join('')}</ul></section>
  <div class="guardrail">${icon('shield', 20)}<span><b>Guardrails.</b> ${esc(ctx.industry.companion.guardrails.map((g) => t(g.text)).join(' '))}</span></div>
  <p class="foot-note">Sample data. Estimates, not booked sales and not a promise of a result.</p>`;
}

// ---- Customer self-service (mock-up) -------------------------------------------------
const STEPS = ['Received', 'Confirmed', 'Packed', 'On the way', 'Delivered'];
export function selfservice(ctx, id) {
  const { t, fmt, industry, country, cm, ui } = ctx;
  const a = accountOf(ctx, id);
  const seg = industry.segments.find((s) => s.id === a.segmentId);
  const items = industry.offerings.filter((o) => (!o.segments || o.segments.includes(seg.id)) && o.price > 0 && !o.kind).slice(0, 4);
  const q = ((ui.mock ||= {})[a.id] ||= {});
  const placed = cm.s.mock[a.id];
  const total = items.reduce((s, o) => s + (q[o.id] || 0) * localPrice(o.price, country), 0);
  const rows = items.map((o) => `<li class="line" data-mock-line="${esc(o.id)}"><b>${esc(t(o.name))}</b>
    <small>${esc(t(o.category))} · ${esc(fmt.price(localPrice(o.price, country)))} per ${esc(t(o.unit))}</small>
    <div class="line-foot"><div class="stepper" role="group" aria-label="${esc(`Quantity of ${t(o.name)}`)}">
      <button class="step" data-act="mock-qty" data-id="${esc(a.id)}" data-o="${esc(o.id)}" data-d="-1" aria-label="Less" ${placed || !(q[o.id] > 0) ? 'disabled' : ''}>−</button><span class="qty">${q[o.id] || 0}</span>
      <button class="step" data-act="mock-qty" data-id="${esc(a.id)}" data-o="${esc(o.id)}" data-d="1" aria-label="More" ${placed ? 'disabled' : ''}>+</button></div></div></li>`).join('');
  const track = placed ? `<ol class="track" id="mock-track">${STEPS.map((s, i) => `<li class="${i <= placed.step ? 'on' : ''}"${i === placed.step ? ' aria-current="step"' : ''}><span>${i < placed.step ? icon('check', 14) : i + 1}</span>${esc(s)}</li>`).join('')}</ol>
    <div class="btn-row"><button class="btn secondary sm" data-act="mock-advance" data-id="${esc(a.id)}" ${placed.step >= STEPS.length - 1 ? 'disabled' : ''}>Show the next tracking step</button><button class="btn secondary sm" data-act="mock-reset" data-id="${esc(a.id)}">Start again</button></div>` : '';
  return head(ctx, { title: 'Customer self-service view', lead: 'A mock-up of what the {account} could see. It is not part of the {rep} app.' }) + `
  ${picker(ctx, 'selfservice', a)}
  ${powered(ctx, ['order'])}
  <div class="mock-frame" data-region="mockup">
    <div class="mock-banner">${icon('flag', 16)} Mock-up. Not a working customer portal.</div>
    <div class="mock-body">
      <h2>${esc(a.name)}</h2>
      <p class="small muted">${esc(t('Browse, order and track. Prices are the list prices in this scenario. Lines priced by people are not shown.'))}</p>
      <ul class="group" style="margin:12px 0">${rows || '<li class="empty">No self-service lines for this segment.</li>'}</ul>
      <div class="total-line"><span class="small muted">Total</span><b id="mock-total">${esc(fmt.money(total))}</b></div>
      ${placed ? `<div class="notice good" id="mock-placed">${icon('check', 18)}<span>Mock ${esc(t('{order}'))} placed for ${esc(fmt.money(placed.total))}. Nothing was sent.</span></div>` : `<button class="btn primary block" data-act="mock-place" data-id="${esc(a.id)}" id="mock-place" ${total > 0 ? '' : 'disabled'}>Place mock ${esc(t('{order}'))}</button>`}
      ${track}
    </div>
  </div>
  <p class="foot-note">Sample data. The mock-up writes nothing outside this page.</p>`;
}

// ---- Actions -----------------------------------------------------------------------
export const actions = {
  'pitch-draft': ({ ctx, data, value }) => { ((ctx.ui.pitchOwn ||= {})[data.id] ||= { points: [], text: '' }).text = value.slice(0, 240); return false; },
  'pitch-add': ({ ctx, data }) => {
    const mine = ((ctx.ui.pitchOwn ||= {})[data.id] ||= { points: [], text: '' });
    const text = (document.getElementById('pitch-own')?.value ?? mine.text).trim().slice(0, 240);
    mine.text = text;
    if (!text) { mine.refusal = null; return; }
    const r = checkRequest(ctx, text);
    if (r) { mine.refusal = r; return; }
    mine.refusal = null;
    mine.points.push(text);
    mine.text = '';
  },
  'story-pick': ({ ctx, data }) => { ctx.ui.storyTpl = data.id; },
  'mock-qty': ({ ctx, data }) => { const q = ((ctx.ui.mock ||= {})[data.id] ||= {}); q[data.o] = Math.max(0, Math.min(99, (q[data.o] || 0) + Number(data.d))); },
  'mock-place': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const seg = ctx.industry.segments.find((s) => s.id === a.segmentId);
    const q = (ctx.ui.mock || {})[data.id] || {};
    const total = ctx.industry.offerings.filter((o) => (!o.segments || o.segments.includes(seg.id)) && o.price > 0 && !o.kind).slice(0, 4).reduce((s, o) => s + (q[o.id] || 0) * localPrice(o.price, ctx.country), 0);
    if (total > 0) ctx.cm.s.mock[data.id] = { step: 0, total };
  },
  'mock-advance': ({ ctx, data }) => { const p = ctx.cm.s.mock[data.id]; if (p && p.step < STEPS.length - 1) p.step++; },
  'mock-reset': ({ ctx, data }) => { delete ctx.cm.s.mock[data.id]; ctx.ui.mock[data.id] = {}; },
};
