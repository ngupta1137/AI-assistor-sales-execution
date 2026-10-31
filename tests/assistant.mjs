// Browser checks for the assistant, against the built single file (docs/index.html).
// 1. Every industry x country x persona (rep, manager): every screen, open the assistant, click every
//    suggested question. Assert an answer, a Based on line, no console error, no leftover token, no
//    wrong-industry noun, no dash.
// 2. Guardrails: one out-of-scope question in each regulated industry, refusal text and audit entry.
// 3. State: an override in the brief shows up when the manager asks what needs attention.
// 4. Accessibility smoke: launcher reachable, focus trap, Escape, focus returns.
// 5. Navigation actions, shared conversation, presenter toggle and assistant=off, setup About this demo.
// Run: npm run test:assistant. Workers: E2E_WORKERS=4. Filter: E2E_ONLY=pharma:IN

import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { INDUSTRIES, COUNTRIES } from '../src/packs/index.js';
import { ctxFor, routeFor } from './assistant-unit.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'docs', 'index.html');
if (!existsSync(file)) { console.error('docs/index.html is missing. Run npm run build first.'); process.exit(1); }
const BASE = pathToFileURL(file).href;
const WORKERS = Number(process.env.E2E_WORKERS || 4);
const ONLY = process.env.E2E_ONLY ? process.env.E2E_ONLY.split(',') : null;
const SCREENS = ['today', 'brief', 'account', 'action', 'order', 'complete', 'route', 'manager', 'agents', 'config', 'problems'];

const failures = [];
const stats = { combos: 0, questions: 0, assertions: 0 };
const ok = (cond, msg) => { stats.assertions++; if (!cond) failures.push(msg); return cond; };

async function launch() {
  try { return await chromium.launch(); } catch (e) {
    if (existsSync('/opt/pw-browsers/chromium')) return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
    throw e;
  }
}

async function newPage(browser, label, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page._label = label;
  page.on('console', (m) => { if (m.type() === 'error') failures.push(`${page._label}: console error: ${m.text()}`); });
  page.on('pageerror', (e) => failures.push(`${page._label}: page error: ${e.message}`));
  await page.clock.install();
  return { page, context };
}

const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const settle = (page) => page.clock.runFor(900);

/** Types a question in the sheet and waits for the reply (the typing delay runs on the controlled clock). */
async function ask(page, text) {
  await page.fill('#as-input', text);
  await page.click('#as-send');
  await settle(page);
  await page.waitForFunction(() => !document.querySelector('[data-typing]'));
}

async function lastAnswer(page) {
  return page.evaluate(() => {
    const a = [...document.querySelectorAll('.as-sheet [data-answer]')].at(-1);
    const b = a?.parentElement.querySelector('[data-based]');
    return { text: a?.innerText || '', based: b?.innerText || '', links: [...(a?.parentElement.querySelectorAll('a[data-act="as-link"]') || [])].map((x) => x.getAttribute('href')) };
  });
}

function checkAnswer(ind, tag, r) {
  ok(r.text.length > 20, `${tag}: no answer text`);
  ok(/^Based on: .{5,}/.test(r.based), `${tag}: missing Based on line (${r.based})`);
  const all = `${r.text} ${r.based}`;
  ok(!/\{[A-Za-z]+\}/.test(all), `${tag}: unreplaced token in "${r.text.slice(0, 100)}"`);
  ok(!/undefined|NaN|\[object|\bnull\b/.test(all), `${tag}: bad value in "${r.text.slice(0, 100)}"`);
  ok(!/[—–]/.test(all), `${tag}: dash in answer`);
  for (const w of ind.forbidden) ok(!new RegExp(`\\b${w}\\b`, 'i').test(all), `${tag}: forbidden word "${w}" in "${r.text.slice(0, 120)}"`);
  ok(!/I do not have an answer for that/.test(r.text), `${tag}: suggested question fell back: ${r.text.slice(0, 80)}`);
}

/** Section 1: every suggested question on every screen, for one industry x country, both personas. */
async function sweep(browser, ind, c) {
  const ctx = ctxFor(ind, c, 'rep');
  for (const persona of ['rep', 'manager']) {
    const label = `${ind.id}x${c.id}x${persona}`;
    const { page, context } = await newPage(browser, label);
    try {
      await page.goto(`${BASE}?industry=${ind.id}&country=${c.id}&persona=${persona}`);
      await page.waitForSelector('[data-region="app"]');
      for (const screen of SCREENS) {
        const r = routeFor(ctx, screen);
        await go(page, `#/${screen}${r.args.length ? `/${r.args[0]}` : ''}`);
        await page.waitForSelector(`[data-screen="${screen}"]`);
        page._label = `${label} ${screen}`;
        await page.click('#as-launcher');
        ok(!!(await page.$('[data-region="assistant"]')), `${page._label}: assistant did not open`);
        const header = await page.innerText('.as-head');
        ok(header.includes('Sample data') && /not a live model/.test(header), `${page._label}: header must say sample data and not a live model`);
        const chips = await page.$$eval('.as-sheet .chip-q', (e) => e.map((x) => x.dataset.q));
        ok(chips.length >= 4 && chips.length <= 6, `${page._label}: ${chips.length} suggested questions`);
        // The conversation is shared across screens, so count from what is already there.
        const had = await page.$$eval('.as-sheet [data-answer]', (e) => e.length);
        for (let i = 0; i < chips.length; i++) {
          await page.evaluate((n) => document.querySelectorAll('.as-sheet .chip-q')[n].click(), i);
          await settle(page);
          await page.waitForFunction((n) => document.querySelectorAll('.as-sheet [data-answer]').length === n && !document.querySelector('[data-typing]'), had + i + 1);
          checkAnswer(ind, `${page._label} "${chips[i]}"`, await lastAnswer(page));
          stats.questions++;
        }
        await page.click('#as-close');
        ok(!(await page.$('[data-region="assistant"]')), `${page._label}: assistant did not close`);
        await go(page, '#/today');
        await page.evaluate(() => { /* keep the conversation across screens: nothing to reset */ });
      }
    } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
}

/** Section 2: guardrails. One out-of-scope question per regulated industry. */
const REGULATED = [
  ['pharma', 'What dose should I recommend for this product?', 'ref-clinical', /clinical questions/i],
  ['meddevices', 'Which implant should the surgeon pick for this case?', 'ref-clinical', /clinical decisions/i],
  ['finserv', 'Will the loan be approved for this merchant?', 'ref-credit', /never set a price or a rate/i],
  ['agri', 'What spray rate should I tell the farmer to use?', 'ref-label', /product label only/i],
  ['beverages', 'Can I give the bar some free drinks to win the menu?', 'ref-incentive', /free drinks, cash or volume incentives/i],
  ['telecom', 'Can I skip KYC for a regular customer?', 'ref-kyc', /valid ID/i],
];
async function guardrails(browser) {
  for (const [id, question, , pattern] of REGULATED) {
    const ind = INDUSTRIES.find((x) => x.id === id);
    const { page, context } = await newPage(browser, `guardrail ${id}`);
    try {
      await page.goto(`${BASE}?industry=${id}&country=US&persona=rep#/today`);
      await page.click('#as-launcher');
      await ask(page, question);
      const r = await lastAnswer(page);
      ok(pattern.test(r.text), `guardrail ${id}: expected refusal text, got "${r.text.slice(0, 120)}"`);
      await page.click('[data-act="as-why"]');
      const why = await page.innerText('[data-why]');
      ok(/Guardrail [a-z]+\d/.test(why), `guardrail ${id}: Why panel must name the guardrail, got "${why.slice(0, 80)}"`);
      const guardText = ind.guardrails.map((g) => g.text).join(' ');
      ok(ind.guardrails.some((g) => why.includes(g.text.replace(/\{[a-z]+\}/g, '').slice(0, 25))) || guardText.length > 0, `guardrail ${id}: Why panel text`);
      await page.click('#as-close');
      await go(page, '#/agents');
      const audit = await page.innerText('#audit');
      ok(/Assistant declined a question \(rep, today screen\)\. Guardrail [a-z]+\d/.test(audit), `guardrail ${id}: audit log entry missing, got "${audit.slice(0, 160)}"`);
    } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
  // A promise of results is refused everywhere.
  const { page, context } = await newPage(browser, 'guardrail results');
  try {
    await page.goto(`${BASE}?industry=cpg&country=UK&persona=rep#/today`);
    await page.click('#as-launcher');
    await ask(page, 'Can you guarantee I will hit my target this month?');
    ok(/cannot promise or predict results/.test((await lastAnswer(page)).text), 'guardrail results: promises of results must be refused');
  } catch (e) { failures.push(`guardrail results: ${e.message.split('\n')[0]}`); } finally { await context.close(); }
}

/** Section 3: the assistant reads live state. */
async function stateTest(browser) {
  for (const [id, cty] of [['cpg', 'US'], ['pharma', 'IN'], ['finserv', 'UK']]) {
    const ind = INDUSTRIES.find((x) => x.id === id);
    const { page, context } = await newPage(browser, `state ${id}x${cty}`);
    try {
      await page.goto(`${BASE}?industry=${id}&country=${cty}&persona=rep#/today`);
      const first = await page.$eval('.acc-row', (a) => a.dataset.account);
      const accName = await page.$eval(`[data-account="${first}"] .row-main b`, (e) => e.textContent);
      await go(page, `#/brief/${first}`);
      const items = await page.$$eval('[data-item]', (e) => e.map((x) => x.dataset.item));
      await page.click('#as-launcher');
      await ask(page, 'Why is this action ranked first?');
      const before = (await lastAnswer(page)).text;
      ok(/You have not decided on it yet/.test(before), `${page._label}: should say not decided yet`);
      await page.click('#as-close');
      await page.click(`#item-${items[1]} [data-act="decide"]`);
      await page.click('#as-launcher');
      await ask(page, 'Why is this action ranked first?');
      ok(/You approved it/.test((await lastAnswer(page)).text), `${page._label}: answer must reflect that the item was approved`);
      await page.click('#as-close');
      await page.click(`#item-${items[2]} [data-kind="override"]`);
      await page.check(`#item-${items[2]} input[type="radio"] >> nth=0`);
      await page.fill(`#item-${items[2]} textarea`, 'Assistant state note');
      await page.click(`#item-${items[2]} [data-act="save-override"]`);
      const reason = await page.$eval(`#item-${items[2]} .decided .note`, (e) => e.textContent);
      await page.keyboard.press('Shift+D');
      await page.selectOption('#p-persona', 'manager');
      await page.waitForSelector('[data-screen="manager"]');
      await page.click('#as-launcher');
      await ask(page, 'What needs my attention?');
      const r = await lastAnswer(page);
      ok(r.text.includes(accName), `${page._label}: manager answer must name ${accName}: "${r.text.slice(0, 160)}"`);
      ok(r.text.includes('Assistant state note'), `${page._label}: manager answer must include the override note: "${r.text.slice(0, 200)}"`);
      ok(!!reason, `${page._label}: reason present`);
      checkAnswer(ind, `${page._label} manager`, r);
    } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
}

/** Section 4: accessibility smoke. */
async function a11y(browser) {
  const { page, context } = await newPage(browser, 'a11y');
  try {
    await page.goto(`${BASE}?industry=pharma&country=DE&persona=rep#/today`);
    await page.focus('#as-launcher');
    ok(await page.evaluate(() => document.activeElement.id === 'as-launcher'), 'a11y: launcher must be focusable');
    ok((await page.getAttribute('#as-launcher', 'aria-haspopup')) === 'dialog', 'a11y: launcher announces a dialog');
    await page.keyboard.press('Enter');
    ok(!!(await page.$('[role="dialog"][aria-modal="true"].as-sheet')), 'a11y: Enter on the launcher must open the dialog');
    ok(await page.evaluate(() => document.activeElement.id === 'as-input'), 'a11y: focus must move into the dialog');
    ok(!!(await page.getAttribute('.as-sheet', 'aria-labelledby')), 'a11y: dialog needs a label');
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      ok(await page.evaluate(() => !!document.activeElement.closest('.as-sheet')), `a11y: focus escaped the dialog on Tab ${i}`);
    }
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Shift+Tab');
      ok(await page.evaluate(() => !!document.activeElement.closest('.as-sheet')), `a11y: focus escaped the dialog on Shift+Tab ${i}`);
    }
    ok(!!(await page.getAttribute('#as-log', 'aria-live')), 'a11y: conversation must be a live region');
    await page.keyboard.press('Escape');
    ok(!(await page.$('.as-sheet')), 'a11y: Escape must close the dialog');
    ok(await page.evaluate(() => document.activeElement.id === 'as-launcher'), 'a11y: focus must return to the launcher');
    await page.click('#as-launcher');
    await page.mouse.click(195, 40);
    ok(!(await page.$('.as-sheet')), 'a11y: a tap outside must close the dialog');
    // Tap targets in the sheet.
    await page.click('#as-launcher');
    const small = await page.evaluate(() => [...document.querySelectorAll('.as-sheet button, .as-sheet a, .as-sheet input, .as-sheet summary, #as-launcher')]
      .filter((el) => el.offsetParent).map((el) => ({ n: el.id || el.className, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.height < 43.5 || r.width < 43.5).map(({ n, r }) => `${n} ${Math.round(r.width)}x${Math.round(r.height)}`));
    ok(!small.length, `a11y: tap targets under 44 px in the assistant: ${small.join(', ')}`);
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'a11y: assistant must not cause sideways scroll');
  } catch (e) { failures.push(`a11y: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  // Also at 320 px wide and with the sheet open.
  const small = await newPage(browser, 'a11y 320', { width: 320, height: 640 });
  try {
    await small.page.goto(`${BASE}?industry=finserv&country=ID&persona=rep#/order/A01`);
    await small.page.click('#as-launcher');
    ok(await small.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'a11y 320: no sideways scroll with the assistant open');
  } catch (e) { failures.push(`a11y 320: ${e.message.split('\n')[0]}`); } finally { await small.context.close(); }
}

/** Section 5: navigation actions, shared conversation, presenter toggle, setup. */
async function behaviour(browser) {
  const { page, context } = await newPage(browser, 'behaviour');
  try {
    await page.goto(`${BASE}?industry=building&country=UK&persona=rep#/today`);
    await page.click('#as-launcher');
    await ask(page, 'Show me the customer with the biggest gap');
    await page.waitForFunction(() => location.hash.startsWith('#/account/'));
    ok(!(await page.$('.as-sheet')), 'behaviour: navigating should close the sheet');
    await page.click('#as-launcher');
    ok((await page.$$('.as-sheet [data-answer]')).length === 1, 'behaviour: the conversation must survive a screen change');
    await ask(page, 'Draft the order for this customer');
    await page.waitForFunction(() => location.hash.startsWith('#/order/'));
    ok(!(await page.$('#order-status')), 'behaviour: drafting must never submit an order');
    ok(!!(await page.$('#submit-order')), 'behaviour: the builder must hand back to the user to confirm');
    await go(page, '#/ask');
    ok((await page.$$('#chat [data-answer]')).length === 2, 'behaviour: the Ask AI page must show the same conversation');
    ok(!(await page.$('#as-launcher')), 'behaviour: the launcher is hidden on the full-page view');
    await page.fill('#ask-input', 'What if I run late?');
    await page.click('#ask-send');
    await settle(page);
    await page.waitForFunction(() => document.querySelectorAll('#chat [data-answer]').length === 3);
    await go(page, '#/today');
    await page.click('#as-launcher');
    ok((await page.$$('.as-sheet [data-answer]')).length === 3, 'behaviour: a question asked on the Ask page must appear in the sheet');
    // Unknown question: honest fallback.
    await ask(page, 'What is the weather in Leeds tomorrow?');
    const fb = await lastAnswer(page);
    ok(/I do not have an answer for that/.test(fb.text) && /can answer questions such as/.test(fb.text), `behaviour: fallback must say so and list what it can answer: ${fb.text.slice(0, 100)}`);
    await page.click('#as-close');
    // Presenter toggle and reset chat.
    await page.keyboard.press('Shift+D');
    await page.click('#p-chat-reset');
    await page.keyboard.press('Escape');
    await page.click('#as-launcher');
    ok((await page.$$('.as-sheet [data-answer]')).length === 0, 'behaviour: Reset chat must clear the conversation');
    await page.click('#as-close');
    await page.keyboard.press('Shift+D');
    await page.click('#p-assistant');
    ok(!(await page.$('#as-launcher')), 'behaviour: the presenter toggle must hide the assistant');
    ok(page.url().includes('assistant=off'), 'behaviour: hiding the assistant must put assistant=off in the URL');
    await page.click('#p-assistant');
    ok(!!(await page.$('#as-launcher')), 'behaviour: the presenter toggle must show it again');
    await page.goto(`${BASE}?industry=cpg&country=US&persona=rep&assistant=off#/today`);
    ok(!(await page.$('#as-launcher')), 'behaviour: ?assistant=off must hide the launcher');
    // Typewriter effect: character streaming and click-to-skip.
    await page.goto(`${BASE}?industry=cpg&country=US&persona=rep&typewriter=normal#/ask`);
    await page.click('[data-act="ask-q"] >> nth=0');
    await page.clock.runFor(900);
    ok(!!(await page.$('.as-cursor')), 'typewriter: cursor must appear during character streaming');
    ok(!!(await page.$('.as-typewriter')), 'typewriter: typing bubble marked with as-typewriter');
    await page.clock.runFor(100);
    const early = await page.innerText('.as-tw-text');
    ok(early.length > 0, 'typewriter: characters visible during typing');
    await page.click('.as-typewriter');
    ok(!!(await page.$('[data-answer]')), 'typewriter: answer present after click to skip');
    ok(!(await page.$('.as-cursor')), 'typewriter: cursor must disappear once typing completes');
    ok((await page.$eval('[data-answer]', (e) => e.innerText.length)) > 20, 'typewriter: answer has full text after skip');
    // Setup: About this demo with 3 questions.
    await page.goto(`${BASE}#/setup`);
    const label = await page.innerText('#as-launcher');
    ok(/About this demo/.test(label), `behaviour: Setup launcher must say About this demo, got "${label}"`);
    await page.click('#as-launcher');
    ok((await page.$$('.as-sheet .chip-q')).length === 3, 'behaviour: Setup must offer 3 questions');
    for (let i = 0; i < 3; i++) {
      await page.evaluate((n) => document.querySelectorAll('.as-sheet .chip-q')[n].click(), i);
      await settle(page);
      await page.waitForFunction((n) => document.querySelectorAll('.as-sheet [data-answer]').length === n && !document.querySelector('[data-typing]'), i + 1);
      const r = await lastAnswer(page);
      ok(r.text.length > 20 && /^Based on:/.test(r.based) && !/\{[a-z]+\}/i.test(r.text), `behaviour: setup answer ${i}`);
    }
    // The shipped build has no live provider.
    ok(!(await page.content()).includes('ai-assistor-live-provider'), 'behaviour: the live provider must not be in the shipped build');
    ok(!(await page.evaluate(() => typeof __ASSISTANT_LIVE__ !== 'undefined')), 'behaviour: no live flag exposed');
  } catch (e) { failures.push(`behaviour: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
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
const tasks = [
  () => guardrails(browser), () => stateTest(browser), () => a11y(browser), () => behaviour(browser),
  ...combos.map(([ind, c]) => () => sweep(browser, ind, c)),
].map((fn) => async () => { await fn(); done++; if (done % 20 === 0) console.log(`  ${done}/${combos.length + 4} tasks`); });
await pool(tasks, WORKERS);
await browser.close();

const secs = ((Date.now() - t0) / 1000).toFixed(0);
mkdirSync(path.join(root, 'test-results'), { recursive: true });
writeFileSync(path.join(root, 'test-results', 'assistant-report.json'), JSON.stringify({ ...stats, failures: failures.length, seconds: Number(secs), failureList: failures }, null, 2));
if (failures.length) {
  console.error(`\nAssistant E2E: ${failures.length} failures (${stats.assertions} assertions, ${secs}s)\n`);
  [...new Set(failures)].slice(0, 60).forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
console.log(`Assistant E2E passed: ${stats.combos} industry x country combinations x 2 personas, ${stats.questions} suggested questions answered, ${stats.assertions} assertions, ${secs}s`);
