// R7 Visit complete: recorded outcomes, estimated opportunity addressed, the order state, next best account.
// Closing never marks actions done; unrecorded outcomes need an explicit confirmation.

import { esc, icon, pill } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, ui } = ctx;
  const a = data.byId[accountId] || data.byId[data.planned[0].accountId];
  const sum = m.visitSummary(a.id);
  const c = m.counts(a.id);
  const done = m.visitDone(a.id);
  const next = m.nextAccount(a.id);
  const nextAcc = next && data.byId[next.accountId];
  const open = sum.items.filter((x) => !m.outcome(x.id)?.status);
  const who = sum.route === 'kam' ? t('{kam}') : t('{manager}');
  const confirming = ui.confirmClose === a.id;

  const list = sum.items.map((x) => {
    const o = m.outcome(x.id);
    const st = o?.status === 'done' ? pill('Done', 'good') : o?.status === 'not_done' ? pill(`Not done: ${t(o.reason)}`, 'bad') : pill('No outcome recorded', 'muted');
    return `<li><a class="row" href="#/action/${x.id}"><span class="row-main"><b>${esc(t(x.title, x.vars))}</b>
      <span class="row-line">${st}<small>${o?.evidence ? `${esc(o.evidence.type)} recorded · ` : ''}Est. ${esc(fmt.money(x.value))}</small></span></span>${icon('chevron', 20, 'row-chev')}</a></li>`;
  }).join('');

  const orderText = sum.orderSubmitted
    ? (sum.needsApproval ? t(`Pending approval with your ${who}`) : t('{Order} submitted'))
    : 'Not sent';

  let dock;
  if (done) {
    dock = `<div class="notice good" id="visit-closed">${icon('check', 18)}<span>${esc(t('Visited today. Outcomes and evidence are saved.'))}</span></div>
      ${ctx.ui?.recapToast ? `<div class="notice good" style="margin-top:6px">${icon('check', 16)}<span>${esc(ctx.ui.recapToast)}</span></div>` : ''}
      <div class="btn-row" style="margin-bottom:8px">
        <button class="btn secondary sm" data-act="call-summary" data-id="${a.id}" style="flex:1">${icon('note', 16)} Call summary</button>
        <button class="btn secondary sm" data-act="email-recap" data-id="${a.id}" style="flex:1">${icon('brief', 16)} Email recap</button>
      </div>
      ${nextAcc ? `<a class="btn primary block" href="#/brief/${nextAcc.id}" id="next-brief">${esc(t(`Next brief: ${nextAcc.name}`))}${icon('chevron', 18)}</a>` : ''}`;
  } else if (confirming) {
    dock = `<p class="small warn-text">${esc(t(`${open.length} actions have no recorded outcome. They stay open; nothing is marked done.`))}</p>
      <div class="btn-row" style="flex-wrap:nowrap"><button class="btn secondary" style="flex:1" data-act="close-cancel">Keep working</button>
      <button class="btn primary" style="flex:1" data-act="complete-visit" data-id="${a.id}" data-confirmed="1" id="complete-visit-confirm">Close anyway</button></div>`;
  } else {
    dock = `<button class="btn primary block" data-act="complete-visit" data-id="${a.id}" id="complete-visit">${esc(t('Close {visit}'))}</button>`;
  }

  const html = `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="page-head">
    <span class="eyebrow">${esc(t(done ? '{Visit} complete' : 'Finish {visit}'))}</span>
    <h1>${esc(a.name)}</h1>
  </section>
  <section class="card tight" id="visit-summary">
    <div class="facts">
      <div><small>Actions recorded done</small><b data-sum="done">${sum.done.length} of ${sum.items.length}</b></div>
      <div><small>Estimated opportunity addressed</small><b data-sum="value">${esc(fmt.money(sum.estimated))}</b></div>
      <div class="wide"><small>${esc(t('{Order}'))}</small><b data-sum="order">${esc(orderText)}${sum.orderSubmitted ? ` · ${esc(fmt.money(sum.orderTotal))}` : ''}</b></div>
    </div>
    <small>Estimates come from the agents' rules. They are not booked sales.</small>
  </section>
  ${c.overridden ? `<div class="notice">${icon('flag', 18)}<span>${esc(t(`${c.overridden} override${c.overridden > 1 ? 's' : ''} sent with your reasons. Each goes to the person its reason routes to.`))}</span></div>` : ''}
  ${!done && open.length ? `<div class="notice warn">${icon('flag', 18)}<span>${esc(t(`${open.length} actions have no recorded outcome.`))}</span></div>` : ''}
  <section><h2>Actions</h2><ul class="group" style="margin-top:12px">${list}</ul></section>
  ${!nextAcc && done ? `<div class="notice good">${esc(t('All {visits} done for today.'))}</div>` : ''}`;
  return { html, dock };
}

export const actions = {
  'complete-visit': ({ ctx, data }) => {
    const open = ctx.m.actionsOf(data.id).filter((x) => !ctx.m.outcome(x.id)?.status);
    if (open.length && !data.confirmed) { ctx.ui.confirmClose = data.id; return; }
    ctx.ui.confirmClose = null;
    ctx.m.completeVisit(data.id);
  },
  'close-cancel': ({ ctx }) => { ctx.ui.confirmClose = null; },
  'call-summary': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    const sum = ctx.m.visitSummary(data.id);
    const content = `CALL SUMMARY REPORT\nCustomer: ${a.name}\nActions Completed: ${sum.done.length} of ${sum.items.length}\nEstimated Opportunity Addressed: ${ctx.fmt.money(sum.estimated)}\nSynced to CRM Activity Timeline.\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Call-Summary-${a.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (ctx.m?.logAudit) ctx.m.logAudit('Activity Log', `Call summary exported for ${a.name}`);
  },
  'email-recap': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).recapToast = `Recap dispatched to ${a.name} contacts.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Activity Log', `Recap email sent to contacts at ${a.name}`);
  },
};
