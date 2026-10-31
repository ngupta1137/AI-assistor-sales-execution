// C1 How this is configured: the active pack's vocabulary, segments, action catalogue,
// KPIs, guardrails, order rules and country settings.

import { esc, icon, kpiValue, AGENT_LABEL, EVIDENCE } from '../ui.js';
import { upcomingEvents, localPrice } from '../../data/generate.js';

const GENERIC = [
  ['Account', 'account'], ['Contact', 'contact'], ['Field rep', 'rep'], ['Field manager', 'manager'],
  ['Key account manager', 'kam'], ['Offering', 'offering'], ['Order or proposal', 'order'], ['Visit', 'visit'],
];

export function render(ctx) {
  const { t, fmt, industry, country, data } = ctx;
  const vocab = GENERIC.map(([g, k]) => `<tr><td class="muted">${esc(g)}</td><td><b>${esc(t(`{${k}}`))}</b></td></tr>`).join('');
  const segs = industry.segments.map((s) => `<li class="row"><span class="row-main"><b>${esc(t(s.name))}</b>
    <small>${esc(t(s.style))}</small><small class="row-meta">${s.visitMinutes[0]} to ${s.visitMinutes[1]} min · ${esc(s.types.map((x) => t(x.type)).join(', '))}</small></span></li>`).join('');
  const acts = industry.actions.map((a) => `<tr><td><b>${esc(t(a.type))}</b></td><td>${esc(AGENT_LABEL[a.agent])}</td><td>${a.effort} min</td><td>${esc(EVIDENCE[a.evidence].label)}</td></tr>`).join('');
  const kpis = industry.kpis.map((k) => `<tr><td>${esc(t(k.label))}</td><td>${k.lowerIsBetter ? 'At most' : 'At least'} ${esc(kpiValue(k, k.target, fmt))}</td></tr>`).join('');
  const offerings = industry.offerings.map((o) => `<tr><td>${esc(t(o.name))}</td><td>${esc(t(o.category))}</td><td>${esc(o.status)}</td></tr>`).join('');
  const rules = industry.orderRules.map((r) => `<li>${esc(t(r.text, { limit: r.amount != null ? fmt.money(localPrice(r.amount, country)) : '', max: r.max ?? '', lines: '' }))}</li>`).join('');
  const events = upcomingEvents(country, fmt.today).slice(0, 4).map((e) => `<li><b>${esc(e.name)}</b> <small class="muted">${esc(fmt.dateShort(e.date))} · ${esc(e.note)}</small></li>`).join('');

  const jump = [['vocab', 'Vocabulary'], ['segments', 'Segments'], ['actions', 'Actions'], ['offerings', t('{Offerings}')], ['kpis', 'KPIs'], ['rules', 'Guardrails'], ['country', 'Country']]
    .map(([id, label]) => `<a href="#/config" data-act="jump" data-id="${id}">${esc(label)}</a>`).join('');
  return `
  <section class="page-head">
    <h1>How this is configured</h1>
    <p class="small muted">${esc(industry.name)} pack with the ${esc(country.name)} country pack. Same product, same workflow. Only the configuration changes.</p>
  </section>
  <nav class="jump tight" aria-label="Sections">${jump}</nav>
  <details class="fold" id="vocab" open><summary>Vocabulary</summary><table class="tbl"><thead><tr><th>Product term</th><th>Your term</th></tr></thead><tbody>${vocab}</tbody></table></details>
  <details class="fold" id="segments"><summary>Segments<span class="sum-end">${industry.segments.length}</span></summary><ul class="group">${segs}</ul></details>
  <details class="fold" id="actions"><summary>${esc(t('Action catalog'))}<span class="sum-end">${industry.actions.length}</span></summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Agent</th><th>Effort</th><th>Evidence</th></tr></thead><tbody>${acts}</tbody></table></div></details>
  <details class="fold" id="offerings"><summary>${esc(t('{Offerings}'))}<span class="sum-end">${industry.offerings.length}</span></summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Category</th><th>Status</th></tr></thead><tbody>${offerings}</tbody></table></div></details>
  <details class="fold" id="kpis"><summary>KPIs<span class="sum-end">${industry.kpis.length}</span></summary><table class="tbl"><tbody>${kpis}</tbody></table></details>
  <details class="fold" id="rules"><summary>Guardrails</summary><ul class="guards">${industry.guardrails.map((g) => `<li>${icon('shield', 16)} ${esc(t(g.text))}</li>`).join('')}</ul>
    <h3>${esc(t('{Order} rules'))}</h3><ul class="bullets">${rules}</ul></details>
  <details class="fold" id="country"><summary>Country: ${esc(country.name)}</summary>
    <table class="tbl"><tbody>
      <tr><td class="muted">Currency</td><td>${esc(country.currency)} · ${esc(fmt.money(1234567))} · ${esc(fmt.moneyShort(12345678))}</td></tr>
      <tr><td class="muted">Unit price</td><td>${esc(fmt.price(19.5 * country.priceFactor))}</td></tr>
      <tr><td class="muted">Date</td><td>${esc(fmt.date(fmt.today))}</td></tr>
      <tr><td class="muted">Distance</td><td>${esc(fmt.distance(12.4))}</td></tr>
      <tr><td class="muted">Territory city</td><td>${esc(data.city.name)}</td></tr>
    </tbody></table>
    <h3>Upcoming local events</h3><ul class="bullets">${events}</ul>
    <ul class="bullets muted">${country.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <p class="small muted">Event dates are approximate.</p>
  </details>
  <a class="btn secondary block" href="#/problems" id="open-problems">${icon('bulb', 20)}Problems we solve</a>
  <div class="notice good">${icon('check', 18)}<span><b>This is a configuration, not a custom build.</b> Adding an industry or a country means adding one pack file.</span></div>`;
}

export const actions = {
  jump: ({ data }) => { const el = document.getElementById(data.id); if (el) { el.open = true; el.scrollIntoView({ block: 'start' }); } return false; },
};
