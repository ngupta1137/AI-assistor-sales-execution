// R3 Account 360: current work first (open gaps, recorded outcomes), then potential, KPIs, contacts and history.

import { esc, icon, pill, bar, kpiValue, kpiOk, typeLine } from '../ui.js';

export function render(ctx, [accountId]) {
  const { t, fmt, data, m, industry } = ctx;
  const a = data.byId[accountId] || data.accounts[0];
  const p = m.plannedFor(a.id);
  const open = p ? m.openGaps(a.id) : [];
  const recorded = p ? m.doneGaps(a.id) : [];
  const last = m.lastVisitDays(a.id);

  const gapRow = (g) => {
    const o = m.outcome(g.id);
    const st = o?.status === 'not_done' ? pill(`Not done: ${t(o.reason)}`, 'bad') : m.decision(g.id)?.status === 'overridden' ? pill('Overridden', 'muted') : '';
    return `<li><a class="row" href="#/action/${g.id}"><span class="row-main"><b>${esc(t(g.title, g.vars))}</b>
      <small>${esc(t(g.type))} · Est. ${esc(fmt.money(g.value))} · ${g.effort} min</small>${st ? `<span class="row-line">${st}</span>` : ''}</span>${icon('chevron', 20, 'row-chev')}</a></li>`;
  };
  const gapList = !p ? `<li class="empty">${esc(t('This {account} is not on today\'s plan.'))}</li>`
    : open.length ? open.map(gapRow).join('') : `<li class="empty">${esc(t('No open gaps. Every action here has a recorded outcome.'))}</li>`;

  const kpis = industry.kpis.filter((k) => a.kpis[k.id] != null).map((k) => {
    const v = a.kpis[k.id];
    const okk = kpiOk(k, v);
    return `<li><span class="small">${esc(t(k.label))}</span><span class="kv"><b>${esc(kpiValue(k, v, fmt))}</b>
      <small class="${okk ? 'ok-text' : 'warn-text'}">${icon(okk ? 'check' : 'flag', 14)} ${okk ? 'On target' : k.lowerIsBetter ? 'Above limit' : 'Below target'} · ${esc(kpiValue(k, k.target, fmt))}</small></span></li>`;
  }).join('');

  const contacts = a.contacts.map((c) => `<li class="row">
    <span class="avatar">${esc(c.name.replace(/^\S+\.\s/, '').split(' ').map((w) => w[0]).slice(0, 2).join(''))}</span>
    <span class="row-main"><b>${esc(c.name)}</b><small>${esc(t(c.role))}${c.primary ? ' · main contact' : ''}</small>
    <small>${esc(c.phone)} · ${esc(t(c.preference))} · last spoke ${esc(fmt.daysAgo(c.lastContactDays))}</small></span></li>`).join('');

  const visits = a.history.map((h) => `<li class="row"><span class="row-main">
    <b>${esc(fmt.date(fmt.dayOffset(-h.daysAgo)))}</b><small>${esc(t(h.note, h.vars))}</small></span>
    <small>${esc(fmt.daysAgo(h.daysAgo))}</small></li>`).join('');

  const orders = a.orderHistory.map((o) => `<li class="row"><span class="row-main">
    <b class="money">${esc(fmt.money(o.total))}</b><small>${o.lines} lines</small></span>
    <small>${esc(fmt.date(fmt.dayOffset(-o.daysAgo)))}</small></li>`).join('');

  return `
  <a class="back" href="${p ? `#/brief/${a.id}` : '#/today'}">${icon('back', 18)} ${p ? esc(t('{Visit} brief')) : 'Back'}</a>
  <section class="page-head">
    <span class="eyebrow">${esc(t('{Account} 360'))}</span>
    <h1>${esc(a.name)}</h1>
    <p class="small muted">${esc(typeLine(t, a))} · Tier ${a.tier}</p>
    <p class="small">${esc(a.address)}</p>
    <p class="small">Open ${esc(fmt.time(a.hours[0]))} to ${esc(fmt.time(a.hours[1]))} · ${last === 0 ? esc(t('Visited today')) : `last ${esc(t('{visit}'))} ${esc(fmt.daysAgo(last))}`}</p>
  </section>

  <section><div class="section-head"><h2>Open gaps</h2>${p ? pill(`${open.length} open`, open.length ? 'warn' : 'good') : ''}</div>
    <ul class="group" id="open-gaps">${gapList}</ul></section>
  ${recorded.length ? `<section><h2>Recorded this visit</h2><ul class="group" style="margin-top:12px" id="recorded-gaps">${recorded.map((g) => `<li><a class="row" href="#/action/${g.id}"><span class="row-main"><b>${esc(t(g.title, g.vars))}</b><span class="row-line">${pill('Done', 'good')}</span></span>${icon('chevron', 20, 'row-chev')}</a></li>`).join('')}</ul></section>` : ''}

  <section class="card">
    <div class="section-head"><h2>Potential</h2>${pill(`Score ${a.score} of 100`, 'info')}</div>
    <div class="stat-row"><span class="small muted">Potential a year</span><b class="stat-md">${esc(fmt.moneyShort(a.potential))}</b></div>
    <div class="facts">
      <div><small>Current a year</small><b>${esc(fmt.moneyShort(a.current))}</b></div>
      <div><small>White space</small><b>${esc(fmt.moneyShort(a.whiteSpace))}</b></div>
    </div>
    ${bar(a.current, a.potential)}
    <small>${fmt.pct(Math.round((a.current / a.potential) * 100))} of potential captured. Medium confidence, based on similar ${esc(t('{accounts}'))} in ${esc(a.city)}.</small>
  </section>

  <section class="card"><h2>KPIs</h2><ul class="kpi-list">${kpis}</ul></section>
  <section><h2>${esc(t('{Contacts}'))}</h2><ul class="group" style="margin-top:12px">${contacts}</ul></section>
  <section><h2>${esc(t('Last {visits}'))}</h2><ul class="group" style="margin-top:12px">${visits}</ul></section>
  <section><h2>${esc(t('{Order} history'))}</h2><ul class="group" style="margin-top:12px">${orders}</ul></section>
  <p class="foot-note">Sample data.</p>`;
}
