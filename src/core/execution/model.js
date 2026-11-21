// Execution system: eight capabilities, the seven-stage journey, five process flows,
// per-account foundation signals and the conflicts the orchestrator resolves.
// Generic and tokenized. Industry words come from the pack (vocab + pack.execution).
// Nothing here changes generated data: signals use their own seeded generator.

import { createRng } from '../rng.js';

/** Built = works in this prototype on sample data. Designed = the production design, not built. */
export const CAPS = {
  potential: {
    group: 'foundation', name: 'Account Potential', q: 'What is this {account} worth?', agent: 'planner',
    out: 'Potential, white space and confidence for every {account}',
    without: '{Reps} {visit} by habit. High-value {accounts} are under-served.',
    built: 'Rule-based score from sample sales and {account} data',
    designed: 'Regression or gradient-boosted model, scored overnight',
    reads: ['Sales history', '{Account} master', 'Location'], minData: '12 months of sales',
  },
  tiering: {
    group: 'foundation', name: 'Account Tiering', q: 'What tier is this {account}?', agent: 'planner',
    out: 'Tier, cluster and the standard that tier is measured against',
    without: 'Every {account} gets the same frequency, range and standard.',
    built: 'Tier A, B or C from the potential score; cadence by tier',
    designed: 'Clustering on many features, refreshed each quarter',
    reads: ['All {account} features'], minData: '6 months of sales',
  },
  diagnostics: {
    group: 'foundation', name: 'Gap Diagnostics', q: 'What is driving growth or decline here?', agent: 'gap',
    out: 'Gaps with type, severity and evidence, plus growth and decline drivers',
    without: 'Gaps are found during the {visit}, or never.',
    built: 'Rules over sample sales, evidence and history',
    designed: 'Rules plus a model, triggered by new evidence',
    reads: ['Sales trend', 'Evidence', 'Partner invoices'], minData: '6 months of sales',
  },
  retention: {
    group: 'foundation', name: 'Retention Risk', q: 'Which {accounts} are at risk of leaving?', agent: 'gap',
    out: 'Risk score, band and the drivers behind it',
    without: 'Loss is noticed after the {orders} stop.',
    built: 'Score from {order} trend, {visit} gaps and open gaps',
    designed: 'Survival or classification model, weekly',
    reads: ['{Order} frequency trend', '{Visit} logs', 'Decline signals'], minData: '12 months of {orders}',
  },
  actions: {
    group: 'execution', name: 'Action Ranking', q: 'What should the {rep} do first?', agent: 'gap',
    out: 'Ranked actions with value, effort, reason and confidence',
    without: 'Long checklists, nothing ranked.',
    built: 'Value per minute times confidence, inside the time budget',
    designed: 'Uplift ranking model with several objectives',
    reads: ['Gaps', 'Tier', 'Evidence'], minData: '3 months of outcomes',
  },
  planning: {
    group: 'execution', name: 'Visit Planning', q: 'Which {accounts}, when, in what order?', agent: 'planner',
    out: 'Journey plan, route and a time budget for each {visit}',
    without: 'Fixed cycles. Time lost driving. Urgent {accounts} reached late.',
    built: 'Greedy route over opening hours and travel time',
    designed: 'Constraint solver for the cycle; fast re-plan during the day',
    reads: ['Location', 'Tier', 'Retention flag', 'Action urgency'], minData: 'Location for every {account}',
  },
  order: {
    group: 'execution', name: '{Order} Suggestion', q: 'What to {order}, and how much?', agent: 'order',
    out: 'Suggested lines and quantities with a reason for each',
    without: '{Orders} repeat the last one. Range does not grow.',
    built: 'Draft from history, gaps and pack rules',
    designed: 'Demand forecast per {account} and {offering}',
    reads: ['{Order} history', 'Gaps', 'Offer calendar'], minData: '3 months of {orders}',
  },
  offers: {
    group: 'execution', name: 'Offer Targeting', q: 'Which {accounts} get which approved offer?', agent: 'order',
    out: 'Target with a tier, or hold back with a reason',
    without: 'Every {account} gets the same offer, including those that would buy anyway.',
    built: 'Rules on white space, captured share and risk',
    designed: 'Propensity and uplift model per {account} and offer',
    reads: ['Offer plan', 'Tier', 'Offer history', 'Retention flag'], minData: '6 months plus an approved offer plan',
  },
};
export const CAP_ORDER = ['potential', 'tiering', 'diagnostics', 'retention', 'actions', 'planning', 'order', 'offers'];
export const FOUNDATION = CAP_ORDER.filter((c) => CAPS[c].group === 'foundation');
export const EXECUTION = CAP_ORDER.filter((c) => CAPS[c].group === 'execution');

export const PHASES = {
  plan: { name: 'Plan', tone: 'plan' },
  act: { name: 'Act', tone: 'act' },
  execute: { name: 'Execute', tone: 'exec' },
  learn: { name: 'Learn', tone: 'learn' },
};

/** Seven stages. Each has one lead capability. */
export const JOURNEY = [
  { n: 1, phase: 'plan', name: '{Account} priority', does: 'Score, tier and segment every {account}', lead: 'potential', support: ['diagnostics', 'tiering', 'retention'],
    consultative: 'Priority inside each {account} group', orderLed: 'The full universe, including new {accounts}' },
  { n: 2, phase: 'plan', name: 'Coverage and schedule', does: 'Who serves which {account}, how often, in what order', lead: 'planning', support: ['potential', 'actions', 'order'],
    consultative: 'Call cycle inside the {account} agreement', orderLed: 'Daily routes and frequency by tier' },
  { n: 3, phase: 'act', name: 'Activity and {order} plan', does: 'Plan the actions, offers and {order} for each {visit}', lead: 'actions', support: ['order', 'diagnostics', 'offers'],
    consultative: 'Within what the agreement allows', orderLed: 'Against the tier benchmark' },
  { n: 4, phase: 'execute', name: '{Visit} and {order} capture', does: 'Do the ranked actions, capture evidence and the {order}', lead: 'actions', support: ['order', 'planning', 'diagnostics'],
    consultative: 'Long {visits} with detailed evidence', orderLed: 'Short {visits} where the {order} leads' },
  { n: 5, phase: 'execute', name: 'Between-{visit} contact', does: 'Reach {accounts} between {visits}', lead: 'actions', support: ['order', 'potential', 'offers'],
    consultative: 'The {account} portal or the {kam}', orderLed: 'Digital ordering and messages' },
  { n: 6, phase: 'learn', name: 'Track execution', does: 'What was done, and what changed', lead: 'diagnostics', support: ['actions', 'potential', 'retention'],
    consultative: 'Standard compliance with evidence', orderLed: 'Must-have range and distribution' },
  { n: 7, phase: 'learn', name: 'Coach the team', does: 'Coach, balance workload, recognize', lead: 'manager', support: ['actions', 'planning', 'retention'],
    consultative: 'The {kam} and agency oversight', orderLed: 'Supervisor and partner reviews' },
];

/**
 * Five process flows. Generic phase text; each pack names the flow and maps its actions.
 * Lines may use {flow}, {owner}, {evidence}, {source}, {partner} and vocabulary tokens.
 */
export const FLOWS = {
  visibility: {
    generic: 'Visibility and placement',
    phases: {
      plan: { lead: ['potential', 'diagnostics'], support: ['tiering', 'retention', 'planning'], out: 'Ranked {account} list and a {visit} window', lines: [
        'Account Potential ranks {accounts} by what extra visibility is worth.',
        'Gap Diagnostics finds {accounts} missing it, compared with similar {accounts}.',
        'Account Tiering groups {accounts} by how much visibility moves sales. Retention Risk holds back investment where the {account} may leave.',
      ] },
      act: { lead: ['actions', 'order'], support: ['offers'], out: 'Ranked actions with an expected value', lines: [
        'Action Ranking picks which {account}, when, and what.',
        '{Order} Suggestion adds the quantities the placement needs.',
        '@offers',
      ] },
      execute: { lead: ['planning'], support: ['diagnostics'], out: 'Evidence and outcome', lines: [
        'Visit Planning gets the {rep} there inside the window.',
        'The {rep} does it from the ranked list.',
        'Evidence ({evidence}) confirms it was done.',
      ] },
      learn: { lead: ['actions', 'diagnostics'], support: ['order', 'potential', 'retention', 'planning'], out: 'Better ranking next cycle', lines: [
        'Expected versus actual result retrains Action Ranking.',
        'Evidence updates the gap status in Gap Diagnostics.',
        'Retention Risk watches {accounts} where engagement falls.',
      ] },
    },
  },
  range: {
    generic: 'Range and listings',
    phases: {
      plan: { lead: ['potential', 'diagnostics'], support: ['tiering', 'planning'], out: 'Ranked {accounts} with white space', lines: [
        'Account Potential sizes the white space.',
        'Account Tiering sets the must-have range for each tier. A new {account} starts from its tier benchmark.',
        'Gap Diagnostics finds missing and lapsed {offerings}.',
      ] },
      act: { lead: ['actions', 'order'], support: ['tiering'], out: 'Listing actions and a first {order}', lines: [
        'Action Ranking picks the listing or win-back to push first.',
        '{Order} Suggestion sizes the first {order} and the gap fill.',
        'Tier benchmarks decide which {offerings} matter for this tier.',
      ] },
      execute: { lead: ['planning', 'actions'], support: ['order'], out: '{Visit}, {order} and contact data', lines: [
        'Visit Planning gets the {rep} to the right {account} at the right time.',
        'The gap is on screen on arrival. The {rep} captures the {order}.',
        '@partner',
      ] },
      learn: { lead: ['order', 'potential'], support: ['diagnostics', 'retention', 'tiering'], out: 'Updated priorities and benchmarks', lines: [
        'Accepted and edited lines retrain {Order} Suggestion.',
        'Actual {orders} refine Account Potential.',
        'Falling range health raises Retention Risk.',
      ] },
    },
  },
  relationship: {
    generic: '{Account} relationship',
    phases: {
      plan: { lead: ['retention', 'tiering'], support: ['potential'], out: '{Accounts} that need attention now', lines: [
        'Retention Risk flags who needs attention now.',
        'Account Tiering sets the {visit} frequency for each tier.',
        'Account Potential decides which {accounts} justify the investment.',
      ] },
      act: { lead: ['actions'], support: ['retention'], out: 'Retention actions by urgency', lines: [
        'Action Ranking turns a risk flag into a retention conversation, not a sales push.',
        'The risk score sets the urgency.',
        'At-risk and healthy {accounts} get different action types.',
      ] },
      execute: { lead: ['planning', 'actions'], support: [], out: 'What the {contact} said, recorded', lines: [
        'Visit Planning protects the frequency for at-risk {accounts}.',
        'The {rep} records what the {contact} said and what was agreed.',
        'Blocked items go to the {manager} or the {kam}.',
      ] },
      learn: { lead: ['retention', 'potential'], support: ['planning', 'actions'], out: 'Updated risk and cadence', lines: [
        'Retained or lost: the outcome retrains Retention Risk.',
        'Visit Planning re-sets the cadence for next cycle.',
        'Coaching prompts come from patterns, not a leaderboard.',
      ] },
    },
  },
  standard: {
    generic: 'Standard compliance',
    phases: {
      plan: { lead: ['diagnostics', 'tiering'], support: ['potential', 'retention'], out: 'The standard per tier and the gap', lines: [
        '{owner} defines what good looks like.',
        'Account Tiering assigns the standard each {account} is measured against.',
        'Gap Diagnostics measures the gap. Retention Risk holds back investment where the {account} may leave.',
      ] },
      act: { lead: ['actions', 'order'], support: [], out: 'Ranked fixes with value and minutes', lines: [
        'Action Ranking ranks fixes by value per minute.',
        'It flags likely gaps before they happen.',
        '{Order} Suggestion adds what is needed to close a gap.',
      ] },
      execute: { lead: ['planning'], support: ['diagnostics'], out: 'Compliance evidence and corrections', lines: [
        'Visit Planning routes the {rep} to the {accounts} with the biggest gaps.',
        'The {rep} fixes it before leaving.',
        'Evidence ({evidence}) records the result.',
      ] },
      learn: { lead: ['diagnostics', 'actions'], support: ['tiering', 'retention', 'order'], out: 'Refined standards and scores', lines: [
        'Compliance results update the gap status and the tier standard.',
        'Action Ranking learns which fixes worked.',
        'Persistent failure feeds Retention Risk.',
      ] },
    },
  },
  price: {
    generic: 'Agreed terms and offers',
    phases: {
      plan: { lead: ['diagnostics', 'potential'], support: ['offers', 'retention'], out: '{Accounts} with gaps against agreed terms', lines: [
        'Agreed terms come from {sourceLower}. The agent never sets a price.',
        'Gap Diagnostics finds where the agreed terms or offer did not reach the {account}.',
        '@offersPlan',
      ] },
      act: { lead: ['actions'], support: ['offers'], out: 'Ranked corrections by value at stake', lines: [
        'Action Ranking ranks corrections by the value at stake.',
        '@offersTier',
        'Expiring items go first.',
      ] },
      execute: { lead: ['planning'], support: ['order'], out: 'Verified terms in each {account}', lines: [
        'Visit Planning routes the {rep} to the highest value gaps first.',
        'The {rep} verifies, and corrects only where allowed.',
        '@offersStock',
      ] },
      learn: { lead: ['offers', 'actions'], support: ['potential', 'retention'], out: 'Insight back to the people who set terms', lines: [
        '@offersLearn',
        'Correction results go back to the people who set terms.',
        'Persistent gaps raise Retention Risk.',
      ] },
    },
  },
};
export const FLOW_ORDER = ['visibility', 'range', 'relationship', 'standard', 'price'];

const OFFER_LINES = {
  on: {
    offers: 'Offer Targeting links an approved offer where it needs visibility.',
    offersPlan: 'Offer Targeting picks {accounts} where an approved offer adds volume, and holds back {accounts} that would buy anyway.',
    offersTier: 'Offer Targeting picks the offer tier for each targeted {account}.',
    offersLearn: 'Offer result versus expectation retrains Offer Targeting.',
    offersStock: '{Order} Suggestion makes sure stock for the approved offer is there.',
  },
  limited: {
    offers: 'Offer Targeting lists {accounts} eligible for an approved program. People decide the terms.',
    offersPlan: 'Offer Targeting lists eligible {accounts} only. Terms are decided by people.',
    offersTier: 'No tiers are set by the agent. Eligible {accounts} are passed to the people who decide.',
    offersLearn: 'Eligibility and take-up are logged for the people who run the program.',
    offersStock: '{Order} Suggestion makes sure the agreed stock is there.',
  },
  off: {
    offers: 'Offer Targeting is not used in this industry.',
    offersPlan: 'Offer Targeting is not used in this industry.',
    offersTier: 'No offers are targeted in this industry.',
    offersLearn: 'Verification results are logged. No offer model learns here.',
    offersStock: '{Order} Suggestion makes sure the agreed stock is there.',
  },
};

export const exOf = (industry) => industry.execution;

/** Phase lines for one flow in one industry, with @-placeholders resolved. */
export function flowPhase(industry, flowId, phaseId) {
  const ex = exOf(industry);
  const ph = FLOWS[flowId].phases[phaseId];
  const mode = ex.offers.mode;
  const lines = ph.lines.map((l) => {
    if (l === '@partner') return ex.partner ? 'The {partner} gets the {order} through its own system. The {rep} works through it.' : 'Between {visits}, digital ordering keeps contact.';
    if (l.startsWith('@')) return OFFER_LINES[mode][l.slice(1)];
    return l;
  });
  const support = mode === 'off' ? ph.support.filter((c) => c !== 'offers') : ph.support;
  const lead = mode === 'off' ? ph.lead.filter((c) => c !== 'offers') : ph.lead;
  return { ...ph, lines, support, lead: lead.length ? lead : ['actions'] };
}

export const EVIDENCE_LABEL = { photo: 'photo', signature: 'signature', note: 'note', scan: 'scan' };

/** Vars every flow template needs. */
export function flowVars(industry, flowId) {
  const ex = exOf(industry);
  const f = ex.flows[flowId];
  const defs = f.actions.map((id) => industry.actions.find((a) => a.id === id)).filter(Boolean);
  const counts = {};
  for (const d of defs) counts[d.evidence] = (counts[d.evidence] || 0) + 1;
  const ev = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'note';
  const source = ex.termsSource;
  return { flow: f.name, owner: f.owner || ex.standardOwner, evidence: EVIDENCE_LABEL[ev], source, sourceLower: source.replace(/^The /, 'the '), partner: ex.partner || '' };
}

const CYCLE = { A: 14, B: 21, C: 35 };
export const cycleDays = (tier) => CYCLE[tier];

/** Archetype of a segment: consultative (long, few) or order-led (short, many). */
export function archetypeOf(industry, segmentId) {
  const ex = exOf(industry);
  return ex.orderLed.includes(segmentId) ? 'orderLed' : 'consultative';
}

export const ARCHETYPES = {
  consultative: { name: 'Consultative', line: 'Fewer {accounts}, longer {visits}, every minute ranked' },
  orderLed: { name: 'Order-led', line: 'Many short {visits} where the {order} is the {visit}' },
};

/** Flow an action belongs to (first match), or null. */
export function flowOfAction(industry, defId) {
  const ex = exOf(industry);
  return FLOW_ORDER.find((f) => ex.flows[f].actions.includes(defId)) || null;
}

/**
 * Foundation signals for every account, memoized on ctx.
 * Uses a separate seeded generator so generated data is untouched.
 */
export function signals(ctx) {
  if (ctx._signals) return ctx._signals;
  const { industry, data } = ctx;
  const ex = exOf(industry);
  const out = {};
  for (const a of data.accounts) {
    const rng = createRng(`exec|${data.seedKey}|${a.id}`);
    const captured = Math.round((a.current / a.potential) * 100);
    const h = a.orderHistory.map((o) => o.total);
    const trend = h[2] ? Math.round(((h[0] - h[2]) / h[2]) * 100) : 0; // most recent vs oldest of three
    const cycle = CYCLE[a.tier];
    const overdue = Math.max(0, a.lastVisitDays - cycle);
    const planned = data.planned.find((p) => p.accountId === a.id);
    const openGaps = planned ? planned.actions.filter((x) => x.agent === 'gap').length : rng.int(0, 2);
    let score = 14 + Math.max(0, -trend) * 0.7 + Math.min(overdue, 25) * 0.9 + openGaps * 2.5 + (100 - captured) * 0.15 + rng.int(-6, 6);
    score = Math.max(4, Math.min(94, Math.round(score)));
    const band = score >= 62 ? 'High' : score >= 40 ? 'Watch' : 'Low';
    const drivers = [];
    if (trend < -5) drivers.push({ t: '{Order} value down {pct}% across the last three {orders}', v: { pct: -trend } });
    if (overdue > 0) drivers.push({ t: 'Last {visit} {n} days ago. Tier {tier} is due every {cycle} days', v: { n: a.lastVisitDays, tier: a.tier, cycle } });
    if (openGaps >= 3) drivers.push({ t: '{n} open gaps from Gap Diagnostics', v: { n: openGaps } });
    if (band !== 'Low' && ex.retentionSignal) drivers.push({ t: ex.retentionSignal, v: {} });
    if (!drivers.length) drivers.push({ t: '{Orders} steady and {visits} on cycle', v: {} });

    const growth = [];
    if (trend > 5) growth.push({ t: '{Order} value up {pct}% across the last three {orders}', v: { pct: trend } });
    if (captured < 60) growth.push({ t: 'Only {pct}% of potential captured. White space is the main lever', v: { pct: captured } });
    if (trend < -5) growth.push({ t: 'Decline driver: {Order} value is falling. Check gaps before pushing new lines', v: {} });
    if (!growth.length) growth.push({ t: 'Stable. {pct}% of potential captured', v: { pct: captured } });

    // Offer Targeting: incremental vs would buy anyway.
    let offer;
    const tierIdx = { A: 2, B: 1, C: 0 }[a.tier];
    if (ex.offers.mode === 'off') offer = { decision: 'off', t: ex.offers.note };
    else if (ex.offers.mode === 'limited') {
      offer = band === 'High' || captured < 65
        ? { decision: 'eligible', t: 'Eligible for {program}. Terms are decided by {decider}.', v: { program: ex.offers.program, decider: ex.offers.decider.replace(/^The /, 'the ') } }
        : { decision: 'hold', t: 'Not passed on. {pct}% of potential already captured, so an offer would add little.', v: { pct: captured } };
    } else if (captured >= 76) offer = { decision: 'hold', t: 'Held back: {pct}% of potential already captured. This {account} is likely to buy anyway.', v: { pct: captured } };
    else if (band === 'High') offer = { decision: 'target', tier: ex.offers.tiers[0], t: 'Retention offer: {tier}. Risk is high, so the smallest approved tier is used first.', v: { tier: ex.offers.tiers[0] } };
    else if (a.tier === 'C' && a.whiteSpace < a.potential * 0.3) offer = { decision: 'hold', t: 'Held back: the expected extra volume is small against the cost.', v: {} };
    else offer = { decision: 'target', tier: ex.offers.tiers[tierIdx], t: 'Target with {tier}. White space of {pct}% makes the extra volume likely.', v: { tier: ex.offers.tiers[tierIdx], pct: 100 - captured } };

    out[a.id] = {
      captured, trend, cycle, overdue, openGaps,
      cluster: `${a.segment} · Tier ${a.tier}`,
      risk: { score, band, drivers: drivers.slice(0, 3) },
      growth: growth.slice(0, 2),
      offer,
      archetype: archetypeOf(industry, a.segmentId),
    };
  }
  ctx._signals = out;
  return out;
}

/**
 * Conflicts between capabilities for one planned account, and how the orchestrator resolved them.
 * Returns [{ between: [capA, capB], saw, resolved }]. Template strings use vocabulary tokens.
 */
export function conflicts(ctx, accountId) {
  const { industry, data } = ctx;
  const p = data.planned.find((x) => x.accountId === accountId);
  if (!p) return [];
  const a = data.byId[accountId];
  const sg = signals(ctx)[accountId];
  const out = [];
  const offName = (id) => industry.offerings.find((o) => o.id === id)?.name || '';
  if (a.tier !== 'C' && sg.risk.band === 'High') {
    out.push({ between: ['potential', 'retention'], saw: 'Account Potential says Tier {tier}, worth investing in. Retention Risk scores {score} out of 100.', resolved: 'Retention first. The conversation opens on what changed, and growth actions follow.', v: { tier: a.tier, score: sg.risk.score } });
  }
  const over = p.actions.filter((x) => x.overBudget);
  if (over.length) {
    out.push({ between: ['actions', 'planning'], saw: 'Action Ranking found {n} actions. Visit Planning gave this {visit} {minutes} min.', resolved: '{k} lower-value actions move to the next {visit}. They are logged, not dropped.', v: { n: p.actions.length, minutes: a.visitMinutes, k: over.length } });
  }
  const gapProducts = new Set(p.actions.filter((x) => x.agent === 'gap' && x.offeringId).map((x) => x.offeringId));
  const linked = p.order.find((l) => gapProducts.has(l.offeringId));
  if (linked) {
    const act = p.actions.find((x) => x.offeringId === linked.offeringId && x.agent === 'gap');
    out.push({ between: ['order', 'actions'], saw: '{Order} Suggestion added {product}. Action Ranking says the real priority for it is an action, not a bigger {order}.', resolved: 'Line kept and linked to the action "{action}". It is sent after the action is done.', v: { product: offName(linked.offeringId), action: ctx.t(act.title, act.vars) } });
  }
  const top = p.actions[0];
  if (sg.offer.decision === 'target' && top && flowOfAction(industry, top.defId) === 'standard') {
    out.push({ between: ['offers', 'diagnostics'], saw: 'Offer Targeting would push {tier}. Gap Diagnostics says the top gap is standard compliance.', resolved: 'Offer held until the gap is fixed, so the offer is not wasted.', v: { tier: sg.offer.tier } });
  }
  return out;
}

/** Activation tiers. Capabilities switch on cumulatively. */
export const TIERS = [
  { n: 1, name: 'Foundation', when: 'New market or pilot', caps: ['potential', 'tiering', 'diagnostics', 'retention'], who: 'Managers only. No suggestions to the field yet', outcome: 'See the prize and the gaps',
    data: 'Sales history and the {account} master', infra: 'Basic reporting', advance: 'Foundation outputs used by managers; field team trained' },
  { n: 2, name: 'Guided', when: 'Market with a field team', caps: ['actions'], who: 'Ranked actions to supervisors and managers', outcome: 'Plan execution with guided actions',
    data: 'Plus evidence or audit data', infra: 'Field app optional', advance: 'Actions show a measured effect against control; field app live' },
  { n: 3, name: 'Optimized field', when: 'Large universe of {accounts}', caps: ['planning'], who: 'Suggestions direct to {reps} in the field app', outcome: 'Better routes and {visits}',
    data: 'Plus location and {visit} logs', infra: 'Field app live', advance: 'Routes improve selling time against control; {orders} captured digitally' },
  { n: 4, name: 'Full loop', when: 'Mature market, all levers', caps: ['order', 'offers'], who: 'All roles, including partners', outcome: 'Closed loop with fast feedback',
    data: 'Plus partner invoices and an offer plan', infra: 'Field app plus partner link', advance: 'Earned authority per capability (trust ladder)' },
];

/** Data each capability needs. R = required, P = preferred. */
export const DATA_NEEDS = {
  potential: { history: 'R', master: 'R', evidence: '', partner: 'P', plan: '', geo: 'P' },
  tiering: { history: 'R', master: 'R', evidence: '', partner: 'P', plan: '', geo: 'P' },
  diagnostics: { history: 'R', master: 'R', evidence: 'R', partner: 'P', plan: '', geo: '' },
  retention: { history: 'R', master: 'R', evidence: '', partner: 'P', plan: '', geo: '' },
  actions: { history: 'R', master: 'R', evidence: 'R', partner: 'P', plan: 'P', geo: '' },
  planning: { history: 'P', master: 'R', evidence: '', partner: '', plan: '', geo: 'R' },
  order: { history: 'R', master: 'R', evidence: 'P', partner: 'P', plan: 'P', geo: '' },
  offers: { history: 'R', master: 'R', evidence: '', partner: 'P', plan: 'R', geo: '' },
};
export const DATA_SOURCES = [
  ['history', 'Sales history'], ['master', '{Account} master'], ['evidence', 'Evidence or audits'],
  ['partner', 'Partner invoices'], ['plan', 'Approved offer plan'], ['geo', 'Location'],
];

/** Readiness answers -> which sources are available, red zone, recommended tier. */
export function readiness(ans) {
  const have = {
    history: ans.history >= 6, master: ans.master >= 90, evidence: ans.evidence !== 'none',
    partner: ans.partner !== 'none', plan: !!ans.plan, geo: !!ans.geo,
  };
  if (ans.history >= 3 && ans.history < 6) have.historyThin = true;
  const red = ans.master < 70 && ans.history < 3 && ans.evidence === 'none';
  const capReady = {};
  for (const c of CAP_ORDER) {
    const need = DATA_NEEDS[c];
    const missing = Object.entries(need).filter(([k, v]) => v === 'R' && !have[k]).map(([k]) => k);
    capReady[c] = { ready: missing.length === 0, missing };
  }
  let tier = 0;
  const fieldApp = !!ans.app;
  for (const T of TIERS) {
    const caps = TIERS.filter((x) => x.n <= T.n).flatMap((x) => x.caps);
    const ok = caps.every((c) => capReady[c].ready) && (T.n < 3 || fieldApp);
    if (ok) tier = T.n; else break;
  }
  if (red) tier = 0;
  return { have, red, capReady, tier, fieldApp };
}

/** Alternative paths the deck-agnostic operating model supports. */
export const PATHS = [
  'Gap Diagnostics straight to {Order} Suggestion, without Action Ranking, where the {order} is the main lever.',
  'Account Potential straight to Visit Planning, without Action Ranking, where cadence is the main lever.',
  'Account Tiering and Retention Risk run at every tier.',
  'Offer Targeting needs an approved offer plan, Account Potential and Gap Diagnostics.',
];

/** Trust ladder: authority is earned per capability, never declared. Thresholds are sample values set per customer. */
export const RUNGS = [
  { n: 1, name: 'Suggest', does: 'The agent suggests. A person decides and acts.', evidence: 'Passed replay and shadow tests. A/B pilot positive against control.' },
  { n: 2, name: 'Suggest and prepare', does: 'The agent prepares the item. A person confirms with one tap.', evidence: 'Acceptance high and overrides falling for three months in a row.' },
  { n: 3, name: 'Act and notify', does: 'The agent does routine items and tells a person.', evidence: 'Very high acceptance, no safety incidents for six months, few reversals.' },
  { n: 4, name: 'Act within limits', does: 'The agent acts alone inside set limits. Operational items only.', evidence: 'Sustained acceptance, audit trail verified, sign-off from the risk owner.' },
];
/** Where each capability starts, and its highest rung in the target design (P = proposed). */
export const RUNG_PLAN = { potential: [1, 2], tiering: [1, 2], diagnostics: [1, 2], retention: [1, 2], actions: [1, 3], planning: [1, 3], order: [1, 3], offers: [1, 2] };

/** Test design per capability. Proposed. No results exist. */
export const TESTS = {
  potential: { unit: 'Matched {accounts} with a holdout', measure: 'Share of {visit} effort on high-potential {accounts}', guard: 'Sales in low-potential {accounts} stay inside an agreed limit' },
  tiering: { unit: 'Matched {accounts}, before and after, with a holdout', measure: '{Visit} frequency in line with the tier', guard: 'No tier left without coverage; workload balanced' },
  diagnostics: { unit: 'Staggered start against matched {accounts}', measure: 'Days to close a gap', guard: 'Evidence quality holds; no extra audit load' },
  retention: { unit: 'Flagged {accounts} against matched unflagged ones', measure: 'Loss rate in flagged {accounts}', guard: 'No over-investment in low-value at-risk {accounts}' },
  actions: { unit: 'Randomized by {rep} or team, never by {account}', measure: 'Share of {visits} with a high-value action done', guard: '{Visit} time and {rep} feedback' },
  planning: { unit: 'Matched territories, before and after', measure: 'Selling time per day; travel per {visit}', guard: 'Must-{visit} {accounts} still covered' },
  order: { unit: 'Randomized by {account} within a partner', measure: 'Lines per {order}', guard: 'Stock-outs, returns and partner stock' },
  offers: { unit: 'Randomized by {account} within a region', measure: 'Extra volume per offer against a blanket offer', guard: 'Total offer spend inside budget; no loss of base sales' },
};
export const TEST_STAGES = [
  ['Replay', 'Run on past data. No effect in the field.'],
  ['Shadow', 'Suggest, but do not show {reps}. Check quality.'],
  ['A/B pilot', 'Run the design in the field against a control.'],
  ['Scale', 'Roll out and keep a small rolling holdout.'],
];

/** Structured reasons: why a suggestion was not followed, and which capability learns. */
export const LEARN_REASONS = [
  { id: 'stock', label: 'Stock issue', learns: ['order', 'diagnostics'], match: /stock|supply|deliver|float|capacity/i },
  { id: 'money', label: 'Cannot buy now', learns: ['order', 'retention'], match: /credit|afford|budget|hold|dues|arrears|price/i },
  { id: 'done', label: 'Already done', learns: ['diagnostics'], match: /already|fixed|done/i },
  { id: 'notallowed', label: 'Not allowed here', learns: ['actions', 'offers'], match: /not allowed|agreement|rule|policy|licen|consent|suitab|compliance/i },
  { id: 'data', label: 'Data looks wrong', learns: ['diagnostics', 'potential'], match: /data|wrong|incorrect|stale/i },
  { id: 'time', label: 'No time in this {visit}', learns: ['planning', 'actions'], match: /time|late|run out|ran out/i },
  { id: 'contact', label: '{Contact} away or said no', learns: ['actions', 'retention'], match: /not available|away|said no|declin|refus|busy|absent/i },
  { id: 'other', label: 'Other (free text, grouped later)', learns: ['actions'], match: /.*/ },
];
export const learnReasonFor = (label) => LEARN_REASONS.find((r) => r.match.test(label || '')) || LEARN_REASONS[LEARN_REASONS.length - 1];
