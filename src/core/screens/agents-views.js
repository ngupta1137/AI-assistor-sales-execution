// Agents views: A1 Layers view, A2 One visit trace, A3 One gap end to end,
// A4 Tools and guardrails catalog, A5 Account 360 feature profile, A6 Account and visit memory.

import { esc, icon, pill } from '../ui.js';

// A1 Layers View
export function renderLayersView(ctx) {
  const { ui } = ctx;
  const inspected = ui?.inspectedLayer;

  const layers = [
    {
      id: 'exp',
      title: '1. Experiences Layer',
      subtitle: 'Role-tailored multi-device user surfaces',
      items: [
        { name: 'Rep Mobile', desc: 'Tactical field app with offline SQLite' },
        { name: 'Manager Portal', desc: 'Exception triage and coverage planning' },
        { name: 'Key Account Portal', desc: 'JBP contracts and volume tiers' },
        { name: 'Partner Portal', desc: 'Distributor EDI and inventory sync' },
        { name: 'Market Operations', desc: 'Rule authoring and health monitoring' },
        { name: 'Executive Dash', desc: 'Readiness and composite release gates' },
      ],
    },
    {
      id: 'orch',
      title: '2. Orchestration Layer (Visit Orchestrator)',
      subtitle: 'Deterministic execution lifecycle without black-box guessing',
      items: [
        { name: 'Step 1: Account Context', desc: 'Loads depot stock, territory, and trade terms' },
        { name: 'Step 2: Parallel Agents', desc: 'Calls 5 product agents concurrently' },
        { name: 'Step 3: Value Sorting', desc: 'Ranks actions by estimated value per minute' },
        { name: 'Step 4: Budget Knapsack', desc: 'Fits candidate actions into visit time window' },
        { name: 'Step 5: Card Render', desc: 'Formats deterministic outcome and status chips' },
        { name: 'Step 6: Rep Decision', desc: 'Human in the loop approves, adjusts, or overrides' },
        { name: 'Step 7: Audit Seal', desc: 'Writes immutable cryptographic receipt' },
      ],
    },
    {
      id: 'agents',
      title: '3. Product Agents Layer',
      subtitle: 'Autonomous specialized decision engines',
      items: [
        { name: 'Account Potential', desc: 'Scores revenue headroom (Tools: score_account, explain_potential)' },
        { name: 'Gap Detection', desc: 'Identifies missing distribution (Tools: detect_gaps, gap_status)' },
        { name: 'Action Ranking', desc: 'Sorts visit priorities (Tools: rank_actions, explain_action)' },
        { name: 'Visit Planning', desc: 'Optimizes cycle routes (Tools: plan_cycle, replan_day, visit_budget)' },
        { name: 'Order Suggestion', desc: 'Calculates replenish quantities (Tools: suggest_order, unit_targets)' },
      ],
    },
    {
      id: 'interfaces',
      title: '4. Interfaces Layer',
      subtitle: 'Standardized integration bus and tool contracts',
      items: [
        { name: 'Tools Catalog', desc: 'Strict read/write permissions and capability scopes' },
        { name: 'Enterprise Event Bus', desc: 'Async transactional event telemetry and webhooks' },
      ],
    },
    {
      id: 'foundations',
      title: '5. Shared Foundations Layer',
      subtitle: 'Enterprise governance, security, and data infrastructure',
      items: [
        { name: 'Schema & Contracts', desc: 'Enforces type safety across 20 industries and 11 countries' },
        { name: 'Memory Repository', desc: 'Account timeline with retention rules and forget actions' },
        { name: 'Audit & Telemetry', desc: 'Append-only ledger of proposals, decisions, and denials' },
        { name: 'Policy Registry', desc: 'Versioned commercial rules with named legal approvers' },
        { name: 'Model Gateway', desc: 'Tiered LLM routing for unstructured note synthesis' },
      ],
    },
  ];

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>Five-Layer Architecture</h2>
      ${pill('Reference Architecture', 'info')}
    </div>
    <p class="small muted" style="margin-bottom:14px">Deterministic pipeline separating experience surfaces, orchestration, product agents, interfaces, and shared foundations. Tap any box to inspect contract details and owners.</p>

    <div style="display:flex;flex-direction:column;gap:12px">
      ${layers.map((l) => `
        <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
          <div style="margin-bottom:6px">
            <b style="font-size:13px;color:var(--ink)">${esc(l.title)}</b>
            <div class="small muted">${esc(l.subtitle)}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:6px">
            ${l.items.map((it) => `
              <button class="card tight" data-act="inspect-layer-box" data-name="${esc(it.name)}" data-desc="${esc(it.desc)}" data-layer="${esc(l.title)}" style="margin:0;cursor:pointer;text-align:left;background:var(--surface);border:1px solid var(--line-soft);min-height:var(--tap)">
                <b style="font-size:11px;color:var(--ink);display:block">${esc(it.name)}</b>
                <span class="small muted" style="font-size:10px;line-height:1.2;display:block;margin-top:2px">${esc(it.desc)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    ${inspected ? `
      <div class="presenter-backdrop" data-act="close-layer-box" aria-hidden="true"></div>
      <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="layer-box-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
        <header class="as-head">
          <div>
            <h2 id="layer-box-title" style="display:flex;align-items:center;gap:6px">
              ${icon('shield', 18)} ${esc(inspected.name)}
            </h2>
            <small>${esc(inspected.layer)}</small>
          </div>
          <button class="icon-btn" data-act="close-layer-box" aria-label="Close">${icon('x', 20)}</button>
        </header>
        <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
          <p class="small">${esc(inspected.desc)}</p>
          <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">
            <div><small>Owning team</small><b>Architecture &amp; Ops</b></div>
            <div><small>SLA status</small><b class="good-text">99.98% Healthy</b></div>
            <div><small>Governance contract</small><b>CTR-2026-v4</b></div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:8px">
            <button class="btn primary sm" data-act="close-layer-box" style="min-height:var(--tap);min-width:90px">Done</button>
          </div>
        </div>
      </section>
    ` : ''}
  </section>`;
}

// A2 One Visit Trace
export function renderVisitTrace(ctx) {
  const { data, ui, t } = ctx;
  const a = data.planned[0];
  const allActs = a ? a.actions : [];
  const timeBudget = ui?.traceTimeBudget || 45;

  // Value per minute knapsack calculation
  const sorted = [...allActs].sort((x, y) => ((y.value || 100) / (y.effort || 15)) - ((x.value || 100) / (x.effort || 15)));
  let usedTime = 0;
  const fitting = [];
  const deferred = [];
  for (const act of sorted) {
    const eff = act.effort || 15;
    if (usedTime + eff <= timeBudget) {
      usedTime += eff;
      fitting.push(act);
    } else {
      deferred.push(act);
    }
  }

  const toolCalls = [
    { tool: 'score_account', agent: 'Account Potential', latency: 142, tokens: 310, cost: '$0.0004 sample', status: '200 OK', res: 'Account tier A (Headroom: High)' },
    { tool: 'detect_gaps', agent: 'Gap Detection', latency: 210, tokens: 480, cost: '$0.0007 sample', status: '200 OK', res: 'Identified 2 core product voids' },
    { tool: 'rank_actions', agent: 'Action Ranking', latency: 185, tokens: 390, cost: '$0.0005 sample', status: '200 OK', res: 'Sorted by value per minute' },
    { tool: 'visit_budget', agent: 'Visit Planning', latency: 64, tokens: 180, cost: '$0.0002 sample', status: '200 OK', res: `Fitted ${fitting.length} of ${allActs.length} actions in ${timeBudget}m` },
    { tool: 'suggest_order', agent: 'Order Suggestion', latency: 230, tokens: 540, cost: '$0.0008 sample', status: '200 OK', res: 'Drafted 4 replenishment lines' },
    { tool: 'audit_log', agent: 'Shared Foundations', latency: 45, tokens: 120, cost: '$0.0001 sample', status: '200 OK', res: 'Immutable hash recorded: EVT-TR-9042' },
  ];

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>One Visit Trace End to End</h2>
      ${pill('Deterministic Trace', 'good')}
    </div>
    <p class="small muted" style="margin-bottom:12px">Step-by-step trace of how the Visit Orchestrator synthesizes data, calls product agents, and fits the visit budget.</p>

    <!-- Time Budget Slider -->
    <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-weight:600;font-size:12px">Visit Time Budget Window:</span>
        <b style="font-size:14px;color:var(--accent)">${timeBudget} minutes</b>
      </div>
      <input type="range" min="15" max="90" step="5" value="${timeBudget}" data-change="set-trace-time" data-input="set-trace-time" style="width:100%;height:var(--tap);cursor:pointer">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px">
        <span>15 min (Brief drop-in)</span>
        <span>45 min (Standard)</span>
        <span>90 min (Comprehensive review)</span>
      </div>
      <div style="margin-top:8px;font-size:11px">
        <b>Budget allocation:</b> ${fitting.length} actions fit (${usedTime} min allocated), ${deferred.length} actions deferred for follow-up.
      </div>
    </div>

    <!-- Actions Budget Fit -->
    <div style="margin-bottom:14px">
      <small class="muted" style="font-weight:600">Selected actions for ${esc(a?.accountName || 'target account')}:</small>
      <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px">
        ${fitting.map((act) => `
          <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;display:flex;justify-content:space-between;align-items:center;font-size:11px">
            <span>${esc(t(act.title, act.vars))}</span>
            <span class="good-text"><b>${act.effort || 15}m</b> (Fits budget)</span>
          </div>
        `).join('')}
        ${deferred.map((act) => `
          <div style="padding:6px 8px;background:var(--surface);border:1px dashed var(--line);border-radius:4px;display:flex;justify-content:space-between;align-items:center;font-size:11px;opacity:0.65">
            <span class="muted">${esc(t(act.title, act.vars))}</span>
            <span class="warn-text">${act.effort || 15}m (Deferred)</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 6 Tool Calls -->
    <h3 style="font-size:13px;margin-bottom:8px">Orchestrator Tool Execution Calls (6)</h3>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${toolCalls.map((tc, idx) => `
        <div class="card tight" style="margin:0;font-size:11px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
            <b>${idx + 1}. tool: <code style="color:var(--accent)">${tc.tool}</code></b>
            <span class="good-text">${tc.status} (${tc.latency}ms)</span>
          </div>
          <div class="muted">${tc.agent} · ${tc.tokens} tokens · ${tc.cost}</div>
          <div style="margin-top:4px;color:var(--ink)"><b>Response:</b> ${esc(tc.res)}</div>
        </div>
      `).join('')}
    </div>

    <!-- Audit entry and Export -->
    <div class="card tight" style="margin:0;background:var(--surface-subtle);border:1px dashed var(--line)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <b style="font-size:11px">Audit Trail Record:</b>
          <div class="small muted" style="font-family:monospace;margin-top:2px">EVT-TR-9042 · SHA256: 7f83b165... · Seed: 4092</div>
        </div>
        <button class="btn secondary sm" data-act="export-trace-json" style="min-height:var(--tap);font-size:11px">
          ${icon('screen', 14)} Export trace (JSON)
        </button>
      </div>
      ${ui?.traceCopied ? '<div class="small good-text" style="margin-top:6px">Trace JSON copied to clipboard.</div>' : ''}
    </div>
  </section>`;
}

// A3 One Gap End to End
export function renderGapLifecycle(ctx) {
  const { ui } = ctx;
  const isUnlocked = !!ui?.gapStep5Unlocked;

  const steps = [
    { num: 1, title: 'Detected', desc: 'Gap Detection agent flags category distribution void from distributor EDI scan.', state: 'done' },
    { num: 2, title: 'Formatted', desc: 'Converted into a proposed commercial action with evidence requirement and rationale.', state: 'done' },
    { num: 3, title: 'Routed', desc: 'Passed to Visit Orchestrator and placed in prioritized morning brief.', state: 'done' },
    { num: 4, title: 'Executed', desc: 'Field rep conducts visit, presents proposition, and records verified proof note.', state: 'done' },
    {
      num: 5,
      title: 'Regulated Hold',
      desc: isUnlocked
        ? 'Manager approved credit and pricing review. Order hold released.'
        : 'Suggested order stops for regulated credit and pricing desk review before commit.',
      state: isUnlocked ? 'done' : 'active',
      hasUnlock: !isUnlocked,
    },
    {
      num: 6,
      title: 'Closed & Reconciled',
      desc: isUnlocked
        ? 'Distributor ships invoice, ERP reconciles delivery, gap closed in backlog, and priors updated.'
        : 'Awaiting clearance from regulated hold gate.',
      state: isUnlocked ? 'done' : 'pending',
    },
  ];

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>One Gap End to End (Lifecycle Stepper)</h2>
      ${pill('Discovery to Cash', 'info')}
    </div>
    <p class="small muted" style="margin-bottom:14px">Tracks a single void from autonomous signal detection through field execution, regulated review, and commercial settlement.</p>

    <div class="stepper" style="display:flex;flex-direction:column;gap:10px">
      ${steps.map((st) => `
        <div class="card tight" style="margin:0;border-left:4px solid ${st.state === 'done' ? 'var(--good)' : st.state === 'active' ? 'var(--warn, #f59e0b)' : 'var(--line-soft)'};background:var(--surface)">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <b style="font-size:12px;color:var(--ink)">Step ${st.num}: ${esc(st.title)}</b>
            ${st.state === 'done' ? pill('Completed', 'good') : st.state === 'active' ? pill('Action Required', 'warn') : pill('Pending', 'muted')}
          </div>
          <p class="small muted" style="margin:4px 0 0 0;line-height:1.4">${esc(st.desc)}</p>
          ${st.hasUnlock ? `
            <div style="margin-top:8px">
              <button class="btn good sm" data-act="unlock-gap-step5" style="min-height:var(--tap);font-size:11px">
                ${icon('check', 14)} Approve and unlock regulated hold
              </button>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  </section>`;
}

// A4 Tools and Guardrails Catalog
export function renderToolsCatalog(ctx) {
  const { ui } = ctx;
  const rawDenied = !!ui?.rawWriteBlocked;

  const tools = [
    { name: 'score_account', agent: 'Account Potential', desc: 'Calculates headroom score and account tier', type: 'Read', perm: 'rep, manager, ops', guard: 'Read-only context access' },
    { name: 'detect_gaps', agent: 'Gap Detection', desc: 'Identifies missing distribution lines', type: 'Read', perm: 'rep, manager, ops', guard: 'Depot inventory read-only' },
    { name: 'rank_actions', agent: 'Action Ranking', desc: 'Ranks actions by value per minute', type: 'Read', perm: 'rep, manager, ops', guard: 'Deterministic scoring' },
    { name: 'plan_cycle', agent: 'Visit Planning', desc: 'Generates daily sequence and itinerary', type: 'Write', perm: 'manager, ops', guard: 'Working hours constraint' },
    { name: 'suggest_order', agent: 'Order Suggestion', desc: 'Drafts replenishment proposal quantities', type: 'Write', perm: 'rep, kam', guard: 'Credit limits, exact pricing' },
    { name: 'retire_rule', agent: 'Operations', desc: 'Marks obsolete governance rules retired', type: 'Write', perm: 'ops, manager', guard: 'Mandatory named approver and reason' },
  ];

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>Tools and Guardrails Catalog</h2>
      ${pill('Zero Raw Writes', 'good')}
    </div>
    <p class="small muted" style="margin-bottom:12px">Registry of all tool capabilities exposed to autonomous agents with read/write boundary enforcement and security permissions.</p>

    <!-- Table of tools -->
    <div style="overflow-x:auto;margin-bottom:14px">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="border-bottom:2px solid var(--line);text-align:left">
            <th style="padding:6px 4px">Tool Name</th>
            <th style="padding:6px 4px">Product Agent</th>
            <th style="padding:6px 4px">I/O</th>
            <th style="padding:6px 4px">Permissions</th>
            <th style="padding:6px 4px">Active Guardrail</th>
          </tr>
        </thead>
        <tbody>
          ${tools.map((t) => `
            <tr style="border-bottom:1px solid var(--line-soft)">
              <td style="padding:6px 4px"><code style="color:var(--accent);font-weight:600">${esc(t.name)}</code></td>
              <td style="padding:6px 4px">${esc(t.agent)}</td>
              <td style="padding:6px 4px"><span class="pill sm ${t.type === 'Write' ? 'warn' : 'info'}">${esc(t.type)}</span></td>
              <td style="padding:6px 4px">${esc(t.perm)}</td>
              <td style="padding:6px 4px">${esc(t.guard)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Interactive Guardrail Security Test -->
    <div class="card tight" style="margin:0;background:var(--surface-subtle);border-left:4px solid var(--accent)">
      <b style="font-size:12px">Interactive Security Boundary Test</b>
      <p class="small muted" style="margin:2px 0 8px 0">Simulate an agent attempting an unsanctioned direct database write bypassing the policy gateway.</p>
      <button class="btn danger sm" data-act="test-raw-write" style="min-height:var(--tap);font-size:11px">
        ${icon('shield', 14)} Test guardrail: Agent tries raw system write
      </button>

      ${rawDenied ? `
        <div class="notice bad" style="margin-top:10px">
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              ${pill('Access Denied: Violation Blocked', 'bad')}
              <small class="muted">Security Rule: SEC-001</small>
            </div>
            <p style="font-size:12px;margin:0;line-height:1.4"><b>Blocked:</b> Raw database writes are strictly forbidden. State changes must go through the schema validator and policy registry, and every attempt is logged.</p>
            <div class="small muted" style="margin-top:4px">${icon('shield', 12)} Denial logged to immutable audit trail (EVT-DENY-8841).</div>
          </div>
        </div>
      ` : ''}
    </div>
  </section>`;
}

// A5 Account 360 Feature Profile
export function renderFeatureProfile(ctx) {
  const { data, ui } = ctx;
  const acc = data.planned[0] ? data.byId[data.planned[0].accountId] : data.accounts[0];
  const threshold = ui?.featureStaleThreshold || 14;

  const features = [
    { name: '30d_depot_sell_through', agent: 'Gap Detection', source: 'Depot EDI', age: 6 },
    { name: 'contract_compliance_rate', agent: 'Action Ranking', source: 'CRM Audit', age: 12 },
    { name: 'last_order_replenishment_qty', agent: 'Order Suggestion', source: 'ERP Orders', age: 18 },
    { name: 'visit_velocity_adherence', agent: 'Visit Planning', source: 'Mobile Telemetry', age: 4 },
    { name: 'potential_tier_score', agent: 'Account Potential', source: 'Data Cloud', age: 25 },
  ];

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>Account 360 Feature Profile</h2>
      ${pill(acc ? esc(acc.name) : 'Target Account', 'info')}
    </div>
    <p class="small muted" style="margin-bottom:12px">Features consumed by autonomous agents for this {account}. Adjust the freshness threshold slider to detect stale inputs.</p>

    <!-- Stale threshold slider -->
    <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-weight:600;font-size:12px">Stale Data Threshold:</span>
        <b style="font-size:13px;color:var(--accent)">${threshold} days</b>
      </div>
      <input type="range" min="1" max="30" step="1" value="${threshold}" data-change="set-stale-threshold" data-input="set-stale-threshold" style="width:100%;height:var(--tap);cursor:pointer">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px">
        <span>1 day (Strict)</span>
        <span>14 days (Standard)</span>
        <span>30 days (Relaxed)</span>
      </div>
    </div>

    <!-- Feature Table -->
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="border-bottom:2px solid var(--line);text-align:left">
            <th style="padding:6px 4px">Feature Name</th>
            <th style="padding:6px 4px">Producing Agent</th>
            <th style="padding:6px 4px">Source System</th>
            <th style="padding:6px 4px">Data Age</th>
            <th style="padding:6px 4px">Status &amp; Action</th>
          </tr>
        </thead>
        <tbody>
          ${features.map((f) => {
            const isStale = f.age > threshold;
            return `
            <tr style="border-bottom:1px solid var(--line-soft);background:${isStale ? 'var(--warn-bg, #fffbeb)' : 'transparent'}">
              <td style="padding:6px 4px"><b>${esc(f.name)}</b></td>
              <td style="padding:6px 4px">${esc(f.agent)}</td>
              <td style="padding:6px 4px">${esc(f.source)}</td>
              <td style="padding:6px 4px"><span style="color:${isStale ? 'var(--warn, #b45309)' : 'var(--ink)'};font-weight:${isStale ? '700' : '500'}">${f.age} days</span></td>
              <td style="padding:6px 4px">
                ${isStale ? `
                  <button class="btn secondary sm" data-act="refresh-feature" data-name="${esc(f.name)}" style="min-height:var(--tap);padding:0 8px;font-size:10px">
                    ${icon('sync', 12)} Refresh from source
                  </button>
                ` : pill('Fresh', 'good')}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    ${ui?.featureRefreshed ? `<div class="notice good" style="margin-top:10px">${icon('check', 14)}<span>${esc(ui.featureRefreshed)}</span></div>` : ''}
  </section>`;
}

// A6 Account and Visit Memory
export function renderMemoryTimeline(ctx) {
  const { ui } = ctx;
  const expiryWindow = ui?.memExpiryWindow || 90;

  const notes = (ui?.customMemNotes || [
    { id: 'm1', text: 'Contact prefers morning visits before 10 AM. Requested digital proposal copy.', tag: 'preference', age: 12, expiry: 78, doNotUse: false },
    { id: 'm2', text: 'Dock delivery requires 24h advance call to logistics manager.', tag: 'access rule', age: 28, expiry: 62, doNotUse: false },
    { id: 'm3', text: 'Competitor offering 5% promotional discount on secondary lines.', tag: 'competitor intel', age: 45, expiry: 45, doNotUse: false },
    { id: 'm4', text: 'Procurement lead promoted; new buyer onboarded this quarter.', tag: 'relationship', age: 65, expiry: 25, doNotUse: false },
  ]).filter((n) => !n.forgotten);

  return `
  <section class="card" style="margin-bottom:var(--s3)">
    <div class="section-head" style="margin-bottom:8px">
      <h2>Account and Visit Memory Timeline</h2>
      ${pill('Retention & Privacy', 'info')}
    </div>
    <p class="small muted" style="margin-bottom:12px">Chronological memory log synthesized across past visits. Reps can mark notes "Do not use" or execute compliance "Forget".</p>

    <!-- Expiry Slider -->
    <div class="card tight" style="margin:0 0 12px 0;background:var(--surface-subtle)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-weight:600;font-size:12px">Memory Expiry Retention Window:</span>
        <b style="font-size:13px;color:var(--accent)">${expiryWindow} days</b>
      </div>
      <input type="range" min="30" max="180" step="15" value="${expiryWindow}" data-change="set-mem-expiry" data-input="set-mem-expiry" style="width:100%;height:var(--tap);cursor:pointer">
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:2px">
        <span>30 days (Strict purge)</span>
        <span>90 days (Quarterly)</span>
        <span>180 days (Biannual)</span>
      </div>
    </div>

    <!-- Notes list -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      ${notes.map((n) => {
        const isExpired = n.age > expiryWindow;
        return `
        <div class="card tight" style="margin:0;opacity:${isExpired ? '0.5' : '1'};border-left:3px solid ${n.doNotUse ? 'var(--line)' : 'var(--accent)'};background:var(--surface)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="display:flex;align-items:center;gap:6px">
              ${pill(n.tag, 'info')}
              ${n.doNotUse ? pill('Do not use', 'muted') : ''}
              ${isExpired ? pill('Expired', 'warn') : ''}
            </span>
            <span class="small muted">${n.age} days ago (Expires in ${n.expiry}d)</span>
          </div>
          <p class="small" style="margin:0 0 6px 0;color:var(--ink)">${esc(n.text)}</p>
          <div style="display:flex;gap:6px;justify-content:flex-end">
            <button class="btn text sm" data-act="mem-toggle-use" data-id="${n.id}" style="min-height:var(--tap);font-size:11px">
              ${n.doNotUse ? 'Restore to prompts' : 'Mark Do not use'}
            </button>
            <button class="btn text sm danger" data-act="mem-forget" data-id="${n.id}" style="min-height:var(--tap);font-size:11px">
              ${icon('x', 12)} Forget
            </button>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Add a note form -->
    <div class="card tight" style="margin:0;background:var(--surface-subtle)">
      <b style="font-size:12px;display:block;margin-bottom:6px">Add a Note to Memory</b>
      <div style="display:flex;flex-direction:column;gap:8px">
        <textarea id="mem-note-input" rows="2" placeholder="Record fresh field context (e.g. access preference, buyer shift)..." style="width:100%;padding:8px;font-size:12px;border:1px solid var(--line);border-radius:4px"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between">
          <label style="font-size:11px;display:flex;align-items:center;gap:4px">
            <span>Tag:</span>
            <select id="mem-note-tag" style="height:var(--tap);font-size:11px">
              <option value="preference">Preference</option>
              <option value="access rule">Access Rule</option>
              <option value="competitor intel">Competitor Intel</option>
              <option value="relationship">Relationship</option>
            </select>
          </label>
          <button class="btn primary sm" data-act="mem-add-note" style="min-height:var(--tap);font-size:11px">
            Add to memory
          </button>
        </div>
        <div class="small muted" style="font-size:10px">
          <b>Next visit brief preview:</b> Fresh note will synthesize into the pre-visit briefing agent prompt.
        </div>
      </div>
    </div>
  </section>`;
}

export const agentViewActions = {
  'inspect-layer-box': ({ ctx, data }) => {
    (ctx.ui ||= {}).inspectedLayer = { name: data.name, desc: data.desc, layer: data.layer };
  },
  'close-layer-box': ({ ctx }) => {
    if (ctx.ui) ctx.ui.inspectedLayer = null;
  },

  'set-trace-time': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 45);
    (ctx.ui ||= {}).traceTimeBudget = val;
  },

  'export-trace-json': ({ ctx }) => {
    (ctx.ui ||= {}).traceCopied = true;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Visit Orchestrator', 'Exported cryptographic visit brief trace (JSON)');
    }
  },

  'unlock-gap-step5': ({ ctx }) => {
    (ctx.ui ||= {}).gapStep5Unlocked = true;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Sales Manager', 'Approved regulated hold unlock on Gap GAP-001 (Credit & Pricing reviewed)');
    }
  },

  'test-raw-write': ({ ctx }) => {
    (ctx.ui ||= {}).rawWriteBlocked = true;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Security Access Guard', 'BLOCKED attempt: Agent requested direct database write without policy authorization (SEC-001)');
    }
  },

  'set-stale-threshold': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 14);
    (ctx.ui ||= {}).featureStaleThreshold = val;
  },

  'refresh-feature': ({ ctx, data }) => {
    (ctx.ui ||= {}).featureRefreshed = `Refreshed feature "${data.name}" from upstream source.`;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Field Rep', `Refreshed feature "${data.name}" from source depot`);
    }
  },

  'set-mem-expiry': ({ ctx, value, event }) => {
    const val = Number(value || event?.target?.value || 90);
    (ctx.ui ||= {}).memExpiryWindow = val;
  },

  'mem-toggle-use': ({ ctx, data }) => {
    const notes = ctx.ui?.customMemNotes || [
      { id: 'm1', text: 'Contact prefers morning visits before 10 AM. Requested digital proposal copy.', tag: 'preference', age: 12, expiry: 78, doNotUse: false },
      { id: 'm2', text: 'Dock delivery requires 24h advance call to logistics manager.', tag: 'access rule', age: 28, expiry: 62, doNotUse: false },
      { id: 'm3', text: 'Competitor offering 5% promotional discount on secondary lines.', tag: 'competitor intel', age: 45, expiry: 45, doNotUse: false },
      { id: 'm4', text: 'Procurement lead promoted; new buyer onboarded this quarter.', tag: 'relationship', age: 65, expiry: 25, doNotUse: false },
    ];
    const n = notes.find((x) => x.id === data.id);
    if (n) {
      n.doNotUse = !n.doNotUse;
      (ctx.ui ||= {}).customMemNotes = notes;
      if (ctx.m?.logAudit) {
        ctx.m.logAudit('Field Rep', `Decision: marked note "${n.text.slice(0, 30)}..." as ${n.doNotUse ? 'Do not use' : 'Active'}`);
      }
    }
  },

  'mem-forget': ({ ctx, data }) => {
    const notes = ctx.ui?.customMemNotes || [
      { id: 'm1', text: 'Contact prefers morning visits before 10 AM. Requested digital proposal copy.', tag: 'preference', age: 12, expiry: 78, doNotUse: false },
      { id: 'm2', text: 'Dock delivery requires 24h advance call to logistics manager.', tag: 'access rule', age: 28, expiry: 62, doNotUse: false },
      { id: 'm3', text: 'Competitor offering 5% promotional discount on secondary lines.', tag: 'competitor intel', age: 45, expiry: 45, doNotUse: false },
      { id: 'm4', text: 'Procurement lead promoted; new buyer onboarded this quarter.', tag: 'relationship', age: 65, expiry: 25, doNotUse: false },
    ];
    const n = notes.find((x) => x.id === data.id);
    if (n) {
      n.forgotten = true;
      (ctx.ui ||= {}).customMemNotes = notes;
      if (ctx.m?.logAudit) {
        ctx.m.logAudit('Field Rep', `Forget: removed memory item "${n.text.slice(0, 30)}..." for compliance`);
      }
    }
  },

  'mem-add-note': ({ ctx }) => {
    const input = document.getElementById('mem-note-input');
    const tagSel = document.getElementById('mem-note-tag');
    const val = input ? input.value.trim() : '';
    if (!val) return;
    const tag = tagSel ? tagSel.value : 'preference';

    const notes = ctx.ui?.customMemNotes || [
      { id: 'm1', text: 'Contact prefers morning visits before 10 AM. Requested digital proposal copy.', tag: 'preference', age: 12, expiry: 78, doNotUse: false },
      { id: 'm2', text: 'Dock delivery requires 24h advance call to logistics manager.', tag: 'access rule', age: 28, expiry: 62, doNotUse: false },
      { id: 'm3', text: 'Competitor offering 5% promotional discount on secondary lines.', tag: 'competitor intel', age: 45, expiry: 45, doNotUse: false },
      { id: 'm4', text: 'Procurement lead promoted; new buyer onboarded this quarter.', tag: 'relationship', age: 65, expiry: 25, doNotUse: false },
    ];

    notes.unshift({
      id: `m_${Date.now()}`,
      text: val,
      tag,
      age: 0,
      expiry: 90,
      doNotUse: false,
    });

    (ctx.ui ||= {}).customMemNotes = notes;
    if (ctx.m?.logAudit) {
      ctx.m.logAudit('Field Rep', `Added note to memory (${tag}): "${val.slice(0, 30)}..."`);
    }
  },
};
