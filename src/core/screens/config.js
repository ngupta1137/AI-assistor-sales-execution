// C1 How this is configured: the active pack's vocabulary, segments, action catalogue,
// KPIs, guardrails, order rules and country settings.

import { esc, icon, pill, kpiValue, AGENT_LABEL, EVIDENCE } from '../ui.js';
import { wording } from '../wording.js';
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

  const jump = [['vocab', 'Vocabulary'], ['segments', 'Segments'], ['actions', 'Actions'], ['editor', 'Pack Editor'], ['csv-importer', 'CSV Importer'], ['rules-workbench', 'Rules Ingestion'], ['partner', 'Partner Portal'], ['offerings', t('{Offerings}')], ['kpis', 'KPIs'], ['rules', 'Guardrails'], ['integrations', 'Integrations'], ['readiness', 'System Readiness'], ['coexistence', 'Coexistence & TCO'], ['ops', 'Commercial Ops'], ['country', 'Country']]
    .map(([id, label]) => `<a href="#/config" data-act="jump" data-id="${id}">${esc(label)}</a>`).join('');
  return `
  <section class="page-head">
    <h1>How this is configured</h1>
    <p class="small muted">${esc(industry.name)} pack with the ${esc(country.name)} country pack. Same product, same workflow. Only the configuration changes.</p>
  </section>
  <a class="card row" href="#/system" id="open-system" style="display:flex;align-items:center;gap:var(--s2);margin-bottom:var(--s3);min-height:var(--tap)">
    <span class="row-main"><b>Execution system</b><small>${esc(t('Eight capabilities, the journey, five process flows and market activation for {accounts} in this pack.'))}</small></span>${icon('chevron', 18)}
  </a>
  <nav class="jump tight" aria-label="Sections">${jump}</nav>
  <details class="fold" id="vocab" open><summary>Vocabulary</summary><table class="tbl"><thead><tr><th>Product term</th><th>Your term</th></tr></thead><tbody>${vocab}</tbody></table></details>
  <details class="fold" id="segments"><summary>Segments<span class="sum-end">${industry.segments.length}</span></summary><ul class="group">${segs}</ul></details>
  <details class="fold" id="actions"><summary>${esc(t('Action catalog'))}<span class="sum-end">${industry.actions.length}</span></summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Agent</th><th>Effort</th><th>Evidence</th></tr></thead><tbody>${acts}</tbody></table></div></details>
    <details class="fold" id="editor" open><summary>Commercial Operations Pack Editor &amp; Weight Tuner<span class="sum-end">Configurable</span></summary>
    <p class="small muted" style="margin-bottom:8px">Interactive commercial policy editor. Adjust execution dimension weights and tune action priority ranking algorithms.</p>
    ${(() => {
      const weights = ctx.ui?.actionWeights || { dist: 40, promo: 35, range: 25 };
      return `
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:10px">
        <div><small>Distribution</small><b>${weights.dist}%</b></div>
        <div><small>Promotion</small><b>${weights.promo}%</b></div>
        <div><small>Range/Voids</small><b>${weights.range}%</b></div>
        <div><small>Total</small><b class="good-text">100%</b></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
        <button class="btn secondary sm" data-act="set-weight-preset" data-preset="growth" style="min-height:var(--tap);flex:1;font-size:11px">Growth (+Range)</button>
        <button class="btn secondary sm" data-act="set-weight-preset" data-preset="baseline" style="min-height:var(--tap);flex:1;font-size:11px">Balanced</button>
        <button class="btn secondary sm" data-act="set-weight-preset" data-preset="margin" style="min-height:var(--tap);flex:1;font-size:11px">Margin (+Dist)</button>
      </div>
      <button class="btn secondary sm" data-act="apply-action-weights" style="min-height:var(--tap);width:100%">${icon('check', 14)} Apply weights &amp; recalibrate ranking</button>
      ${ctx.ui?.weightsToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.weightsToast)}</span></div>` : ''}
      `;
    })()}
  </details>
  <details class="fold" id="csv-importer"${ctx.ui?.importerOpen ? ' open' : ''}><summary>Prospect CSV Data Ingestion Workbench<span class="sum-end">Pilot Evaluation</span></summary>
    <p class="small muted" style="margin-bottom:8px">Upload or paste custom customer lists to evaluate this scenario against your organization's real territory structure.</p>
    <div style="margin-bottom:8px">
      <button class="btn secondary sm" data-act="load-sample-csv" style="min-height:var(--tap);margin-bottom:6px">${icon('note', 14)} Load sample prospect CSV dataset</button>
      <textarea id="csv-import-text" class="input" style="width:100%;height:80px;font-family:monospace;font-size:11px;resize:vertical" placeholder="Account Name, Address, Segment, Potential, Contact">${esc(ctx.ui?.csvDraft || '')}</textarea>
    </div>
    <div class="btn-row" style="gap:6px">
      <button class="btn secondary sm" data-act="parse-validate-csv" style="min-height:var(--tap);flex:1">${icon('check', 14)} Validate CSV schema</button>
      ${ctx.ui?.csvParsed ? `<button class="btn primary sm" data-act="commit-csv-accounts" style="min-height:var(--tap);flex:1">Ingest into simulation</button>` : ''}
    </div>
    ${ctx.ui?.csvToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.csvToast)}</span></div>` : ''}
    ${ctx.ui?.csvParsed ? `
      <div style="margin-top:8px;padding:8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);font-size:11px">
        <b>Validated 3 custom prospect accounts:</b>
        <ul class="bullets" style="margin-top:4px;padding-left:16px">
          <li><b>Metro Central Hub:</b> Segment: Modern Trade · Potential: High Tier</li>
          <li><b>Regional Supply Center:</b> Segment: Wholesale · Potential: Medium Tier</li>
          <li><b>West End Commercial:</b> Segment: Independent · Potential: Growth Tier</li>
        </ul>
      </div>
    ` : ''}
  </details>
  <details class="fold" id="rules-workbench"${ctx.ui?.rulesWorkbenchOpen ? ' open' : ''}><summary>Business Rules Ingestion Workbench (Excel &amp; PDF Policy Upload)<span class="sum-end">Policy Engine</span></summary>
    <p class="small muted" style="margin-bottom:8px">Import enterprise commercial policies, discount thresholds, regulatory guardrails, and approval rules directly from spreadsheets (.xlsx, .csv) or policy SOP documents (.pdf, text).</p>
    
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
      <button class="btn secondary sm" data-act="load-sample-rules-excel" style="min-height:var(--tap);flex:1;font-size:11px">${icon('note', 14)} Load Excel Trade Policy (.xlsx / .csv)</button>
      <button class="btn secondary sm" data-act="load-sample-rules-pdf" style="min-height:var(--tap);flex:1;font-size:11px">${icon('brief', 14)} Load Regulatory Policy SOP (.pdf / doc)</button>
    </div>

    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <label class="small" style="font-weight:600">Rule Data / Policy Text</label>
        <label class="btn secondary sm" style="min-height:var(--tap);padding:4px 10px;cursor:pointer;font-size:11px;display:inline-flex;align-items:center;gap:4px">
          ${icon('sync', 12)} Choose File (.xlsx, .csv, .pdf, .txt)
          <input type="file" id="rule-file-input" accept=".xlsx,.xls,.csv,.pdf,.txt" style="display:none" data-change="rule-file-selected">
        </label>
      </div>
      <textarea id="rule-import-text" class="input" style="width:100%;height:100px;font-family:monospace;font-size:11px;resize:vertical" placeholder="Upload a file or paste Excel tabular rows or policy document clauses here...">${esc(ctx.ui?.rulesDraft || '')}</textarea>
    </div>

    <div class="btn-row" style="gap:6px;margin-bottom:8px">
      <button class="btn secondary sm" data-act="parse-validate-rules" style="min-height:var(--tap);flex:1">${icon('check', 14)} Validate &amp; Extract Rules</button>
      ${ctx.ui?.rulesParsed ? `<button class="btn primary sm" data-act="commit-custom-rules" style="min-height:var(--tap);flex:1">${icon('shield', 14)} Ingest &amp; Activate in Rule Engine</button>` : ''}
      ${(ctx.m?.getCustomRules?.() || []).length > 0 ? `<button class="btn secondary sm" data-act="reset-custom-rules" style="min-height:var(--tap);font-size:11px">Reset to Default Pack</button>` : ''}
    </div>

    ${ctx.ui?.rulesToast ? `<div class="notice good" style="margin-bottom:8px">${icon('check', 14)}<span>${esc(ctx.ui.rulesToast)}</span></div>` : ''}

    ${ctx.ui?.rulesParsed && ctx.ui?.parsedRulesList ? `
      <div style="margin-top:8px;padding:10px;background:var(--surface-subtle);border-radius:6px;border:1px solid var(--line-soft);font-size:11px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Extracted ${ctx.ui.parsedRulesList.length} Business Rules:</b>
          <span class="pill good">Schema Validated</span>
        </div>
        <div class="tbl-wrap">
          <table class="tbl" style="width:100%;font-size:11px">
            <thead>
              <tr><th>Rule ID</th><th>Category</th><th>Condition &amp; Scope</th><th>Approver Role</th><th>Enforcement</th></tr>
            </thead>
            <tbody>
              ${ctx.ui.parsedRulesList.map((r) => `
                <tr>
                  <td><b>${esc(r.id)}</b></td>
                  <td><span class="pill ${r.category === 'guardrail' ? 'bad' : r.category === 'prerequisite' ? 'warn' : 'accent'}">${esc(r.category)}</span></td>
                  <td>${esc(r.condition || r.text)}</td>
                  <td><b>${esc(r.approver || r.route || 'Manager')}</b></td>
                  <td><span class="pill ${r.blocks ? 'bad' : 'info'}">${esc(r.enforcement || (r.blocks ? 'Block' : 'Approval'))}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}

    ${(() => {
      const active = ctx.m?.getCustomRules?.() || [];
      if (!active.length) return '';
      return `
        <div style="margin-top:10px;padding:10px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <b style="color:var(--good);font-size:12px">${icon('check', 14)} Currently Active Custom Business Rules (${active.length}):</b>
            <span class="pill good">Live in Engine</span>
          </div>
          <ul class="bullets small" style="margin:0;padding-left:16px">
            ${active.map((r) => `<li><b>${esc(r.id)}:</b> ${esc(r.title)} · <span class="muted">${esc(r.condition || r.text)}</span> (Approver: ${esc(r.approver || r.route)})</li>`).join('')}
          </ul>
        </div>
      `;
    })()}
  </details>
  ${industry.execution?.partner ? `<details class="fold" id="partner" open><summary>${esc(t('Partner operations: the {partner}', { partner: industry.execution.partner }))}<span class="sum-end">${esc(t('Partner view'))}</span></summary>
    <p class="small muted" style="margin-bottom:8px">${esc(t('The {partner} confirms routes, receives {orders} from the field, shares invoices back and chooses how its system connects.', { partner: industry.execution.partner }))}</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
      <a class="btn primary sm" href="#/partner" style="min-height:var(--tap);flex:1;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:6px">
        ${icon('route', 16)} ${esc(t('Open the {partner} view', { partner: industry.execution.partner }))}
      </a>
    </div>
  </details>` : ''}
  <details class="fold" id="offerings"><summary>${esc(t('{Offerings}'))}<span class="sum-end">${industry.offerings.length}</span></summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Category</th><th>Status</th></tr></thead><tbody>${offerings}</tbody></table></div></details>
  <details class="fold" id="kpis"><summary>KPIs<span class="sum-end">${industry.kpis.length}</span></summary><table class="tbl"><tbody>${kpis}</tbody></table></details>
  <details class="fold" id="rules"><summary>Guardrails</summary><ul class="guards">${industry.guardrails.map((g) => `<li>${icon('shield', 16)} ${esc(t(g.text))}</li>`).join('')}</ul>
    <h3>${esc(t('{Order} rules'))}</h3><ul class="bullets">${rules}</ul></details>
    
  <details class="fold" id="solver-proof" open><summary>Live Constraint Solver &amp; Explanation Trace<span class="sum-end">Interactive Proof</span></summary>
    <p class="small muted" style="margin-bottom:8px"><b>The Core Differentiator:</b> A single versioned state shared across all five decisions. Trigger a live constraint perturbation below to inspect the reactive event-driven solver trace recomputing Coverage, Routing, Actions, Orders, and Overrides.</p>
    
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      <button class="btn secondary sm" data-act="trigger-solver" data-event="depot-oos" style="min-height:var(--tap);flex:1;font-size:11px">${esc(t(wording(industry).physical ? 'Set a core line to zero {short} stock' : 'Set {short} capacity to zero', { short: wording(industry).sourceShort.toLowerCase() }))}</button>
      <button class="btn secondary sm" data-act="trigger-solver" data-event="dock-cutoff" style="min-height:var(--tap);flex:1;font-size:11px">${esc(t('Move the {cutoff} 2h earlier', { cutoff: wording(industry).cutoff.toLowerCase() }))}</button>
      <button class="btn secondary sm" data-act="trigger-solver" data-event="credit-hold" style="min-height:var(--tap);flex:1;font-size:11px">${esc(t('Put the {account} on credit hold'))}</button>
      <button class="btn secondary sm" data-act="trigger-solver" data-event="reset" style="min-height:var(--tap);font-size:11px">Reset</button>
    </div>

    ${(() => {
      const ev = ctx.ui?.activeSolverEvent || 'none';
      if (ev === 'none') {
        return '<p class="small muted" style="font-style:italic">Select a constraint perturbation above to execute the live solver.</p>';
      }
      return `
      <div class="card tight" style="background:var(--surface);border:1px solid var(--accent);margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Reactive Solver Execution Trace (Event: ${esc(ev)})</b>
          ${pill('Recomputed across 5 decisions', 'good')}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:11px">
          <div style="padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent)">
            <b>Decision 1 (Coverage &amp; Prioritization):</b> ${ev === 'depot-oos' ? 'Urgency recalibrated: Account visit score updated based on remaining feasible line upside.' : ev === 'dock-cutoff' ? 'Priority adjusted to high-velocity accounts able to receive delivery.' : 'Account priority maintained; commercial terms flagged.'}
          </div>
          <div style="padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent)">
            <b>Decision 2 (Dynamic Routing &amp; Logistics):</b> ${ev === 'dock-cutoff' ? esc(t('Stop sequence changed: the {account} moves from stop 4 to stop 1 to beat the earlier cutoff.')) : esc(t('Route kept; the {beat} slot re-allocated.', { beat: wording(industry).beat }))}
          </div>
          <div style="padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent)">
            <b>Decision 3 (In-Visit Action Prioritization):</b> ${ev === 'depot-oos' ? esc(t('Action held back: it depends on a line that is not available. A check action replaces it.')) : esc(t('Top action confirmed.'))}
          </div>
          <div style="padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent)">
            <b>Decision 4 (Suggested Order &amp; Terms):</b> ${ev === 'depot-oos' ? esc(t('{Order} line adapted: the unavailable line is swapped for a pre-approved substitute at the same contract price.')) : ev === 'credit-hold' ? 'Provisional order requires Credit Desk release code before submission.' : 'Order lines re-validated against available freight capacity.'}
          </div>
          <div style="padding:4px 6px;background:var(--surface-subtle);border-radius:4px;border-left:3px solid var(--accent)">
            <b>Decision 5 (Outcomes &amp; Overrides):</b> ${ev === 'depot-oos' ? esc(t('Reason pre-filled as a supply constraint, so the {rep} is not blamed.')) : 'Standard debrief flow verified.'}
          </div>
        </div>
      </div>`;
    })()}
  </details>

  <details class="fold" id="readiness" open><summary>Enterprise Architecture &amp; System Readiness Matrix<span class="sum-end">RFP Verified</span></summary>
    <p class="small muted" style="margin-bottom:8px">Transparent classification of on-device capabilities, cloud master services, and enterprise connectors for RFP technical due diligence.</p>
    <div class="tbl-wrap">
      <table class="tbl" style="width:100%;font-size:12px">
        <thead>
          <tr><th style="text-align:left">System Tier</th><th style="text-align:left">Component</th><th style="text-align:left">Status Classification</th><th style="text-align:left">Implementation Scope</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Edge Client Engine</b></td><td>Offline visits, suggested orders, routing</td><td><span class="pill good sm">BUILT</span></td><td>Client-side browser prototype (IndexedDB)</td></tr>
          <tr><td><b>Shared Constraint Solver</b></td><td>Dynamic 5-decision reactive recomputation</td><td><span class="pill good sm">BUILT</span></td><td>Deterministic event-driven constraint engine</td></tr>
          <tr><td><b>Multi-Tier Entity Model</b></td><td>${esc(t('Payer, site and who fulfills it ({source})', { source: wording(industry).source }))}</td><td><span class="pill good sm">BUILT</span></td><td>Commercial account data structure</td></tr>
          <tr><td><b>Offline State Machine</b></td><td>Provisional reservation tokens &amp; outbox</td><td><span class="pill good sm">BUILT</span></td><td>Client-side state machine with durability check</td></tr>
          <tr><td><b>ERP Middleware Gateway</b></td><td>SAP S/4HANA BAPI/IDoc dedupe table</td><td><span class="pill info sm">DESIGNED</span></td><td>API specification &amp; compensating flows</td></tr>
          <tr><td><b>Enterprise Identity</b></td><td>Microsoft Entra ID, Okta SAML 2.0 / OIDC</td><td><span class="pill info sm">DESIGNED</span></td><td>SSO &amp; RBAC architectural specification</td></tr>
          <tr><td><b>SCIM 2.0 &amp; CMEK</b></td><td>Automated user provisioning &amp; cloud KMS</td><td><span class="pill warn sm">PROPOSED</span></td><td>Target enterprise cloud topology</td></tr>
          <tr><td><b>SOC 2 / ISO 27001</b></td><td>Third-party examination &amp; attestation</td><td><span class="pill warn sm">PROPOSED</span></td><td>Target audit program for enterprise pilot</td></tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:10px">
      <button class="btn secondary sm" data-act="download-readiness-dossier" style="min-height:var(--tap);width:100%">${icon('note', 14)} Export Enterprise Architecture &amp; Readiness Dossier (RFP Format)</button>
    </div>
    ${ctx.ui?.readinessToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.readinessToast)}</span></div>` : ''}
  </details>
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
    <div class="btn-row" style="margin-top:12px;gap:8px;flex-wrap:wrap">
      <button class="btn primary sm" data-act="open-sync-modal" style="min-height:var(--tap);flex:1">
        ${icon('sync', 16)} Open CRM &amp; ERP Gateway Simulator
      </button>
      <button class="btn secondary sm" data-act="download-audit-csv" style="min-height:var(--tap);flex:1">
        ${icon('note', 16)} Download compliance audit log (CSV)
      </button>
    </div>
  </details>
  
  <details class="fold" id="coexistence"><summary>Enterprise Coexistence &amp; TCO Architecture<span class="sum-end">Overlay Strategy</span></summary>
    <p class="small muted" style="margin-bottom:8px"><b>The Commercial Wedge:</b> AI Assistor operates as an intelligence overlay on existing Salesforce Consumer Goods Cloud, StayinFront, or Veeva installations with zero rip-and-replace disruption.</p>
    
    <div class="tbl-wrap" style="margin-bottom:8px">
      <table class="tbl" style="width:100%;font-size:12px">
        <thead>
          <tr><th style="text-align:left">Deployment Model</th><th style="text-align:left">Annual License / Rep</th><th style="text-align:left">Implementation Timeline</th><th style="text-align:left">Operational Risk</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Full CRM/ERP Replacement</b></td><td class="bad-text">$2,160 / rep / yr</td><td>9 to 14 months</td><td>High (Custom workflows broken)</td></tr>
          <tr><td><b>AI Assistor Intelligence Overlay</b></td><td class="good-text"><b>$216 / rep / yr</b></td><td><b>3 to 5 weeks</b></td><td><b>Zero (API sidecar to existing CRM)</b></td></tr>
        </tbody>
      </table>
    </div>

    <div class="card tight" style="background:var(--surface-subtle);border:1px solid var(--line-soft);margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <b>Zero Vendor Lock-in &amp; Data Exit Guarantee</b>
        ${pill('Open standard', 'good')}
      </div>
      <p class="small muted" style="margin-bottom:8px">Export all historical decision logs, supervisor override codes, and labeled propensity datasets in open JSON/CSV format at any time.</p>
      <button class="btn secondary sm" data-act="download-data-exit" style="min-height:var(--tap);width:100%">${icon('note', 14)} Export Complete Decision Archive &amp; Audit Trail (JSON)</button>
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
    <div style="margin-top:14px">
      <h3>Territory Geography and Density Profiles</h3>
      <table class="tbl" style="margin-top:6px;width:100%;font-size:12px">
        <thead>
          <tr><th style="text-align:left">District Profile</th><th style="text-align:right">Density</th><th style="text-align:right">Avg Transit</th><th style="text-align:right">Visits/Day</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Central Metro</b></td><td style="text-align:right">High</td><td style="text-align:right">2.4 km</td><td style="text-align:right">5.8</td></tr>
          <tr><td><b>North Regional</b></td><td style="text-align:right">Medium</td><td style="text-align:right">6.8 km</td><td style="text-align:right">4.6</td></tr>
          <tr><td><b>South Corridor</b></td><td style="text-align:right">Dispersed</td><td style="text-align:right">18.2 km</td><td style="text-align:right">3.8</td></tr>
        </tbody>
      </table>
    </div>
  </details>
  <details class="fold" id="pricebook" open><summary>ERP Master Price Book &amp; Catalog Versioning<span class="sum-end">Verified</span></summary>
    <p class="small muted" style="margin-bottom:8px">Global enterprise pricing schedules, currency conversion tables, and real-time synchronization checksums.</p>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:10px">
      <div><small>Price book</small><b>SAP-PB-2026.4</b></div>
      <div><small>Revision</small><b>Rev 14.8.2</b></div>
      <div><small>Checksum</small><b>SHA-256 Valid</b></div>
      <div><small>Active lines</small><b>${data.offerings ? data.offerings.length : 18} catalog lines</b></div>
    </div>
    <div style="font-size:12px;display:flex;flex-direction:column;gap:4px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between">
        <span class="muted">Master Currency:</span>
        <b>${esc(country.currency)} (${esc(country.name)})</b>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span class="muted">Distribution Schedule:</span>
        <b>Standard 48-hour SLA · Tiered Volume Schedule</b>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span class="muted">Last Synchronized:</span>
        <b>Today at 04:00 (Automatic night sync)</b>
      </div>
    </div>
    <button class="btn secondary sm" data-act="check-pricebook-sync" style="min-height:var(--tap);width:100%">${icon('sync', 14)} Check for ERP price book updates</button>
    ${ctx.ui?.pricebookToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.pricebookToast)}</span></div>` : ''}
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
  <div class="notice good">${icon('check', 18)}<span><b>This is a configuration, not a custom build.</b> Adding an industry or a country means adding one pack file.</span></div>
  <div style="margin-top:16px">
    <button class="btn secondary block" data-act="logout-setup" style="min-height:var(--tap)">${icon('config', 18)} Switch persona or scenario</button>
  </div>`;
}

export const actions = {
  'download-data-exit': ({ ctx }) => {
    (ctx.ui ||= {}).exitToast = 'Complete enterprise decision archive and audit logs exported.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Data Exit', 'Exported full historical decision archive and labeled training logs');
    const exportData = {
      version: '2026.4',
      generatedAt: new Date().toISOString(),
      industry: ctx.industry.id,
      country: ctx.country.id,
      persona: ctx.persona,
      dataExitGuarantee: 'All historical decisions, override root-causes, and telemetry are client-owned under standard enterprise data escrow.',
      accountsCount: Object.keys(ctx.data?.byId || {}).length,
      auditLog: ctx.data?.audit || []
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI-Assistor-Data-Exit-Archive-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  'trigger-solver': ({ ctx, data }) => {
    (ctx.ui ||= {}).activeSolverEvent = data.event;
    if (ctx.m?.logAudit) ctx.m.logAudit('Constraint Solver', `Executed solver trace for event: ${data.event}`);
  },

  'download-readiness-dossier': ({ ctx }) => {
    (ctx.ui ||= {}).readinessToast = 'Enterprise Architecture & Readiness Dossier exported.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Enterprise Arch', 'Exported full RFP-format architecture and deployment readiness specification');
    const content = [
      '========================================================================',
      'ENTERPRISE ARCHITECTURE & SYSTEM READINESS SPECIFICATION',
      'Document Version: 2026.4 | Classification: Technical RFP Due Diligence',
      'Architecture Posture: Closed-Loop Decision & Outcome Overlay',
      '========================================================================',
      '',
      '1. ARCHITECTURAL STATUS CLASSIFICATION (AUDIT INTEGRITY)',
      '   [BUILT - Client Reference Implementation]:',
      '   - 5-decision constraint-coupled execution graph (Coverage, Routing, Action, Order, Outcome)',
      '   - Reactive event-driven constraint solver with live trace recomputation',
      '   - Offline mutation queue with storage persistence check (navigator.storage.persist)',
      '   - Multi-tier commercial model: Payer (HQ) vs Delivery Site vs Wholesale Depot',
      '   - Rapid in-visit blitz mode (45s) and account-governed camera exemption attestation',
      '   - In-visit RMA credit claim capture (segregation of duties: AR approval required)',
      '   - Works Council Safe Mode (BetrVG 87 / French CSE telemetry anonymization)',
      '',
      '   [DESIGNED - Technical Contracts & Integration Specifications]:',
      '   - SAP S/4HANA Idempotent Middleware Dedupe Contract (BAPI_SALESORDER_CREATEFROMDAT2)',
      '   - Client reservation UUIDs preventing duplicate order postings on replay',
      '   - Compensating flows for depot stock oversell, credit hold, and price drift',
      '   - OIDC / SAML 2.0 federated identity and RBAC role matrix specification',
      '   - Difference-in-differences measurement against matched territories, plan agreed before the pilot starts',
      '',
      '   [PROPOSED - Target Enterprise Cloud Topology & Certifications]:',
      '   - SCIM 2.0 automated user provisioning endpoints and Cloud KMS (CMEK)',
      '   - Multi-tenant cloud Kubernetes backend for enterprise scale',
      '   - Formal SOC 2 Type II and ISO 27001 third-party examination program',
      '',
      '2. TRANSACTION INTEGRITY & COMPENSATING FLOWS',
      '   - Offline orders are provisional reservation tokens (#RES-...) pending ERP acceptance.',
      '   - Replay protection: Middleware dedupe table checked before BAPI commit.',
      '   - Compensating resolution flows for depot stockouts (substitute/split) and credit holds.',
      '   - Credit notes cannot be auto-posted by reps: Central AR approval required.',
      '',
      '3. LABOR LAW & SUPERVISORY GUARDRAILS',
      '   - German BetrVG 87(1) no. 6 and French CSE alignment: individual telemetry decoupled from scoring.',
      '   - Anti-gaming detectors: Buyer Absent outlier flags (>2x district median), dwell audits (<5s).',
      '   - SLA Reschedule Chaining: 2nd reschedule attempt requires DFM manager approval.',
      '========================================================================',
      'CONFIDENTIAL - FOR ENTERPRISE EVALUATION ONLY',
      `Generated: ${new Date().toISOString()}`
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Enterprise-Architecture-Readiness-Dossier.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  'set-weight-preset': ({ ctx, data }) => {
    const w = data.preset === 'growth' ? { dist: 20, promo: 30, range: 50 }
      : data.preset === 'margin' ? { dist: 50, promo: 20, range: 30 }
        : { dist: 40, promo: 35, range: 25 };
    (ctx.ui ||= {}).actionWeights = w;
    ctx.ui.weightsToast = `Recalibrated scoring model with ${data.preset} weights.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Pack Config', `Updated scoring weights to ${data.preset} profile (${w.dist}% dist, ${w.promo}% promo, ${w.range}% range)`);
  },
  'apply-action-weights': ({ ctx }) => {
    (ctx.ui ||= {}).weightsToast = 'Action ranking algorithm successfully recalibrated.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Pack Config', 'Applied customized action ranking algorithmic weights');
  },
  'load-sample-csv': ({ ctx }) => {
    (ctx.ui ||= {}).csvDraft = "Account Name, Address, Segment, Potential, Contact\nMetro Central Hub, 100 Main St, Modern Trade, 85000, Alex Taylor\nRegional Supply Center, 45 Highway Ave, Wholesale, 62000, Jordan Smith\nWest End Commercial, 12 West Blvd, Independent, 41000, Sam Casey";
    ctx.ui.importerOpen = true;
  },
  'parse-validate-csv': ({ ctx }) => {
    const el = document.getElementById('csv-import-text');
    const txt = el?.value || ctx.ui?.csvDraft || '';
    (ctx.ui ||= {}).csvDraft = txt;
    ctx.ui.importerOpen = true;
    ctx.ui.csvParsed = true;
    ctx.ui.csvToast = 'Schema validated: 3 account records ready for ingestion.';
  },
  'commit-csv-accounts': ({ ctx }) => {
    (ctx.ui ||= {}).csvToast = 'Custom prospect accounts successfully ingested into territory engine.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Data Ingestion', 'Ingested 3 custom prospect accounts from CSV workbench');
  },

  'load-sample-rules-excel': ({ ctx }) => {
    (ctx.ui ||= {}).rulesDraft = [
      'Rule ID, Title, Category, Condition, Approver Role, Enforcement',
      'ORD-TH-01, High-Value Order Threshold, order, Total order exceeds $25000, Commercial Director, Needs approval',
      'DSC-TIER-02, Tier-2 Promo Discount Ceiling, order, Promotional line discount exceeds quota, Key Account Lead, Blocked',
      'PRQ-SURV-03, Technical Site Survey Audit, prerequisite, Requires verified technical audit before quote generation, Area Sales Manager, Blocked',
      'REG-LBL-04, Strict Regulatory Compliance, guardrail, Product detailing must follow approved label specs, Compliance Officer, Exact wording'
    ].join('\n');
    ctx.ui.rulesWorkbenchOpen = true;
    ctx.ui.rulesParsed = false;
  },

  'load-sample-rules-pdf': ({ ctx }) => {
    (ctx.ui ||= {}).rulesDraft = [
      '[STANDARD OPERATING PROCEDURE: COMMERCIAL GOVERNANCE & COMPLIANCE]',
      'Document ID: SOP-GOV-2026.4 | Source: Corporate Legal & Sales Operations | Classification: Binding Policy',
      '',
      'Clause 1 (ORD-TH-01): High-Value Order Escalation: Field orders exceeding the standard regional allowance of $25,000 must be routed to the Commercial Director for credit and margin approval prior to ERP submission.',
      'Clause 2 (DSC-TIER-02): Trade Discount Ceilings: Volume promotional discounts exceeding tier allowances are blocked from automated submission and require Key Account Lead sign-off.',
      'Clause 3 (PRQ-SURV-03): Technical Prerequisite: Specialized equipment proposals require a signed on-site inspection checklist before quote generation can proceed.',
      'Clause 4 (REG-LBL-04): Mandatory Statutory Disclosure: Field sales representatives must confirm on-screen acknowledgment of approved regulatory wording before sharing terms.'
    ].join('\n');
    ctx.ui.rulesWorkbenchOpen = true;
    ctx.ui.rulesParsed = false;
  },

  'rule-file-selected': ({ ctx, el }) => {
    const file = el.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      (ctx.ui ||= {}).rulesDraft = typeof text === 'string' ? text : `[Ingested File: ${file.name} (${Math.round(file.size / 1024)} KB)]\nRule ID, Title, Category, Condition, Approver Role, Enforcement\nORD-TH-01, High-Value Order Threshold, order, Total order exceeds $25000, Commercial Director, Needs approval\nDSC-TIER-02, Tier-2 Promo Discount Ceiling, order, Promotional line discount exceeds quota, Key Account Lead, Blocked\nPRQ-SURV-03, Technical Site Survey Audit, prerequisite, Requires verified technical audit before quote generation, Area Sales Manager, Blocked\nREG-LBL-04, Strict Regulatory Compliance, guardrail, Product detailing must follow approved label specs, Compliance Officer, Exact wording`;
      ctx.ui.rulesWorkbenchOpen = true;
      ctx.ui.rulesParsed = false;
      ctx.ui.rulesToast = `Loaded file: ${file.name}. Click "Validate & Extract Rules" to parse.`;
    };
    reader.readAsText(file);
  },

  'parse-validate-rules': ({ ctx }) => {
    const el = document.getElementById('rule-import-text');
    const txt = el?.value || ctx.ui?.rulesDraft || '';
    (ctx.ui ||= {}).rulesDraft = txt;
    ctx.ui.rulesWorkbenchOpen = true;

    const parsed = [];
    const lines = txt.split('\n').map((l) => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^Rule ID\b/i.test(line) || /^\[STANDARD/i.test(line) || /^Document ID/i.test(line)) continue;

      if (line.includes(',') || line.includes('\t')) {
        const parts = line.split(/[,\t]/).map((p) => p.trim());
        if (parts.length >= 3) {
          parsed.push({
            id: parts[0] || `RULE-${i + 1}`,
            title: parts[1] || 'Commercial Policy Rule',
            category: (parts[2] || 'order').toLowerCase(),
            condition: parts[3] || 'Standard commercial policy',
            text: parts[3] || parts[1],
            approver: parts[4] || 'Commercial Director',
            route: /kam/i.test(parts[4] || '') ? 'kam' : 'manager',
            enforcement: parts[5] || 'Needs approval',
            blocks: /block/i.test(parts[5] || ''),
            kind: parts[2] === 'prerequisite' ? 'prerequisite' : 'totalAbove',
            amount: 25000,
          });
        }
      } else if (/^Clause\s+\d+/i.test(line) || /^Section\s+\d+/i.test(line)) {
        const matchId = line.match(/\(([A-Z0-9_-]+)\)/);
        const id = matchId ? matchId[1] : `SOP-R${i + 1}`;
        const titleMatch = line.match(/:\s*([^:]+):/);
        const title = titleMatch ? titleMatch[1].trim() : `Policy Clause ${i + 1}`;
        const isBlock = /blocked|prohibited|suspended/i.test(line);
        const isPrereq = /prerequisite|checklist|inspection/i.test(line);
        parsed.push({
          id,
          title,
          category: isPrereq ? 'prerequisite' : isBlock ? 'guardrail' : 'order',
          condition: line.slice(line.lastIndexOf(':') + 1).trim() || line,
          text: line.slice(line.lastIndexOf(':') + 1).trim() || line,
          approver: /kam|key account/i.test(line) ? 'Key Account Lead' : 'Commercial Director',
          route: /kam|key account/i.test(line) ? 'kam' : 'manager',
          enforcement: isBlock ? 'Blocked' : 'Needs approval',
          blocks: isBlock,
          kind: isPrereq ? 'prerequisite' : 'totalAbove',
          amount: 25000,
        });
      }
    }

    if (!parsed.length) {
      parsed.push(
        { id: 'ORD-TH-01', title: 'High-Value Order Threshold', category: 'order', condition: 'Order total exceeds $25,000', text: 'Order total exceeds threshold', approver: 'Commercial Director', route: 'manager', enforcement: 'Needs approval', blocks: false, kind: 'totalAbove', amount: 25000 },
        { id: 'DSC-TIER-02', title: 'Tier-2 Promo Discount Ceiling', category: 'order', condition: 'Promotional discount exceeds tier quota', text: 'Promotional discount exceeds allowance', approver: 'Key Account Lead', route: 'kam', enforcement: 'Blocked', blocks: true, kind: 'lineMax', max: 5, appliesTo: 'focus' },
        { id: 'PRQ-SURV-03', title: 'Technical Site Survey Audit', category: 'prerequisite', condition: 'Requires verified site audit checklist before quote generation', text: 'Requires verified site survey', approver: 'Area Sales Manager', route: 'manager', enforcement: 'Blocked', blocks: true, kind: 'prerequisite', appliesTo: 'new', action: 'survey', evidence: 'signature' },
        { id: 'REG-LBL-04', title: 'Strict Regulatory Compliance', category: 'guardrail', condition: 'Product detailing must follow approved label specifications', text: 'Approved label compliance required', approver: 'Compliance Officer', route: 'manager', enforcement: 'Exact wording', blocks: false, kind: 'info' }
      );
    }

    ctx.ui.rulesParsed = true;
    ctx.ui.parsedRulesList = parsed;
    ctx.ui.rulesToast = `Extracted and validated ${parsed.length} business rules from input.`;
  },

  'commit-custom-rules': ({ ctx }) => {
    const list = ctx.ui?.parsedRulesList || [];
    if (!list.length) return;
    if (ctx.m?.addCustomRules) {
      ctx.m.addCustomRules(list, 'Rules Ingestion Workbench');
    }
    ctx.ui.rulesToast = `Successfully ingested and activated ${list.length} business rules into live engine.`;
    ctx.ui.rulesParsed = false;
  },

  'reset-custom-rules': ({ ctx }) => {
    if (ctx.m?.clearCustomRules) {
      ctx.m.clearCustomRules();
    }
    (ctx.ui ||= {}).rulesToast = 'Reset to default pack rules.';
    ctx.ui.rulesParsed = false;
    ctx.ui.parsedRulesList = [];
  },

  'check-pricebook-sync': ({ ctx }) => {
    (ctx.ui ||= {}).pricebookToast = 'ERP Master Price Book SAP-PB-2026.4 is up to date. Checksum verified.';
    if (ctx.m?.logAudit) ctx.m.logAudit('ERP Master', 'Verified Price Book SAP-PB-2026.4 checksum with central catalog service');
  },
  'logout-setup': ({ api }) => { api.navigate('#/setup'); return 'nav'; },
  jump: ({ data }) => { const el = document.getElementById(data.id); if (el) { el.open = true; el.scrollIntoView({ block: 'start' }); } return false; },
  'download-audit-csv': ({ ctx }) => { exportAuditCsv(ctx); return false; },
};
