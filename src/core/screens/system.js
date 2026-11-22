// Execution system (X1 to X10): eight capabilities, the seven-stage journey, five process flows,
// two archetype days, market activation, scorecard and test plans, trust ladder and lifecycle.
// Every noun comes from vocabulary tokens or the pack's execution overlay. Sample data only.

import { esc, icon, pill } from '../ui.js';
import { upcomingEvents } from '../../data/generate.js';
import {
  CAPS, CAP_ORDER, FOUNDATION, EXECUTION, PHASES, JOURNEY, FLOWS, FLOW_ORDER, ARCHETYPES, TIERS, DATA_SOURCES, PATHS,
  RUNGS, RUNG_PLAN, TESTS, TEST_STAGES, LEARN_REASONS, learnReasonFor,
  exOf, flowPhase, flowVars, signals, conflicts, archetypeOf, readiness, cycleDays,
} from '../execution/model.js';
import { roles, DEPENDS } from '../execution/roles.js';

const TABS = [
  ['overview', 'Overview'], ['journey', 'Journey'], ['flows', 'Flows'], ['day', 'A day'],
  ['activation', 'Activation'], ['scorecard', 'Scorecard'], ['more', 'Trust and lifecycle'],
];

const DEFAULT_READY = { history: 12, master: 95, evidence: 'manual', partner: 'weekly', plan: true, geo: true, app: true };

export const actions = {
  'set-ready': ({ ctx, el }) => {
    const r = { ...DEFAULT_READY, ...(ctx.ui.ready || {}) };
    const k = el.dataset.key;
    const v = el.value;
    r[k] = ['history', 'master'].includes(k) ? Number(v) : ['plan', 'geo', 'app'].includes(k) ? v === 'yes' : v;
    ctx.ui.ready = r;
  },
  'cap-toggle': ({ ctx, data }) => { roles(ctx).toggleCap(data.cap); },
  'cap-apply': ({ ctx }) => { roles(ctx).apply(); ctx.ui.capsApplied = true; },
  'season-toggle': ({ ctx }) => { const R = roles(ctx); R.setSeason(!R.season()); },
  'flow-step': ({ ctx, data }) => {
    const R = roles(ctx);
    const step = R.flowStep(data.flow);
    if (step === 2 && data.item) {
      ctx.m.recordOutcome(data.item, { status: 'done' });
      ctx.m.setEvidence(data.item, { type: data.ev || 'note', text: 'Done from the flow walkthrough.', at: 0 });
    }
    R.stepFlow(data.flow);
  },
  'flow-reset': ({ ctx, data }) => { roles(ctx).resetFlow(data.flow); },
  'ready-preset': ({ ctx, el }) => {
    ctx.ui.ready = el.dataset.preset === 'red'
      ? { history: 0, master: 60, evidence: 'none', partner: 'none', plan: false, geo: false, app: false }
      : el.dataset.preset === 'new' ? { history: 6, master: 80, evidence: 'manual', partner: 'none', plan: false, geo: true, app: false } : { ...DEFAULT_READY };
  },
};

const capChip = (t, id, tone = '') => (id === 'manager'
  ? `<span class="pill ${tone}">${esc(t('{Manager} tools'))}</span>`
  : `<span class="pill ${tone}" data-cap="${id}">${esc(t(CAPS[id].name))}</span>`);

function tabsBar(t, tab) {
  return `<div class="seg-ctl" role="group" aria-label="Execution system sections" id="sys-tabs" style="margin-bottom:var(--s3)">${TABS.map(([id, label]) =>
    `<a class="seg ${tab === id ? 'on' : ''}" href="#/system/${id}" data-tab="${id}"${tab === id ? ' aria-current="page"' : ''} style="min-height:var(--tap);display:inline-flex;align-items:center;white-space:nowrap;flex:0 1 auto">${esc(t(label))}</a>`).join('')}</div>`;
}

const legend = (t) => `<p class="small muted" id="sys-legend">${icon('bulb', 14)} ${esc(t('Built: works here, rule-based, on sample data. Designed: the production design, not built. Proposed: for agreement before a pilot.'))}</p>`;

/** Live numbers for one capability, from today's sample territory. */
function liveStat(ctx, id) {
  const { t, data, fmt, industry } = ctx;
  const sg = signals(ctx);
  const accs = data.accounts;
  const planned = data.planned;
  const n = (f) => accs.filter(f).length;
  switch (id) {
    case 'potential': return t('{amount} white space across {n} {accounts}', { amount: fmt.moneyShort(data.territory.opportunity), n: accs.length });
    case 'tiering': return t('Tier A {a}, Tier B {b}, Tier C {c}', { a: n((a) => a.tier === 'A'), b: n((a) => a.tier === 'B'), c: n((a) => a.tier === 'C') });
    case 'diagnostics': return t('{n} gaps found on today\'s {k} {accounts}', { n: planned.reduce((s, p) => s + p.actions.filter((x) => x.agent === 'gap').length, 0), k: planned.length });
    case 'retention': return t('{h} high risk, {w} to watch', { h: n((a) => sg[a.id].risk.band === 'High'), w: n((a) => sg[a.id].risk.band === 'Watch') });
    case 'actions': return t('{n} actions ranked today, {f} fit the time budgets', { n: planned.reduce((s, p) => s + p.actions.length, 0), f: planned.reduce((s, p) => s + p.actions.filter((x) => !x.overBudget).length, 0) });
    case 'planning': return t('{n} {visits} today, {m} min of travel', { n: planned.length, m: planned.reduce((s, p) => s + (p.travelMin || 0), 0) });
    case 'order': return t('{n} suggested lines across {k} drafts', { n: planned.reduce((s, p) => s + p.order.length, 0), k: planned.length });
    case 'offers': {
      const mode = exOf(industry).offers.mode;
      if (mode === 'off') return t('Not used in this industry');
      const tgt = n((a) => ['target', 'eligible'].includes(sg[a.id].offer.decision));
      const hold = n((a) => sg[a.id].offer.decision === 'hold');
      return mode === 'limited' ? t('{n} eligible, {h} not passed on. People decide terms', { n: tgt, h: hold }) : t('{n} targeted, {h} held back', { n: tgt, h: hold });
    }
    default: return '';
  }
}

function capCard(ctx, id) {
  const { t, industry } = ctx;
  const c = CAPS[id];
  const off = id === 'offers' && exOf(industry).offers.mode === 'off';
  return `<article class="card cap-card${off ? ' cap-off' : ''}" data-cap-card="${id}">
    <div class="section-head" style="margin-bottom:0"><h3>${esc(t(c.name))}</h3>${off ? pill(t('Not used here'), 'muted') : pill(t(c.group === 'foundation' ? 'Foundation' : 'Execution'), c.group === 'foundation' ? 'info' : 'accent')}</div>
    <p class="small"><b>${esc(t(c.q))}</b> ${esc(t(c.out))}.</p>
    <p class="small" data-live="${id}">${icon('pulse', 14)} <b>${esc(liveStat(ctx, id))}</b></p>
    <ul class="bullets small muted">
      <li><b>${esc(t('Built'))}:</b> ${esc(t(off ? exOf(industry).offers.note : c.built))}</li>
      <li><b>${esc(t('Designed'))}:</b> ${esc(t(c.designed))}</li>
      <li><b>${esc(t('Without it'))}:</b> ${esc(t(c.without))}</li>
    </ul>
  </article>`;
}

function overview(ctx) {
  const { t, data, industry } = ctx;
  const all = data.planned.map((p) => ({ p, c: conflicts(ctx, p.accountId) }));
  const nConf = all.reduce((s, x) => s + x.c.length, 0);
  const examples = all.filter((x) => x.c.length).slice(0, 3).map(({ p, c }) => {
    const a = data.byId[p.accountId];
    const k = c[0];
    return `<li class="conflict-row"><a class="tap-link" href="#/brief/${a.id}"><b>${esc(a.name)}</b></a><div class="cap-chips">${capChip(t, k.between[0])}<span aria-hidden="true">vs</span>${capChip(t, k.between[1])}</div>
      <span class="small muted">${esc(t(k.saw, k.v))}</span> <span class="small"><b>${esc(t('Resolved'))}:</b> ${esc(t(k.resolved, k.v))}</span></li>`;
  }).join('');
  const s = ctx.m.selfStats();
  const tally = {};
  for (const p of data.planned) for (const x of p.brief) {
    const d = ctx.m.decision(x.id);
    const o = ctx.m.outcome(x.id);
    const label = d?.status === 'overridden' ? d.reason : o?.status === 'not_done' ? o.reason : null;
    if (label) { const r = learnReasonFor(label); tally[r.id] = (tally[r.id] || 0) + 1; }
  }
  const why = LEARN_REASONS.map((r) => `<li data-reason="${r.id}"><b>${esc(t(r.label))}</b>${tally[r.id] ? ` ${pill(t('{n} this session', { n: tally[r.id] }), 'accent')}` : ''} <span class="muted">${esc(t('teaches'))}</span> ${r.learns.filter((c) => !(c === 'offers' && exOf(industry).offers.mode === 'off')).map((c) => capChip(t, c)).join(' ')}</li>`).join('');
  return `
  <section class="card" id="sys-loop">
    <div class="section-head"><h2>${esc(t('One loop, eight capabilities'))}</h2>${pill(t('Built'), 'good')}</div>
    <p class="small">${esc(t('Four foundation capabilities build the picture of each {account}. Four execution capabilities act on it. Every {visit} feeds back, so the next one is better.'))}</p>
    <div class="phase-strip" role="list">${Object.entries(PHASES).map(([k, ph]) => `<span role="listitem" class="phase ${ph.tone}">${esc(t(ph.name))}</span>`).join('<span aria-hidden="true">›</span>')}</div>
  </section>
  ${legend(t)}
  <h2 class="sys-h2">${esc(t('Foundation'))} <small class="muted">${esc(t('Seen by the {manager}, not by {reps}'))}</small></h2>
  ${FOUNDATION.map((id) => capCard(ctx, id)).join('')}
  <h2 class="sys-h2">${esc(t('Execution'))} <small class="muted">${esc(t('What the {rep} sees on each {visit}'))}</small></h2>
  ${EXECUTION.map((id) => capCard(ctx, id)).join('')}
  <section class="card" id="sys-collab">
    <div class="section-head"><h2>${esc(t('Collaboration layer'))}</h2>${pill(t('Built'), 'good')}</div>
    <p class="small">${esc(t('Models make the decisions. Agents connect them: the orchestrator calls every capability, resolves conflicts and gives the {rep} one ranked plan, not eight screens.'))}</p>
    <p class="small"><b>${esc(t('{n} conflicts resolved in today\'s {k} briefs', { n: nConf, k: data.planned.length }))}</b></p>
    ${examples ? `<ul class="conflict-list">${examples}</ul>` : `<p class="small muted">${esc(t('No conflicts today. Every capability agreed.'))}</p>`}
    <p class="small muted">${esc(t('Adding a ninth capability adds one interface to the orchestrator, not eight new hand-offs.'))}</p>
  </section>
  <section class="card" id="sys-learn">
    <div class="section-head"><h2>${esc(t('Learning loop'))}</h2>${pill(t('Built'), 'good')}</div>
    <div class="phase-strip small">${['Suggestion', 'Done or not', 'Outcome', 'Why', 'Model update'].map((x) => `<span class="phase">${esc(t(x))}</span>`).join('<span aria-hidden="true">›</span>')}</div>
    <p class="small">${esc(t('Every "not done" and every override carries a structured reason. Each reason teaches a named capability, so the loop improves the model, not only a dashboard.'))}</p>
    <ul class="bullets small" id="learn-reasons">${why}</ul>
    <p class="small"><b>${esc(t('This session'))}:</b> ${esc(t('{o} overrides with a reason, {d} actions recorded done. See the Scorecard tab.', { o: s.overrides, d: s.actionsDone }))}</p>
  </section>
  <p class="foot-note">${esc(t('Capability names are generic. Rule-based prototype on sample data. {industry} wording comes from the pack.', { industry: industry.name }))}</p>`;
}

function journey(ctx) {
  const { t, industry } = ctx;
  const segs = (arch) => industry.segments.filter((s) => archetypeOf(industry, s.id) === arch).map((s) => t(s.name)).join(', ') || t('None in this pack');
  return `
  <section class="card"><p class="small">${esc(t('Seven stages across plan, act, execute and learn. Each stage has one lead capability. The process is owned by sales operations.'))}</p>
    <div class="facts"><div><small>${esc(t(ARCHETYPES.consultative.name))}</small><b class="small">${esc(segs('consultative'))}</b></div><div><small>${esc(t(ARCHETYPES.orderLed.name))}</small><b class="small">${esc(segs('orderLed'))}</b></div></div>
  </section>
  ${JOURNEY.map((s) => {
    const support = s.support.filter((c) => !(c === 'offers' && exOf(industry).offers.mode === 'off'));
    return `<article class="card stage" data-stage="${s.n}">
      <div class="section-head" style="margin-bottom:0"><h3><span class="num">${s.n}</span> ${esc(t(s.name))}</h3><span class="phase ${PHASES[s.phase].tone}">${esc(t(PHASES[s.phase].name))}</span></div>
      <p class="small">${esc(t(s.does))}.</p>
      <div class="cap-chips"><small class="muted">${esc(t('Lead'))}</small> ${capChip(t, s.lead, 'accent')} <small class="muted">${esc(t('Supports'))}</small> ${support.map((c) => capChip(t, c)).join(' ')}</div>
      <ul class="bullets small"><li><b>${esc(t(ARCHETYPES.consultative.name))}:</b> ${esc(t(s.consultative))}</li><li><b>${esc(t(ARCHETYPES.orderLed.name))}:</b> ${esc(t(s.orderLed))}</li></ul>
    </article>`;
  }).join('')}`;
}

const FLOW_ARCH = {
  visibility: ['Space is agreed with the {account} group by the {kam}. The agent picks which {accounts}, when and what. It does not replace the negotiation.', 'The {rep} does it and takes the extra {order}. Benchmarks come from the tier.'],
  range: ['The agreement sets the frame. The {kam} owns the {account} group.', 'The {rep} owns the relationship. Frequency is set by tier.'],
  relationship: ['Allowed actions follow each agreement. Blockers go to the {kam}.', 'Contact between {visits} keeps the relationship. Frequency is set by tier.'],
  standard: ['Measured in detail, with photo evidence where it exists.', 'Must-have range and minimum presence. A manual check works.'],
  price: ['Compliance with the agreed terms. Gaps go to the {kam}.', 'Where the resale price is the {account}\'s decision, the {rep} only advises.'],
};

/** Flows in action: run the flow on the example action, one phase at a time. Execute marks it done in the app. */
function flowRun(ctx, flowId, x) {
  const { t, industry } = ctx;
  const R = roles(ctx);
  const step = R.flowStep(flowId);
  const names = Object.keys(PHASES);
  const done = ctx.m.outcome(x.id)?.status === 'done';
  const vars = flowVars(industry, flowId);
  const ev = Object.entries({ photo: 'photo', signature: 'signature', note: 'note', scan: 'scan' }).find(([, v]) => v === vars.evidence)?.[0] || 'note';
  const shown = names.slice(0, step).map((ph) => {
    const P = flowPhase(industry, flowId, ph);
    const line = ph === 'execute' ? t('Marked done with {ev} evidence. The {manager} and Account 360 see it now.', { ev: vars.evidence }) : ph === 'learn' ? t('Outcome logged. Action Ranking and Gap Diagnostics update tonight.') : t(P.out, vars);
    return `<li data-ran="${ph}"><span class="phase ${PHASES[ph].tone}">${esc(t(PHASES[ph].name))}</span> <span class="small">${esc(line)}</span></li>`;
  }).join('');
  const nextName = names[step];
  const label = step === 0 ? t('Run this flow') : step === 2 ? (done ? t('Next: {ph}', { ph: t(PHASES.execute.name) }) : t('Do it and add evidence')) : nextName ? t('Next: {ph}', { ph: t(PHASES[nextName].name) }) : '';
  return `<div class="flow-run" id="flow-run" data-step="${step}">
    ${shown ? `<ol class="bullets small flow-ran">${shown}</ol>` : ''}
    ${step < 4 ? `<button class="btn ${step === 2 ? 'primary' : 'secondary'} sm" data-act="flow-step" data-flow="${flowId}"${step === 2 && !done ? ` data-item="${x.id}" data-ev="${ev}"` : ''} id="flow-step" style="min-height:var(--tap)">${esc(label)}</button>` : `<button class="btn text sm" data-act="flow-reset" data-flow="${flowId}" style="min-height:var(--tap)">${esc(t('Run again'))}</button>`}
  </div>`;
}

function flowExample(ctx, flowId) {
  const { t, data, fmt, industry } = ctx;
  const ids = exOf(industry).flows[flowId].actions;
  for (const p of data.planned) {
    const x = p.actions.find((a) => ids.includes(a.defId));
    if (!x) continue;
    const a = data.byId[p.accountId];
    const sg = signals(ctx)[a.id];
    return `<div class="flow-example" id="flow-example">
      <p class="small"><b>${esc(t('Live example from today\'s plan'))}</b></p>
      <p class="small"><a href="#/account/${a.id}"><b>${esc(a.name)}</b></a> · ${esc(t(a.segment))} · ${esc(t('Tier {tier}', { tier: a.tier }))} · ${esc(t('Retention risk {band}', { band: t(sg.risk.band) }))}</p>
      <p class="small"><b>${esc(t(x.title, x.vars))}</b></p>
      <p class="small muted">${esc(t('{amount} · {m} min · rank {r} in the brief', { amount: fmt.money(x.value), m: x.effort, r: x.rank }))}${x.overBudget ? ` · ${esc(t('outside the time budget, moved to the next {visit}'))}` : ''}</p>
      <div class="cap-chips"><a class="btn secondary sm" href="#/action/${x.id}">${esc(t('Open the action'))} ${icon('chevron', 14)}</a><a class="btn secondary sm" href="#/brief/${a.id}">${esc(t('Open the brief'))} ${icon('chevron', 14)}</a></div>
      ${flowRun(ctx, flowId, x)}
    </div>`;
  }
  const def = industry.actions.find((d) => ids.includes(d.id));
  return `<p class="small muted" id="flow-example">${esc(t('No {account} on today\'s plan has this gap. In this pack it shows up as "{type}".', { type: def ? t(def.type) : '' }))}</p>`;
}

function flows(ctx, arg) {
  const { t, industry } = ctx;
  const ex = exOf(industry);
  const id = FLOW_ORDER.includes(arg) ? arg : FLOW_ORDER[0];
  const f = ex.flows[id];
  const vars = flowVars(industry, id);
  const picker = `<div class="seg-ctl" role="group" aria-label="${esc(t('Process flows'))}" id="flow-picker" style="margin-bottom:var(--s3)">${FLOW_ORDER.map((k) =>
    `<a class="seg ${k === id ? 'on' : ''}" href="#/system/flows/${k}" data-flow="${k}" style="min-height:var(--tap);display:inline-flex;align-items:center;flex:0 1 auto">${esc(t(ex.flows[k].name))}</a>`).join('')}</div>`;
  const phases = Object.keys(PHASES).map((ph) => {
    const P = flowPhase(industry, id, ph);
    return `<article class="card flow-phase" data-phase="${ph}">
      <div class="section-head" style="margin-bottom:0"><span class="phase ${PHASES[ph].tone}">${esc(t(PHASES[ph].name))}</span><div class="cap-chips">${P.lead.map((c) => capChip(t, c, 'accent')).join(' ')}${P.support.length ? ' ' + P.support.map((c) => capChip(t, c)).join(' ') : ''}</div></div>
      <ul class="bullets small">${P.lines.map((l) => `<li>${esc(t(l, vars))}</li>`).join('')}</ul>
      <p class="small muted"><b>${esc(t('Output'))}:</b> ${esc(t(P.out, vars))}</p>
    </article>`;
  }).join('');
  return `${picker}
  <section class="card" id="flow-head" data-flow-id="${id}">
    <div class="section-head" style="margin-bottom:0"><h2>${esc(t(f.name))}</h2>${pill(t(FLOWS[id].generic), 'muted')}</div>
    <p class="small"><b>${esc(t(f.goal))}.</b></p>
    ${id === 'standard' ? `<p class="small muted">${esc(t('What good looks like is set by {owner}.', { owner: vars.owner.replace(/^The /, 'the ') }))}</p>` : ''}
    ${flowExample(ctx, id)}
  </section>
  ${phases}
  <section class="card" id="flow-arch">
    <h3>${esc(t('By visit type'))}</h3>
    <ul class="bullets small"><li><b>${esc(t(ARCHETYPES.consultative.name))}:</b> ${esc(t(FLOW_ARCH[id][0]))}</li><li><b>${esc(t(ARCHETYPES.orderLed.name))}:</b> ${esc(t(FLOW_ARCH[id][1]))}</li></ul>
    <h3>${esc(t('Measures'))}</h3>
    <div class="cap-chips">${f.kpis.map((k) => pill(t(k))).join(' ')}</div>
    <p class="small muted">${esc(t('Measures are tracked against a control in a pilot. No results are claimed.'))}</p>
  </section>`;
}

function day(ctx, arg) {
  const { t, data, fmt, industry } = ctx;
  const ex = exOf(industry);
  const arch = arg === 'orderLed' ? 'orderLed' : 'consultative';
  const sg = signals(ctx);
  const inArch = (id) => archetypeOf(industry, data.byId[id].segmentId) === arch;
  const plan = data.planned.filter((p) => inArch(p.accountId)).sort((a, b) => a.start - b.start);
  const picker = `<div class="seg-ctl" role="group" aria-label="${esc(t('Visit type'))}" id="day-picker" style="margin-bottom:var(--s3)">${Object.entries(ARCHETYPES).map(([k, A]) =>
    `<a class="seg ${k === arch ? 'on' : ''}" href="#/system/day/${k}" data-arch="${k}" style="min-height:var(--tap);display:inline-flex;align-items:center;flex:0 1 auto">${esc(t(A.name))}</a>`).join('')}</div>`;
  const segNames = industry.segments.filter((s) => archetypeOf(industry, s.id) === arch).map((s) => t(s.name)).join(', ');
  const head = `<section class="card" id="day-head" data-arch="${arch}"><h2>${esc(t(ARCHETYPES[arch].line))}</h2>
    <p class="small">${esc(t('A day for {name} with {segs}.', { name: data.rep.name, segs: segNames.toLowerCase() }))}</p>
    <p class="small muted">${icon('bulb', 14)} ${esc(t('Illustrative day on sample data. Target-state design, not a measured result.'))}</p></section>`;
  if (!plan.length) {
    return `${picker}${head}<section class="card"><p class="small">${esc(t('None of today\'s {visits} are of this type. Switch the type above, or open Today.'))}</p><a class="btn secondary sm" href="#/today">${esc(t('Open Today'))}</a></section>`;
  }
  const first = plan[0];
  const fa = data.byId[first.accountId];
  const fits = first.actions.filter((x) => !x.overBudget);
  const gaps = plan.reduce((s, p) => s + p.actions.filter((x) => x.agent === 'gap').length, 0);
  const ranked = plan.reduce((s, p) => s + p.actions.length, 0);
  const fitN = plan.reduce((s, p) => s + p.actions.filter((x) => !x.overBudget).length, 0);
  const lines = plan.reduce((s, p) => s + p.order.length, 0);
  const atRisk = data.accounts.filter((a) => archetypeOf(industry, a.segmentId) === arch && sg[a.id].risk.band === 'High').length;
  const plannedIds = new Set(data.planned.map((p) => p.accountId));
  const pull = data.accounts.filter((a) => archetypeOf(industry, a.segmentId) === arch && !plannedIds.has(a.id)).sort((a, b) => (b.lastVisitDays - cycleDays(b.tier)) - (a.lastVisitDays - cycleDays(a.tier)) || b.score - a.score)[0];
  const drop = plan[plan.length - 1];
  const offerN = plan.filter((p) => sg[p.accountId].offer.decision === 'target').length;
  const step = (time, title, body, caps) => `<li class="day-step"><span class="day-time">${esc(time)}</span><div><b>${esc(t(title))}</b><ul class="bullets small">${body.map((b) => `<li>${b}</li>`).join('')}</ul>${caps ? `<div class="cap-chips">${caps.map((c) => capChip(t, c)).join(' ')}</div>` : ''}</div></li>`;
  const L = (s, v) => esc(t(s, v));
  const steps = [
    step(t('Before'), 'The cycle', [
      L('Tier sets the cadence: A every {a} days, B every {b}, C every {c}.', { a: cycleDays('A'), b: cycleDays('B'), c: cycleDays('C') }),
      L('Retention Risk flags {n} high-risk {accounts} of this type for attention first.', { n: atRisk }),
      arch === 'orderLed' && ex.partner ? L('Visit Planning proposes the route. The {partner} confirms it.', { partner: ex.partner }) : L('Visit Planning plans {visits} inside each agreement.'),
    ], ['tiering', 'retention', 'planning']),
    step(t('Overnight'), 'Agents prepare', [
      L('Gap Diagnostics found {n} gaps across {k} {accounts}.', { n: gaps, k: plan.length }),
      L('Action Ranking ranked {n} actions. {f} fit the time budgets.', { n: ranked, f: fitN }),
      L('{Order} Suggestion drafted {n} lines.', { n: lines }),
      ex.offers.mode === 'on' ? L('Offer Targeting targeted {n} of them and held back the rest.', { n: offerN }) : L(ex.offers.mode === 'off' ? 'No offers are targeted in this industry.' : 'Offer Targeting listed eligible {accounts} for people to decide.'),
    ], ['diagnostics', 'actions', 'order', ...(ex.offers.mode === 'off' ? [] : ['offers'])]),
    step(fmt.time(first.start), t('First {visit}: {name}', { name: fa.name }), [
      L('{m} min budget. {f} of {n} actions fit:', { m: fa.visitMinutes, f: fits.length, n: first.actions.length }),
      ...fits.slice(0, 3).map((x) => `${esc(t(x.title, x.vars))} <span class="muted">(${esc(t('{m} min', { m: x.effort }))})</span>`),
      arch === 'orderLed' ? L('The {order} draft is pre-filled with {n} lines and adjusted with the {contact}.', { n: first.order.length }) : L('Evidence is captured for each action before leaving.'),
      `<a class="tap-link" href="#/brief/${fa.id}">${L('Open this brief')}</a>`,
    ], ['actions', 'order']),
    step(t('Midday'), 'Re-plan', [
      L('If {name} is closed, Visit Planning drops it from the route.', { name: data.byId[drop.accountId].name }),
      pull ? L('It pulls forward {name}, Tier {tier}: last {visit} {d} days ago, due every {c}.', { name: pull.name, tier: pull.tier, d: pull.lastVisitDays, c: cycleDays(pull.tier) }) : L('It re-orders the remaining stops.'),
      arch === 'consultative' ? L('A refused item is captured with its reason and routed to the {kam}.') : L('A new {account} seen on the way is added for the next cycle.'),
      `<a class="tap-link" href="#/route">${L('Try it on the route')}</a>`,
    ], ['planning', 'potential']),
    step(t('After the day'), 'What learns', [
      L('Action Ranking updates its results by action type.'),
      L('Gap Diagnostics marks gaps closed, pending or blocked.'),
      L('Visit Planning learns real {visit} durations.'),
      arch === 'orderLed' && ex.partner ? L('{Orders} sync to the {partner}. Accepted and edited lines retrain {Order} Suggestion.', { partner: ex.partner }) : L('The {manager} sees compliance and blockers, not a leaderboard.'),
    ], ['actions', 'diagnostics', 'planning', 'order']),
  ].join('');
  const diff = arch === 'consultative'
    ? ['Visit Planning allocates time inside each agreement, not distance.', 'Action Ranking fills the time with the highest value actions.', 'Blocked items go to the {kam}, who owns the {account} group.']
    : [ex.partner ? 'The {order} is the {visit}, so {Order} Suggestion leads and Action Ranking adds one or two actions.' : 'The {order} is the {visit}, so {Order} Suggestion leads and Action Ranking adds one or two actions.', ex.partner ? 'The {rep} may work through the {partner}\'s own app.' : 'Short {visits}: one or two actions that fit.', ex.partner ? 'The hard part is the {partner}: data access and incentives.' : 'The hard part is keeping {visits} short and useful.'];
  return `${picker}${head}<ol class="day-steps">${steps}</ol>
  <section class="card" id="day-diff"><h3>${esc(t('What is different here'))}</h3><ul class="bullets small">${diff.map((d) => `<li>${esc(t(d, { partner: ex.partner || '' }))}</li>`).join('')}</ul></section>`;
}

function activation(ctx) {
  const { t, ui } = ctx;
  const ans = { ...DEFAULT_READY, ...(ui.ready || {}) };
  const R = readiness(ans);
  const sel = (key, label, opts) => `<label class="ready-row"><span class="small">${esc(t(label))}</span><select data-change="set-ready" data-key="${key}" id="ready-${key}" style="min-height:var(--tap)">${opts.map(([v, l]) => `<option value="${v}"${String(ans[key] === true ? 'yes' : ans[key] === false ? 'no' : ans[key]) === String(v) ? ' selected' : ''}>${esc(t(l))}</option>`).join('')}</select></label>`;
  const yesNo = [['yes', 'Yes'], ['no', 'No']];
  const offOff = exOf(ctx.industry).offers.mode === 'off';
  const tiers = TIERS.map((T) => `<article class="card tier-card${R.tier >= T.n ? ' on' : ''}" data-tier="${T.n}">
    <div class="section-head" style="margin-bottom:0"><h3>${esc(t('Tier {n}: {name}', { n: T.n, name: T.name }))}</h3>${R.tier >= T.n ? pill(t('Ready'), 'good') : pill(t('Not yet'), 'muted')}</div>
    <p class="small muted">${esc(t(T.when))}. ${esc(t(T.who))}.</p>
    <div class="cap-chips"><small class="muted">${esc(t(T.n === 1 ? 'Switches on' : 'Adds'))}</small> ${T.caps.filter((c) => !(c === 'offers' && offOff)).map((c) => capChip(t, c, 'accent')).join(' ')}</div>
    <ul class="bullets small"><li><b>${esc(t('Outcome'))}:</b> ${esc(t(T.outcome))}</li><li><b>${esc(t('Data'))}:</b> ${esc(t(T.data))}</li><li><b>${esc(t('Systems'))}:</b> ${esc(t(T.infra))}</li><li><b>${esc(t('To move up'))}:</b> ${esc(t(T.advance))}</li></ul>
  </article>`).join('');
  const rows = CAP_ORDER.map((c) => (c === 'offers' && offOff ? `<tr data-ready-cap="${c}"><td>${esc(t(CAPS[c].name))}</td><td>${pill(t('Not used'), 'muted')}</td><td class="small">${esc(t('Not used in this industry'))}</td></tr>` : `<tr data-ready-cap="${c}"><td>${esc(t(CAPS[c].name))}</td><td>${R.capReady[c].ready ? pill(t('Ready'), 'good') : pill(t('Missing'), 'warn')}</td><td class="small">${esc(R.capReady[c].missing.map((k) => t(DATA_SOURCES.find(([id]) => id === k)[1])).join(', ') || t(CAPS[c].minData))}</td></tr>`)).join('');
  return `
  <section class="card" id="ready-form">
    <div class="section-head"><h2>${esc(t('Data readiness check'))}</h2>${pill(t('Built'), 'good')}</div>
    <p class="small">${esc(t('Step zero before any market goes live. Answer for the market, and the recommended tier updates.'))}</p>
    <div class="cap-chips"><button class="btn secondary sm" data-act="ready-preset" data-preset="full" style="min-height:var(--tap)">${esc(t('Mature market'))}</button><button class="btn secondary sm" data-act="ready-preset" data-preset="new" style="min-height:var(--tap)">${esc(t('New market'))}</button><button class="btn secondary sm" data-act="ready-preset" data-preset="red" style="min-height:var(--tap)">${esc(t('Poor data'))}</button></div>
    ${sel('history', 'Sales history', [[0, 'Under 3 months'], [3, '3 to 5 months'], [6, '6 to 11 months'], [12, '12 months or more']])}
    ${sel('master', '{Account} master coverage', [[60, 'Under 70%'], [80, '70% to 89%'], [95, '90% or more']])}
    ${sel('evidence', 'Evidence or audits', [['none', 'None'], ['manual', 'Manual audits or photos'], ['auto', 'Automated photo recognition']])}
    ${sel('partner', 'Partner invoices', [['none', 'None'], ['weekly', 'Weekly'], ['daily', 'Daily']])}
    ${sel('plan', 'Approved offer plan', yesNo)}
    ${sel('geo', 'Location for every {account}', yesNo)}
    ${sel('app', 'Field app live', yesNo)}
  </section>
  ${R.red ? `<div class="notice warn" id="red-zone" role="alert">${icon('shield', 18)}<span><b>${esc(t('Red zone: pause.'))}</b> ${esc(t('{Account} master under 70%, under 3 months of sales and no evidence. Going live on poor data loses field trust, and that is harder to win back than a delay.'))}</span></div>` : ''}
  <section class="card" id="ready-result" data-tier="${R.tier}">
    <div class="section-head"><h2>${esc(R.tier ? t('Recommended: Tier {n}, {name}', { n: R.tier, name: TIERS[R.tier - 1].name }) : t('Recommended: not ready yet'))}</h2></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('Capability'))}</th><th>${esc(t('Status'))}</th><th>${esc(t('Missing, or minimum data'))}</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${!R.fieldApp ? `<p class="small muted">${esc(t('Tier 3 and above need a live field app: suggestions go to {reps} through it.'))}</p>` : ''}
  </section>
  ${capSwitches(ctx)}
  <h2 class="sys-h2">${esc(t('Activation tiers'))} <small class="muted">${esc(t('Activate by need, not all at once'))}</small></h2>
  ${tiers}
  <section class="card" id="alt-paths"><h3>${esc(t('Other supported paths'))}</h3><ul class="bullets small">${PATHS.map((p) => `<li>${esc(t(p))}</li>`).join('')}</ul>
    <p class="small muted">${esc(t('Foundation always comes first. Consultative markets usually add Action Ranking, then Visit Planning, then offers and {orders}. Order-led markets often start with {Order} Suggestion.'))}</p></section>`;
}

function capSwitches(ctx) {
  const { t, industry } = ctx;
  const R = roles(ctx);
  const canAct = ctx.persona === 'admin';
  const pend = R.pending();
  const brk = R.broken(pend);
  const applied = R.off();
  const changed = JSON.stringify([...pend].sort()) !== JSON.stringify([...applied].sort());
  const offOff = exOf(industry).offers.mode === 'off';
  const rows = CAP_ORDER.filter((c) => !(c === 'offers' && offOff)).map((c) => {
    const on = !pend.includes(c);
    return `<li class="watch-row" data-switch="${c}"><div class="row-main"><b>${esc(t(CAPS[c].name))}</b><small>${esc(DEPENDS[c].length ? t('Needs {list}', { list: DEPENDS[c].map((d) => t(CAPS[d].name)).join(', ') }) : t('No dependency'))}${brk.includes(c) ? ` · <span class="bad-text">${esc(t('Will switch off: a capability it needs is off'))}</span>` : ''}</small></div>
      <button class="btn ${on ? 'secondary' : 'primary'} sm" data-act="cap-toggle" data-cap="${c}" aria-pressed="${on}"${canAct ? '' : ' disabled'} style="min-height:var(--tap)">${esc(on ? t('On') : t('Off'))}</button></li>`;
  }).join('');
  return `<section class="card" id="cap-switches"><div class="section-head"><h2>${esc(t('Capabilities in this market'))}</h2>${applied.length ? pill(t('{n} off', { n: applied.length }), 'warn') : pill(t('All on'), 'good')}</div>
    <p class="small">${esc(t('Switch by need. Apply removes switched-off capabilities from every {rep}\'s brief and tells the field why.'))}</p>
    <ul class="watch-list">${rows}</ul>
    ${canAct ? `<button class="btn primary block" data-act="cap-apply" id="cap-apply"${changed ? '' : ' disabled'} style="min-height:var(--tap)">${esc(t('Apply to the field'))}</button>` : `<p class="small muted">${esc(t('Only sales ops can change this.'))}</p>`}
    ${ctx.ui.capsApplied && !changed ? `<p class="small good-text" id="caps-applied">${esc(applied.length ? t('Applied. Briefs now leave out {list}.', { list: applied.map((c) => t(CAPS[c].name)).join(', ') }) : t('Applied. All capabilities on.'))}</p>` : ''}
  </section>`;
}

function scorecard(ctx) {
  const { t, data, m } = ctx;
  const items = data.planned.flatMap((p) => p.brief);
  const byCap = { actions: items.filter((x) => x.kind === 'action'), planning: items.filter((x) => x.kind === 'plan'), order: items.filter((x) => x.kind === 'order') };
  const decided = (list) => list.filter((x) => m.decision(x.id)).length;
  const overridden = (list) => list.filter((x) => m.decision(x.id)?.status === 'overridden').length;
  const done = byCap.actions.filter((x) => m.outcome(x.id)?.status === 'done');
  const withEv = done.filter((x) => m.outcome(x.id)?.evidence);
  const submitted = data.planned.filter((p) => m.orderState(p.accountId)?.submitted).length;
  const adoption = {
    actions: t('{d} of {n} decided, {o} overridden with a reason', { d: decided(byCap.actions), n: byCap.actions.length, o: overridden(byCap.actions) }),
    planning: t('{d} of {n} {visit} plans confirmed', { d: decided(byCap.planning), n: byCap.planning.length }),
    order: t('{d} of {n} drafts decided', { d: decided(byCap.order), n: byCap.order.length }),
  };
  const execution = {
    actions: t('{d} done, {e} with evidence', { d: done.length, e: withEv.length }),
    planning: t('{d} of {n} {visits} completed', { d: data.planned.filter((p) => m.visitDone(p.accountId)).length, n: data.planned.length }),
    order: t('{s} {orders} sent', { s: submitted }),
  };
  const rows = CAP_ORDER.map((c) => {
    const found = CAPS[c].group === 'foundation';
    const a = adoption[c] || t(found ? 'Measured as {manager} use in a pilot' : 'Measured as {rep} use in a pilot');
    const e = execution[c] || t('Measured in a pilot');
    return `<tr data-score-cap="${c}"><td><b>${esc(t(CAPS[c].name))}</b></td><td class="small">${esc(a)}</td><td class="small">${esc(e)}</td><td class="small muted">${esc(t('Against control in a pilot. No result yet'))}</td></tr>`;
  }).join('');
  const tests = CAP_ORDER.map((c) => `<tr data-test-cap="${c}"><td><b>${esc(t(CAPS[c].name))}</b></td><td class="small">${esc(t(TESTS[c].unit))}</td><td class="small">${esc(t(TESTS[c].measure))}</td><td class="small">${esc(t(TESTS[c].guard))}</td></tr>`).join('');
  return `
  <section class="card" id="scorecard">
    <div class="section-head"><h2>${esc(t('Adoption, execution, value'))}</h2>${pill(t('Built'), 'good')}</div>
    <p class="small">${esc(t('Three views for every capability, reported separately and never added into one score. Numbers in the first two columns come from this demo session.'))}</p>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('Capability'))}</th><th>${esc(t('Adoption: is it used?'))}</th><th>${esc(t('Execution: does the {visit} change?'))}</th><th>${esc(t('Value: does it show in results?'))}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <ul class="bullets small"><li>${esc(t('Low adoption: check trust, training and fit.'))}</li><li>${esc(t('Adoption up, execution flat: the suggestions may not be doable in the {account}.'))}</li><li>${esc(t('Execution up, value flat: check the lever or the measurement.'))}</li></ul>
    <p class="small"><b>${esc(t('Adoption data is never used to rank or police {reps}.'))}</b> ${esc(t('{Reps} see their own loop. The {manager} sees team views monthly.'))}</p>
  </section>
  <section class="card" id="test-plans">
    <div class="section-head"><h2>${esc(t('How each capability is tested'))}</h2>${pill(t('Proposed'), 'info')}</div>
    <p class="small">${esc(t('Each design is agreed with finance before a pilot starts. No results exist yet.'))}</p>
    <div class="phase-strip small">${TEST_STAGES.map(([n]) => `<span class="phase">${esc(t(n))}</span>`).join('<span aria-hidden="true">›</span>')}</div>
    <ul class="bullets small">${TEST_STAGES.map(([n, d]) => `<li><b>${esc(t(n))}:</b> ${esc(t(d))}</li>`).join('')}</ul>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('Capability'))}</th><th>${esc(t('Unit and control'))}</th><th>${esc(t('Main measure'))}</th><th>${esc(t('Guardrail'))}</th></tr></thead><tbody>${tests}</tbody></table></div>
    <p class="small muted">${esc(t('Randomize where results cannot spill over: no shared {reps} or routes. Set the length, group size and the go, fix or stop rule before the start. Never claim a result from a before-and-after view alone.'))}</p>
  </section>`;
}

function more(ctx) {
  const { t, industry, country, data, fmt } = ctx;
  const ex = exOf(industry);
  const humanOnly = industry.guardrails.filter((g) => /\b(prices?|pricing|credit|contracts?|rates?|clinical|dose|dosage|diagnosis|terms|advice|claims?|discounts?)\b/i.test(g.text)).slice(0, 3);
  const ladder = RUNGS.map((r) => `<li class="rung" data-rung="${r.n}"><b>${esc(t('Rung {n}: {name}', { n: r.n, name: r.name }))}</b><span class="small">${esc(t(r.does))}</span><span class="small muted">${esc(t('Evidence to move up'))}: ${esc(t(r.evidence))}</span></li>`).join('');
  const rungRows = CAP_ORDER.filter((c) => !(c === 'offers' && ex.offers.mode === 'off')).map((c) => `<tr><td>${esc(t(CAPS[c].name))}</td><td class="small">${esc(t('Rung {n}', { n: RUNG_PLAN[c][0] }))}</td><td class="small">${esc(t('Up to rung {n}', { n: RUNG_PLAN[c][1] }))}</td></tr>`).join('');
  const today = fmt.today instanceof Date ? fmt.today : new Date();
  const events = upcomingEvents(country, today).slice(0, 2);
  const seasonRows = [
    ...events.map((e) => [t('{name} in {d} days', { name: e.name, d: e.days }), 'Raise the ceiling for the event', 'Shift the must-have range to event {offerings}', 'Hold risk signals in event weeks', 'Event actions rank first', 'More frequent {visits} before it', 'Add event quantities', ex.offers.mode === 'on' ? 'Target the approved event offer' : 'Not used']),
    [t('New {offering} launch'), 'Add the new {offering} to potential', 'Track distribution build', 'No change', 'Launch actions rank first', 'Priority {accounts} first', 'Add a launch quantity', ex.offers.mode === 'on' ? 'Target the launch offer' : 'Not used'],
    [t('Price change'), 'Re-score after the change', 'Check the new price reached the {account}', 'Watch for a spike in risk', 'Explain the new price; never set it', 'Key {accounts} first', 'Adjust quantities', ex.offers.mode === 'on' ? 'Re-check offer tiers' : 'Not used'],
  ];
  const seasonHead = ['potential', 'diagnostics', 'retention', 'actions', 'planning', 'order', 'offers'];
  const life = [
    ['Found', 'A new {account} is found by the {rep}, a partner or a data source. Location checked, duplicates removed.'],
    ['Scored', 'Account Potential uses location and similar {accounts}. Account Tiering sets a provisional tier from the cluster average.'],
    ['Diagnosed', 'Gap Diagnostics starts from {accounts} of the same tier nearby. No history is needed.'],
    ['First {visit}', 'Visit Planning adds it to the next cycle. Action Ranking gives two or three starter actions. {Order} Suggestion pre-fills a first {order}.'],
    ['First feedback', 'Actual against expected is captured. Every capability updates.'],
    ['Full loop', ex.offers.mode === 'off' ? 'After three to five {visits}, the full set runs. Retention Risk starts watching.' : 'After three to five {visits}, the full set runs. Retention Risk starts watching. Offers become possible once a pattern exists.'],
  ];
  const partner = ex.partner ? `
  <section class="card" id="partner-models"><div class="section-head"><h2>${esc(t('Working with the {partner}', { partner: ex.partner }))}</h2>${pill(t('Designed'), 'info')}</div>
    <p class="small">${esc(t('In order-led {visits} the {partner} is the last step. Suggestions only create value if the {partner} acts on them.', { partner: ex.partner }))}</p>
    <div class="facts"><div><small>${esc(t('We give'))}</small><span class="small">${esc(t('Pre-built {orders}, routes, {account} priorities, actions, offer targets, gap lists'))}</span></div><div><small>${esc(t('We need back'))}</small><span class="small">${esc(t('Invoices by {account} and {offering}, delivery confirmations, stock, returns, {visit} logs'))}</span></div></div>
    <ul class="bullets small">
      <li><b>${esc(t('Direct link'))}:</b> ${esc(t('Real time, for large partners. The best option.'))}</li>
      <li><b>${esc(t('Plug-in'))}:</b> ${esc(t('A small module inside the {partner}\'s own system.', { partner: ex.partner }))}</li>
      <li><b>${esc(t('Shared app'))}:</b> ${esc(t('For partners without their own system. Higher adoption risk.'))}</li>
      <li><b>${esc(t('File bridge'))}:</b> ${esc(t('Spreadsheet exchange. A week behind. Temporary only.'))}</li>
    </ul>
    <p class="small muted">${esc(t('Every model needs a named person who owns the {partner} relationship.', { partner: ex.partner }))}</p></section>` : `
  <section class="card" id="partner-models"><h2>${esc(t('Partners'))}</h2><p class="small">${esc(t('In this industry the {rep} takes the {order} directly, so no partner link is needed.'))}</p></section>`;
  const reads = CAP_ORDER.map((c) => `<li><b>${esc(t(CAPS[c].name))}</b> ${esc(t('reads'))} ${esc(CAPS[c].reads.map((r) => t(r)).join(', '))}</li>`).join('');
  return `
  <section class="card" id="trust-ladder"><div class="section-head"><h2>${esc(t('Trust ladder'))}</h2>${pill(t('Designed'), 'info')}</div>
    <p class="small">${esc(t('Authority is earned with evidence, per capability. Every capability starts at rung 1. Thresholds are set per customer.'))}</p>
    <ol class="rungs">${ladder}</ol>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('Capability'))}</th><th>${esc(t('Starts at'))}</th><th>${esc(t('Target design'))}</th></tr></thead><tbody>${rungRows}</tbody></table></div>
    <p class="small"><b>${esc(t('Never at any rung'))}:</b></p>
    <ul class="bullets small" id="never-rung">${humanOnly.map((g) => `<li>${esc(t(g.text))}</li>`).join('') || `<li>${esc(t('Prices, credit and contract terms stay with people.'))}</li>`}</ul>
    <a class="btn secondary sm" href="#/agents">${esc(t('Open agent controls'))} ${icon('chevron', 14)}</a>
  </section>
  <section class="card" id="lifecycle"><div class="section-head"><h2>${esc(t('New {account}: found to full loop'))}</h2>${pill(t('Designed'), 'info')}</div>
    <ol class="bullets small">${life.map(([n, d]) => `<li><b>${esc(t(n))}:</b> ${esc(t(d))}</li>`).join('')}</ol>
    <p class="small muted">${esc(t('Cold start: no history uses location and similar {accounts}; no {visit} data uses the default frequency and cautious actions; no evidence uses partner data and a first-{visit} check.'))}</p>
  </section>
  <section class="card" id="seasons"><div class="section-head"><h2>${esc(t('Seasonal playbook'))}</h2>${pill(t('Designed'), 'info')}</div>
    <p class="small">${esc(t('Each market sets its own calendar. Events come from the {country} pack.', { country: country.name }))}</p>
    ${(() => { const R = roles(ctx); const on = R.season(); return `<div class="watch-row" id="season-switch"><div class="row-main"><b>${esc(t('Event mode for {event}', { event: data.event.name }))}</b><small>${esc(t('Adds an event notice on every brief and raises order-led suggested quantities by 20% (sample).'))}</small></div>${ctx.persona === 'admin' ? `<button class="btn ${on ? 'primary' : 'secondary'} sm" data-act="season-toggle" aria-pressed="${on}" style="min-height:var(--tap)">${esc(on ? t('On') : t('Off'))}</button>` : pill(on ? t('On') : t('Off'), on ? 'good' : 'muted')}</div>`; })()}
    ${seasonRows.map((r) => `<details class="fold season" data-season><summary>${esc(r[0])}</summary><ul class="bullets small">${seasonHead.map((c, i) => (r[i + 1] === 'Not used' ? '' : `<li><b>${esc(t(CAPS[c].name))}:</b> ${esc(t(r[i + 1]))}</li>`)).join('')}</ul></details>`).join('')}
  </section>
  ${partner}
  <section class="card" id="data-foundation"><div class="section-head"><h2>${esc(t('{Account} 360: the shared data'))}</h2>${pill(t('Designed'), 'info')}</div>
    <p class="small">${esc(t('One view of each {account}, read by all eight capabilities. Infrastructure, not a product: without it every team builds its own pipeline and the scores disagree.'))}</p>
    <ul class="bullets small">${reads}</ul>
    <p class="small muted">${esc(t('Written by data pipelines only. Read by capabilities through one interface. Features switch on or off per market.'))}</p>
    <a class="btn secondary sm" href="#/account/${data.planned[0].accountId}">${esc(t('See it on an {account}'))} ${icon('chevron', 14)}</a>
  </section>`;
}

export function render(ctx, args = []) {
  const { t } = ctx;
  const tab = TABS.some(([id]) => id === args[0]) ? args[0] : 'overview';
  const body = { overview, journey, flows, day, activation, scorecard, more }[tab](ctx, args[1]);
  return `
  <section class="page-head" data-tab="${tab}">
    <h1>${esc(t('Execution system'))}</h1>
    <p class="muted">${esc(t('How the eight capabilities plan, act, execute and learn for {industry}.', { industry: ctx.industry.name.toLowerCase() }))}</p>
  </section>
  ${tabsBar(t, tab)}
  ${body}`;
}

