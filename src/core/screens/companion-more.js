// Sales Companion, P1: wellbeing hub, complaint and feedback portal, travel planner with a mileage log,
// onboarding checklist with e-signature, call fundamentals library. Sample data. Not medical or counselling advice.

import { esc, icon, pill } from '../ui.js';
import { head } from './companion-ui.js';
import { createRng } from '../rng.js';
import { scheduleVisits } from '../../data/generate.js';
import { searchKnowledge } from '../companion/learning.js';
import { FATIGUE_MINUTES, BREAK_MINUTES } from '../companion/data.js';

const KM_TO_MI = 0.621371;
const dist = (ctx, km) => { const v = ctx.country.mileageUnit === 'mi' ? km * KM_TO_MI : km; return `${(Math.round(v * 10) / 10).toLocaleString(ctx.country.locale)} ${ctx.country.mileageUnit}`; };

// ---- Wellbeing hub ---------------------------------------------------------------
const MOODS = ['Great', 'Good', 'Okay', 'Low', 'Struggling'];
export function wellbeing(ctx) {
  const { t, cm, ui, persona, country, industry } = ctx;
  const mood = cm.s.wellbeing.mood;
  const r = createRng(`${industry.id}|${country.id}|wellbeing`);
  const team = MOODS.map((m, i) => ({ m, n: i < 2 ? r.int(0, 2) : i === 2 ? r.int(0, 1) : 0 }));
  const low = mood === 'Low' || mood === 'Struggling';
  const tips = [`Take a ${BREAK_MINUTES} minute break after about ${FATIGUE_MINUTES} minutes of driving.`, 'Drink water and eat at regular times, even on a full day.', 'Keep one buffer slot in the day for the unexpected.', 'Switch the phone to quiet for the last hour before sleep.', t('Say so early if a {visit} plan is too much. Your {manager} can re-plan it.')];
  return head(ctx, { title: 'Wellbeing hub', lead: 'A short daily check-in and a few practical tips. Sample content.' }) + `
  <div class="notice">${icon('flag', 18)}<span>This is not medical or counselling advice and it is not a support service. If you need help, talk to your ${esc(t('{manager}'))} or the support line your company provides.</span></div>
  <section class="card" data-card="checkin"><h2>How are you today?</h2>
    <div class="radios" role="radiogroup" aria-label="Check-in">${MOODS.map((m) => `<button class="seg${mood === m ? ' on' : ''}" style="min-height:48px;text-align:left" data-act="mood-set" data-m="${m}" role="radio" aria-checked="${mood === m}">${m}</button>`).join('')}</div>
    ${mood ? `<div class="notice ${low ? 'warn' : 'good'}" id="checkin-result" role="status">${icon(low ? 'heart' : 'check', 18)}<span>${low ? esc(t('Thank you for saying so. Talk to your {manager} or your company support line. Your answer is kept in this demo only.')) : 'Thanks for checking in. Your answer is kept in this demo only.'}</span></div>` : ''}
  </section>
  <section class="card"><h2>Tips for the day</h2><ul class="bullets">${tips.map((x) => `<li class="small">${esc(x)}</li>`).join('')}</ul>
    <a class="btn secondary sm" href="#/companion/journey">${icon('route', 18)}See the break prompt on today's route</a></section>
  ${persona !== 'rep' ? `<section class="card" id="team-checkins"><h2>Team check-ins this week</h2><p class="small muted">Sample and anonymous: counts only, no names.</p><ul class="kpi-list">${team.map((x) => `<li><span class="small">${x.m}</span><span class="kv"><b>${x.n}</b></span></li>`).join('')}</ul></section>` : ''}
  <p class="foot-note">Sample data.</p>`;
}

// ---- Complaint and feedback portal --------------------------------------------------
const TOPICS = ['Planning and routes', 'Pay and leave', 'Equipment and apps', 'Product or range', 'Customer issue', 'Something else'];
const KINDS = ['Complaint', 'Feedback', 'Idea'];
export function feedback(ctx) {
  const { t, cm, ui, persona } = ctx;
  const f = (ui.fb ||= { kind: 'Feedback', topic: TOPICS[0], text: '', anonymous: false, error: '', done: null });
  const list = (items, mgr) => items.map((x) => `<li class="row" data-feedback="${esc(x.id)}" data-status="${x.status}"><span class="row-main"><b>${esc(x.kind)}: ${esc(x.topic)}</b><small>${esc(x.rep)}</small><small>${esc(x.text)}</small>
    ${mgr && x.status === 'received' ? `<span class="btn-row" style="margin-top:8px"><button class="btn secondary sm" data-act="fb-ack" data-id="${esc(x.id)}">Acknowledge</button></span>` : ''}</span><span class="row-end">${pill(x.status === 'received' ? 'Received' : 'Acknowledged', x.status === 'received' ? 'warn' : 'good')}</span></li>`).join('');
  const sampleTeam = [{ id: 'FS1', kind: 'Idea', topic: TOPICS[0], rep: 'Anonymous', text: 'Group visits in the same area on the same day when two accounts are close.', status: (cm.s.fbAck || {}).FS1 ? 'acknowledged' : 'received' }];
  const mine = cm.s.complaints;
  const form = `<section class="card" data-card="fb-form"><h2>Send a message</h2>
    <label class="field">Type<select id="fb-kind" data-input="fb-field" data-field="kind">${KINDS.map((k) => `<option${f.kind === k ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
    <label class="field">Topic<select id="fb-topic" data-input="fb-field" data-field="topic">${TOPICS.map((k) => `<option${f.topic === k ? ' selected' : ''}>${esc(t(k))}</option>`).join('')}</select></label>
    <label class="field">What happened or what would help?<textarea class="input" id="fb-text" rows="4" maxlength="400" data-input="fb-field" data-field="text">${esc(f.text)}</textarea></label>
    <label class="radio"><input type="checkbox" id="fb-anon" data-change="fb-anon" ${f.anonymous ? 'checked' : ''}><span>Send without my name</span></label>
    ${f.error ? `<div class="notice warn" id="fb-error" role="alert">${icon('flag', 18)}<span>${esc(f.error)}</span></div>` : ''}
    ${f.done ? `<div class="notice good" id="fb-done" role="status">${icon('check', 18)}<span>${esc(f.done)}</span></div>` : ''}
    <button class="btn primary block" data-act="fb-submit" id="fb-submit">Send</button></section>`;
  return head(ctx, { title: 'Complaints and feedback', lead: 'Tell the team what is not working or what would help. You can send it without your name. Sample data.' }) + `
  ${persona === 'rep' ? form : ''}
  <section><h2>${persona === 'rep' ? 'Your messages' : 'Messages from the team'}</h2><ul class="group" style="margin-top:12px" id="fb-list">${list(persona === 'rep' ? mine : [...mine, ...sampleTeam], persona !== 'rep') || '<li class="empty">No messages yet.</li>'}</ul></section>
  <p class="foot-note">Sample data. Nothing is sent outside this page.</p>`;
}

// ---- Travel planner and mileage log ---------------------------------------------------
export function travel(ctx) {
  const { t, fmt, data, m, country, cm, ui } = ctx;
  const open = data.planned.filter((p) => !m.closedToday(p.accountId)).map((p) => p.accountId);
  const { stops } = scheduleVisits(open, data.byId, data.city, country);
  const logged = cm.s.mileage;
  const total = logged.reduce((s, x) => s + x.km, 0);
  const todayKm = stops.reduce((s, x) => s + x.km, 0);
  const trip = (ui.trip ||= { city: country.cities.find((c) => c.name !== data.city.name)?.name || country.cities[0].name, nights: 1, saved: null });
  const lodging = country.expenseLimits.lodging;
  const rows = stops.map((st) => `<li class="row"><span class="row-main"><b>${esc(data.byId[st.accountId].name)}</b><small>${esc(fmt.time(st.start))} · ${esc(dist(ctx, st.km))}</small></span></li>`).join('');
  return head(ctx, { title: 'Travel and mileage', lead: `Today's trips from the route plan, in ${country.mileageUnit === 'mi' ? 'miles' : 'kilometres'}, and a plan for an overnight trip. Sample data.` }) + `
  <section class="card tight"><div class="facts"><div><small>Today's route</small><b id="trip-today">${esc(dist(ctx, todayKm))}</b></div><div><small>In the mileage log</small><b id="trip-total">${esc(dist(ctx, total))}</b></div></div></section>
  <section><h2>Today's trips</h2><ul class="group" style="margin-top:12px">${rows || '<li class="empty">No trips on today\'s route.</li>'}</ul>
    <button class="btn primary block" style="margin-top:12px" data-act="trip-log" id="trip-log">Add today's trips to the mileage log</button>
    ${ui.tripMsg ? `<p class="small ok-text" id="trip-msg" role="status">${esc(ui.tripMsg)}</p>` : ''}</section>
  <section class="card"><h2>Overnight trip</h2>
    <label class="field">Destination<select id="trip-city" data-input="trip-field" data-field="city">${country.cities.map((c) => `<option${trip.city === c.name ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
    <label class="field">Nights<select id="trip-nights" data-input="trip-field" data-field="nights">${[1, 2, 3, 4].map((n) => `<option${Number(trip.nights) === n ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
    <p class="small muted" id="trip-estimate">Sample hotel limit: ${esc(fmt.price(lodging))} a night, ${esc(fmt.price(lodging * Number(trip.nights)))} in total.</p></section>
  <p class="foot-note">Sample data. Distances are straight-line estimates. Mileage is shown in ${country.mileageUnit === 'mi' ? 'miles' : 'kilometres'} for ${esc(country.name)}.</p>`;
}

// ---- Onboarding checklist with e-signature ---------------------------------------------
const STEPS = [
  ['expense', 'Read the expense policy summary', '#/companion/hr'],
  ['privacy', 'Complete the data privacy training', '#/companion/learning'],
  ['guard', 'Read the guardrails for the agents', '#/agents'],
  ['route', 'Look at today\'s route plan', '#/route'],
  ['meet', 'Meet your {manager}', null],
];
export function onboarding(ctx) {
  const { t, cm, ui, data } = ctx;
  const o = cm.s.onboarding;
  const done = STEPS.filter(([id]) => o.steps[id]).length;
  const ready = done === STEPS.length;
  const rows = STEPS.map(([id, label, href]) => `<li class="row" data-step="${id}"><label class="radio" style="border:0;padding:0;flex:1"><input type="checkbox" data-change="onb-step" data-id="${id}" ${o.steps[id] ? 'checked' : ''}><span>${esc(t(label))}</span></label>${href ? `<a class="btn text sm" href="${href}">Open</a>` : ''}</li>`).join('');
  const sign = o.signed ? `<div class="notice good" id="onb-signed">${icon('check', 18)}<span>Signed by ${esc(o.signed.name)} on ${esc(ctx.fmt.date(new Date(o.signed.date.replace(/-/g, '/'))))}.</span></div>`
    : `<p class="small">${esc(t('I have read the steps above and the guardrails for the agents.'))}</p>
      ${ready ? `<canvas class="sign" id="onb-pad" width="320" height="120" aria-label="Signature pad"></canvas>
      ${ui.onbError ? '<p class="small warn-text" id="onb-error">Sign in the box first.</p>' : ''}
      <div class="btn-row"><button class="btn secondary sm" data-act="onb-clear">Clear</button><button class="btn primary sm" data-act="onb-sign" id="onb-sign">Sign as ${esc(data.rep.name)}</button></div>` : '<p class="small muted" id="onb-wait">Finish every step to unlock the signature.</p>'}`;
  return head(ctx, { title: 'Onboarding checklist', lead: 'Five steps and an e-signature. Sample data and a demo signature, not a legal record.' }) + `
  <section class="card tight"><div class="stat-row"><span class="small muted">Progress</span><b>${done} of ${STEPS.length}</b></div><div class="bar"><span style="width:${(done / STEPS.length) * 100}%"></span></div></section>
  <ul class="group" id="onb-steps">${rows}</ul>
  <section class="card" id="onb-sign-card"><h2>Acknowledgement</h2>${sign}</section>
  <p class="foot-note">Sample data. The signature is kept on this page only.</p>`;
}

export function mountedOnboarding() {
  const pad = document.getElementById('onb-pad');
  if (!pad) return;
  const g = pad.getContext('2d');
  g.lineWidth = 2.2; g.lineCap = 'round'; g.strokeStyle = '#0f172a';
  let drawing = false;
  const pos = (e) => { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * (pad.width / r.width), (e.clientY - r.top) * (pad.height / r.height)]; };
  pad.addEventListener('pointerdown', (e) => { drawing = true; pad.setPointerCapture?.(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
  pad.addEventListener('pointermove', (e) => { if (!drawing) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); pad.dataset.signed = '1'; });
  pad.addEventListener('pointerup', () => { drawing = false; });
}

// ---- Call fundamentals library ----------------------------------------------------------
const STAGES = [
  ['Before the {visit}', ['Open the {visit} brief and read the top actions.', 'Check what was left open at the last {visit}.', 'Know the one thing you want to leave with.'], 'prepare brief plan'],
  ['Open', ['Greet the {contact} by name.', 'Say how long you need and keep to it.', 'Ask one question before you say anything about a {offering}.'], 'start greet time'],
  ['Find out', ['Listen more than you talk.', 'Write down what the {contact} says in their words.', 'Check the facts on the screen against what you see.'], 'check ask listen'],
  ['Show and agree', ['Use the source behind each point.', 'Agree one next step, not five.', 'Stay inside the guardrails for this pack.'], 'agree approved guardrail'],
  ['Close', ['Repeat what you agreed.', 'Confirm the date of the next {visit}.', 'Make sure the {contact} knows who to call.'], 'confirm next date'],
  ['After the {visit}', ['Record the outcomes and the evidence the same day.', 'Pass on anything you could not answer.', 'Send the {order} or proposal only once you have confirmed it.'], 'log record outcome'],
];
export function library(ctx) {
  const { t } = ctx;
  const cards = STAGES.map(([title, points, kw], i) => {
    const hit = searchKnowledge(ctx, kw)[0];
    return `<section class="card" data-stage="${i + 1}"><h2>${i + 1}. ${esc(t(title))}</h2><ul class="bullets">${points.map((p) => `<li class="small">${esc(t(p))}</li>`).join('')}</ul>
      ${hit ? `<p class="small muted">From your knowledge base: <a href="#/companion/learning" data-act="jump" data-id="kb">${esc(t(hit.e.title))}</a></p>` : ''}</section>`;
  }).join('');
  return head(ctx, { title: 'Call fundamentals', lead: 'Six steps for a good {visit}, with a pointer to your own knowledge base for each. Sample content.' }) + cards + '<p class="foot-note">Sample data.</p>';
}

// ---- Actions ---------------------------------------------------------------------------
export const actions = {
  'mood-set': ({ ctx, data }) => { ctx.cm.saveCheckin(data.m); },
  'fb-field': ({ ctx, data, value }) => { ((ctx.ui.fb ||= {}))[data.field] = value; return false; },
  'fb-anon': ({ ctx, el }) => { (ctx.ui.fb ||= {}).anonymous = el.checked; return false; },
  'fb-submit': ({ ctx }) => {
    const f = ctx.ui.fb;
    const get = (id, fb) => document.getElementById(id)?.value ?? fb;
    Object.assign(f, { kind: get('fb-kind', f.kind), topic: get('fb-topic', f.topic), text: get('fb-text', f.text), anonymous: document.getElementById('fb-anon')?.checked ?? f.anonymous });
    const r = ctx.cm.submitFeedback(f);
    f.error = r.ok ? '' : r.error;
    f.done = r.ok ? (f.anonymous ? 'Sent without your name.' : 'Sent. The team will acknowledge it.') : null;
    if (r.ok) f.text = '';
  },
  'fb-ack': ({ ctx, data }) => { ctx.cm.acknowledgeFeedback(data.id, ctx.persona); },
  'trip-log': ({ ctx }) => {
    const { data, m, country } = ctx;
    const open = data.planned.filter((p) => !m.closedToday(p.accountId)).map((p) => p.accountId);
    const { stops } = scheduleVisits(open, data.byId, data.city, country);
    const n = ctx.cm.logTrips(stops, country.mileageUnit);
    ctx.ui.tripMsg = n ? `Added ${n} trips to the mileage log.` : "Today's trips are already in the log.";
  },
  'trip-field': ({ ctx, data, value }) => {
    (ctx.ui.trip ||= {})[data.field] = value;
    const box = document.getElementById('trip-estimate');
    if (box) { const l = ctx.country.expenseLimits.lodging; box.textContent = `Sample hotel limit: ${ctx.fmt.price(l)} a night, ${ctx.fmt.price(l * Number(ctx.ui.trip.nights || 1))} in total.`; }
    return false;
  },
  'onb-step': ({ ctx, data, el }) => { ctx.cm.tickStep(data.id, el.checked); },
  'onb-clear': ({ ctx }) => { ctx.ui.onbError = false; },
  'onb-sign': ({ ctx }) => {
    const pad = document.getElementById('onb-pad');
    if (!pad || pad.dataset.signed !== '1') { ctx.ui.onbError = true; return; }
    ctx.ui.onbError = false;
    ctx.cm.signOnboarding(ctx.data.rep.name);
  },
};
void FATIGUE_MINUTES;
