// R4 Action detail and R6 evidence capture: why it matters, value, effort, confidence,
// talking points, guardrail, typed evidence, and the outcome (done, or not done with a reason).

import { esc, icon, pill, confBadge, AGENT_LABEL, EVIDENCE } from '../ui.js';

const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

function evidenceBlock(ctx, it, def) {
  const { t, fmt, m } = ctx;
  const ev = m.outcome(it.id)?.evidence;
  const type = def.evidence;
  const meta = EVIDENCE[type];
  let body;
  if (type === 'photo') {
    body = ev ? `<div class="photo-ph" role="img" aria-label="Demo photo placeholder">${icon('camera', 28)}<span>Demo capture at ${esc(fmt.time(ev.at))}. No image is stored.</span></div>`
      : `<button class="btn secondary block" data-act="ev-photo" data-id="${it.id}">${icon('camera', 20)}Take photo (demo)</button>`;
  } else if (type === 'scan') {
    body = ev ? `<div class="evidence-tile done">${icon('scan', 20)}<span class="small">Scanned ${esc(ev.code)} at ${esc(fmt.time(ev.at))} (demo capture)</span></div>`
      : `<button class="btn secondary block" data-act="ev-scan" data-id="${it.id}">${icon('scan', 20)}Scan barcode (demo)</button>`;
  } else if (type === 'signature') {
    body = ev ? `<div class="evidence-tile done">${icon('pen', 20)}<span class="small">Signed by ${esc(ev.by)} at ${esc(fmt.time(ev.at))}</span></div>`
      : `<p class="small">${esc(t('Ask {person} to sign in the box.', it.vars))}</p>
        <canvas class="sign" id="sign-pad" width="320" height="120" aria-label="Signature pad"></canvas>
        <div class="btn-row"><button class="btn secondary sm" data-act="ev-sign-clear">Clear</button>
        <button class="btn primary sm" data-act="ev-sign-save" data-id="${it.id}" id="sign-save">Save signature</button></div>
        ${ctx.ui.signError ? '<p class="small warn-text">Sign in the box first.</p>' : ''}`;
  } else {
    body = ev ? `<div class="evidence-tile done">${icon('note', 20)}<span class="small">Note saved: ${esc(ev.text)}</span></div>`
      : `<label class="field">What happened?<textarea class="input" rows="3" maxlength="300" id="ev-note-text"></textarea></label>
        <button class="btn secondary block" data-act="ev-note" data-id="${it.id}">${icon('note', 20)}Save note</button>`;
  }
  return `<section class="card" id="evidence">
    <div class="section-head"><h2>Evidence</h2>${ev ? pill(`${meta.label} recorded`, 'good') : pill(`${meta.label} required`, 'warn')}</div>
    ${body}</section>`;
}

export function render(ctx, [id]) {
  const { t, fmt, data, m, industry, ui } = ctx;
  const it = m.findAction(id);
  if (!it || it.kind !== 'action') {
    return `<a class="back" href="#/today">${icon('back', 18)} Today</a><div class="empty">${esc(t('This action is not on today\'s plan.'))}</div>`;
  }
  const def = industry.actions.find((x) => x.id === it.defId);
  const a = data.byId[it.accountId];
  const v = it.vars;
  const out = m.outcome(it.id);
  const ev = out?.evidence;
  const guard = def.guardrail || (industry.guardrails.find((g) => g.agent === it.agent) || industry.guardrails[0]).text;
  const d = m.decision(it.id);
  const why = [t(it.saw, v), ...def.why.map((w) => t(w, v))];

  let status = pill('No outcome recorded', 'muted');
  let dock;
  if (out?.status === 'done') {
    status = pill('Done', 'good');
    dock = `<button class="btn secondary block" data-act="outcome-reset" data-id="${it.id}">Change outcome</button>`;
  } else if (out?.status === 'not_done') {
    status = pill(`Not done: ${t(out.reason)}`, 'bad');
    dock = `<button class="btn secondary block" data-act="outcome-reset" data-id="${it.id}">Change outcome</button>`;
  } else if (ui.notDone === it.id) {
    dock = `<button class="btn secondary block" data-act="outcome-cancel">Cancel</button>`;
  } else {
    dock = `${ev ? '' : `<p class="small muted">Add the ${esc(EVIDENCE[def.evidence].label.toLowerCase())} to mark this done.</p>`}
      <div class="btn-row" style="flex-wrap:nowrap">
        <button class="btn secondary" style="flex:1" data-act="outcome-not" data-id="${it.id}" id="mark-not-done">Not done</button>
        <button class="btn primary" style="flex:1" data-act="outcome-done" data-id="${it.id}" id="mark-done" ${ev ? '' : 'disabled'}>${icon('check', 20)}Mark done</button>
      </div>`;
  }
  const reasons = ui.notDone === it.id && !out?.status ? `<fieldset class="radios"><legend class="small" style="margin-bottom:8px">Why was it not done?</legend>${industry.outcomeReasons.map((r) => `
      <label class="radio"><input type="radio" name="nd-${it.id}" value="${esc(r.label)}" data-change="outcome-reason" data-id="${it.id}"><span>${esc(t(r.label))}${r.blocked ? ' <small>(goes to your manager)</small>' : ''}</span></label>`).join('')}</fieldset>` : '';

  const html = `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="page-head">
    <span class="eyebrow">${esc(t(it.type))} · ${esc(AGENT_LABEL[it.agent])}</span>
    <h1>${esc(t(it.title, v))}</h1>
    <p class="small muted">${esc(a.name)} · ${esc(t(a.type))}</p>
    ${d ? `<p style="margin-top:8px">${pill(d.status === 'approved' ? 'Approved in brief' : d.status === 'adjusted' ? `Adjusted: ${t(d.choice)}` : 'Overridden in brief', d.status === 'overridden' ? 'muted' : 'good')}</p>` : ''}
  </section>

  <section class="card tight">
    <div class="facts">
      <div><small>Estimated opportunity</small><b>${esc(fmt.money(it.value))}</b></div>
      <div><small>Effort</small><b>${it.effort} min</b></div>
      <div class="wide">${confBadge(it.confidence)}</div>
    </div>
  </section>

  <div class="guardrail">${icon('shield', 20)}<span><b>Guardrail.</b> ${esc(t(guard))}</span></div>

  <section>
    <h2>Why this action</h2>
    <ul class="why" style="margin-top:12px">${why.slice(0, 2).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
    ${why.length > 2 ? `<details><summary>Show all ${why.length} reasons</summary><ul class="why">${why.slice(2).map((w) => `<li>${esc(w)}</li>`).join('')}</ul></details>` : ''}
    <p class="small muted" style="margin-top:8px">Compared with: ${esc(t(it.compared, v))}</p>
  </section>

  <section class="card">
    <h2>${esc(t('Talking points for the {contact}'))}</h2>
    <ul class="why">${def.talk.map((x) => `<li>${esc(t(x, v))}</li>`).join('')}</ul>
  </section>

  ${evidenceBlock(ctx, it, def)}

  <section class="card" id="outcome"><div class="section-head"><h2>Outcome</h2>${status}</div>${reasons}</section>
  <p class="foot-note">Sample data. Photo and scan are demo captures.</p>`;
  return { html, dock };
}

export function mounted(ctx) {
  const pad = document.getElementById('sign-pad');
  if (!pad) return;
  const g = pad.getContext('2d');
  g.lineWidth = 2.2;
  g.lineCap = 'round';
  g.strokeStyle = '#0f172a';
  let drawing = false;
  const pos = (e) => { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * (pad.width / r.width), (e.clientY - r.top) * (pad.height / r.height)]; };
  pad.addEventListener('pointerdown', (e) => { drawing = true; pad.setPointerCapture?.(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
  pad.addEventListener('pointermove', (e) => { if (!drawing) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); pad.dataset.signed = '1'; });
  pad.addEventListener('pointerup', () => { drawing = false; });
}

export const actions = {
  'ev-photo': ({ ctx, data }) => { ctx.m.setEvidence(data.id, { type: 'photo', at: nowMin() }); },
  'ev-scan': ({ ctx, data }) => {
    const code = `${String.fromCharCode(65 + (data.id.length % 20))}${(data.id.charCodeAt(1) * 7919) % 900000 + 100000}`;
    ctx.m.setEvidence(data.id, { type: 'scan', code, at: nowMin() });
  },
  'ev-note': ({ ctx, data }) => {
    const text = (document.getElementById('ev-note-text')?.value || '').trim().slice(0, 300);
    ctx.m.setEvidence(data.id, { type: 'note', text: text || 'Done as planned.', at: nowMin() });
  },
  'ev-sign-clear': ({ ctx }) => { ctx.ui.signError = false; },
  'ev-sign-save': ({ ctx, data }) => {
    const pad = document.getElementById('sign-pad');
    if (!pad || pad.dataset.signed !== '1') { ctx.ui.signError = true; return; }
    const it = ctx.m.findAction(data.id);
    ctx.ui.signError = false;
    ctx.m.setEvidence(data.id, { type: 'signature', by: it.vars.person, at: nowMin() });
  },
  'outcome-done': ({ ctx, data }) => { ctx.m.recordOutcome(data.id, { status: 'done' }); },
  'outcome-not': ({ ctx, data }) => { ctx.ui.notDone = data.id; },
  'outcome-cancel': ({ ctx }) => { ctx.ui.notDone = null; },
  'outcome-reason': ({ ctx, data, value }) => { ctx.m.recordOutcome(data.id, { status: 'not_done', reason: value }); ctx.ui.notDone = null; },
  'outcome-reset': ({ ctx, data }) => { ctx.m.recordOutcome(data.id, { status: null, reason: null }); },
};
