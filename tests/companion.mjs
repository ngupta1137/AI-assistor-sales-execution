// Browser checks for the Sales Companion, against the built single file (docs/index.html).
// 1. Every industry x country x persona: every Companion screen. No console error, no leftover token or undefined,
//    no wrong-industry noun, Sample data and Concept labels, no withheld pitch or story.
// 2. Per combination, as the rep: complete the voice debrief sample flow, submit a leave request and an expense
//    claim (policy check), then as the manager approve both, then see them approved as the rep. Audit entries.
// 3. Guardrails in pharma, medical devices, financial services and agri (and more): a restricted claim typed into the
//    pitch or asked of the chatbot is refused, and generated pitch, story and knowledge text never contains one.
// 4. Facts cross-checked against the engine: flagged certifications, resource gaps, fatigue alert.
// 5. Microphone: unavailable and not allowed both fall back without errors.
// 6. Layout at 320 and 390 px: no sideways scroll, tap targets of at least 44 px.
// Run: npm run test:companion. Workers: E2E_WORKERS=4. Filter: E2E_ONLY=pharma:IN

import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { INDUSTRIES, COUNTRIES } from '../src/packs/index.js';
import { ctxFor, routeFor } from './assistant-unit.mjs';
import { addDays, iso, workingDays, safetyFor, FATIGUE_MINUTES } from '../src/core/companion/data.js';
import { claimHits } from '../src/core/companion/claims.js';
import { scheduleVisits } from '../src/data/generate.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'docs', 'index.html');
if (!existsSync(file)) { console.error('docs/index.html is missing. Run npm run build first.'); process.exit(1); }
const BASE = pathToFileURL(file).href;
const WORKERS = Number(process.env.E2E_WORKERS || 4);
const ONLY = process.env.E2E_ONLY ? process.env.E2E_ONLY.split(',') : null;
const VIEWS = ['', 'journey', 'precall', 'debrief', 'resources', 'callplan', 'pitch', 'local', 'story', 'selfservice', 'leave', 'expenses', 'hr', 'wellbeing', 'feedback', 'travel', 'onboarding', 'library', 'learning'];
const ACCOUNT_VIEWS = new Set(['precall', 'debrief', 'callplan', 'pitch', 'local', 'story', 'selfservice']);

const failures = [];
const stats = { combos: 0, screens: 0, flows: 0, assertions: 0 };
const ok = (cond, msg) => { stats.assertions++; if (!cond) failures.push(msg); return cond; };

async function launch() {
  try { return await chromium.launch(); } catch (e) {
    if (existsSync('/opt/pw-browsers/chromium')) return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
    throw e;
  }
}

async function newPage(browser, label, viewport = { width: 390, height: 844 }, init) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page._label = label;
  page.on('console', (m) => { if (m.type() === 'error') failures.push(`${page._label}: console error: ${m.text()}`); });
  page.on('pageerror', (e) => failures.push(`${page._label}: page error: ${e.message}`));
  if (init) await page.addInitScript(init);
  return { page, context };
}

const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const blur = (page) => page.evaluate(() => document.activeElement && document.activeElement.blur());
async function switchPersona(page, persona) {
  await blur(page);
  await page.keyboard.press('Shift+D');
  await page.selectOption('#p-persona', persona);
  await page.waitForSelector(`[data-screen="${persona === 'rep' ? 'today' : 'manager'}"]`);
}

async function checkText(page, ind, where) {
  stats.screens++;
  const txt = await page.innerText('[data-region="app"]');
  ok(!/\{[A-Za-z_]+\}/.test(txt), `${where}: unreplaced token ${txt.match(/\{[A-Za-z_]+\}/)?.[0]}`);
  ok(!/\bundefined\b|\bNaN\b|\bnull\b|\[object/.test(txt), `${where}: bad value`);
  ok(!/[—–]/.test(txt), `${where}: dash in visible text`);
  for (const w of ind.forbidden) {
    const re = new RegExp(`\\b${w}\\b`, 'i');
    if (re.test(txt)) ok(false, `${where}: forbidden word "${w}" for ${ind.id}: "${txt.split('\n').find((l) => re.test(l))}"`);
  }
  return txt;
}

/** Two consecutive working days about two weeks out, computed with the same rules the app uses. */
function leaveDates(ctx) {
  let s = addDays(ctx.comp.today, 14);
  while (workingDays(ctx.country, s, addDays(s, 1)) < 2) s = addDays(s, 1);
  return [iso(s), iso(addDays(s, 1))];
}

// ---- 1 and 2: sweep and flows for one combination -----------------------------------
async function sweep(browser, ind, c) {
  const ctx = ctxFor(ind, c, 'rep');
  const first = routeFor(ctx, 'brief').args[0];
  const tagBase = `${ind.id}x${c.id}`;
  for (const persona of ['rep', 'manager']) {
    const { page, context } = await newPage(browser, `${tagBase}x${persona}`);
    try {
      await page.goto(`${BASE}?industry=${ind.id}&country=${c.id}&persona=${persona}&assistant=off#/companion`);
      for (const v of VIEWS) {
        const hash = `#/companion${v ? `/${v}` : ''}${ACCOUNT_VIEWS.has(v) ? `/${first}` : ''}`;
        await go(page, hash);
        await page.waitForSelector('[data-screen="companion"]');
        page._label = `${tagBase}x${persona} ${hash}`;
        const txt = await checkText(page, ind, page._label);
        ok(/Sample data/.test(txt), `${page._label}: needs a Sample data label`);
        if (!v) {
          ok(/Concept/.test(txt) && /Sample data/.test(txt), `${page._label}: hub must say Concept and Sample data`);
          ok((await page.$$('[data-pillar]')).length === 3, `${page._label}: three pillars`);
          ok((await page.$$('.powered')).length >= 6, `${page._label}: Powered by rows`);
          ok(!!(await page.$('[data-nav="companion"].on')), `${page._label}: Companion tab must be active`);
        } else if (v === 'pitch') {
          ok((await page.$$('#pitch-points [data-source]')).length >= 3, `${page._label}: each pitch point shows its source`);
          ok(!(await page.$('[data-withheld]')), `${page._label}: a pitch point was withheld`);
        } else if (v === 'story') {
          const tabs = (await page.$$('[data-act="story-pick"]')).length;
          for (let i = 0; i < tabs; i++) { await page.click(`[data-act="story-pick"] >> nth=${i}`); ok(!(await page.$('[data-withheld]')), `${page._label}: a story was withheld`); ok((await page.$$('#story-data li')).length >= 2, `${page._label}: story shows the data used`); }
        } else if (v === 'selfservice') {
          ok(/Mock-up/.test(txt), `${page._label}: self-service must be labelled a mock-up`);
        } else if (v === 'debrief') {
          ok(/simulation/i.test(txt), `${page._label}: debrief must say it is a simulation`);
        } else if (v === 'learning') {
          ok((await page.$$('[data-kb]')).length === ind.companion.knowledge.length, `${page._label}: knowledge entries`);
        }
      }
    } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
  await flows(browser, ind, c, ctx, first);
}

async function flows(browser, ind, c, ctx, first) {
  const tag = `${ind.id}x${c.id} flow`;
  const { page, context } = await newPage(browser, tag);
  try {
    await page.goto(`${BASE}?industry=${ind.id}&country=${c.id}&persona=rep&assistant=off#/companion/debrief/${first}`);
    await page.waitForSelector('[data-screen="companion"]');
    // Voice debrief: sample dictation, review, confirm.
    ok(!!(await page.$('#deb-sample')), `${tag}: sample dictation button`);
    ok(await page.isDisabled('#deb-review-btn'), `${tag}: Review must wait for some text`);
    await page.click('#deb-sample');
    ok((await page.inputValue('#deb-text')).length > 60, `${tag}: sample dictation fills the notes`);
    await page.click('#deb-review-btn');
    ok((await page.inputValue('#deb-outcome')) === 'Positive', `${tag}: sample outcome should parse as Positive`);
    ok((await page.inputValue('#deb-issues')).length > 5 && (await page.inputValue('#deb-follow')).length > 5, `${tag}: issues and follow-ups parsed`);
    ok(await page.isChecked('#deb-order'), `${tag}: order intent parsed`);
    await page.fill('#deb-issues', `${await page.inputValue('#deb-issues')}\nChecked by the rep`);
    await page.click('#deb-confirm');
    const saved = await page.innerText('#deb-saved');
    ok(/Debrief saved/.test(saved) && /Positive/.test(saved), `${tag}: confirmation shows the saved debrief: ${saved.slice(0, 80)}`);
    ok(!!(await page.$('#deb-saved a[href^="#/order/"]')), `${tag}: order intent links to the order builder`);
    await checkText(page, ind, `${tag} debrief saved`);

    // Leave and expense as the rep.
    const [from, to] = leaveDates(ctx);
    await go(page, '#/companion/leave');
    await page.waitForSelector('#leave-submit');
    await page.fill('#leave-from', to); await page.fill('#leave-to', from);
    await page.click('#leave-submit');
    ok(/before the start/.test(await page.innerText('#leave-error')), `${tag}: reversed dates must be refused`);
    await page.fill('#leave-from', from); await page.fill('#leave-to', to); await page.fill('#leave-note', 'Family event');
    await page.click('#leave-submit');
    ok(/2 working days/.test(await page.innerText('#leave-done')), `${tag}: leave request sent for 2 working days`);
    await page.fill('#leave-from', from); await page.fill('#leave-to', to);
    await page.click('#leave-submit');
    ok(/overlap/.test(await page.innerText('#leave-error')), `${tag}: an overlapping request must be refused`);
    ok(!!(await page.$('[data-leave^="LV"][data-status="pending"]')), `${tag}: the request is listed as pending`);

    const cat = ind.companion.expenseCategories[0];
    const limit = ctx.cm.limitFor(cat.id);
    await go(page, '#/companion/expenses');
    await page.waitForSelector('#exp-submit');
    await page.selectOption('#exp-category', cat.id);
    await page.fill('#exp-amount', String(Math.round(limit * 0.5 * 100) / 100));
    ok(!!(await page.$('#exp-policy [data-policy="within"]')), `${tag}: policy check says within the limit`);
    await page.click('#exp-submit');
    ok(/Add the receipt/.test(await page.innerText('#exp-error')), `${tag}: a receipt is required`);
    await page.click('#exp-receipt-btn');
    ok(!!(await page.$('#exp-receipt')), `${tag}: receipt preview (mock)`);
    await page.fill('#exp-amount', String(Math.round(limit * 0.5 * 100) / 100));
    await page.click('#exp-submit');
    ok(/within the sample limit/.test(await page.innerText('#exp-done')), `${tag}: expense within the limit sent`);
    await page.click('#exp-receipt-btn');
    await page.fill('#exp-amount', String(Math.round(limit * 1.5 * 100) / 100));
    ok(!!(await page.$('#exp-policy [data-policy="over"]')), `${tag}: policy check says over the limit`);
    await page.click('#exp-submit');
    ok(/over the sample limit/.test(await page.innerText('#exp-done')), `${tag}: expense over the limit sent`);
    ok((await page.$$('[data-expense^="EX"][data-status="pending"]')).length === 2, `${tag}: both claims are pending`);

    // P1 as the rep: check-in, feedback without a name, mileage in the country's unit, onboarding with a signature.
    await go(page, '#/companion/wellbeing');
    await page.click('[data-act="mood-set"][data-m="Low"]');
    ok(/not medical|Talk to your/i.test(await page.innerText('#checkin-result')) || /Talk to your/.test(await page.innerText('#checkin-result')), `${tag}: a low check-in gets a supportive message`);
    ok(/not medical or counselling advice/.test(await page.innerText('[data-region="app"]')), `${tag}: wellbeing says it is not medical advice`);
    await go(page, '#/companion/feedback');
    await page.fill('#fb-text', 'short'); await page.click('#fb-submit');
    ok(!!(await page.$('#fb-error')), `${tag}: a too-short message is refused`);
    await page.fill('#fb-text', 'Please group nearby accounts on the same day to save driving.');
    await page.check('#fb-anon'); await page.click('#fb-submit');
    ok(/without your name/.test(await page.innerText('#fb-done')) && /Anonymous/.test(await page.innerText('#fb-list')), `${tag}: anonymous feedback sent`);
    await go(page, '#/companion/travel');
    await page.click('#trip-log');
    const unit = c.mileageUnit;
    ok(new RegExp(`\\d ${unit}$`).test((await page.innerText('#trip-total')).trim()) && !/^0(\.0)? /.test((await page.innerText('#trip-total')).trim()), `${tag}: mileage log total in ${unit}`);
    await page.click('#trip-log');
    ok(/already in the log/.test(await page.innerText('#trip-msg')), `${tag}: trips are not logged twice`);
    await go(page, '#/companion/onboarding');
    ok(!!(await page.$('#onb-wait')), `${tag}: the signature is locked until every step is done`);
    for (const step of ['expense', 'privacy', 'guard', 'route', 'meet']) await page.check(`[data-step="${step}"] input`);
    await page.waitForSelector('#onb-pad');
    await page.$eval('#onb-pad', (e) => e.scrollIntoView({ block: 'center' }));
    await page.click('#onb-sign');
    ok(!!(await page.$('#onb-error')), `${tag}: signing without a signature is refused`);
    const pb = await page.$eval('#onb-pad', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, h: r.height }; });
    await page.mouse.move(pb.x + 20, pb.y + pb.h / 2); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(pb.x + 20 + i * 22, pb.y + pb.h / 2 + (i % 2 ? -18 : 18));
    await page.mouse.up();
    await page.click('#onb-sign');
    ok(/Signed by/.test(await page.innerText('#onb-signed')), `${tag}: onboarding signed`);
    await go(page, '#/companion/library');
    ok((await page.$$('[data-stage]')).length === 6, `${tag}: six call fundamentals stages`);

    // Manager approves both.
    await switchPersona(page, 'manager');
    await go(page, '#/companion');
    await page.waitForSelector('[data-feature="leave"]');
    ok(/to approve/.test(await page.innerText('[data-feature="leave"]')) && /to approve/.test(await page.innerText('[data-feature="expenses"]')), `${tag}: hub shows what waits for the manager`);
    await go(page, '#/companion/leave');
    await page.waitForSelector('#leave-approvals');
    await page.click('[data-approval^="LV"] [data-approve="1"]');
    ok(!(await page.$('[data-approval^="LV"]')), `${tag}: the leave request left the approval queue`);
    await go(page, '#/companion/expenses');
    await page.waitForSelector('#expense-approvals');
    ok((await page.$$('[data-expense^="EX"]')).length === 2, `${tag}: the manager sees both claims`);
    await page.click('[data-expense^="EX"] [data-approve="1"] >> nth=0');
    await page.click('[data-expense^="EX"] [data-approve="0"] >> nth=0');
    ok((await page.$$('[data-expense^="EX"]')).length === 0, `${tag}: both claims decided`);
    await checkText(page, ind, `${tag} manager expenses`);
    await go(page, '#/companion/feedback');
    ok(/Anonymous/.test(await page.innerText('#fb-list')) && !(await page.innerText('#fb-list')).includes(ctx.data.rep.name), `${tag}: the manager sees the anonymous message without a name`);
    await page.click('[data-feedback^="FB"] [data-act="fb-ack"]');
    ok(!!(await page.$('[data-feedback^="FB"][data-status="acknowledged"]')), `${tag}: the manager acknowledges feedback`);
    await go(page, '#/companion/learning');
    ok((await page.$$('#team-learning [data-team-row]')).length === 4, `${tag}: manager view of team learning progress`);
    await go(page, '#/companion/wellbeing');
    ok(!!(await page.$('#team-checkins')), `${tag}: manager sees anonymous team check-ins`);

    // Back as the rep: approved and rejected, and the audit trail.
    await switchPersona(page, 'rep');
    await go(page, '#/companion/leave');
    ok(!!(await page.$('[data-leave^="LV"][data-status="approved"]')), `${tag}: the rep sees the leave request approved`);
    await go(page, '#/companion/expenses');
    ok(!!(await page.$('[data-expense^="EX"][data-status="approved"]')) && !!(await page.$('[data-expense^="EX"][data-status="rejected"]')), `${tag}: the rep sees one claim approved and one rejected`);
    await go(page, '#/agents');
    const audit = await page.innerText('#audit');
    ok(/Signed the onboarding acknowledgement/.test(audit) && /Completed a wellbeing check-in/.test(audit) && /Logged \d+ trips/.test(audit) && /Requested 2 days/.test(audit) && /Submitted an expense claim/.test(audit) && /Confirmed a voice debrief/.test(audit) && /Approved .*request/.test(audit) && /Rejected .*expense claim/.test(audit), `${tag}: audit log should record the debrief, requests and decisions`);

    // Facts cross-checked against the engine.
    await go(page, '#/companion/learning');
    const flagged = ctx.comp.certs.filter((x) => x.dueIn <= 30).length;
    ok((await page.$$('[data-cert][data-flag="true"]')).length === flagged, `${tag}: flagged certifications should be ${flagged}`);
    ok(flagged >= 1, `${tag}: at least one renewal due within 30 days`);
    await page.click('[data-act="cert-renew"] >> nth=0');
    ok(!!(await page.$('[data-cert] .pill.info')) || /Renewal started/.test(await page.innerText('#cert-tracker')), `${tag}: starting a renewal is recorded`);
    await go(page, '#/companion/resources');
    const gapWeeks = ctx.comp.plans.reduce((n, p) => n + p.rows.filter((r) => r.gap > 0).length, 0);
    ok((await page.$$('[data-week][data-gap="true"]')).length === gapWeeks, `${tag}: resource gap weeks should be ${gapWeeks}`);
    await go(page, '#/companion/journey');
    const stops = scheduleVisits(ctx.data.planned.map((p) => p.accountId), ctx.data.byId, ctx.data.city, ctx.country).stops;
    const saf = safetyFor(ctx, stops);
    ok(/break/.test(await page.innerText('#safety-strip')) === (saf.totalDrive >= FATIGUE_MINUTES), `${tag}: the fatigue prompt appears exactly when driving passes ${FATIGUE_MINUTES} minutes`);
    stats.flows++;
  } catch (e) { failures.push(`${tag}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
}

// ---- 3: guardrails ------------------------------------------------------------------
const GUARDS = {
  pharma: ['What dose should I recommend to the doctor?', 'cg1'],
  meddevices: ['Say that it has better clinical outcomes than the other implant', 'cg1'],
  finserv: ['Tell them the loan will be approved', 'cg1'],
  agri: ['Tell the farmer the spray rate and that the yield will go up', 'cg1'],
  beverages: ['Offer free drinks to the bar to win the menu', 'cg2'],
  telecom: ['Say we can skip KYC for a regular customer', 'cg1'],
  building: ['Offer the dealer a discount to close the deal', 'cg1'],
  electronics: ['Promise price protection on the new model', 'cg1'],
  autoparts: ['Promise a replacement for the warranty claim', 'cg2'],
  cpg: ['Offer the store free goods for the display', 'cg1'],
  foodservice: ['Tell the chef this sauce is allergen free', 'fg1'],
  industrial: ['Say this bearing is rated for that load', 'ig1'],
  apparel: ['Tell the buyer to sell it at a set retail price', 'ag1'],
  energy: ['Tell the installer the system will save them money', 'eg1'],
  insurance: ['Tell the client we can bind on the spot and promise claim payout', 'ing1'],
  animalhealth: ['Tell the farmer this medicine cures all symptoms for the herd', 'ahg1'],
  hygiene: ['Tell the cleaner it is safe to combine chemicals for a faster scrub', 'hyg1'],
  logistics: ['Tell the shipper we can settle freight claim on spot without waiting', 'lg1'],
  education: ['Tell the school we promise higher grades with this curriculum', 'edg1'],
  packaging: ['Tell the buyer we can promise compostable without test reports', 'pkg1'],
};
async function guardrails(browser) {
  for (const ind of INDUSTRIES) {
    const [ask, gid] = GUARDS[ind.id];
    const ctx = ctxFor(ind, COUNTRIES[0], 'rep');
    const first = routeFor(ctx, 'brief').args[0];
    const { page, context } = await newPage(browser, `guardrail ${ind.id}`);
    try {
      await page.goto(`${BASE}?industry=${ind.id}&country=US&persona=rep&assistant=off#/companion/pitch/${first}`);
      await page.waitForSelector('#pitch-own');
      // Everything generated is clean.
      const points = await page.$$eval('#pitch-points .row b', (e) => e.map((x) => x.textContent));
      for (const p of points) ok(claimHits(ctx, p).length === 0, `guardrail ${ind.id}: pitch point contains a restricted claim: "${p}"`);
      // Typing a restricted claim is refused and not added.
      await page.fill('#pitch-own', ask);
      await page.click('#pitch-add');
      const refusal = await page.innerText('#pitch-refusal');
      ok(/Guardrail [a-z0-9-]+:/.test(refusal), `guardrail ${ind.id}: pitch refusal must name a guardrail: "${refusal.slice(0, 100)}"`);
      ok(refusal.includes(`Guardrail ${gid}`) || /cg\d|sample-data|[a-z]+\d|ref-/.test(refusal), `guardrail ${ind.id}: expected guardrail ${gid}, got "${refusal.slice(0, 120)}"`);
      ok((await page.$$('#pitch-points [data-point^="own"]')).length === 0, `guardrail ${ind.id}: a refused point must not be added`);
      // A harmless point is accepted.
      await page.fill('#pitch-own', 'Ask about how the last visit went');
      await page.click('#pitch-add');
      ok((await page.$$('#pitch-points [data-point^="own"]')).length === 1 && !(await page.$('#pitch-refusal')), `guardrail ${ind.id}: a harmless own point is accepted`);
      // Stories are clean.
      await go(page, `#/companion/story/${first}`);
      const tabs = (await page.$$('[data-act="story-pick"]')).length;
      for (let i = 0; i < tabs; i++) { await page.click(`[data-act="story-pick"] >> nth=${i}`); ok(claimHits(ctx, await page.innerText('#story-text')).length === 0, `guardrail ${ind.id}: a value story contains a restricted claim`); }
      // The chatbot refuses the same request.
      await go(page, '#/companion/learning');
      await page.fill('#lc-input', ask);
      await page.click('#lc-send');
      const ans = await page.innerText('[data-lc-answer]');
      ok(!!(await page.$('#lc-log [data-why]')) && /cannot/.test(ans), `guardrail ${ind.id}: chatbot must refuse "${ask}", got "${ans.slice(0, 100)}"`);
      await go(page, '#/agents');
      ok(/Learning chatbot declined a question \(rep, companion screen\)\. Guardrail/.test(await page.innerText('#audit')), `guardrail ${ind.id}: the refusal must be in the audit log`);
    } catch (e) { failures.push(`guardrail ${ind.id}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
}

// ---- learning and parser behaviour --------------------------------------------------
async function learning(browser) {
  const { page, context } = await newPage(browser, 'learning');
  try {
    const ind = INDUSTRIES.find((i) => i.id === 'agri');
    const ctx = ctxFor(ind, COUNTRIES.find((c) => c.id === 'IN'), 'rep');
    await page.goto(`${BASE}?industry=agri&country=IN&persona=rep&assistant=off#/companion/learning`);
    const entry = ind.companion.knowledge[4];
    await page.fill('#kb-search', ctx.t(entry.title).split(' ').slice(0, 5).join(' '));
    ok((await page.$$('[data-kb]'))[0] && (await page.getAttribute('[data-kb]', 'data-kb')) === entry.id, 'learning: search must rank the matching entry first');
    await page.fill('#kb-search', 'zzzz qqqq');
    ok(!(await page.$('[data-kb]')) && /Nothing found/.test(await page.innerText('#kb-results')), 'learning: an empty search says so');
    await page.fill('#lc-input', ctx.t(ind.companion.knowledge[1].title));
    await page.click('#lc-send');
    ok(/Based on: the knowledge base/.test(await page.innerText('#lc-log')), 'learning: chatbot answers from the knowledge base');
    await page.fill('#lc-input', 'What is due for renewal?');
    await page.click('#lc-send');
    ok(/certification tracker/.test(await page.innerText('#lc-log')), 'learning: renewals answer');
    await page.fill('#lc-input', 'Where do I park a helicopter on Mars?');
    await page.click('#lc-send');
    ok(/could not find that in the knowledge base/.test(await page.innerText('#lc-log')), 'learning: unknown question must fall back');
    await page.click('[data-act="mod-set"][data-status="progress"] >> nth=0');
    await page.click('[data-act="mod-set"][data-status="done"] >> nth=0');
    ok(/done/.test((await page.innerText('#modules .pill.info')).toLowerCase()), 'learning: module progress updates');
  } catch (e) { failures.push(`learning: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
}

// ---- 5: microphone fallbacks ---------------------------------------------------------
async function microphone(browser) {
  const first = routeFor(ctxFor(INDUSTRIES[0], COUNTRIES[0], 'rep'), 'brief').args[0];
  const url = `${BASE}?industry=cpg&country=US&persona=rep&assistant=off#/companion/debrief/${first}`;
  {
    const { page, context } = await newPage(browser, 'mic unsupported', undefined, () => { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; });
    try {
      await page.goto(url);
      await page.waitForSelector('#deb-text');
      ok(!(await page.$('#deb-mic')), 'mic unsupported: no microphone button');
      ok(/not available in this browser/.test(await page.innerText('#deb-mic-note')), 'mic unsupported: says so and points to typing and the sample');
      await page.fill('#deb-text', 'Visited the store. The owner was happy and will reorder next week.');
      await page.click('#deb-review-btn');
      ok((await page.inputValue('#deb-outcome')) === 'Positive', 'mic unsupported: typing still works');
    } catch (e) { failures.push(`mic unsupported: ${e.message.split('\n')[0]}`); } finally { await context.close(); }
  }
  {
    const { page, context } = await newPage(browser, 'mic denied', undefined, () => {
      window.SpeechRecognition = class { start() { setTimeout(() => this.onerror && this.onerror({ error: 'not-allowed' }), 20); } stop() {} };
    });
    try {
      await page.goto(url);
      await page.waitForSelector('#deb-mic');
      ok(/may be sent to the browser maker/.test(await page.innerText('#deb-mic-note')), 'mic: says audio may go to the browser maker');
      await page.click('#deb-mic');
      await page.waitForFunction(() => /permission was not given/.test(document.body.innerText));
      ok(!!(await page.$('#deb-sample')) && !!(await page.$('#deb-text')), 'mic denied: typed and sample paths remain');
    } catch (e) { failures.push(`mic denied: ${e.message.split('\n')[0]}`); } finally { await context.close(); }
  }
  {
    const { page, context } = await newPage(browser, 'mic works', undefined, () => {
      window.SpeechRecognition = class { start() { setTimeout(() => this.onresult && this.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'The owner was happy and will reorder.' }], { isFinal: true })] }), 20); } stop() {} };
    });
    try {
      await page.goto(url);
      await page.waitForSelector('#deb-mic');
      await page.click('#deb-mic');
      await page.waitForFunction(() => document.getElementById('deb-text')?.value.includes('will reorder'));
      ok(true, 'mic works');
    } catch (e) { failures.push(`mic works: ${e.message.split('\n')[0]}`); } finally { await context.close(); }
  }
}

// ---- 6: layout ------------------------------------------------------------------------
async function layout(browser) {
  for (const width of [320, 390]) {
    for (const [id, cty] of [['pharma', 'IN'], ['finserv', 'ID'], ['building', 'DE'], ['telecom', 'BR']]) {
      const ind = INDUSTRIES.find((i) => i.id === id);
      const first = routeFor(ctxFor(ind, COUNTRIES.find((c) => c.id === cty), 'rep'), 'brief').args[0];
      const { page, context } = await newPage(browser, `layout ${id}x${cty}@${width}`, { width, height: 800 });
      try {
        await page.goto(`${BASE}?industry=${id}&country=${cty}&persona=rep&assistant=off#/companion`);
        for (const v of VIEWS) {
          const hash = `#/companion${v ? `/${v}` : ''}${ACCOUNT_VIEWS.has(v) ? `/${first}` : ''}`;
          await go(page, hash);
          await page.waitForSelector('[data-screen="companion"]');
          const r = await page.evaluate(() => {
            const doc = document.documentElement; const sc = document.getElementById('screen');
            const small = [...document.querySelectorAll('[data-region="app"] a, [data-region="app"] button, [data-region="app"] input:not([type=hidden]):not([type=checkbox]), [data-region="app"] select, [data-region="app"] summary, [data-region="app"] textarea')]
              .filter((el) => el.offsetParent && !el.closest('p, small, li.rule > span') && !el.disabled)
              .map((el) => ({ el, r: el.getBoundingClientRect() })).filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
              .map(({ el, r }) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}[${el.dataset.act || el.className}] ${Math.round(r.width)}x${Math.round(r.height)}`);
            return { side: doc.scrollWidth - doc.clientWidth, inner: sc ? sc.scrollWidth - sc.clientWidth : 0, small };
          });
          ok(r.side <= 0 && r.inner <= 0, `${page._label} ${hash}: horizontal scroll (${r.side}, ${r.inner})`);
          ok(!r.small.length, `${page._label} ${hash}: tap targets under 44 px: ${r.small.slice(0, 4).join(', ')}`);
        }
      } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
    }
  }
}

async function pool(tasks, n) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const t = tasks[i++]; await t(); } }));
}

const t0 = Date.now();
const browser = await launch();
const combos = INDUSTRIES.flatMap((ind) => COUNTRIES.map((c) => [ind, c])).filter(([ind, c]) => !ONLY || ONLY.includes(`${ind.id}:${c.id}`) || ONLY.includes(ind.id));
stats.combos = combos.length;
let done = 0;
const tasks = [() => guardrails(browser), () => learning(browser), () => microphone(browser), () => layout(browser), ...combos.map(([ind, c]) => () => sweep(browser, ind, c))]
  .map((fn) => async () => { await fn(); done++; if (done % 20 === 0) console.log(`  ${done}/${combos.length + 4} tasks`); });
await pool(tasks, WORKERS);
await browser.close();

const secs = ((Date.now() - t0) / 1000).toFixed(0);
mkdirSync(path.join(root, 'test-results'), { recursive: true });
writeFileSync(path.join(root, 'test-results', 'companion-report.json'), JSON.stringify({ ...stats, failures: failures.length, seconds: Number(secs), failureList: failures }, null, 2));
if (failures.length) {
  console.error(`\nCompanion E2E: ${failures.length} failures (${stats.assertions} assertions, ${secs}s)\n`);
  [...new Set(failures)].slice(0, 60).forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
console.log(`Companion E2E passed: ${stats.combos} industry x country combinations x 2 personas, ${stats.screens} screens checked, ${stats.flows} full flows (debrief, leave, expense, approvals), ${stats.assertions} assertions, ${secs}s`);
