// R5 Order or proposal builder: suggested lines with reasons, adjustable quantities,
// approval rules and prerequisites from the pack, evaluated live and re-checked on submit.

import { esc, icon, pill, agentTag } from '../ui.js';

const recipientName = (t, route) => t(route === 'kam' ? '{kam}' : '{manager}');

export function render(ctx, [accountId]) {
  const { t, fmt, data, m } = ctx;
  const a = data.byId[accountId] || data.byId[data.planned[0].accountId];
  const st = m.orderState(a.id);
  const lines = m.orderLines(a.id);
  const total = lines.reduce((s, l) => s + l.total, 0);
  const humanPriced = lines.some((l) => l.unitPrice == null && l.qty > 0);
  const rules = m.orderRules(a.id);
  const blocking = rules.filter((r) => r.triggered && r.blocks);
  const approval = rules.filter((r) => r.triggered && !r.blocks && r.kind !== 'info');
  const stopped = m.agentStopped('order');
  const route = st.submitted ? st.route : m.approvalRoute(a.id);
  const vars = (r) => ({ limit: r.detail.limit != null ? fmt.money(r.detail.limit) : '', max: r.max ?? '', lines: (r.detail.lines || []).join(', ') });

  const rows = lines.map((l) => `<li class="line${l.changed ? ' changed' : ''}" data-line="${l.offeringId}" data-unit="${l.unitPrice ?? ''}">
      <b class="row-main" style="font-size:16px">${esc(t(l.offering.name))}</b>
      <small>${esc(t(l.offering.category))} · ${l.unitPrice == null ? esc(t('Price set by people, not the agent')) : l.unitPrice === 0 ? 'No charge' : `${esc(fmt.price(l.unitPrice))} per ${esc(t(l.offering.unit))}`}</small>
      <span class="reason">${icon('agent', 14)}<span>${esc(t(l.reason, l.vars))}</span></span>
      <div class="line-foot">
        <div class="stepper" role="group" aria-label="${esc(`Quantity of ${t(l.offering.name)}`)}">
          <button class="step" data-act="qty" data-id="${a.id}" data-o="${l.offeringId}" data-d="-1" aria-label="Less" ${st.submitted || l.qty === 0 ? 'disabled' : ''}>−</button>
          <span class="qty" data-qty="${l.offeringId}">${l.qty}</span>
          <button class="step" data-act="qty" data-id="${a.id}" data-o="${l.offeringId}" data-d="1" aria-label="More" ${st.submitted ? 'disabled' : ''}>+</button>
        </div>
        <span class="small">${l.changed ? `<span class="info-text">Changed from ${l.suggested}</span> · ` : ''}<b class="money">${l.unitPrice ? esc(fmt.money(l.total)) : ''}</b></span>
      </div></li>`).join('');

  const ruleRows = rules.map((r) => {
    const tone = r.kind === 'info' ? 'muted' : r.triggered ? (r.blocks ? 'bad' : 'warn') : 'good';
    const label = r.kind === 'info' ? 'Rule'
      : r.kind === 'prerequisite' ? (r.triggered ? 'Missing' : r.detail.applies ? 'Done' : 'Not needed')
        : r.triggered ? (r.blocks ? 'Blocked' : 'Needs approval') : 'Within limit';
    const link = r.kind === 'prerequisite' && r.triggered && r.detail.actionId ? `<a class="btn secondary sm" href="#/action/${r.detail.actionId}">Open the action that completes this</a>` : '';
    return `<li class="rule" data-rule="${r.kind}" data-triggered="${r.triggered}"><span>${pill(label, tone)}</span><span>${esc(t(r.text, vars(r)))}</span>${link}</li>`;
  }).join('');

  let dock;
  if (st.submitted) {
    dock = `<div class="total-line"><span class="small muted">${humanPriced ? 'Priced lines total' : 'Total'}</span><b id="order-total">${esc(fmt.money(total))}</b></div>
      <div class="notice ${st.needsApproval ? 'warn' : 'good'}" id="order-status">${icon(st.needsApproval ? 'clock' : 'check', 18)}<span>${st.needsApproval
  ? esc(t(`Pending approval with your ${recipientName(t, st.route)}. Acknowledgement shows in their queue.`))
  : esc(t('{Order} submitted.'))}</span></div>
      <a class="btn primary block" href="#/complete/${a.id}">${esc(t('Finish {visit}'))}</a>`;
  } else {
    const why = stopped ? 'Order agent stopped. You can edit this draft. Submission is paused.'
      : blocking.length ? (blocking[0].kind === 'prerequisite' ? 'A required step is missing. See the rules above.' : 'Fix the blocked line before submitting.') : '';
    dock = `<div class="total-line"><span class="small muted">${humanPriced ? 'Priced lines total' : 'Total'}</span><b id="order-total">${esc(fmt.money(total))}</b></div>
      ${why ? `<p class="small warn-text">${esc(t(why))}</p>` : approval.length ? `<p class="small muted">${esc(t(`Goes to your ${recipientName(t, route)} for approval.`))}</p>` : ''}
      <button class="btn primary block" data-act="submit-order" data-id="${a.id}" id="submit-order" ${blocking.length || stopped ? 'disabled' : ''}>
        ${approval.length ? 'Send for approval' : esc(t('Submit {order}'))}</button>`;
  }

  const html = `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="page-head">
    <span class="eyebrow">${esc(t('{Order}'))}</span>
    <h1>${esc(a.name)}</h1>
    <p style="margin-top:8px">${agentTag('order')}</p>
    <p class="small muted" style="margin-top:8px">${esc(t(`Draft with ${lines.length} suggested lines. Change any quantity. Nothing is sent until you submit.`))}</p>
  </section>
  ${stopped && !st.submitted ? `<div class="notice warn">${icon('stop', 18)}<span>${esc(t('Order agent stopped. You can edit this draft. Submission is paused.'))}</span></div>` : ''}
  <ul class="group">${rows}</ul>
  <section><h2>Rules</h2><ul class="group rules" style="margin-top:12px">${ruleRows}</ul></section>
  <p class="foot-note">Sample data. Prices are illustrative.</p>`;
  return { html, dock };
}

export const actions = {
  qty: ({ ctx, data }) => {
    const line = ctx.m.orderLines(data.id).find((l) => l.offeringId === data.o);
    ctx.m.setQty(data.id, data.o, line.qty + Number(data.d));
  },
  'submit-order': ({ ctx, data }) => { ctx.m.submitOrder(data.id); },
};
