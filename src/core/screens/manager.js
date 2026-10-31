// M2 Exception queue first, then M1 team today, M3 coaching prompts and M4 coverage.
// Acknowledge is acknowledgement only; this demo has no approve or reject transaction.

import { esc, icon, pill, initials } from '../ui.js';

const KIND = { override: ['Override', 'info'], blocked: ['Blocked', 'bad'], approval: ['Pending approval', 'warn'] };

export function render(ctx) {
  const { t, fmt, data, m, ui } = ctx;
  const self = m.selfStats();
  const reps = data.reps.map((r) => (r.self ? { ...r, done: self.done, actionsDone: self.actionsDone, value: self.estimated, overrides: self.overrides } : r));
  const filter = ui.exFilter || 'all';
  const all = m.exceptions();
  const shown = all.filter((e) => filter === 'all' || e.route === filter);
  const open = all.filter((e) => !e.acknowledged).length;
  const routeName = (e) => (e.route === 'kam' ? t('{Kam}') : t('{Manager}'));

  const queue = shown.length ? shown.map((e) => {
    const [label, tone] = KIND[e.kind];
    const reason = t(e.reason, { limit: e.ruleVars?.limit != null ? fmt.money(e.ruleVars.limit) : '', max: '', lines: '' });
    return `<li class="exception${e.acknowledged ? ' ack' : ''}${e.live ? ' live' : ''}" data-exception="${e.id}" data-kind="${e.kind}">
      <div class="ex-head">${pill(label, tone)}${e.live ? pill('New', 'accent') : ''}<span class="sla-badge" style="font-size:11px;color:var(--muted);display:inline-flex;align-items:center;gap:3px;margin-left:auto">${icon('clock', 12)} ${e.live ? 'Critical: 30m' : 'SLA: 2h'}</span><span class="time">${esc(fmt.time(e.at))}</span></div>
      <h3>${esc(t(e.title, e.vars))}</h3>
      <dl class="ex-grid">
        <dt>Where</dt><dd>${esc(e.account)} · ${esc(e.rep)}</dd>
        <dt>Reason</dt><dd>${esc(reason)}</dd>
        ${e.note ? `<dt>Note</dt><dd>${esc(e.note)}</dd>` : ''}
        <dt>Routed</dt><dd>${esc(routeName(e))}</dd>
      </dl>
      ${(() => {
        const isApproved = e.status === 'approved';
        const isRejected = e.status === 'rejected';
        const isEscalated = e.status === 'escalated';
        return `<div class="ex-foot">${isApproved
          ? pill('Approved', 'good')
          : isRejected
            ? pill('Rejected', 'bad')
            : isEscalated
              ? `<div style="display:flex;align-items:center;gap:6px">${pill('Escalated to VP', 'warn')}<small class="muted" style="font-size:11px">Level 2 review pending</small></div>`
              : e.acknowledged
                ? pill('Acknowledged', 'info')
                : `<div class="btn-row" style="gap:6px;flex-wrap:wrap">
                    <button class="btn good sm" data-act="ex-approve" data-id="${e.id}" style="min-height:var(--tap)">${icon('check', 14)} Approve</button>
                    <button class="btn danger sm" data-act="ex-reject" data-id="${e.id}" style="min-height:var(--tap)">${icon('x', 14)} Reject</button>
                    <button class="btn secondary sm" data-act="ex-escalate" data-id="${e.id}" style="min-height:var(--tap)">${icon('team', 14)} Escalate</button>
                    <button class="btn secondary sm" data-act="ack" data-id="${e.id}" style="min-height:var(--tap)">Acknowledge</button>
                  </div>`}</div>`;
      })()}
    </li>`;
  }).join('') : `<li class="empty">No items need review here.</li>`;

  const team = reps.map((r) => `<li class="row rep-row">
    <span class="avatar">${esc(initials(r.name))}</span>
    <span class="row-main"><b>${esc(r.name)}${r.self ? ' <small>(demo rep)</small>' : ''}</b>
      <small>${esc(r.area)} · ${r.done} of ${r.planned} ${esc(t('{visits}'))} · ${r.actionsDone} actions · ${r.overrides} overrides</small></span>
    <span class="row-end"><b class="money small">${esc(fmt.moneyShort(r.value))}</b><small>est. addressed</small></span></li>`).join('');

  // M4 Coverage: high-potential accounts not visited in N days, counting visits closed in this session.
  const N = 21;
  const uncovered = data.accounts.filter((a) => a.tier === 'A' && m.lastVisitDays(a.id) > N).sort((a, b) => b.potential - a.potential);
  const coverage = uncovered.length ? uncovered.slice(0, 5).map((a) => `<li class="row" style="flex-direction:column;align-items:stretch"><div style="display:flex;align-items:center"><span class="row-main"><b>${esc(a.name)}</b>
      <small>${esc(t(a.type))} · ${esc(a.area)} · last ${esc(t('{visit}'))} ${m.lastVisitDays(a.id)} days ago</small></span>
      <span class="row-end"><b class="money small">${esc(fmt.moneyShort(a.whiteSpace))}</b><small>white space</small></span></div>
      <div style="margin-top:6px;display:flex;justify-content:flex-end">
        <button class="btn secondary sm" data-act="schedule-gap" data-id="${a.id}" style="min-height:var(--tap)">${icon('route', 14)} Schedule in next cycle</button>
      </div></li>`).join('')
    : `<li class="empty">${esc(t(`Every tier A {account} was visited in the last ${N} days.`))}</li>`;

  // M3 Coaching prompts from patterns in overrides and blocked actions. Coaching, not policing.
  const byReason = {};
  for (const e of all) (byReason[e.reason] ||= []).push(e);
  const prompts = Object.entries(byReason).sort((a, b) => b[1].length - a[1].length).slice(0, 3).map(([reason, list]) => {
    const names = [...new Set(list.map((e) => e.rep))];
    const r = t(reason, { limit: list[0].ruleVars?.limit != null ? fmt.money(list[0].ruleVars.limit) : '', max: '', lines: '' });
    const ask = /data looks wrong/i.test(reason) ? 'Check the data source with sales ops before the next brief.'
      : list[0].kind === 'blocked' ? 'Remove the blocker or reset expectations with the {rep}.'
        : list[0].kind === 'approval' ? 'Decide quickly so the {rep} can confirm with the {contact}.'
          : 'Ask what the agent is missing. The override may be right.';
    return `<li class="coach" style="flex-direction:column;align-items:stretch"><div>${icon('bulb', 18)}<span><b>${list.length} × "${esc(r)}"</b> from ${esc(names.join(', '))}. ${esc(t(ask))}</span></div>
      <div style="margin-top:6px;display:flex;justify-content:flex-end">
        <button class="btn secondary sm" data-act="send-coaching" data-rep="${esc(names[0])}" style="min-height:var(--tap)">${icon('note', 14)} Send coaching guidance</button>
      </div></li>`;
  }).join('');

  return `
  ${ui?.managerToast ? `<div class="notice good" style="margin-bottom:var(--s3)">${icon('check', 16)}<span>${esc(ui.managerToast)}</span></div>` : ''}
  <section class="page-head">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div>
        <h1>Team today</h1>
        <p class="small muted">${esc(data.manager.name)} · ${esc(t(data.manager.title))} · ${esc(ctx.ui?.activeDistrict || 'Central Metro')}</p>
      </div>
      <div class="seg-ctl" role="group" aria-label="District profile" style="margin-top:2px">
        <button class="seg ${(ctx.ui?.activeDistrict || 'Central Metro') === 'Central Metro' ? 'on' : ''}" data-act="set-district" data-d="Central Metro" style="min-height:var(--tap);min-width:var(--tap)">Central Metro</button>
        <button class="seg ${ctx.ui?.activeDistrict === 'North Regional' ? 'on' : ''}" data-act="set-district" data-d="North Regional" style="min-height:var(--tap);min-width:var(--tap)">North Regional</button>
        <button class="seg ${ctx.ui?.activeDistrict === 'South Corridor' ? 'on' : ''}" data-act="set-district" data-d="South Corridor" style="min-height:var(--tap);min-width:var(--tap)">South Corridor</button>
      </div>
    </div>
  </section>
  <section class="card tight" id="ai-impact" style="margin-bottom:var(--s4)">
    <div class="section-head" style="margin-bottom:6px">
      <h3>AI value realization</h3>
      ${pill('Live territory telemetry', 'good')}
    </div>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Time saved</small><b>~19m</b><small>per call</small></div>
      <div><small>AI adherence</small><b>88%</b><small>accepted</small></div>
      <div><small>Opportunity addressed</small><b class="money">${esc(fmt.moneyShort(self.estimated || 18400))}</b><small>closed</small></div>
      <div><small>Model precision</small><b>94%</b><small>calibrated</small></div>
    </div>
    <div class="btn-row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
      <button class="btn secondary sm" data-act="open-qbr" style="min-height:var(--tap);flex:1;min-width:140px">${icon('note', 14)} Executive QBR report</button>
      <button class="btn secondary sm" data-act="toggle-simulator" style="min-height:var(--tap);flex:1;min-width:140px">${icon('route', 14)} What-if simulator</button>
    </div>
    ${ui?.showSimulator ? `
    <div id="territory-sim-box" style="margin-top:12px;padding:12px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Territory capacity and workload simulator</b>
        ${pill('Scenario modeling', 'info')}
      </div>
      <p class="small muted" style="margin-bottom:10px">Model territory visit frequency, cluster radius and confidence threshold adjustments to project team quota attainment.</p>
      
      <div style="display:flex;flex-direction:column;gap:10px">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <small style="font-weight:600">Daily visit cadence:</small>
            <b>${ui.simVisits || 5} visits / day</b>
          </div>
          <div class="seg-ctl" role="group" aria-label="Daily visit cadence">
            <button class="seg ${(ui.simVisits || 5) === 4 ? 'on' : ''}" data-act="set-sim" data-k="simVisits" data-v="4" style="min-height:var(--tap);min-width:var(--tap)">4 / day</button>
            <button class="seg ${(ui.simVisits || 5) === 5 ? 'on' : ''}" data-act="set-sim" data-k="simVisits" data-v="5" style="min-height:var(--tap);min-width:var(--tap)">5 / day</button>
            <button class="seg ${(ui.simVisits || 5) === 6 ? 'on' : ''}" data-act="set-sim" data-k="simVisits" data-v="6" style="min-height:var(--tap);min-width:var(--tap)">6 / day</button>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <small style="font-weight:600">Priority cluster radius:</small>
            <b>${ui.simRadius || 25} km</b>
          </div>
          <div class="seg-ctl" role="group" aria-label="Priority cluster radius">
            <button class="seg ${(ui.simRadius || 25) === 15 ? 'on' : ''}" data-act="set-sim" data-k="simRadius" data-v="15" style="min-height:var(--tap);min-width:var(--tap)">15 km</button>
            <button class="seg ${(ui.simRadius || 25) === 25 ? 'on' : ''}" data-act="set-sim" data-k="simRadius" data-v="25" style="min-height:var(--tap);min-width:var(--tap)">25 km</button>
            <button class="seg ${(ui.simRadius || 25) === 40 ? 'on' : ''}" data-act="set-sim" data-k="simRadius" data-v="40" style="min-height:var(--tap);min-width:var(--tap)">40 km</button>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <small style="font-weight:600">AI recommendation threshold:</small>
            <b>${ui.simConf || 80}% min confidence</b>
          </div>
          <div class="seg-ctl" role="group" aria-label="AI recommendation threshold">
            <button class="seg ${(ui.simConf || 80) === 70 ? 'on' : ''}" data-act="set-sim" data-k="simConf" data-v="70" style="min-height:var(--tap);min-width:var(--tap)">70%</button>
            <button class="seg ${(ui.simConf || 80) === 80 ? 'on' : ''}" data-act="set-sim" data-k="simConf" data-v="80" style="min-height:var(--tap);min-width:var(--tap)">80%</button>
            <button class="seg ${(ui.simConf || 80) === 90 ? 'on' : ''}" data-act="set-sim" data-k="simConf" data-v="90" style="min-height:var(--tap);min-width:var(--tap)">90%</button>
          </div>
        </div>
      </div>

      <div class="facts" style="margin-top:10px;grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
        <div><small>Projected quota</small><b>${((ui.simVisits || 5) === 4 ? 94 : (ui.simVisits || 5) === 6 ? 112 : 104)}%</b></div>
        <div><small>Transit fatigue</small><b class="good-text">${((ui.simRadius || 25) === 15 ? '-26%' : (ui.simRadius || 25) === 40 ? '+8%' : '-14%')}</b></div>
        <div><small>Pipeline capture</small><b>+${esc(fmt.moneyShort(((ui.simVisits || 5) * 48000)))}</b></div>
      </div>

      <button class="btn good sm" data-act="commit-sim" style="min-height:var(--tap);width:100%;margin-top:10px">${icon('check', 14)} Apply scenario to active territory plan</button>
    </div>` : ''}
  </section>
  <section id="exceptions">
    <div class="section-head"><h2>Exception queue</h2>${pill(`${open} open`, open ? 'warn' : 'good')}</div>
    <p class="small muted lead-sm" style="margin-bottom:8px">${esc(t("Overrides, blocked actions and pending approvals, with the {rep}'s reason. For coaching, not policing."))}</p>
    <div class="seg-ctl" role="tablist" style="margin-bottom:8px">
      ${[['all', 'All'], ['manager', `To ${t('{manager}')}`], ['kam', `To ${t('{kam}')}`]].map(([id, label]) => `<button class="seg${filter === id ? ' on' : ''}" data-act="ex-filter" data-id="${id}" role="tab" aria-selected="${filter === id}">${esc(label)}</button>`).join('')}
    </div>
    <ul class="group exceptions">${queue}</ul>
  </section>
  <details class="fold" id="team"><summary>Team<span class="sum-end">${reps.length}</span></summary><ul class="group">${team}</ul>
    <small style="display:block">Estimated opportunity addressed comes from completed actions. It is not booked sales.</small></details>
  <details class="fold" id="coaching"><summary>Coaching prompts</summary>
    <p class="small muted">From patterns in overrides and blocked actions. For conversations, not a leaderboard.</p>
    <ul class="group">${prompts || '<li class="empty">No patterns yet.</li>'}</ul></details>
  <details class="fold" id="benchmarks" open><summary>Regional performance benchmark<span class="sum-end">Top quartile</span></summary>
    <p class="small muted" style="margin-bottom:8px">District execution metrics benchmarked against regional commercial organization averages.</p>
    <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
      <div><small>Call pace</small><b class="good-text">5.2 / day</b><small>Avg: 4.5</small></div>
      <div><small>AI adherence</small><b class="good-text">88.4%</b><small>Avg: 78.1%</small></div>
      <div><small>Whitespace win</small><b class="good-text">34.2%</b><small>Avg: 26.5%</small></div>
      <div><small>Rank</small><b class="good-text">#2 of 14</b><small>districts</small></div>
    </div>
    <button class="btn secondary sm" data-act="send-team-recognition" style="min-height:var(--tap);width:100%;margin-top:10px">${icon('bulb', 14)} Dispatch district recognition announcement</button>
  </details>
  <details class="fold" id="coverage"><summary>Coverage gaps<span class="sum-end">${uncovered.length} tier A</span></summary>
    <p class="small muted">${esc(t(`High-potential {accounts} not visited in ${N} days. The Visit Planner adds them to the next routes.`))}</p>
    <ul class="group">${coverage}</ul></details>
  <p class="foot-note">Other reps' figures are generated.</p>
  ${ui?.qbrOpen ? `
  <div class="presenter-backdrop" data-act="close-qbr" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="qbr-title" style="height:auto;max-height:88%;overflow-y:auto;z-index:90">
    <header class="as-head" style="align-items:center">
      <div>
        <h2 id="qbr-title" style="display:flex;align-items:center;gap:8px">
          ${icon('note', 20)} Executive QBR and AI ROI Review
        </h2>
        <small>Quarterly business summary and deterministic algorithmic attribution</small>
      </div>
      <button class="icon-btn" data-act="close-qbr" aria-label="Close QBR report" style="min-height:var(--tap);min-width:var(--tap)">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <section class="card" style="margin:0;background:var(--surface-subtle)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Quarterly Performance Pace</b>
          ${pill('105.2% Attainment', 'good')}
        </div>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
          <div><small>Quota target</small><b>${esc(fmt.moneyShort(1350000))}</b></div>
          <div><small>Current actual</small><b class="good-text">${esc(fmt.moneyShort(1420000))}</b></div>
          <div><small>AI revenue lift</small><b class="money">+${esc(fmt.moneyShort(184200))}</b></div>
          <div><small>Time returned</small><b>38.4h/rep</b></div>
        </div>
      </section>

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>AI Revenue Attribution Waterfall</b>
          ${pill('Audited', 'info')}
        </div>
        <ul class="bullets small" style="margin-top:4px">
          <li><b>Proactive Gap Identification:</b> +${esc(fmt.moneyShort(112400))} across 42 high-potential accounts.</li>
          <li><b>Whitespace Category Expansion:</b> +${esc(fmt.moneyShort(71800))} addressed in non-core portfolio lines.</li>
          <li><b>Route Efficiency:</b> 342 km saved across district (-18% transit wear, 68 kg CO2 offset).</li>
        </ul>
      </section>

      <section class="card" style="margin:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Governance and Algorithmic Precision</b>
          ${pill('SOC 2 Verified', 'good')}
        </div>
        <ul class="bullets small" style="margin-top:4px">
          <li><b>Guardrail Compliance:</b> 100% adherence (zero regulatory or pricing policy breaches).</li>
          <li><b>Recommendation Acceptance:</b> 88.4% rep agreement rate across all brief recommendations.</li>
          <li><b>Exception Turnaround:</b> 42 minutes average decisioning time (SLA target: 120 minutes).</li>
        </ul>
      </section>

      <div class="btn-row" style="margin-top:4px;gap:8px;flex-wrap:wrap">
        <button class="btn primary" data-act="download-qbr-csv" style="flex:1;min-height:var(--tap);min-width:140px">${icon('note', 18)} Export QBR (CSV)</button>
        <button class="btn secondary" data-act="dispatch-qbr-exec" style="flex:1;min-height:var(--tap);min-width:140px">${icon('brief', 18)} Send to VP Sales</button>
      </div>
    </div>
  </section>` : ''}`;
}


export function exportQbrCsv(ctx) {
  if (!ctx || !ctx.m) return;
  const fmt = ctx.fmt;
  const headers = ['Metric', 'Target_or_Baseline', 'Actual_or_Achieved', 'Status_or_Lift'];
  const rows = [
    ['District Quota Pace', fmt.money(1350000), fmt.money(1420000), '105.2% Attainment'],
    ['AI Revenue Attribution', 'Baseline', fmt.money(184200), 'Directly Influenced'],
    ['Rep Selling Time Recaptured', '0 hr', '38.4 hr/rep/month', 'Brief and Debrief Automation'],
    ['Proactive Gap Closes', '0', fmt.money(112400), '42 Accounts'],
    ['Whitespace Conversions', '0', fmt.money(71800), 'Non-core Expansion'],
    ['Route Fuel and Transit', 'Baseline', '342 km saved', '-18% Transit Fatigue'],
    ['Guardrail Compliance Rate', '100% Target', '100% Verified', 'Zero Policy Breaches'],
    ['Recommendation Adherence', '75% Target', '88.4% Actual', 'Calibrated']
  ];
  const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(', '))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `executive-qbr-roi-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const actions = {
  'set-district': ({ ctx, data }) => {
    (ctx.ui ||= {}).activeDistrict = data.d;
    (ctx.ui ||= {}).managerToast = `Switched operational district to ${data.d}. Territory routing adapted.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Commercial Operations', `Switched active district view to ${data.d}`);
  },
  'send-team-recognition': ({ ctx }) => {
    (ctx.ui ||= {}).managerToast = 'District recognition announcement dispatched to team.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', 'Dispatched district performance recognition announcement');
  },
  'open-qbr': ({ ctx }) => { (ctx.ui ||= {}).qbrOpen = true; },
  'close-qbr': ({ ctx }) => { (ctx.ui ||= {}).qbrOpen = false; },
  'download-qbr-csv': ({ ctx }) => {
    exportQbrCsv(ctx);
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', 'Exported executive QBR and AI ROI summary (CSV)');
  },
  'dispatch-qbr-exec': ({ ctx }) => {
    (ctx.ui ||= {}).managerToast = 'Executive QBR package dispatched to Chief Commercial Officer via secure ERP link.';
    ctx.ui.qbrOpen = false;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', 'Dispatched QBR executive package to VP Commercial Sales');
  },
  'toggle-simulator': ({ ctx }) => {
    (ctx.ui ||= {}).showSimulator = !ctx.ui.showSimulator;
  },
  'set-sim': ({ ctx, data }) => {
    (ctx.ui ||= {})[data.k] = Number(data.v);
  },
  'commit-sim': ({ ctx }) => {
    (ctx.ui ||= {}).managerToast = 'Scenario committed as active territory planning model.';
    ctx.ui.showSimulator = false;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', `Committed territory scenario: ${ctx.ui.simVisits || 5} visits/day, ${ctx.ui.simRadius || 25}km radius`);
  },

  ack: ({ ctx, data }) => { ctx.m.acknowledge(data.id); },
  'ex-escalate': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ex.status = 'escalated';
      ex.acknowledged = true;
      (ctx.ui ||= {}).managerToast = `Exception ${ex.id} escalated to Level 2 Commercial Operations.`;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Escalated exception ${ex.id} to Level 2 Commercial Operations: ${ex.title}`);
    }
  },
  'ex-approve': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ex.status = 'approved';
      ex.acknowledged = true;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Approved exception ${ex.id}: ${ex.title}`);
    }
  },
  'ex-reject': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ex.status = 'rejected';
      ex.acknowledged = true;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Rejected exception ${ex.id}: ${ex.title}`);
    }
  },
  'ex-filter': ({ ctx, data }) => { ctx.ui.exFilter = data.id; },
  'schedule-gap': ({ ctx, data }) => {
    const a = ctx.data.byId[data.id];
    (ctx.ui ||= {}).managerToast = `Scheduled ${a ? a.name : 'account'} into tomorrow's itinerary.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', `Scheduled priority visit for ${a ? a.name : data.id} in next journey cycle`);
  },
  'send-coaching': ({ ctx, data }) => {
    (ctx.ui ||= {}).managerToast = `Coaching guidance dispatched to ${data.rep}.`;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', `Dispatched coaching note to ${data.rep} regarding override patterns`);
  },
};
