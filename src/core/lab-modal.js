// Portfolio Lab Overlay (Floating button bottom-left, phone-friendly 40px circle)
// Hosts tabs L-AB to L-DEC for unified governance, ROI, A/B simulation, and testing.

import { esc, icon, pill } from './ui.js';

export function renderLabModal(app, ctx) {
  if (!app.ui?.labOpen || !ctx) return '';
  const tab = app.ui?.labTab || 'ab';

  // L-AB Sliders
  const abLift = app.ui?.abLift ?? 4.2;
  const abSample = app.ui?.abSample ?? 2500;
  const abMde = app.ui?.abMde ?? 2.0;
  const abNoise = app.ui?.abNoise ?? 1.5;
  const abConfident = abLift >= abMde && abNoise < 2.0;

  // L-ROI Sliders
  const roiOverlap = app.ui?.roiOverlap ?? 20;
  const grossMarginLift = Math.round(180000 * (1 - roiOverlap / 100));
  const travelSavings = Math.round(45000 * (1 - roiOverlap / 100));
  const inventorySavings = Math.round(35000 * (1 - roiOverlap / 100));
  const platformCost = 28000;
  const netRoi = grossMarginLift + travelSavings + inventorySavings - platformCost;

  // L-OUT Precedence Simulator
  const condCompliance = !!app.ui?.outCompliance;
  const condRole = !!app.ui?.outRole;
  const condStale = !!app.ui?.outStale;
  const condConflict = !!app.ui?.outConflict;
  const condEvidence = !!app.ui?.outEvidence;
  const condClarify = !!app.ui?.outClarify;

  let winningOutcome = 'Suggest';
  let winningReason = 'All data verified, rules aligned, role authorized.';
  if (condCompliance) {
    winningOutcome = 'Compliance escalation';
    winningReason = 'Highest precedence: legal safety boundary breached.';
  } else if (condRole) {
    winningOutcome = 'Not allowed for this role';
    winningReason = 'Second precedence: role restriction in rights matrix.';
  } else if (condStale) {
    winningOutcome = 'Data is stale';
    winningReason = 'Third precedence: underlying ERP/CRM input expired.';
  } else if (condConflict) {
    winningOutcome = 'Policy conflict';
    winningReason = 'Fourth precedence: two approved policies disagree.';
  } else if (condEvidence) {
    winningOutcome = 'Not enough evidence';
    winningReason = 'Fifth precedence: baseline field verification missing.';
  } else if (condClarify) {
    winningOutcome = 'Needs clarification';
    winningReason = 'Sixth precedence: execution ambiguity requires choice.';
  }

  // L-US Usage counters
  const clicks = app.ui?.sessionClicks || 48;
  const views = app.ui?.sessionViews || 19;

  // L-RT Rights Simulator
  const selRole = app.ui?.simRole || 'rep';
  const selAction = app.ui?.simAction || 'override_brief';
  const allowedInMatrix = (ctx.industry.governance?.rights?.actions?.[selRole] || []).includes(selAction);

  const tabs = [
    ['ab', 'L-AB: A/B Test'],
    ['roi', 'L-ROI: Calculator'],
    ['mat', 'L-MAT: Maturity'],
    ['ch', 'L-CH: Change'],
    ['out', 'L-OUT: Outcomes'],
    ['pv', 'L-PV: Authority'],
    ['rv', 'L-RV: Review queue'],
    ['rt', 'L-RT: Rights sim'],
    ['gp', 'L-GP: Gaps & terms'],
    ['cd', 'L-CD: Card demo'],
    ['tr', 'L-TR: Trace inspector'],
    ['dec', 'L-DEC: Model gateway'],
    ['us', 'L-US: Usage telemetry'],
  ];

  return `
  <div class="presenter-backdrop" data-act="close-lab-modal" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="lab-modal-title" style="height:90%;max-height:90%;overflow-y:auto;z-index:95">
    <header class="as-head">
      <div>
        <h2 id="lab-modal-title" style="display:flex;align-items:center;gap:6px">
          ${icon('screen', 20)} Enterprise Portfolio Lab
        </h2>
        <small>Simulation sandbox, governance matrices, and algorithmic proofs</small>
      </div>
      <button class="icon-btn" data-act="close-lab-modal" aria-label="Close portfolio lab">${icon('x', 20)}</button>
    </header>

    <!-- Lab Sub-navigation -->
    <div style="padding:var(--s2) var(--s4) 0 var(--s4);overflow-x:auto;display:flex;gap:4px;border-bottom:1px solid var(--line-soft)">
      ${tabs.map(([id, label]) => `
        <button class="seg sm ${tab === id ? 'on' : ''}" data-act="set-lab-tab" data-tab="${id}" style="min-height:var(--tap);min-width:var(--tap);white-space:nowrap;font-size:11px">
          ${esc(label)}
        </button>
      `).join('')}
    </div>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      ${tab === 'ab' ? `
        <!-- L-AB A/B Simulation -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>A/B Testing Simulation &amp; Rollout Gate</h3>
            ${pill(abConfident ? 'Rollout Cleared (>=95% Conf, >=2% Lift)' : 'Insufficient Lift', abConfident ? 'good' : 'warn')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Pre-registered decision rule: Roll out candidate policy only if test achieves at least 95% statistical confidence and minimum 2.0% uplift.</p>

          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
                <span>Observed Uplift:</span><b>+${abLift}%</b>
              </div>
              <input type="range" min="0" max="8" step="0.2" value="${abLift}" data-change="set-ab-lift" style="width:100%;height:var(--tap);cursor:pointer">
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
                <span>Sample Size (Accounts):</span><b>${abSample} accounts</b>
              </div>
              <input type="range" min="500" max="10000" step="250" value="${abSample}" data-change="set-ab-sample" style="width:100%;height:var(--tap);cursor:pointer">
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
                <span>Field Noise Factor:</span><b>${abNoise}x standard deviation</b>
              </div>
              <input type="range" min="0.5" max="3" step="0.1" value="${abNoise}" data-change="set-ab-noise" style="width:100%;height:var(--tap);cursor:pointer">
            </div>
          </div>

          <div class="facts" style="margin-top:14px;grid-template-columns:repeat(auto-fit,minmax(110px,1fr))">
            <div><small>Calculated p-value</small><b>${abConfident ? 'p = 0.012' : 'p = 0.084'}</b></div>
            <div><small>Statistical power</small><b>${abSample >= 2000 ? '92%' : '78%'}</b></div>
            <div><small>Decision</small><b class="${abConfident ? 'good-text' : 'warn-text'}">${abConfident ? 'Roll Out Fleetwide' : 'Continue Pilot'}</b></div>
          </div>
        </section>
      ` : tab === 'roi' ? `
        <!-- L-ROI Calculator -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Enterprise Portfolio ROI Calculator</h3>
            ${pill('Deduplicated Value Tree', 'good')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Models net commercial returns with an interactive overlap discount slider preventing double-counting between product agents.</p>

          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
              <span>Agent Capability Overlap Discount:</span><b>${roiOverlap}% overlap</b>
            </div>
            <input type="range" min="0" max="50" step="5" value="${roiOverlap}" data-change="set-roi-overlap" style="width:100%;height:var(--tap);cursor:pointer">
            <span class="small muted" style="font-size:10px">Discounts cross-agent cannibalization between Gap Detection and Action Ranking.</span>
          </div>

          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">
            <div><small>Gross margin uplift</small><b class="good-text">+$${grossMarginLift.toLocaleString()}</b></div>
            <div><small>Travel time saved</small><b class="good-text">+$${travelSavings.toLocaleString()}</b></div>
            <div><small>Inventory holding</small><b class="good-text">+$${inventorySavings.toLocaleString()}</b></div>
            <div><small>Platform run cost</small><b class="warn-text">-$${platformCost.toLocaleString()}</b></div>
          </div>

          <div class="card tight" style="margin-top:12px;background:var(--surface-subtle);display:flex;justify-content:space-between;align-items:center">
            <b style="font-size:13px">Net Projected Annual Return (Sample):</b>
            <b style="font-size:16px;color:var(--good)">+$${netRoi.toLocaleString()}</b>
          </div>
        </section>
      ` : tab === 'mat' ? `
        <!-- L-MAT Maturity Matrix -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Market Maturity Diagnostic Matrix</h3>
            ${pill('Level 1 to Level 3', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Diagnostic mapping commercial maturity clusters to proxy versus full algorithmic execution.</p>

          <div style="display:flex;flex-direction:column;gap:8px">
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
              <b>Level 1: Assist (Emerging Markets)</b>
              <p class="small muted" style="margin:2px 0 0 0">Thin telemetry. Uses heuristic regional proxies and standard frequency visits.</p>
            </div>
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
              <b>Level 2: Augment (Developing Markets)</b>
              <p class="small muted" style="margin:2px 0 0 0">EDI depot scans enabled. Value-per-minute ranking active with supervisor review.</p>
            </div>
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--good)">
              <b>Level 3: Autonomous (Established Markets)</b>
              <p class="small muted" style="margin:2px 0 0 0">Full live telemetry, automated order replenishment, and dynamic cycle replanning.</p>
            </div>
          </div>
        </section>
      ` : tab === 'ch' ? `
        <!-- L-CH Change Tracking -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Field Adoption &amp; Change Tracking</h3>
            ${pill('Rep Protection Active', 'good')}
          </div>
          <div class="notice good" style="margin-bottom:12px">
            <b>Rep Protection Notice:</b> Recommendations are advisory decision aids, not rigid quotas. Rep overrides are treated as valuable frontline training signals, never penalised.
          </div>

          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">
            <div><small>Rep acceptance rate</small><b>91.2%</b></div>
            <div><small>Override rate</small><b>5.8%</b></div>
            <div><small>Feedback flags logged</small><b>14 tickets</b></div>
            <div><small>Coaching completion</small><b>96.5%</b></div>
          </div>
        </section>
      ` : tab === 'out' ? `
        <!-- L-OUT Outcomes Precedence Simulator -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Outcomes Precedence Simulator</h3>
            ${pill('Precedence Engine', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Toggle conditions below to verify that outcomes resolve deterministically under strict safety priority.</p>

          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Compliance" ${condCompliance ? 'checked' : ''}>
              <span><b>1. Compliance boundary breached</b> (Escalation stop)</span>
            </label>
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Role" ${condRole ? 'checked' : ''}>
              <span><b>2. Action outside rep role scope</b> (Permission restriction)</span>
            </label>
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Stale" ${condStale ? 'checked' : ''}>
              <span><b>3. Data age exceeds stale threshold</b> (Data freshness stop)</span>
            </label>
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Conflict" ${condConflict ? 'checked' : ''}>
              <span><b>4. Two approved rules disagree</b> (Policy conflict)</span>
            </label>
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Evidence" ${condEvidence ? 'checked' : ''}>
              <span><b>5. Baseline field verification missing</b> (Thin evidence)</span>
            </label>
            <label style="font-size:11px;display:flex;align-items:center;gap:6px">
              <input type="checkbox" data-change="sim-out-cond" data-cond="Clarify" ${condClarify ? 'checked' : ''}>
              <span><b>6. Execution format needs clarification</b> (Choice chips)</span>
            </label>
          </div>

          <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
            <div style="font-size:11px;color:var(--muted)">Winning Deterministic Outcome:</div>
            <b style="font-size:14px;color:var(--ink)">${esc(winningOutcome)}</b>
            <p class="small muted" style="margin:2px 0 0 0">${esc(winningReason)}</p>
          </div>
        </section>
      ` : tab === 'pv' ? `
        <!-- L-PV Authority & Applicability Inspector -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Candidate Rule Authority Inspector</h3>
            ${pill('Edit Drift Monitor', 'good')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Inspects proposed candidate rules for scope matching, never-decides compliance, and edit drift warnings.</p>

          <div class="card tight" style="margin:0;background:var(--surface-subtle);display:flex;flex-direction:column;gap:6px">
            <div><small>Inspected rule:</small> <b>Standard Cycle Volume Target</b></div>
            <div><small>Approver:</small> <b>Regional Legal Counsel</b></div>
            <div><small>Scope:</small> <b>Tier A &amp; Tier B Retailers</b></div>
            <div><small>Never-decides check:</small> <span class="good-text">Pass (Does not alter prices or judge rep)</span></div>
            <div><small>Edit drift flag:</small> <span class="good-text">Clean (Matches signed SHA256 checksum)</span></div>
          </div>
        </section>
      ` : tab === 'rv' ? `
        <!-- L-RV Maker-Checker Review Queue -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Maker-Checker Policy Review Queue</h3>
            ${pill('Dual Sign-Off', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Policy updates require dual authorization: business author proposal followed by compliance review.</p>

          <div class="card tight" style="margin:0;background:var(--surface-subtle)">
            <b style="font-size:12px">Pending Rule: Seasonal Stock-Out Buffer v2.5</b>
            <div class="small muted" style="margin:4px 0 8px 0">Author: Field Ops Lead · Approver: Legal Counsel</div>
            <div style="padding:6px;background:var(--surface);border:1px solid var(--line-soft);font-size:11px;margin-bottom:8px">
              <b>Wording Diff:</b> Increased depot safety stock threshold from 10 days to 14 days during promotional surge.
            </div>
            <div style="display:flex;gap:6px;justify-content:flex-end">
              <button class="btn secondary sm" data-act="reject-review-rule" style="min-height:var(--tap);font-size:11px">Reject</button>
              <button class="btn good sm" data-act="approve-review-rule" style="min-height:var(--tap);font-size:11px">Approve policy</button>
            </div>
          </div>
        </section>
      ` : tab === 'rt' ? `
        <!-- L-RT Rights Simulator -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Role x Action Rights Matrix Simulator</h3>
            ${pill(allowedInMatrix ? 'Action Permitted' : 'Action Denied', allowedInMatrix ? 'good' : 'bad')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Test permissions dynamically against the centralized enterprise RBAC table.</p>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
            <label style="flex:1;min-width:140px;font-size:11px">
              <span class="muted">Role:</span>
              <select data-change="sim-set-role" style="height:var(--tap);width:100%">
                <option value="rep" ${selRole === 'rep' ? 'selected' : ''}>Field Rep</option>
                <option value="manager" ${selRole === 'manager' ? 'selected' : ''}>Sales Manager</option>
                <option value="kam" ${selRole === 'kam' ? 'selected' : ''}>Key Account Lead</option>
                <option value="ops" ${selRole === 'ops' ? 'selected' : ''}>Market Operations</option>
                <option value="exec" ${selRole === 'exec' ? 'selected' : ''}>Executive</option>
              </select>
            </label>

            <label style="flex:1;min-width:140px;font-size:11px">
              <span class="muted">Target Action:</span>
              <select data-change="sim-set-action" style="height:var(--tap);width:100%">
                <option value="approve_brief" ${selAction === 'approve_brief' ? 'selected' : ''}>Approve visit brief</option>
                <option value="override_brief" ${selAction === 'override_brief' ? 'selected' : ''}>Override recommendation</option>
                <option value="retire_rule" ${selAction === 'retire_rule' ? 'selected' : ''}>Retire policy rule</option>
                <option value="execute_raw_write" ${selAction === 'execute_raw_write' ? 'selected' : ''}>Execute raw database write</option>
                <option value="override_release_gate" ${selAction === 'override_release_gate' ? 'selected' : ''}>Override release gate</option>
              </select>
            </label>
          </div>

          <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid ${allowedInMatrix ? 'var(--good)' : 'var(--bad)'}">
            <b style="font-size:12px">${allowedInMatrix ? 'Access Granted' : 'Access Prohibited'}</b>
            <p class="small muted" style="margin:2px 0 0 0">
              ${allowedInMatrix
                ? `Role "${selRole}" holds explicit entitlement for "${selAction}" in governance schema.`
                : `Role "${selRole}" is restricted from "${selAction}". Requires elevation or different role.`}
            </p>
          </div>
        </section>
      ` : tab === 'gp' ? `
        <!-- L-GP Gap Backlog & Terms -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Field Gap Backlog &amp; Managed Terms</h3>
            ${pill('Frontline Signals', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Tickets generated by rep recommendation flags with claim workflows and canonical terminology management.</p>

          <div class="card tight" style="margin:0 0 10px 0;background:var(--surface-subtle)">
            <b style="font-size:12px">Active Gap Ticket: GAP-042</b>
            <div class="small muted" style="margin:2px 0 6px 0">Reason: Stale inventory scan on secondary category line.</div>
            <button class="btn secondary sm" data-act="claim-lab-gap" style="min-height:var(--tap);font-size:11px">
              ${icon('check', 14)} Claim ticket for category ops
            </button>
            ${app.ui?.labGapClaimed ? '<span class="small good-text" style="margin-left:8px">Claimed by Category Ops</span>' : ''}
          </div>
        </section>
      ` : tab === 'cd' ? `
        <!-- L-CD Interactive Card Demo -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Interactive Card Sandbox</h3>
            ${pill('All 7 States', 'info')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Directly triggers any of the 7 deterministic card looks.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn secondary sm" data-act="run-try-case" data-case="conflict" style="min-height:var(--tap);font-size:11px">Conflict Card</button>
            <button class="btn secondary sm" data-act="run-try-case" data-case="stale" style="min-height:var(--tap);font-size:11px">Stale Card</button>
            <button class="btn secondary sm" data-act="run-try-case" data-case="clarify" style="min-height:var(--tap);font-size:11px">Clarify Card</button>
            <button class="btn secondary sm" data-act="run-try-case" data-case="evidence" style="min-height:var(--tap);font-size:11px">Evidence Card</button>
            <button class="btn secondary sm" data-act="run-try-case" data-case="exactWording" style="min-height:var(--tap);font-size:11px">Exact Wording</button>
          </div>
        </section>
      ` : tab === 'tr' ? `
        <!-- L-TR Trace Inspector -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Suggestion Trace Inspector</h3>
            ${pill('Auditable Pipeline', 'good')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Rules decide deterministically; models only synthesize messy free-text notes and explain rationale.</p>
          <div style="padding:10px;background:var(--surface-subtle);border-radius:4px;font-family:monospace;font-size:11px;line-height:1.5">
            <div>[00.0ms] Context: Territory North · Channel Retail · Account Tier A</div>
            <div>[14.2ms] Rule Engine: R-2026-042 (Replenishment Buffer) applied</div>
            <div>[21.8ms] Boundary Check: Pricing desk limits respected</div>
            <div>[34.1ms] Output: Card rendered with deterministic Suggest outcome</div>
          </div>
        </section>
      ` : tab === 'dec' ? `
        <!-- L-DEC Decision Log & Model Gateway -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Three-Tier Model Gateway Architecture</h3>
            ${pill('Cost & Speed Optimised', 'good')}
          </div>
          <p class="small muted" style="margin-bottom:12px">Requests route through the cheapest capable tier to eliminate unnecessary LLM expenditure.</p>

          <div style="display:flex;flex-direction:column;gap:8px">
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--good)">
              <b>Tier 1: Deterministic Rules ($0.00 / token, &lt;5ms)</b>
              <div class="small muted">Evaluates ranking, limits, scopes, and outcomes without AI inference.</div>
            </div>
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
              <b>Tier 2: Lightweight Model ($0.0001 / 1k tokens, ~80ms)</b>
              <div class="small muted">Extracts entities from free-form field notes and formats summary sentences.</div>
            </div>
            <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--warn, #f59e0b)">
              <b>Tier 3: Frontier Model ($0.003 / 1k tokens, ~350ms, Strict Budget Cap)</b>
              <div class="small muted">Synthesizes complex multi-visit quarterly reviews for executive dossiers.</div>
            </div>
          </div>
        </section>
      ` : tab === 'us' ? `
        <!-- L-US Session Usage Telemetry -->
        <section class="card" style="margin:0">
          <div class="section-head" style="margin-bottom:8px">
            <h3>Session Click &amp; Screen Telemetry</h3>
            ${pill('Telemetry Ledger', 'info')}
          </div>
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-bottom:12px">
            <div><small>Interaction clicks</small><b>${clicks} clicks</b></div>
            <div><small>Screen transitions</small><b>${views} views</b></div>
            <div><small>Active persona</small><b>${esc(ctx.persona)}</b></div>
            <div><small>Network status</small><b>${app.offline ? 'Offline' : 'Online'}</b></div>
          </div>
          <div style="display:flex;gap:6px;justify-content:flex-end">
            <button class="btn secondary sm" data-act="clear-lab-telemetry" style="min-height:var(--tap);font-size:11px">Clear telemetry</button>
            <button class="btn secondary sm" data-act="copy-lab-telemetry" style="min-height:var(--tap);font-size:11px">Copy metrics</button>
          </div>
        </section>
      ` : ''}

      <div style="display:flex;justify-content:flex-end;margin-top:8px">
        <button class="btn primary sm" data-act="close-lab-modal" style="min-height:var(--tap);min-width:90px">Close Lab</button>
      </div>
    </div>
  </section>`;
}

export const labActions = {
  'open-lab-modal': ({ app }) => {
    (app.ui ||= {}).labOpen = true;
  },
  'close-lab-modal': ({ app }) => {
    if (app.ui) app.ui.labOpen = false;
  },
  'set-lab-tab': ({ app, data }) => {
    (app.ui ||= {}).labTab = data.tab;
  },

  'set-ab-lift': ({ app, value, event }) => {
    const val = Number(value || event?.target?.value || 4.2);
    (app.ui ||= {}).abLift = val;
  },
  'set-ab-sample': ({ app, value, event }) => {
    const val = Number(value || event?.target?.value || 2500);
    (app.ui ||= {}).abSample = val;
  },
  'set-ab-noise': ({ app, value, event }) => {
    const val = Number(value || event?.target?.value || 1.5);
    (app.ui ||= {}).abNoise = val;
  },

  'set-roi-overlap': ({ app, value, event }) => {
    const val = Number(value || event?.target?.value || 20);
    (app.ui ||= {}).roiOverlap = val;
  },

  'sim-out-cond': ({ app, data, event }) => {
    const checked = event?.target?.checked;
    const cond = data.cond;
    app.ui ||= {};
    app.ui[`out${cond}`] = checked;
  },

  'sim-set-role': ({ app, value }) => {
    (app.ui ||= {}).simRole = value;
  },
  'sim-set-action': ({ app, value }) => {
    (app.ui ||= {}).simAction = value;
  },

  'claim-lab-gap': ({ app, ctx }) => {
    (app.ui ||= {}).labGapClaimed = true;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Category Operations Lead', 'Claimed gap ticket GAP-042 from Portfolio Lab');
    }
  },

  'approve-review-rule': ({ ctx }) => {
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Legal Counsel', 'Approved proposed policy rule: Seasonal Stock-Out Buffer v2.5');
    }
  },
  'reject-review-rule': ({ ctx }) => {
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Legal Counsel', 'Rejected proposed policy rule: Seasonal Stock-Out Buffer v2.5');
    }
  },

  'clear-lab-telemetry': ({ app }) => {
    (app.ui ||= {}).sessionClicks = 0;
    app.ui.sessionViews = 0;
  },
  'copy-lab-telemetry': ({ ctx }) => {
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Telemetry Service', 'Exported session telemetry logs to clipboard');
    }
  },
};
