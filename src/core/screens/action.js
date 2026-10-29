// R4 Action detail and R6 evidence capture: why it matters, value, effort, confidence,
// talking points, guardrail, typed evidence, and the outcome (done, or not done with a reason).

import { esc, icon, pill, confidence, AGENT_LABEL, EVIDENCE } from '../ui.js';

const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

function evidenceBlock(ctx, it, def) {
  const { t, fmt, m } = ctx;
  const ev = m.outcome(it.id)?.evidence;
  const type = def.evidence;
  const meta = EVIDENCE[type];
  let body;
  if (type === 'photo') {
    body = ev ? `<div class="photo-ph" role="img" aria-label="Photo placeholder"><span>${icon('camera', 28)}</span><small>Photo captured ${esc(fmt.time(ev.at))} (placeholder)</small></div>`
      : `<button class="btn ghost block" data-act="ev-photo" data-id="${it.id}">${icon('camera', 18)}Take photo</button>`;
  } else if (type === 'scan') {
    body = ev ? `<p class="ok-text">${icon('scan', 16)} Scanned ${esc(ev.code)} at ${esc(fmt.time(ev.at))}</p>`
      : `<button class="btn ghost block" data-act="ev-scan" data-id="${it.id}">${icon('scan', 18)}Scan barcode</button>`;
  } else if (type === 'signature') {
    body = ev ? `<p class="ok-text">${icon('pen', 16)} Signed by ${esc(ev.by)} at ${esc(fmt.time(ev.at))}</p>`
      : `<p class="small muted">${esc(t('Ask {person} to sign below.', it.vars))}</p>
        <canvas class="sign" id="sign-pad" width="320" height="120" aria-label="Signature pad"></canvas>
        <div class="btn-row"><button class="btn ghost sm" data-act="ev-sign-clear">Clear</button>
        <button class="btn primary sm" data-act="ev-sign-save" data-id="${it.id}" id="sign-save">Save signature</button></div>
        ${ctx.ui.signError ? '<p class="small warn-text">Sign in the box first.</p>' : ''}`;
  } else {
    body = ev ? `<p class="ok-text">${icon('note', 16)} Note saved: ${esc(ev.text)}</p>`
      : `<textarea class="input" rows="3" placeholder="What happened?" id="ev-note-text"></textarea>
        <button class="btn ghost block" data-act="ev-note" data-id="${it.id}">${icon('note', 18)}Save note</button>`;
  }
  return `<section class="card"><div class="section-head"><h2>Evidence</h2>${pill(meta.label, 'info')}</div>${body}</section>`;
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
  const conf = confidence(it.confidence);
  const out = m.outcome(it.id);
  const ev = out?.evidence;
  const guard = def.guardrail || (industry.guardrails.find((g) => g.agent === it.agent) || industry.guardrails[0]).text;
  const d = m.decision(it.id);

  let outcome;
  if (out?.status === 'done') {
    outcome = `<div class="decided">${pill('Done', 'good')}<button class="btn ghost sm" data-act="outcome-reset" data-id="${it.id}">Change</button></div>`;
  } else if (out?.status === 'not_done') {
    outcome = `<div class="decided">${pill(`Not done: ${t(out.reason)}`, 'bad')}<button class="btn ghost sm" data-act="outcome-reset" data-id="${it.id}">Change</button></div>`;
  } else if (ui.notDone === it.id) {
    outcome = `<div class="panel"><b>Why not?</b><div class="radios">${industry.outcomeReasons.map((r) => `
      <label class="radio"><input type="radio" name="nd-${it.id}" value="${esc(r.label)}" data-change="outcome-reason" data-id="${it.id}"><span>${esc(t(r.label))}${r.blocked ? ' <small class="muted">(goes to your manager)</small>' : ''}</span></label>`).join('')}</div>
      <button class="btn ghost sm" data-act="outcome-cancel">Cancel</button></div>`;
  } else {
    outcome = `<div class="btn-row">
      <button class="btn primary" data-act="outcome-done" data-id="${it.id}" id="mark-done" ${ev ? '' : 'disabled'}>${icon('check', 18)}Mark done</button>
      <button class="btn ghost" data-act="outcome-not" data-id="${it.id}" id="mark-not-done">Not done</button></div>
      ${ev ? '' : `<p class="small muted">Add the ${esc(EVIDENCE[def.evidence].label.toLowerCase())} to mark this done.</p>`}`;
  }

  return `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="brief-head">
    <small class="eyebrow">${esc(t(it.type))} · ${esc(AGENT_LABEL[it.agent])}</small>
    <h1>${esc(t(it.title, v))}</h1>
    <p class="muted">${esc(a.name)} · ${esc(t(a.type))}</p>
    ${d ? `<p>${pill(d.status === 'approved' ? 'Approved in brief' : d.status === 'adjusted' ? `Adjusted: ${t(d.choice)}` : 'Overridden in brief', d.status === 'overridden' ? 'bad' : 'good')}</p>` : ''}
  </section>

  <section class="cards3 card">
    <div><small>Value estimate</small><b>${esc(fmt.money(it.value))}</b></div>
    <div><small>Effort</small><b>${it.effort} min</b></div>
    <div><small>Confidence</small><b>${esc(conf.label)} (${conf.pct}%)</b></div>
  </section>

  <section>
    <h2>Why it matters</h2>
    <ul class="why">
      <li>${esc(t(it.saw, v))}</li>
      ${def.why.map((w) => `<li>${esc(t(w, v))}</li>`).join('')}
    </ul>
    <p class="small muted">Compared against: ${esc(t(it.compared, v))}</p>
  </section>

  <section class="card">
    <h2>${esc(t('Talking points for the {contact}'))}</h2>
    <ul class="talk">${def.talk.map((x) => `<li>${esc(t(x, v))}</li>`).join('')}</ul>
  </section>

  <div class="guardrail">${icon('shield', 18)}<span><b>Guardrail</b> ${esc(t(guard))}</span></div>

  ${evidenceBlock(ctx, it, def)}

  <section class="card"><h2>Outcome</h2>${outcome}</section>
  <a class="btn ghost block" href="#/brief/${a.id}">Back to the brief</a>
  <p class="foot-note">Sample data.</p>`;
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
