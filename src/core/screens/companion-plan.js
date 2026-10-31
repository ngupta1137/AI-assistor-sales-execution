// Sales Companion, Growth: plan. Journey planning with a safety strip, the pre-call brief card,
// the voice debrief (simulation) and live resource planning for managers.
// The Companion consumes the Visit Planner, the brief and the gaps. It builds no second route or brief.

import { esc, icon, pill } from '../ui.js';
import { head, accountOf, picker, powered } from './companion-ui.js';
import { scheduleVisits } from '../../data/generate.js';
import { safetyFor, sentimentFor, FATIGUE_MINUTES, BREAK_MINUTES, ACTIVATION_SHARE } from '../companion/data.js';
import { parseDebrief, sampleDictation } from '../companion/voice.js';

// ---- Journey planning ------------------------------------------------------
export function journey(ctx) {
  const { t, fmt, data, m, country } = ctx;
  const open = data.planned.filter((p) => !m.closedToday(p.accountId)).map((p) => p.accountId);
  const { stops } = scheduleVisits(open, data.byId, data.city, country);
  const saf = safetyFor(ctx, stops);
  const travel = stops.reduce((s, x) => s + x.travelMin, 0);
  const km = stops.reduce((s, x) => s + x.km, 0);
  const alerts = saf.alerts.map((a) => `<div class="notice ${a.tone === 'warn' ? 'warn' : ''}">${icon(a.tone === 'warn' ? 'flag' : 'clock', 18)}<span>${esc(a.text)}</span></div>`).join('');
  const rows = saf.legs.map((l) => {
    const a = data.byId[l.accountId];
    return `<li class="stop" data-leg="${esc(a.id)}"><span class="rank${l.seq === 1 ? ' first' : ''}">${l.seq}</span>
      <span class="row-main"><b>${esc(a.name)}</b>
        <small>${esc(fmt.time(l.start))} to ${esc(fmt.time(l.end))} · ${a.visitMinutes} min</small>
        <span class="travel">${icon('route', 16)} ${l.travelMin} min, ${esc(fmt.distance(l.km))} · ${l.drive} min of driving so far</span>
        <span class="btn-row" style="margin-top:8px">${pill(`${l.level} traffic${l.delay ? `, about +${l.delay} min` : ''}`, l.level === 'Heavy' ? 'warn' : 'muted')}${l.fatigue ? pill(`Break advised: ${BREAK_MINUTES} min`, 'info') : ''}</span>
        <span class="btn-row" style="margin-top:8px"><a class="btn secondary sm" href="#/companion/precall/${esc(a.id)}">Pre-call brief</a></span></span></li>`;
  }).join('');
  return head(ctx, { title: 'Journey planning', lead: "Today's route from the Visit Planner, with a safety strip. Weather and traffic are live estimations." }) + `
  ${powered(ctx, ['planning'])}
  <section class="card" id="safety-strip" data-region="safety">
    <div class="section-head"><h2>Safety strip</h2>${pill(`${saf.weather.label}, ${saf.weather.temp}°${saf.weather.unit}`, 'info')}</div>
    <p class="small muted">Fatigue prompt after ${FATIGUE_MINUTES} minutes of driving. Total driving today: about ${saf.totalDrive} minutes.</p>
    ${alerts || '<p class="small">No alerts for today.</p>'}
  </section>
  <section class="card tight"><div class="facts">
    <div><small>${esc(t('{Visits}'))}</small><b>${stops.length}</b></div>
    <div><small>Travel</small><b>${travel} min</b><small>${esc(fmt.distance(km))}</small></div>
  </div></section>
  <section><h2>Route</h2><ol class="group timeline" style="margin-top:12px">${rows || `<li class="empty">${esc(t('No open {visits} on today\'s route.'))}</li>`}</ol></section>
  <a class="btn secondary block" href="#/route">${icon('route', 20)}Open the route plan</a>
  <p class="foot-note">The Companion shows the Visit Planner's route and does not plan its own.</p>`;
}

// ---- Pre-call brief card -----------------------------------------------------
export function precall(ctx, id) {
  const { t, fmt, m, data } = ctx;
  const a = accountOf(ctx, id);
  const plan = m.plannedFor(a.id);
  const sent = sentimentFor(ctx, a);
  const last = a.history.slice(0, 2).map((h) => `<li><b>${esc(fmt.date(fmt.dayOffset(-h.daysAgo)))}</b> <span class="small">${esc(t(h.note, h.vars))}</span></li>`).join('');
  const open = plan ? m.openGaps(a.id).slice(0, 3) : [];
  const live = m.exceptions().filter((e) => e.live && e.account === a.name && !e.acknowledged);
  const issues = [
    ...open.map((g) => `<li><a href="#/action/${esc(g.id)}">${esc(t(g.title, g.vars))}</a></li>`),
    ...live.map((e) => `<li>${esc(t(e.title, e.vars))} <span class="small muted">(waiting in the exception queue)</span></li>`),
  ].join('');
  const contact = a.contacts[0];
  const top = plan?.actions[0];
  return head(ctx, { title: 'Pre-call brief', lead: 'A short card to read before you go in. The full brief stays on the {visit} brief screen.' }) + `
  ${picker(ctx, 'precall', a)}
  ${powered(ctx, ['gaps', 'ranking'])}
  <section class="card" data-card="precall">
    <div class="section-head"><h2>${esc(a.name)}</h2>${pill(`Sentiment: ${sent.label}`, sent.tone)}</div>
    <p class="small muted">${esc(contact.name)}, ${esc(t(contact.role))}. ${esc(t(contact.preference))}.</p>
    <details><summary>Why this sentiment tag</summary><ul class="bullets" style="margin-top:8px">${sent.reasons.map((r) => `<li class="small">${esc(t(r))}</li>`).join('')}</ul><p class="small muted">Rule-based on generated data. It is not a prediction.</p></details>
  </section>
  <section class="card"><h2>Last actions</h2><ul class="bullets">${last}</ul></section>
  <section class="card"><h2>Open issues</h2>${issues ? `<ul class="bullets">${issues}</ul>` : `<p class="small">${esc(t('No open gaps on this {account}.'))}</p>`}</section>
  ${top ? `<section class="card"><h2>Do first</h2><p class="small">${esc(t(top.title, top.vars))}</p><p class="small muted">Estimated ${esc(fmt.money(top.value))}, about ${top.effort} minutes. An estimate, not booked sales.</p></section>` : ''}
  <div class="stack">
    <a class="btn primary block" href="#/brief/${esc(a.id)}">${esc(t('Open the {visit} brief'))}</a>
    <a class="btn secondary block" href="#/companion/callplan/${esc(a.id)}">Call plan</a>
    <a class="btn secondary block" href="#/account/${esc(a.id)}">${esc(t('Open this {account}'))}</a>
  </div>`;
}

// ---- Voice debrief (simulation) ---------------------------------------------
const speech = () => (typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null);
let recognition = null;

export function debrief(ctx, id) {
  const { t, ui, cm } = ctx;
  const a = accountOf(ctx, id);
  const d = (ui.deb ||= {})[a.id] || (ui.deb[a.id] = { text: '', parsed: null, saved: false, micError: '' });
  const saved = cm.s.debriefs[a.id];
  const can = !!speech();
  const p = d.parsed;
  const review = p ? `
  <section class="card" id="deb-review" data-card="review">
    <div class="section-head"><h2>Review and confirm</h2>${pill('Check each field', 'info')}</div>
    <p class="small muted">The rules found ${p.sentences} sentence${p.sentences === 1 ? '' : 's'}. Change anything that is wrong.</p>
    <label class="field">Outcome
      <select id="deb-outcome" data-change="deb-outcome" data-id="${esc(a.id)}">${['Positive', 'Neutral', 'Negative'].map((o) => `<option${p.outcome === o ? ' selected' : ''}>${o}</option>`).join('')}</select></label>
    <label class="field">Issues, one per line<textarea class="input" id="deb-issues" rows="3" data-input="deb-field" data-id="${esc(a.id)}" data-field="issues">${esc(p.issues)}</textarea></label>
    <label class="field">Follow-ups, one per line<textarea class="input" id="deb-follow" rows="3" data-input="deb-field" data-id="${esc(a.id)}" data-field="followUps">${esc(p.followUps)}</textarea></label>
    <label class="radio"><input type="checkbox" id="deb-order" data-change="deb-order" data-id="${esc(a.id)}" ${p.orderIntent ? 'checked' : ''}><span>${esc(t('{Order} intent: the {contact} plans to order'))}</span></label>
    ${p.orderLines ? `<p class="small muted">${esc(t('{Offerings} heard'))}: ${esc(p.orderLines)}</p>` : ''}
    <button class="btn primary block" data-act="deb-confirm" data-id="${esc(a.id)}" id="deb-confirm">Confirm and save</button>
  </section>` : '';
  const done = saved ? `
  <section class="card" id="deb-saved" data-card="saved"><div class="notice good">${icon('check', 18)}<span>Debrief saved. Outcome: ${esc(saved.outcome)}. ${saved.issues.length} issue${saved.issues.length === 1 ? '' : 's'}, ${saved.followUps.length} follow-up${saved.followUps.length === 1 ? '' : 's'}${saved.orderIntent ? `. ${esc(t('{Order} intent recorded'))}` : ''}.</span></div>
    <div class="btn-row">${saved.orderIntent ? `<a class="btn secondary sm" href="#/order/${esc(a.id)}">${esc(t('Open the {order} builder'))}</a>` : ''}<a class="btn secondary sm" href="#/complete/${esc(a.id)}">${esc(t('Finish the {visit}'))}</a></div></section>` : '';
  return head(ctx, { title: 'Voice debrief', lead: 'Say or type what happened. Simple rules turn it into fields for you to confirm.' }) + `
  ${picker(ctx, 'debrief', a)}
  <div class="notice" id="deb-sim">${icon('flag', 18)}<span>This is a simulation. It uses simple keyword rules, not a speech or language model. Confirm every field before saving.</span></div>
  <section class="card">
    <label class="field">What happened?<textarea class="input" id="deb-text" rows="5" maxlength="1200" data-input="deb-draft" data-id="${esc(a.id)}" placeholder="Type or dictate your notes">${esc(d.text)}</textarea></label>
    <div class="btn-row">
      ${can ? `<button class="btn secondary" data-act="comp-mic" data-id="${esc(a.id)}" id="deb-mic" aria-pressed="${!!d.mic}">${icon('mic', 20)}${d.mic ? 'Stop microphone' : 'Start microphone'}</button>` : ''}
      <button class="btn secondary" data-act="deb-sample" data-id="${esc(a.id)}" id="deb-sample">Play demo dictation</button>
    </div>
    <p class="small muted" id="deb-mic-note">${can ? 'The microphone uses your browser\'s speech service. Depending on the browser, your audio may be sent to the browser maker. Use demo dictation or type if you prefer.' : 'The microphone is not available in this browser. Type your notes or play demo dictation.'}</p>
    ${d.micError ? `<p class="small warn-text" role="status">${esc(d.micError)}</p>` : ''}
    <button class="btn primary block" data-act="deb-review" data-id="${esc(a.id)}" id="deb-review-btn" ${d.text.trim() ? '' : 'disabled'}>Review fields</button>
    ${!d.text.trim() ? '<p class="small muted">Add some notes or play demo dictation to continue.</p>' : ''}
  </section>
  ${review}${done}
  <p class="foot-note">Nothing leaves this page except audio, if you choose the microphone.</p>`;
}

// ---- Live resource planning (manager) ----------------------------------------
export function resources(ctx) {
  const { t, fmt, comp } = ctx;
  const plans = comp.plans.map((p) => {
    const gaps = p.rows.filter((r) => r.gap > 0);
    const rows = p.rows.filter((r) => r.need > 0 || r.gap > 0).map((r) => `<li class="row" data-week="${r.week}" data-gap="${r.gap > 0}">
      <span class="row-main"><b>Week of ${esc(fmt.dateShort(r.start))}</b><small>Needs ${r.need} rep-days. Team can give ${r.capacity}.</small>
      ${r.cover.length ? `<ul class="bullets small" style="margin-top:6px">${r.cover.map((c) => `<li>${esc(c.text)}</li>`).join('')}</ul>` : ''}</span>
      <span class="row-end">${r.gap > 0 ? pill(`Gap ${r.gap} days`, 'warn') : pill('Covered', 'good')}</span></li>`).join('');
    return `<section class="card flush" data-plan="${esc(p.id)}"><div class="section-head" style="padding:16px 16px 0"><h2>${esc(ctx.t(p.name))}</h2>${gaps.length ? pill(`${gaps.length} week${gaps.length > 1 ? 's' : ''} short`, 'warn') : pill('Covered', 'good')}</div>
      <ul class="group" style="border:0;border-radius:0">${rows}</ul></section>`;
  }).join('');
  const team = comp.team.map((r) => `<tr><td>${esc(r.name)}${r.self ? ' <small>(you)</small>' : ''}</td>${r.weeks.slice(0, 4).map((w) => `<td>${w.days}</td>`).join('')}</tr>`).join('');
  return head(ctx, { title: 'Live resource planning', lead: 'Compare upcoming activations with team availability by week. A manager view.' }) + `
  ${powered(ctx, ['planning'])}
  <div class="notice">${icon('flag', 18)}<span>Activation plans and team availability. The team can give about ${Math.round(ACTIVATION_SHARE * 100)}% of its free days to an activation in this view.</span></div>
  ${plans}
  <section class="card"><h2>Team days free</h2><p class="small muted">Working days left after leave, public holidays and training, for the next four weeks.</p>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('{Rep}'))}</th>${comp.team[0].weeks.slice(0, 4).map((w) => `<th>${esc(fmt.dateShort(w.start))}</th>`).join('')}</tr></thead><tbody>${team}</tbody></table></div></section>
  <p class="foot-note">Cover suggestions are examples, not bookings.</p>`;
}

// ---- Actions -----------------------------------------------------------------
const toLines = (arr) => arr.join('\n');
const fromLines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

export const actions = {
  'comp-account': ({ data, value, api }) => { api.navigate(`#/companion/${data.view}/${value}`); return 'nav'; },
  'deb-draft': ({ ctx, data, value }) => { ((ctx.ui.deb ||= {})[data.id] ||= { text: '' }).text = value.slice(0, 1200); const b = document.getElementById('deb-review-btn'); if (b) b.disabled = !value.trim(); return false; },
  'deb-sample': ({ ctx, data }) => { const a = ctx.data.byId[data.id]; const d = ((ctx.ui.deb ||= {})[data.id] ||= {}); d.text = sampleDictation(ctx, a); d.parsed = null; d.micError = ''; },
  'deb-review': ({ ctx, data }) => {
    const d = ctx.ui.deb[data.id];
    const r = parseDebrief(ctx, d.text);
    d.parsed = { sentences: r.sentences, outcome: r.outcome.label, issues: toLines(r.issues), followUps: toLines(r.followUps.map((f) => (f.when ? `${f.text} (${f.when})` : f.text))), orderIntent: r.order.intent, orderLines: r.order.lines.join(', ') };
  },
  'deb-outcome': ({ ctx, data, value }) => { ctx.ui.deb[data.id].parsed.outcome = value; return false; },
  'deb-order': ({ ctx, data, el }) => { ctx.ui.deb[data.id].parsed.orderIntent = el.checked; return false; },
  'deb-field': ({ ctx, data, value }) => { ctx.ui.deb[data.id].parsed[data.field] = value; return false; },
  'deb-confirm': ({ ctx, data }) => {
    const p = ctx.ui.deb[data.id].parsed;
    ctx.cm.saveDebrief(data.id, { outcome: p.outcome, issues: fromLines(p.issues), followUps: fromLines(p.followUps), orderIntent: p.orderIntent, lines: p.orderLines });
  },
  'comp-mic': ({ ctx, data, api }) => {
    const d = ((ctx.ui.deb ||= {})[data.id] ||= { text: '' });
    const R = speech();
    if (!R) { d.micError = 'The microphone is not available in this browser.'; return; }
    if (recognition) { try { recognition.stop(); } catch { /* already stopped */ } recognition = null; d.mic = false; return; }
    try {
      recognition = new R();
      recognition.lang = /^en/.test(ctx.country.locale) ? ctx.country.locale : 'en-US';
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.onresult = (e) => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) d.text = `${d.text} ${e.results[i][0].transcript}`.trim().slice(0, 1200); api.render(); };
      recognition.onerror = (e) => { d.micError = e.error === 'not-allowed' ? 'Microphone permission was not given. Type your notes or use demo dictation.' : 'The microphone stopped. Type your notes or use demo dictation.'; d.mic = false; recognition = null; api.render(); };
      recognition.onend = () => { d.mic = false; recognition = null; api.render(); };
      d.micError = '';
      recognition.start();
      d.mic = true;
    } catch { d.micError = 'The microphone could not start. Type your notes or use demo dictation.'; d.mic = false; recognition = null; }
  },
};
