// Automated Demo Recording & Browser Playback Runner for AI Assistor
// Usage: node scripts/record-demo-walkthrough.mjs [--headful] [--port 5188]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');

const isHeadful = process.argv.includes('--headful');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : 5188);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml'
};

// 1. Start local embedded HTTP server
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    let p = decodeURIComponent(url.pathname);
    if (p === '/' || p === '') p = '/docs/index.html';
    else if (p === '/pitch.html') p = '/docs/pitch.html';
    else if (p === '/index.html') p = '/docs/index.html';

    let file = path.normalize(path.join(root, p));
    if (!file.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = path.join(file, 'index.html');

    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

await new Promise((resolve) => server.listen(port, resolve));
console.log(`[Demo Server] Listening on http://localhost:${port}`);

const recDir = path.join(root, 'recordings');
if (!existsSync(recDir)) mkdirSync(recDir, { recursive: true });

console.log('[Browser] Launching Chromium...');
const browser = await chromium.launch({
  headless: !isHeadful,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: {
    dir: recDir,
    size: { width: 1920, height: 1080 }
  }
});

const page = await context.newPage();

async function safeClick(selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    await page.click(selector);
  } catch (err) {
    console.warn(`[Action Warning] Could not click ${selector}: ${err.message}`);
  }
}

async function pause(ms) {
  await page.waitForTimeout(ms);
}

try {
  console.log('=== STARTING DEMO RECORDING RUNNER ===\n');

  // SCENE 1: Executive Hook (pitch.html)
  console.log('[Scene 1: 0:00 - 0:45] Executive Pitch & Problem Hook');
  await page.goto(`http://localhost:${port}/pitch.html`, { waitUntil: 'networkidle' });
  await pause(3500);
  await safeClick('#btn-next'); // Slide 2
  await pause(4000);

  // SCENE 2: Dynamic Multi-Domain Engine
  console.log('[Scene 2: 0:45 - 1:20] Setup Screen & 20 Industries x 11 Countries');
  await page.goto(`http://localhost:${port}/index.html#/setup`, { waitUntil: 'networkidle' });
  await pause(2500);
  // Click Consumer Goods preset
  await safeClick('button[data-act="preset-demo"][data-ind="cpg"]');
  await pause(1500);
  await safeClick('button[data-act="setup-start"]');
  await pause(3000);

  // SCENE 3: Frontline Rep Experience (Today -> Brief)
  console.log('[Scene 3: 1:20 - 2:30] Frontline Rep: Today & Visit Brief (7 Outcomes & Governance)');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=rep#/today`, { waitUntil: 'networkidle' });
  await pause(3000);
  // Navigate to Brief A01
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=rep#/brief/A01`, { waitUntil: 'networkidle' });
  await pause(3000);
  // Refresh stale card if present
  await safeClick('button[data-act="refresh-stale"]');
  await pause(1500);
  // Open Rule Drawer
  await safeClick('[data-act="open-rule-drawer"]');
  await pause(2500);
  await safeClick('[data-act="close-rule-drawer"], button:has-text("Close")');
  await pause(1500);

  // SCENE 4: In-Visit Execution (Account 360 & Order Builder)
  console.log('[Scene 4: 2:30 - 3:25] Account 360 & Order Suggestion Builder');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=rep#/account/A01`, { waitUntil: 'networkidle' });
  await pause(3000);
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=rep#/order/A01`, { waitUntil: 'networkidle' });
  await pause(3000);

  // SCENE 5: Sales Companion
  console.log('[Scene 5: 3:25 - 4:10] Sales Companion (Growth, Productivity, Learning)');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=rep#/companion`, { waitUntil: 'networkidle' });
  await pause(2500);
  await safeClick('button[data-act="companion-tab"][data-tab="productivity"]');
  await pause(2000);
  await safeClick('button[data-act="companion-tab"][data-tab="learning"]');
  await pause(2000);

  // SCENE 6: District Field Manager
  console.log('[Scene 6: 4:10 - 5:05] District Manager Home & Exception Queue');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=manager#/manager`, { waitUntil: 'networkidle' });
  await pause(3500);

  // SCENE 7: Autonomous Agent Fleet Architecture
  console.log('[Scene 7: 5:05 - 6:05] Agent Fleet (5 Layers, Knapsack Solver Slider, Tools & Memory)');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=admin#/agents`, { waitUntil: 'networkidle' });
  await pause(3000);
  await safeClick('button[data-act="set-agents-view"][data-view="trace"]');
  await pause(2500);
  await safeClick('button[data-act="set-agents-view"][data-view="gap"]');
  await pause(2500);
  await safeClick('button[data-act="set-agents-view"][data-view="tools"]');
  await pause(2500);

  // SCENE 8: Quality & Release Gate System
  console.log('[Scene 8: 6:05 - 7:00] Enterprise Quality Hierarchy & Composite Release Gate');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=admin#/quality`, { waitUntil: 'networkidle' });
  await pause(3500);

  // SCENE 9: Portfolio Lab Overlay
  console.log('[Scene 9: 7:00 - 8:00] Portfolio Lab: A/B Rollout, ROI & Model Gateway');
  await safeClick('button[data-act="open-lab"]');
  await pause(3000);
  await safeClick('button[data-act="set-lab-tab"][data-tab="roi"]');
  await pause(2500);
  await safeClick('button[data-act="set-lab-tab"][data-tab="outcomes"]');
  await pause(2500);
  await safeClick('button[data-act="set-lab-tab"][data-tab="decisions"]');
  await pause(2500);
  await safeClick('button[data-act="close-lab-modal"]');
  await pause(1000);

  // SCENE 10: Product Manager Operations
  console.log('[Scene 10: 8:00 - 8:55] Product Manager: Metric Tree, Parity & Inference Economics');
  await page.goto(`http://localhost:${port}/index.html?industry=cpg&country=US&persona=admin#/pm`, { waitUntil: 'networkidle' });
  await pause(3500);

  // SCENE 11: Cross-Domain Agility (Indian Pharma Pivot & Guardrails)
  console.log('[Scene 11: 8:55 - 9:45] Cross-Domain Agility: Indian Pharma & Clinical Guardrail Refusal');
  await page.goto(`http://localhost:${port}/index.html?industry=pharma&country=IN&persona=rep#/today`, { waitUntil: 'networkidle' });
  await pause(3000);
  await safeClick('button[data-act="open-assistant"]');
  await pause(2000);
  await safeClick('button[data-act="assistant-chip"]');
  await pause(3000);
  await safeClick('button[data-act="close-assistant"]');
  await pause(1500);

  // SCENE 12: Commercial Blueprint & Close
  console.log('[Scene 12: 9:45 - 10:30] Executive Close (90-Day Bounded Pilot Blueprint)');
  await page.goto(`http://localhost:${port}/pitch.html`, { waitUntil: 'networkidle' });
  for (let s = 1; s < 12; s++) {
    await safeClick('#btn-next');
    await pause(150);
  }
  await pause(5000);

  console.log('\n=== DEMO RECORDING COMPLETED SUCCESSFULLY ===');
} catch (error) {
  console.error('[Error during recording runner]:', error);
} finally {
  const video = page.video();
  await context.close();
  await browser.close();
  server.close();

  if (video) {
    const videoPath = await video.path();
    const targetFile = path.join(recDir, 'ai-assistor-master-demo.webm');
    try {
      renameSync(videoPath, targetFile);
      console.log(`\n[Video Saved] Successfully recorded demo to: ${targetFile}`);
    } catch {
      console.log(`\n[Video Saved] Recorded video path: ${videoPath}`);
    }
  }
  console.log('[Demo Server] Closed cleanly.');
}
