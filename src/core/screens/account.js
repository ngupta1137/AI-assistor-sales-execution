// R3 Account 360: profile, contacts, potential and tier, last visits, open gaps, order history, pack KPIs.

import { esc, icon, pill, bar, kpiValue, kpiOk } from '../ui.js';
import { typeLine } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, industry } = ctx;
  const a = data.byId[accountId] || data.accounts[0];
  const p = m.plannedFor(a.id);
  const gaps = p ? p.actions : [];

  const contacts = a.contacts.map((c) => `<li class="row static">
    <span class="avatar sm">${esc(c.name.replace(/^\S+\.\s/, '').split(' ').map((w) => w[0]).slice(0, 2).join(''))}</span>
    <span class="row-main"><b>${esc(c.name)}</b><small>${esc(t(c.role))}${c.primary ? ' · main contact' : ''}</small>
    <small class="row-meta">${esc(c.phone)} · ${esc(t(c.preference))} · last spoke ${esc(fmt.daysAgo(c.lastContactDays))}</small></span></li>`).join('');

  const kpis = industry.kpis.map((k) => {
    const v = a.kpis[k.id];
    const ok = kpiOk(k, v);
    return `<div class="kpi"><small>${esc(t(k.label))}</small><b>${esc(kpiValue(k, v, fmt))}</b>
      <small class="${ok ? 'ok-text' : 'warn-text'}">Target ${esc(kpiValue(k, k.target, fmt))}</small></div>`;
  }).join('');

  const gapList = gaps.length ? gaps.map((g) => `<li><a class="row" href="#/action/${g.id}">
      <span class="row-main"><b>${esc(t(g.title, g.vars))}</b><small>${esc(t(g.type))} · ${esc(fmt.money(g.value))} · ${g.effort} min</small></span>${icon('chevron', 16)}</a></li>`).join('')
    : `<li class="empty">${esc(t('No open gaps. This {account} is not on today\'s plan.'))}</li>`;

  const visits = a.history.map((h) => `<li class="row static"><span class="row-main">
    <b>${esc(fmt.date(fmt.dayOffset(-h.daysAgo)))}</b><small>${esc(t(h.note, h.vars))}</small></span>
    <small class="muted">${esc(fmt.daysAgo(h.daysAgo))}</small></li>`).join('');

  const orders = a.orderHistory.map((o) => `<li class="row static"><span class="row-main">
    <b>${esc(fmt.money(o.total))}</b><small>${o.lines} lines</small></span>
    <small class="muted">${esc(fmt.date(fmt.dayOffset(-o.daysAgo)))}</small></li>`).join('');

  return `
  <a class="back" href="${p ? `#/brief/${a.id}` : '#/today'}">${icon('back', 18)} ${p ? esc(t('{Visit} brief')) : 'Back'}</a>
  <section class="brief-head">
    <small class="eyebrow">${esc(t('{Account} 360'))}</small>
    <h1>${esc(a.name)}</h1>
    <p class="muted">${esc(typeLine(t, a))} · ${pill(`Tier ${a.tier}`, a.tier === 'A' ? 'good' : a.tier === 'B' ? 'info' : 'muted')}</p>
    <p class="small">${icon('pin', 14)} ${esc(a.address)}</p>
    <p class="small">${icon('clock', 14)} Open ${esc(fmt.time(a.hours[0]))} to ${esc(fmt.time(a.hours[1]))} · last ${esc(t('{visit}'))} ${esc(fmt.daysAgo(a.lastVisitDays))}</p>
  </section>

  <section class="card">
    <div class="section-head"><h2>Potential</h2>${pill(`Score ${a.score} of 100`, 'info')}</div>
    <div class="cards3">
      <div><small>Potential a year</small><b>${esc(fmt.moneyShort(a.potential))}</b></div>
      <div><small>Current a year</small><b>${esc(fmt.moneyShort(a.current))}</b></div>
      <div><small>White space</small><b>${esc(fmt.moneyShort(a.whiteSpace))}</b></div>
    </div>
    ${bar(a.current, a.potential)}
    <p class="small muted">Share of potential captured: ${fmt.pct(Math.round((a.current / a.potential) * 100))}. Confidence: medium, based on similar ${esc(t('{accounts}'))} in ${esc(a.city)}.</p>
  </section>

  <section><h2>KPIs</h2><div class="kpis">${kpis}</div></section>
  <section><h2>${esc(t('{Contacts}'))}</h2><ul class="list">${contacts}</ul></section>
  <section><h2>Open gaps</h2><ul class="list">${gapList}</ul></section>
  <section><h2>${esc(t('Last {visits}'))}</h2><ul class="list">${visits}</ul></section>
  <section><h2>${esc(t('{Order} history'))}</h2><ul class="list">${orders}</ul></section>
  <p class="foot-note">Sample data.</p>`;
}
