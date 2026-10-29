// Sales Companion session state: leave, expenses, debriefs, learning progress, the mock self-service order.
// Lives in the same per-scenario session as the rest of the demo, so switching persona keeps it.
// Approvals are real in the demo: the rep submits, the manager decides, the rep sees the result.

import { getSession } from '../state.js';
import { workingDays, parseIso, startOfDay, iso } from './data.js';

export function createCompanionModel(ctx) {
  const { data, country, industry, comp } = ctx;
  const root = getSession(data.seedKey);
  const s = (root.companion ||= { leave: [], leaveDecided: {}, expenses: [], expenseDecided: {}, debriefs: {}, modules: {}, renewals: {}, chat: [], mock: {}, seq: 0, complaints: [], mileage: [], onboarding: { steps: {}, signed: null }, wellbeing: {} });
  const who = (persona) => (persona === 'manager' ? data.manager : data.rep).name;
  const log = (actor, text) => ctx.m.logAudit(actor, text);
  const today = () => startOfDay(ctx.fmt.today);

  // ---- Leave ----
  const leaveType = (id) => country.leaveTypes.find((t) => t.id === id);
  const decidedLeave = (r) => (s.leaveDecided[r.id] ? { ...r, status: s.leaveDecided[r.id] } : r);
  const myLeave = () => [...comp.leaveHistory, ...s.leave].map(decidedLeave);
  const pendingTeamLeave = () => [...s.leave, ...comp.teamLeave].map(decidedLeave).filter((r) => r.status === 'pending');
  const remaining = (typeId) => {
    const b = comp.balances.find((x) => x.id === typeId);
    const taken = myLeave().filter((r) => r.type === typeId && r.status !== 'rejected' && !r.sample).reduce((a, r) => a + r.days, 0);
    return b.total - b.used - taken;
  };
  function requestLeave({ type, from, to, note }) {
    const f = parseIso(from); const t = parseIso(to);
    if (!leaveType(type)) return { ok: false, error: 'Choose a leave type.' };
    if (!f || !t) return { ok: false, error: 'Enter a start date and an end date.' };
    if (t < f) return { ok: false, error: 'The end date is before the start date.' };
    if (f < today()) return { ok: false, error: 'The start date is in the past.' };
    const days = workingDays(country, f, t);
    if (days < 1) return { ok: false, error: 'There are no working days in that range. Weekends and public holidays are not counted.' };
    if (days > remaining(type)) return { ok: false, error: `You have ${remaining(type)} days left of ${leaveType(type).label}. This request is ${days} days.` };
    const clash = myLeave().find((r) => r.status !== 'rejected' && parseIso(r.from) <= t && parseIso(r.to) >= f);
    if (clash) return { ok: false, error: 'These dates overlap a request you already have.' };
    const req = { id: `LV${++s.seq}`, rep: data.rep.name, type, from, to, days, note: (note || '').slice(0, 200), status: 'pending', sample: false };
    s.leave.push(req);
    log(data.rep.name, `Requested ${days} days of ${leaveType(type).label} (${from} to ${to})`);
    return { ok: true, request: req };
  }
  function decideLeave(id, approve, persona) {
    const r = pendingTeamLeave().find((x) => x.id === id);
    if (!r) return false;
    s.leaveDecided[id] = approve ? 'approved' : 'rejected';
    log(who(persona), `${approve ? 'Approved' : 'Rejected'} ${r.rep}'s ${leaveType(r.type).label} request (${r.days} days)`);
    return true;
  }

  // ---- Expenses ----
  const category = (id) => industry.companion.expenseCategories.find((c) => c.id === id);
  const limitFor = (id) => country.expenseLimits[category(id).limitClass];
  const decidedExp = (e) => (s.expenseDecided[e.id] ? { ...e, status: s.expenseDecided[e.id] } : e);
  const myExpenses = () => [...comp.expenseHistory, ...s.expenses].map(decidedExp);
  const pendingExpenses = () => [...s.expenses, ...comp.teamExpenses].map(decidedExp).filter((e) => e.status === 'pending');
  /** Automatic policy check against the country's sample limit for the category. */
  const policy = (catId, amount) => {
    const limit = limitFor(catId);
    return { limit, over: amount > limit, within: amount <= limit };
  };
  function submitExpense({ category: catId, amount, date, note, receipt }) {
    const amt = Number(String(amount).replace(',', '.'));
    if (!category(catId)) return { ok: false, error: 'Choose a category.' };
    if (!Number.isFinite(amt) || amt <= 0) return { ok: false, error: 'Enter an amount above zero.' };
    if (amt > 1e9) return { ok: false, error: 'That amount is too large for a sample claim.' };
    const d = parseIso(date);
    if (!d) return { ok: false, error: 'Enter the date of the expense.' };
    if (d > today()) return { ok: false, error: 'The expense date is in the future.' };
    if (!receipt) return { ok: false, error: 'Add the receipt photo (mock) first.' };
    const p = policy(catId, amt);
    const claim = { id: `EX${++s.seq}`, rep: data.rep.name, category: catId, amount: Math.round(amt * 100) / 100, date, note: (note || '').slice(0, 200), receipt: true, status: 'pending', over: p.over, sample: false };
    s.expenses.push(claim);
    log(data.rep.name, `Submitted an expense claim for ${category(catId).label}${p.over ? ' (over the sample limit)' : ''}`);
    return { ok: true, claim, policy: p };
  }
  function decideExpense(id, approve, persona) {
    const e = pendingExpenses().find((x) => x.id === id);
    if (!e) return false;
    s.expenseDecided[id] = approve ? 'approved' : 'rejected';
    log(who(persona), `${approve ? 'Approved' : 'Rejected'} ${e.rep}'s expense claim for ${category(e.category).label}`);
    return true;
  }

  // ---- Debrief ----
  const saveDebrief = (accountId, record) => {
    s.debriefs[accountId] = { ...record, at: Date.now() };
    log(data.rep.name, `Confirmed a voice debrief for ${data.byId[accountId].name}`);
  };

  // ---- Learning ----
  const moduleStatus = (id) => s.modules[id] || comp.modules.find((m) => m.id === id).status;
  const setModule = (id, status) => { s.modules[id] = status; log(data.rep.name, `Marked a learning module ${status === 'done' ? 'done' : 'in progress'}`); };
  const startRenewal = (id) => { s.renewals[id] = 'started'; log(data.rep.name, `Started a renewal for ${industry.companion.certifications.find((c) => c.id === id).label}`); };

  return {
    s, requestLeave, decideLeave, myLeave, pendingTeamLeave, remaining, leaveType,
    submitExpense, decideExpense, myExpenses, pendingExpenses, policy, category, limitFor,
    saveDebrief, moduleStatus, setModule, startRenewal, iso,
  };
}
