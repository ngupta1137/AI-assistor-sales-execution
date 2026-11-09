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
    govOutcomes: {},    // itemId -> { outcome, choice, refreshedAt }
    flags: {},          // itemId -> { reason, note, owner, at }
    gapBacklog: [],     // [{ id, sourceId, title, accountName, reason, note, owner, ageDays, demand, claimed }]
    exactWordingRead: {},// ruleId -> true
    retiredRules: {},   // ruleId -> { approver, reason, at }
    forcedCase: null,   // { name, outcome, targetId } for Try a case (G11)
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
  /** Public audit entry, used by the assistant for refusals (actor and screen are part of the text). */
  const logAudit = (actor, text) => log(actor, text);

  /** All brief items: planner slot, ranked actions, order draft. */
  const briefItems = (accountId) => plannedFor(accountId)?.brief || [];
  /** Only the in-visit actions (these carry outcomes and evidence). */
  const actionsOf = (accountId) => plannedFor(accountId)?.actions || [];

  const decision = (id) => s.decisions[id];
  /** meta: { persona, screen } of where the decision was made. Overrides and refusals both record it. */
  const decide = (id, d, meta) => {
    s.decisions[id] = { ...d, at: nowMinutes() };
    if (ctx.app?.offline) (ctx.app.offlineQueue ||= []).push({ type: 'decision', id, status: d.status, at: nowMinutes() });
    const it = findAction(id);
    const where = meta ? ` (${meta.persona}, ${meta.screen} screen)` : '';
    log(data.rep.name, d.status === 'approved' ? `Approved ${itemText(it)}` : d.status === 'adjusted' ? `Adjusted ${itemText(it)}: ${ctx.t(d.choice)}` : `Overrode ${itemText(it)}. Reason: ${ctx.t(d.reason)}${where}`);
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
    if (ctx.app?.offline) (ctx.app.offlineQueue ||= []).push({ type: 'outcome', id, status: o.status, at: nowMinutes() });
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
      } else if (r.kind === 'prerequisite') {
        const applies = lines.some((l) => l.qty > 0 && (r.appliesTo === 'humanPrice' ? l.offering.price === null
          : [l.offering.status, l.offering.category, l.offering.kind].includes(r.appliesTo)));
        const action = actionsOf(accountId).find((x) => x.defId === r.action);
        const out = action && s.outcomes[action.id];
        const met = !!(out && out.status === 'done' && out.evidence?.type === r.evidence);
        triggered = applies && !met;
        detail = { actionId: action?.id || null, met, applies };
      }
      return { ...r, triggered, detail, blocks: r.kind === 'lineMax' || r.kind === 'prerequisite' };
    });
  };
  /** Who an {order} goes to for approval: the first triggered approval rule decides, as in the queue. */
  const approvalRoute = (accountId) => {
    const r = orderRules(accountId).find((x) => x.triggered && (x.kind === 'totalAbove' || x.kind === 'humanPrice'));
    return r ? (r.route === 'kam' ? 'kam' : 'manager') : null;
  };
  const setQty = (accountId, offeringId, qty) => {
    const st = orderState(accountId);
    if (st.submitted || !Number.isInteger(qty)) return false;
    st.qty[offeringId] = Math.max(0, Math.min(999, qty));
    return true;
  };
  /** Re-checks every rule here, not only in the button: blocked rules or a stopped Order agent refuse the submit. */
  const submitOrder = (accountId) => {
    const st = orderState(accountId);
    const all = orderRules(accountId);
    const blocking = all.filter((r) => r.triggered && r.blocks);
    if (st.submitted || blocking.length || agentStopped('order')) return { ok: false, blocking };
    const rules = all.filter((r) => r.triggered && (r.kind === 'totalAbove' || r.kind === 'humanPrice'));
    st.submitted = true;
    st.needsApproval = rules.length > 0;
    if (ctx.app?.offline) (ctx.app.offlineQueue ||= []).push({ type: 'order', accountId, at: nowMinutes() });
    st.route = st.needsApproval ? (rules[0].route === 'kam' ? 'kam' : 'manager') : null;
    log(data.rep.name, ctx.t(`${st.needsApproval ? 'Sent for approval' : 'Submitted'}: {order} for ${data.byId[accountId].name}`));
    s.exceptions = s.exceptions.filter((e) => e.sourceId !== `order:${accountId}`);
    if (st.needsApproval) {
      const acc = data.byId[accountId];
      s.exceptions.unshift({
        id: `L${++s.seq}`, sourceId: `order:${accountId}`, live: true, kind: 'approval', rep: data.rep.name, account: acc.name, key: acc.key,
        title: '{Order} needs approval', vars: {}, reason: rules[0].text, ruleVars: rules[0].detail, note: '',
        route: st.route, at: nowMinutes(),
      });
    }
    return { ok: true };
  };

  // ---- Visits ----
  const visitDone = (accountId) => !!s.visits[accountId];
  const completeVisit = (accountId) => {
    s.visits[accountId] = { done: true, at: nowMinutes() };
    if (ctx.app?.offline) (ctx.app.offlineQueue ||= []).push({ type: 'visit', accountId, at: nowMinutes() });
    log(data.rep.name, ctx.t(`Closed the {visit} at ${data.byId[accountId].name}`));
  };
  /** Days since the last visit, counting a {visit} closed in this session as today. */
  const lastVisitDays = (accountId) => (visitDone(accountId) ? 0 : data.byId[accountId].lastVisitDays);
  /** Open gaps exclude actions recorded done; not done and overridden stay open. */
  const openGaps = (accountId) => actionsOf(accountId).filter((x) => s.outcomes[x.id]?.status !== 'done');
  const doneGaps = (accountId) => actionsOf(accountId).filter((x) => s.outcomes[x.id]?.status === 'done');
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
    return { items, done, notDone, estimated: done.reduce((a, x) => a + x.value, 0), orderTotal, orderSubmitted: st.submitted, needsApproval: !!st.needsApproval, route: st.route || null };
  };

  const nextAccount = (afterId) => {
    const order = data.planned.slice().sort((a, b) => a.rank - b.rank);
    return order.find((p) => p.accountId !== afterId && !visitDone(p.accountId) && !s.closed[p.accountId]);
  };

  const selfStats = () => {
    let actionsDone = 0;
    let estimated = 0;
    for (const p of data.planned) {
      const v = visitSummary(p.accountId);
      actionsDone += v.done.length;
      estimated += v.estimated;
    }
    const overrides = Object.values(s.decisions).filter((d) => d.status === 'overridden').length;
    // estimated: opportunity addressed by completed actions. An estimate, never added to actual sales.
    return { done: data.planned.filter((p) => visitDone(p.accountId)).length, actionsDone, estimated, overrides };
  };

  const exceptions = () => [...s.exceptions, ...data.exceptions].map((e) => ({ ...e, acknowledged: !!s.acknowledged[e.id] }));
  const acknowledge = (id) => { s.acknowledged[id] = true; log(data.manager.name, `Acknowledged an exception`); };


  function strHash(str) {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  const ruleForItem = (item) => {
    const rules = industry.governance?.rules || [];
    if (!rules.length) {
      return {
        id: 'r_default',
        title: 'Commercial trade standards adherence',
        owner: 'Commercial Director',
        approver: 'Legal Counsel',
        exactWording: false,
        scope: 'All active territory accounts',
        neverDecides: 'Never overrides credit limits or price floors',
        version: 'v2.4',
        lastReviewed: '2026-09-15',
        effectiveDates: '2026-01-01 to 2026-12-31',
        acceptanceRate: 92,
        overrideRate: 5.4,
        flagsCount: 1,
        status: 'Healthy',
      };
    }
    let found = rules.find((r) => r.id === item.ruleId || r.id === item.defId);
    if (!found) {
      if (item.kind === 'plan' || (item.id && item.id.endsWith('-plan'))) {
        found = rules.find((r) => r.id.includes('plan') || r.id.includes('sched') || r.id.includes('route') || r.id.includes('visit')) || rules[0];
      } else {
        const idx = strHash(item.id || item.defId || item.title || 'rule') % rules.length;
        found = rules[idx];
      }
    }
    if (item.kind === 'plan' || (item.id && item.id.endsWith('-plan'))) {
      found = { ...found, exactWording: false };
    }
    if (s.forcedCase && s.forcedCase.targetId === item.id && s.forcedCase.exactWording) {
      found = { ...found, exactWording: true };
    }
    const retired = s.retiredRules[found.id];
    return {
      version: 'v2.4',
      lastReviewed: '2026-09-15',
      effectiveDates: '2026-01-01 to 2026-12-31',
      acceptanceRate: 91,
      overrideRate: 5.8,
      flagsCount: s.flags[item.id] ? 1 : 0,
      status: retired ? 'Retire candidate' : 'Healthy',
      ...found,
      approver: found.approver || industry.governance?.rights?.legalApprover || 'Legal Counsel',
    };
  };

  const itemOutcome = (item, account, itemIndex) => {
    if (s.govOutcomes[item.id]) return s.govOutcomes[item.id];
    if (s.forcedCase && s.forcedCase.targetId === item.id) {
      return { outcome: s.forcedCase.outcome, forced: true, forcedName: s.forcedCase.name };
    }
    const isFirstAccount = account && account.id === data.planned[0]?.accountId;
    if (itemIndex < (isFirstAccount ? 3 : 2)) {
      return { outcome: 'suggest' };
    }
    const rule = ruleForItem(item);
    if (s.retiredRules[rule.id]) {
      return { outcome: 'conflict', reason: `Rule retired: ${s.retiredRules[rule.id].reason}` };
    }
    const pool = ['clarify', 'stale', 'evidence', 'conflict', 'role', 'compliance'];
    const hashVal = strHash(`${item.id}:${account?.id || ''}`);
    const pick = pool[hashVal % pool.length];
    return { outcome: pick };
  };

  const resolveClarify = (itemId, choice) => {
    s.govOutcomes[itemId] = { outcome: 'suggest', choice, at: nowMinutes() };
    const it = findAction(itemId);
    log(data.rep?.name || 'Field Rep', `Resolved clarification for "${it ? ctx.t(it.title, it.vars) : itemId}": ${choice}`);
  };

  const refreshStale = (itemId) => {
    s.govOutcomes[itemId] = { outcome: 'suggest', refreshedAt: nowMinutes() };
    const it = findAction(itemId);
    log(data.rep?.name || 'Field Rep', `Refreshed stale data for "${it ? ctx.t(it.title, it.vars) : itemId}"`);
  };

  const flagRecommendation = (itemId, { reason, note }) => {
    const it = findAction(itemId);
    const rule = it ? ruleForItem(it) : { id: 'r_rule', title: 'Policy Rule', owner: 'Policy Owner' };
    const acc = it ? data.byId[it.accountId] : { name: 'Account' };
    s.flags[itemId] = { reason, note: note || '', owner: rule.owner, ruleId: rule.id, at: nowMinutes() };
    const gap = {
      id: `GAP-${++s.seq}`,
      sourceId: itemId,
      title: it ? ctx.t(it.title, it.vars) : 'Flagged recommendation',
      accountName: acc ? acc.name : 'Unknown Account',
      reason,
      note: note || '',
      owner: rule.owner,
      ageDays: 0,
      demand: 1,
      claimed: false,
      at: nowMinutes(),
    };
    s.gapBacklog.unshift(gap);
    log(data.rep?.name || 'Field Rep', `Flagged recommendation (${reason}): "${gap.title}". Sent to ${rule.owner}`);
    return gap;
  };

  const getFlag = (itemId) => s.flags[itemId] || null;

  const isExactWordingRead = (ruleId, itemId) => !!(s.exactWordingRead[ruleId] || (itemId && s.exactWordingRead[itemId]));

  const readExactWording = (ruleId, itemId) => {
    s.exactWordingRead[ruleId] = true;
    if (itemId) s.exactWordingRead[itemId] = true;
    const it = itemId ? findAction(itemId) : null;
    const rule = it ? ruleForItem(it) : (industry.governance?.rules?.find((r) => r.id === ruleId) || { id: ruleId, title: ruleId, version: 'v2.4' });
    log(data.rep?.name || 'Field Rep', `Read exact wording for policy rule "${rule.title || rule.id}" (${rule.version || 'v2.4'})`);
  };

  const retireRule = (ruleId, { approver, reason }) => {
    s.retiredRules[ruleId] = { approver, reason, at: nowMinutes() };
    const r = industry.governance?.rules?.find((x) => x.id === ruleId) || { id: ruleId, title: ruleId };
    log(data.manager?.name || 'Market Operations', `Retired rule "${r.title}" with approval from ${approver}. Reason: ${reason}`);
  };

  const isRuleRetired = (ruleId) => !!s.retiredRules[ruleId];

  const getGapBacklog = () => s.gapBacklog;

  const claimGap = (gapId, repName) => {
    const gap = s.gapBacklog.find((g) => g.id === gapId);
    if (gap) {
      gap.claimed = true;
      gap.claimedBy = repName || data.rep?.name || 'Field Rep';
      log(gap.claimedBy, `Claimed gap backlog item ${gapId}: "${gap.title}"`);
    }
  };

    const setForcedCase = (caseConfig) => { s.forcedCase = caseConfig; };
  const getForcedCase = () => s.forcedCase;
  const clearForcedCase = () => { s.forcedCase = null; };

  const createException = ({ kind, title, reason, account, route }) => {
    const ex = {
      id: `EX-${++s.seq}`,
      kind: kind || 'approval',
      title: title || 'Item review',
      reason: reason || 'Exception raised',
      account: account || 'Account',
      rep: data.rep?.name || 'Field Rep',
      route: route || 'manager',
      at: nowMinutes(),
      live: true,
    };
    s.exceptions.unshift(ex);
    log(data.rep?.name || 'Field Rep', `Raised exception: "${title}" - ${reason}`);
    return ex;
  };

  const toggleAgent = (id) => {
    s.stopped[id] = !s.stopped[id];
    log(ctx.persona === 'manager' ? data.manager.name : ctx.persona === 'admin' ? data.admin.name : data.rep.name, `${s.stopped[id] ? 'Stopped' : 'Resumed'} the ${AGENT_NAME[id]}`);
  };

  return {
    session: s, plannedFor, briefItems, actionsOf, approvalRoute, lastVisitDays, openGaps, doneGaps, findAction, decision, decide, undo, counts, outcome, recordOutcome, setEvidence,
    orderLines, orderRules, orderState, setQty, submitOrder, visitDone, completeVisit, visitSummary, nextAccount,
    selfStats, exceptions, acknowledge, agentStopped, toggleAgent, closedToday, toggleClosed, logAudit, audit: () => s.audit,
    ruleForItem, itemOutcome, resolveClarify, refreshStale, flagRecommendation, getFlag, isExactWordingRead, readExactWording,
    retireRule, isRuleRetired, getGapBacklog, claimGap, setForcedCase, getForcedCase, clearForcedCase, createException,
  };
}
