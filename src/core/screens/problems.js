// C2 Problems we solve: six problems in the prospect's language, each linked to the capability that solves it.

import { esc, icon, CAPABILITIES } from '../ui.js';

export const actions = {
  'download-pilot-charter': ({ ctx }) => {
    const content = [
      '========================================================================',
      'ENTERPRISE 90-DAY MATCHED-CONTROL PILOT CHARTER',
      `Industry Vertical: ${ctx.industry.name}`,
      `Country: ${ctx.country.name}`,
      '========================================================================',
      '',
      '1. PILOT OBJECTIVE',
      '   Measure whether ranked visit briefs and white space suggestions change',
      '   field results, against matched control territories. No result is claimed',
      '   before the pilot ends.',
      '',
      '2. THREE-PHASE IMPLEMENTATION SCHEDULE',
      '   - Weeks 1 to 2: Baseline data calibration, CRM/ERP mapping, historical trends.',
      '   - Weeks 3 to 8: Field deployment with reps and district managers.',
      '   - Weeks 9 to 12: Business review, econometric regression, executive QBR.',
      '',
      '3. MEASUREMENT CRITERIA (targets agreed with finance before the start)',
      '   - Adoption: suggestions acted on; overrides with a reason.',
      '   - Execution: actions done and verified with evidence.',
      '   - Value: revenue or volume per visit against matched control.',
      '   - Guardrails: no breach of pricing, credit or regulated rules.',
      '   - Go, fix or stop rule written down before the pilot starts.',
      '========================================================================',
      'CONFIDENTIAL - FOR COMMERCIAL PILOT PLANNING ONLY',
      `Generated on: ${new Date().toISOString()}`
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Enterprise-Pilot-Charter-${ctx.industry.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    (ctx.ui ||= {}).pilotToast = 'Exported 90-day pilot charter document.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Commercial Ops', 'Exported enterprise 90-day pilot charter');
  },
};

export function render(ctx) {
  const { t, industry, data } = ctx;
  const first = data.planned.slice().sort((a, b) => a.rank - b.rank)[0];
  const LABEL = {
    potential: 'Open {account} potential', gaps: 'Open the {visit} brief', ranking: 'Open the ranked brief',
    planning: 'Open Today and the route', order: 'Open the {order} builder', evidence: 'Open the exception queue',
  };
  const LINK = {
    potential: `#/account/${data.accounts[0].id}`,
    gaps: `#/brief/${first.accountId}`,
    ranking: `#/brief/${first.accountId}`,
    planning: '#/today',
    order: `#/order/${first.accountId}`,
    evidence: '#/manager',
  };
  const cards = industry.problems.map((p, i) => {
    const cap = CAPABILITIES[p.capability];
    return `<details class="fold problem" data-capability="${p.capability}"${i === 0 ? ' open' : ''}>
      <summary><span><span class="num">Problem ${i + 1}</span> ${esc(t(p.title))}</span></summary>
      <p>${esc(t(p.text))}</p>
      <small>Capability: <b>${esc(t(cap.name))}</b>. ${esc(t(cap.decides))}.</small>
      <a class="btn secondary sm" href="${LINK[p.capability]}">${esc(t(LABEL[p.capability]))} ${icon('chevron', 16)}</a>
    </details>`;
  }).join('');
  return `
  <section class="page-head">
    <h1>Problems we solve</h1>
    <p class="muted">${esc(t(`Six problems ${industry.name.toLowerCase()} field teams describe, and the capability that answers each one.`))}</p>
  </section>
  ${cards}
  <section class="card" id="domain-profiles-link" style="margin-top:var(--s4)">
    <div class="section-head">
      <h2>${esc(t('Industry domain deep dive'))}</h2>
      <span class="pill info">${esc(t('21 industries'))}</span>
    </div>
    <p class="small muted" style="margin-bottom:12px">${esc(t('Channels, field leaks, decisions and guardrails for each industry pack. Scenarios are illustrative.'))}</p>
    <a class="btn secondary sm" href="#/domains" style="min-height:var(--tap);width:100%">${icon('brief', 14)} ${esc(t('Open the industry deep dive'))} ${icon('chevron', 14)}</a>
  </section>
  <section class="card" id="pilot-framework" style="margin-top:var(--s4)">
    <div class="section-head">
      <h2>90-Day matched-control pilot framework</h2>
      <span class="pill good">Proof of value</span>
    </div>
    <p class="small muted" style="margin-bottom:8px">Validation structure against matched control territories. No results exist yet.</p>
    <a class="btn secondary sm" href="#/system/scorecard" style="min-height:var(--tap);margin-bottom:8px">Test plan for each capability ${icon('chevron', 14)}</a>
    
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Phase 1 (W1-2)</small><b>Calibration</b><small>Baseline data</small></div>
      <div><small>Phase 2 (W3-8)</small><b>Execution</b><small>Field rollout</small></div>
      <div><small>Phase 3 (W9-12)</small><b>Verification</b><small>Statistical lift</small></div>
    </div>

    <ul class="bullets small" style="margin-top:10px">
      <li><b>Primary measure:</b> revenue or volume per visit against matched control. The target is agreed with finance before the start.</li>
      <li><b>Adoption and execution:</b> reported separately from value, never added into one score.</li>
      <li><b>Guardrails:</b> no breach of pricing, credit or regulated rules during the pilot.</li>
    </ul>

    <button class="btn secondary sm" data-act="download-pilot-charter" style="min-height:var(--tap);width:100%;margin-top:10px">${icon('note', 14)} Export 90-Day Pilot Charter (Text)</button>
    ${ctx.ui?.pilotToast ? `<div class="notice good" style="margin-top:8px">${icon('check', 14)}<span>${esc(ctx.ui.pilotToast)}</span></div>` : ''}
  </section>
  <p class="foot-note">No results are claimed before a pilot against matched control territories.</p>`;
}
