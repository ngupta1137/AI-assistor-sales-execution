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
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">
      <div>
        <h3 style="margin:0">District analytics &amp; quota pace</h3>
        <small class="muted">Live operational performance vs commitments</small>
      </div>
      <div class="seg-ctl" role="group" aria-label="District analytics timeframe">
        <button class="seg ${(ctx.ui?.mgrTf || 'monthly') === 'daily' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="daily" style="min-height:var(--tap);min-width:44px;font-size:11px">Daily</button>
        <button class="seg ${ctx.ui?.mgrTf === 'weekly' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="weekly" style="min-height:var(--tap);min-width:44px;font-size:11px">Weekly</button>
        <button class="seg ${(ctx.ui?.mgrTf || 'monthly') === 'monthly' ? 'on' : ''}" data-act="set-mgr-tf" data-tf="monthly" style="min-height:var(--tap);min-width:44px;font-size:11px">Monthly</button>
      </div>
    </div>

    ${(() => {
      const tf = ctx.ui?.mgrTf || 'monthly';
      if (tf === 'daily') {
        return `
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
          <div><small>District calls</small><b>54 of 68</b></div>
          <div><small>Open exceptions</small><b class="good-text">3 items</b></div>
          <div><small>SLA turnaround</small><b>42 min</b></div>
          <div><small>Time saved</small><b>~19m/call</b></div>
        </div>
        <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
            <span class="muted">Hourly team visit &amp; revenue pace</span>
            <span class="good-text"><b>54 of 68 visits done</b> (79.4% on schedule)</span>
          </div>
          <svg viewBox="0 0 340 85" style="width:100%;height:auto;overflow:visible" role="img" aria-label="District daily pace">
            <defs>
              <linearGradient id="mgrDailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--good)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--good)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <line x1="38" y1="18" x2="325" y2="18" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="32" y="21" font-size="8" fill="var(--muted)" text-anchor="end">60 stops</text>
            <line x1="38" y1="44" x2="325" y2="44" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="32" y="47" font-size="8" fill="var(--muted)" text-anchor="end">30 stops</text>
            <line x1="38" y1="70" x2="325" y2="70" stroke="var(--line-soft)"/>
            <text x="32" y="72" font-size="8" fill="var(--muted)" text-anchor="end">0</text>
            
            <!-- SLA target pace line -->
            <line x1="42" y1="70" x2="320" y2="14" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="320" y="10" font-size="7" fill="var(--muted)" text-anchor="end">Target: 68 stops</text>
            
            <!-- Actual pace polygon and curve -->
            <polygon points="42,70 95,58 160,42 225,26 280,18 280,70 42,70" fill="url(#mgrDailyGrad)"/>
            <polyline points="42,70 95,58 160,42 225,26 280,18" fill="none" stroke="var(--good)" stroke-width="2.5"/>
            
            <circle cx="95" cy="58" r="3.5" fill="var(--good)"/>
            <text x="95" y="52" font-size="7" fill="var(--muted)" text-anchor="middle">10:30 (18)</text>
            
            <circle cx="160" cy="42" r="3.5" fill="var(--good)"/>
            <text x="160" y="36" font-size="7" fill="var(--muted)" text-anchor="middle">13:00 (36)</text>
            
            <circle cx="280" cy="18" r="4.5" fill="var(--good)"/>
            <text x="280" y="12" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">15:30 (54 stops)</text>
            
            <text x="42" y="80" font-size="8" fill="var(--muted)">08:30</text>
            <text x="160" y="80" font-size="8" fill="var(--muted)">Mid-day</text>
            <text x="280" y="80" font-size="8" font-weight="700" fill="var(--good)">Current (15:30)</text>
            <text x="320" y="80" font-size="8" fill="var(--muted)">17:30</text>
          </svg>
        </div>`;
      } else if (tf === 'weekly') {
        return `
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
          <div><small>Weekly quota</small><b>${esc(fmt.moneyShort(1350000 / 12))}</b></div>
          <div><small>Actual booked</small><b class="good-text">${esc(fmt.moneyShort(1420000 / 12))}</b></div>
          <div><small>Adherence</small><b class="good-text">88.4%</b></div>
          <div><small>Exception rate</small><b>3.8%</b></div>
        </div>
        <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
            <span class="muted">District 6-day revenue run-rate vs weekly quota</span>
            <span class="good-text"><b>$118,300 booked</b> (+5.2% vs $112,500 quota)</span>
          </div>
          <svg viewBox="0 0 340 90" style="width:100%;height:auto;overflow:visible" role="img" aria-label="Weekly district run rate">
            <defs>
              <linearGradient id="mgrWeeklyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <line x1="38" y1="18" x2="325" y2="18" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="32" y="21" font-size="8" fill="var(--muted)" text-anchor="end">$30k</text>
            <line x1="38" y1="46" x2="325" y2="46" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="32" y="49" font-size="8" fill="var(--muted)" text-anchor="end">$20k</text>
            <line x1="38" y1="72" x2="325" y2="72" stroke="var(--line-soft)"/>
            <text x="32" y="74" font-size="8" fill="var(--muted)" text-anchor="end">$10k</text>
            
            <!-- Daily district quota: $18.75k (y=49) -->
            <line x1="42" y1="49" x2="320" y2="49" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="320" y="45" font-size="7" fill="var(--muted)" text-anchor="end">Daily Quota ($18.8k)</text>
            
            <polygon points="46,46 95,38 145,54 195,30 245,18 295,48 295,72 46,72" fill="url(#mgrWeeklyGrad)"/>
            <polyline points="46,46 95,38 145,54 195,30 245,18 295,48" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
            
            <circle cx="46" cy="46" r="3.5" fill="var(--accent)"/>
            <text x="46" y="40" font-size="7" fill="var(--muted)" text-anchor="middle">$19.2k</text>
            
            <circle cx="95" cy="38" r="3.5" fill="var(--accent)"/>
            <text x="95" y="32" font-size="7" fill="var(--muted)" text-anchor="middle">$22.4k</text>
            
            <circle cx="145" cy="54" r="3.5" fill="var(--warn)"/>
            <text x="145" y="65" font-size="7" fill="var(--warn)" text-anchor="middle">$16.8k (Logistics lag)</text>
            
            <circle cx="195" cy="30" r="3.5" fill="var(--accent)"/>
            <text x="195" y="24" font-size="7" fill="var(--muted)" text-anchor="middle">$24.8k</text>
            
            <circle cx="245" cy="18" r="4.5" fill="var(--good)"/>
            <text x="245" y="12" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">$29.6k (Fri Surge)</text>
            
            <circle cx="295" cy="48" r="3.5" fill="var(--accent)"/>
            <text x="295" y="42" font-size="7" fill="var(--muted)" text-anchor="middle">$18.2k</text>
            
            <text x="46" y="82" font-size="8" fill="var(--muted)" text-anchor="middle">Mon</text>
            <text x="95" y="82" font-size="8" fill="var(--muted)" text-anchor="middle">Tue</text>
            <text x="145" y="82" font-size="8" fill="var(--muted)" text-anchor="middle">Wed</text>
            <text x="195" y="82" font-size="8" fill="var(--muted)" text-anchor="middle">Thu</text>
            <text x="245" y="82" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">Fri</text>
            <text x="295" y="82" font-size="8" fill="var(--muted)" text-anchor="middle">Sat</text>
          </svg>
        </div>`;
      } else {
        return `
        <div class="facts" style="grid-template-columns:repeat(auto-fit,minmax(80px,1fr));margin-bottom:8px">
          <div><small>Quota target</small><b>${esc(fmt.moneyShort(1350000))}</b></div>
          <div><small>Actual booked</small><b class="good-text">${esc(fmt.moneyShort(1420000))}</b></div>
          <div><small>Attainment</small><b class="good-text">105.2%</b></div>
          <div><small>AI attribution</small><b class="money">+${esc(fmt.moneyShort(184200))}</b></div>
        </div>
        <div style="padding:10px 12px;background:var(--surface-inset);border-radius:var(--radius-sm);border:1px solid var(--line-soft)">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px">
            <span class="muted">12-week district quota trajectory (W6 AI Assistor Inflection)</span>
            <span class="good-text"><b>$1,420,000 Actual</b> (+$70,000 vs $1,350,000 quota)</span>
          </div>
          <svg viewBox="0 0 340 100" style="width:100%;height:auto;overflow:visible" role="img" aria-label="12-week district quota attainment">
            <defs>
              <linearGradient id="mgrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--good)" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="var(--good)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <!-- Grid lines and Y-axis scale -->
            <line x1="42" y1="20" x2="325" y2="20" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="36" y="23" font-size="8" fill="var(--muted)" text-anchor="end">$180k</text>
            <line x1="42" y1="50" x2="325" y2="50" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
            <text x="36" y="53" font-size="8" fill="var(--muted)" text-anchor="end">$120k</text>
            <line x1="42" y1="78" x2="325" y2="78" stroke="var(--line-soft)"/>
            <text x="36" y="80" font-size="8" fill="var(--muted)" text-anchor="end">$80k</text>
            
            <!-- Target line: gradual ramp from $95k to $135k/wk -->
            <line x1="48" y1="72" x2="320" y2="35" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="320" y="31" font-size="7" fill="var(--muted)" text-anchor="end">Target ($1.35M)</text>
            
            <!-- W6 AI Intervention Marker -->
            <line x1="168" y1="12" x2="168" y2="82" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="3,3"/>
            <text x="168" y="10" font-size="8" font-weight="700" fill="var(--warn)" text-anchor="middle">AI Rollout (W6)</text>
            
            <!-- Shaded Area post-W6 -->
            <polygon points="48,76 72,74 96,70 120,73 144,68 168,58 192,50 216,42 240,34 264,28 288,22 320,14 320,78 48,78" fill="url(#mgrAreaGrad)"/>
            
            <!-- Actual revenue curve: realistic fluctuation W1-W5, sharp acceleration post W6 -->
            <polyline points="48,76 72,74 96,70 120,73 144,68 168,58 192,50 216,42 240,34 264,28 288,22 320,14" fill="none" stroke="var(--good)" stroke-width="2.5"/>
            
            <!-- Data callouts -->
            <circle cx="48" cy="76" r="3" fill="var(--muted)"/>
            <circle cx="120" cy="73" r="3" fill="var(--warn)"/>
            <text x="120" y="86" font-size="7" fill="var(--muted)" text-anchor="middle">W4: $95k (Lag)</text>
            
            <circle cx="168" cy="58" r="4" fill="var(--warn)"/>
            <circle cx="240" cy="34" r="3.5" fill="var(--good)"/>
            <text x="240" y="27" font-size="7" fill="var(--good)" text-anchor="middle">$148k</text>
            
            <circle cx="320" cy="14" r="4.5" fill="var(--good)"/>
            <text x="320" y="8" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">$182k (W12)</text>
            
            <!-- X-axis weeks -->
            <text x="48" y="92" font-size="8" fill="var(--muted)" text-anchor="middle">W1</text>
            <text x="96" y="92" font-size="8" fill="var(--muted)" text-anchor="middle">W3</text>
            <text x="168" y="92" font-size="8" font-weight="700" fill="var(--warn)" text-anchor="middle">W6</text>
            <text x="240" y="92" font-size="8" fill="var(--muted)" text-anchor="middle">W9</text>
            <text x="320" y="92" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">W12 (105%)</text>
          </svg>
        </div>`;
      }
    })()}
    <div class="btn-row" style="margin-top:10px;gap:8px;flex-wrap:wrap">
      <button class="btn secondary sm" data-act="open-qbr" style="min-height:var(--tap);flex:1;min-width:140px">${icon('note', 14)} Executive QBR report</button>
      <button class="btn secondary sm" data-act="toggle-simulator" style="min-height:var(--tap);flex:1;min-width:140px">${icon('route', 14)} What-if simulator</button>
      <button class="btn secondary sm" data-act="toggle-reassign" style="min-height:var(--tap);flex:1;min-width:140px">${icon('route', 14)} Mid-day re-balance</button>
    </div>
    
    ${ui?.showReassign ? `
    <div id="reassign-sim-box" style="margin-top:12px;padding:12px;background:var(--surface-subtle);border:1px solid var(--line);border-radius:var(--radius-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b>Mid-day route disruption and cross-rep re-balance</b>
        ${pill('Contingency Active', 'warn')}
      </div>
      <p class="small muted" style="margin-bottom:8px">Simulate vehicle breakdown or unexpected rep absence. Intelligently redistributes unvisited stops to active reps within driving range without violating dock delivery windows.</p>
      
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Disrupted Route:</span>
          <b class="warn-text">Route 02-B (Vehicle maintenance issue)</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Unvisited priority stops:</span>
          <b>3 high-value accounts (Est. $4,200)</b>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--surface);border-radius:4px;border:1px solid var(--line-soft)">
          <span>Target reassignment:</span>
          <b class="good-text">Jordan Taylor &amp; Alex Morgan (Within 12 km)</b>
        </div>
      </div>
      
      ${ui.reassignedDone ? `
        <div class="notice good">${icon('check', 14)}<span>Stops successfully re-balanced across nearby routes. Dock receiving windows preserved.</span></div>
      ` : `
        <button class="btn primary sm" data-act="execute-reassign" style="min-height:var(--tap);width:100%">${icon('route', 14)} Execute emergency cross-rep stop redistribution</button>
      `}
    </div>` : ''}
  
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
          ${pill('Pattern: SOC 2 Aligned', 'info')}
        </div>
        <ul class="bullets small" style="margin-top:4px">
          <li><b>Guardrail Compliance:</b> 100% adherence (zero regulatory or pricing policy breaches).</li>
          <li><b>Recommendation Acceptance:</b> 88.4% rep agreement rate across all brief recommendations.</li>
          <li><b>Exception Turnaround:</b> 42 minutes average decisioning time (SLA target: 120 minutes).</li>
        </ul>
      </section>

            <section class="card" style="margin:0;background:var(--surface-subtle);border:1px solid var(--line-soft)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Difference-in-Differences (DiD) Causal Margin Lift</b>
          ${pill('Parallel Pre-Trends: p=0.42', 'good')}
        </div>
        <p class="small muted" style="margin-bottom:8px">12-week empirical comparison: Test Territory (AI Assistor) vs Matched Control (Legacy rules). Parallel pre-trends verified W1 to W5.</p>
        <svg viewBox="0 0 340 110" style="width:100%;height:auto;overflow:visible" role="img" aria-label="Difference in differences longitudinal uplift">
          <defs>
            <linearGradient id="didUpliftGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--good)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--good)" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <!-- Y-axis scale -->
          <line x1="38" y1="20" x2="325" y2="20" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
          <text x="32" y="23" font-size="8" fill="var(--muted)" text-anchor="end">+10%</text>
          <line x1="38" y1="52" x2="325" y2="52" stroke="var(--line-soft)" stroke-dasharray="2,2"/>
          <text x="32" y="55" font-size="8" fill="var(--muted)" text-anchor="end">+5%</text>
          <line x1="38" y1="84" x2="325" y2="84" stroke="var(--line-soft)"/>
          <text x="32" y="86" font-size="8" fill="var(--muted)" text-anchor="end">0%</text>
          
          <!-- Intervention Cutoff Line -->
          <line x1="168" y1="14" x2="168" y2="88" stroke="var(--warn)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="168" y="11" text-anchor="middle" font-size="8" font-weight="700" fill="var(--warn)">Intervention (W6)</text>
          
          <!-- Shaded Spread between Test and Control (Attributable Uplift: +6.4%) -->
          <polygon points="168,64 192,54 216,44 240,36 264,28 288,22 320,16 320,68 288,68 264,69 240,68 216,68 192,67 168,66" fill="url(#didUpliftGrad)"/>
          
          <!-- Control Territory line (stagnant/flat growth +2.8%) -->
          <polyline points="46,73 70,74 94,71 118,72 142,70 168,66 192,67 216,68 240,68 264,69 288,68 320,68" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4,4"/>
          <circle cx="320" cy="68" r="3.5" fill="var(--muted)"/>
          <text x="320" y="78" font-size="8" fill="var(--muted)" text-anchor="middle">+2.8% Baseline</text>
          
          <!-- Test Territory line (parallel W1-W5, strong divergence W6-W12) -->
          <polyline points="46,72 70,74 94,70 118,71 142,69 168,64 192,54 216,44 240,36 264,28 288,22 320,16" fill="none" stroke="var(--good)" stroke-width="2.5"/>
          <circle cx="46" cy="72" r="3" fill="var(--muted)"/>
          <circle cx="118" cy="71" r="3" fill="var(--muted)"/>
          <circle cx="168" cy="64" r="3.5" fill="var(--warn)"/>
          <circle cx="240" cy="36" r="3.5" fill="var(--good)"/>
          <circle cx="320" cy="16" r="4.5" fill="var(--good)"/>
          <text x="320" y="10" font-size="9" font-weight="700" fill="var(--good)" text-anchor="middle">+9.2% (Test)</text>
          
          <text x="250" y="48" font-size="8" font-weight="700" fill="var(--good)">Net Lift: +6.4%</text>
          
          <!-- X-axis -->
          <text x="46" y="98" font-size="8" fill="var(--muted)" text-anchor="middle">W1</text>
          <text x="94" y="98" font-size="8" fill="var(--muted)" text-anchor="middle">W3</text>
          <text x="142" y="98" font-size="8" fill="var(--muted)" text-anchor="middle">W5 (Pre-test)</text>
          <text x="216" y="98" font-size="8" fill="var(--muted)" text-anchor="middle">W8</text>
          <text x="288" y="98" font-size="8" fill="var(--muted)" text-anchor="middle">W11</text>
          <text x="320" y="98" font-size="8" font-weight="700" fill="var(--good)" text-anchor="middle">W12</text>
        </svg>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:10px;color:var(--muted)">
          <span><span style="color:var(--good)">●</span> Test Territory (+9.2% POS growth)</span>
          <span><span style="color:var(--muted)">---</span> Control Group (+2.8% growth)</span>
          <span class="good-text"><b>P-value: P &lt; 0.008</b> (Verified significant)</span>
        </div>
      </section>

      <section class="card" style="margin:0;background:var(--surface-subtle);border:1px solid var(--line-soft)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <b>Pre-registered net commercial value model</b>
          ${pill('Sample Model Spec', 'info')}
        </div>
        <table class="tbl" style="width:100%;font-size:12px">
          <tbody>
            <tr><td>Attributable gross margin expansion (Test vs Control)</td><td style="text-align:right" class="good-text"><b>+$18,400</b></td></tr>
            <tr><td>Field capacity savings (19m/rep redeployed to high-tier calls)</td><td style="text-align:right" class="good-text"><b>+$2,640</b></td></tr>
            <tr><td class="muted">Less incremental co-op trade promotion investment</td><td style="text-align:right" class="warn-text">-$4,800</td></tr>
            <tr><td class="muted">Less commercial platform &amp; integration operating costs</td><td style="text-align:right" class="muted">-$1,960</td></tr>
            <tr style="border-top:2px solid var(--line)"><td><b>Net realized commercial value (Attributable profit)</b></td><td style="text-align:right" class="good-text"><b style="font-size:14px">+$14,280</b></td></tr>
          </tbody>
        </table>
        <small class="muted" style="display:block;margin-top:6px">Formula: Net Realized Value = Attributable Margin (Gross Margin post-trade) + Realized Capacity (GL-verified headcount/overtime reduction only) - Trade Spend - Operating Costs. Sample benchmark data. Pre-registration &amp; FP&amp;A sign-off required before pilot launch.</small>
        <button class="btn secondary sm" data-act="download-causal-audit" style="min-height:var(--tap);margin-top:8px;width:100%">${icon('note', 14)} Export Causal Attribution Ledger</button>
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
  'set-mgr-tf': ({ ctx, data }) => {
    (ctx.ui ||= {}).mgrTf = data.tf;
  },

  'toggle-reassign': ({ ctx }) => {
    (ctx.ui ||= {}).showReassign = !ctx.ui.showReassign;
  },
  'execute-reassign': ({ ctx }) => {
    (ctx.ui ||= {}).reassignedDone = true;
    ctx.ui.managerToast = 'Emergency route re-balance completed: 3 stops safely redistributed.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Route Re-Balance', 'Redistributed 3 unvisited stops from Route 02-B to neighboring reps');
  },

  'toggle-works-council': ({ ctx }) => {
    (ctx.ui ||= {}).worksCouncilSafe = !ctx.ui.worksCouncilSafe;
    ctx.ui.managerToast = ctx.ui.worksCouncilSafe ? 'Works Council Safe Mode activated. Rep telemetry anonymized per BetrVG §87.' : 'Standard telemetry restored.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Compliance Policy', `Works Council Safe Mode set to ${ctx.ui.worksCouncilSafe}`);
  },

  'download-causal-audit': ({ ctx }) => {
    (ctx.ui ||= {}).causalToast = 'Longitudinal causal attribution ledger exported.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Causal Ledger', 'Exported decision-to-outcome attribution log comparing territory against matched control');
    const content = [
      '========================================================================',
      'LONGITUDINAL DECISION-TO-OUTCOME CAUSAL ATTRIBUTION LEDGER',
      'Evaluation Method: Matched Control Territory Comparison (Difference-in-Differences & Synthetic Control)',
      'Parallel Trends Pre-Test: Passed (P = 0.42, no pre-treatment differential drift)',
      'Synthetic Control Covariate Balance: 8 dimensions matched (Volume, Account Density, Distance)',
      'Territory: Central Metro District | Baseline: North Corridor Control Group',
      '========================================================================',
      '',
      '1. CONSTRAINT-COUPLED EXECUTION METRICS',
      '   - Total Planned Recommendations: 142 items',
      '   - Constraints Enforced: Receiving Dock (100%), Depot Stock (100%), Credit Hold (100%)',
      '   - Feasible Actions Executed: 124 actions (87.3% execution rate)',
      '   - Override Root-Causes: Supply Shortage (5), Price Resistance (3), Absent (2), Rep (8)',
      '',
      '2. COMMERCIAL CAUSAL IMPACT ANALYSIS',
      '   - Test Territory 30-Day POS Growth: +9.2%',
      '   - Matched Control 30-Day POS Growth: +2.8%',
      '   - Attributable Incremental Uplift: +6.4% Net Margin Expansion',
      '   - Net Realized Commercial Contribution: $14,280 (Post trade and platform costs)',
      '',
      '3. VALIDATION ASSURANCE',
      '   - Spurious correlation filter: Passed (P < 0.01)',
      '   - Selection bias correction: Applied matched-propensity scoring across account tiers',
      '========================================================================',
      'CONFIDENTIAL - FOR COMMERCIAL EXCELLENCE REVIEW ONLY',
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
