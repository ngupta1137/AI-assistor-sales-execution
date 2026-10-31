// Sales Companion sample data. Seeded from industry + country, so a demo repeats.
// Everything here is generated sample data: fictional people, dates relative to today, amounts scaled by price level.
// The Companion consumes outputs of the existing capabilities. It never builds its own route, brief or order.

import { createRng, hashString } from '../rng.js';
import { haversineKm } from '../../data/generate.js';

export const FATIGUE_MINUTES = 120;
export const BREAK_MINUTES = 15;
/** Share of each rep's week the manager can assign to an activation in the resource view (sample setting). */
export const ACTIVATION_SHARE = 0.25;
export const WEEKS = 8;

const DAY = 86400000;
export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d, n) => new Date(startOfDay(d).getTime() + n * DAY + (n >= 0 ? 0 : 0));
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseIso = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const md = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const CONDITIONS = [
  { id: 'clear', label: 'Clear', c: [18, 30] }, { id: 'cloud', label: 'Cloudy', c: [14, 24] }, { id: 'lrain', label: 'Light rain', c: [10, 20] },
  { id: 'hrain', label: 'Heavy rain', c: [8, 18], alert: 'Heavy rain. Allow extra travel time and check the road before each drive.' },
  { id: 'wind', label: 'Windy', c: [10, 22] }, { id: 'heat', label: 'Hot', c: [31, 38], alert: 'Hot day. Carry water and avoid leaving samples or stock in the car.' },
  { id: 'fog', label: 'Fog', c: [4, 12], alert: 'Fog early in the day. Slow down and leave a gap on the road.' },
];

const toTemp = (c, unit) => (unit === 'F' ? Math.round((c * 9) / 5 + 32) : c);

/** Public holidays as the next date each occurs on or after today. */
export function resolveHolidays(country, today) {
  const t0 = startOfDay(today);
  return country.publicHolidays.map((h) => {
    const [mm, dd] = h.monthDay.split('-').map(Number);
    let d = new Date(t0.getFullYear(), mm - 1, dd);
    if (d < t0) d = new Date(t0.getFullYear() + 1, mm - 1, dd);
    return { name: h.name, date: d, md: h.monthDay };
  }).sort((a, b) => a.date - b.date);
}

/** Working days in [from, to], skipping the country's weekend and its public holidays. */
export function workingDays(country, from, to) {
  const hol = new Set(country.publicHolidays.map((h) => h.monthDay));
  let n = 0;
  for (let d = startOfDay(from); d <= to; d = addDays(d, 1)) if (!country.weekend.includes(d.getDay()) && !hol.has(md(d))) n++;
  return n;
}

/** How an account feels, from simple visible rules. Sample logic, not a model. */
export function sentimentFor(ctx, acct) {
  const reasons = [];
  let score = 0;
  const [a, b] = acct.orderHistory;
  const change = b ? Math.round(((a.total - b.total) / b.total) * 100) : 0;
  if (change >= 3) { score++; reasons.push(`The last {order} was ${change}% higher than the one before.`); } else if (change <= -15) { score--; reasons.push(`The last {order} was ${Math.abs(change)}% lower than the one before.`); } else reasons.push('The last two {orders} were about level.');
  const spoke = acct.contacts[0].lastContactDays;
  if (spoke <= 21) { score++; reasons.push(`The {contact} was last contacted ${spoke} days ago.`); } else if (spoke > 45) { score--; reasons.push(`Nobody has spoken to the {contact} for ${spoke} days.`); }
  const share = acct.current / acct.potential;
  if (share >= 0.65) { score++; reasons.push(`It has captured ${Math.round(share * 100)}% of its estimated potential.`); } else if (share < 0.45) { score--; reasons.push(`It has captured only ${Math.round(share * 100)}% of its estimated potential.`); }
  const open = ctx.m.exceptions().filter((e) => e.live && e.account === acct.name && !e.acknowledged);
  if (open.length) { score--; reasons.push('An item from this {account} is waiting in the exception queue.'); }
  const label = score >= 2 ? 'Positive' : score <= -1 ? 'At risk' : 'Neutral';
  return { label, tone: label === 'Positive' ? 'good' : label === 'At risk' ? 'bad' : 'info', reasons };
}

export function nearby(ctx, acct, n = 5) {
  return ctx.data.accounts.filter((x) => x.id !== acct.id)
    .map((x) => ({ a: x, km: haversineKm(acct.geo, x.geo) * 1.3 })).sort((x, y) => x.km - y.km).slice(0, n)
    .map(({ a, km }) => {
      const share = a.current / a.potential;
      const [l, p] = a.orderHistory;
      return { a, km, share, trend: Math.round(((l.total - p.total) / p.total) * 100), planned: !!ctx.m.plannedFor(a.id) };
    });
}

/** Weather and traffic for the route. The same account always gets the same sample traffic. */
export function safetyFor(ctx, stops) {
  const { country, industry, fmt } = ctx;
  const rng = createRng(`${industry.id}|${country.id}|weather|${iso(fmt.today)}`);
  const cond = CONDITIONS[rng.int(0, CONDITIONS.length - 1)];
  const c = rng.int(cond.c[0], cond.c[1]);
  const alerts = [];
  if (cond.alert) alerts.push({ tone: 'warn', text: cond.alert });
  let drive = 0;
  let fatigueAt = null;
  const legs = stops.map((st) => {
    const r = createRng(`${hashString(st.accountId)}|${country.id}|traffic`);
    const roll = r.next();
    const level = roll < 0.5 ? 'Light' : roll < 0.85 ? 'Moderate' : 'Heavy';
    const delay = level === 'Heavy' ? r.int(8, 20) : level === 'Moderate' ? r.int(2, 6) : 0;
    drive += st.travelMin + delay;
    const fatigue = fatigueAt == null && drive >= FATIGUE_MINUTES;
    if (fatigue) fatigueAt = { accountId: st.accountId, drive };
    return { ...st, level, delay, drive, fatigue };
  });
  const heavy = legs.filter((l) => l.level === 'Heavy');
  if (heavy.length) alerts.push({ tone: 'warn', text: `Heavy traffic on ${heavy.length === 1 ? 'one leg' : `${heavy.length} legs`}. Estimated delay up to ${Math.max(...heavy.map((l) => l.delay))} minutes.` });
  if (fatigueAt) alerts.push({ tone: 'info', text: `After about ${FATIGUE_MINUTES} minutes of driving, take a ${BREAK_MINUTES} minute break before the next drive. You reach that point on the leg marked below (${fatigueAt.drive} minutes so far).` });
  return { weather: { label: cond.label, temp: toTemp(c, country.tempUnit), unit: country.tempUnit }, alerts, legs, totalDrive: drive };
}

export function generateCompanion(ctx) {
  const { industry, country, data, fmt } = ctx;
  const C = industry.companion;
  const today = startOfDay(fmt.today);
  const rng = createRng(`${industry.id}|${country.id}|companion|v1`);
  const holidays = resolveHolidays(country, today);

  // Leave
  const balances = country.leaveTypes.map((t) => ({ id: t.id, label: t.label, total: t.days, used: rng.int(0, Math.floor(t.days * 0.5)) }));
  const others = data.reps.filter((r) => !r.self);
  const teamLeave = others.slice(0, 2).map((r, i) => {
    const from = addDays(today, 12 + i * 9 + rng.int(0, 3));
    const to = addDays(from, rng.int(1, 4));
    return { id: `TL${i + 1}`, rep: r.name, type: country.leaveTypes[0].id, from: iso(from), to: iso(to), days: workingDays(country, from, to), note: '', status: 'pending', sample: true };
  });
  const pastFrom = addDays(today, -rng.int(30, 50));
  const leaveHistory = [{ id: 'LH1', rep: data.rep.name, type: country.leaveTypes[0].id, from: iso(pastFrom), to: iso(addDays(pastFrom, 2)), days: workingDays(country, pastFrom, addDays(pastFrom, 2)), note: '', status: 'approved', sample: true }];

  // Expenses
  const limit = (cls) => country.expenseLimits[cls];
  const pickCat = () => C.expenseCategories[rng.int(0, C.expenseCategories.length - 1)];
  const nice = (v) => Math.round(v * 100) / 100;
  const mkExp = (id, who, cat, ratio, daysAgo, status) => ({ id, rep: who, category: cat.id, amount: nice(limit(cat.limitClass) * ratio), date: iso(addDays(today, -daysAgo)), note: '', receipt: true, status, sample: true });
  const expenseHistory = [0, 1, 2].map((i) => mkExp(`EH${i + 1}`, data.rep.name, pickCat(), 0.3 + rng.float(0, 0.55), 3 + i * 6, 'approved'));
  const teamExpenses = others[2] ? [mkExp('TE1', others[2].name, pickCat(), 1.25, 2, 'pending')] : [];

  // Pay slips: sample amounts only, scaled by the local price level
  const base = Math.round((2400 + rng.int(0, 900)) * country.priceFactor);
  const payslips = [1, 2, 3].map((k) => {
    const d = new Date(today.getFullYear(), today.getMonth() - k + 1, 1);
    const allowance = Math.round(base * (0.08 + rng.float(0, 0.04)));
    const deduct = Math.round((base + allowance) * (0.14 + rng.float(0, 0.04)));
    return { id: `PS${k}`, month: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(d), base, allowance, deduct, net: base + allowance - deduct };
  });
  const documents = [
    { id: 'D1', title: 'Employment letter', kind: 'Demonstration document' }, { id: 'D2', title: 'Expense policy summary', kind: 'Demonstration document' },
    { id: 'D3', title: 'Leave policy summary', kind: 'Demonstration document' }, { id: 'D4', title: 'Annual summary', kind: 'Demonstration document' },
  ];

  // Certifications: some due soon, one just outside the 30 day window, one overdue
  const certs = C.certifications.map((c, i) => {
    const dueIn = i === 0 ? rng.int(6, 26) : i === 1 ? rng.int(31, 45) : i === 2 ? -rng.int(3, 12) : rng.int(90, 330);
    return { ...c, dueIn, due: addDays(today, dueIn) };
  });

  // Learning progress for the rep
  const modules = C.learningModules.map((m, i) => ({ ...m, status: i < 2 ? 'done' : i === 2 ? 'progress' : 'new' }));
  const teamLearning = data.reps.map((r) => ({ rep: r.name, self: !!r.self, done: r.self ? 2 : rng.int(2, 7), total: C.learningModules.length, certsDue: r.self ? certs.filter((c) => c.dueIn <= 30).length : rng.int(0, 2) }));

  // Resource planning: team availability by week
  const workWeek = 7 - country.weekend.length;
  const team = data.reps.map((r) => ({ name: r.name, self: !!r.self, weeks: Array.from({ length: WEEKS }, (_, w) => {
    const start = addDays(today, w * 7);
    const hol = holidays.filter((h) => h.date >= start && h.date < addDays(start, 7) && !country.weekend.includes(h.date.getDay())).length;
    const leave = rng.chance(0.28) ? rng.int(1, 3) : 0;
    const training = rng.chance(0.12) ? 1 : 0;
    return { start, days: Math.max(0, workWeek - hol - leave - training), hol, leave, training };
  }) }));
  const vendor = () => `${rng.pick(country.prefixes)} Field Support`;
  const plans = C.resourcePlans.map((p) => {
    const rows = Array.from({ length: WEEKS }, (_, w) => {
      const need = w >= p.startWeek && w < p.startWeek + p.weeks ? p.perWeek : 0;
      const free = team.map((t) => ({ name: t.name, days: t.weeks[w].days }));
      const capacity = Math.round(free.reduce((s, x) => s + x.days, 0) * ACTIVATION_SHARE * 10) / 10;
      const gap = Math.max(0, Math.round((need - capacity) * 10) / 10);
      const cover = gap > 0 ? [
        { kind: 'internal', text: `Ask ${free.slice().sort((a, b) => b.days - a.days)[0].name}, who has ${free.slice().sort((a, b) => b.days - a.days)[0].days} days free that week, to take ${Math.min(Math.ceil(gap), 2)} extra day${Math.ceil(gap) > 1 ? 's' : ''}.` },
        { kind: 'external', text: `Third-party cover: ${vendor()}, up to ${Math.ceil(gap)} day${Math.ceil(gap) > 1 ? 's' : ''}.` },
      ] : [];
      return { week: w, start: addDays(today, w * 7), need, capacity, gap, cover };
    });
    return { ...p, rows };
  });

  return { today, holidays, balances, leaveHistory, teamLeave, expenseHistory, teamExpenses, payslips, documents, certs, modules, teamLearning, team, plans };
}
