// Bundles the app into ONE self-contained file: docs/index.html.
// No runtime dependencies, no CDN. Works from GitHub Pages and from file://.

import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs', 'index.html');

const result = await build({
  entryPoints: [path.join(root, 'src', 'main.js')],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
  write: false,
  charset: 'utf8',
  // The live assistant provider is compiled out unless you build with ASSISTANT_LIVE=1.
  define: { __ASSISTANT_LIVE__: process.env.ASSISTANT_LIVE === '1' ? 'true' : 'false' },
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = (await readFile(path.join(root, 'src', 'styles.css'), 'utf8')).replace(/<\/style/gi, '<\\/style');
let html = await readFile(path.join(root, 'index.html'), 'utf8');

const swap = (src, tag, replacement) => {
  const re = new RegExp(`<!--${tag}-->[\\s\\S]*?<!--\\/${tag}-->`);
  if (!re.test(src)) throw new Error(`index.html is missing the <!--${tag}--> markers`);
  return src.replace(re, () => replacement);
};
html = swap(html, 'STYLES', `<style>\n${css}</style>`);
html = swap(html, 'SCRIPT', `<script>\n${js}</script>`);
html = html.replace('<head>', '<head>\n  <!-- Built by scripts/build.mjs. Do not edit; edit src/ and run npm run build. Sample data only. -->');

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, html);
await writeFile(path.join(root, 'docs', '.nojekyll'), '');

const manifest = {
  name: 'AI Assistor Sales Execution',
  short_name: 'AI Assistor',
  description: 'Governed AI Field Sales Execution Platform',
  start_url: './index.html',
  display: 'standalone',
  background_color: '#121514',
  theme_color: '#0F766E',
};

const sw = `// Service worker for offline field PoC execution
const CACHE_NAME = 'ai-assistor-poc-v1';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
`;

await writeFile(path.join(root, 'docs', 'manifest.json'), JSON.stringify(manifest, null, 2));
await writeFile(path.join(root, 'docs', 'sw.js'), sw);
console.log(`Built ${path.relative(root, out)} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
