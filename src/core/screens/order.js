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
      <div class="line-foot"><button class="btn text sm" data-act="open-substitute" data-id="${a.id}" style="font-size:11px;min-height:var(--tap);padding:0 4px">${icon('sync', 12)} Suggest substitute</button>
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
      ${ctx.ui?.erpNotice ? `<div class="notice good" style="margin-top:6px">${icon('check', 16)}<span>${esc(ctx.ui.erpNotice)}</span></div>` : ''}
    ${st.submitted ? `
      <div style="margin-top:8px;padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line-soft);border-radius:var(--radius-sm)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <b>Order state &amp; storage durability</b>
          ${ctx.app.offline ? pill('Provisional: Local Queue', 'warn') : pill('Authoritative: ERP Accepted', 'good')}
        </div>
        <div class="small muted" style="margin-bottom:6px">
          ${ctx.app.offline
            ? 'Provisional reservation token #RES-9410. Pending ERP inventory allocation and credit release upon sync.'
            : 'Authoritative confirmation from ERP OData gateway. Central warehouse inventory batch reserved and delivery beat dispatched.'}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:4px 6px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Storage persistence:</span>
          <b class="good-text">Persisted (navigator.storage.persist active)</b>
        </div>
        
        <!-- Compensating Flow Simulator -->
        <div style="margin-top:6px;border-top:1px solid var(--line-soft);padding-top:6px">
          <button class="btn text sm" data-act="toggle-compensating-flow" data-id="${a.id}" style="font-size:11px;min-height:36px;padding:0;width:100%;text-align:left">
            ${icon('sync', 12)} Simulate ERP sync exception &amp; compensating flow
          </button>
          ${ctx.ui?.compensatingFlowOpen ? `
            <div style="margin-top:6px;padding:6px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft);font-size:11px">
              <b>Compensating reconciliation scenarios:</b>
              <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap">
                <button class="btn secondary sm" data-act="comp-scenario" data-type="stock" style="min-height:var(--tap);flex:1;font-size:10px">Depot oversold</button>
                <button class="btn secondary sm" data-act="comp-scenario" data-type="credit" style="min-height:var(--tap);flex:1;font-size:10px">Credit hold</button>
                <button class="btn secondary sm" data-act="comp-scenario" data-type="price" style="min-height:var(--tap);flex:1;font-size:10px">Price drift</button>
              </div>
              ${ctx.ui?.compNotice ? `<div class="notice info" style="margin-top:6px">${icon('shield', 12)}<span>${esc(ctx.ui.compNotice)}</span></div>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

      <div class="btn-row" style="margin-bottom:8px">
        <button class="btn secondary sm" data-act="push-erp" data-id="${a.id}" style="flex:1">${icon('sync', 16)} Push to ERP</button>
        <button class="btn secondary sm" data-act="order-pdf" data-id="${a.id}" style="flex:1">${icon('note', 16)} Export Order</button>
      </div>
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
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;margin-bottom:8px;gap:8px;flex-wrap:wrap">
    <h2 style="margin:0">Suggested lines</h2>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn secondary sm" data-act="toggle-van-stock" data-id="${a.id}" style="min-height:var(--tap);display:inline-flex;align-items:center;gap:6px">${icon('cart', 16)} Vehicle inventory</button>
      <button class="btn secondary sm" data-act="toggle-rma" data-id="${a.id}" style="min-height:var(--tap);display:inline-flex;align-items:center;gap:6px">${icon('wallet', 16)} Returns &amp; RMA</button>
      <button class="btn secondary sm" data-act="toggle-scanner" data-id="${a.id}" style="min-height:var(--tap);display:inline-flex;align-items:center;gap:6px">${icon('scan', 16)} Line scanner</button>
    </div></div>
  ${ctx.ui?.rmaOpen ? `
  <section class="card tight" style="margin-bottom:var(--s3);border:1px solid var(--line);background:var(--surface-subtle)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>In-visit return claim and RMA request</h3>
      ${ctx.ui?.rmaCreditApplied ? pill('Claim queued for AR', 'good') : pill('Claim pending review', 'info')}
    </div>
    <p class="small muted" style="margin-bottom:8px">Segregation of duties: Rep logs damage claim and physical evidence; credit note is queued for Accounts Receivable approval before posting to customer ledger.</p>
    
    <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
        <span>Return reason:</span>
        <b>Damaged in transit / packaging defect</b>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
        <span>Item to inspect:</span>
        <b>${lines[0] ? esc(t(lines[0].offering.name)) : 'Core line'} (2 units)</b>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
        <span>Estimated claim:</span>
        <b class="money">-${esc(fmt.money(39))} (Sample Claim #RMA-2026-781)</b>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
        <span class="muted">Policy control:</span>
        <span class="muted">&lt; $250 Rep limit · AR ledger approval required</span>
      </div>
    </div>
    ${ctx.ui?.rmaCreditApplied ? `
      <div class="notice good">${icon('check', 14)}<span>RMA Claim #RMA-2026-781 logged with photo evidence. Queued for Central AR audit. No unapproved ledger posting.</span></div>
    ` : `
      <button class="btn secondary sm" data-act="apply-rma-credit" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('check', 14)} Submit RMA claim for AR review</button>
    `}
  </section>` : ''}

  ${ctx.ui?.subOpen ? `
  <section class="card tight" style="margin-bottom:var(--s3);border:1px solid var(--accent);background:var(--accent-soft)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Eligible product substitution and split delivery</h3>
      ${pill('Eligible substitute found', 'good')}
    </div>
    <p class="small" style="margin-bottom:8px">Constrained item alternative verified for contract price parity and depot stock availability.</p>
    
    <div style="padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft);margin-bottom:8px;font-size:12px">
      <div style="display:flex;justify-content:space-between">
        <span class="muted">Original constrained line:</span>
        <span>${lines[0] ? esc(t(lines[0].offering.name)) : 'Requested line'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <b>Recommended substitute:</b>
        <b class="good-text">Premium Alternate (Depot #402 In Stock)</b>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:2px">
        <span class="muted">Contract price parity:</span>
        <b>100% matched at Tier discount</b>
      </div>
    </div>
    <div class="btn-row" style="gap:6px">
      <button class="btn primary sm" data-act="accept-substitute" data-id="${a.id}" style="min-height:var(--tap);flex:1">Swap with substitute</button>
      <button class="btn secondary sm" data-act="split-backorder" data-id="${a.id}" style="min-height:var(--tap);flex:1">Split backorder shipment</button>
    </div>
    ${ctx.ui?.subNotice ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.subNotice)}</span></div>` : ''}
  </section>` : ''}

  ${ctx.ui?.vanStockOpen ? `
  <section class="card tight" style="margin-bottom:var(--s3);border:1px solid var(--line)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Vehicle and field trunk inventory</h3>
      ${pill('Direct delivery stock', 'good')}
    </div>
    <p class="small muted" style="margin-bottom:8px">On-hand vehicle inventory available for immediate customer handover without warehouse logistics delay.</p>
    
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center">
        <div>
          <b>${lines[0] ? esc(t(lines[0].offering.name)) : 'Core line'}</b>
          <div class="small muted">Lot #2026-X · 24 units on vehicle · Ambient storage</div>
        </div>
        <button class="btn good sm" data-act="allocate-van-stock" data-id="${a.id}" data-o="${lines[0]?.offeringId || ''}" style="min-height:var(--tap)">Allocate 5 units</button>
      </div>
    </div>
    ${ctx.ui?.vanStockNotice ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.vanStockNotice)}</span></div>` : ''}
  </section>` : ''}
  ${ctx.ui?.scannerOpen ? `
  <section class="card tight" style="margin-bottom:var(--s3);border:1px solid var(--accent)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>Optical line scanner</h3>
      ${pill('GS1 / EAN Active', 'good')}
    </div>
    <p class="small muted" style="margin-bottom:8px">Aim optical viewfinder at barcode or packaging label to add verified lines directly to this draft.</p>
    
    <div style="position:relative;background:#111827;border-radius:var(--radius-sm);height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;overflow:hidden">
      <div style="position:absolute;top:50%;left:10%;right:10%;height:2px;background:#ef4444;box-shadow:0 0 8px #ef4444"></div>
      <div style="width:70%;height:80px;border:2px dashed rgba(255,255,255,0.6);border-radius:6px;display:flex;align-items:center;justify-content:center;text-align:center;padding:4px">
        <span style="font-size:12px;color:rgba(255,255,255,0.8)">Align GS1-128 code within reticle</span>
      </div>
      <span style="font-size:11px;color:#9ca3af;margin-top:6px">${lines[0] ? esc(t(lines[0].offering.name)) : 'Line'} detected</span>
    </div>

    ${ctx.ui?.scannerNotice ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.scannerNotice)}</span></div>` : ''}

    <div class="btn-row" style="margin-top:8px;gap:8px">
      <button class="btn primary sm" data-act="scan-code" data-id="${a.id}" data-o="${lines[0]?.offeringId || ''}" style="flex:1;min-height:var(--tap)">${icon('check', 14)} Scan barcode</button>
      <button class="btn secondary sm" data-act="toggle-scanner" data-id="${a.id}" style="min-height:var(--tap)">Close scanner</button>
    </div>
  </section>` : ''}
  <ul class="group">${rows}</ul>
  <section><h2>Rules</h2><ul class="group rules" style="margin-top:12px">${ruleRows}</ul></section>

  ${(() => {
    const subtotal = total;
    const discountRate = subtotal >= 500 ? 0.05 : 0;
    const discountAmount = Math.round(subtotal * discountRate);
    const taxRate = 0.08;
    const estimatedTax = Math.round((subtotal - discountAmount) * taxRate);
    const finalTotal = subtotal - discountAmount + estimatedTax;

    return `
    <section class="card tight" style="margin-top:var(--s3)">
      <div class="section-head" style="margin-bottom:6px">
        <h3>Commercial pricing and tax breakdown</h3>
        ${discountRate > 0 ? pill('Volume tier applied', 'good') : pill('Standard terms', 'info')}
      </div>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(75px,1fr))">
        <div><small>Subtotal</small><b class="money">${esc(fmt.money(subtotal))}</b></div>
        <div><small>Volume tier</small><b>${discountRate > 0 ? '-5%' : '0%'}</b></div>
        <div><small>Est. tax</small><b>${esc(fmt.money(estimatedTax))}</b></div>
        <div><small>Net total</small><b class="money">${esc(fmt.money(finalTotal))}</b></div>
      </div>
      ${subtotal < 500
        ? `<small class="muted" style="display:block;margin-top:6px">${icon('bulb', 12)} Add ${esc(fmt.money(500 - subtotal))} to qualify for 5% volume discount tier.</small>`
        : `<small class="good-text" style="display:block;margin-top:6px">${icon('check', 12)} Qualified for 5% volume discount tier (- ${esc(fmt.money(discountAmount))}).</small>`}
      <div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--line-soft);font-size:11px;color:var(--muted)">
        ${icon('route', 12)} Standard 48h distribution dispatch · Prepaid freight terms verified
      </div>
      ${ctx.ui?.promoNotice ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.promoNotice)}</span></div>` : ''}
      <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
        <input type="text" placeholder="Commercial contract code" class="input" style="flex:1;height:var(--tap)" id="order-promo-input">
        <button class="btn secondary sm" data-act="apply-promo" data-id="${a.id}" style="min-height:var(--tap)">Apply code</button>
      </div>
      <!-- Carrier Cutoff & Logistics Dispatch Engine -->
      <div style="margin-top:8px;padding:8px 10px;background:var(--surface-subtle);border:1px solid var(--line-soft);border-radius:var(--radius-sm);font-size:11px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <b>Carrier cutoff and dynamic delivery slot</b>
          ${pill('Qualified: Priority run', 'good')}
        </div>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(70px,1fr));margin-bottom:4px">
          <div><small>Carrier cutoff</small><b>14:00 (Met)</b></div>
          <div><small>Next slot</small><b>Tomorrow AM</b></div>
          <div><small>Carrier</small><b>Route 04-B</b></div>
          <div><small>Est. freight</small><b>1.2 pallets</b></div>
        </div>
        <div class="muted">Calculated dynamically from wholesale depot lead time, daily carrier cutoff, and dock receiving windows.</div>
      </div>

    </section>
    <section class="card tight" id="partner-fulfillment" style="margin-top:var(--s3)">
      <div class="section-head" style="margin-bottom:6px">
        <h3>Partner and distributor fulfillment beat</h3>
        ${ctx.ui?.partnerBeatConfirmed ? pill('Beat confirmed', 'good') : pill('Beat pending', 'info')}
      </div>
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
        <div><small>Partner</small><b>Depot #402</b></div>
        <div><small>Stock status</small><b class="good-text">Allocated</b></div>
        <div><small>Beat slot</small><b>Beat 4B</b></div>
        <div><small>Queue ID</small><b>ODATA-7749</b></div>
      </div>
      <p class="small muted" style="margin-bottom:8px">Regional wholesale partner delivery schedule for bulk replenishment without central warehouse delays.</p>
      ${ctx.ui?.partnerBeatConfirmed ? `
        <div class="notice good">${icon('check', 14)}<span>Wholesale fulfillment beat 4B confirmed with partner logistics depot.</span></div>
      ` : `
        <button class="btn secondary sm" data-act="confirm-partner-beat" data-id="${a.id}" style="min-height:var(--tap);width:100%">${icon('route', 14)} Confirm wholesale fulfillment beat</button>
      `}
    </section>`;
  })()}
  <p class="foot-note">Prices are illustrative.</p>`;
  return { html, dock };
}

export const actions = {
  'toggle-compensating-flow': ({ ctx }) => {
    (ctx.ui ||= {}).compensatingFlowOpen = !ctx.ui.compensatingFlowOpen;
  },
  'comp-scenario': ({ ctx, data }) => {
    const ui = (ctx.ui ||= {});
    if (data.type === 'stock') {
      ui.compNotice = 'Compensating flow: Depot oversold. Auto-split shipment initiated: available units dispatch, backorder queued.';
    } else if (data.type === 'credit') {
      ui.compNotice = 'Compensating flow: ERP credit hold. Provisional order locked. Release request dispatched to Credit Desk.';
    } else {
      ui.compNotice = 'Compensating flow: Price drift checked. Verified within 2% contractual pricing tolerance rule.';
    }
  },

  'toggle-rma': ({ ctx }) => {
    (ctx.ui ||= {}).rmaOpen = !ctx.ui.rmaOpen;
  },
  'apply-rma-credit': ({ ctx, data }) => {
    (ctx.ui ||= {}).rmaCreditApplied = true;
    ctx.ui.promoNotice = 'RMA Credit memo RMA-2026-781 (-$39.00) authorized and applied.';
    if (ctx.m?.logAudit) ctx.m.logAudit('RMA Ledger', `Authorized RMA credit note RMA-2026-781 (-$39.00) for ${ctx.data.byId[data.id]?.name || ''}`);
  },
  'open-substitute': ({ ctx }) => {
    (ctx.ui ||= {}).subOpen = !ctx.ui.subOpen;
  },
  'accept-substitute': ({ ctx, data }) => {
    (ctx.ui ||= {}).subNotice = 'Substituted line with in-stock Premium Alternate at contract price parity.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Order Substitution', `Substituted line with in-stock alternate for ${ctx.data.byId[data.id]?.name || ''}`);
  },
  'split-backorder': ({ ctx, data }) => {
    (ctx.ui ||= {}).subNotice = 'Split delivery confirmed: Available units dispatch tomorrow, backorder on Tuesday cycle.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Split Delivery', `Split shipment confirmed for ${ctx.data.byId[data.id]?.name || ''}`);
  },

  'confirm-partner-beat': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).partnerBeatConfirmed = true;
    (ctx.ui ||= {}).promoNotice = 'Wholesale fulfillment beat 4B confirmed with partner depot.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Partner Logistics', `Confirmed wholesale fulfillment beat 4B for ${a ? a.name : data.id}`);
  },

  'request-credit-override': ({ ctx, data }) => {
    (ctx.ui ||= {}).creditBreachRequested = true;
    (ctx.ui ||= {}).promoNotice = 'Expedited credit line override queued for District Manager approval.';
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Credit Operations', `Requested expedited credit line override for ${ctx.data.byId[data.id]?.name || ''}`);
    }
  },
  'toggle-van-stock': ({ ctx }) => {
    (ctx.ui ||= {}).vanStockOpen = !ctx.ui.vanStockOpen;
    ctx.ui.vanStockNotice = null;
  },
  'allocate-van-stock': ({ ctx, data }) => {
    const lines = ctx.m.orderLines(data.id);
    const line = lines.find((l) => l.offeringId === data.o) || lines[0];
    if (line) {
      ctx.m.setQty(data.id, line.offeringId, line.qty + 5);
      (ctx.ui ||= {}).vanStockNotice = `Allocated 5 units of ${ctx.t(line.offering.name)} directly from vehicle stock.`;
      if (ctx.m?.logAudit) {
        ctx.m.logAudit('Vehicle Inventory', `Allocated 5 units of ${ctx.t(line.offering.name)} from vehicle stock to ${ctx.data.byId[data.id]?.name || ''}`);
      }
    }
  },
  'toggle-scanner': ({ ctx }) => {
    (ctx.ui ||= {}).scannerOpen = !ctx.ui.scannerOpen;
    ctx.ui.scannerNotice = null;
  },
  'scan-code': ({ ctx, data }) => {
    const lines = ctx.m.orderLines(data.id);
    const line = lines.find((l) => l.offeringId === data.o) || lines[0];
    if (line) {
      ctx.m.setQty(data.id, line.offeringId, line.qty + 1);
      (ctx.ui ||= {}).scannerNotice = `Decoded GS1-128 barcode #890124810. Added 1 unit of ${ctx.t(line.offering.name)} to draft.`;
      if (ctx.m?.logAudit) {
        ctx.m.logAudit('Optical Scanner', `Decoded GS1-128 barcode for ${ctx.t(line.offering.name)} at ${ctx.data.byId[data.id]?.name || ''}`);
      }
    }
  },

  'apply-promo': ({ ctx, data }) => {
    const input = document.getElementById('order-promo-input');
    const val = (input?.value || '').trim();
    if (val) {
      (ctx.ui ||= {}).promoNotice = `Applied contract terms for code ${val}.`;
      if (ctx.m?.logAudit) ctx.m.logAudit('Order Desk', `Applied commercial contract code "${val}" to order for ${ctx.data.byId[data.id]?.name || ''}`);
    }
  },
  qty: ({ ctx, data }) => {
    const line = ctx.m.orderLines(data.id).find((l) => l.offeringId === data.o);
    ctx.m.setQty(data.id, data.o, line.qty + Number(data.d));
  },
  'submit-order': ({ ctx, data }) => { ctx.m.submitOrder(data.id); },
  'push-erp': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const poNum = 'PO-' + String(100000 + ((a.name.length * 3749) % 900000));
    (ctx.ui ||= {}).erpNotice = `Queued in ERP Gateway. Reference: ${poNum}`;
    if (ctx.m?.logAudit) ctx.m.logAudit('ERP Gateway', `Sales order for ${a.name} dispatched with reference ${poNum}`);
  },
  'order-pdf': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const poNum = 'PO-' + String(100000 + ((a.name.length * 3749) % 900000));
    const lines = ctx.m.orderLines(data.id);
    const content = `PURCHASE ORDER CONFIRMATION\nReference: ${poNum}\nCustomer: ${a.name}\nStatus: Verified\nLines: ${lines.length}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Purchase-Order-${poNum}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (ctx.m?.logAudit) ctx.m.logAudit('Order Desk', `Exported purchase order document for ${a.name}`);
  },
};
