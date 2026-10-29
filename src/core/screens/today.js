// R1 Today: greeting, territory target vs achieved, opportunity, today's accounts ranked by value, overnight brief banner.

import { esc, icon, pill, bar, kpiValue, AGENT_LABEL } from '../ui.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function render(ctx) {
  const { t, fmt, data, m, industry } = ctx;
  const today = fmt.today;
  const ordered = data.planned.slice().sort((a, b) => a.rank - b.rank);
  const totalActions = ordered.reduce((s, p) => s + p.actions.length, 0);
  const pending = ordered.reduce((s, p) => s + m.counts(p.accountId).pending, 0);
  const done = ordered.filter((p) => m.visitDone(p.accountId)).length;
  const next = m.nextAccount(null);
  const kpi = industry.kpis.find((k) => k.id === data.territory.headlineKpi.id);
  const stopped = data.agents.filter((a) => m.agentStopped(a.id));
  const tr = data.territory;
  const self = m.selfStats();
  const achieved = tr.achieved + self.value;

  const rows = ordered.map((p) => {
    const a = data.byId[p.accountId];
    const c = m.counts(p.accountId);
    const isDone = m.visitDone(p.accountId);
    const status = isDone ? pill('Done', 'good')
      : c.pending === 0 ? pill('Brief reviewed', 'info')
        : pill(`${c.pending} to review`, 'warn');
    return `<li><a class="row acc-row${isDone ? ' done' : ''}" href="#/brief/${a.id}" data-account="${a.id}">
      <span class="rank">${p.rank}</span>
      <span class="row-main">
        <b>${esc(a.name)}</b>
        <small>${esc(t(a.type))} · ${esc(a.area)} · Tier ${a.tier}</small>
        <small class="row-meta">${icon('clock', 14)} ${esc(fmt.time(p.start))} · ${p.actions.length} actions · ${esc(fmt.distance(p.km))}</small>
      </span>
      <span class="row-end"><b class="money">${esc(fmt.moneyShort(p.opportunity))}</b>${status}</span>
    </a></li>`;
  }).join('');

  return `
  <section class="hello">
    <h1>${greeting()}, ${esc(data.rep.first)}</h1>
    <p class="muted">${esc(fmt.weekday(today))} ${esc(fmt.dateShort(today))} · ${esc(data.city.name)} · ${ordered.length} ${esc(t('{visits}'))} planned</p>
  </section>

  ${stopped.length ? `<div class="notice warn">${icon('stop', 18)} ${esc(stopped.map((a) => AGENT_LABEL[a.id]).join(', '))} stopped. Its items are paused in every brief.</div>` : ''}

  <a class="banner" href="#/brief/${(next || ordered[0]).accountId}" id="overnight-banner">
    <span class="banner-ic">${icon('agent', 22)}</span>
    <span><b>Overnight brief ready</b>
    <small>${esc(t(`3 agents prepared ${ordered.length} {visit} briefs: ${totalActions} ranked actions, plus a plan and {order} draft for each. ${pending} items wait for your review.`))}</small></span>
    ${icon('chevron', 18)}
  </a>

  <section class="cards2">
    <div class="card stat">
      <small>Target this month</small>
      <b class="big">${esc(fmt.moneyShort(achieved))}</b>
      <small class="muted">of ${esc(fmt.moneyShort(tr.target))} (${Math.round((achieved / tr.target) * 100)}%)</small>
      ${bar(achieved, tr.target)}
    </div>
    <div class="card stat">
      <small>Opportunity in ${esc(t('{territory}'))}</small>
      <b class="big">${esc(fmt.moneyShort(tr.opportunity))}</b>
      <small class="muted">${esc(t('Untapped potential across {n} {accounts}', { n: data.accounts.length }))}</small>
    </div>
    <div class="card stat wide">
      <small>${esc(t(kpi.label))}</small>
      <b class="big">${esc(kpiValue(kpi, tr.headlineKpi.value, fmt))}</b>
      <small class="muted">Target ${esc(kpiValue(kpi, kpi.target, fmt))} · ${done} of ${ordered.length} ${esc(t('{visits}'))} done today</small>
    </div>
  </section>

  <section>
    <div class="section-head"><h2>${esc(t("Today's {accounts}"))}</h2><small class="muted">Ranked by value at stake</small></div>
    <ol class="list">${rows}</ol>
  </section>
  <p class="foot-note">Sample data. Values are generated for this demo.</p>`;
}
