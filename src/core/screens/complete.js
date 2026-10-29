// R7 Visit complete: actions done, value captured, the order, next best account.

import { esc, icon, pill } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m } = ctx;
  const a = data.byId[accountId] || data.byId[data.planned[0].accountId];
  const p = m.plannedFor(a.id);
  const sum = m.visitSummary(a.id);
  const c = m.counts(a.id);
  const done = m.visitDone(a.id);
  const next = m.nextAccount(a.id);
  const nextAcc = next && data.byId[next.accountId];
  const open = sum.items.filter((x) => !m.outcome(x.id)?.status);

  const list = sum.items.map((x) => {
    const o = m.outcome(x.id);
    const st = o?.status === 'done' ? pill('Done', 'good') : o?.status === 'not_done' ? pill(`Not done: ${t(o.reason)}`, 'bad') : pill('No outcome yet', 'muted');
    return `<li><a class="row" href="#/action/${x.id}"><span class="row-main"><b>${esc(t(x.title, x.vars))}</b><small>${esc(fmt.money(x.value))}</small></span>${st}</a></li>`;
  }).join('');

  return `
  <a class="back" href="#/brief/${a.id}">${icon('back', 18)} ${esc(t('{Visit} brief'))}</a>
  <section class="brief-head">
    <small class="eyebrow">${esc(t(done ? '{Visit} complete' : 'Finish {visit}'))}</small>
    <h1>${esc(a.name)}</h1>
  </section>
  <section class="cards3 card" id="visit-summary">
    <div><small>Actions done</small><b data-sum="done">${sum.done.length} of ${sum.items.length}</b></div>
    <div><small>Value captured</small><b data-sum="value">${esc(fmt.money(sum.value))}</b></div>
    <div><small>${esc(t('{Order}'))}</small><b data-sum="order">${sum.orderSubmitted ? esc(fmt.money(sum.orderTotal)) : 'Not sent'}</b></div>
  </section>
  ${sum.needsApproval ? `<div class="notice warn">${esc(t('{Order} waiting for {manager} approval.'))}</div>` : ''}
  ${c.overridden ? `<div class="notice">${esc(t(`${c.overridden} override${c.overridden > 1 ? 's' : ''} sent to your {manager} with your reasons.`))}</div>` : ''}
  <section><h2>Actions</h2><ul class="list">${list}</ul></section>
  ${!done ? `${open.length ? `<p class="small muted">${open.length} actions have no outcome. They will show as not recorded.</p>` : ''}
    <button class="btn primary block" data-act="complete-visit" data-id="${a.id}" id="complete-visit">${esc(t('Close {visit}'))}</button>`
    : `<div class="notice good" id="visit-closed">${icon('check', 18)} ${esc(t('{Visit} closed. Evidence and outcomes are saved.'))}</div>`}
  ${nextAcc ? `<section class="card next">
      <small class="eyebrow">${esc(t('Next best {account}'))}</small>
      <b>${esc(nextAcc.name)}</b>
      <small class="muted">${esc(t(nextAcc.type))} · ${esc(fmt.time(next.start))} · ${esc(fmt.moneyShort(next.opportunity))} at stake</small>
      <a class="btn ghost block" href="#/brief/${nextAcc.id}" id="next-brief">Open next brief ${icon('chevron', 16)}</a>
    </section>` : `<div class="notice good">${esc(t('All {visits} done for today.'))}</div>`}
  <p class="foot-note">Sample data.${p ? '' : ''}</p>`;
}

export const actions = {
  'complete-visit': ({ ctx, data }) => { ctx.m.completeVisit(data.id); },
};
