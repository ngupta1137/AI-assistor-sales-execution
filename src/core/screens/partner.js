// Partner (X14): only in packs where a partner takes the {order}. The integration model sets
// when {orders} arrive and invoices come back; switching a data feed off shows what each
// capability loses. {Orders} sent by the field appear here. Sample data only.

import { esc, icon, pill } from '../ui.js';
import { roles, MODELS, FEEDS } from '../execution/roles.js';
import { CAPS, exOf } from '../execution/model.js';
import { personFor } from '../personas.js';

export const actions = {
  'partner-model': ({ ctx, data }) => { roles(ctx).setModel(data.model); },
  'partner-feed': ({ ctx, data }) => { roles(ctx).toggleFeed(data.feed); },
  'partner-confirm': ({ ctx }) => { ctx.ui.routeConfirmed = true; roles(ctx).log('partner', 'Confirmed tomorrow\'s route'); },
};

export function render(ctx) {
  const { t, data, fmt, industry, m } = ctx;
  const ex = exOf(industry);
  if (!ex.partner) return `<section class="card"><p>${esc(t('No partner takes the {order} in this industry.'))}</p></section>`;
  const R = roles(ctx);
  const me = personFor(ctx, 'partner');
  const model = R.model();
  const M = MODELS[model];
  const feeds = R.feeds();
  const lost = R.lost();
  const canAct = ctx.persona === 'partner';
  const fromSales = R.salesSubmitted().map((s) => ({ a: data.byId[s.accountId], by: personFor(ctx, 'salesman').name, value: R.lineValue(s.accountId) }));
  const fromRep = data.planned.filter((p) => m.orderState(p.accountId)?.submitted).map((p) => ({ a: data.byId[p.accountId], by: data.rep.name, value: null }));
  const orders = [...fromSales, ...fromRep];
  const models = Object.entries(MODELS).map(([k, v]) => `<button class="seg ${k === model ? 'on' : ''}" data-act="partner-model" data-model="${k}" aria-pressed="${k === model}"${canAct ? '' : ' disabled'} style="min-height:var(--tap);flex:0 1 auto">${esc(t(v.name))}</button>`).join('');
  const feedRows = FEEDS.map(([id, label, caps]) => `<li class="watch-row" data-feed="${id}"><div class="row-main"><b>${esc(t(label))}</b><small>${esc(t('Feeds {caps}', { caps: caps.map((c) => t(CAPS[c].name)).join(', ') }))}</small></div>
    <button class="btn ${feeds[id] ? 'secondary' : 'primary'} sm" data-act="partner-feed" data-feed="${id}" aria-pressed="${feeds[id]}"${canAct ? '' : ' disabled'} style="min-height:var(--tap)">${esc(feeds[id] ? t('On') : t('Off'))}</button></li>`).join('');
  const lostCaps = Object.keys(lost);
  return `
  <section class="page-head"><h1>${esc(me.company)}</h1>
    <p class="muted">${esc(t('{name}, {title}. {Orders} from the field, data shared back, and how the two systems connect.', { name: me.name, title: t(me.title) }))}</p></section>
  <section class="card" id="partner-model" data-model="${model}"><div class="section-head"><h2>${esc(t('Integration model'))}</h2>${pill(t('Designed'), 'info')}</div>
    <div class="seg-ctl" role="group" aria-label="${esc(t('Integration model'))}" style="flex-wrap:wrap">${models}</div>
    <div class="facts"><div><small>${esc(t('{Orders} arrive'))}</small><b id="orders-arrive">${esc(t(M.orders))}</b></div><div><small>${esc(t('Invoices come back'))}</small><b>${esc(t(M.invoices))}</b></div></div>
    <p class="small muted">${esc(t(M.note))}</p></section>
  <section class="card" id="partner-orders"><div class="section-head"><h2>${esc(t('{Orders} received'))}</h2>${pill(String(orders.length), orders.length ? 'good' : 'muted')}</div>
    ${orders.length ? `<ul class="watch-list">${orders.map((o) => `<li class="watch-row"><div class="row-main"><b>${esc(o.a.name)}</b><small>${esc(t('From {by}. Arrives: {when}', { by: o.by, when: t(M.orders).toLowerCase() }))}</small></div>${o.value ? `<b class="small">${esc(fmt.money(o.value))}</b>` : ''}</li>`).join('')}</ul>` : `<p class="small muted">${esc(t('None yet. {Orders} sent from the field appear here.'))}</p>`}</section>
  <section class="card" id="partner-feeds"><div class="section-head"><h2>${esc(t('Data shared back'))}</h2></div>
    <ul class="watch-list">${feedRows}</ul>
    ${lostCaps.length ? `<div class="notice warn" id="feeds-lost">${icon('sync', 18)}<span>${esc(t('With these feeds off: {list}.', { list: lostCaps.map((c) => t(CAPS[c].name)).join(', ') }))} ${esc(t('They run with lower confidence until the feed is back. Reps see the warning on Account 360.'))}</span></div>` : `<p class="small muted">${esc(t('All feeds on. Every capability has the partner data it needs.'))}</p>`}</section>
  <section class="card" id="partner-route"><h2>${esc(t('Tomorrow\'s route'))}</h2>
    <p class="small">${esc(t('Visit Planning proposes the route. The {partner} confirms it, so deliveries and {visits} line up.', { partner: ex.partner }))}</p>
    ${ctx.ui.routeConfirmed ? `<p class="small good-text" id="route-confirmed">${esc(t('Confirmed.'))}</p>` : canAct ? `<button class="btn primary block" data-act="partner-confirm" id="partner-confirm" style="min-height:var(--tap)">${esc(t('Confirm the route'))}</button>` : ''}</section>`;
}
