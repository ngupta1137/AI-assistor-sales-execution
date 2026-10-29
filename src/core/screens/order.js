// R5 Order or proposal builder: suggested lines with reasons, adjustable quantities,
// approval rules from the pack, evaluated live.

import { esc, icon, pill, AGENT_LABEL } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m } = ctx;
  const a = data.byId[accountId] || data.byId[data.planned[0].accountId];
  const st = m.orderState(a.id);
  const lines = m.orderLines(a.id);
  const total = lines.reduce((s, l) => s + l.total, 0);
  const rules = m.orderRules(a.id);
  const blocking = rules.filter((r) => r.triggered && r.blocks);
  const approval = rules.filter((r) => r.triggered && !r.blocks && r.kind !== 'info');
  const stopped = m.agentStopped('order');

  const rows = lines.map((l) => `<li class="line${l.changed ? ' changed' : ''}" data-line="${l.offeringId}">
    <div class="line-main">
      <b>${esc(t(l.offering.name))}</b>
      <small>${esc(t(l.offering.category))} · ${l.unitPrice == null ? esc(t('Priced by people, not the agent')) : `${esc(fmt.price(l.unitPrice))} per ${esc(t(l.offering.unit))}`}</small>
      <small class="reason">${icon('agent', 12)} ${esc(t(l.reason, l.vars))}</small>
      ${l.changed ? `<small class="info-text">Changed from ${l.suggested}</small>` : ''}
    </div>
    <div class="line-end">
      <div class="stepper" aria-label="Quantity">
        <button class="step" data-act="qty" data-id="${a.id}" data-o="${l.offeringId}" data-d="-1" aria-label="Less" ${st.submitted ? 'disabled' : ''}>−</button>
        <span class="qty" data-qty="${l.offeringId}">${l.qty}</span>
        <button class="step" data-act="qty" data-id="${a.id}" data-o="${l.offeringId}" data-d="1" aria-label="More" ${st.submitted ? 'disabled' : ''}>+</button>
      </div>
      <b class="money">${l.unitPrice == null ? '' : esc(fmt.money(l.total))}</b>
    </div></li>`).join('');

  const ruleRows = rules.map((r) => {
    const tone = r.triggered ? (r.blocks ? 'bad' : 'warn') : r.kind === 'info' ? 'muted' : 'good';
    const status = r.kind === 'info' ? 'Rule' : r.triggered ? (r.blocks ? 'Blocked' : 'Needs approval') : 'Within limit';
    const text = t(r.text, { limit: r.detail.limit != null ? fmt.money(r.detail.limit) : '', max: r.max ?? '', lines: (r.detail.lines || []).join(', ') });
    return `<li class="rule ${tone}" data-rule="${r.kind}" data-triggered="${r.triggered}">${pill(status, tone)}<span>${esc(text)}</span></li>`;
  }).join('');

  let foot;
  if (st.submitted) {
    foot = `<div class="notice ${st.needsApproval ? 'warn' : 'good'}" id="order-status">${st.needsApproval
      ? esc(t('Sent to your {manager} for approval. You will see the decision here.'))
      : esc(t('{Order} submitted.'))}</div>
      <a class="btn primary block" href="#/complete/${a.id}">${esc(t('Finish {visit}'))}</a>`;
  } else {
    foot = `<button class="btn primary block" data-act="submit-order" data-id="${a.id}" id="submit-order" ${blocking.length || stopped ? 'disabled' : ''}>
      ${approval.length ? 'Send for approval' : esc(t('Submit {order}'))}</button>
      ${blocking.length ? `<p class="small warn-text">Fix the blocked line before submitting.</p>` : ''}`;
  }

  return `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="brief-head">
    <small class="eyebrow">${esc(t('{Order}'))} · drafted by ${esc(AGENT_LABEL.order)}</small>
    <h1>${esc(a.name)}</h1>
    <p class="muted">${esc(t('{n} suggested lines. Change any quantity. Nothing is sent until you submit.', { n: lines.length }))}</p>
  </section>
  ${stopped ? `<div class="notice warn">${icon('stop', 18)} ${esc(AGENT_LABEL.order)} is stopped. The draft is frozen until it resumes.</div>` : ''}
  <ul class="lines">${rows}</ul>
  <div class="total-row"><span>Total</span><b id="order-total">${esc(fmt.money(total))}</b></div>
  <section><h2>Approval rules</h2><ul class="rules">${ruleRows}</ul></section>
  ${foot}
  <p class="foot-note">Sample data. Prices are illustrative.</p>`;
}

export const actions = {
  qty: ({ ctx, data }) => {
    const line = ctx.m.orderLines(data.id).find((l) => l.offeringId === data.o);
    ctx.m.setQty(data.id, data.o, line.qty + Number(data.d));
  },
  'submit-order': ({ ctx, data }) => { ctx.m.submitOrder(data.id); },
};
