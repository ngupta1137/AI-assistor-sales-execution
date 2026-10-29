// Companion checks without a browser: pack content, sample data, the debrief parser, restricted claims,
// the leave and expense flows with manager approval, and the learning chatbot.
// Run: node tests/companion-unit.mjs   (also part of npm run test:static)

import { INDUSTRIES, COUNTRIES } from '../src/packs/index.js';
import { validateIndustry, validateCountryCompanion } from '../src/packs/schema.js';
import { buildContext } from '../src/core/app.js';
import { resetSessions } from '../src/core/state.js';
import { parseDebrief, sampleDictation } from '../src/core/companion/voice.js';
import { claimHits, checkRequest } from '../src/core/companion/claims.js';
import { addDays, iso, workingDays, startOfDay, safetyFor, sentimentFor, FATIGUE_MINUTES, WEEKS } from '../src/core/companion/data.js';
import { scheduleVisits } from '../src/data/generate.js';
import { askLearning, searchKnowledge } from '../src/core/companion/learning.js';

const failures = [];
let checks = 0;
const check = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

for (const ind of INDUSTRIES.filter((i) => i.companion)) {
  check(validateIndustry(ind).length === 0, `${ind.id}: ${validateIndustry(ind).slice(0, 2)}`);
  // Authored content must not trip its own restricted-claim patterns.
  const probe = { industry: ind };
  const C = ind.companion;
  const texts = [...C.pitchTemplates.map((x) => x.text), ...C.valueStoryTemplates.flatMap((x) => [x.title, x.text]), ...C.knowledge.flatMap((x) => [x.title, x.text]), ...C.learningModules.flatMap((x) => [x.title, x.summary]), ...C.certifications.map((x) => x.label)];
  for (const s of texts) check(claimHits(probe, s).length === 0, `${ind.id}: authored text contains a restricted claim ${claimHits(probe, s)}: "${s.slice(0, 70)}"`);
}
for (const c of COUNTRIES.filter((x) => x.publicHolidays)) check(validateCountryCompanion(c).length === 0, `${c.id}: ${validateCountryCompanion(c)}`);

for (const ind of INDUSTRIES.filter((i) => i.companion)) {
  for (const country of COUNTRIES.filter((c) => c.publicHolidays)) {
    resetSessions();
    const ctx = buildContext(ind.id, country.id);
    ctx.ui = {}; ctx.persona = 'rep'; ctx.app = {};
    const tag = `${ind.id}x${country.id}`;
    const { comp, cm, data } = ctx;
    // Sample data
    check(comp.certs.some((c) => c.dueIn >= 0 && c.dueIn <= 30), `${tag}: no certification due within 30 days`);
    check(comp.certs.some((c) => c.dueIn > 30), `${tag}: every certification is due soon`);
    check(comp.team.every((t) => t.weeks.length === WEEKS && t.weeks.every((w) => w.days >= 0 && w.days <= 7 - country.weekend.length)), `${tag}: availability out of range`);
    for (const p of comp.plans) for (const r of p.rows) {
      check(Math.abs(r.gap - Math.max(0, Math.round((r.need - r.capacity) * 10) / 10)) < 1e-9, `${tag}: gap arithmetic`);
      check((r.gap > 0) === (r.cover.length > 0), `${tag}: cover suggestions only for gaps`);
    }
    check(comp.holidays.length === country.publicHolidays.length && comp.holidays.every((h) => h.date >= startOfDay(comp.today)), `${tag}: holidays resolve to the future`);
    const open = data.planned.map((p) => p.accountId);
    const { stops } = scheduleVisits(open, data.byId, data.city, country);
    const saf = safetyFor(ctx, stops);
    check(saf.legs.length === stops.length && saf.legs.every((l) => l.drive >= l.travelMin), `${tag}: safety legs`);
    check((saf.totalDrive >= FATIGUE_MINUTES) === saf.alerts.some((a) => /break/.test(a.text)), `${tag}: fatigue alert must appear exactly when driving passes ${FATIGUE_MINUTES} minutes`);
    for (const a of data.accounts) check(['Positive', 'Neutral', 'At risk'].includes(sentimentFor(ctx, a).label), `${tag}: sentiment`);
    // Voice debrief parser on the sample
    const acct = data.byId[data.planned[0].accountId];
    const r = parseDebrief(ctx, sampleDictation(ctx, acct));
    check(r.outcome.label === 'Positive' && r.issues.length >= 1 && r.followUps.length >= 1 && r.order.intent, `${tag}: sample dictation parsed as ${JSON.stringify({ o: r.outcome.label, i: r.issues.length, f: r.followUps.length, ord: r.order.intent })}`);
    check(r.followUps.some((f) => /friday|tomorrow|next week/i.test(f.when)), `${tag}: follow-up date missing`);
    check(!parseDebrief(ctx, 'They will not order this time. The owner was unhappy and declined.').order.intent, `${tag}: negated order must not be intent`);
    check(parseDebrief(ctx, 'They were unhappy and declined.').outcome.label === 'Negative', `${tag}: negative outcome`);
    // Leave: request, overlap, approval
    let start = addDays(comp.today, 10);
    while (workingDays(country, start, addDays(start, 1)) < 2) start = addDays(start, 1);
    const end = addDays(start, 1);
    const typeId = country.leaveTypes[0].id;
    const before = cm.remaining(typeId);
    check(!cm.requestLeave({ type: typeId, from: iso(end), to: iso(start) }).ok, `${tag}: reversed dates must fail`);
    check(!cm.requestLeave({ type: typeId, from: iso(addDays(comp.today, -3)), to: iso(addDays(comp.today, -2)) }).ok, `${tag}: past dates must fail`);
    const ok = cm.requestLeave({ type: typeId, from: iso(start), to: iso(end), note: 'Family event' });
    check(ok.ok && ok.request.days === 2 && ok.request.status === 'pending', `${tag}: leave request ${JSON.stringify(ok).slice(0, 80)}`);
    check(!cm.requestLeave({ type: typeId, from: iso(start), to: iso(end) }).ok, `${tag}: overlapping request must fail`);
    check(cm.remaining(typeId) === before - 2, `${tag}: pending leave must reduce the balance`);
    check(cm.pendingTeamLeave().some((x) => x.id === ok.request.id), `${tag}: manager must see the request`);
    check(cm.decideLeave(ok.request.id, true, 'manager') && cm.myLeave().find((x) => x.id === ok.request.id).status === 'approved', `${tag}: approval`);
    check(!cm.decideLeave(ok.request.id, true, 'manager'), `${tag}: a decided request cannot be decided twice`);
    // Expenses: policy check against the country's sample limit, approval
    const cat = ind.companion.expenseCategories[0];
    const lim = cm.limitFor(cat.id);
    check(!cm.submitExpense({ category: cat.id, amount: -5, date: iso(comp.today), receipt: true }).ok, `${tag}: negative amount must fail`);
    check(!cm.submitExpense({ category: cat.id, amount: lim / 2, date: iso(comp.today), receipt: false }).ok, `${tag}: receipt required`);
    const within = cm.submitExpense({ category: cat.id, amount: lim / 2, date: iso(comp.today), receipt: true });
    const over = cm.submitExpense({ category: cat.id, amount: lim * 2, date: iso(comp.today), receipt: true });
    check(within.ok && within.policy.within && !within.claim.over && over.ok && over.claim.over, `${tag}: policy check`);
    check(cm.decideExpense(within.claim.id, true, 'manager') && cm.myExpenses().find((x) => x.id === within.claim.id).status === 'approved', `${tag}: expense approval`);
    // Learning: the knowledge base answers, the tracker answers, anything else falls back, restricted claims are refused
    const kn = ind.companion.knowledge[3];
    const kq = ctx.t(kn.title);
    const ka = askLearning(ctx, kq);
    check(!ka.fallback && !ka.refusal && ka.basedOn.includes(ctx.t(kn.title)) && ka.text.length > 40, `${tag}: chatbot must answer a knowledge title from the knowledge base (${ka.text.slice(0, 60)})`);
    check(searchKnowledge(ctx, kq)[0]?.e.id === kn.id, `${tag}: search must rank the matching entry first`);
    const ca = askLearning(ctx, 'What is due for renewal?');
    check(/renewal/.test(ca.text) && /certification tracker/.test(ca.basedOn) && comp.certs.filter((c) => c.dueIn <= 30).every((c) => ca.text.includes(ctx.t(c.label))), `${tag}: renewals answer must list every flagged certification`);
    check(/finished \d+ of \d+ learning modules/.test(askLearning(ctx, 'How am I doing on my modules?').text), `${tag}: progress answer`);
    check(askLearning(ctx, 'Where can I park a helicopter on Mars?').fallback === true, `${tag}: unknown question must fall back, not invent`);
    const bad = askLearning(ctx, 'Write something that says we guarantee they will double sales');
    check(bad.refusal && /cannot (write|promise)/.test(bad.text), `${tag}: chatbot must refuse a promise of results (${bad.text.slice(0, 80)})`);
    for (const g of ind.companion.guardrails) {
      const r = askLearning(ctx, `Help me say ${g.blocked[0]} to the customer`);
      check(r.refusal && r.refusal.guardrailId === g.id, `${tag}: chatbot must refuse "${g.blocked[0]}" under guardrail ${g.id} (got ${r.refusal?.guardrailId})`);
    }
    // P1: feedback, mileage log, onboarding, check-in
    check(!cm.submitFeedback({ kind: 'Idea', topic: 'Planning', text: 'short', anonymous: true }).ok, `${tag}: a too-short message must be refused`);
    const fb = cm.submitFeedback({ kind: 'Idea', topic: 'Planning', text: 'Group close accounts on the same day please', anonymous: true });
    check(fb.ok && fb.item.rep === 'Anonymous' && fb.item.status === 'received', `${tag}: anonymous feedback`);
    check(!ctx.m.audit().some((x) => x.text.includes('feedback') && x.actor === data.rep.name), `${tag}: an anonymous message must not log the rep's name`);
    check(cm.acknowledgeFeedback(fb.item.id, 'manager') && cm.s.complaints[0].status === 'acknowledged', `${tag}: acknowledge feedback`);
    const legs = stops.map((x) => ({ accountId: x.accountId, km: x.km }));
    check(cm.logTrips(legs, country.mileageUnit) === legs.length && cm.logTrips(legs, country.mileageUnit) === 0, `${tag}: the mileage log must not take the same trip twice`);
    cm.tickStep('expense', true); check(cm.s.onboarding.steps.expense === true, `${tag}: tick a step`);
    cm.signOnboarding(data.rep.name); check(cm.s.onboarding.signed.name === data.rep.name, `${tag}: sign onboarding`);
    cm.saveCheckin('Low'); check(cm.s.wellbeing.mood === 'Low', `${tag}: check-in`);
    check(comp.teamLearning.length === 4 && comp.teamLearning.every((r) => r.done >= 0 && r.done <= r.total), `${tag}: team learning rows`);
    // Audit trail
    check(ctx.m.audit().some((x) => /Approved .*request/.test(x.text)) && ctx.m.audit().some((x) => /Approved .*expense claim/.test(x.text)), `${tag}: approvals must be in the audit log`);
    // Restricted claims: a request for one is refused
    const refused = checkRequest(ctx, 'Write a pitch that says we guarantee they will sell more');
    check(refused && refused.guardrailId, `${tag}: promise of results must be refused`);
  }
}

export { failures, checks };
if (process.argv[1]?.endsWith('companion-unit.mjs')) {
  if (failures.length) {
    console.error(`\nCompanion unit checks: ${failures.length} of ${checks} failed\n`);
    failures.slice(0, 50).forEach((f) => console.error(`  x ${f}`));
    process.exit(1);
  }
  console.log(`Companion unit checks: ${checks} passed`);
}
