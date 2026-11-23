// Interactive Domain Deep-Dive Explorer.
// Operational profiles for every industry pack. Scenarios are illustrative; figures are sample data.
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
        `  What good looks like (illustrative): ${u.verifiedOutcome}`,
        ''
      ]),
      '========================================================================',
      'ILLUSTRATIVE BLUEPRINT. SAMPLE DATA. NO FIGURE HERE IS A MEASURED RESULT.',
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
  const packs = INDUSTRIES.filter((ind) => DOMAIN_INTELLIGENCE[ind.id]);

  const chips = packs.map((ind) => {
    const on = ind.id === d.id;
    return `<button class="chip${on ? ' on' : ''}" data-act="select-domain" data-id="${ind.id}" aria-pressed="${on}">
      ${icon(ind.icon || 'cart', 14)}<span>${esc(ind.name)}</span>${ind.id === industry.id ? `<span class="chip-tag">${esc(t('Active'))}</span>` : ''}
    </button>`;
  }).join('');

  const leakRows = d.frontlinePainPoints.map((p, idx) => `
    <div class="dd-row">
      <div class="dd-cell leak"><span class="eyebrow">${esc(t('Field leak'))} ${idx + 1}</span><b>${esc(p.title)}</b>
        <p class="small">${esc(p.friction)}</p><p class="small muted"><b>${esc(t('Cost'))}:</b> ${esc(p.costOfFailure)}</p></div>
      <div class="dd-cell flow"><span class="eyebrow">${icon('agent', 12)} ${esc(t('AI Assistor workflow'))}</span><p class="small">${esc(p.solvedBy)}</p></div>
    </div>`).join('');

  const decKeys = [['coverage', 'Coverage'], ['route', 'Route and timing'], ['inVisit', 'In-visit priorities'], ['order', 'Order and proposal'], ['evidence', 'Evidence and learning']];
  const decisionRows = decKeys.filter(([k]) => d.coreDecisions[k]).map(([k, label], i) => {
    const dec = d.coreDecisions[k];
    return `<div class="dd-row">
      <div class="dd-cell leak"><span class="eyebrow">${i + 1}. ${esc(t(label))}</span><b>${esc(dec.question)}</b><p class="small muted">${esc(dec.traditionalFlaw)}</p></div>
      <div class="dd-cell flow"><span class="eyebrow">${esc(dec.kpi)}</span><p class="small">${esc(dec.assistorSolution)}</p></div>
    </div>`;
  }).join('');

  const firewalls = d.complianceFirewalls.map((c) => `<li class="dd-fw">${icon('shield', 14)}<span><b>${esc(c.rule)}</b><span class="small muted">${esc(c.rationale)}</span><span class="small">${esc(t('Enforcement'))}: ${esc(c.enforcement)}</span></span></li>`).join('');

  const useCases = d.deepUseCases.map((u) => `
    <article class="card dd-case">
      <div class="section-head"><h3>${esc(u.title)}</h3>${pill(t('Illustrative'), 'muted')}</div>
      <p class="small">${esc(u.scenario)}</p>
      <div class="dd-row">
        <div class="dd-cell"><span class="eyebrow">${icon('agent', 12)} ${esc(t('Agent preparation'))}</span><p class="small">${esc(u.agentPreparation)}</p></div>
        <div class="dd-cell"><span class="eyebrow">${icon('team', 12)} ${esc(t('Field execution'))}</span><p class="small">${esc(u.repExecution)}</p></div>
      </div>
      <p class="small"><b>${esc(t('What good looks like'))}:</b> ${esc(u.verifiedOutcome)}</p>
    </article>`).join('');

  return `
  <section class="page-head">
    <h1>${esc(t('Industry deep dive'))}</h1>
    <p class="small muted">${esc(t('Channels, field leaks, decisions and guardrails for each of the {n} industry packs. Scenarios are illustrative and figures are sample data.', { n: packs.length }))}</p>
  </section>
  <div class="chip-bar" role="group" aria-label="${esc(t('Industry'))}">${chips}</div>
  ${ctx.ui?.domainToast ? `<div class="notice good">${icon('check', 14)}<span>${esc(ctx.ui.domainToast)}</span></div>` : ''}

  <section class="card dd-head">
    <div class="dd-title"><span class="dd-mark" style="background:${esc(d.accent || 'var(--accent)')}">${icon(d.icon || 'cart', 18)}</span>
      <span class="row-main"><h2>${esc(d.name)}</h2><small class="muted">${esc(d.tagline)}</small></span></div>
    <div class="dd-toolbar">
      ${isCurrentActive ? pill(t('Active demo vertical'), 'good') : `<button class="btn primary sm" data-act="switch-industry" data-id="${d.id}">${icon('sync', 14)} ${esc(t('Switch demo to this vertical'))}</button>`}
      <button class="btn secondary sm" data-act="download-domain-blueprint" data-id="${d.id}">${icon('note', 14)} ${esc(t('Export blueprint'))}</button>
    </div>
    <div class="facts dd-facts">
      <div><small>${esc(t('Channel model'))}</small><b>${esc(d.channelModel)}</b></div>
      <div><small>${esc(t('Decision makers'))}</small><b>${esc(d.decisionMakers.slice(0, 3).join(', '))}</b></div>
      <div><small>${esc(t('Economic drivers'))}</small><b>${esc(d.economicDrivers)}</b></div>
    </div>
  </section>

  <section class="dd-sec">
    <div class="section-head"><h2>${esc(t('Field leaks and the workflow that closes each'))}</h2>${pill(String(d.frontlinePainPoints.length), 'warn')}</div>
    ${leakRows}
  </section>

  <section class="dd-sec">
    <div class="section-head"><h2>${esc(t('The five decisions'))}</h2></div>
    ${decisionRows}
  </section>

  <section class="card dd-sec">
    <div class="section-head"><h2>${esc(t('Guardrails the agents never bypass'))}</h2></div>
    <ul class="dd-fw-list">${firewalls}</ul>
  </section>

  <section class="dd-sec">
    <div class="section-head"><h2>${esc(t('Use cases'))}</h2></div>
    ${useCases}
  </section>`;
}
