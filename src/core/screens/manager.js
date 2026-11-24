// M2 Exception queue first, then M1 team today, M3 coaching prompts and M4 coverage.
// Acknowledge is acknowledgement only; this demo has no approve or reject transaction.

import { spark, performance } from './today.js';
import { esc, icon, pill, initials, bar } from '../ui.js';
import { renderWorksCouncilCard, maskRepName } from '../works-council.js';

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

  const readiness = ctx.industry.governance?.readiness || [];
  const readyCount = readiness.filter((r) => r.ready).length;
  const totalCount = readiness.length;
  const pct = Math.round((readyCount / Math.max(1, totalCount)) * 100);
  const notReady = readiness.filter((r) => !r.ready);

  const readinessBanner = `
  <section class="card tight" style="margin-bottom:var(--s3);border-left:4px solid ${pct === 100 ? 'var(--good)' : 'var(--accent)'};background:var(--surface)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="color:${pct === 100 ? 'var(--good)' : 'var(--accent)'}">${icon('shield', 18)}</span>
        <b style="font-size:12px">Season readiness: ${readyCount} of ${totalCount} items ready (${pct}%)</b>
      </div>
      <button class="btn text sm" data-act="toggle-mgr-readiness" style="min-height:var(--tap);font-size:11px;text-decoration:underline">
        ${ui?.mgrReadinessOpen ? 'Hide pending items' : `View ${notReady.length} pending items`}
      </button>
    </div>
    <div class="bar" style="margin:6px 0 4px 0;height:6px;background:var(--line-soft);border-radius:3px;overflow:hidden">
      <div style="width:${pct}%;height:100%;background:${pct === 100 ? 'var(--good)' : 'var(--accent)'};border-radius:3px"></div>
    </div>
    ${ui?.mgrReadinessOpen && notReady.length ? `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft)">
        <ul class="bullets small" style="margin:0 0 0 16px;padding:0;font-size:11px;line-height:1.6">
          ${notReady.map((item) => `<li><b>${esc(item.title)}:</b> ${esc(item.detail)}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </section>`;

  const excItem = (e) => {
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
        <dt>Root cause</dt><dd><span class="pill info sm" style="font-size:11px">${/supply|stock/i.test(reason) ? 'Supply Chain' : /price|cost/i.test(reason) ? 'Pricing Desk' : 'Field Judgment'}</span></dd>
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
  };
  const EXC_SHOWN = 3;
  const queue = shown.length ? shown.slice(0, EXC_SHOWN).map(excItem).join('') : `<li class="empty">No items need review here.</li>`;
  const queueRest = shown.length > EXC_SHOWN ? `<details class="exc-more"><summary>${esc(t('Show all {n}', { n: shown.length }))}</summary><ul class="group exceptions">${shown.slice(EXC_SHOWN).map(excItem).join('')}</ul></details>` : '';

  const team = reps.map((r) => {
    const dispName = maskRepName(r.name, ctx.app);
    return `<li class="row rep-row">
    <span class="avatar">${esc(initials(dispName))}</span>
    <span class="row-main"><b>${esc(dispName)}${r.self ? ' <small>(demo rep)</small>' : ''}</b>
      <small>${esc(r.area)} · ${r.done} of ${r.planned} ${esc(t('{visits}'))} · ${r.actionsDone} actions · ${r.overrides} overrides</small></span>
    <span class="row-end"><b class="money small">${esc(fmt.moneyShort(r.value))}</b><small>est. addressed</small></span></li>`;
  }).join('');

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
  ${renderWorksCouncilCard(ctx.app || {}, ctx)}
  ${readinessBanner}
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
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
      <div>
        <h3 style="margin:0">Team pace</h3>
        <small class="muted">Sample territory data</small>
      </div>
      <div class="seg-ctl" role="group" aria-label="District analytics timeframe">
        <button class="seg ${(ctx.ui?.mgrTf || 'monthly') === 'daily' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="daily" style="min-height:var(--tap);min-width:44px;font-size:11px">Daily</button>
        <button class="seg ${ctx.ui?.mgrTf === 'weekly' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="weekly" style="min-height:var(--tap);min-width:44px;font-size:11px">Weekly</button>
        <button class="seg ${(ctx.ui?.mgrTf || 'monthly') === 'monthly' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="monthly" style="min-height:var(--tap);min-width:44px;font-size:11px">Monthly</button>
      </div>
    </div>

    ${(() => {
      const tf = ['daily', 'weekly', 'monthly'].includes(ctx.ui?.mgrTf) ? ctx.ui.mgrTf : 'monthly';
      const tr = data.territory;
      const pct = Math.round((tr.achieved / tr.target) * 100);
      if (tf === 'daily') {
        const self = m.selfStats();
        const reps = (data.reps || []).map((r) => ({ name: r.name, done: r.self ? self.done : r.done, planned: r.planned }));
        const done = reps.reduce((s, r) => s + r.done, 0), planned = reps.reduce((s, r) => s + r.planned, 0);
        return `<div class="facts perf-facts"><div><small>Team ${esc(t('{visits}'))}</small><b class="tnum">${done} of ${planned}</b></div><div><small>Reps</small><b class="tnum">${reps.length}</b></div></div>
          <div class="perf-bars">${reps.map((r) => `<div class="stat-row"><span class="small">${esc(r.name)}</span><span class="small tnum">${r.done} of ${r.planned}</span></div>${bar(r.done, r.planned)}`).join('')}</div>
          <p class="small muted">${esc(t('Team {visits} done today. Sample data; your own row updates as you complete {visits}.'))}</p>`;
      }
      const perf = performance(ctx, data.planned, tf, pct);
      return `<div class="facts perf-facts">${perf.facts.map(([k, v, tone]) => `<div><small>${esc(t(k))}</small><b class="tnum${tone ? ` ${tone}-text` : ''}">${esc(v)}</b></div>`).join('')}</div>
        ${perf.bars ? `<div class="perf-bars">${perf.bars.map(([k, v]) => `<div class="stat-row"><span class="small muted">${esc(t(k))}</span><span class="small tnum">${esc(fmt.moneyShort(v))}</span></div>${bar(v, Math.max(...perf.bars.map((b) => b[1])) || 1)}`).join('')}</div>` : spark(perf.points, perf.goal)}
        <p class="small muted">${esc(t(perf.caption))} · ${esc(t('Sample data'))}</p>`;
    })()}
    <div class="btn-row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
      <button class="btn secondary sm" data-act="open-qbr" style="min-height:var(--tap);flex:1;min-width:140px">${icon('note', 14)} Quarterly review</button>
      <button class="btn secondary sm" data-act="toggle-simulator" style="min-height:var(--tap);flex:1;min-width:140px">${icon('route', 14)} What-if simulator</button>
      <button class="btn secondary sm" data-act="toggle-reassign" style="min-height:var(--tap);flex:1;min-width:140px">${icon('route', 14)} Mid-day re-balance</button>
    </div>
    
    ${ui?.showReassign ? `
    <div id="reassign-sim-box" style="margin-top:12px;padding:12px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Mid-day route disruption and cross-rep re-balance</b>
        ${pill('Simulated', 'info')}
      </div>
      <p class="small muted" style="margin-bottom:8px">A scripted contingency for a vehicle breakdown or absence. It shows how unvisited stops would be offered to nearby reps; in production the route planner would check receiving windows first.</p>
      
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Disrupted Route:</span>
          <b class="warn-text">Route 02-B (Vehicle maintenance issue)</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Unvisited priority stops:</span>
          <b>3 high-value accounts (Est. ${esc(fmt.money(4200))})</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Target reassignment:</span>
          <b>Two nearest reps (within 12 km)</b>
        </div>
      </div>
      
      ${ui.reassignedDone ? `
        <div class="notice good">${icon('check', 14)}<span>Stops offered to the two nearest reps (simulated). Each rep accepts or declines.</span></div>
      ` : `
        <button class="btn primary sm" data-act="execute-reassign" style="min-height:var(--tap);width:100%">${icon('route', 14)} Offer stops to nearby reps</button>
      `}
    </div>` : ''}
  
    ${ui?.showSimulator ? `
    <div id="territory-sim-box" style="margin-top:12px;padding:12px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Territory capacity and workload simulator</b>
        ${pill('Scenario modeling', 'info')}
      </div>
      <p class="small muted" style="margin-bottom:10px">Test visit cadence, cluster radius and suggestion threshold against the capacity of a field day before changing any route.</p>
      
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

      ${(() => {
        // Illustrative capacity model. Every assumption is stated on screen; nothing here is measured.
        const visits = ui.simVisits || 5, radius = ui.simRadius || 25, conf = ui.simConf || 80;
        const VISIT_MIN = 55, FIELD_MIN = 420, VALUE_PER_VISIT = 9600;
        const TRAVEL = { 15: 12, 25: 18, 40: 28 }, REACH = { 15: 60, 25: 85, 40: 100 };
        const SHOWN = { 70: 1.0, 80: 0.85, 90: 0.6 }, ACCEPT = { 70: 0.62, 80: 0.74, 90: 0.86 };
        const weekly = (v, r, c) => {
          const per = VISIT_MIN + TRAVEL[r];
          const done = Math.min(v, Math.floor(FIELD_MIN / per));
          return { per, done, value: done * 5 * VALUE_PER_VISIT * SHOWN[c] * ACCEPT[c] * (0.6 + 0.4 * REACH[r] / 100) };
        };
        const now = weekly(5, 25, 80), sc = weekly(visits, radius, conf);
        const loadPct = Math.round((visits * sc.per) / FIELD_MIN * 100);
        const delta = Math.round((sc.value / now.value - 1) * 100);
        const over = visits > sc.done;
        return `
      <div class="facts" style="margin-top:10px;grid-template-columns:repeat(auto-fit,minmax(96px,1fr))">
        <div><small>Field day used</small><b class="${over ? 'bad-text' : ''}">${loadPct}%</b></div>
        <div><small>${esc(t("High-value {accounts} in reach"))}</small><b>${REACH[radius]}%</b></div>
        <div><small>Suggestions accepted</small><b>${Math.round(ACCEPT[conf] * 100)}%</b></div>
        <div><small>Weekly value vs today</small><b class="${delta < 0 ? 'bad-text' : delta > 0 ? 'good-text' : ''}">${delta > 0 ? '+' : ''}${delta}%</b></div>
      </div>
      ${over ? `<p class="small bad-text" style="margin:6px 0 0">Over capacity: ${visits} visits need ${visits * sc.per} minutes. Only ${sc.done} fit in a ${FIELD_MIN / 60}-hour field day, so ${visits - sc.done} slips each day.</p>` : ''}
      <p class="small muted" style="margin:6px 0 0;font-size:11px">Illustrative model on sample assumptions: ${VISIT_MIN} min per visit; travel ${TRAVEL[15]}, ${TRAVEL[25]} or ${TRAVEL[40]} min by radius; ${FIELD_MIN / 60}-hour field day; a higher threshold shows fewer suggestions (${SHOWN[70] * 100}, ${SHOWN[80] * 100} or ${SHOWN[90] * 100}%) that are accepted more often (${ACCEPT[70] * 100}, ${ACCEPT[80] * 100} or ${ACCEPT[90] * 100}%). Not a forecast.</p>`;
      })()}

      <button class="btn good sm" data-act="commit-sim" style="min-height:var(--tap);width:100%;margin-top:10px">${icon('check', 14)} Save scenario for approval</button>
    </div>` : ''}
  </section>
  <section id="exceptions">
    <div class="section-head"><h2>Exception queue</h2>${pill(`${open} open`, open ? 'warn' : 'good')}</div>
    <p class="small muted lead-sm" style="margin-bottom:8px">${esc(t("Overrides, blocked actions and pending approvals, with the {rep}'s reason. For coaching, not policing."))}</p>
    <div class="seg-ctl" role="tablist" style="margin-bottom:8px">
      ${[['all', 'All'], ['manager', `To ${t('{manager}')}`], ['kam', `To ${t('{kam}')}`]].map(([id, label]) => `<button class="seg${filter === id ? ' on' : ''}" data-act="ex-filter" data-id="${id}" role="tab" aria-selected="${filter === id}">${esc(label)}</button>`).join('')}
    </div>
    <ul class="group exceptions">${queue}</ul>
    ${queueRest}
  </section>
  <details class="fold" id="team"><summary>Team<span class="sum-end">${reps.length}</span></summary><ul class="group">${team}</ul>
    <small style="display:block">Estimated opportunity addressed comes from completed actions. It is not booked sales.</small></details>
  <details class="fold" id="coaching"><summary>Coaching prompts</summary>
    <p class="small muted">From patterns in overrides and blocked actions. For conversations, not a leaderboard.</p>
    <ul class="group">${prompts || '<li class="empty">No patterns yet.</li>'}</ul></details>
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
          ${icon('note', 20)} Quarterly review
        </h2>
        <small>Sample territory data and this session's decisions. Impact is measured in a pilot, not shown here.</small>
      </div>
      <button class="icon-btn" data-act="close-qbr" aria-label="Close quarterly review" style="min-height:var(--tap);min-width:var(--tap)">${icon('x', 20)}</button>
    </header>

    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      ${(() => {
        const q = qbrModel(ctx);
        return `
      <section class="card" id="qbr-pace" style="margin:0">
        <div class="section-head"><h3>${esc(t('Territory pace'))}</h3>${pill(t('Sample data'), 'muted')}</div>
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(90px,1fr))">
          <div><small>Month target</small><b class="tnum">${esc(fmt.moneyShort(q.target))}</b></div>
          <div><small>Achieved</small><b class="tnum">${esc(fmt.moneyShort(q.achieved))} · ${q.pct}%</b></div>
          <div><small>Team ${esc(t('{visits}'))} done today</small><b class="tnum">${q.teamDone} of ${q.teamPlanned}</b></div>
          <div><small>Open opportunity</small><b class="tnum">${esc(fmt.moneyShort(q.opportunity))}</b></div>
        </div>
      </section>

      <section class="card" id="qbr-decisions" style="margin:0">
        <div class="section-head"><h3>${esc(t('Brief decisions this session'))}</h3>${pill(t('Live from this demo'), 'info')}</div>
        ${q.decided ? `<div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr))">
          <div><small>Approved</small><b class="tnum">${q.approved}</b></div>
          <div><small>Adjusted</small><b class="tnum">${q.adjusted}</b></div>
          <div><small>Overridden</small><b class="tnum">${q.overridden}</b></div>
          <div><small>Accepted as is</small><b class="tnum">${q.acceptPct}%</b></div>
        </div>` : `<p class="small muted">${esc(t('No brief decisions yet. Approve, adjust or override items in a brief and they show here.'))}</p>`}
        <p class="small muted">${esc(t('Guardrails are enforced in code: the agent cannot submit an {order}, set a price or skip an approval, so there is no breach rate to report.'))}</p>
      </section>

      <section class="card" id="qbr-measure" style="margin:0">
        <div class="section-head"><h3>${esc(t('How impact will be measured'))}</h3>${pill(t('Not yet measured'), 'warn')}</div>
        <ol class="bullets small">
          <li>${esc(t('Pick test and control territories matched on volume, {account} mix and distance.'))}</li>
          <li>${esc(t('Check that both trended the same way for at least five weeks before go-live.'))}</li>
          <li>${esc(t('Run for a full quarter and compare the change in each, not the end values.'))}</li>
          <li>${esc(t('Count only margin after trade spend, and time savings only when they show up in hours or headcount.'))}</li>
          <li>${esc(t('Agree the method with finance before the pilot starts, so nobody picks it after seeing the numbers.'))}</li>
        </ol>
        <svg viewBox="0 0 340 70" class="design-chart" role="img" aria-label="Design illustration with no data">
          <line x1="20" y1="60" x2="330" y2="60" stroke="var(--line)"/>
          <line x1="170" y1="6" x2="170" y2="62" stroke="var(--muted)" stroke-dasharray="3,3"/>
          <text x="174" y="14" font-size="9" fill="var(--muted)">Go-live</text>
          <polyline points="20,48 90,46 170,44 330,40" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4,4"/>
          <polyline points="20,50 90,48 170,46 330,30" fill="none" stroke="var(--accent)" stroke-width="2"/>
          <text x="20" y="69" font-size="9" fill="var(--muted)">Test (solid) vs control (dashed). Shape only, no data.</text>
        </svg>
        <p class="small muted">${esc(t('Value = margin difference against control + measured capacity - added trade spend - platform cost. Each term is filled from the pilot.'))}</p>
        <button class="btn secondary sm" data-act="download-causal-audit" style="width:100%">${icon('note', 14)} ${esc(t('Export measurement plan'))}</button>
      </section>`;
      })()}

      <div class="btn-row" style="margin-top:4px;gap:8px;flex-wrap:wrap">
        <button class="btn primary" data-act="download-qbr-csv" style="flex:1;min-width:140px">${icon('note', 18)} ${esc(t('Export review (CSV)'))}</button>
        <button class="btn secondary" data-act="dispatch-qbr-exec" style="flex:1;min-width:140px">${icon('brief', 18)} ${esc(t('Send to sales leadership'))}</button>
      </div>
    </div>
  </section>` : ''}`;
}


/** Quarterly review figures: sample territory data plus this session's brief decisions. No impact numbers. */
export function qbrModel(ctx) {
  const { data, m } = ctx;
  const tr = data.territory;
  const reps = data.reps || [];
  const self = m.selfStats();
  let approved = 0, adjusted = 0, overridden = 0;
  for (const p of data.planned) { const c = m.counts(p.accountId); approved += c.approved; adjusted += c.adjusted; overridden += c.overridden; }
  const decided = approved + adjusted + overridden;
  return {
    target: tr.target, achieved: tr.achieved, pct: Math.round((tr.achieved / tr.target) * 100), opportunity: tr.opportunity,
    teamPlanned: reps.reduce((s, r) => s + r.planned, 0), teamDone: reps.reduce((s, r) => s + (r.self ? self.done : r.done), 0),
    approved, adjusted, overridden, decided, acceptPct: decided ? Math.round((approved / decided) * 100) : 0,
  };
}

export function exportQbrCsv(ctx) {
  if (!ctx || !ctx.m) return;
  const fmt = ctx.fmt;
  const q = qbrModel(ctx);
  const headers = ['Metric', 'Value', 'Source'];
  const rows = [
    ['Month target', fmt.money(q.target), 'Sample data'],
    ['Achieved to date', `${fmt.money(q.achieved)} (${q.pct}%)`, 'Sample data'],
    ['Open opportunity', fmt.money(q.opportunity), 'Sample data'],
    ['Team visits done today', `${q.teamDone} of ${q.teamPlanned}`, 'Sample data and this session'],
    ['Brief items approved', String(q.approved), 'This session'],
    ['Brief items adjusted', String(q.adjusted), 'This session'],
    ['Brief items overridden', String(q.overridden), 'This session'],
    ['Impact against control', 'Not yet measured', 'Measured in a pilot'],
  ];
  const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `quarterly-review-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const actions = {
  'toggle-mgr-readiness': ({ ctx }) => { (ctx.ui ||= {}).mgrReadinessOpen = !ctx.ui.mgrReadinessOpen; },
  'set-mgr-tf': ({ ctx, data }) => {
    (ctx.ui ||= {}).mgrTf = data.tf;
  },

  'toggle-reassign': ({ ctx }) => {
    (ctx.ui ||= {}).showReassign = !ctx.ui.showReassign;
  },
  'execute-reassign': ({ ctx }) => {
    (ctx.ui ||= {}).reassignedDone = true;
    ctx.ui.managerToast = 'Simulated: 3 stops offered to the two nearest reps.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Route Re-Balance', 'Redistributed 3 unvisited stops from Route 02-B to neighboring reps');
  },

  'toggle-works-council': ({ ctx }) => {
    (ctx.ui ||= {}).worksCouncilSafe = !ctx.ui.worksCouncilSafe;
    ctx.ui.managerToast = ctx.ui.worksCouncilSafe ? 'Works Council Safe Mode activated. Rep telemetry anonymized per BetrVG §87.' : 'Standard telemetry restored.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Compliance Policy', `Works Council Safe Mode set to ${ctx.ui.worksCouncilSafe}`);
  },

  'download-causal-audit': ({ ctx }) => {
    (ctx.ui ||= {}).causalToast = 'Measurement plan exported.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Measurement plan', 'Exported the test and control measurement plan');
    const content = [
      'MEASUREMENT PLAN: TEST AND CONTROL TERRITORIES',
      'Status: not yet measured. This file holds the method, not results.',
      '',
      '1. Match test and control territories on volume, account mix and distance.',
      '2. Confirm parallel trends for at least five weeks before go-live.',
      '3. Run for one full quarter. Compare the change in each territory (difference in differences).',
      '4. Value = margin difference against control + measured capacity - added trade spend - platform cost.',
      '5. Count capacity only when it shows up in hours or headcount.',
      '6. Agree the method with finance before the pilot starts.',
      '',
      `Generated: ${new Date().toISOString()}`
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Causal-Decision-Outcome-Ledger.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

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
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', 'Exported the quarterly review (CSV)');
  },
  'dispatch-qbr-exec': ({ ctx }) => {
    (ctx.ui ||= {}).managerToast = 'Simulated: the review would go to sales leadership. Nothing was sent.';
    ctx.ui.qbrOpen = false;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', 'Simulated sending the quarterly review to sales leadership');
  },
  'toggle-simulator': ({ ctx }) => {
    (ctx.ui ||= {}).showSimulator = !ctx.ui.showSimulator;
  },
  'set-sim': ({ ctx, data }) => {
    (ctx.ui ||= {})[data.k] = Number(data.v);
  },
  'commit-sim': ({ ctx }) => {
    (ctx.ui ||= {}).managerToast = 'Scenario saved to the planning log. Routes change only after the planning owner approves it.';
    ctx.ui.showSimulator = false;
    if (ctx.m?.logAudit) ctx.m.logAudit('Manager', `Committed territory scenario: ${ctx.ui.simVisits || 5} visits/day, ${ctx.ui.simRadius || 25}km radius`);
  },

  ack: ({ ctx, data }) => { ctx.m.acknowledge(data.id); },
  'ex-escalate': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ctx.m.decideException(ex.id, 'escalated');
      (ctx.ui ||= {}).managerToast = `Exception ${ex.id} escalated to Level 2 Commercial Operations.`;
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Escalated exception ${ex.id} to Level 2 Commercial Operations: ${ex.title}`);
    }
  },
  'ex-approve': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ctx.m.decideException(ex.id, 'approved');
      if (ctx.m.logAudit) ctx.m.logAudit('Manager', `Approved exception ${ex.id}: ${ex.title}`);
    }
  },
  'ex-reject': ({ ctx, data }) => {
    const ex = ctx.m.exceptions().find((x) => x.id === data.id);
    if (ex) {
      ctx.m.decideException(ex.id, 'rejected');
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
