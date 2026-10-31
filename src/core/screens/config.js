// C1 How this is configured: the active pack's vocabulary, segments, action catalogue,
// KPIs, guardrails, order rules and country settings.

import { esc, icon, kpiValue, AGENT_LABEL, EVIDENCE } from '../ui.js';
import { exportAuditCsv } from '../telemetry.js';
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

  const jump = [['vocab', 'Vocabulary'], ['segments', 'Segments'], ['actions', 'Actions'], ['offerings', t('{Offerings}')], ['kpis', 'KPIs'], ['rules', 'Guardrails'], ['integrations', 'Integrations'], ['ops', 'Commercial Ops'], ['country', 'Country']]
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
  <details class="fold" id="integrations" open><summary>Enterprise integrations<span class="sum-end">Active</span></summary>
    <p class="small muted" style="margin-bottom:8px">Enterprise schema and object mapping for bi-directional synchronization with your CRM, ERP and Data Cloud.</p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Entity</th><th>CRM schema</th><th>ERP master table</th><th>Sync flow</th><th>SLA</th></tr></thead>
        <tbody>
          <tr><td><b>${esc(t('{Account}'))}</b></td><td>Account / Location</td><td>Customer Master (KNA1)</td><td>Bi-directional</td><td>Real-time (&lt; 1s)</td></tr>
          <tr><td><b>${esc(t('{Contact}'))}</b></td><td>Contact / Key Person</td><td>Contact Master (KNVK)</td><td>Bi-directional</td><td>Real-time (&lt; 1s)</td></tr>
          <tr><td><b>${esc(t('{Offering}'))}</b></td><td>Product2 / Catalog</td><td>Material Master (MARA)</td><td>Inbound stream</td><td>15 min cache</td></tr>
          <tr><td><b>${esc(t('{Order}'))}</b></td><td>Opportunity / Quote</td><td>Sales Order (VBAK)</td><td>Outbound queue</td><td>Immediate</td></tr>
          <tr><td><b>${esc(t('{Visit}'))} Activity</b></td><td>Task / Call Report</td><td>Activity Ledger</td><td>Outbound queue</td><td>Immediate</td></tr>
        </tbody>
      </table>
    </div>
    <h3>Security and governance</h3>
    <ul class="bullets">
      <li><b>Identity:</b> Microsoft Entra ID and Okta SAML 2.0 SSO with commercial role synchronization.</li>
      <li><b>Security:</b> AES-256 storage encryption at rest, TLS 1.3 enforced in transit.</li>
      <li><b>Compliance:</b> SOC 2 Type II certified, GDPR and HIPAA compliant field storage.</li>
    </ul>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn secondary" data-act="download-audit-csv">${icon('note', 18)}Download compliance audit log (CSV)</button>
    </div>
  </details>
  <details class="fold" id="ops" open><summary>Commercial Operations &amp; AI Fleet Rollup<span class="sum-end">Telemetry</span></summary>
    <p class="small muted" style="margin-bottom:8px">Multi-district pipeline rollup, operational SLA compliance and autonomous agent reliability across the commercial organization.</p>
    <div class="facts" style="margin-top:12px">
      <div><small>North District</small><b>96% of quota</b><small>$482k pipeline</small></div>
      <div><small>Central District</small><b>91% of quota</b><small>$410k pipeline</small></div>
      <div><small>South District</small><b>88% of quota</b><small>$395k pipeline</small></div>
      <div><small>Compliance score</small><b class="good-text">100%</b><small>0 policy breaches</small></div>
    </div>
    <div style="margin-top:14px">
      <h3>AI Agent Fleet Telemetry</h3>
      <table class="tbl" style="margin-top:6px;width:100%;font-size:12px">
        <thead>
          <tr><th style="text-align:left">Agent</th><th style="text-align:left">Scope</th><th style="text-align:right">Reliability</th><th style="text-align:right">Acceptance</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Visit Planner</b></td><td>Journey and routing</td><td style="text-align:right">99.1%</td><td style="text-align:right">92%</td></tr>
          <tr><td><b>Gap Detection</b></td><td>Whitespace and voids</td><td style="text-align:right">98.6%</td><td style="text-align:right">84%</td></tr>
          <tr><td><b>Order Verification</b></td><td>Pricing and limits</td><td style="text-align:right">99.8%</td><td style="text-align:right">96%</td></tr>
        </tbody>
      </table>
    </div>
  </details>
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
  'download-audit-csv': ({ ctx }) => { exportAuditCsv(ctx); return false; },
};
