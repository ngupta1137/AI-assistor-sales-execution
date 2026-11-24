// ==============================================================================
// EXECUTIVE PILOT ROI & BUSINESS CASE MODELER
// ==============================================================================
// Models quantified time savings, incremental customer coverage, and projected
// pilot value for C-level commercial leaders and pilot evaluation teams.
// ==============================================================================

import { esc, icon, pill } from '../ui.js';

export function calculateRoiMetrics({ reps = 50, visitsPerDay = 7, aov = 2400, workingDays = 220 }) {
  const repsNum = Math.max(1, Number(reps) || 50);
  const visitsNum = Math.max(1, Number(visitsPerDay) || 7);
  const aovNum = Math.max(100, Number(aov) || 2400);

  // Time metrics
  const minSavedPerVisit = 16; // From 20 min manual prep/reporting to 4 min governed AI brief
  const totalAnnualVisits = repsNum * visitsNum * workingDays;
  const annualHoursSaved = Math.round((totalAnnualVisits * minSavedPerVisit) / 60);
  const hoursSavedPerRepPerWeek = Math.round(((visitsNum * 5 * minSavedPerVisit) / 60) * 10) / 10;

  // Capacity recovery & coverage
  const extraVisitsPerRepPerDay = 1.2;
  const additionalAnnualTouchpoints = Math.round(repsNum * extraVisitsPerRepPerDay * workingDays);

  // Conservative pilot commercial value
  // Assuming 12% conversion on recovered touchpoints
  const incrementalOrders = Math.round(additionalAnnualTouchpoints * 0.12);
  const incrementalRevenue = Math.round(incrementalOrders * aovNum);

  return {
    reps: repsNum,
    visitsPerDay: visitsNum,
    aov: aovNum,
    workingDays,
    annualHoursSaved,
    hoursSavedPerRepPerWeek,
    additionalAnnualTouchpoints,
    incrementalOrders,
    incrementalRevenue,
  };
}

export function exportPilotCharter(ctx, params) {
  const m = calculateRoiMetrics(params);
  const indName = ctx?.industry?.name || 'Commercial Enterprise';
  const ctryName = ctx?.country?.name || 'Global';
  const currency = ctx?.country?.currency || '$';

  const doc = `# Executive Pilot Charter & Commercial ROI Assessment

**Prepared for:** ${ctx?.app?.config?.prepared || 'Enterprise Client Evaluation Committee'}
**Industry Scenario:** ${indName} (${ctryName})
**Date:** ${new Date().toISOString().slice(0, 10)}
**Governance Standard:** Human-in-the-Loop AI Supervision with Exact Policy Citations

---

## 1. Executive Summary & Value Thesis

This charter defines the scope, success benchmarks, and projected operational impact for a **90-Day Proof of Concept (PoC) Field Pilot** of the AI Assistor Sales Execution platform across **${m.reps} field sales representatives**.

Rather than automating decisions away from salespeople, the platform equips representatives with governed, overnight pre-briefings that:
1. Rank daily visits by validated commercial opportunity.
2. Prescribe specific, policy-compliant actions for each stop.
3. Automatically assemble pre-filled orders matching customer order cycles.

---

## 2. Quantified Pilot Impact Model

Based on a cohort of **${m.reps} sales representatives** conducting **${m.visitsPerDay} visits per day** over ${m.workingDays} field working days:

| Dimension | Baseline Operation | With AI Assistor | Annual Recovery |
| :--- | :--- | :--- | :--- |
| **Visit Preparation & Admin** | 20 min per visit | 4 min governed brief | **${m.annualHoursSaved.toLocaleString()} hours saved** (${m.hoursSavedPerRepPerWeek} hrs/rep/week) |
| **Active In-Field Capacity** | Habitual call frequency | Opportunity-ranked route | **+${m.additionalAnnualTouchpoints.toLocaleString()} customer visits** unlocked |
| **Coverage of Top Tier Accounts** | 62% coverage | 94% SLA compliance | Systematic elimination of coverage gaps |
| **Projected Pipeline Touchpoints** | Standard order baseline | Opportunity cross-sell | **${m.incrementalOrders.toLocaleString()} additional orders** |

*Note: All pilot impact figures are model projections for pilot evaluation. Real outcomes are measured against matched control territories during the 90-day evaluation.*

---

## 3. Governance Guardrails & Compliance Architecture

The pilot operates under strict compliance constraints:
- **Zero Hallucination Tolerance:** Recommendations cite deterministic governance rules with verified refusal triggers.
- **Representative Authority:** Field representatives retain final supervisory authority to approve, adjust, or override any action.
- **Works Council Privacy:** Aggregates individual representative telemetry to protect employee rights under European and local labor frameworks.
- **Local Data Isolation:** Operates with zero remote exfiltration during evaluation; customer data remains within local browser encrypted storage.

---

## 4. 90-Day Pilot Evaluation Milestones

- **Week 1-2 (Onboarding & Data Setup):** Ingestion of client customer accounts, catalogs, and commercial rules. Baseline telemetry establishment.
- **Week 3-6 (Cohort Field Execution):** Reps run daily briefs, capture digital receipts, and record override reasons.
- **Week 7-10 (Manager Coaching & Exception Analysis):** Sales leadership coaches from exception queues rather than chasing retrospective reports.
- **Week 11-12 (Executive Evaluation & Scale Roadmap):** Comparison against matched control group, pilot audit review, and production SaaS rollout plan.
`;

  const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `executive-pilot-charter-${new Date().toISOString().slice(0, 10)}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function renderRoiModal(app, ctx) {
  if (!app?.ui?.roiModalOpen) return '';

  const params = (app.ui.roiParams ||= {
    reps: 50,
    visitsPerDay: 7,
    aov: 2400,
  });

  const m = calculateRoiMetrics(params);
  const fmt = ctx?.fmt || { money: (v) => `$${Number(v).toLocaleString()}` };

  return `
  <div class="presenter-backdrop" data-act="close-roi-modal" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="roi-title" style="height:auto;max-height:90%;overflow-y:auto;z-index:95;max-width:680px">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="roi-title" style="display:flex;align-items:center;gap:8px">
          ${icon('brief', 20)} Executive Pilot ROI &amp; Business Case Modeler
        </h2>
        <small class="muted">Quantify operational time recovery, extra visit capacity, and pilot value.</small>
      </div>
      <button class="icon-btn" data-act="close-roi-modal" aria-label="Close dialog">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <!-- Parameter Controls -->
      <section class="card" style="margin:0;background:var(--surface-subtle);border:1px solid var(--line)">
        <b style="font-size:12px;margin-bottom:8px;display:block">Pilot Cohort Assumptions:</b>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
          <label class="field" style="margin:0">
            <span style="font-size:11px">Field Rep Cohort Size: <b>${m.reps} reps</b></span>
            <input type="range" min="10" max="300" step="5" value="${m.reps}" data-change="set-roi-reps" style="width:100%">
          </label>
          <label class="field" style="margin:0">
            <span style="font-size:11px">Visits per Rep / Day: <b>${m.visitsPerDay} visits</b></span>
            <input type="range" min="3" max="15" step="1" value="${m.visitsPerDay}" data-change="set-roi-visits" style="width:100%">
          </label>
          <label class="field" style="margin:0">
            <span style="font-size:11px">Average Order Value:</span>
            <input type="number" class="input" min="100" max="50000" step="100" value="${m.aov}" data-change="set-roi-aov" style="padding:4px 8px;font-size:12px">
          </label>
        </div>
      </section>

      <!-- Key Quantified Metric Cards -->
      <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin:0">
        <div class="card tight" style="margin:0">
          <small class="muted">Annual Admin Hours Saved</small>
          <b class="good-text" style="font-size:18px">${m.annualHoursSaved.toLocaleString()} hrs</b>
          <small style="color:var(--muted)">${m.hoursSavedPerRepPerWeek} hrs/rep/week</small>
        </div>
        <div class="card tight" style="margin:0">
          <small class="muted">Extra Customer Visits</small>
          <b class="good-text" style="font-size:18px">+${m.additionalAnnualTouchpoints.toLocaleString()}</b>
          <small style="color:var(--muted)">unlocked capacity</small>
        </div>
        <div class="card tight" style="margin:0">
          <small class="muted">Incremental Orders</small>
          <b style="font-size:18px">${m.incrementalOrders.toLocaleString()} orders</b>
          <small style="color:var(--muted)">at 12% conversion</small>
        </div>
        <div class="card tight" style="margin:0">
          <small class="muted">Projected Pipeline Impact</small>
          <b class="good-text money" style="font-size:18px">${fmt.money(m.incrementalRevenue)}</b>
          <small style="color:var(--muted)">modeled pilot value</small>
        </div>
      </div>

      <!-- Value Breakdown Details -->
      <div class="card tight" style="margin:0;font-size:11px;line-height:1.4">
        <b>Why This Model Works in Enterprise Sales:</b>
        <p class="muted" style="margin-top:4px">
          By eliminating 16 minutes of administrative preparation and manual reporting per stop, representatives convert recovered time directly into 1.2 additional high-value customer touchpoints every day. The app ensures every visit addresses verified inventory gaps and approved commercial promotions.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="btn-row" style="margin-top:4px">
        <button class="btn secondary" data-act="close-roi-modal" style="flex:1">Close</button>
        <button class="btn primary" data-act="download-roi-charter" style="flex:2">
          ${icon('note', 16)} Export Pilot Charter &amp; ROI Proposal (Markdown)
        </button>
      </div>

      ${app.ui?.roiToast ? `<div class="notice good" style="margin-top:6px">${icon('check', 14)}<span>${esc(app.ui.roiToast)}</span></div>` : ''}
    </div>
  </section>`;
}

export const roiModelerActions = {
  'open-roi-modal': ({ app }) => {
    (app.ui ||= {}).roiModalOpen = true;
    app.presenterOpen = false;
  },
  'close-roi-modal': ({ app }) => {
    if (app.ui) app.ui.roiModalOpen = false;
  },
  'set-roi-reps': ({ app, el }) => {
    const params = (app.ui.roiParams ||= {});
    params.reps = Number(el.value);
  },
  'set-roi-visits': ({ app, el }) => {
    const params = (app.ui.roiParams ||= {});
    params.visitsPerDay = Number(el.value);
  },
  'set-roi-aov': ({ app, el }) => {
    const params = (app.ui.roiParams ||= {});
    params.aov = Number(el.value);
  },
  'download-roi-charter': ({ app, ctx }) => {
    exportPilotCharter(ctx, app.ui?.roiParams || {});
    app.ui.roiToast = 'Exported Executive Pilot Charter and ROI proposal.';
    if (ctx?.m?.logAudit) {
      ctx.m.logAudit('Executive Modeler', 'Exported customized Pilot Charter & Commercial ROI Proposal');
    }
  },
};
