// One handler per intent. Each reads live app state and generated data and returns
// { text, basedOn, links }. The engine applies vocabulary tokens and spelling afterwards.
// Rules for handlers: use only what the screen shows, say estimates are estimates,
// never invent a number, and always say what the answer is based on.

import { link } from './router.js';
import { SCOPE } from '../screens/agents.js';
import { CAPABILITIES, LEVELS, AGENT_LABEL, EVIDENCE } from '../ui.js';

const sorted = (ctx) => ctx.data.planned.slice().sort((a, b) => a.rank - b.rank);
const nextPlan = (ctx) => ctx.m.nextAccount(null) || sorted(ctx)[0];
const list = (arr, last = 'and') => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} ${last} ${arr.at(-1)}`);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const roleOf = (ctx, route) => (route === 'kam' ? '{kam}' : '{manager}');

/** Resolves the account, plan and top action the screen is about. */
function focus(ctx, c) {
  const plan = ctx.m.plannedFor(c.accountId) || nextPlan(ctx);
  const acct = ctx.data.byId[c.accountId] || ctx.data.byId[plan.accountId];
  const p = ctx.m.plannedFor(acct.id);
  const open = p ? ctx.m.openGaps(acct.id) : [];
  const action = (c.actionId && ctx.m.findAction(c.actionId)) || open[0] || p?.actions[0] || null;
  return { acct, plan: p, open, action };
}

const decisionWord = (d) => (!d ? null : d.status === 'approved' ? 'You approved it.' : d.status === 'adjusted' ? 'You adjusted it.' : 'You overrode it.');
const title = (ctx, it) => ctx.t(it.title, it.vars);
const reasonLabel = (ctx, e) => ctx.t(e.reason, { limit: e.ruleVars?.limit != null ? ctx.fmt.money(e.ruleVars.limit) : '', max: '', lines: '' });

const H = {};

// ---- Today -----------------------------------------------------------------
H['today.first'] = (ctx) => {
  const { fmt, data, m } = ctx;
  const next = nextPlan(ctx);
  const a = data.byId[next.accountId];
  const c = m.counts(a.id);
  const top = next.actions[0];
  return {
    text: `${a.name} is first. It has an estimated ${fmt.money(next.opportunity)} at stake across ${plural(next.actions.length, 'action', 'actions')}. The top action is "${title(ctx, top)}" because ${ctx.t(top.saw, top.vars).replace(/\.$/, '')}. ${c.pending ? `${plural(c.pending, 'item', 'items')} in its brief ${c.pending === 1 ? 'waits' : 'wait'} for your review.` : 'Its brief is fully reviewed.'}`,
    basedOn: `today's plan, ${plural(data.planned.length, '{account}', '{accounts}')}, ranked actions`,
    links: [link.brief(a.id), link.route()],
  };
};

H['today.order'] = (ctx) => {
  const { fmt, data } = ctx;
  const top = sorted(ctx).slice(0, 3).map((p) => `${data.byId[p.accountId].name} (${fmt.moneyShort(p.opportunity)})`);
  return {
    text: `Today is ranked by estimated opportunity: the value of each {account}'s ranked actions. The first three are ${list(top)}. The route plan orders the same {visits} by opening hours and travel, so the two orders can differ.`,
    basedOn: `today's plan, estimated value per {account}, opening hours`,
    links: [link.route()],
  };
};

H['today.wait'] = (ctx) => {
  const { fmt, data, m } = ctx;
  const last = sorted(ctx).slice(-2).reverse().map((p) => `${data.byId[p.accountId].name} (${fmt.moneyShort(p.opportunity)})`);
  const later = data.planned.reduce((s, p) => s + p.actions.filter((x) => x.overBudget).length, 0);
  return {
    text: `The lowest estimated value today is ${list(last)}. ${later ? `${plural(later, 'action is', 'actions are')} marked "If time allows" because they would not fit the time budget of their {visit}.` : 'Every action fits the time budget of its {visit}.'} Nothing is dropped for you: you decide, and an override goes to your {manager} with a reason.`,
    basedOn: `today's plan, time budget per {visit}, ${plural(data.planned.length, '{account}', '{accounts}')}`,
    links: [link.route()],
  };
};

H['today.budget'] = (ctx) => {
  const { fmt, data } = ctx;
  const ps = data.planned;
  const visit = ps.reduce((s, p) => s + data.byId[p.accountId].visitMinutes, 0);
  const travel = ps.reduce((s, p) => s + (p.travelMin || 0), 0);
  const end = Math.max(...ps.map((p) => p.end || 0));
  return {
    text: `${plural(ps.length, '{visit}', '{visits}')} planned. About ${visit} minutes with {accounts} and ${travel} minutes of travel, ending around ${fmt.time(end)}. Travel is a straight-line estimate at an average city speed.`,
    basedOn: `the route plan, visit budgets, ${plural(ps.length, 'stop', 'stops')}`,
    links: [link.route()],
  };
};

// ---- Visit brief -----------------------------------------------------------
H['brief.whyfirst'] = (ctx, c) => {
  const { fmt, m } = ctx;
  const { acct, plan } = focus(ctx, c);
  const top = plan?.actions[0];
  if (!top) return { text: 'This {account} has no prepared actions today.', basedOn: `the plan for ${acct.name}`, links: [link.account(acct.id)] };
  const rest = plan.actions[1];
  return {
    text: `"${title(ctx, top)}" is ranked first. Its estimated value is ${fmt.money(top.value)} for ${top.effort} minutes at ${Math.round(top.confidence * 100)}% confidence, which gives the highest value per minute once confidence is applied.${rest ? ` The next one, "${title(ctx, rest)}", scores lower.` : ''} ${decisionWord(m.decision(top.id)) || 'You have not decided on it yet.'} The ranking uses configured rules, not a forecast.`,
    basedOn: `the brief for ${acct.name}, ${plural(plan.actions.length, 'ranked action', 'ranked actions')}, value, effort and confidence`,
    links: [link.action(top.id)],
  };
};

H['brief.compared'] = (ctx, c) => {
  const { acct, plan } = focus(ctx, c);
  const items = (plan?.actions || []).slice(0, 3);
  if (!items.length) return { text: 'There are no prepared actions to compare for this {account}.', basedOn: `the plan for ${acct.name}`, links: [] };
  const rows = items.map((it) => `"${title(ctx, it)}": ${ctx.t(it.compared, it.vars).replace(/\.$/, '')}`);
  return {
    text: `Each item names its comparison. ${rows.join('. ')}.`,
    basedOn: `the brief for ${acct.name}, the "Compared" line of the top ${items.length} actions`,
    links: [link.brief(acct.id)],
  };
};

H['brief.sure'] = (ctx, c) => {
  const { acct, plan } = focus(ctx, c);
  const items = plan?.actions || [];
  if (!items.length) return { text: 'There are no actions to rate for this {account}.', basedOn: `the plan for ${acct.name}`, links: [] };
  const low = items.slice().sort((a, b) => a.confidence - b.confidence)[0];
  const lows = items.filter((x) => x.confidence < 0.65).length;
  return {
    text: `Confidence runs from ${Math.round(low.confidence * 100)}% to ${Math.round(Math.max(...items.map((x) => x.confidence)) * 100)}% on this brief. ${lows ? `${plural(lows, 'item is', 'items are')} low confidence. The lowest is "${title(ctx, low)}": the data behind it is thin, so check it before you act.` : 'No item is low confidence.'} Confidence describes how well the rules fit the data. It is not a chance of a sale.`,
    basedOn: `the brief for ${acct.name}, confidence on ${plural(items.length, 'action', 'actions')}`,
    links: [link.brief(acct.id)],
  };
};

H['brief.override'] = (ctx, c) => {
  const { industry, m } = ctx;
  const { acct } = focus(ctx, c);
  const cnt = m.counts(acct.id);
  const recipient = acct.key && acct.tier === 'A' ? '{kam}' : '{manager}';
  const kam = industry.overrideReasons.filter((r) => r.route === 'kam').map((r) => `"${r.label}"`);
  return {
    text: `An override needs a reason. It is saved with your note and goes to the exception queue for your ${recipient}${kam.length ? `, or to the {kam} for reasons such as ${list(kam, 'or')}` : ''}. It is feedback for the agents, never a penalty. You can undo it. ${cnt.overridden ? `You have overridden ${plural(cnt.overridden, 'item', 'items')} on this brief.` : 'You have not overridden anything on this brief.'}`,
    basedOn: `override reasons, routing rules, the brief for ${acct.name}`,
    links: [link.brief(acct.id)],
  };
};

H['brief.evidence'] = (ctx, c) => {
  const { m } = ctx;
  const { acct, plan } = focus(ctx, c);
  const items = plan?.actions || [];
  const missing = items.filter((x) => !m.outcome(x.id)?.evidence);
  return {
    text: missing.length
      ? `${plural(missing.length, 'action has', 'actions have')} no evidence yet: ${list(missing.slice(0, 3).map((x) => `"${title(ctx, x)}" (${EVIDENCE[x.evidence].label.toLowerCase()})`))}${missing.length > 3 ? ' and more' : ''}. An action can be marked done only after its evidence is captured.`
      : 'Every action on this brief has its evidence captured.',
    basedOn: `the brief for ${acct.name}, evidence on ${plural(items.length, 'action', 'actions')}`,
    links: missing[0] ? [link.action(missing[0].id)] : [link.complete(acct.id)],
  };
};

// ---- Account 360 -----------------------------------------------------------
H['account.summary'] = (ctx, c) => {
  const { fmt, t, m } = ctx;
  const { acct, open } = focus(ctx, c);
  const last = m.lastVisitDays(acct.id);
  return {
    text: `${acct.name} is a ${t(acct.type).toLowerCase()} in ${acct.area}, tier ${acct.tier}, potential score ${acct.score} of 100. Estimated potential is ${fmt.moneyShort(acct.potential)} a year, current ${fmt.moneyShort(acct.current)}, leaving ${fmt.moneyShort(acct.whiteSpace)} of white space. ${last === 0 ? 'Visited today.' : `Last {visit} was ${fmt.daysAgo(last)}.`} ${plural(open.length, 'open gap', 'open gaps')}. Main {contact}: ${acct.contacts[0].name}.`,
    basedOn: `the profile of ${acct.name}, potential score, open gaps`,
    links: [link.brief(acct.id)],
  };
};

H['account.changed'] = (ctx, c) => {
  const { fmt, t, m } = ctx;
  const { acct, plan } = focus(ctx, c);
  const h = acct.history[0];
  const o = acct.orderHistory[0];
  const done = plan ? m.doneGaps(acct.id).length : 0;
  const dec = plan ? m.counts(acct.id) : null;
  return {
    text: `Last {visit} (${fmt.daysAgo(h.daysAgo)}): ${t(h.note, h.vars).replace(/\.$/, '')}. Last {order} was ${fmt.money(o.total)} over ${o.lines} lines. ${plan ? `Since then, today's brief has ${plural(plan.actions.length, 'action', 'actions')}. In this session you have decided on ${dec.approved + dec.adjusted + dec.overridden} items and recorded ${done} done.` : 'This {account} is not on today\'s plan.'}`,
    basedOn: `the last 3 {visits} and {orders} of ${acct.name}, today's brief, this session`,
    links: [link.account(acct.id)],
  };
};

H['account.gaps'] = (ctx, c) => {
  const { industry, m } = ctx;
  const { acct, plan, open } = focus(ctx, c);
  const named = open.filter((x) => x.offeringId).map((x) => industry.offerings.find((o) => o.id === x.offeringId).name);
  const inOrder = new Set((plan?.order || []).map((l) => l.offeringId));
  const seg = industry.segments.find((s) => s.id === acct.segmentId);
  const missing = industry.offerings.filter((o) => (o.status === 'new' || o.status === 'focus') && (!o.segments || o.segments.includes(seg.id)) && !inOrder.has(o.id)).slice(0, 3).map((o) => o.name);
  const parts = [];
  if (named.length) parts.push(`Open actions point at ${list([...new Set(named)].slice(0, 3).map((n) => ctx.t(n)))}.`);
  if (missing.length) parts.push(`New or focus {offerings} not in the suggested {order}: ${list(missing.map((n) => ctx.t(n)))}.`);
  return {
    text: parts.length ? `${parts.join(' ')} White space is estimated at ${ctx.fmt.moneyShort(acct.whiteSpace)} a year.` : `No {offering} gap is flagged for ${acct.name} today. White space is estimated at ${ctx.fmt.moneyShort(acct.whiteSpace)} a year.`,
    basedOn: `${acct.name}'s open actions, the suggested {order}, the {offering} range for this segment`,
    links: [link.order(acct.id)],
  };
};

H['account.contact'] = (ctx, c) => {
  const { t, fmt } = ctx;
  const { acct } = focus(ctx, c);
  const main = acct.contacts[0];
  const others = acct.contacts.slice(1).map((x) => `${x.name} (${t(x.role)})`);
  return {
    text: `The main {contact} is ${main.name}, ${t(main.role)}. ${t(main.preference)}. Last spoke ${fmt.daysAgo(main.lastContactDays)}.${others.length ? ` Also on file: ${list(others)}.` : ''}`,
    basedOn: `the {contacts} of ${acct.name}`,
    links: [link.account(acct.id)],
  };
};

// ---- Action ----------------------------------------------------------------
const needAction = (ctx, c, label) => {
  const { acct, action } = focus(ctx, c);
  if (!action || action.kind !== 'action') return { acct, action: null, none: { text: `Open an action first, then ask about its ${label}.`, basedOn: `the brief for ${acct.name}`, links: [link.brief(acct.id)] } };
  return { acct, action };
};

H['action.value'] = (ctx, c) => {
  const { fmt } = ctx;
  const { acct, action, none } = needAction(ctx, c, 'value');
  if (none) return none;
  return {
    text: `The estimate is ${fmt.money(action.value)}. It starts from the reference range for this type of action, scaled by ${acct.name}'s potential score (${acct.score} of 100), the size of its segment and the local price level. It is an estimate from configured rules. It is not booked sales and not a forecast.`,
    basedOn: `action "${title(ctx, action)}", potential score, segment size, price level`,
    links: [link.action(action.id)],
  };
};

H['action.evidence'] = (ctx, c) => {
  const { m } = ctx;
  const { acct, action, none } = needAction(ctx, c, 'evidence');
  if (none) return none;
  const ev = m.outcome(action.id)?.evidence;
  return {
    text: `What the agent saw: ${ctx.t(action.saw, action.vars)} Compared against: ${ctx.t(action.compared, action.vars)} ${ev ? `Your ${EVIDENCE[action.evidence].label.toLowerCase()} is recorded.` : `To mark it done you need to capture a ${EVIDENCE[action.evidence].label.toLowerCase()}.`}`,
    basedOn: `action "${title(ctx, action)}" for ${acct.name}, its saw and compared lines, recorded evidence`,
    links: [link.action(action.id)],
  };
};

H['action.effort'] = (ctx, c) => {
  const { acct, action, none } = needAction(ctx, c, 'effort');
  if (none) return none;
  const p = ctx.m.plannedFor(acct.id);
  const used = (p?.actions || []).filter((x) => x.rank <= action.rank).reduce((s, x) => s + x.effort, 0);
  return {
    text: `About ${action.effort} minutes. The {visit} budget at ${acct.name} is ${acct.visitMinutes} minutes. With the higher-ranked actions included, this one brings the total to ${used} minutes, ${used > acct.visitMinutes ? 'which is over budget, so it is marked "If time allows"' : 'which fits the budget'}.`,
    basedOn: `action "${title(ctx, action)}", the time budget of ${acct.name}`,
    links: [link.brief(acct.id)],
  };
};

H['action.guardrail'] = (ctx, c) => {
  const { industry } = ctx;
  const { action, none } = needAction(ctx, c, 'guardrail');
  if (none) return none;
  const def = industry.actions.find((x) => x.id === action.defId);
  const g = industry.guardrails.filter((x) => x.agent === action.agent || x.agent === 'all');
  return {
    text: `${def.guardrail ? `${def.guardrail} ` : ''}${g.map((x) => x.text).join(' ')}`,
    basedOn: `the guardrails of the ${AGENT_LABEL[action.agent]} and the action's own limit`,
    links: [link.agents()],
  };
};

H['action.talk'] = (ctx, c) => {
  const { acct, action, none } = needAction(ctx, c, 'talking points');
  if (none) return none;
  const def = ctx.industry.actions.find((x) => x.id === action.defId);
  return {
    text: `For ${acct.contacts[0].name}: ${def.talk.map((x) => ctx.t(x, action.vars)).join(' ')}`,
    basedOn: `the talking points of action "${title(ctx, action)}"`,
    links: [link.action(action.id)],
  };
};

// ---- Order -----------------------------------------------------------------
H['order.why'] = (ctx, c) => {
  const { fmt, m } = ctx;
  const { acct } = focus(ctx, c);
  const lines = m.orderLines(acct.id);
  const rows = lines.slice(0, 3).map((l) => `${ctx.t(l.offering.name)}: ${ctx.t(l.reason, l.vars).replace(/\.$/, '')}`);
  return {
    text: lines.length ? `The Order agent drafted ${plural(lines.length, 'line', 'lines')} from the last {orders}, the open gaps and the {offering} status. ${rows.join('. ')}. Total ${fmt.money(lines.reduce((s, l) => s + l.total, 0))}${lines.some((l) => l.unitPrice == null) ? ' for the priced lines. Some lines are priced by people, not the agent' : ''}.` : 'There is no draft for this {account}.',
    basedOn: `the {order} draft for ${acct.name}, ${plural(lines.length, 'line', 'lines')}`,
    links: [link.order(acct.id)],
  };
};

H['order.blocking'] = (ctx, c) => {
  const { fmt, m } = ctx;
  const { acct } = focus(ctx, c);
  const rules = m.orderRules(acct.id);
  const blocking = rules.filter((r) => r.triggered && r.blocks);
  const st = m.orderState(acct.id);
  const stopped = m.agentStopped('order');
  const rv = (r) => ctx.t(r.text, { limit: r.detail.limit != null ? fmt.money(r.detail.limit) : '', max: r.max ?? '', lines: (r.detail.lines || []).join(', ') });
  let text;
  let links = [link.order(acct.id)];
  if (st.submitted) text = st.needsApproval ? `Already sent. It is pending approval with your ${ctx.t(roleOf(ctx, st.route))}.` : 'Already submitted.';
  else if (stopped) text = 'The Order agent is stopped. You can still edit the draft, but sending is paused until you resume it.';
  else if (blocking.length) {
    text = `Sending is blocked. ${blocking.map(rv).join(' ')}`;
    const pre = blocking.find((r) => r.kind === 'prerequisite' && r.detail.actionId);
    if (pre) links = [link.action(pre.detail.actionId), ...links];
  } else {
    const route = m.approvalRoute(acct.id);
    text = route ? `Nothing blocks it. It needs approval from your ${ctx.t(roleOf(ctx, route))} when you send.` : 'Nothing blocks it. You can submit it now.';
  }
  return { text, basedOn: `the rules on the {order} for ${acct.name}, the state of the Order agent, this session`, links };
};

H['order.rule'] = (ctx, c) => {
  const { fmt, m } = ctx;
  const { acct } = focus(ctx, c);
  const rules = m.orderRules(acct.id);
  const rows = rules.map((r) => {
    const state = r.kind === 'info' ? 'Rule' : r.triggered ? (r.blocks ? 'Blocking' : 'Applies now') : 'Not triggered';
    return `${state}: ${ctx.t(r.text, { limit: r.detail.limit != null ? fmt.money(r.detail.limit) : r.amount != null ? fmt.money(r.amount) : '', max: r.max ?? '', lines: (r.detail.lines || []).join(', ') })}`;
  });
  return { text: rows.join(' '), basedOn: `the {order} rules in this pack, current quantities for ${acct.name}`, links: [link.order(acct.id)] };
};

H['order.edit'] = (ctx, c) => {
  const { fmt, m } = ctx;
  const { acct } = focus(ctx, c);
  const lines = m.orderLines(acct.id);
  const total = lines.reduce((s, l) => s + l.total, 0);
  const limit = m.orderRules(acct.id).find((r) => r.kind === 'totalAbove')?.detail.limit;
  const route = m.approvalRoute(acct.id);
  return {
    text: `Changing a quantity updates the line total, the {order} total and every rule at once. The total is now ${fmt.money(total)}${limit != null ? `; the approval limit is ${fmt.money(limit)}` : ''}. ${route ? `It currently needs approval from your ${ctx.t(roleOf(ctx, route))}.` : 'It currently needs no approval.'} Lines you change are marked, and nothing is sent until you submit.`,
    basedOn: `the {order} draft for ${acct.name}, current quantities and rules`,
    links: [link.order(acct.id)],
  };
};

// ---- Visit complete --------------------------------------------------------
H['complete.log'] = (ctx, c) => {
  const { m } = ctx;
  const { acct } = focus(ctx, c);
  const s = m.visitSummary(acct.id);
  const open = s.items.filter((x) => !m.outcome(x.id)?.status);
  return {
    text: `Record an outcome for each action: done with its evidence, or not done with a reason. ${open.length ? `${plural(open.length, 'action has', 'actions have')} no outcome yet: ${list(open.slice(0, 3).map((x) => `"${title(ctx, x)}"`))}${open.length > 3 ? ' and more' : ''}.` : 'Every action has an outcome.'} Closing the {visit} does not mark anything done for you.`,
    basedOn: `the actions and outcomes at ${acct.name}`,
    links: open[0] ? [link.action(open[0].id)] : [link.complete(acct.id)],
  };
};

H['complete.carry'] = (ctx, c) => {
  const { m } = ctx;
  const { acct } = focus(ctx, c);
  const s = m.visitSummary(acct.id);
  const notDone = s.items.filter((x) => m.outcome(x.id)?.status === 'not_done');
  const open = s.items.filter((x) => !m.outcome(x.id)?.status);
  const overridden = s.items.filter((x) => m.decision(x.id)?.status === 'overridden');
  const bits = [];
  if (open.length) bits.push(`${plural(open.length, 'action', 'actions')} with no outcome`);
  if (notDone.length) bits.push(`${plural(notDone.length, 'action', 'actions')} not done`);
  if (overridden.length) bits.push(`${plural(overridden.length, 'override', 'overrides')} for your {manager} to see`);
  if (s.needsApproval) bits.push('a {order} pending approval');
  return {
    text: bits.length ? `Carrying to the next {visit}: ${list(bits)}. Open gaps stay on the {account} until an outcome is recorded.` : 'Nothing carries over. Every action is done and nothing is waiting on approval.',
    basedOn: `outcomes, overrides and the {order} state at ${acct.name}`,
    links: [link.account(acct.id)],
  };
};

H['complete.manager'] = (ctx, c) => {
  const { m, data } = ctx;
  const { acct } = focus(ctx, c);
  const mine = m.exceptions().filter((e) => e.live && e.account === acct.name);
  return {
    text: mine.length ? `Your {manager} sees ${plural(mine.length, 'item', 'items')} from this {account} in the exception queue: ${list(mine.map((e) => `${e.kind === 'approval' ? 'a pending approval' : e.kind === 'blocked' ? 'a blocked action' : 'an override'} ("${reasonLabel(ctx, e)}")`))}. They also see the team figures and any note you added.` : `Nothing from this {account} is in the exception queue. Your {manager} sees ${data.rep.name}'s {visit} count and estimated opportunity addressed, not a ranking of {reps}.`,
    basedOn: `the exception queue, this session, ${acct.name}`,
    links: [link.account(acct.id)],
  };
};

// ---- Route -----------------------------------------------------------------
H['route.why'] = (ctx) => {
  const { fmt, data, m } = ctx;
  const stops = data.planned.filter((p) => !m.closedToday(p.accountId)).sort((a, b) => a.seq - b.seq).slice(0, 3);
  return {
    text: `The Visit Planner orders {visits} by opening hours and travel, not by value. Among {accounts} that are open on arrival it takes the one that closes soonest. The first stops are ${list(stops.map((p) => `${data.byId[p.accountId].name} at ${fmt.time(p.start)}`))}. It never plans a {visit} that ends after closing.`,
    basedOn: `opening hours, straight-line travel time, ${plural(data.planned.length, 'stop', 'stops')}`,
    links: [link.route()],
  };
};

H['route.skip'] = (ctx) => {
  const { data, m } = ctx;
  const closed = data.planned.filter((p) => m.closedToday(p.accountId));
  return {
    text: `Use "Mark closed today" on that stop. The Visit Planner re-plans the rest with the same rules and the route shows a notice. ${closed.length ? `Right now ${plural(closed.length, 'stop is', 'stops are')} closed today.` : 'Nothing is closed today.'} You can reopen a stop at any time. The brief for a skipped {account} stays available.`,
    basedOn: `the route plan, this session`,
    links: [link.route()],
  };
};

H['route.late'] = (ctx) => {
  const { fmt, data, m } = ctx;
  const stops = data.planned.filter((p) => !m.closedToday(p.accountId) && !m.visitDone(p.accountId));
  if (!stops.length) return { text: 'Every stop is done or closed, so nothing can run late.', basedOn: 'the route plan', links: [link.route()] };
  const slack = stops.map((p) => ({ p, a: data.byId[p.accountId], slack: data.byId[p.accountId].hours[1] - data.byId[p.accountId].visitMinutes - p.start })).sort((x, y) => x.slack - y.slack)[0];
  return {
    text: `The tightest stop is ${slack.a.name}. It is planned for ${fmt.time(slack.p.start)} and has about ${Math.max(0, slack.slack)} minutes of slack before it must start to finish by closing at ${fmt.time(slack.a.hours[1])}. If you run later than that, mark it closed today or move it to tomorrow; the Visit Planner re-plans the rest.`,
    basedOn: `planned start times, opening hours and visit budgets of ${plural(stops.length, 'remaining stop', 'remaining stops')}`,
    links: [link.route()],
  };
};

// ---- Manager ---------------------------------------------------------------
const liveFirst = (ctx) => ctx.m.exceptions().filter((e) => !e.acknowledged).sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));

H['mgr.attention'] = (ctx) => {
  const open = liveFirst(ctx);
  if (!open.length) return { text: 'No items need review. Every exception is acknowledged.', basedOn: 'the exception queue', links: [link.manager()] };
  const rows = open.slice(0, 4).map((e) => `${e.account}: ${ctx.t(e.title, e.vars)}. Reason: ${reasonLabel(ctx, e)}${e.note ? `. Note: ${e.note}` : ''}. Routed to ${ctx.t(roleOf(ctx, e.route))}`);
  const live = open.filter((e) => e.live).length;
  return {
    text: `${plural(open.length, 'item needs', 'items need')} review${live ? `, ${live} raised in this session` : ''}. ${rows.join('. ')}.`,
    basedOn: `the exception queue, ${plural(open.length, 'open item', 'open items')}, reasons and notes`,
    links: [link.manager()],
  };
};

H['mgr.drift'] = (ctx) => {
  const { data, m } = ctx;
  const self = m.selfStats();
  const reps = data.reps.map((r) => (r.self ? { ...r, done: self.done, overrides: self.overrides } : r));
  const behind = reps.slice().sort((a, b) => a.done / a.planned - b.done / b.planned).slice(0, 2);
  const over = reps.slice().sort((a, b) => b.overrides - a.overrides)[0];
  return {
    text: `Furthest behind on planned {visits}: ${list(behind.map((r) => `${r.name} (${r.done} of ${r.planned})`))}. Most overrides: ${over.name} (${over.overrides}). Treat these as prompts for a conversation. Overrides are feedback, and a number alone does not say who is right.`,
    basedOn: `${plural(reps.length, '{rep}', '{reps}')}, planned versus done {visits}, overrides`,
    links: [link.manager()],
  };
};

const reasonCounts = (ctx) => {
  const by = {};
  for (const e of ctx.m.exceptions()) (by[e.reason] ||= []).push(e);
  return Object.entries(by).sort((a, b) => b[1].length - a[1].length);
};

H['mgr.coach'] = (ctx) => {
  const top = reasonCounts(ctx).slice(0, 2);
  if (!top.length) return { text: 'There are no patterns to coach on yet.', basedOn: 'the exception queue', links: [link.manager()] };
  const rows = top.map(([reason, l]) => {
    const e = l[0];
    const ask = /data looks wrong/i.test(reason) ? 'check the data source with sales ops' : e.kind === 'blocked' ? 'remove the blocker with the {rep}' : e.kind === 'approval' ? 'decide quickly so the {rep} can confirm' : 'ask what the agent is missing';
    return `${l.length} × "${ctx.t(reason, { limit: '', max: '', lines: '' })}": ${ask}`;
  });
  return { text: `Coaching prompts from patterns. ${rows.join('. ')}. These are for conversations, not a leaderboard.`, basedOn: `reasons across ${plural(ctx.m.exceptions().length, 'exception', 'exceptions')}`, links: [link.manager()] };
};

H['mgr.patterns'] = (ctx) => {
  const rc = reasonCounts(ctx);
  return {
    text: rc.length ? `Reasons so far: ${list(rc.slice(0, 4).map(([r, l]) => `"${ctx.t(r, { limit: '', max: '', lines: '' })}" (${l.length})`))}. A reason that repeats across {reps} usually points at a rule, a data issue or a missing option, not at one person.` : 'No reasons recorded yet.',
    basedOn: `reasons on ${plural(ctx.m.exceptions().length, 'exception', 'exceptions')}`,
    links: [link.manager()],
  };
};

// ---- Agents ----------------------------------------------------------------
H['agents.what'] = (ctx) => {
  const lower = (x) => x.replace(/^(\w)/, (m) => m.toLowerCase());
  const rows = ctx.data.agents.map((ag) => `${ag.name} (level ${ag.level} of 4, owner ${ag.owner.name}) handles ${lower(SCOPE[ag.id].scope).replace(/\.$/, '')}`);
  return { text: `${rows.join('. ')}. Authority starts narrow, grows on evidence and can be withdrawn.`, basedOn: 'the three agents, their scope, owners and authority levels', links: [link.agents()] };
};

H['agents.cannot'] = (ctx) => {
  const never = [...new Set(Object.values(SCOPE).flatMap((s) => s.never))];
  return {
    text: `Never an agent's call: ${list(never.slice(0, 4).map((x) => x.replace(/\.$/, '')))}. In this pack: ${ctx.industry.guardrails.map((g) => g.text).join(' ')}`,
    basedOn: `the "never" limits of the agents and the ${ctx.industry.name} guardrails`,
    links: [link.agents()],
  };
};

H['agents.stop'] = (ctx) => {
  const { m, data } = ctx;
  const stopped = data.agents.filter((a) => m.agentStopped(a.id)).map((a) => a.name);
  return {
    text: `Stop takes effect at once. The agent's items show as paused in every brief and do not count in the review totals. Stopping the Order agent also pauses sending; drafts stay editable. Resume brings everything back, and the stop is written to the audit log. ${stopped.length ? `Stopped right now: ${list(stopped)}.` : 'All three agents are running.'}`,
    basedOn: 'agent controls, this session, the audit log',
    links: [link.agents()],
  };
};

// ---- Configuration and problems --------------------------------------------
H['config.explain'] = (ctx) => {
  const { industry, country, data } = ctx;
  return {
    text: `This is the ${industry.name} pack with the ${country.name} pack. The pack sets the words (${data.rep.title}, {accounts}, {contacts}), ${industry.segments.length} segments, ${industry.actions.length} action types, ${industry.offerings.length} {offerings}, ${industry.kpis.length} KPIs and the guardrails. The country pack sets currency, dates, distances, names and cities. The workflow is the same in every pack: that is a configuration, not a custom build.`,
    basedOn: `the ${industry.name} and ${country.name} packs`,
    links: [link.config()],
  };
};

H['config.vocab'] = (ctx) => {
  const v = ctx.industry.vocab;
  return { text: `In this pack: account is "${v.account}", contact is "${v.contact}", rep is "${v.rep}", manager is "${v.manager}", offering is "${v.offering}", order is "${v.order}" and visit is "${v.visit}". Every screen uses these words.`, basedOn: `the vocabulary of the ${ctx.industry.name} pack`, links: [link.config()] };
};

H['config.country'] = (ctx) => {
  const { country, fmt } = ctx;
  return { text: `${country.name} sets the currency (${country.currency}, for example ${fmt.money(1234567)}), the date format (${fmt.date(fmt.today)}), distances in ${country.distance === 'mi' ? 'miles' : 'kilometres'}, names, cities, local events and a price level. Prices are not exchange rates.`, basedOn: `the ${country.name} pack`, links: [link.config()] };
};

H['config.add'] = (ctx) => ({
  text: 'To add an industry, add one file in src/packs/industries/ with the words, segments, {offerings}, actions, KPIs, guardrails, problems and assistant content, then register it in src/packs/index.js and run the tests. The validator names anything missing. A country is the same with one file in src/packs/countries/. No screen code changes.',
  basedOn: 'the pack schema and README',
  links: [link.config()],
});

H['problems.map'] = (ctx) => ({
  text: ctx.industry.problems.map((p, i) => `${i + 1}. ${p.title} maps to ${CAPABILITIES[p.capability].name}`).join('. ') + '.',
  basedOn: `the ${ctx.industry.problems.length} problems of the ${ctx.industry.name} pack`,
  links: [{ label: 'Open Problems we solve', href: '#/problems' }],
});

H['problems.prove'] = () => ({
  text: 'Measure adoption (recommendations acted on, overrides with a reason), execution (action completion, time with the {contact}), commercial result (against matched control territories) and finally contribution after costs. No numbers are claimed before a pilot. Targets are set per customer.',
  basedOn: 'PRD section 3, success measures',
  links: [],
});

// ---- Global ----------------------------------------------------------------
H['global.target'] = (ctx) => {
  const { fmt, data, industry, m } = ctx;
  const k = industry.kpis.find((x) => x.id === data.territory.headlineKpi.id);
  const est = m.selfStats().estimated;
  return {
    text: `Month to date: ${fmt.money(data.territory.achieved)} of ${fmt.money(data.territory.target)}, from sales records. ${ctx.t(k.label)} is ${data.territory.headlineKpi.value}${k.format === 'pct' ? '%' : ''} against a target of ${k.target}${k.format === 'pct' ? '%' : ''}.${est ? ` Actions done today address an estimated ${fmt.money(est)} of opportunity. That is an estimate, not sales.` : ''}`,
    basedOn: 'month-to-date sales records and the headline KPI',
    links: [link.today()],
  };
};

H['global.coverage'] = (ctx) => {
  const { data, m } = ctx;
  const gap = data.accounts.filter((a) => a.tier === 'A').sort((a, b) => m.lastVisitDays(b.id) - m.lastVisitDays(a.id)).slice(0, 3);
  return {
    text: `Tier A {accounts} with the longest gap: ${list(gap.map((a) => `${a.name} (${m.lastVisitDays(a.id)} days)`))}. The coverage list on the manager screen uses 21 days.`,
    basedOn: `last {visit} dates of ${plural(data.accounts.length, '{account}', '{accounts}')}, counting {visits} closed in this session`,
    links: [link.manager()],
  };
};

H['global.blocked'] = (ctx) => {
  const { data, m, fmt } = ctx;
  const rows = data.planned.flatMap((p) => m.orderRules(p.accountId).filter((r) => r.triggered && r.blocks).map((r) => `${data.byId[p.accountId].name}: ${ctx.t(r.text, { limit: '', max: r.max ?? '', lines: (r.detail.lines || []).join(', ') })}`));
  return {
    text: rows.length ? `These {orders} cannot be sent yet. ${rows.slice(0, 3).join(' ')}` : "No {order} on today's plan is blocked right now.",
    basedOn: `the {order} rules for ${plural(data.planned.length, '{account}', '{accounts}')} on today's plan`,
    links: [link.today()],
  };
};

H['global.talk'] = (ctx, c) => {
  const { acct } = focus(ctx, c);
  return { text: `${ctx.t(ctx.industry.assistantAnswers.talkToContact)} Main {contact} here: ${acct.contacts[0].name}, ${ctx.t(acct.contacts[0].role)}. ${ctx.t(acct.contacts[0].preference)}.`, basedOn: `${ctx.industry.name} pack guidance, the {contacts} of ${acct.name}`, links: [link.account(acct.id)] };
};

H['global.goodvisit'] = (ctx) => ({ text: ctx.t(ctx.industry.assistantAnswers.goodVisit), basedOn: `${ctx.industry.name} pack guidance`, links: [link.today()] });

// ---- Navigation (never acts for the user) ------------------------------------
H['nav.biggestgap'] = (ctx) => {
  const { fmt, data } = ctx;
  const a = data.planned.map((p) => data.byId[p.accountId]).sort((x, y) => y.whiteSpace - x.whiteSpace)[0];
  return {
    text: `On today's plan, ${a.name} has the biggest estimated gap: ${fmt.moneyShort(a.whiteSpace)} a year of white space. Opening its Account 360.`,
    basedOn: `white space of ${plural(data.planned.length, '{account}', '{accounts}')} on today's plan`,
    links: [link.account(a.id)],
    go: `#/account/${a.id}`,
  };
};

H['nav.draftorder'] = (ctx, c) => {
  const { acct } = focus(ctx, c);
  const lines = ctx.m.orderLines(acct.id);
  return {
    text: `The Order agent's draft for ${acct.name} has ${plural(lines.length, 'suggested line', 'suggested lines')}. Opening the builder. Nothing is sent: you review the lines and confirm.`,
    basedOn: `the {order} draft for ${acct.name}`,
    links: [link.order(acct.id)],
    go: `#/order/${acct.id}`,
  };
};

// ---- Setup (About this demo) -------------------------------------------------
export const ABOUT = {
  'about.what': { text: 'AI Assistor Sales Execution plans each field rep\'s day, ranks what to do in every visit, drafts the order or proposal, and shows managers what happened. Agents prepare, the rep approves, adjusts or overrides, and a person owns the result.', basedOn: 'the product description' },
  'about.sample': { text: 'No. Every name, place, product and number is generated demonstration data, and the products and accounts are fictional. No result is claimed before a pilot.', basedOn: 'the demo data rules' },
  'about.config': { text: 'Pick an industry and a country. The words, segments, actions, KPIs, guardrails, currency, dates and cities all come from configuration. The workflow stays the same in every industry, so it reads as one product with different words.', basedOn: 'the industry and country packs' },
  'about.custom': { text: 'A new industry or country is one configuration file, not a custom build. Real integrations, such as a CRM, are a separate step and are not part of this prototype.', basedOn: 'the product scope' },
};
export const ABOUT_QUESTIONS = [
  { q: 'What is AI Assistor?', intent: 'about.what' },
  { q: 'Is this real data?', intent: 'about.sample' },
  { q: 'How does it change for my industry?', intent: 'about.config' },
];

export default H;
