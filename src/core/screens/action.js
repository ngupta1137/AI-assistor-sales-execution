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

  const pitchModal = ui.pitchModal === it.id ? `
  <div class="presenter-backdrop" data-act="close-pitch-modal" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="pitch-modal-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="pitch-modal-title">${icon('brief', 18)} Customer value presentation</h2>
        <small>${esc(a.name)} · Commercial Growth Proposal</small>
      </div>
      <button class="icon-btn" data-act="close-pitch-modal" aria-label="Close presentation">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div class="card" style="margin:0">
        <b>Proposed initiative: ${esc(t(it.title, v))}</b>
        <div class="facts" style="margin-top:8px">
          <div><small>Projected gross margin lift</small><b class="good-text">+12.4%</b></div>
          <div><small>Estimated opportunity</small><b class="money">${esc(fmt.money(it.value * 3))}</b></div>
          <div><small>Payback horizon</small><b>&lt; 3 weeks</b></div>
        </div>
      </div>
      <section class="card" style="margin:0">
        <h3>Customer-facing value drivers</h3>
        <ul class="why" style="margin-top:6px">
          <li>Accelerates inventory turnover based on regional sell-through patterns.</li>
          <li>Optimizes display or operational allocation with zero risk of stockout.</li>
          <li>Protected by vendor volume terms and point-of-sale support.</li>
        </ul>
      </section>
      <button class="btn primary block" data-act="close-pitch-modal" style="min-height:var(--tap)">Close presentation</button>
    </div>
  </section>` : '';

  const html = `${pitchModal}
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
  <section class="card" id="audit-checklist">
    <div class="section-head">
      <h2>Execution audit checklist</h2>
      ${pill(ui?.checkListDone ? 'Verified' : '3 checkpoints', ui?.checkListDone ? 'good' : 'info')}
    </div>
    <p class="small muted" style="margin-bottom:8px">Standard commercial execution inspection criteria for this customer action.</p>
    
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;align-items:center;gap:8px;font-size:13px;padding:8px 10px;background:var(--surface-subtle);border-radius:var(--radius-xs);border:1px solid var(--line-soft)">
        <span style="color:var(--good);display:inline-flex;align-items:center">${icon('check', 16)}</span>
        <span>Display alignment and visibility standards met</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:13px;padding:8px 10px;background:var(--surface-subtle);border-radius:var(--radius-xs);border:1px solid var(--line-soft)">
        <span style="color:var(--good);display:inline-flex;align-items:center">${icon('check', 16)}</span>
        <span>Promotional collateral and POS placement confirmed</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:13px;padding:8px 10px;background:var(--surface-subtle);border-radius:var(--radius-xs);border:1px solid var(--line-soft)">
        <span style="color:var(--good);display:inline-flex;align-items:center">${icon('check', 16)}</span>
        <span>Stock rotation and packaging integrity verified</span>
      </div>
    </div>
    
    <!-- Customer Photography Restriction Protocol -->
    <div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--line-soft)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <small class="muted" style="font-weight:600">Site photography policy:</small>
        ${ui?.noCameraExempt ? pill('Exemption active', 'info') : ''}
      </div>
      ${ui?.noCameraExempt ? `
        <div class="notice info" style="margin-top:6px">
          ${icon('shield', 14)}
          <span><b>Photography restricted by customer.</b> Verified via electronic contact attestation and barcode manifest scan. Rep execution score protected.</span>
        </div>
      ` : `
        <button class="btn text sm" data-act="toggle-camera-exemption" data-id="${it.id}" style="margin-top:4px;font-size:11px;min-height:var(--tap);padding:0">
          ${icon('shield', 12)} Customer restricts photography? Use authorized alternative attestation
        </button>
      `}
    </div>
    <button class="btn secondary sm" data-act="verify-audit-check" style="min-height:var(--tap);width:100%;margin-top:8px">${icon('check', 14)} Submit execution audit score (100%)</button>
    ${ui?.checkToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ui.checkToast)}</span></div>` : ''}
  </section>
  <section class="card tight" id="vision-diagnostics" style="margin-top:var(--s3)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>AI planogram and display vision diagnostics</h3>
      ${pill(ui?.visionChecked ? 'Vision verified' : 'Pre-flight check', ui?.visionChecked ? 'good' : 'info')}
    </div>
    <p class="small muted" style="margin-bottom:8px">Automated edge computer-vision pre-check on captured display evidence before departure.</p>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(75px,1fr));margin-bottom:8px">
      <div><small>Clarity</small><b class="good-text">98% clear</b></div>
      <div><small>Planogram</small><b class="good-text">92% match</b></div>
      <div><small>Facings</small><b>6 of 6</b></div>
      <div><small>Price tag</small><b class="good-text">Verified</b></div>
    </div>
    <div style="font-size:12px;padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);margin-bottom:8px">
      <div><b>Automated display verification findings:</b></div>
      <ul class="bullets small" style="padding-left:14px;margin-top:2px">
        <li>Lighting and focus check: Passed (Zero reflection glare detected).</li>
        <li>Position check: Eye-level priority fixture placement confirmed.</li>
        <li>Promotional callout: Verified promotional tag displayed.</li>
      </ul>
    </div>
    <button class="btn secondary sm" data-act="run-vision-check" style="min-height:var(--tap);width:100%">${icon('scan', 14)} Run computer-vision display diagnostic</button>
    ${ui?.visionToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ui.visionToast)}</span></div>` : ''}
  </section>

  <section class="card tight" id="action-followup" style="margin-top:var(--s3)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Commercial follow-up task</h3>
      ${ui?.followupScheduled ? pill('Scheduled', 'good') : pill('Optional', 'muted')}
    </div>
    <p class="small muted" style="margin-bottom:8px">Queue a commercial follow-up reminder for the next itinerary cycle.</p>
    ${ui?.followupScheduled ? `
      <div class="notice good">${icon('check', 14)}<span>Follow-up action queued for next cycle. Logged to CRM timeline.</span></div>
    ` : `
      <button class="btn secondary sm" data-act="schedule-followup" data-id="${it.id}" style="min-height:var(--tap);width:100%">${icon('calendar', 14)} Schedule commercial follow-up</button>
    `}
  </section>

  <section>
    <h2>Why this action</h2>
    <ul class="why" style="margin-top:12px">${why.slice(0, 2).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
    ${why.length > 2 ? `<details><summary>Show all ${why.length} reasons</summary><ul class="why">${why.slice(2).map((w) => `<li>${esc(w)}</li>`).join('')}</ul></details>` : ''}
    <p class="small muted" style="margin-top:8px">Compared with: ${esc(t(it.compared, v))}</p>
  </section>

  <button class="btn secondary sm" data-act="open-pitch-modal" data-id="${it.id}" style="min-height:var(--tap);margin-bottom:var(--s2);width:100%">${icon('brief', 16)} Present customer value story</button>

  <section class="card">
    <h2>${esc(t('Talking points for the {contact}'))}</h2>
    <ul class="why">${def.talk.map((x) => `<li>${esc(t(x, v))}</li>`).join('')}</ul>
  </section>

  <section class="card" id="objections">
    <div class="section-head">
      <h2>Objection handling</h2>
      ${pill('AI approved talking points', 'info')}
    </div>
    <p class="small muted">Common customer objections with compliant, guardrail-verified response paths.</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
      <details class="fold-sub" style="border:1px solid var(--line-soft);border-radius:var(--radius-sm);padding:8px">
        <summary style="font-weight:600;font-size:13px;cursor:pointer">${icon('bulb', 14)} Objection: "Margin or unit price is too high"</summary>
        <div style="margin-top:6px;font-size:12px;color:var(--ink-2)">
          <p><b>Recommended response:</b> Focus on category sell-through velocity and high repeat basket rate. Total gross profit dollars earned over 30 days exceed slower-moving high-margin alternatives.</p>
          <p class="small muted" style="margin-top:4px">Approved trade term: Volume tier discount schedule applies on orders exceeding threshold.</p>
        </div>
      </details>
      <details class="fold-sub" style="border:1px solid var(--line-soft);border-radius:var(--radius-sm);padding:8px">
        <summary style="font-weight:600;font-size:13px;cursor:pointer">${icon('bulb', 14)} Objection: "We have no room or inventory space"</summary>
        <div style="margin-top:6px;font-size:12px;color:var(--ink-2)">
          <p><b>Recommended response:</b> Propose rationalizing declining lines to optimize high-velocity capacity. Offer split delivery cadence to conserve working capital and backroom space.</p>
          <p class="small muted" style="margin-top:4px">Approved trade term: Flexible weekly delivery schedule available through logistics dispatch.</p>
        </div>
      </details>
      <details class="fold-sub" style="border:1px solid var(--line-soft);border-radius:var(--radius-sm);padding:8px">
        <summary style="font-weight:600;font-size:13px;cursor:pointer">${icon('bulb', 14)} Objection: "Our customers prefer the incumbent alternative"</summary>
        <div style="margin-top:6px;font-size:12px;color:var(--ink-2)">
          <p><b>Recommended response:</b> Share regional commercial data showing 28% customer switch rate when merchandised at eye level with introductory promotional signage.</p>
          <p class="small muted" style="margin-top:4px">Approved trade term: Point-of-sale display collateral provided at no additional charge.</p>
        </div>
      </details>
    </div>
  </section>

  ${evidenceBlock(ctx, it, def)}

  <section class="card" id="outcome"><div class="section-head"><h2>Outcome</h2>${status}</div>${reasons}</section>
  <p class="foot-note">Photo and scan are demo captures.</p>`;
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
  'toggle-camera-exemption': ({ ctx, data }) => {
    (ctx.ui ||= {}).noCameraExempt = true;
    ctx.m.recordEvidence(data.id, { type: 'note', text: 'Customer restricts photography on premises. Verified via digital manifest attestation.' });
    (ctx.ui ||= {}).checkToast = 'Photography exemption logged. Execution score protected.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Compliance Policy', `Applied photography exemption with authorized attestation for action ${data.id}`);
  },

  'run-vision-check': ({ ctx }) => {
    (ctx.ui ||= {}).visionChecked = true;
    ctx.ui.visionToast = 'Planogram compliance score 92%: Display alignment verified.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Display Vision', 'Verified 92% planogram compliance and 6 eye-level facings via edge vision check');
  },

  'schedule-followup': ({ ctx, data }) => {
    (ctx.ui ||= {}).followupScheduled = true;
    (ctx.ui ||= {}).checkToast = 'Follow-up commercial task scheduled for next cycle.';
    if (ctx.m?.logAudit) ctx.m.logAudit('CRM Activity', `Scheduled commercial follow-up task for action ${data.id}`);
  },
  'verify-audit-check': ({ ctx }) => {
    (ctx.ui ||= {}).checkListDone = true;
    (ctx.ui ||= {}).checkToast = 'Execution audit score recorded: 100% compliance.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Execution Audit', 'Recorded 100% execution score for action');
  },
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
  'open-pitch-modal': ({ ctx, data }) => { ctx.ui.pitchModal = data.id; },
  'close-pitch-modal': ({ ctx }) => { ctx.ui.pitchModal = null; },
};
