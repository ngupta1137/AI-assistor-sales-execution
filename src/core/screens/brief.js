// R2 Overnight visit brief: the agents' ranked plan. Each item shows what the agent saw,
// what it compared against, how sure it is, and who prepared it. Approve, adjust or override.

import { esc, icon, pill, confidence, AGENT_LABEL } from '../ui.js';
import { typeLine } from '../ui.js';

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

function renderItem(ctx, it) {
  const { t, fmt, m, ui } = ctx;
  const v = it.vars;
  const conf = confidence(it.confidence);
  const d = m.decision(it.id);
  const paused = m.agentStopped(it.agent);
  const link = itemLink(it);
  const open = ui.panel && ui.panel.id === it.id ? ui.panel : null;
  const state = paused ? 'paused' : d ? d.status : 'pending';
  const valueText = it.value > 0 ? fmt.money(it.value) : it.kind === 'plan' ? `${v.fits} of ${v.total} actions fit` : 'Value set by people';

  let controls;
  if (paused) {
    controls = `<div class="paused-note">${icon('stop', 16)} ${esc(AGENT_LABEL[it.agent])} is stopped. This item is paused. <a href="#/agents">Agent controls</a></div>`;
  } else if (open && open.kind === 'override') {
    const reasons = ctx.industry.overrideReasons.map((r) => `
      <label class="radio"><input type="radio" name="reason-${it.id}" value="${esc(r.label)}" data-change="pick-reason" ${open.reason === r.label ? 'checked' : ''}><span>${esc(t(r.label))}</span></label>`).join('');
    controls = `<div class="panel" data-panel="override">
      <b>Why are you overriding this?</b>
      <p class="small muted">Your reason goes to your ${esc(t('{manager}'))}. Overrides are feedback for the agents, never a penalty.</p>
      <div class="radios">${reasons}</div>
      <textarea class="input" rows="2" placeholder="Note (optional)" data-change="panel-note">${esc(open.note || '')}</textarea>
      <div class="btn-row">
        <button class="btn ghost" data-act="panel-close">Cancel</button>
        <button class="btn danger" data-act="save-override" data-id="${it.id}" ${open.reason ? '' : 'disabled'}>Override</button>
      </div></div>`;
  } else if (open && open.kind === 'adjust') {
    const choices = ADJUST[it.kind].map((c) => `
      <label class="radio"><input type="radio" name="adj-${it.id}" value="${esc(c)}" data-change="pick-adjust" ${open.choice === c ? 'checked' : ''}><span>${esc(t(c))}</span></label>`).join('');
    controls = `<div class="panel" data-panel="adjust">
      <b>Adjust this item</b>
      <div class="radios">${choices}</div>
      <textarea class="input" rows="2" placeholder="Note (optional)" data-change="panel-note">${esc(open.note || '')}</textarea>
      <div class="btn-row">
        <button class="btn ghost" data-act="panel-close">Cancel</button>
        <button class="btn primary" data-act="save-adjust" data-id="${it.id}" ${open.choice ? '' : 'disabled'}>Save adjustment</button>
      </div></div>`;
  } else if (d) {
    const label = d.status === 'approved' ? 'Approved' : d.status === 'adjusted' ? `Adjusted: ${t(d.choice)}` : `Overridden: ${t(d.reason)}`;
    controls = `<div class="decided">
      ${pill(label, d.status === 'approved' ? 'good' : d.status === 'adjusted' ? 'info' : 'bad')}
      ${d.note ? `<p class="small muted">Note: ${esc(d.note)}</p>` : ''}
      <div class="btn-row">
        <button class="btn ghost sm" data-act="undo" data-id="${it.id}">Undo</button>
        ${d.status !== 'overridden' ? `<a class="btn ghost sm" href="${link.href}">${esc(t(link.label))} ${icon('chevron', 14)}</a>` : ''}
      </div></div>`;
  } else {
    controls = `<div class="btn-row three">
      <button class="btn primary" data-act="decide" data-id="${it.id}" data-status="approved">${icon('check', 18)}Approve</button>
      <button class="btn ghost" data-act="panel" data-id="${it.id}" data-kind="adjust">${icon('edit', 18)}Adjust</button>
      <button class="btn ghost danger-text" data-act="panel" data-id="${it.id}" data-kind="override">${icon('x', 18)}Override</button>
    </div>`;
  }

  return `<article class="item ${state}" id="item-${it.id}" data-item="${it.id}" data-kind="${it.kind}" data-state="${state}">
    <header class="item-head">
      <span class="rank sm">${it.kind === 'plan' ? icon('route', 14) : it.kind === 'order' ? icon('cart', 14) : it.rank}</span>
      <span class="agent-tag">${icon('agent', 14)} ${esc(AGENT_LABEL[it.agent])}</span>
      ${it.overBudget ? pill('If time allows', 'muted') : ''}
    </header>
    <h3>${esc(t(it.title, v))}</h3>
    <div class="metrics">
      <span>${esc(valueText)}</span>
      ${it.effort ? `<span>${icon('clock', 14)} ${it.effort} min</span>` : ''}
      ${pill(`${conf.label} confidence`, conf.tone)}
    </div>
    <dl class="evidence">
      <dt>What the agent saw</dt><dd>${esc(t(it.saw, v))}</dd>
      <dt>Compared against</dt><dd>${esc(t(it.compared, v))}</dd>
      <dt>How sure</dt><dd>${esc(conf.text)}</dd>
    </dl>
    ${controls}
  </article>`;
}

export function render(ctx, [accountId]) {
  const { t, fmt, data, m } = ctx;
  const p = m.plannedFor(accountId) || data.planned[0];
  const a = data.byId[p.accountId];
  const c = m.counts(a.id);
  const items = m.briefItems(a.id);
  const contact = a.contacts[0];

  return `
  <a class="back" href="#/today">${icon('back', 18)} ${esc(t('Today'))}</a>
  <section class="brief-head">
    <small class="eyebrow">${esc(t('{Visit} brief'))} · prepared overnight</small>
    <h1>${esc(a.name)}</h1>
    <p class="muted">${esc(typeLine(t, a))} · ${esc(a.area)} · Tier ${a.tier}</p>
    <p class="small">${icon('clock', 14)} ${esc(fmt.time(p.start))} · ${a.visitMinutes} min · ${esc(contact.name)}, ${esc(t(contact.role))}</p>
  </section>

  <div class="counts" id="counts" aria-live="polite">
    <span data-count="approved"><b>${c.approved}</b> approved</span>
    <span data-count="adjusted"><b>${c.adjusted}</b> adjusted</span>
    <span data-count="overridden"><b>${c.overridden}</b> overridden</span>
    <span data-count="pending"><b>${c.pending}</b> to review</span>
  </div>
  <p class="small muted guard">${icon('shield', 14)} Nothing is sent or ordered until you approve. ${c.paused ? `${c.paused} paused.` : ''}</p>

  <div class="items">${items.map((it) => renderItem(ctx, it)).join('')}</div>

  <div class="stack">
    ${c.pending > 0 ? `<button class="btn ghost block" data-act="approve-all" data-id="${a.id}">Approve all remaining (${c.pending})</button>` : ''}
    <a class="btn ghost block" href="#/account/${a.id}">${esc(t('{Account} 360'))}</a>
    <a class="btn ghost block" href="#/order/${a.id}">${esc(t('Open {order}'))}</a>
    <a class="btn primary block" href="#/complete/${a.id}" id="finish-visit">${esc(t('Finish {visit}'))}</a>
  </div>
  <p class="foot-note">Sample data. Rule-based scoring on generated data.</p>`;
}

export const actions = {
  decide: ({ ctx, data }) => { ctx.m.decide(data.id, { status: data.status }); ctx.ui.panel = null; },
  panel: ({ ctx, data }) => { ctx.ui.panel = { id: data.id, kind: data.kind }; },
  'panel-close': ({ ctx }) => { ctx.ui.panel = null; },
  'pick-reason': ({ ctx, value }) => { if (ctx.ui.panel) ctx.ui.panel.reason = value; },
  'pick-adjust': ({ ctx, value }) => { if (ctx.ui.panel) ctx.ui.panel.choice = value; },
  'panel-note': ({ ctx, value }) => { if (ctx.ui.panel) ctx.ui.panel.note = value.slice(0, 300); return false; },
  'save-override': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.reason) return false;
    ctx.m.decide(data.id, { status: 'overridden', reason: p.reason, note: p.note || '' });
    ctx.ui.panel = null;
  },
  'save-adjust': ({ ctx, data }) => {
    const p = ctx.ui.panel;
    if (!p || !p.choice) return false;
    ctx.m.decide(data.id, { status: 'adjusted', choice: p.choice, note: p.note || '' });
    ctx.ui.panel = null;
  },
  undo: ({ ctx, data }) => { ctx.m.undo(data.id); },
  'approve-all': ({ ctx, data }) => {
    for (const it of ctx.m.briefItems(data.id)) {
      if (!ctx.m.decision(it.id) && !ctx.m.agentStopped(it.agent)) ctx.m.decide(it.id, { status: 'approved' });
    }
  },
};
