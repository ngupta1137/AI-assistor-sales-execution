// T7 Floating button collision test at 1280px, 390px, and 360px.
// Asserts that the Lab button, the Try a Case button, the Ask AI button,
// and the bottom navigation bar never overlap each other, never obscure
// the primary action on a card, and remain clickable.

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function boxesOverlap(b1, b2) {
  return !(b1.right <= b2.left || b1.left >= b2.right || b1.bottom <= b2.top || b1.top >= b2.bottom);
}

async function run() {
  console.log('Running T7 Floating Button Collision Tests...');
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { width: 1280, height: 800, name: 'desktop (1280px)' },
    { width: 390, height: 844, name: 'mobile (390px)' },
    { width: 360, height: 740, name: 'compact mobile (360px)' },
  ];

  let passedAssertions = 0;
  const failures = [];
  const htmlPath = join(__dirname, '..', 'docs', 'index.html');
  const baseUrl = pathToFileURL(htmlPath).href;

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(`${baseUrl}?industry=cpg&country=US&persona=rep#/brief/A01`);
    await page.waitForSelector('[data-screen="brief"]');

    const check = await page.evaluate(() => {
      const tryCase = document.getElementById('try-case-btn');
      const lab = document.getElementById('lab-btn');
      const ask = document.getElementById('as-launcher');
      const nav = document.querySelector('.tabs');
      const primaryBtn = document.querySelector('.decide-row .btn.primary, .decide-row .btn');

      if (!tryCase || !lab || !ask || !nav) {
        return {
          error: `Missing required controls: tryCase=${!!tryCase}, lab=${!!lab}, ask=${!!ask}, nav=${!!nav}`,
        };
      }

      const rTry = tryCase.getBoundingClientRect();
      const rLab = lab.getBoundingClientRect();
      const rAsk = ask.getBoundingClientRect();
      const rNav = nav.getBoundingClientRect();
      const rPrim = primaryBtn ? primaryBtn.getBoundingClientRect() : null;

      return {
        rTry: { top: rTry.top, bottom: rTry.bottom, left: rTry.left, right: rTry.right },
        rLab: { top: rLab.top, bottom: rLab.bottom, left: rLab.left, right: rLab.right },
        rAsk: { top: rAsk.top, bottom: rAsk.bottom, left: rAsk.left, right: rAsk.right },
        rNav: { top: rNav.top, bottom: rNav.bottom, left: rNav.left, right: rNav.right },
        rPrim: rPrim ? { top: rPrim.top, bottom: rPrim.bottom, left: rPrim.left, right: rPrim.right } : null,
      };
    });

    if (check.error) {
      failures.push(`${vp.name}: ${check.error}`);
      await page.close();
      continue;
    }

    // 1. Check pairwise no-overlap among floating buttons and nav
    const pairs = [
      ['Try a case', 'Lab', check.rTry, check.rLab],
      ['Try a case', 'Ask AI', check.rTry, check.rAsk],
      ['Try a case', 'Bottom Nav', check.rTry, check.rNav],
      ['Lab', 'Ask AI', check.rLab, check.rAsk],
      ['Lab', 'Bottom Nav', check.rLab, check.rNav],
      ['Ask AI', 'Bottom Nav', check.rAsk, check.rNav],
    ];

    for (const [name1, name2, b1, b2] of pairs) {
      if (boxesOverlap(b1, b2)) {
        failures.push(`${vp.name}: Overlap between ${name1} and ${name2}`);
      } else {
        passedAssertions++;
      }
    }

    // 2. Clickability check
    const tryClickable = await page.evaluate(() => {
      const el = document.getElementById('try-case-btn');
      return el && !el.disabled && el.offsetHeight > 0 && el.offsetWidth > 0;
    });
    if (!tryClickable) failures.push(`${vp.name}: Try a case button not clickable`);
    else passedAssertions++;

    const labClickable = await page.evaluate(() => {
      const el = document.getElementById('lab-btn');
      return el && !el.disabled && el.offsetHeight > 0 && el.offsetWidth > 0;
    });
    if (!labClickable) failures.push(`${vp.name}: Lab button not clickable`);
    else passedAssertions++;

    // 3. Card primary action not obscured by floating buttons
    if (check.rPrim) {
      const obscuredByTry = boxesOverlap(check.rPrim, check.rTry);
      const obscuredByLab = boxesOverlap(check.rPrim, check.rLab);
      const obscuredByAsk = boxesOverlap(check.rPrim, check.rAsk);
      if (obscuredByTry || obscuredByLab || obscuredByAsk) {
        failures.push(`${vp.name}: Card primary action button obscured by floating button`);
      } else {
        passedAssertions++;
      }
    }

    await page.close();
  }

  await browser.close();

  if (failures.length) {
    console.error(`T7 Floating Collision: ${failures.length} failures:`);
    for (const f of failures) console.error(`  x ${f}`);
    process.exit(1);
  }

  console.log(`T7 Floating Collision: All ${passedAssertions} assertions passed across 1280px, 390px, and 360px viewports.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
