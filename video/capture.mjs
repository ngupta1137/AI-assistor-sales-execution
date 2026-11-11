// Records one cut of the demo video, paced by the narration audio.
// Usage: node video/capture.mjs <cut> [--dry] [--base http://localhost:5199/index.html]
//   --dry  : no audio needed; durations estimated from word count; saves a screenshot per cue.
// Output: video/out/<cut>/frames/*.jpg, frames.json, timeline.json
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CUTS } from './cuts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cutName = args[0];
const DRY = args.includes('--dry');
const BASE = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5199/index.html';
const cut = CUTS[cutName];
if (!cut) { console.error('Unknown cut. Use one of: ' + Object.keys(CUTS).join(', ')); process.exit(2); }

const OUT = path.join(HERE, 'out', cutName);
const FR = path.join(OUT, 'frames');
fs.rmSync(FR, { recursive: true, force: true });
fs.mkdirSync(FR, { recursive: true });
const SHOTS = path.join(OUT, 'dry');
if (DRY) { fs.rmSync(SHOTS, { recursive: true, force: true }); fs.mkdirSync(SHOTS, { recursive: true }); }

// Narration durations from the TTS manifest (seconds). Dry runs estimate 2.55 words per second.
const manifestPath = path.join(HERE, 'out', 'audio', 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const durOf = (cue) => {
  if (!DRY) {
    const m = manifest[cue.id];
    if (!m) { console.error(`No audio for cue ${cue.id}. Run video/tts.py first.`); process.exit(3); }
    return m.dur;
  }
  return (manifest[cue.id]?.dur) ?? cue.text.split(/\s+/).length / 2.55;
};

// Health check: fail fast if the app is not served.
try { const r = await fetch(BASE); if (!r.ok) throw new Error('HTTP ' + r.status); }
catch (e) { console.error(`App not reachable at ${BASE}: ${e.message}`); process.exit(4); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, timezoneId: 'America/Chicago', locale: 'en-US', acceptDownloads: false });
await ctx.addInitScript({ path: path.join(HERE, 'overlay.js') });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date('2026-11-10T08:10:00-06:00'));
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('dialog', (d) => d.dismiss());

// Screencast capture: every painted frame with its timestamp. Holds produce no frames; durations fill them.
const cdp = await ctx.newCDPSession(page);
const frames = [];
let fi = 0;
cdp.on('Page.screencastFrame', async (f) => {
  const name = String(fi++).padStart(6, '0') + '.jpg';
  fs.writeFileSync(path.join(FR, name), Buffer.from(f.data, 'base64'));
  frames.push({ f: name, ts: f.metadata.timestamp, rx: Date.now() / 1000 });
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
});

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
let chapterState = ['', '', ''];
let captionState = '';
let compactState = false;
const demo = (fn, ...a) => page.evaluate(([fn, a]) => window.__demo && window.__demo[fn](...a), [fn, a]);

// Helper object passed to every cue action.
const h = {
  page, sleep, BASE,
  t0: 0, dur: 0,
  loc(sel) { return typeof sel === 'string' ? page.locator(sel).first() : sel; },
  text(t, within) { return (within ? this.loc(within) : page).getByText(t, { exact: false }).first(); },
  // The nearest boxed ancestor (card, panel, sheet) of a locator, for a readable focus ring.
  async box(sel) {
    const l = this.loc(sel);
    await l.waitFor({ state: 'visible', timeout: 8000 });
    const id = 'b' + Math.random().toString(36).slice(2, 8);
    await l.evaluate((el, id) => {
      let n = el;
      for (let i = 0; i < 8 && n && n.parentElement; i++) {
        const s = getComputedStyle(n), r = n.getBoundingClientRect();
        const boxed = parseFloat(s.borderTopWidth) > 0 || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || s.boxShadow !== 'none';
        if (boxed && r.height > 44 && n.tagName !== 'BUTTON' && !n.classList.contains('phone-inner')) break;
        const up = n.parentElement.getBoundingClientRect();
        if (up.height > 560 || n.parentElement.matches('main, .screen, .app, .phone-inner')) break;
        n = n.parentElement;
      }
      n.setAttribute('data-demo-box', id);
    }, id);
    return page.locator(`[data-demo-box="${id}"]`).first();
  },
  card(id) { return page.locator(`[data-act="open-flag-sheet"][data-id="${id}"]`).locator('xpath=ancestor::article[1]'); },
  async until(sec) { const w = this.t0 + sec - Date.now() / 1000; if (w > 0) await sleep(w); },
  async at(frac) { await this.until(this.dur * frac); },
  async point(sel, { align = 0.32, pad = 6, scroll = true, ring = true } = {}) {
    const l = this.loc(sel);
    await l.waitFor({ state: 'visible', timeout: 8000 });
    if (scroll) {
      const ms = await l.evaluate((el, a) => window.__demo.scrollTo(el, a), align);
      if (ms) await sleep(ms / 1000 + 0.08);
    }
    const b = await l.boundingBox();
    if (!b) throw new Error('No bounding box for ' + sel);
    const x = b.x + Math.min(b.width / 2, 140), y = b.y + Math.min(b.height / 2, 60);
    await demo('cursor', x, y);
    if (ring) await l.evaluate((el, p) => window.__demo.focus(el, p), pad); else await demo('focus', null);
    await sleep(0.66);
    return { x, y, l };
  },
  async tap(sel, opts = {}) {
    const { x, y, l } = await this.point(sel, opts);
    await demo('ripple', x, y);
    await l.click({ timeout: 8000 });
    await sleep(opts.after ?? 0.35);
  },
  async unfocus() { await demo('focus', null); },
  // Drag a range input from its current value to `to`, in visible steps, with the cursor on it.
  async slide(sel, to, { steps = 8, every = 0.09, align = 0.4 } = {}) {
    const l = this.loc(sel);
    await this.point(l, { align, pad: 10 });
    const from = Number(await l.inputValue());
    const step = Number(await l.getAttribute('step')) || 1;
    for (let i = 1; i <= steps; i++) {
      const v = +(Math.round((from + (to - from) * i / steps) / step) * step).toFixed(4);
      await l.fill(String(v));
      const b = await l.boundingBox();
      const min = Number(await l.getAttribute('min')), max = Number(await l.getAttribute('max'));
      if (b) await demo('cursor', b.x + b.width * (v - min) / (max - min), b.y + b.height / 2);
      await sleep(every);
    }
  },
  async type(sel, text) { const l = this.loc(sel); await l.click(); await l.pressSequentially(text, { delay: 24 }); },
  async goto(q) {
    await page.goto(BASE + q);
    await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(1.0);
    await demo('chapter', ...chapterState);
    await demo('caption', captionState);
    await demo('compact', compactState);
  },
  async hash(hsh) { await page.evaluate((x) => { location.hash = x; }, hsh); await sleep(0.9); },
  async persona(p) {
    await page.keyboard.press('Shift+D');
    await page.locator('#p-persona').waitFor({ state: 'visible', timeout: 5000 });
    await page.selectOption('#p-persona', p);
    await sleep(0.9);
    if (await page.locator('section.presenter').isVisible().catch(() => false)) await page.keyboard.press('Shift+D');
    await sleep(0.6);
    if (await page.locator('section.presenter').isVisible().catch(() => false)) await page.keyboard.press('Escape');
    await sleep(0.4);
  },
  async compact(on) { compactState = on; await demo('compact', on); },
  async card_(html) { await demo('card', html); },
  async lab(on) { await demo('showLab', on); },
  async tryBtn(on) { await demo('showTry', on); },
};

const timeline = [];
let ok = true;
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1 });
try {
  if (cut.setup) await cut.setup(h);
  for (const [bi, beat] of cut.beats.entries()) {
    chapterState = [beat.kicker ?? `${bi + 1} of ${cut.beats.length}`, beat.title, beat.persona ?? ''];
    for (const [ci, cue] of beat.cues.entries()) {
      if (cue.pre) await cue.pre(h);
      if (ci === 0) await demo('chapter', ...chapterState);
      const dur = durOf(cue);
      const gap = cue.hold ?? 0.45;
      h.t0 = Date.now() / 1000; h.dur = dur;
      captionState = cue.text;
      await demo('caption', cue.text);
      if (cue.act) await cue.act(h);
      const used = Date.now() / 1000 - h.t0;
      if (used > dur + gap) console.warn(`  overrun ${cue.id}: action ${used.toFixed(2)}s > narration ${dur.toFixed(2)}s + ${gap}s`);
      await sleep(Math.max(0, dur + gap - used));
      const end = Date.now() / 1000;
      timeline.push({ id: cue.id, beat: bi, cut: ci === 0 || !!cue.cut, start: h.t0, dur, gap, end, text: cue.text });
      if (DRY) await page.screenshot({ path: path.join(SHOTS, `${String(timeline.length).padStart(2, '0')}-${cue.id}.png`) });
      console.log(`  ${cue.id.padEnd(5)} ${dur.toFixed(2)}s  ${cue.text.slice(0, 70)}`);
    }
  }
} catch (e) {
  ok = false;
  console.error('CAPTURE FAILED:', e.message);
  await page.screenshot({ path: path.join(OUT, 'failure.png') }).catch(() => {});
}
await sleep(0.5);
await cdp.send('Page.stopScreencast').catch(() => {});
await sleep(0.3);
fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify(frames));
fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ cut: cutName, dry: DRY, timeline }, null, 1));
if (errors.length) console.warn('Page errors:', errors.slice(0, 5));
await browser.close();
console.log(`${ok ? 'Captured' : 'Partial'} ${cutName}: ${timeline.length} cues, ${frames.length} frames`);
process.exit(ok ? 0 : 1);
