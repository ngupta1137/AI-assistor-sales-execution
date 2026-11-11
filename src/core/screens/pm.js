// Product Manager Layer: P1 Metric tree, P2 Decision log by market,
// P3 Bias and fairness checks by market, P4 Cost and speed economics.

import { esc, icon, pill } from '../ui.js';

export function render(ctx) {
  const { t, industry, country, ui, fmt } = ctx;
  const tab = ui?.pmTab || 'metric';

  // P1 Metric Tree calculation
  const reach = ui?.pmReach ?? 82;
  const accept = ui?.pmAccept ?? 91;
  const complete = ui?.pmComplete ?? 88;
  const unitVal = 240;
  const totalAccounts = 120;
  const visitedAccounts = Math.round(totalAccounts * (reach / 100));
  const suggestedActions = visitedAccounts * 4;
  const acceptedActions = Math.round(suggestedActions * (accept / 100));
  const completedActions = Math.round(acceptedActions * (complete / 100));
  const totalValueAddressed = completedActions * unitVal;

  // Identify weakest lever
  const levers = [
    { name: 'Reach (% accounts visited)', val: reach, target: 90 },
    { name: 'Acceptance (% suggestions approved)', val: accept, target: 92 },
    { name: 'Completion (% evidence verified)', val: complete, target: 90 },
  ];
  levers.sort((a, b) => a.val - b.val);
  const weakest = levers[0];

  // P2 Decision Log
  const defaultDecisions = [
    { date: '2026-10-15', decider: 'Commercial Director', change: 'Adjusted replenishment buffer from 10 to 14 days', reason: 'Prevent stock-outs ahead of seasonal surge', evalResult: '+3.8% sales lift proven in pilot', status: 'In production' },
    { date: '2026-09-28', decider: 'Operations Lead', change: 'Set max visit travel time limit to 45 minutes', reason: 'Avoid rep overtime during metro congestion', evalResult: 'Travel fatigue reduced 14%', status: 'In production' },
    { date: '2026-09-02', decider: 'Pricing Desk Lead', change: 'Autonomous volume rebate approval cap tested at 8%', reason: 'Accelerate closing on key distributor accounts', evalResult: 'Margin compression exceeded guardrail', status: 'Rolled back' },
    { date: '2026-08-14', decider: 'Product Manager', change: 'Integrated depot EDI stock feed with daily sync', reason: 'Reduce stale inventory recommendation flags', evalResult: 'Flagged error rate dropped from 4.2 to 1.1', status: 'In production' },
  ];
  const decisions = [...defaultDecisions, ...(ui?.customDecisions || [])];
  const filterStatus = ui?.pmDecisionStatus || 'all';
  const filteredDecisions = decisions.filter((d) => filterStatus === 'all' || d.status === filterStatus);

  // P3 Bias & Fairness Checks
  const reviewThresh = ui?.pmBiasThresh ?? 15;
  const segments = [
    { name: 'Tier A Customers', accept: 94.2, valuePerAcc: 1420, timeSpent: 38 },
    { name: 'Tier B Customers', accept: 90.8, valuePerAcc: 890, timeSpent: 32 },
    { name: 'Tier C Customers', accept: 74.5, valuePerAcc: 420, timeSpent: 22 },
    { name: 'Urban Metro Segment', accept: 92.1, valuePerAcc: 1180, timeSpent: 35 },
    { name: 'Regional Territory Segment', accept: 87.4, valuePerAcc: 840, timeSpent: 30 },
  ];
  const meanAccept = Math.round(segments.reduce((acc, s) => acc + s.accept, 0) / segments.length);
  const biasedSegments = segments.filter((s) => (meanAccept - s.accept) > reviewThresh);

  // P4 Cost & Speed Economics
  const monthlySuggestions = ui?.pmMonthlySugg ?? 50000;
  const cacheHitRate = ui?.pmCacheRate ?? 78;
  const monthlyBudget = 500;

  const tier1Cost = 0;
  const tier2Cost = (monthlySuggestions * (1 - cacheHitRate / 100) * 0.85 * 0.0001);
  const tier3Cost = (monthlySuggestions * (1 - cacheHitRate / 100) * 0.15 * 0.003);
  const totalCostEst = Math.round(tier2Cost + tier3Cost);
  const budgetAlert = totalCostEst > monthlyBudget;

  return `
  <section class="page-head">
    <span class="eyebrow">${esc(industry.name)} · Strategic Portfolio Management</span>
    <h1>Product Operations &amp; Commercial Economics</h1>
    <p class="small muted">Value trees, market decision governance, demographic parity checks, and model inference unit economics.</p>
  </section>

  <!-- PM Sub-navigation -->
  <div class="seg-ctl" role="group" aria-label="Product management views" style="margin-bottom:var(--s3);overflow-x:auto;padding-bottom:2px">
    <button class="seg ${tab === 'metric' ? 'on' : ''}" data-act="set-pm-tab" data-tab="metric" style="min-height:var(--tap);min-width:var(--tap)">Metric tree (P1)</button>
    <button class="seg ${tab === 'decisions' ? 'on' : ''}" data-act="set-pm-tab" data-tab="decisions" style="min-height:var(--tap);min-width:var(--tap)">Decision log (P2)</button>
    <button class="seg ${tab === 'bias' ? 'on' : ''}" data-act="set-pm-tab" data-tab="bias" style="min-height:var(--tap);min-width:var(--tap)">Bias checks (P3)</button>
    <button class="seg ${tab === 'economics' ? 'on' : ''}" data-act="set-pm-tab" data-tab="economics" style="min-height:var(--tap);min-width:var(--tap)">Economics &amp; speed (P4)</button>
  </div>

  ${tab === 'metric' ? `
    <!-- P1 Metric Tree -->
    <section class="card" style="margin-bottom:var(--s3)">
      <div class="section-head" style="margin-bottom:8px">
        <h2>Commercial Value Formula Metric Tree</h2>
        ${pill('Interactive Sensitivity Model', 'good')}
      </div>
      <p class="small muted" style="margin-bottom:12px">Formula: Value Addressed = Reach (% accounts visited) x Acceptance (% approved) x Completion (% verified) x Unit Value.</p>

      <!-- Metric Tree Formula Display -->
      <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <span class="small muted">Projected Cycle Value Addressed (Sample):</span>
          <div style="font-size:20px;font-weight:700;color:var(--good)">
            ${fmt.money(totalValueAddressed)}
          </div>
        </div>
        <div style="font-size:11px;color:var(--ink)">
          ${visitedAccounts} visited · ${acceptedActions} accepted · ${completedActions} closed
        </div>
      </div>

      <!-- Sliders for levers -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
            <span>Reach (% of accounts visited):</span><b>${reach}%</b>
          </div>
          <input type="range" min="50" max="100" step="1" value="${reach}" data-change="set-pm-reach" style="width:100%;height:var(--tap);cursor:pointer">
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
            <span>Acceptance (% actions approved or adjusted):</span><b>${accept}%</b>
          </div>
          <input type="range" min="50" max="100" step="1" value="${accept}" data-change="set-pm-accept" style="width:100%;height:var(--tap);cursor:pointer">
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
            <span>Completion (% approved actions with evidence):</span><b>${complete}%</b>
          </div>
          <input type="range" min="50" max="100" step="1" value="${complete}" data-change="set-pm-complete" style="width:100%;height:var(--tap);cursor:pointer">
        </div>
      </div>

      <!-- Weakest Lever Diagnostic -->
      <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--warn, #f59e0b)">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          ${icon('bulb', 16)}
          <b style="font-size:12px">Opportunity Diagnostic: Focus on ${esc(weakest.name.split('(')[0].trim())}</b>
        </div>
        <p class="small muted" style="margin:0;line-height:1.4">
          Current performance is at <b>${weakest.val}%</b>. Increasing this lever to the target benchmark of ${weakest.target}% yields an estimated incremental <b>+$${Math.round(totalValueAddressed * 0.12).toLocaleString()}</b> in cycle value.
        </p>
      </div>
    </section>
  ` : tab === 'decisions' ? `
    <!-- P2 Decision Log by Market -->
    <section class="card" style="margin-bottom:var(--s3)">
      <div class="section-head" style="margin-bottom:8px">
        <h2>Market Policy Decision Ledger</h2>
        ${pill(`${filteredDecisions.length} Decisions`, 'info')}
      </div>
      <p class="small muted" style="margin-bottom:12px">Chronological record of commercial and algorithmic policy alterations for ${esc(country.name)} with empirical validation proofs.</p>

      <!-- Status Filter -->
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">
        <span class="small muted">Filter status:</span>
        <select data-change="set-pm-decision-filter" style="height:var(--tap);font-size:11px">
          <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All decisions</option>
          <option value="In production" ${filterStatus === 'In production' ? 'selected' : ''}>In production</option>
          <option value="In pilot" ${filterStatus === 'In pilot' ? 'selected' : ''}>In pilot</option>
          <option value="Rolled back" ${filterStatus === 'Rolled back' ? 'selected' : ''}>Rolled back</option>
        </select>
      </div>

      <!-- Table of Decisions -->
      <div style="overflow-x:auto;margin-bottom:14px">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="border-bottom:2px solid var(--line);text-align:left">
              <th style="padding:6px 4px">Date</th>
              <th style="padding:6px 4px">Decider</th>
              <th style="padding:6px 4px">What Changed</th>
              <th style="padding:6px 4px">Business Reason</th>
              <th style="padding:6px 4px">Empirical Validation</th>
              <th style="padding:6px 4px">Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDecisions.map((d) => `
              <tr style="border-bottom:1px solid var(--line-soft)">
                <td style="padding:6px 4px"><time>${esc(d.date)}</time></td>
                <td style="padding:6px 4px"><b>${esc(d.decider)}</b></td>
                <td style="padding:6px 4px">${esc(d.change)}</td>
                <td style="padding:6px 4px">${esc(d.reason)}</td>
                <td style="padding:6px 4px"><span class="good-text">${esc(d.evalResult)}</span></td>
                <td style="padding:6px 4px">${pill(d.status, d.status === 'In production' ? 'good' : d.status === 'In pilot' ? 'warn' : 'bad')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Add Decision Form -->
      <div class="card tight" style="margin:0;background:var(--surface-subtle)">
        <b style="font-size:12px;display:block;margin-bottom:6px">Record Governance Decision (Session Memory)</b>
        <div style="display:flex;flex-direction:column;gap:8px">
          <input type="text" id="pm-dec-change" placeholder="What changed in policy or parameters..." style="width:100%;padding:6px 8px;font-size:12px;border:1px solid var(--line);border-radius:4px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between">
            <input type="text" id="pm-dec-reason" placeholder="Business rationale..." style="flex:1;min-width:140px;height:var(--tap);padding:0 8px;font-size:11px;border:1px solid var(--line);border-radius:4px">
            <select id="pm-dec-status" style="height:var(--tap);font-size:11px">
              <option value="In production">In production</option>
              <option value="In pilot">In pilot</option>
              <option value="Rolled back">Rolled back</option>
            </select>
            <button class="btn primary sm" data-act="add-pm-decision" style="min-height:var(--tap);font-size:11px">Record decision</button>
          </div>
        </div>
      </div>
    </section>
  ` : tab === 'bias' ? `
    <!-- P3 Bias and Fairness Checks by Market -->
    <section class="card" style="margin-bottom:var(--s3)">
      <div class="section-head" style="margin-bottom:8px">
        <h2>Demographic Parity &amp; Fairness Diagnostics</h2>
        ${pill(biasedSegments.length ? 'Disparity Alert' : 'Parity Clean', biasedSegments.length ? 'warn' : 'good')}
      </div>
      <p class="small muted" style="margin-bottom:12px">Monitors algorithmic fairness across tiers, channel styles, and geographies. Disparities exceeding the sensitivity threshold trigger operational review.</p>

      <!-- Threshold Slider -->
      <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-weight:600;font-size:12px">Fairness Review Threshold:</span>
          <b style="font-size:13px;color:var(--accent)">${reviewThresh} percentage points below mean</b>
        </div>
        <input type="range" min="5" max="25" step="1" value="${reviewThresh}" data-change="set-pm-bias-thresh" style="width:100%;height:var(--tap);cursor:pointer">
        <span class="small muted" style="font-size:10px">Overall market acceptance mean: <b>${meanAccept}%</b>. Flag trigger: &lt;${meanAccept - reviewThresh}%.</span>
      </div>

      <!-- Segment Table -->
      <div style="overflow-x:auto;margin-bottom:12px">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="border-bottom:2px solid var(--line);text-align:left">
              <th style="padding:6px 4px">Segment Group</th>
              <th style="padding:6px 4px">Acceptance Rate</th>
              <th style="padding:6px 4px">Cycle Value / Account</th>
              <th style="padding:6px 4px">Visit Duration</th>
              <th style="padding:6px 4px">Parity Status</th>
            </tr>
          </thead>
          <tbody>
            ${segments.map((s) => {
              const diff = meanAccept - s.accept;
              const isAlert = diff > reviewThresh;
              return `
              <tr style="border-bottom:1px solid var(--line-soft);background:${isAlert ? 'var(--warn-bg, #fffbeb)' : 'transparent'}">
                <td style="padding:6px 4px"><b>${esc(s.name)}</b></td>
                <td style="padding:6px 4px"><span style="color:${isAlert ? 'var(--warn, #b45309)' : 'var(--ink)'};font-weight:${isAlert ? '700' : '500'}">${s.accept}%</span></td>
                <td style="padding:6px 4px">${fmt.money(s.valuePerAcc)}</td>
                <td style="padding:6px 4px">${s.timeSpent} min</td>
                <td style="padding:6px 4px">
                  ${isAlert ? pill(`Alert: -${diff.toFixed(1)}% vs mean`, 'warn') : pill('Parity safe', 'good')}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      ${biasedSegments.length ? `
        <div class="notice warn">
          <b>Operational Action Required:</b> ${biasedSegments.length} segment group is under-indexed on acceptance. Review recommendation volume and evidence constraints to avoid underserved accounts.
        </div>
      ` : ''}
    </section>
  ` : tab === 'economics' ? `
    <!-- P4 Cost and Speed Calculator -->
    <section class="card" style="margin-bottom:var(--s3)">
      <div class="section-head" style="margin-bottom:8px">
        <h2>Model Inference Economics &amp; Latency Budget</h2>
        ${pill(budgetAlert ? 'Budget Overrun Risk' : 'Cost Sustainable', budgetAlert ? 'bad' : 'good')}
      </div>
      <p class="small muted" style="margin-bottom:12px">Inference cost tiering and speed budgeting ensuring sub-200ms mobile experience within corporate budgets.</p>

      <!-- Latency Breakdown -->
      <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle)">
        <b style="font-size:12px;display:block;margin-bottom:6px">End-to-End Latency Budget (Target: &lt;200ms)</b>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(90px,1fr))">
          <div><small>Cache lookups</small><b>5 ms</b></div>
          <div><small>Policy rules</small><b>12 ms</b></div>
          <div><small>Model inference</small><b>145 ms</b></div>
          <div><small>UI render</small><b>18 ms</b></div>
          <div><small>Total round-trip</small><b class="good-text">180 ms (OK)</b></div>
        </div>
      </div>

      <!-- Sliders for Cost Projection -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:12px">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
            <span>Projected Monthly Field Suggestions:</span><b>${monthlySuggestions.toLocaleString()} requests</b>
          </div>
          <input type="range" min="10000" max="200000" step="5000" value="${monthlySuggestions}" data-change="set-pm-monthly-sugg" style="width:100%;height:var(--tap);cursor:pointer">
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
            <span>Local Cache Hit Ratio:</span><b>${cacheHitRate}% cached</b>
          </div>
          <input type="range" min="40" max="95" step="1" value="${cacheHitRate}" data-change="set-pm-cache-rate" style="width:100%;height:var(--tap);cursor:pointer">
        </div>
      </div>

      <!-- Economics summary -->
      <div class="card tight" style="margin:0;background:var(--surface-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <span class="small muted">Projected Monthly LLM Inference Bill:</span>
          <div style="font-size:18px;font-weight:700;color:${budgetAlert ? 'var(--bad)' : 'var(--good)'}">
            $${totalCostEst} / month
          </div>
        </div>
        <div>
          <small class="muted">Monthly budget limit:</small> <b>$${monthlyBudget}</b>
          <div>${budgetAlert ? pill('Alert: Budget Exceeded', 'bad') : pill('Within Budget', 'good')}</div>
        </div>
      </div>
    </section>
  ` : ''}

  <p class="foot-note">Metrics and economic projections are based on field telemetry sample figures.</p>`;
}

export const pmActions = {
  'set-pm-tab': ({ ctx, data }) => {
    (ctx.ui ||= {}).pmTab = data.tab;
  },

  'set-pm-reach': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 82);
    (ctx.ui ||= {}).pmReach = val;
  },
  'set-pm-accept': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 91);
    (ctx.ui ||= {}).pmAccept = val;
  },
  'set-pm-complete': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 88);
    (ctx.ui ||= {}).pmComplete = val;
  },

  'set-pm-decision-filter': ({ ctx, value }) => {
    (ctx.ui ||= {}).pmDecisionStatus = value;
  },

  'add-pm-decision': ({ ctx }) => {
    const changeEl = document.getElementById('pm-dec-change');
    const reasonEl = document.getElementById('pm-dec-reason');
    const statusEl = document.getElementById('pm-dec-status');

    const change = changeEl ? changeEl.value.trim() : '';
    const reason = reasonEl ? reasonEl.value.trim() : 'Operational optimization';
    const status = statusEl ? statusEl.value : 'In production';

    if (!change) return;

    const list = ctx.ui?.customDecisions || [];
    list.unshift({
      date: new Date().toISOString().slice(0, 10),
      decider: ctx.persona === 'admin' ? 'Market Operations' : 'Sales Lead',
      change,
      reason,
      evalResult: 'Awaiting 14-day field cycle verification',
      status,
    });
    (ctx.ui ||= {}).customDecisions = list;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Product Operations', `Recorded governance decision: "${change.slice(0, 30)}..." (${status})`);
    }
  },

  'set-pm-bias-thresh': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 15);
    (ctx.ui ||= {}).pmBiasThresh = val;
  },

  'set-pm-monthly-sugg': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 50000);
    (ctx.ui ||= {}).pmMonthlySugg = val;
  },
  'set-pm-cache-rate': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 78);
    (ctx.ui ||= {}).pmCacheRate = val;
  },
};


// Registered with the app through screens/index.js, which reads `actions`.
export const actions = pmActions;
