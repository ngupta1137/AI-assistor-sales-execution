// R2 Overnight visit brief: the agents' ranked plan. Each item shows what the agent saw,
// what it compared against, how sure it is, and who prepared it. Approve, adjust or override.

import { esc, icon, pill, confBadge, agentTag, typeLine, AGENT_LABEL } from '../ui.js';

const ADJUST = {
  action: ['Do it first', 'Do it later in the {visit}', 'Only if time allows', 'Smaller scope today'],
  plan: ['Start earlier', 'Start later', 'Shorter {visit}', 'Longer {visit}'],
  order: ['Change quantities in the builder', 'Review lines with the {contact}', 'Split into two {orders}'],
};

function itemLink(it) {
  if (it.kind === 'action') return { href: `#/action/${it.id}`, label: 'Open action' };
  if (it.kind === 'order') return { href: `#/order/${it.accountId}`, label: 'Open {order}' };
  return { href: `#/account/${it.accountId}`, label: 'Open {account}' };
}

/** Where an override goes: the reason's route, or the KAM for key tier A accounts. Same rule as the queue. */
function overrideRecipient(ctx, it, reasonLabel) {
  const acc = ctx.data.byId[it.accountId];
  const r = ctx.industry.overrideReasons.find((x) => x.label === reasonLabel);
  return ctx.t(r?.route === 'kam' || (acc.key && acc.tier === 'A') ? '{kam}' : '{manager}');
}

function sheet(ctx, it, open) {
  const { t } = ctx;
  const isOverride = open.kind === 'override';
  const name = isOverride ? `reason-${it.id}` : `adj-${it.id}`;
  const options = isOverride ? ctx.industry.overrideReasons.map((r) => r.label) : ADJUST[it.kind];
  const picked = isOverride ? open.reason : open.choice;
  const radios = options.map((label) => `
    <label class="radio"><input type="radio" name="${name}" value="${esc(label)}" data-change="${isOverride ? 'pick-reason' : 'pick-adjust'}" ${picked === label ? 'checked' : ''}><span>${esc(t(label))}</span></label>`).join('');
  const titleId = `sheet-title-${it.id}`;
  return `<div class="sheet-backdrop" data-act="panel-close" aria-hidden="true"></div>
    <div class="sheet panel" role="dialog" aria-modal="true" aria-labelledby="${titleId}" data-panel="${open.kind}" data-region="decision-sheet">
      <div class="sheet-head">
        <div><h2 id="${titleId}">${isOverride ? 'Override this item' : 'Adjust this item'}</h2><small>${esc(t(it.title, it.vars))}</small></div>
        <button class="icon-btn" data-act="panel-close" aria-label="Close">${icon('x', 20)}</button>
      </div>
      <div class="sheet-body">
        ${isOverride ? `<p class="small">${esc(picked ? `Routed to your ${overrideRecipient(ctx, it, picked)} with your reason.` : 'Pick a reason. It is feedback for the agents, never a penalty.')}</p>` : ''}
        <fieldset class="radios"><legend class="sr-only">${isOverride ? 'Reason' : 'Adjustment'}</legend>${radios}</fieldset>
        <label class="field">Note (optional)
          <textarea class="input" rows="2" maxlength="300" data-change="panel-note" data-input="panel-note">${esc(open.note || '')}</textarea></label>
      </div>
      <div class="sheet-foot">
        <button class="btn secondary" data-act="panel-close">Cancel</button>
        ${isOverride
    ? `<button class="btn danger" data-act="save-override" data-id="${it.id}" ${picked ? '' : 'disabled'}>Override</button>`
    : `<button class="btn primary" data-act="save-adjust" data-id="${it.id}" ${picked ? '' : 'disabled'}>Save adjustment</button>`}
      </div>
    </div>`;
}

function renderItem(ctx, it, isNext) {
  const { t, fmt, m, ui } = ctx;
  const v = it.vars;
  const d = m.decision(it.id);
  const paused = m.agentStopped(it.agent);
  const link = itemLink(it);
  const open = ui.panel && ui.panel.id === it.id ? ui.panel : null;
  const state = paused ? 'paused' : d ? d.status : 'pending';
  const valueText = it.value > 0 ? `Est. ${fmt.money(it.value)}` : it.kind === 'plan' ? `${v.fits} of ${v.total} actions fit` : 'Value set by people';
  const stateLabel = { pending: ['To review', 'warn'], approved: ['Approved', 'good'], adjusted: ['Adjusted', 'info'], overridden: ['Overridden', 'muted'], paused: ['Paused', 'muted'] }[state];

  let controls;
  if (paused) {
    controls = `<div class="paused-note">${icon('stop', 16)} ${esc(AGENT_LABEL[it.agent])} is stopped. This item is paused. <a href="#/agents">Agent controls</a></div>`;
  } else if (d) {
    const detail = d.status === 'adjusted' ? t(d.choice) : d.status === 'overridden' ? `${t(d.reason)}. Routed to ${overrideRecipient(ctx, it, d.reason)}.` : '';
    controls = `<div class="decided">
      ${detail ? `<span class="note">${esc(detail)}</span>` : ''}
      ${d.note ? `<span class="note">Note: ${esc(d.note)}</span>` : ''}
      <button class="btn secondary sm" data-act="undo" data-id="${it.id}">Undo</button>
      <span class="spacer"></span>
      ${d.status !== 'overridden' ? `<a class="btn text sm" href="${link.href}">${esc(t(link.label))} ${icon('chevron', 16)}</a>` : ''}
    </div>`;
  } else {
    controls = `<div class="decide-row">
      <button class="btn primary" data-act="decide" data-id="${it.id}" data-status="approved">Approve</button>
      <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="adjust">Adjust</button>
      <button class="btn secondary" data-act="panel" data-id="${it.id}" data-kind="override">Override</button>
    </div>`;
  }

  const lead = it.kind === 'plan' ? icon('route', 16) : it.kind === 'order' ? icon('cart', 16) : it.rank;
  return `<article class="item ${state}${isNext ? ' next' : ''}" id="item-${it.id}" data-item="${it.id}" data-kind="${it.kind}" data-state="${state}">
    <div class="item-head">${agentTag(it.agent)}${it.overBudget ? pill('If time allows', 'muted') : ''}<span class="state">${pill(stateLabel[0], stateLabel[1])}</span></div>
    <div class="item-title"><span class="rank">${lead}</span><h3>${esc(t(it.title, v))}</h3></div>
    <div class="metrics"><span>${esc(valueText)}</span>${it.effort ? `<span>${icon('clock', 16)} ${it.effort} min</span>` : ''}${confBadge(it.confidence)}</div>
    <details class="evi"${isNext ? ' open' : ''}><summary>What the agent saw</summary>
      <dl class="evidence">
        <dt>Saw</dt><dd>${esc(t(it.saw, v))}</dd>
        <dt>Compared</dt><dd>${esc(t(it.compared, v))}</dd>
      </dl>
    </details>
    ${controls}
    ${open && !paused && !d ? sheet(ctx, it, open) : ''}
  </article>`;
}

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, ui } = ctx;
  const p = m.plannedFor(accountId) || data.planned[0];
  const a = data.byId[p.accountId];
  const c = m.counts(a.id);
  const items = m.briefItems(a.id);
  const contact = a.contacts[0];
  const firstPending = items.find((it) => !m.decision(it.id) && !m.agentStopped(it.agent));
  const prev = ui.prevCounts?.[a.id];
  const bump = (k) => (prev && prev[k] !== c[k] ? ' class="bump"' : '');
  ui.prevCounts = { ...(ui.prevCounts || {}), [a.id]: c };

  const collateralModal = ui.collateralOpen ? `
  <div class="presenter-backdrop" data-act="close-collateral" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="collateral-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="collateral-title">${icon('brief', 18)} Sales collateral and documents</h2>
        <small>${esc(ctx.industry.name)} · Approved Commercial Collateral</small>
      </div>
      <button class="icon-btn" data-act="close-collateral" aria-label="Close collateral">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <div class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Commercial Catalog and Specification</b>
          ${pill('PDF · 1.4 MB', 'info')}
        </div>
        <p class="small muted" style="margin-top:4px">Quarterly approved price schedules, technical specifications, and bulk volume terms.</p>
        <button class="btn secondary sm" data-act="share-doc" data-doc="Commercial Catalog" data-to="${esc(contact.name)}" style="min-height:var(--tap);margin-top:8px;width:100%">${icon('brief', 14)} Share with ${esc(contact.name)}</button>
      </div>
      <div class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Regulatory Compliance and Certificate</b>
          ${pill('PDF · 820 KB', 'good')}
        </div>
        <p class="small muted" style="margin-top:4px">Certificate of analysis, safety compliance data sheets, and verified regulatory clearances.</p>
        <button class="btn secondary sm" data-act="share-doc" data-doc="Compliance Certificate" data-to="${esc(contact.name)}" style="min-height:var(--tap);margin-top:8px;width:100%">${icon('shield', 14)} Share with ${esc(contact.name)}</button>
      </div>
      <button class="btn primary block" data-act="close-collateral" style="min-height:var(--tap)">Close</button>
    </div>
  </section>` : '';

  return `${collateralModal}
  ${ui.briefToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ui.briefToast)}</span></div>` : ''}
  <a class="back" href="#/today">${icon('back', 18)} ${esc(t('Today'))}</a>
  <section class="brief-head">
    <span class="eyebrow">${esc(t('{Visit} brief'))} · prepared overnight</span>
    <h1>${esc(a.name)}</h1>
    <p class="small muted">${esc(typeLine(t, a))} · ${esc(a.area)} · Tier ${a.tier}</p>
    <p class="small">${esc(fmt.time(p.start))} · ${a.visitMinutes} min · ${esc(contact.name)}, ${esc(t(contact.role))}</p>
  </section>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn secondary sm" data-act="open-collateral" style="flex:1;min-height:var(--tap)">${icon('brief', 16)} Sales collateral</button>
    <a class="btn secondary sm" href="#/account/${a.id}" style="flex:1;min-height:var(--tap);display:flex;align-items:center;justify-content:center">${icon('note', 16)} ${esc(t('{Account} 360'))}</a>
  </div>

  <div class="counts tight" id="counts" aria-live="polite">
    <span data-count="approved"${bump('approved')}><b>${c.approved}</b>Approved</span>
    <span data-count="adjusted"${bump('adjusted')}><b>${c.adjusted}</b>Adjusted</span>
    <span data-count="overridden"${bump('overridden')}><b>${c.overridden}</b>Overridden</span>
    <span data-count="pending"${bump('pending')}><b>${c.pending}</b>To review</span>
  </div>
  <p class="small muted tight guard">${esc(t('Reviewing this brief does not submit an {order}.'))}${c.paused ? ` ${c.paused} paused.` : ''}</p>

  <div class="items tight">${items.map((it) => renderItem(ctx, it, it === firstPending)).join('')}</div>

  <div class="btn-row">
    ${c.pending > 0 ? `<button class="btn secondary block" data-act="approve-all" data-id="${a.id}">Approve all remaining (${c.pending})</button>` : ''}
    <a class="btn secondary" style="flex:1" href="#/account/${a.id}">${esc(t('{Account} 360'))}</a>
    <a class="btn secondary" style="flex:1" href="#/order/${a.id}">${esc(t('Open {order}'))}</a>
    <a class="btn primary block" href="#/complete/${a.id}" id="finish-visit">${esc(t('Finish {visit}'))}</a>
  </div>
  <p class="foot-note">Rule-based scoring on generated data. Confidence describes the rules, not a chance of a sale.</p>`;
}

export function mounted(ctx) {
  const sheetEl = document.querySelector('.sheet');
  if (!sheetEl) return;
  // The sheet re-renders when a reason is picked; keep typing at the end of the note, not the start.
  const note = sheetEl.querySelector('textarea');
  note?.addEventListener('focus', () => { const n = note.value.length; note.setSelectionRange(n, n); });
  if (!sheetEl.contains(document.activeElement)) (sheetEl.querySelector('input:checked') || sheetEl.querySelector('input'))?.focus({ preventScroll: true });
}

/** Reads the note straight from the textarea at save time, so no input method can lose it. */
const currentNote = (ctx, id) => {
  const el = document.querySelector(`#item-${CSS.escape(id)} textarea`);
  return (el ? el.value : ctx.ui.panel?.note || '').trim().slice(0, 300);
};

export const actions = {
  decide: ({ ctx, data }) => { ctx.m.decide(data.id, { status: data.status }); ctx.ui.panel = null; },
  panel: ({ ctx, data }) => { ctx.ui.panel = { id: data.id, kind: data.kind }; },
  'panel-close': ({ ctx }) => { ctx.ui.panel = null; },
  'pick-reason': ({ ctx, value }) => { if (ctx.ui.panel) { ctx.ui.panel.note = currentNote(ctx, ctx.ui.panel.id); ctx.ui.panel.reason = value; } },
  'pick-adjust': ({ ctx, value }) => { if (ctx.ui.panel) { ctx.ui.panel.note = currentNote(ctx, ctx.ui.panel.id); ctx.ui.panel.choice = value; } },
  'panel-note': ({ ctx, value }) => { if (ctx.ui.panel) ctx.ui.panel.note = value.slice(0, 300); return false; },
  'save-override': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.reason) return false;
    ctx.m.decide(data.id, { status: 'overridden', reason: p.reason, note: currentNote(ctx, data.id) }, { persona: ctx.persona, screen: 'brief' });
    ctx.ui.panel = null;
  },
  'save-adjust': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.choice) return false;
    ctx.m.decide(data.id, { status: 'adjusted', choice: p.choice, note: currentNote(ctx, data.id) });
    ctx.ui.panel = null;
  },
  undo: ({ ctx, data }) => { ctx.m.undo(data.id); },
  'approve-all': ({ ctx, data }) => {
    for (const it of ctx.m.briefItems(data.id)) {
      if (!ctx.m.decision(it.id) && !ctx.m.agentStopped(it.agent)) ctx.m.decide(it.id, { status: 'approved' });
    }
  },
};
