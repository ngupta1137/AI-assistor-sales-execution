// Session state: what the rep and manager did in this demo session.
// Generated data is immutable; everything a person does lives here, keyed per
// industry + country, so switching packs and back keeps the story intact.

import { localPrice } from '../data/generate.js';

const sessions = new Map();

export function resetSessions() { sessions.clear(); }

function newSession() {
  return {
    decisions: {},     // actionId -> { status, reason, note, priority, at }
    outcomes: {},      // actionId -> { status: 'done'|'not_done', reason, evidence }
    orders: {},        // accountId -> { qty: { offeringId: n }, submitted, needsApproval, rule }
    visits: {},        // accountId -> { done: true, at }
    stopped: {},       // agentId -> true
    exceptions: [],    // live exceptions raised in this session
    acknowledged: {},  // exceptionId -> true
    closed: {},        // accountId -> true when the account is closed today (route re-plan)
    audit: [],         // { at, actor, text } newest first
    seq: 0,
  };
}

export function getSession(key) {
  if (!sessions.has(key)) sessions.set(key, newSession());
  return sessions.get(key);
}

/** Minutes after midnight, for timestamps shown in the exception queue. */
const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

export function createModel(ctx) {
  const { industry, country, data } = ctx;
  const s = getSession(data.seedKey);

  const plannedFor = (accountId) => data.planned.find((p) => p.accountId === accountId);
  const AGENT_NAME = { planner: 'Visit Planner', gap: 'Gap agent', order: 'Order agent' };
  /** Audit trail (G3): who did what, in plain words. */
  const log = (actor, text) => { s.audit.unshift({ at: nowMinutes(), actor, text }); if (s.audit.length > 200) s.audit.pop(); };
  const itemText = (item) => `"${ctx.t(item.title, item.vars)}" at ${data.byId[item.accountId].name}`;
  const agentStopped = (agentId) => !!s.stopped[agentId];

  /** All brief items: planner slot, ranked actions, order draft. */
  const briefItems = (accountId) => plannedFor(accountId)?.brief || [];
  /** Only the in-visit actions (these carry outcomes and evidence). */
  const actionsOf = (accountId) => plannedFor(accountId)?.actions || [];

  const decision = (id) => s.decisions[id];
  const decide = (id, d) => {
    s.decisions[id] = { ...d, at: nowMinutes() };
    const it = findAction(id);
    log(data.rep.name, d.status === 'approved' ? `Approved ${itemText(it)}` : d.status === 'adjusted' ? `Adjusted ${itemText(it)}: ${ctx.t(d.choice)}` : `Overrode ${itemText(it)}. Reason: ${ctx.t(d.reason)}`);
    if (d.status === 'overridden') {
      const item = findAction(id);
      const acc = data.byId[item.accountId];
      const reason = industry.overrideReasons.find((r) => r.label === d.reason) || {};
      s.exceptions = s.exceptions.filter((e) => e.sourceId !== id);
      s.exceptions.unshift({
        id: `L${++s.seq}`, sourceId: id, live: true, kind: 'override', rep: data.rep.name, account: acc.name, key: acc.key,
        title: item.title, vars: item.vars, reason: d.reason, note: d.note || '',
        route: reason.route === 'kam' || (acc.key && acc.tier === 'A') ? 'kam' : 'manager', at: nowMinutes(),
      });
    } else {
      s.exceptions = s.exceptions.filter((e) => e.sourceId !== id);
    }
  };
  const undo = (id) => { log(data.rep.name, `Undid the decision on ${itemText(findAction(id))}`); delete s.decisions[id]; s.exceptions = s.exceptions.filter((e) => e.sourceId !== id); };

  function findAction(id) {
    for (const p of data.planned) { const x = p.brief.find((a) => a.id === id); if (x) return x; }
    return null;
  }

  /** Live counts for the visit brief. Items from stopped agents are paused and not counted. */
  const counts = (accountId) => {
    const items = briefItems(accountId).filter((x) => !agentStopped(x.agent));
    const c = { total: items.length, approved: 0, adjusted: 0, overridden: 0, pending: 0, paused: briefItems(accountId).length - items.length };
    for (const it of items) {
      const d = s.decisions[it.id];
      if (!d) c.pending++; else c[d.status]++;
    }
    return c;
  };

  const outcome = (id) => s.outcomes[id];
  const recordOutcome = (id, o) => {
    s.outcomes[id] = { ...(s.outcomes[id] || {}), ...o };
    const item = findAction(id);
    if (o.status) log(data.rep.name, o.status === 'done' ? `Marked done: ${itemText(item)}` : `Not done: ${itemText(item)}. Reason: ${ctx.t(o.reason)}`);
    s.exceptions = s.exceptions.filter((e) => e.sourceId !== `${id}#blocked`);
    if (o.status === 'not_done') {
      const r = industry.outcomeReasons.find((x) => x.label === o.reason);
      if (r && r.blocked) {
        const acc = data.byId[item.accountId];
        s.exceptions.unshift({
          id: `L${++s.seq}`, sourceId: `${id}#blocked`, live: true, kind: 'blocked', rep: data.rep.name, account: acc.name, key: acc.key,
          title: item.title, vars: item.vars, reason: o.reason, note: '',
          route: r.route === 'kam' ? 'kam' : 'manager', at: nowMinutes(),
        });
      }
    }
  };
  const setEvidence = (id, ev) => {
    s.outcomes[id] = { ...(s.outcomes[id] || {}), evidence: ev };
    log(data.rep.name, `Added ${ev.type} evidence to ${itemText(findAction(id))}`);
  };

  // ---- Orders ----
  const orderState = (accountId) => {
    if (!s.orders[accountId]) {
      const p = plannedFor(accountId);
      s.orders[accountId] = { qty: Object.fromEntries((p ? p.order : []).map((l) => [l.offeringId, l.suggested])), submitted: false };
    }
    return s.orders[accountId];
  };
  const orderLines = (accountId) => {
    const p = plannedFor(accountId);
    const st = orderState(accountId);
    return (p ? p.order : []).map((l) => {
      const o = industry.offerings.find((x) => x.id === l.offeringId);
      const unitPrice = localPrice(o.price, country);
      const qty = st.qty[l.offeringId] ?? l.suggested;
      return { ...l, offering: o, unitPrice, qty, total: unitPrice == null ? 0 : unitPrice * qty, changed: qty !== l.suggested };
    });
  };
  /** Evaluates the pack's order rules against the current lines. */
  const orderRules = (accountId) => {
    const lines = orderLines(accountId);
    const total = lines.reduce((sum, l) => sum + l.total, 0);
    return industry.orderRules.map((r) => {
      let triggered = false;
      let detail = {};
      if (r.kind === 'totalAbove') {
        const limit = localPrice(r.amount, country);
        triggered = total > limit;
        detail = { limit };
      } else if (r.kind === 'lineMax') {
        const over = lines.filter((l) => (l.offering.kind === r.appliesTo || l.offering.status === r.appliesTo) && l.qty > r.max);
        triggered = over.length > 0;
        detail = { lines: over.map((l) => l.offering.name) };
      } else if (r.kind === 'humanPrice') {
        triggered = lines.some((l) => l.unitPrice == null && l.qty > 0);
      }
      return { ...r, triggered, detail, blocks: r.kind === 'lineMax' };
    });
  };
  const setQty = (accountId, offeringId, qty) => { orderState(accountId).qty[offeringId] = Math.max(0, Math.min(999, qty)); };
  const submitOrder = (accountId) => {
    const st = orderState(accountId);
    const rules = orderRules(accountId).filter((r) => r.triggered && (r.kind === 'totalAbove' || r.kind === 'humanPrice'));
    st.submitted = true;
    st.needsApproval = rules.length > 0;
    log(data.rep.name, ctx.t(`${st.needsApproval ? 'Sent for approval' : 'Submitted'}: {order} for ${data.byId[accountId].name}`));
    s.exceptions = s.exceptions.filter((e) => e.sourceId !== `order:${accountId}`);
    if (st.needsApproval) {
      const acc = data.byId[accountId];
      s.exceptions.unshift({
        id: `L${++s.seq}`, sourceId: `order:${accountId}`, live: true, kind: 'approval', rep: data.rep.name, account: acc.name, key: acc.key,
        title: '{Order} needs approval', vars: {}, reason: rules[0].text, ruleVars: rules[0].detail, note: '',
        route: rules[0].route === 'kam' ? 'kam' : 'manager', at: nowMinutes(),
      });
    }
  };

  // ---- Visits ----
  const visitDone = (accountId) => !!s.visits[accountId];
  const completeVisit = (accountId) => { s.visits[accountId] = { done: true, at: nowMinutes() }; log(data.rep.name, ctx.t(`Closed the {visit} at ${data.byId[accountId].name}`)); };
  const closedToday = (accountId) => !!s.closed[accountId];
  const toggleClosed = (accountId) => {
    s.closed[accountId] = !s.closed[accountId];
    log(data.rep.name, ctx.t(`${s.closed[accountId] ? 'Marked closed today' : 'Reopened'}: ${data.byId[accountId].name}. The Visit Planner re-planned the route.`));
  };
  const visitSummary = (accountId) => {
    const items = actionsOf(accountId);
    const done = items.filter((x) => s.outcomes[x.id]?.status === 'done');
    const notDone = items.filter((x) => s.outcomes[x.id]?.status === 'not_done');
    const lines = orderLines(accountId);
    const st = orderState(accountId);
    const orderTotal = st.submitted ? lines.reduce((a, l) => a + l.total, 0) : 0;
    return { items, done, notDone, value: done.reduce((a, x) => a + x.value, 0), orderTotal, orderSubmitted: st.submitted, needsApproval: !!st.needsApproval };
  };

  const nextAccount = (afterId) => {
    const order = data.planned.slice().sort((a, b) => a.rank - b.rank);
    return order.find((p) => p.accountId !== afterId && !visitDone(p.accountId) && !s.closed[p.accountId]);
  };

  const selfStats = () => {
    let actionsDone = 0;
    let value = 0;
    for (const p of data.planned) {
      const v = visitSummary(p.accountId);
      actionsDone += v.done.length;
      value += v.value;
    }
    const overrides = Object.values(s.decisions).filter((d) => d.status === 'overridden').length;
    return { done: data.planned.filter((p) => visitDone(p.accountId)).length, actionsDone, value, overrides };
  };

  const exceptions = () => [...s.exceptions, ...data.exceptions].map((e) => ({ ...e, acknowledged: !!s.acknowledged[e.id] }));
  const acknowledge = (id) => { s.acknowledged[id] = true; log(data.manager.name, `Acknowledged an exception`); };

  const toggleAgent = (id) => {
    s.stopped[id] = !s.stopped[id];
    log(ctx.persona === 'manager' ? data.manager.name : ctx.persona === 'admin' ? data.admin.name : data.rep.name, `${s.stopped[id] ? 'Stopped' : 'Resumed'} the ${AGENT_NAME[id]}`);
  };

  return {
    session: s, plannedFor, briefItems, actionsOf, findAction, decision, decide, undo, counts, outcome, recordOutcome, setEvidence,
    orderLines, orderRules, orderState, setQty, submitOrder, visitDone, completeVisit, visitSummary, nextAccount,
    selfStats, exceptions, acknowledge, agentStopped, toggleAgent, closedToday, toggleClosed, audit: () => s.audit,
  };
}
