// Builds one territory of sample data from (industry pack, country pack).
// Deterministic: the seed is the industry and country ids, so a demo is repeatable.
// Rule-based scoring only. No real data, no models.

import { createRng } from '../core/rng.js';

export const AGENTS = [
  { id: 'planner', name: 'Visit Planner', level: 3 },
  { id: 'gap', name: 'Gap agent', level: 2 },
  { id: 'order', name: 'Order agent', level: 2 },
];

const DAY_MS = 86400000;
const DAY_START = 8 * 60 + 30;
const SEED_VERSION = 'v1';

/** Local events from today onward, soonest first, with days to go. Dates are approximate. */
export function upcomingEvents(country, today) {
  const t0 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const out = [];
  for (const ev of country.events) {
    let best = null;
    for (const year of [today.getFullYear(), today.getFullYear() + 1]) {
      const md = (ev.dates && ev.dates[year]) || ev.monthDay;
      if (!md) continue;
      const [m, d] = md.split('-').map(Number);
      const days = Math.round((Date.UTC(year, m - 1, d) - t0) / DAY_MS);
      if (days >= 0 && (!best || days < best.days)) best = { ...ev, days, date: new Date(year, m - 1, d) };
    }
    if (best) out.push(best);
  }
  return out.sort((a, b) => a.days - b.days);
}

/** Next local event on or after today. */
export function nextEvent(country, today) {
  return upcomingEvents(country, today)[0] || { name: country.events[0].name, days: 30, note: country.events[0].note };
}

export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rounds to 3 significant figures so sample money looks like money, not noise. */
function nice(v) {
  if (v <= 0) return 0;
  const mag = 10 ** Math.max(0, Math.floor(Math.log10(v)) - 2);
  return Math.round(v / mag) * mag;
}

/** Local shelf price from the pack's reference price and the country's price level. */
export function localPrice(ref, country) {
  if (ref == null) return null;
  const v = ref * country.priceFactor;
  const step = country.priceStep || (v >= 1000 ? 10 : v >= 100 ? 1 : 0.05);
  return Math.round(v / step) * step;
}

/**
 * Visit Planner: orders visits by opening hours and travel, not by value rank.
 * Earliest deadline first: among accounts open on arrival, take the one whose latest
 * feasible start comes soonest. Never schedules a visit that ends after closing.
 * Pure: returns stops and the ids that do not fit today.
 */
export function scheduleVisits(ids, byId, city, country, startClock = DAY_START) {
  const speed = country.speedKmh || 25;
  let pos = { lat: city.lat, lng: city.lng };
  let clock = startClock;
  const remaining = ids.slice();
  const stops = [];
  while (remaining.length) {
    const options = remaining.map((id) => {
      const acc = byId[id];
      const km = haversineKm(pos, acc.geo) * 1.3;
      const travel = (km / speed) * 60;
      const start = Math.ceil(Math.max(clock + travel, acc.hours[0]) / 5) * 5;
      return { id, acc, km, travel, start, latest: acc.hours[1] - acc.visitMinutes, openNow: clock + travel >= acc.hours[0] };
    });
    const feasible = options.filter((o) => o.start <= o.latest);
    if (!feasible.length) break;
    const open = feasible.filter((o) => o.openNow);
    const pool = open.length ? open : feasible;
    pool.sort((x, y) => (open.length ? x.latest - y.latest || x.km - y.km : x.start - y.start || x.latest - y.latest));
    const best = pool[0];
    stops.push({ accountId: best.id, seq: stops.length + 1, km: best.km, travelMin: Math.max(4, Math.round(best.travel)), start: best.start, end: best.start + best.acc.visitMinutes });
    clock = best.start + best.acc.visitMinutes;
    pos = best.acc.geo;
    remaining.splice(remaining.indexOf(best.id), 1);
  }
  return { stops, dropped: remaining };
}

const PREFERENCES = [
  'Prefers mornings', 'Prefers short {visits}', 'Likes figures on one page', 'Replies faster by phone',
  'Busy at month end', 'Wants notice before a {visit}', 'Asks for the reason behind each suggestion',
  'Decides with a colleague',
];

export function generate(industry, country, { today = new Date(), fmt } = {}) {
  if (!fmt) throw new Error('generate needs a formatter');
  const rng = createRng(`${industry.id}|${country.id}|${SEED_VERSION}`);
  const city = rng.pick(country.cities);
  const usedPeople = new Set();
  const usedAccounts = new Set();

  const person = () => {
    for (let i = 0; i < 40; i++) {
      const p = { first: rng.pick(country.firstNames), last: rng.pick(country.lastNames) };
      const key = `${p.first} ${p.last}`;
      if (!usedPeople.has(key)) { usedPeople.add(key); return { ...p, name: key }; }
    }
    const p = { first: rng.pick(country.firstNames), last: rng.pick(country.lastNames) };
    return { ...p, name: `${p.first} ${p.last}` };
  };

  const rep = { ...person(), title: industry.personas.rep, city: city.name };
  const manager = { ...person(), title: industry.personas.manager, city: city.name };
  const admin = { ...person(), title: industry.personas.admin, city: city.name };
  const kam = { ...person(), title: industry.vocab.kam };
  const event = nextEvent(country, today);

  const accountName = (type, area, segCity) => {
    const words = (type.words[country.nameLang] || type.words.en);
    const style = type.naming || 'business';
    const patterns = country.patterns[style] || country.patterns.business;
    for (let i = 0; i < 30; i++) {
      const name = rng.pick(patterns)
        .replace('{prefix}', rng.pick(country.prefixes))
        .replace('{surname}', rng.pick(country.lastNames))
        .replace('{first}', rng.pick(country.firstNames))
        .replace('{area}', area)
        .replace('{city}', segCity)
        .replace('{type}', rng.pick(words));
      if (!usedAccounts.has(name)) { usedAccounts.add(name); return name; }
    }
    const fallback = `${rng.pick(country.prefixes)} ${rng.pick(words)} ${usedAccounts.size + 1}`;
    usedAccounts.add(fallback);
    return fallback;
  };

  const roleOf = (r) => (typeof r === 'string' ? { role: r } : r);
  const contactName = (p, role) => (role.prefix ? `${role.prefix} ${p.name}` : p.name);

  // ---- Accounts ------------------------------------------------------------
  const total = rng.int(24, 30);
  const segCounts = industry.segments.map((s) => Math.max(2, Math.round(total * s.share)));
  while (segCounts.reduce((a, b) => a + b, 0) > total) segCounts[segCounts.indexOf(Math.max(...segCounts))]--;
  while (segCounts.reduce((a, b) => a + b, 0) < total) segCounts[segCounts.indexOf(Math.min(...segCounts))]++;

  const accounts = [];
  industry.segments.forEach((seg, si) => {
    for (let i = 0; i < segCounts[si]; i++) {
      const type = rng.pick(seg.types);
      const area = rng.pick(city.areas);
      const score = rng.int(34, 97);
      const [lo, hi] = seg.annualValue;
      const potential = nice((lo + (hi - lo) * (score / 100)) * country.priceFactor * rng.float(0.9, 1.1));
      const current = nice(potential * rng.float(0.38, 0.84));
      const nContacts = Math.min(seg.roles.length, seg.key ? rng.int(2, 3) : rng.int(1, 2));
      const contacts = seg.roles.slice(0, nContacts).map((r, ci) => {
        const role = roleOf(r);
        const p = person();
        return {
          name: contactName(p, role), role: role.role, primary: ci === 0,
          phone: rng.pattern(city.phone || country.phone),
          preference: rng.pick(PREFERENCES), lastContactDays: rng.int(4, 60),
        };
      });
      const kpis = {};
      for (const k of industry.kpis) if (!k.segments || k.segments.includes(seg.id)) kpis[k.id] = rng.int(k.range[0], k.range[1]);
      accounts.push({
        id: '', segmentId: seg.id, segment: seg.name, type: type.type, key: !!seg.key,
        name: accountName(type, area, city.name), area, city: city.name,
        geo: { lat: city.lat + rng.float(-0.06, 0.06), lng: city.lng + rng.float(-0.07, 0.07) },
        address: country.address
          .replace('{number}', String(rng.int(2, 480)))
          .replace('{street}', rng.pick(country.streets))
          .replace('{area}', area)
          .replace('{city}', city.name)
          .replace('{region}', city.region || '')
          .replace('{postcode}', rng.pattern(city.postcode)),
        hours: seg.hours,
        score, tier: score >= 75 ? 'A' : score >= 52 ? 'B' : 'C',
        potential, current, whiteSpace: potential - current,
        lastVisitDays: rng.int(3, 45), contacts, kpis, visitMinutes: rng.int(seg.visitMinutes[0], seg.visitMinutes[1]),
      });
    }
  });
  accounts.sort((a, b) => b.score - a.score);
  accounts.forEach((a, i) => { a.id = `A${String(i + 1).padStart(2, '0')}`; });

  // History: past visits and orders.
  for (const a of accounts) {
    const cycle = rng.int(12, 28);
    const notes = industry.visitNotes.filter((n) => typeof n === 'string' || !n.segments || n.segments.includes(a.segmentId)).map((n) => (typeof n === 'string' ? n : n.text));
    a.history = [0, 1, 2].map((k) => ({
      daysAgo: a.lastVisitDays + k * cycle,
      note: rng.pick(notes),
      vars: { n: rng.int(2, 6), person: a.contacts[0].name },
    }));
    a.orderHistory = [0, 1, 2].map((k) => ({
      daysAgo: a.lastVisitDays + k * cycle,
      total: nice((a.current / 12) * rng.float(0.6, 1.3)),
      lines: rng.int(2, 7),
    }));
  }

  // ---- Today's plan ---------------------------------------------------------
  const nPlan = rng.int(6, 8);
  const priority = (a) => a.score + Math.min(a.lastVisitDays, 40) * 0.8 + rng.float(0, 14);
  const scored = accounts.map((a) => ({ a, p: priority(a) })).sort((x, y) => y.p - x.p);
  const plan = [];
  for (const seg of industry.segments) {
    const top = scored.find((s) => s.a.segmentId === seg.id && !plan.includes(s.a));
    if (top) plan.push(top.a);
  }
  for (const s of scored) { if (plan.length >= nPlan) break; if (!plan.includes(s.a)) plan.push(s.a); }

  const matches = (o, uses) => o.status === uses || o.category === uses || o.kind === uses || o.id === uses;
  const inSegment = (o, seg) => !o.segments || o.segments.includes(seg.id);

  /** Offerings an {order} can carry in this segment, optionally narrowed by status, category or kind. */
  const offeringsFor = (seg, uses) => {
    let pool = industry.offerings.filter((o) => inSegment(o, seg));
    if (uses && uses !== 'any') {
      const narrowed = pool.filter((o) => matches(o, uses));
      if (narrowed.length) pool = narrowed;
    }
    return pool;
  };

  /**
   * The offering an action talks about. Offerings with a kind (for example samples) are only
   * picked when the action asks for that kind. In-segment offerings are preferred.
   */
  const offeringForAction = (seg, uses) => {
    const pool = industry.offerings.filter((o) => !o.kind || o.kind === uses);
    const exact = pool.filter((o) => uses === 'any' || matches(o, uses));
    const inSeg = exact.filter((o) => inSegment(o, seg));
    const list = inSeg.length ? inSeg : exact.length ? exact : pool;
    return rng.pick(list);
  };

  // Bigger segments carry bigger actions: scale by the square root of segment size.
  const segMid = (s) => (s.annualValue[0] + s.annualValue[1]) / 2;
  const maxMid = Math.max(...industry.segments.map(segMid));
  const segScale = (s) => 0.45 + 0.95 * Math.sqrt(segMid(s) / maxMid);

  const actionsFor = (a) => {
    const seg = industry.segments.find((s) => s.id === a.segmentId);
    const eligible = industry.actions.filter((x) => !x.segments || x.segments.includes(seg.id));
    const k = rng.int(3, Math.min(6, eligible.length));
    const chosen = rng.sample(eligible, k);
    return rankItems(a, chosen.map((def) => buildItem(def, a, seg)));
  };

  /** One prepared action for an account, with its evidence values. */
  function buildItem(def, a, seg) {
    const product = def.uses === 'none' ? null : offeringForAction(seg, def.uses);
    const value = nice(rng.float(def.value[0], def.value[1]) * country.priceFactor * segScale(seg) * (0.7 + (a.score / 100) * 0.6));
    const confidence = Math.round(rng.float(0.52, 0.94) * 100) / 100;
    const effort = Math.max(3, def.effort + rng.int(-2, 3));
    const vars = {
      product: product ? product.name : '', days: rng.int(3, 12), pct: rng.int(12, 38), qty: rng.int(3, 12),
      peers: rng.int(6, 18), n: rng.int(2, 4), weeks: rng.int(3, 8), area: a.area, city: a.city,
      person: a.contacts[0].name, role: a.contacts[0].role, event: event.name, eventDays: event.days,
      type: a.type, segment: a.segment, amount: fmt.money(value),
    };
    return {
      id: `${a.id}-${def.id}`, kind: 'action', accountId: a.id, defId: def.id, agent: def.agent, type: def.type,
      title: def.title, saw: def.saw, compared: def.compared,
      evidence: def.evidence, effort, value, confidence, offeringId: product ? product.id : null, vars,
      score: (value / effort) * confidence,
    };
  }

  /** Ranks by value per minute times confidence, and flags what does not fit the time budget. */
  function rankItems(a, items) {
    items.sort((x, y) => y.score - x.score);
    let used = 0;
    items.forEach((it, i) => { it.rank = i + 1; used += it.effort; it.overBudget = i > 0 && used > a.visitMinutes; });
    return items;
  }

  /** Lines a prerequisite rule applies to: 'humanPrice' (price set by people) or an offering status, category or kind. */
  const ruleApplies = (r, o) => (r.appliesTo === 'humanPrice' ? o.price === null : matches(o, r.appliesTo));

  /**
   * When the draft contains lines that need a prerequisite action (for example a needs review
   * with signed consent), that action must be in the brief, so the rep can actually satisfy it.
   */
  const ensurePrerequisites = (a, actions, order) => {
    const seg = industry.segments.find((s) => s.id === a.segmentId);
    for (const r of industry.orderRules.filter((x) => x.kind === 'prerequisite')) {
      const needed = order.some((l) => ruleApplies(r, industry.offerings.find((o) => o.id === l.offeringId)));
      const def = industry.actions.find((x) => x.id === r.action);
      if (!needed || actions.some((x) => x.defId === r.action) || (def.segments && !def.segments.includes(seg.id))) continue;
      if (actions.length >= 6) actions.splice(actions.length - 1, 1);
      actions.push(buildItem(def, a, seg));
      rankItems(a, actions);
    }
    return actions;
  };

  const orderFor = (a, actions) => {
    const seg = industry.segments.find((s) => s.id === a.segmentId);
    const pool = offeringsFor(seg, 'any');
    const linked = actions.map((x) => x.offeringId).filter(Boolean);
    const ids = [...new Set([...linked, ...rng.shuffle(pool.map((o) => o.id))])].slice(0, rng.int(3, Math.min(6, pool.length)));
    return ids.map((id) => {
      const o = industry.offerings.find((x) => x.id === id);
      const range = o.qty || seg.orderQty || [1, 6];
      const qty = rng.int(range[0], range[1]);
      const bySeg = industry.orderReasons.bySegment?.[seg.id] || {};
      const reasons = bySeg[o.kind] || bySeg[o.status] || industry.orderReasons[o.kind] || industry.orderReasons[o.status] || bySeg.core || industry.orderReasons.core;
      return {
        offeringId: id, qty, suggested: qty, reason: rng.pick(reasons),
        vars: { qty, avg: Math.max(1, Math.round(qty / rng.int(1, 2))), cover: rng.int(3, 12), event: event.name, eventDays: event.days, weeks: rng.int(3, 8) },
      };
    });
  };

  const planned = plan.map((a) => {
    const actions = actionsFor(a);
    const order = orderFor(a, actions);
    ensurePrerequisites(a, actions, order);
    return { accountId: a.id, actions, order, opportunity: actions.reduce((s, x) => s + x.value, 0) };
  });
  planned.sort((x, y) => y.opportunity - x.opportunity);
  planned.forEach((p, i) => { p.rank = i + 1; });

  // Visit Planner (see scheduleVisits). Accounts that cannot fit before closing move off today's plan.
  const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));
  const { stops, dropped } = scheduleVisits(planned.map((p) => p.accountId), byId, city, country);
  for (const st of stops) Object.assign(planned.find((p) => p.accountId === st.accountId), st);
  if (dropped.length) {
    for (const id of dropped) planned.splice(planned.findIndex((p) => p.accountId === id), 1);
    planned.sort((x, y) => y.opportunity - x.opportunity);
    planned.forEach((p, i) => { p.rank = i + 1; });
  }

  // Each brief: the planner's slot, the gap agent's ranked actions, the order agent's draft.
  const CYCLE = { A: 14, B: 21, C: 35 };
  for (const p of planned) {
    const acc = byId[p.accountId];
    const orderTotal = p.order.reduce((sum, l) => {
      const o = industry.offerings.find((x) => x.id === l.offeringId);
      const unit = localPrice(o.price, country);
      return sum + (unit == null ? 0 : unit * l.suggested);
    }, 0);
    const fits = p.actions.filter((x) => !x.overBudget).length;
    const plan = {
      id: `${acc.id}-plan`, kind: 'plan', accountId: acc.id, agent: 'planner', type: '{Visit} plan', effort: 0, value: 0,
      confidence: 0.88, rank: 0, title: '{Visit} at {time}, {minutes} min budget',
      saw: '{Account} opens at {opens}. Last {visit} was {last} days ago.',
      compared: 'Tier {tier} {accounts} are due every {cycle} days. Travel from the previous stop is about {travel} min.',
      vars: { time: fmt.time(p.start), minutes: acc.visitMinutes, opens: fmt.time(acc.hours[0]), last: acc.lastVisitDays, tier: acc.tier, cycle: CYCLE[acc.tier], travel: p.travelMin, fits, total: p.actions.length },
    };
    const draft = {
      id: `${acc.id}-order`, kind: 'order', accountId: acc.id, agent: 'order', type: '{Order} draft', effort: 5, value: orderTotal,
      confidence: Math.round(rng.float(0.66, 0.9) * 100) / 100, rank: p.actions.length + 1,
      title: orderTotal > 0 ? '{Order} draft: {n} lines, {amount}' : '{Order} draft: {n} lines',
      saw: 'The last three {orders} for this {account} and the gaps found today.',
      compared: 'What similar {accounts} in {area} take at this time of year.',
      vars: { n: p.order.length, amount: fmt.money(orderTotal), area: acc.area },
    };
    p.brief = [plan, ...p.actions, draft];
  }

  // ---- Territory and team --------------------------------------------------
  const annualCurrent = accounts.reduce((s, a) => s + a.current, 0);
  const target = nice((annualCurrent / 12) * 1.12);
  const territory = {
    city: city.name, region: city.region, target, achieved: nice(target * rng.float(0.5, 0.78)),
    opportunity: nice(accounts.reduce((s, a) => s + a.whiteSpace, 0)),
    headlineKpi: { id: industry.kpis[0].id, value: rng.int(industry.kpis[0].range[0], industry.kpis[0].range[1]) },
  };

  const reps = [
    { ...rep, self: true, area: city.areas[0] },
    ...[0, 1, 2].map((i) => ({ ...person(), title: industry.personas.rep, area: city.areas[(i + 2) % city.areas.length] })),
  ].map((r) => {
    const plannedN = r.self ? planned.length : rng.int(6, 8);
    const done = r.self ? 0 : rng.int(1, plannedN - 2);
    return { ...r, planned: plannedN, done, actionsDone: r.self ? 0 : done * rng.int(2, 4), value: r.self ? 0 : nice(rng.float(0.4, 1.4) * (target / 22) * (done / plannedN)), overrides: r.self ? 0 : rng.int(0, 3) };
  });

  // Exceptions raised earlier today by other reps (sample).
  const exceptions = [];
  const others = reps.filter((r) => !r.self);
  for (let i = 0; i < 3; i++) {
    const r = others[i % others.length];
    const seg = rng.pick(industry.segments);
    const type = rng.pick(seg.types);
    const area = rng.pick(city.areas);
    const def = rng.pick(industry.actions);
    const product = def.uses === 'none' ? null : offeringForAction(seg, def.uses);
    const blocked = i === 2;
    const reason = blocked ? rng.pick(industry.outcomeReasons.filter((x) => x.blocked)) : rng.pick(industry.overrideReasons.filter((x) => x.label !== 'Other'));
    exceptions.push({
      id: `X${i + 1}`, live: false, kind: blocked ? 'blocked' : 'override', rep: r.name, account: accountName(type, area, city.name),
      key: !!seg.key, title: def.title, vars: { amount: fmt.money(nice(def.value[1] * country.priceFactor)), product: product ? product.name : '', person: 'the {contact}', area, city: city.name, event: event.name, eventDays: event.days, days: rng.int(3, 12), weeks: rng.int(3, 8), n: rng.int(2, 4), qty: rng.int(3, 12), pct: rng.int(12, 38), peers: rng.int(6, 18), type: type.type, segment: seg.name },
      reason: reason.label, note: '', route: reason.route === 'kam' || (seg.key && i === 0) ? 'kam' : 'manager', at: DAY_START + 40 + i * 47,
    });
  }

  const agents = AGENTS.map((ag) => ({ ...ag, owner: ag.id === 'gap' ? manager : admin }));

  return { seedKey: `${industry.id}|${country.id}|${SEED_VERSION}`, city, rep, manager, admin, kam, event, accounts, byId, planned, territory, reps, exceptions, agents };
}
