// Interactive Domain Deep-Dive Explorer.
// Comprehensive operational profiles across all 20 industry verticals.
// Displays route-to-market architecture, frontline friction, decision trees, and use cases.
// Zero hardcoded industry nouns in screen copy. Uses vocabulary tokens and dynamic data.

import { esc, icon, pill } from '../ui.js';
import { DOMAIN_INTELLIGENCE } from '../../packs/domain-intelligence.js';
import { INDUSTRIES } from '../../packs/index.js';

export const actions = {
  'select-domain': ({ ctx, data }) => {
    (ctx.ui ||= {}).selectedDomainId = data.id;
  },
  'switch-industry': ({ data, api, ctx }) => {
    api.configure({ industryId: data.id }, { home: true });
  },
  'download-domain-blueprint': ({ ctx, data }) => {
    const d = DOMAIN_INTELLIGENCE[data.id] || DOMAIN_INTELLIGENCE[ctx.industry.id];
    if (!d) return;

    const lines = [
      '========================================================================',
      `ENTERPRISE INDUSTRY EXECUTION BLUEPRINT: ${d.name.toUpperCase()}`,
      '========================================================================',
      `Vertical: ${d.name}`,
      `Tagline: ${d.tagline}`,
      `Channel Architecture: ${d.channelModel}`,
      `Economic Value Drivers: ${d.economicDrivers}`,
      `Decision Makers: ${d.decisionMakers.join(', ')}`,
      '',
      '------------------------------------------------------------------------',
      '1. FRONTLINE FRICTION AND VALUE LEAKS',
      '------------------------------------------------------------------------',
      ...d.frontlinePainPoints.flatMap((p, i) => [
        `[Leak ${i + 1}] ${p.title}`,
        `  Operational Friction: ${p.friction}`,
        `  Cost of Failure: ${p.costOfFailure}`,
        `  AI Assistor Solution: ${p.solvedBy}`,
        ''
      ]),
      '------------------------------------------------------------------------',
      '2. FIVE CORE DECISIONS IN DOMAIN CONTEXT',
      '------------------------------------------------------------------------',
      `A. COVERAGE: ${d.coreDecisions.coverage.question}`,
      `   Traditional Flaw: ${d.coreDecisions.coverage.traditionalFlaw}`,
      `   Assistor Solution: ${d.coreDecisions.coverage.assistorSolution}`,
      `   Primary KPI: ${d.coreDecisions.coverage.kpi}`,
      '',
      `B. ROUTE AND TIMING: ${d.coreDecisions.route.question}`,
      `   Traditional Flaw: ${d.coreDecisions.route.traditionalFlaw}`,
      `   Assistor Solution: ${d.coreDecisions.route.assistorSolution}`,
      `   Primary KPI: ${d.coreDecisions.route.kpi}`,
      '',
      `C. IN-VISIT PRIORITIES: ${d.coreDecisions.inVisit.question}`,
      `   Traditional Flaw: ${d.coreDecisions.inVisit.traditionalFlaw}`,
      `   Assistor Solution: ${d.coreDecisions.inVisit.assistorSolution}`,
      `   Primary KPI: ${d.coreDecisions.inVisit.kpi}`,
      '',
      `D. ORDER AND PROPOSAL: ${d.coreDecisions.order.question}`,
      `   Traditional Flaw: ${d.coreDecisions.order.traditionalFlaw}`,
      `   Assistor Solution: ${d.coreDecisions.order.assistorSolution}`,
      `   Primary KPI: ${d.coreDecisions.order.kpi}`,
      '',
      `E. EVIDENCE AND LEARNING: ${d.coreDecisions.evidence.question}`,
      `   Traditional Flaw: ${d.coreDecisions.evidence.traditionalFlaw}`,
      `   Assistor Solution: ${d.coreDecisions.evidence.assistorSolution}`,
      `   Primary KPI: ${d.coreDecisions.evidence.kpi}`,
      '',
      '------------------------------------------------------------------------',
      '3. REGULATORY AND COMMERCIAL FIREWALLS',
      '------------------------------------------------------------------------',
      ...d.complianceFirewalls.flatMap((c, i) => [
        `[Firewall ${i + 1}] ${c.rule}`,
        `  Rationale: ${c.rationale}`,
        `  Enforcement: ${c.enforcement}`,
        ''
      ]),
      '------------------------------------------------------------------------',
      '4. OPERATIONAL USE CASES',
      '------------------------------------------------------------------------',
      ...d.deepUseCases.flatMap((u, i) => [
        `[Use Case ${i + 1}] ${u.title}`,
        `  Scenario: ${u.scenario}`,
        `  Agent Preparation: ${u.agentPreparation}`,
        `  Field Execution: ${u.repExecution}`,
        `  Verified Outcome: ${u.verifiedOutcome}`,
        ''
      ]),
      '========================================================================',
      'CONFIDENTIAL - ENTERPRISE SALES EXECUTION ARCHITECTURE',
      `Generated on: ${new Date().toISOString()}`
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Industry-Blueprint-${d.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    (ctx.ui ||= {}).domainToast = `Exported ${d.name} execution blueprint.`;
  }
};

export function render(ctx, args = []) {
  const { t, industry } = ctx;
  const targetId = args[0] || ctx.ui?.selectedDomainId || industry.id;
  const d = DOMAIN_INTELLIGENCE[targetId] || DOMAIN_INTELLIGENCE[industry.id] || DOMAIN_INTELLIGENCE.cpg;
  const isCurrentActive = d.id === industry.id;

  // Horizontal selector chips for all 20 industries
  const chips = INDUSTRIES.map((ind) => {
    const isSelected = ind.id === d.id;
    const isPackActive = ind.id === industry.id;
    return `<button class="btn sm ${isSelected ? 'primary' : 'secondary'}" data-act="select-domain" data-id="${ind.id}" style="min-height:var(--tap,44px);min-width:44px;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;border-radius:22px;padding:6px 14px;margin:2px">
      ${icon(ind.icon || 'cart', 16)}
      <span>${esc(ind.name)}</span>
      ${isPackActive ? `<span style="font-size:10px;opacity:0.8;background:rgba(255,255,255,0.25);padding:2px 6px;border-radius:10px">${esc(t('Active'))}</span>` : ''}
    </button>`;
  }).join('');

  // 1. Frontline Pain Points Cards
  const painCards = d.frontlinePainPoints.map((p, idx) => `
    <article class="card" style="margin-bottom:var(--s2);border-left:4px solid var(--accent)">
      <div class="section-head" style="margin-bottom:6px">
        <h4 style="margin:0;font-size:0.95rem"><span class="num">${idx + 1}</span> ${esc(p.title)}</h4>
        <span class="pill warn">${esc(t('Value leak'))}</span>
      </div>
      <p class="small" style="margin-bottom:6px"><b>${esc(t('Operational friction'))}:</b> ${esc(p.friction)}</p>
      <p class="small muted" style="margin-bottom:6px"><b>${esc(t('Cost of failure'))}:</b> ${esc(p.costOfFailure)}</p>
      <div style="background:var(--paper-2);padding:8px 12px;border-radius:6px;font-size:0.85rem">
        <span style="color:var(--accent);font-weight:600">${icon('bulb', 13)} ${esc(t('How AI Assistor solves it'))}:</span>
        <span style="margin-left:4px">${esc(p.solvedBy)}</span>
      </div>
    </article>
  `).join('');

  // 2. The 5 Core Decisions in Domain Context
  const decKeys = [
    { key: 'coverage', label: '1. Coverage', sub: 'Which targets receive focus' },
    { key: 'route', label: '2. Route and timing', sub: 'Arrival sequencing and hours' },
    { key: 'inVisit', label: '3. In-visit priorities', sub: 'Highest-value physical actions' },
    { key: 'order', label: '4. Order and proposal', sub: 'Right lines, sizes and quantities' },
    { key: 'evidence', label: '5. Evidence and learning', sub: 'Closed-loop verified proof' },
  ];

  const decisionRows = decKeys.map((item) => {
    const dec = d.coreDecisions[item.key];
    if (!dec) return '';
    return `
      <div style="padding:12px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px;background:var(--card)">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <b style="color:var(--ink);font-size:0.95rem">${esc(item.label)}: ${esc(dec.question)}</b>
          <span class="pill accent" style="font-size:11px">${esc(dec.kpi)}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px">
          <div style="padding:8px;background:var(--paper-2);border-radius:6px;font-size:0.82rem">
            <span style="color:var(--bad);font-weight:600">${esc(t('Traditional flaw'))}:</span>
            <p style="margin:2px 0 0 0">${esc(dec.traditionalFlaw)}</p>
          </div>
          <div style="padding:8px;background:var(--paper-2);border-radius:6px;font-size:0.82rem">
            <span style="color:var(--good);font-weight:600">${esc(t('Assistor solution'))}:</span>
            <p style="margin:2px 0 0 0">${esc(dec.assistorSolution)}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 3. Compliance Firewalls
  const firewallCards = d.complianceFirewalls.map((c, idx) => `
    <div style="padding:10px 12px;border:1px solid var(--line);border-radius:6px;margin-bottom:6px;background:var(--card)">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        ${icon('shield', 14)}
        <b style="font-size:0.9rem">${esc(c.rule)}</b>
      </div>
      <p class="small muted" style="margin:0 0 4px 0">${esc(c.rationale)}</p>
      <div class="small" style="color:var(--accent)"><b>${esc(t('Enforcement'))}:</b> ${esc(c.enforcement)}</div>
    </div>
  `).join('');

  // 4. Deep Operational Use Cases
  const useCaseCards = d.deepUseCases.map((u, idx) => `
    <article class="card" style="margin-bottom:var(--s3);border-top:3px solid ${d.accent || 'var(--accent)'}">
      <div class="section-head" style="margin-bottom:8px">
        <h3 style="margin:0;font-size:1.05rem">${icon('brief', 16)} ${esc(u.title)}</h3>
        <span class="pill info">${esc(t('Field walkthrough'))}</span>
      </div>
      <p class="small" style="margin-bottom:10px"><b>${esc(t('Operational scenario'))}:</b> ${esc(u.scenario)}</p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:10px">
        <div style="background:var(--paper-2);padding:10px;border-radius:6px;font-size:0.85rem">
          <b style="color:var(--accent);display:block;margin-bottom:4px">${icon('agent', 14)} ${esc(t('Agent preparation'))}</b>
          <span>${esc(u.agentPreparation)}</span>
        </div>
        <div style="background:var(--paper-2);padding:10px;border-radius:6px;font-size:0.85rem">
          <b style="color:var(--ink);display:block;margin-bottom:4px">${icon('team', 14)} ${esc(t('Field execution'))}</b>
          <span>${esc(u.repExecution)}</span>
        </div>
      </div>

      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);padding:8px 12px;border-radius:6px;font-size:0.85rem">
        <span style="color:var(--good);font-weight:600">${icon('check', 14)} ${esc(t('Verified business outcome'))}:</span>
        <span style="margin-left:4px">${esc(u.verifiedOutcome)}</span>
      </div>
    </article>
  `).join('');

  return `
  <section class="page-head">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
      <div>
        <h1>${esc(t('Industry domain deep dive'))}</h1>
        <p class="muted">${esc(t('Authentic commercial channels, frontline friction, decision trees and operational workflows across 20 verticals.'))}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn secondary sm" data-act="download-domain-blueprint" data-id="${d.id}" style="min-height:var(--tap)">
          ${icon('note', 14)} ${esc(t('Export Blueprint'))}
        </button>
        ${!isCurrentActive ? `
          <button class="btn primary sm" data-act="switch-industry" data-id="${d.id}" style="min-height:var(--tap)">
            ${icon('sync', 14)} ${esc(t('Switch demo to {name}', { name: d.name }))}
          </button>
        ` : `
          <span class="pill good" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px">
            ${icon('check', 14)} ${esc(t('Active demo vertical'))}
          </span>
        `}
      </div>
    </div>
  </section>

  <!-- Horizontal Industry Vertical Selector -->
  <div style="overflow-x:auto;padding-bottom:8px;margin-bottom:var(--s3);display:flex;gap:4px;scrollbar-width:thin">
    ${chips}
  </div>

  ${ctx.ui?.domainToast ? `
    <div class="notice good" style="margin-bottom:var(--s3);display:flex;align-items:center;gap:6px">
      ${icon('check', 14)} <span>${esc(ctx.ui.domainToast)}</span>
    </div>
  ` : ''}

  <!-- Header Banner of Selected Domain -->
  <section class="card" style="margin-bottom:var(--s3);background:linear-gradient(to right, var(--paper-2), var(--card))">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:48px;height:48px;border-radius:12px;background:${d.accent || 'var(--accent)'};color:#fff;display:flex;align-items:center;justify-content:center">
        ${icon(d.icon || 'cart', 24)}
      </div>
      <div>
        <h2 style="margin:0 0 2px 0;font-size:1.3rem">${esc(d.name)}</h2>
        <p class="muted small" style="margin:0">${esc(d.tagline)}</p>
      </div>
    </div>

    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:10px">
      <div>
        <small>${esc(t('Channel architecture'))}</small>
        <b style="font-size:0.9rem">${esc(d.channelModel)}</b>
      </div>
      <div>
        <small>${esc(t('Key decision makers'))}</small>
        <b style="font-size:0.9rem">${esc(d.decisionMakers.slice(0, 2).join(', '))}</b>
      </div>
      <div>
        <small>${esc(t('Economic drivers'))}</small>
        <b style="font-size:0.85rem">${esc(d.economicDrivers)}</b>
      </div>
    </div>
  </section>

  <!-- Section 1: Frontline Pain Points -->
  <section style="margin-bottom:var(--s4)">
    <div class="section-head">
      <h2>${esc(t('Frontline friction and value leaks'))}</h2>
      <span class="pill warn">${esc(t('5 core failure modes'))}</span>
    </div>
    <p class="small muted" style="margin-bottom:12px">
      ${esc(t('Where margin, time, and customer relationships break down in everyday field operations without intelligent execution.'))}
    </p>
    ${painCards}
  </section>

  <!-- Section 2: Five Core Decisions -->
  <section style="margin-bottom:var(--s4)">
    <div class="section-head">
      <h2>${esc(t('The five decisions in {name}', { name: d.name }))}</h2>
      <span class="pill accent">${esc(t('Decision model'))}</span>
    </div>
    <p class="small muted" style="margin-bottom:12px">
      ${esc(t('How AI Assistor transforms habit and spreadsheets into explained, ranked, and verified field actions.'))}
    </p>
    ${decisionRows}
  </section>

  <!-- Section 3: Regulatory & Commercial Firewalls -->
  <section style="margin-bottom:var(--s4)">
    <div class="section-head">
      <h2>${esc(t('Regulatory and commercial firewalls'))}</h2>
      <span class="pill bad">${esc(t('Non-negotiables'))}</span>
    </div>
    <p class="small muted" style="margin-bottom:12px">
      ${esc(t('Industry-specific guardrails that AI agents strictly respect and never bypass.'))}
    </p>
    ${firewallCards}
  </section>

  <!-- Section 4: Operational Use Cases -->
  <section style="margin-bottom:var(--s4)">
    <div class="section-head">
      <h2>${esc(t('Operational use cases in action'))}</h2>
      <span class="pill good">${esc(t('End-to-end execution'))}</span>
    </div>
    <p class="small muted" style="margin-bottom:12px">
      ${esc(t('Concrete field walkthroughs proving how agents prepare, reps execute, and outcomes close the loop.'))}
    </p>
    ${useCaseCards}
  </section>
  `;
}
