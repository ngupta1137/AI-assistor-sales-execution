// End-to-end checks in a headless browser against the built single file (docs/index.html).
// Covers all 14 industries x 11 countries x 3 personas and every P0 screen.
// Fails on any console error, leftover {token}, undefined/NaN, or a forbidden industry noun.
// Run: npm test (builds first) or npm run test:e2e. Workers: E2E_WORKERS=4. Filter: E2E_ONLY=pharma:IN

import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { INDUSTRIES, COUNTRIES } from '../src/packs/index.js';
import { createText } from '../src/core/text.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'docs', 'index.html');
if (!existsSync(file)) { console.error('docs/index.html is missing. Run npm run build first.'); process.exit(1); }
const BASE = pathToFileURL(file).href;
const WORKERS = Number(process.env.E2E_WORKERS || 4);
const ONLY = process.env.E2E_ONLY ? process.env.E2E_ONLY.split(',') : null;
const CURRENCY = { US: '$', UK: '£', DE: '€', FR: '€', AU: '$', NZ: '$', IN: '₹', BR: 'R$', ID: 'Rp', MX: '$', AE: 'AED' };
const DIST = { US: 'mi', UK: 'mi' };

const failures = [];
const stats = { combos: 0, pages: 0, screens: 0, flows: 0, setupStarts: 0, assertions: 0 };
const ok = (cond, msg) => { stats.assertions++; if (!cond) failures.push(msg); return cond; };

async function launch() {
  try { return await chromium.launch(); } catch (e) {
    if (existsSync('/opt/pw-browsers/chromium')) return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
    throw e;
  }
}

/** A page that records console errors for the current label. */
async function newPage(browser, label) {
  const context = await browser.newContext({ viewport: { width: 400, height: 860 } });
  const page = await context.newPage();
  page._label = label;
  page.on('console', (m) => { if (m.type() === 'error') failures.push(`${page._label}: console error: ${m.text()}`); });
  page.on('pageerror', (e) => failures.push(`${page._label}: page error: ${e.message}`));
  stats.pages++;
  return { page, context };
}

const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);

/** Visible text checks on the app region (presenter menu and setup are excluded by design). */
async function checkText(page, ind, where) {
  stats.screens++;
  const txt = await page.innerText('[data-region="app"]');
  const tokens = txt.match(/\{[A-Za-z_]+\}/g);
  ok(!tokens, `${where}: unreplaced tokens ${tokens}`);
  const bad = txt.match(/\bundefined\b|\bNaN\b|\bnull\b|\[object/g);
  ok(!bad, `${where}: bad values ${bad}`);
  ok(!/[—–]/.test(txt), `${where}: em or en dash in visible text`);
  for (const w of ind.forbidden) {
    const re = new RegExp(`\\b${w}\\b`, 'i');
    if (re.test(txt)) {
      const line = txt.split('\n').find((l) => re.test(l));
      ok(false, `${where}: forbidden word "${w}" for ${ind.id}: "${line}"`);
    }
  }
  return txt;
}

/** Captures whatever evidence the open action asks for, including drawing a signature. */
async function captureEvidence(page) {
  if (await page.$('[data-act="ev-photo"]')) await page.click('[data-act="ev-photo"]');
  else if (await page.$('[data-act="ev-scan"]')) await page.click('[data-act="ev-scan"]');
  else if (await page.$('#ev-note-text')) { await page.fill('#ev-note-text', 'Done with the contact.'); await page.click('[data-act="ev-note"]'); }
  else if (await page.$('#sign-pad')) {
    await page.$eval('#sign-pad', (e) => e.scrollIntoView({ block: 'center' }));
    const b = await page.$eval('#sign-pad', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await page.mouse.move(b.x + 20, b.y + b.h / 2); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(b.x + 20 + i * 25, b.y + b.h / 2 + (i % 2 ? -20 : 20));
    await page.mouse.up();
    await page.click('#sign-save');
  }
}

async function counts(page) {
  return page.$$eval('#counts [data-count]', (els) => Object.fromEntries(els.map((e) => [e.dataset.count, Number(e.querySelector('b').textContent)])));
}

/** The full rep story for one industry x country, then manager and agents in the same session. */
async function repFlow(browser, ind, c) {
  const label = `${ind.id}x${c.id}`;
  const { page, context } = await newPage(browser, label);
  try {
    await page.goto(`${BASE}?industry=${ind.id}&country=${c.id}&persona=rep`);
    await page.waitForSelector('[data-screen="today"]');
    const today = await checkText(page, ind, `${label} today`);
    ok(/AI Assistor/.test(await page.innerText('.appbar')), `${label}: header must show the short name AI Assistor`);
    ok(today.includes(CURRENCY[c.id]), `${label}: today should show ${CURRENCY[c.id]}`);
    ok(new RegExp(`\\d ${DIST[c.id] || 'km'}\\b`).test(today), `${label}: distances should be in ${DIST[c.id] || 'km'}`);
    const ids = await page.$$eval('.acc-row', (as) => as.map((a) => a.dataset.account));
    ok(ids.length >= 6 && ids.length <= 8, `${label}: ${ids.length} planned, need 6 to 8`);
    const first = ids[0];
    const firstName = await page.$eval(`[data-account="${first}"] .row-main b`, (e) => e.textContent);

    // Every brief, action, account, order and complete screen: text checks.
    for (const id of ids) {
      for (const s of ['brief', 'account', 'order', 'complete']) { await go(page, `#/${s}/${id}`); await checkText(page, ind, `${label} ${s}/${id}`); }
      await go(page, `#/brief/${id}`);
      const acts = await page.$$eval('[data-kind="action"]', (e) => e.map((x) => x.dataset.item));
      ok(acts.length >= 3 && acts.length <= 6, `${label} brief/${id}: ${acts.length} actions`);
      for (const a of acts) { await go(page, `#/action/${a}`); await checkText(page, ind, `${label} action/${a}`); }
    }

    // Visit brief: approve, adjust, override, counts update live.
    await go(page, `#/brief/${first}`);
    const items = await page.$$eval('[data-item]', (e) => e.map((x) => ({ id: x.dataset.item, kind: x.dataset.kind })));
    ok(items[0].kind === 'plan' && items.at(-1).kind === 'order', `${label}: brief should start with the plan and end with the order draft`);
    const c0 = await counts(page);
    ok(c0.pending === items.length && c0.approved === 0, `${label}: initial counts ${JSON.stringify(c0)}`);
    await page.click(`#item-${items[0].id} [data-act="decide"]`);
    let c1 = await counts(page);
    ok(c1.approved === 1 && c1.pending === items.length - 1, `${label}: approve did not update counts ${JSON.stringify(c1)}`);

    const adjustId = items[1].id;
    await page.click(`#item-${adjustId} [data-kind="adjust"]`);
    ok(await page.isDisabled(`#item-${adjustId} [data-act="save-adjust"]`), `${label}: save adjustment should wait for a choice`);
    await page.check(`#item-${adjustId} input[type="radio"] >> nth=1`);
    await page.click(`#item-${adjustId} [data-act="save-adjust"]`);
    c1 = await counts(page);
    ok(c1.adjusted === 1, `${label}: adjust did not update counts ${JSON.stringify(c1)}`);

    const overrideId = items[2].id;
    await page.click(`#item-${overrideId} [data-kind="override"]`);
    ok(await page.isDisabled(`#item-${overrideId} [data-act="save-override"]`), `${label}: override must require a reason`);
    await page.fill(`#item-${overrideId} textarea`, 'Demo note');
    await page.check(`#item-${overrideId} input[type="radio"] >> nth=0`);
    // F04: keep typing after picking the reason, then save straight away. The note must survive.
    await page.type(`#item-${overrideId} textarea`, ' from the e2e test');
    await page.click(`#item-${overrideId} [data-act="save-override"]`);
    ok((await page.innerText(`#item-${overrideId}`)).includes('Demo note from the e2e test'), `${label}: saved override must show its note in the brief`);
    c1 = await counts(page);
    ok(c1.overridden === 1 && c1.pending === items.length - 3, `${label}: override did not update counts ${JSON.stringify(c1)}`);
    ok((await page.getAttribute(`#item-${overrideId}`, 'data-state')) === 'overridden', `${label}: overridden item state`);
    await checkText(page, ind, `${label} brief after decisions`);

    // Action detail: typed evidence, then outcome.
    await go(page, `#/action/${adjustId}`);
    ok(await page.isDisabled('#mark-done'), `${label}: Mark done must wait for evidence`);
    await captureEvidence(page);
    ok(!(await page.isDisabled('#mark-done')), `${label}: evidence capture did not enable Mark done`);
    await go(page, '#/today');
    const monthBefore = await page.innerText('.stat-row');
    await go(page, `#/action/${adjustId}`);
    await page.click('#mark-done');
    ok((await page.innerText('[data-region="screen"]')).includes('Done'), `${label}: outcome not recorded`);
    await go(page, '#/today');
    ok((await page.innerText('.stat-row')) === monthBefore, `${label}: F03 completing an action must not change month-to-date actuals`);
    await go(page, `#/account/${first}`);
    ok(!(await page.$(`#open-gaps a[href="#/action/${adjustId}"]`)) && !!(await page.$(`#recorded-gaps a[href="#/action/${adjustId}"]`)), `${label}: F08 a done action must leave open gaps`);
    await go(page, `#/action/${adjustId}`);
    await checkText(page, ind, `${label} action done`);

    // Order builder: rules evaluate live; submit.
    await go(page, `#/order/${first}`);
    const lineMax = await page.$('[data-rule="lineMax"]');
    if (lineMax) {
      const sample = await page.$$eval('.line', (ls) => ls.filter((l) => /No charge/.test(l.textContent)).map((l) => l.dataset.line));
      if (sample.length) {
        for (let i = 0; i < 4; i++) await page.click(`[data-line="${sample[0]}"] [data-d="1"]`);
        ok((await page.getAttribute('[data-rule="lineMax"]', 'data-triggered')) === 'true', `${label}: line limit did not trigger`);
        ok(await page.isDisabled('#submit-order'), `${label}: submit must be blocked over the line limit`);
        for (let i = 0; i < 4; i++) await page.click(`[data-line="${sample[0]}"] [data-d="-1"]`);
      }
    }
    const totalRule = await page.$('[data-rule="totalAbove"]');
    if (totalRule) {
      const before = await page.innerText('#order-total');
      const lines = await page.$$eval('.line', (ls) => ls.map((l) => ({ id: l.dataset.line, unit: Number(l.dataset.unit || 0) })).filter((l) => l.unit > 0).sort((a, b) => b.unit - a.unit));
      if (lines.length) {
        const triggered = await page.evaluate((lineId) => {
          document.querySelector(`[data-line="${lineId}"] [data-d="1"]`).click();
          for (let i = 0; i < 400; i++) {
            if (document.querySelector('[data-rule="totalAbove"]').dataset.triggered === 'true') return true;
            document.querySelector(`[data-line="${lineId}"] [data-d="1"]`).click();
          }
          return document.querySelector('[data-rule="totalAbove"]').dataset.triggered === 'true';
        }, lines[0].id);
        ok(triggered, `${label}: approval limit never triggered`);
        ok((await page.innerText('#order-total')) !== before, `${label}: total did not change with quantity`);
        ok(/Send for approval/.test(await page.innerText('#submit-order')), `${label}: submit should say Send for approval`);
      }
    }
    await checkText(page, ind, `${label} order adjusted`);
    const prereq = await page.$('[data-rule="prerequisite"][data-triggered="true"]');
    let doneCount = 1;
    if (prereq) {
      // F01: lines priced by people cannot be sent before the needs review with signed consent.
      ok(await page.isDisabled('#submit-order'), `${label}: F01 submit must be blocked until the prerequisite is done`);
      await page.click('[data-rule="prerequisite"] a');
      await page.waitForSelector('[data-screen="action"]');
      await captureEvidence(page);
      if (!(await page.isDisabled('#mark-done'))) { await page.click('#mark-done'); doneCount++; }
      await go(page, `#/order/${first}`);
      ok((await page.getAttribute('[data-rule="prerequisite"]', 'data-triggered')) === 'false', `${label}: prerequisite still missing after the action was done`);
    }
    const expectRoute = (await page.innerText('[data-region="dock"]')).match(/Goes to your (.+?) for approval/)?.[1];
    await page.click('#submit-order');
    ok(!!(await page.$('#order-status')), `${label}: order status missing after submit`);
    if (expectRoute) ok((await page.innerText('#order-status')).includes(`Pending approval with your ${expectRoute}`), `${label}: F06 confirmation must name the routed approver ${expectRoute}`);

    // Visit complete and next best account.
    await go(page, `#/complete/${first}`);
    const sumDone = await page.innerText('[data-sum="done"]');
    ok(new RegExp(`^${doneCount} of \\d`).test(sumDone), `${label}: actions done should be ${doneCount}, got ${sumDone}`);
    await page.click('#complete-visit');
    if (await page.$('#complete-visit-confirm')) {
      ok(!(await page.$('#visit-closed')), `${label}: closing with open outcomes must ask first`);
      await page.click('#complete-visit-confirm');
    }
    ok(!!(await page.$('#visit-closed')), `${label}: visit did not close`);
    ok(!!(await page.$('#next-brief')), `${label}: next best account missing`);
    await checkText(page, ind, `${label} complete`);
    await go(page, '#/today');
    ok((await page.innerText(`[data-account="${first}"]`)).includes('Done'), `${label}: Today should mark the visit done`);

    // P1 Route plan: closing an account re-plans the rest.
    await go(page, '#/route');
    await checkText(page, ind, `${label} route`);
    const stops0 = Number(await page.innerText('[data-route="stops"]'));
    const closeBtn = await page.$('[data-act="close-account"]');
    if (closeBtn) {
      await closeBtn.click();
      ok(!!(await page.$('#replanned')), `${label}: route did not re-plan after closing an account`);
      ok(Number(await page.innerText('[data-route="stops"]')) < stops0, `${label}: closed account still on the route`);
      await checkText(page, ind, `${label} route re-planned`);
    }

    // P1 Ask AI: prepared question and free text answered from data.
    await go(page, '#/ask');
    await page.click('[data-act="ask-q"] >> nth=0');
    await page.waitForSelector('[data-answer]');
    await page.fill('#ask-input', 'Which account should I start with first?');
    await page.click('#ask-send');
    await page.waitForFunction(() => document.querySelectorAll('[data-answer]').length === 2);
    const answers = await page.$$eval('[data-answer]', (e) => e.map((x) => x.innerText));
    ok(answers[1].includes(' is first'), `${label}: Ask AI free text should name the first account`);
    await checkText(page, ind, `${label} ask`);

    // Presenter menu: switch persona to manager in the same session.
    await page.keyboard.press('Shift+D');
    ok(!!(await page.$('[data-region="presenter"]')), `${label}: Shift+D did not open the presenter menu`);
    ok((await page.innerText('[data-region="presenter"]')).includes('Sample data'), `${label}: presenter menu must say Sample data`);
    await page.selectOption('#p-persona', 'manager');
    await page.waitForSelector('[data-screen="manager"]');
    const mgr = await checkText(page, ind, `${label} manager`);
    const live = await page.$$eval('.exception.live', (e) => e.map((x) => ({ kind: x.dataset.kind, text: x.innerText })));
    ok(live.some((x) => x.kind === 'override' && x.text.includes('Demo note from the e2e test')), `${label}: override with its note is not in the exception queue`);
    ok(mgr.includes('Routed'), `${label}: exceptions must show routing`);
    ok(!(await page.innerText('#coverage')).includes(firstName), `${label}: F05 a {visit} closed today must leave coverage gaps`);
    ok((await page.$$('.rep-row')).length === 4, `${label}: manager needs 4 reps`);
    ok((await page.$$('#coaching .coach')).length >= 1, `${label}: coaching prompts missing`);
    ok(!!(await page.$('#coverage')), `${label}: coverage section missing`);
    await page.click('.exception [data-act="ack"]');
    ok((await page.innerText('#exceptions')).includes('Acknowledged'), `${label}: acknowledge failed`);

    // Agent controls: guardrails visible, stop and resume.
    await go(page, '#/agents');
    const ag = await checkText(page, ind, `${label} agents`);
    ok((await page.$$('[data-agent]')).length === 3, `${label}: three agents`);
    const t = createText(ind.vocab, c.spelling);
    for (const g of ind.guardrails) ok(ag.includes(t(g.text)), `${label}: guardrail not shown in agent scope: ${g.text}`);
    await page.click('#toggle-order');
    ok((await page.innerText('[data-agent="order"]')).includes('Stopped'), `${label}: stop button did not stop the Order agent`);
    await go(page, `#/order/${ids[1]}`);
    if (!(await page.$('#order-status'))) ok((await page.innerText('[data-region="app"]')).includes('You can edit this draft'), `${label}: F07 stopped-agent copy must match the editable draft`);
    await go(page, '#/agents');
    await go(page, `#/brief/${ids[1]}`);
    ok((await page.getAttribute('[data-kind="order"]', 'data-state')) === 'paused', `${label}: order draft should pause when the Order agent stops`);
    await checkText(page, ind, `${label} brief paused`);
    await go(page, '#/agents');
    await page.click('#toggle-order');
    ok((await page.innerText('[data-agent="order"]')).includes('Running'), `${label}: resume failed`);
    const audit = await page.innerText('#audit');
    ok(/Approved/.test(audit) && /Overrode/.test(audit) && /Stopped the Order agent/.test(audit), `${label}: audit log should record approvals, overrides and agent stops`);

    // Configuration and problems.
    await go(page, '#/config');
    const cfg = await checkText(page, ind, `${label} config`);
    ok(cfg.includes(ind.vocab.account) && cfg.includes('configuration, not a custom build'), `${label}: config must map vocabulary`);
    await go(page, '#/problems');
    await checkText(page, ind, `${label} problems`);
    ok((await page.$$('.problem')).length === 6, `${label}: six problems`);

    // Admin persona via presenter.
    await page.keyboard.press('Shift+D');
    await page.selectOption('#p-persona', 'admin');
    await page.waitForSelector('[data-screen="config"]');
    await checkText(page, ind, `${label} admin home`);
    stats.flows++;
  } catch (e) {
    failures.push(`${label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`);
  } finally {
    await context.close();
  }
}

/** Direct links for manager and admin personas. */
async function personaLinks(browser, ind, c) {
  for (const persona of ['manager', 'admin']) {
    const label = `${ind.id}x${c.id}x${persona}`;
    const { page, context } = await newPage(browser, label);
    try {
      await page.goto(`${BASE}?industry=${ind.id}&country=${c.id}&persona=${persona}`);
      await page.waitForSelector(`[data-screen="${persona === 'manager' ? 'manager' : 'config'}"]`);
      await checkText(page, ind, label);
      if (persona === 'manager') ok((await page.$$('.exception')).length >= 3, `${label}: exception queue needs sample items`);
    } catch (e) { failures.push(`${label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
  }
}

/** Start demo from the setup screen for every combination. */
async function setupAll(browser, combos) {
  const { page, context } = await newPage(browser, 'setup');
  try {
    await page.goto(BASE);
    await page.waitForSelector('[data-region="setup"]');
    const setupText = await page.innerText('[data-region="setup"]');
    ok(setupText.includes('AI Assistor Sales Execution'), 'setup: full product name');
    ok(/Sample data/.test(setupText), 'setup: Sample data label');
    ok((await page.$$('[data-act="setup-industry"]')).length === 14, 'setup: 14 industries');
    ok((await page.$$('[data-act="setup-country"]')).length === 11, 'setup: 11 countries');
    ok((await page.$$('[data-act="setup-persona"]')).length === 3, 'setup: 3 personas');
    ok(await page.isDisabled('#start-demo'), 'setup: Start demo must wait for a choice');
    for (const [ind, c] of combos) {
      page._label = `setup ${ind.id}x${c.id}`;
      await page.goto(BASE);
      await page.click(`[data-act="setup-industry"][data-id="${ind.id}"]`);
      await page.click(`[data-act="setup-country"][data-id="${c.id}"]`);
      ok(/Signs in as/.test(await page.innerText('.setup-foot')), `${page._label}: sign-in preview`);
      await page.click('#start-demo');
      await page.waitForSelector('[data-screen="today"]');
      ok(page.url().includes(`industry=${ind.id}`) && page.url().includes(`country=${c.id}`), `${page._label}: URL should carry the configuration`);
      stats.setupStarts++;
    }
  } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
}

/** Links, determinism, escaping, long press and reset. */
async function edgeCases(browser) {
  const { page, context } = await newPage(browser, 'edge');
  try {
    await page.goto(`${BASE}?industry=nope&country=US`);
    await page.waitForSelector('[data-region="setup"]');
    ok((await page.innerText('[data-region="setup"]')).includes('unknown industry or country'), 'edge: bad link should explain itself');

    await page.goto(`${BASE}?industry=paints&country=gb&persona=rep`);
    await page.waitForSelector('[data-screen="today"]');
    ok((await page.innerText('[data-region="app"]')).includes('£'), 'edge: aliases paints and gb should open building materials in the UK');

    const xss = encodeURIComponent('<img src=x onerror=window.__x=1>Acme');
    await page.goto(`${BASE}?industry=cpg&country=US&persona=rep&prepared=${xss}&color=ffeb3b`);
    await page.waitForSelector('#prepared');
    ok(!(await page.$('#prepared img')) && !(await page.evaluate(() => window.__x)), 'edge: prepared for must be escaped');
    const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    ok(accent !== '#ffeb3b' && /^#[0-9a-f]{6}$/.test(accent), `edge: light prospect colour must be darkened for contrast, got ${accent}`);

    page._label = 'edge determinism';
    await page.goto(`${BASE}?industry=pharma&country=IN&persona=rep`);
    await page.waitForSelector('[data-screen="today"]');
    const a = await page.innerText('.list');
    await page.reload();
    await page.waitForSelector('[data-screen="today"]');
    ok(a === await page.innerText('.list'), 'edge: same industry and country must show the same data after reload');

    page._label = 'edge long press';
    const box = await (await page.$('#logo')).boundingBox();
    await page.mouse.move(box.x + 10, box.y + 10); await page.mouse.down(); await page.waitForTimeout(800); await page.mouse.up();
    ok(!!(await page.$('[data-region="presenter"]')), 'edge: long press on the logo should open the presenter menu');
    await page.selectOption('#p-industry', 'finserv');
    await page.waitForSelector('[data-screen="today"]');
    ok(page.url().includes('industry=finserv'), 'edge: presenter industry switch should update the URL');
    const t0 = Date.now();
    await page.keyboard.press('Shift+D');
    await page.selectOption('#p-country', 'BR');
    await page.waitForSelector('[data-screen="today"]');
    ok((await page.innerText('[data-region="app"]')).includes('R$'), 'edge: presenter country switch');
    ok(Date.now() - t0 < 1500, `edge: switch took ${Date.now() - t0} ms, PRD wants under 1 second of render`);

    page._label = 'edge reset';
    const id = await page.$eval('.acc-row', (x) => x.dataset.account);
    await go(page, `#/brief/${id}`);
    await page.click('[data-act="approve-all"]');
    ok((await counts(page)).pending === 0, 'edge: approve all remaining');
    await page.keyboard.press('Shift+D');
    await page.click('#p-reset');
    ok(!!(await page.$('#p-reset-confirm')), 'edge: reset must ask for confirmation');
    await page.click('#p-reset-confirm');
    await go(page, `#/brief/${id}`);
    ok((await counts(page)).approved === 0, 'edge: reset demo should clear decisions');
  } catch (e) { failures.push(`${page._label}: ${e.message.split('\n').slice(0, 3).join(' | ')}`); } finally { await context.close(); }
}

/** Layout at real phone widths: no sideways scroll and tap targets of at least 44 px (PRD section 12). */
async function layoutChecks(browser) {
  const combos = [['pharma', 'IN'], ['finserv', 'UK'], ['building', 'DE'], ['telecom', 'ID']];
  for (const width of [320, 390]) {
    for (const [ind, ctry] of combos) {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      page._label = `layout ${ind}x${ctry}@${width}`;
      page.on('pageerror', (e) => failures.push(`${page._label}: page error: ${e.message}`));
      try {
        await page.goto(`${BASE}?industry=${ind}&country=${ctry}&persona=rep#/today`);
        const id = await page.$eval('.acc-row', (a) => a.dataset.account);
        await go(page, `#/brief/${id}`);
        const act = await page.$eval('[data-kind="action"]', (e) => e.dataset.item);
        for (const h of ['#/today', `#/brief/${id}`, `#/action/${act}`, `#/order/${id}`, `#/complete/${id}`, `#/account/${id}`, '#/route', '#/ask', '#/agents', '#/config', '#/problems', '#/manager', '#/setup']) {
          await go(page, h);
          const r = await page.evaluate(() => {
            const doc = document.documentElement;
            const sc = document.getElementById('screen');
            const small = [...document.querySelectorAll('[data-region="app"] a, [data-region="app"] button, [data-region="app"] input:not([type=hidden]), [data-region="app"] select, [data-region="app"] summary, [data-region="setup"] button')]
              .filter((el) => el.offsetParent && !el.closest('p, small, li.rule > span') && !el.disabled)
              .map((el) => ({ el, r: el.getBoundingClientRect() }))
              .filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
              .map(({ el, r }) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}[${el.dataset.act || el.className}] ${Math.round(r.width)}x${Math.round(r.height)}`);
            return { side: doc.scrollWidth - doc.clientWidth, inner: sc ? sc.scrollWidth - sc.clientWidth : 0, small };
          });
          ok(r.side <= 0 && r.inner <= 0, `${page._label} ${h}: horizontal scroll (${r.side}, ${r.inner})`);
          ok(!r.small.length, `${page._label} ${h}: tap targets under 44 px: ${r.small.slice(0, 4).join(', ')}`);
        }
      } catch (e) { failures.push(`${page._label}: ${e.message.split('\n')[0]}`); } finally { await context.close(); }
    }
  }
}

async function pool(tasks, n) {
  let i = 0;
  const run = async () => { while (i < tasks.length) { const task = tasks[i++]; await task(); } };
  await Promise.all(Array.from({ length: n }, run));
}

const t0 = Date.now();
const browser = await launch();
const combos = INDUSTRIES.flatMap((ind) => COUNTRIES.map((c) => [ind, c])).filter(([ind, c]) => !ONLY || ONLY.includes(`${ind.id}:${c.id}`) || ONLY.includes(ind.id));
stats.combos = combos.length;
const tasks = [
  ...combos.map(([ind, c]) => () => repFlow(browser, ind, c)),
  ...combos.map(([ind, c]) => () => personaLinks(browser, ind, c)),
  () => setupAll(browser, combos),
  () => edgeCases(browser),
  () => layoutChecks(browser),
];
let done = 0;
await pool(tasks.map((fn) => async () => { await fn(); done++; if (done % 20 === 0) console.log(`  ${done}/${tasks.length} tasks`); }), WORKERS);
await browser.close();

const secs = ((Date.now() - t0) / 1000).toFixed(0);
const report = { ...stats, failures: failures.length, seconds: Number(secs), industries: INDUSTRIES.length, countries: COUNTRIES.length, personas: 3 };
mkdirSync(path.join(root, 'test-results'), { recursive: true });
writeFileSync(path.join(root, 'test-results', 'e2e-report.json'), JSON.stringify({ ...report, failureList: failures }, null, 2));
if (failures.length) {
  console.error(`\nE2E: ${failures.length} failures (${stats.assertions} assertions, ${secs}s)\n`);
  [...new Set(failures)].slice(0, 60).forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
console.log(`E2E passed: ${stats.combos} industry x country combinations, 3 personas each, ${stats.flows} full rep flows, ${stats.setupStarts} setup starts, ${stats.screens} screens checked, ${stats.assertions} assertions, ${secs}s`);
