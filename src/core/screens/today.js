// R1 Today: next brief first, then the month, then today's accounts ranked by estimated opportunity.
// Month actual comes from source data only. Completed actions are shown as an estimate, never added to actuals.

import { esc, icon, pill, bar, kpiValue, AGENT_LABEL } from '../ui.js';
import { wording } from '../wording.js';
import { fieldNotices } from '../execution/views.js';
import { renderChannelRtmBar } from '../channels.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Compact 50px trend line. points: values 0..1 in order; goal: optional straight pace line end value. */
export function spark(points, goal) {
  if (!points.length) return '';
  const W = 320, H = 50, pad = 3;
  const x = (i) => pad + (i * (W - 2 * pad)) / Math.max(1, points.length - 1);
  const y = (v) => H - pad - Math.max(0, Math.min(1, v)) * (H - 2 * pad);
  const line = points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Trend line, sample data">
    <defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.22"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    ${goal != null ? `<line x1="${x(0)}" y1="${y(0)}" x2="${x(points.length - 1)}" y2="${y(goal)}" class="spark-goal"/>` : ''}
    <polygon points="${x(0)},${H - pad} ${line} ${x(points.length - 1)},${H - pad}" fill="url(#sparkFill)"/>
    <polyline points="${line}" class="spark-line"/>
  </svg>`;
}

/** Daily, weekly and monthly views. Arithmetic on the sample territory only; nothing is a recorded result. */
export function performance(ctx, ordered, tf, pct) {
  const { fmt, data, m } = ctx;
  const tr = data.territory;
  if (tf === 'daily') {
    const total = ordered.reduce((s, p) => s + p.opportunity, 0) || 1;
    const byTime = ordered.slice().sort((a, b) => a.start - b.start);
    let run = 0;
    const pts = [0, ...byTime.map((p) => (run += p.opportunity) / total)];
    const done = byTime.filter((p) => m.visitDone(p.accountId));
    const doneValue = done.reduce((s, p) => s + p.opportunity, 0);
    return {
      points: pts, goal: null,
      facts: [['Planned opportunity', fmt.moneyShort(total)], ['{Visits} done', `${done.length} of ${ordered.length}`, done.length ? 'good' : ''], ['Opportunity visited', fmt.moneyShort(doneValue)], ['Last {visit} ends', fmt.time(Math.max(...byTime.map((p) => p.end || p.start)))]],
      caption: 'Cumulative planned opportunity across today, in {visit} order',
    };
  }
  const d = fmt.today;
  const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const day = d.getDate();
  const left = tr.target - tr.achieved;
  if (tf === 'weekly') {
    const weeksGone = Math.max(1, day / 7);
    const weeksLeft = Math.max(1, (dim - day) / 7);
    const rate = tr.achieved / weeksGone;
    const need = Math.max(0, left) / weeksLeft;
    return {
      points: [], bars: [['Run rate a week', rate], ['Needed a week', need]],
      facts: [['Run rate a week', fmt.moneyShort(rate)], ['Needed a week', fmt.moneyShort(need), need > rate ? 'warn' : 'good'], ['Weeks left', String(Math.round(weeksLeft * 10) / 10)], ['Gap to target', fmt.moneyShort(Math.max(0, left))]],
      caption: 'Run rate so far against the weekly rate still needed',
    };
  }
  const steps = 6;
  const pts = Array.from({ length: steps + 1 }, (_, i) => (tr.achieved / tr.target) * (i / steps));
  const projected = Math.round((tr.achieved / Math.max(1, day)) * dim);
  return {
    points: pts, goal: Math.min(1, day / dim),
    facts: [['Month target', fmt.moneyShort(tr.target)], ['Achieved', `${fmt.moneyShort(tr.achieved)} · ${pct}%`], ['Days left', String(dim - day)], ['Projected at this pace', fmt.moneyShort(projected), projected >= tr.target ? 'good' : 'warn']],
    caption: 'Month to date, with the straight-line pace to target',
  };
}

export function render(ctx) {
  const { t, fmt, data, m, industry } = ctx;
  const today = fmt.today;
  const ordered = data.planned.slice().sort((a, b) => a.rank - b.rank);
  const totalActions = ordered.reduce((s, p) => s + p.actions.length, 0);
  const pending = ordered.reduce((s, p) => s + m.counts(p.accountId).pending, 0);
  const done = ordered.filter((p) => m.visitDone(p.accountId)).length;
  const next = m.nextAccount(null);
  const nextAcc = data.byId[(next || ordered[0]).accountId];
  const kpi = industry.kpis.find((k) => k.id === data.territory.headlineKpi.id);
  const stopped = data.agents.filter((a) => m.agentStopped(a.id));
  const tr = data.territory;
  const self = m.selfStats();
  const pct = Math.round((tr.achieved / tr.target) * 100);

  const chShort = ctx.channelInfo?.short || 'MT';
  const rtmShort = ctx.rtmInfo?.short || 'DSD';

  const rows = ordered.map((p) => {
    const a = data.byId[p.accountId];
    const c = m.counts(p.accountId);
    const isDone = m.visitDone(p.accountId);
    const status = isDone ? pill('Done', 'good')
      : m.closedToday(p.accountId) ? pill('Closed today', 'muted')
        : c.pending === 0 ? pill('Reviewed', 'info') : pill(`${c.pending} to review`, 'warn');
    return `<li><a class="row acc-row${isDone ? ' done' : ''}" href="#/brief/${a.id}" data-account="${a.id}">
      <span class="rank${p.rank === 1 ? ' first' : ''}">${p.rank}</span>
      <span class="row-main">
        <b>${esc(a.name)}</b>
        <small class="tnum">${esc(fmt.time(p.start))} · ${esc(fmt.distance(p.km))} · <span class="money">${esc(fmt.moneyShort(p.opportunity))}</span> · <span style="font-weight:600;color:var(--accent-ink)">${esc(chShort)} · ${esc(rtmShort)}</span></small>
      </span>
      <span class="row-end">${status}</span>
    </a></li>`;
  }).join('');

  const unplanned = data.accounts.filter((a) => !data.planned.some((p) => p.accountId === a.id)).slice(0, 3);
  const adhocModal = ctx.ui?.adhocOpen ? `
  <div class="presenter-backdrop" data-act="close-adhoc" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="adhoc-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="adhoc-title">${icon('route', 18)} Add ad-hoc customer drop-in</h2>
        <small>Select an unscheduled account in your territory to insert into today's journey.</small>
      </div>
      <button class="icon-btn" data-act="close-adhoc" aria-label="Close dialog">${icon('x', 20)}</button>
    </header>
    <div style="padding:var(--s4);display:flex;flex-direction:column;gap:var(--s3)">
      <ul class="group list">
        ${unplanned.map((acc) => `<li class="row" style="flex-direction:column;align-items:stretch">
          <div style="display:flex;align-items:center"><span class="row-main"><b>${esc(acc.name)}</b>
            <small>${esc(t(acc.type))} · Tier ${acc.tier} · ${esc(acc.area)}</small></span>
            <span class="row-end"><b class="money small">${esc(fmt.moneyShort(acc.potential))}</b><small>annual potential</small></span>
          </div>
          <div style="margin-top:6px;display:flex;justify-content:flex-end">
            <button class="btn primary sm" data-act="add-adhoc-stop" data-id="${acc.id}" style="min-height:var(--tap)">Add to today</button>
          </div>
        </li>`).join('')}
      </ul>
      <button class="btn secondary block" data-act="close-adhoc" style="min-height:var(--tap)">Cancel</button>
    </div>
  </section>` : '';


  const nextPlan = next || ordered[0];
  const nextItems = m.briefItems(nextAcc.id);
  const topAction = nextItems.find((it) => it.kind === 'action');
  const nc = m.counts(nextAcc.id);
  const tf = ['daily', 'weekly', 'monthly'].includes(ctx.ui?.repTf) ? ctx.ui.repTf : 'daily';
  const perf = performance(ctx, ordered, tf, pct);
  return `${adhocModal}
  ${ctx.ui?.todayToast ? `<div class="notice good">${icon('check', 16)}<span>${esc(ctx.ui.todayToast)}</span></div>` : ''}
  <section class="today-head">
    <span class="eyebrow">${esc(fmt.weekday(today))} ${esc(fmt.dateShort(today))} · ${esc(data.city.name)}</span>
    <h1>${greeting()}, ${esc(data.rep.first)}</h1>
    <p class="head-meta">${done} of ${ordered.length} ${esc(t('{visits}'))} done · ${pending ? esc(t('{n} items to review', { n: pending })) : esc(t('All briefs reviewed'))}</p>
  </section>

  <section class="kpi-strip" aria-label="Executive territory summary">
    <div class="kpi-card">
      <div class="kpi-head"><span class="kpi-label">${esc(t("Today's {visits}"))}</span>${pending ? pill(t('{n} to review', { n: pending }), 'warn') : pill(t('All reviewed'), 'good')}</div>
      <div class="kpi-num">${ordered.length} <small>${esc(t('planned'))}</small></div>
      <div class="kpi-meta">${totalActions} ${esc(t('actions'))} · ${done} ${esc(t('completed'))}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-head"><span class="kpi-label">${esc(t('Planned opportunity'))}</span>${pill(t('Estimated'), 'accent')}</div>
      <div class="kpi-num money">${esc(fmt.moneyShort(ordered.reduce((s, p) => s + p.opportunity, 0)))}</div>
      <div class="kpi-meta">${esc(t("Across today's scheduled journey"))}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-head"><span class="kpi-label">${esc(t('Quota pace (MTD)'))}</span>${pct >= 100 ? pill(t('On track'), 'good') : pill(t('Pacing'), 'accent')}</div>
      <div class="kpi-num">${pct}% <small>MTD</small></div>
      <div class="kpi-meta">${esc(fmt.moneyShort(tr.achieved))} of ${esc(fmt.moneyShort(tr.target))} ${esc(t('target'))}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-head"><span class="kpi-label">${esc(t('Field AI agents'))}</span>${stopped.length ? pill(t('{n} stopped', { n: stopped.length }), 'warn') : pill(t('Active'), 'good')}</div>
      <div class="kpi-num">${data.agents.length - stopped.length} <small>${esc(t('synced'))}</small></div>
      <div class="kpi-meta">${esc(t('Overnight briefs ready'))}</div>
    </div>
  </section>

  ${stopped.length ? `<div class="notice warn">${icon('stop', 18)}<span>${esc(stopped.map((a) => AGENT_LABEL[a.id]).join(', '))} stopped. Its items are paused in every brief.</span></div>` : ''}

  ${renderChannelRtmBar(ctx.app || { config: { channel: ctx.channel, rtm: ctx.rtm } }, ctx)}

  <div class="adaptive-grid today-grid">
  <div class="grid-primary">
  <section class="focus-card" id="next-up">
    <div class="focus-top">${pill(t('Next {visit}'), 'accent')}<span class="small muted tnum">${esc(fmt.time(nextPlan.start))} · ${esc(fmt.distance(nextPlan.km))}</span></div>
    <h2>${esc(nextAcc.name)}</h2>
    <p class="small muted">${esc(t(nextAcc.type))} · ${esc(t('Tier {tier}', { tier: nextAcc.tier }))} · ${esc(nextAcc.contacts[0].name)}</p>
    <div style="margin:6px 0;padding:6px 8px;background:var(--surface-subtle);border-radius:4px;border:1px solid var(--line-soft);font-size:11px">
      <b style="color:var(--accent-ink)">${esc(ctx.channelInfo?.badge || 'Modern Trade')} · ${esc(ctx.rtmInfo?.badge || 'DSD')}:</b>
      <div class="muted">${esc(ctx.channelInfo?.focusArea || '')} · ${esc(ctx.rtmInfo?.fulfillmentDetails || '')}</div>
    </div>
    ${topAction ? `<p class="focus-action"><span class="eyebrow">${esc(t('Top action'))}</span>${esc(t(topAction.title, topAction.vars))}</p>` : ''}
    <a class="btn primary block" href="#/brief/${nextAcc.id}" id="overnight-banner">${nc.pending ? esc(t('Open brief · {n} to review', { n: nc.pending })) : esc(t('Open brief'))}${icon('chevron', 18)}</a>
  </section>

  ${fieldNotices(ctx)}

  <div class="tool-row">
    <a class="tool-chip" href="#/route" id="open-route">${icon('route', 14)} ${esc(t('Route plan'))}</a>
    <button class="tool-chip" data-act="open-adhoc" id="open-adhoc">${icon('pin', 14)} ${esc(t('Log ad-hoc stop'))}</button>
  </div>

  <section class="visits">
    <div class="section-head"><h2>${esc(t("Today's {visits}"))}</h2><small class="muted">${esc(t('Ranked by opportunity'))}</small></div>
    <ol class="group list">${rows}</ol>
  </section>
  </div>

  <div class="grid-secondary">
  <details class="fold" id="perf" data-tf="${tf}"${['tablet', 'desktop'].includes(ctx.app?.vp) ? ' open' : ''}>
    <summary>${esc(t('Performance'))}<span class="sum-end tnum">${esc(t('{pct}% of month target', { pct }))}</span></summary>
    <div class="fold-body">
      <div class="seg-ctl pill-seg" role="group" aria-label="${esc(t('Timeframe'))}">
        ${[['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([k, l]) => `<button class="seg ${tf === k ? 'on' : ''}" data-act="set-rep-tf" data-tf="${k}" aria-pressed="${tf === k}">${esc(t(l))}</button>`).join('')}
      </div>
      <div class="stat-row" id="mtd"><span class="small muted">${esc(t('Month to date, from source data'))}</span><span class="small"><b class="money">${esc(fmt.moneyShort(tr.achieved))}</b> of ${esc(fmt.moneyShort(tr.target))} · ${pct}%</span></div>
      ${bar(tr.achieved, tr.target)}
      <div class="facts perf-facts">${perf.facts.map(([k, v, tone]) => `<div><small>${esc(t(k))}</small><b class="tnum${tone ? ` ${tone}-text` : ''}">${esc(v)}</b></div>`).join('')}</div>
      ${perf.bars ? `<div class="perf-bars">${perf.bars.map(([k, v]) => `<div class="stat-row"><span class="small muted">${esc(t(k))}</span><span class="small tnum">${esc(fmt.moneyShort(v))}</span></div>${bar(v, Math.max(...perf.bars.map((b) => b[1])) || 1)}`).join('')}</div>` : spark(perf.points, perf.goal)}
      <div class="perf-foot"><span class="small muted">${esc(t(perf.caption))} · ${esc(t('Sample data'))}</span>
        <button class="btn secondary sm" data-act="time-crunch">${icon('route', 12)} ${esc(t('Re-balance for less time'))}</button>
      </div>
    </div>
  </details>

  <details class="fold" id="territory">
    <summary>${esc(t('{Territory}'))}<span class="sum-end">${esc(kpiValue(kpi, tr.headlineKpi.value, fmt))}</span></summary>
    <div class="facts">
      <div><small>${esc(t(kpi.label))}</small><b>${esc(kpiValue(kpi, tr.headlineKpi.value, fmt))}</b><small>Target ${esc(kpiValue(kpi, kpi.target, fmt))}</small></div>
      <div><small>Untapped potential</small><b>${esc(fmt.moneyShort(tr.opportunity))}</b><small>${esc(t(`Across ${data.accounts.length} {accounts}`))}</small></div>
      ${self.estimated ? `<div class="wide"><small>Estimated opportunity addressed today</small><b>${esc(fmt.moneyShort(self.estimated))}</b><small>An estimate from completed actions. Not booked sales, and not added to the month total.</small></div>` : ''}
    </div>
  </details>
  </div>
  </div>
  <p class="foot-note">Values are generated for this demo.</p>`;
}

export const actions = {
  'dismiss-briefs-hero': ({ ctx }) => { (ctx.ui ||= {}).briefsHeroDismissed = true; },
  'restore-briefs-hero': ({ ctx }) => { (ctx.ui ||= {}).briefsHeroDismissed = false; },
  'dismiss-context-bar': ({ ctx }) => { (ctx.ui ||= {}).contextBarDismissed = true; },
  'set-rep-tf': ({ ctx, data }) => {
    (ctx.ui ||= {}).repTf = data.tf;
  },

  'time-crunch': ({ ctx }) => {
    (ctx.ui ||= {}).todayToast = 'Re-balanced journey itinerary. Saved 35 minutes to preserve shift finish time.';
    if (ctx.m?.logAudit) ctx.m.logAudit('Visit Planner', 'Re-balanced itinerary for time crunch; deferred non-critical tasks');
  },
  'open-adhoc': ({ ctx }) => { (ctx.ui ||= {}).adhocOpen = true; },
  'close-adhoc': ({ ctx }) => { (ctx.ui ||= {}).adhocOpen = false; },
  'add-adhoc-stop': ({ ctx, data }) => {
    const acc = ctx.data.byId[data.id];
    if (acc) {
      const exists = ctx.data.planned.some((p) => p.accountId === acc.id);
      if (!exists) {
        ctx.data.planned.push({
          accountId: acc.id,
          rank: ctx.data.planned.length + 1,
          km: 1.8,
          opportunity: Math.round(acc.potential / 12),
          start: 16 * 60,
          end: 17 * 60,
          actions: [],
          brief: [],
          order: [],
        });
      }
      (ctx.ui ||= {}).todayToast = `Added ${acc.name} to today's journey plan.`;
      ctx.ui.adhocOpen = false;
      if (ctx.m?.logAudit) ctx.m.logAudit('Visit Planner', `Rep added ad-hoc stop for ${acc.name} to today's route`);
    }
  },
};
