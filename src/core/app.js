import { renderLabModal, labActions } from './lab-modal.js';
import { renderGuideModal, renderTryCase, governanceActions, demoToolButtons } from './governance-ui.js';
// App shell: configuration from the URL, hash routing, rendering, event delegation.

import { INDUSTRIES, COUNTRIES, findIndustry, findCountry } from '../packs/index.js';
import { generate } from '../data/generate.js';
import { createText, esc } from './text.js';
import { createFormat } from './format.js';
import { createModel, resetSessions } from './state.js';
import { generateCompanion } from './companion/data.js';
import { createCompanionModel } from './companion/model.js';
import { icon } from './icons.js';
import { initials } from './ui.js';
import { SCREENS, ACTIONS } from './screens/index.js';
import { renderPresenter, renderNotes, presenterActions } from './presenter.js';
import { renderSyncModal, syncActions } from './telemetry.js';
export { rolePanel } from './role-panel.js';
import { renderAssistant, syncContext, afterRender, onKeydown, newAssistantState } from './assistant/ui.js';
import { LIVE_ENABLED } from './assistant/provider.js';
import { PERSONAS, HOME, NAV, roleKey as roleKeyOf, titleFor, personFor, validPersona } from './personas.js';
import { UI_LANGUAGES, getActiveLang, isRtl, tr } from './i18n.js';

export { PERSONAS, HOME };

const app = {
  config: null,        // { industryId, countryId, persona, prepared, color }
  ui: {},              // transient UI state (open panels, setup picks)
  presenterOpen: false,
  assistant: null,         // conversation state, see assistant/ui.js
  assistantEnabled: true,
  vp: 'phone',
  offline: false,
  offlineQueue: [],
  liveEndpoint: '',
  notesOpen: false,
  notice: '',
  cache: new Map(),
};

const HEX = /^#?[0-9a-fA-F]{6}$/;

function readConfig() {
  const q = new URLSearchParams(location.search);
  const ind = findIndustry(q.get('industry'));
  const ctry = findCountry(q.get('country'));
  const persona = ind && validPersona(ind, q.get('persona')) ? q.get('persona') : 'rep';
  const lang = q.get('lang');
  if (lang && UI_LANGUAGES[lang]) {
    (app.ui ||= {}).lang = lang;
  }
  const vp = q.get('vp');
  if (['phone', 'tablet', 'desktop'].includes(vp)) app.vp = vp;
  if ((q.get('industry') || q.get('country')) && (!ind || !ctry)) {
    app.notice = 'That link has an unknown industry or country. Pick one below.';
  }
  if (!ind || !ctry) return null;
  const prepared = (q.get('prepared') || '').slice(0, 40);
  const color = HEX.test(q.get('color') || '') ? `#${q.get('color').replace('#', '')}` : '';
  return { industryId: ind.id, countryId: ctry.id, persona, prepared, color };
}

function writeUrl(hash) {
  const c = app.config;
  const q = new URLSearchParams();
  if (c) {
    q.set('industry', c.industryId);
    q.set('country', c.countryId);
    q.set('persona', c.persona);
    if (c.prepared) q.set('prepared', c.prepared);
    if (c.color) q.set('color', c.color.replace('#', ''));
  }
  if (app.ui?.lang && app.ui.lang !== 'en') q.set('lang', app.ui.lang);
  if (app.assistantEnabled === false) q.set('assistant', 'off');
  if (app.vp && app.vp !== 'phone') q.set('vp', app.vp);
  const qs = q.toString();
  const url = `${location.pathname}${qs ? `?${qs}` : ''}${hash ?? location.hash}`;
  history.replaceState(null, '', url);
}

export function shareLink() {
  const c = app.config;
  if (!c) return location.href.split('#')[0];
  const q = new URLSearchParams({ industry: c.industryId, country: c.countryId, persona: c.persona });
  if (c.prepared) q.set('prepared', c.prepared);
  if (c.color) q.set('color', c.color.replace('#', ''));
  if (app.ui?.lang && app.ui.lang !== 'en') q.set('lang', app.ui.lang);
  if (app.assistantEnabled === false) q.set('assistant', 'off');
  if (app.vp && app.vp !== 'phone') q.set('vp', app.vp);
  return `${location.origin === 'null' ? 'file://' : location.origin}${location.pathname}?${q}`;
}

/** Context for one industry + country. Cached so switching back is instant. */
export function buildContext(industryId, countryId, explicitLang) {
  const lang = explicitLang || app.ui?.lang || getActiveLang(app, countryId);
  const key = `${industryId}|${countryId}|${lang || 'en'}`;
  if (app.cache.has(key)) return app.cache.get(key);
  const industry = findIndustry(industryId);
  const country = findCountry(countryId);
  const t = createText(industry.vocab, country.spelling, lang);
  const fmt = createFormat(country);
  const data = generate(industry, country, { fmt });
  const ctx = { industry, country, t, fmt, data, lang };
  ctx.m = createModel(ctx);
  // Companion data exists only for packs (and countries) that define Companion content.
  ctx.comp = industry.companion && country.publicHolidays ? generateCompanion(ctx) : null;
  ctx.cm = ctx.comp ? createCompanionModel(ctx) : null;
  app.cache.set(key, ctx);
  return ctx;
}

function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  return { name: parts[0] || '', args: parts.slice(1) };
}

export function navigate(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

export function configure(next, { home = false } = {}) {
  app.config = { ...(app.config || {}), ...next };
  app.ui = {};
  app.assistant = newAssistantState();
  writeUrl(home ? `#/${HOME[app.config.persona]}` : undefined);
  if (home) navigate(`#/${HOME[app.config.persona]}`); else render();
}

export function resetDemo() {
  resetSessions();
  app.cache.clear();
  app.ui = {};
  app.assistant = newAssistantState();
}

export function getApp() { return app; }

/** Darkens a colour until white text on it reaches 4.5:1 (WCAG AA), so any prospect colour stays readable. */
export function readableAccent(hex) {
  let rgb = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
  const lum = (c) => {
    const [r, g, b] = c.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  for (let i = 0; i < 40 && 1.05 / (lum(rgb) + 0.05) < 4.5; i++) rgb = rgb.map((v) => Math.floor(v * 0.92));
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Mixes a hex colour with another (0..1 of the other). Literal hex, so nothing depends on color-mix(). */
function mix(hex, other, amount) {
  const a = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
  const b = other.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
  return `#${a.map((v, i) => Math.round(v * (1 - amount) + b[i] * amount).toString(16).padStart(2, '0')).join('')}`;
}

/** Light, dark or follow the system. Remembered per browser; the page works without storage. */
const THEMES = ['light', 'dark', 'system'];
function loadTheme() {
  try { const v = localStorage.getItem('aia-theme'); return THEMES.includes(v) ? v : 'system'; } catch { return 'system'; }
}
function saveTheme(v) { try { localStorage.setItem('aia-theme', v); } catch { /* storage blocked: keep it for this session */ } }
export function isDarkTheme() {
  const t = app.theme || 'system';
  if (t !== 'system') return t === 'dark';
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function contrastOn(hex, bg) {
  const lum = (h) => { const [r, g, b] = h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const a = lum(hex), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
/** Lightest step of the accent toward white that still meets the contrast target on the given background. */
function towardWhite(hex, bg, target, maxStep) {
  // Light background: the color already passes, keep it. Dark background: the smallest lift that passes keeps the most color.
  if (contrastOn(hex, bg) >= target) return hex;
  for (let i = 1; i <= maxStep; i++) { const c = mix(hex, '#ffffff', i / 20); if (contrastOn(c, bg) >= target) return c; }
  return mix(hex, '#ffffff', maxStep / 20);
}

function applyTheme(ctx) {
  const pick = app.ui.setup?.industry && !ctx ? findIndustry(app.ui.setup.industry)?.accent : null;
  const raw = (app.config?.color && ctx ? app.config.color : ctx?.industry.accent || pick) || '#334155';
  const accent = readableAccent(raw);
  const rgb = accent.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
  const root = document.documentElement.style;
  const t = app.theme || 'system';
  if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
  const isDark = isDarkTheme();
  root.setProperty('--accent-raw', raw);
  root.setProperty('--accent', accent);
  root.setProperty('--accent-hover', mix(accent, isDark ? '#ffffff' : '#000000', 0.12));
  root.setProperty('--accent-pressed', mix(accent, isDark ? '#ffffff' : '#000000', 0.22));
  if (isDark) {
    root.setProperty('--accent-soft', `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.22)`);
    root.setProperty('--accent-line', `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45)`);
  } else {
    root.setProperty('--accent-soft', mix(accent, '#ffffff', 0.91));
    root.setProperty('--accent-line', mix(accent, '#ffffff', 0.7));
  }
  // Accent as text or icon: same as the fill in light mode; lifted until it reads on the dark surface.
  root.setProperty('--accent-ink', isDark ? towardWhite(accent, '#1A1E1C', 4.5, 16) : accent);
  // Brighter tint for small highlights (stripes, icons): 3:1 against the surface.
  root.setProperty('--accent-tint', isDark ? towardWhite(accent, '#1A1E1C', 3, 12) : (() => { let c = accent; for (let i = 1; i <= 8; i++) { const n = mix(accent, '#ffffff', i / 20); if (contrastOn(n, '#ffffff') >= 3) c = n; else break; } return c; })());
  // Surfaces stay neutral; the industry color is for actions, selection and status only.
  root.removeProperty('--surface-subtle');
  root.removeProperty('--surface-inset');
}

/** Remembers the focused control so a re-render does not drop keyboard focus. */
function focusKey() {
  const f = document.activeElement;
  if (!f || f === document.body) return null;
  if (f.id) return `#${CSS.escape(f.id)}`;
  if (f.name && f.type === 'radio') return `input[name="${CSS.escape(f.name)}"][value="${CSS.escape(f.value)}"]`;
  if (f.dataset?.act) return `[data-act="${f.dataset.act}"]${f.dataset.id ? `[data-id="${CSS.escape(f.dataset.id)}"]` : ''}${f.dataset.o ? `[data-o="${CSS.escape(f.dataset.o)}"]` : ''}${f.dataset.d ? `[data-d="${f.dataset.d}"]` : ''}`;
  return null;
}

export function render() {
  const root = document.getElementById('root');
  const route = parseRoute();
  const keep = focusKey();
  const fresh = app.lastRoute !== location.hash;
  app.lastRoute = location.hash;
  let html;
  let ctx = null;
  if (!app.config || route.name === 'setup') {
    applyTheme(null);
    syncContext(app, null, { name: 'setup', args: [] }, app.config?.persona || 'rep');
    html = SCREENS.setup.render({ app, INDUSTRIES, COUNTRIES, buildContext });
  } else {
    ctx = buildContext(app.config.industryId, app.config.countryId);
    if (!validPersona(ctx.industry, app.config.persona)) app.config.persona = 'rep';
    ctx.persona = app.config.persona;
    ctx.ui = app.ui;
    ctx.app = app;
    applyTheme(ctx);
    const name = SCREENS[route.name] && route.name !== 'setup' ? route.name : HOME[ctx.persona];
    syncContext(app, ctx, { name, args: route.args }, ctx.persona);
    const out = SCREENS[name].render(ctx, route.args);
    html = shell(ctx, name, out);
  }
  const lang = app.ui?.lang || getActiveLang(app, app.config?.countryId);
  document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  document.documentElement.lang = lang || 'en';
  document.body.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
  document.body.classList.add(`text-size-${app.textSize || 'sm'}`);
  document.body.classList.toggle('simple-view', !!app.simpleView);
  root.innerHTML = html + renderAssistant(app, ctx, { name: ctx ? (SCREENS[route.name] && route.name !== 'setup' ? route.name : HOME[ctx.persona]) : 'setup' }) + renderPresenter(app, ctx, { INDUSTRIES, COUNTRIES, PERSONAS, shareLink: shareLink() }) + renderSyncModal(app, ctx) + renderRightsModal(app, ctx) + renderGuideModal(app, ctx) + renderTryCase(app, ctx) + renderLabModal(app, ctx);
  const side = document.getElementById('side');
  if (side) side.innerHTML = renderNotes(app, ctx);
  document.body.classList.toggle('notes-open', app.notesOpen && !!ctx);
  const stage = document.querySelector('.stage');
  if (stage) {
    stage.setAttribute('data-viewport', app.vp || 'phone');
    updateStageToolbar(app, stage);
  }
  const scroller = document.getElementById('screen');
  if (scroller && app.scrollTop != null) { scroller.scrollTop = app.scrollTop; app.scrollTop = null; }
  if (scroller && fresh) scroller.classList.add('enter');
  if (keep && !fresh) document.querySelector(keep)?.focus({ preventScroll: true });
  SCREENS[route.name]?.mounted?.(ctx, route.args);
  afterRender(app);
}

function screenTitleFor(ctx, name) {
  const titles = {
    today: ctx.t("Today's Schedule"),
    brief: ctx.t('Visit Brief'),
    action: ctx.t('Action Execution'),
    order: ctx.t('{Order} Draft Builder'),
    account: ctx.t('{Account} 360'),
    route: ctx.t('Route Plan'),
    ask: ctx.t('Ask AI Assistant'),
    complete: ctx.t('Visit Sign-off'),
    sales: ctx.t('Sales Pipeline'),
    config: ctx.t('Governance Rules'),
    system: ctx.t('System Telemetry'),
  };
  return titles[name] || ctx.t('Workspace');
}

function updateStageToolbar(app, stage) {
  let bar = document.getElementById('stage-vp-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'stage-vp-bar';
    bar.className = 'stage-vp-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Device viewport mode');
    stage.prepend(bar);
  }
  const vp = app.vp || 'phone';
  const vpSlot = document.getElementById('appbar-vp-slot');
  if (vp === 'desktop' && vpSlot) {
    if (bar.parentElement !== vpSlot) vpSlot.appendChild(bar);
  } else {
    if (bar.parentElement !== stage) stage.prepend(bar);
  }
  bar.innerHTML = `
    <button class="stage-vp-btn ${vp === 'phone' ? 'active' : ''}" data-act="set-vp" data-vp="phone" aria-pressed="${vp === 'phone'}" title="Mobile View (390px field phone frame)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      <span>Mobile</span>
    </button>
    <button class="stage-vp-btn ${vp === 'tablet' ? 'active' : ''}" data-act="set-vp" data-vp="tablet" aria-pressed="${vp === 'tablet'}" title="Tablet View (768px iPad frame)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      <span>Tablet</span>
    </button>
    <button class="stage-vp-btn ${vp === 'desktop' ? 'active' : ''}" data-act="set-vp" data-vp="desktop" aria-pressed="${vp === 'desktop'}" title="Web View (Enterprise portal)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12.01" y2="21"/></svg>
      <span>Web</span>
    </button>
    <span class="stage-sep" aria-hidden="true"></span>
    ${[['light', 'sun', 'Light'], ['dark', 'moon', 'Dark'], ['system', 'screen', 'System']].map(([k, ic, l]) => `<button class="stage-vp-btn ${(app.theme || 'system') === k ? 'active' : ''}" data-act="set-theme" data-theme="${k}" aria-pressed="${(app.theme || 'system') === k}" title="${l} theme">${icon(ic, 14)}<span>${l}</span></button>`).join('')}
  `;
}


function renderRightsModal(app, ctx) {
  if (!app?.ui?.rightsOpen || !ctx) return "";
  const g = ctx.industry.governance;
  const roles = (g?.rights?.roles || ["rep", "manager", "kam", "ops", "exec"]).filter((r) => r !== 'partner' || !!ctx.industry.execution?.partner);
  const roleNames = {
    rep: ctx.industry.personas?.rep || "Sales Rep",
    manager: ctx.industry.personas?.manager || "Sales Manager",
    kam: ctx.industry.vocab?.kam ? ctx.t('{Kam}') : "Key Account Lead",
    ops: ctx.industry.personas?.admin || "Market Operations",
    partner: titleFor(ctx.industry, 'partner'),
    exec: titleFor(ctx.industry, "exec"),
  };
  const legalApprover = g?.rights?.legalApprover || "Legal Counsel";
  const roleHeaders = roles.map((r) => `<th style="padding:8px 6px;text-align:left;font-size:11px">${esc(roleNames[r] || r)}</th>`).join("");
  const rows = [
    { label: "View overnight visit brief", check: (r) => ["rep"].includes(r) },
    { label: "Execute in-visit actions & log evidence", check: (r) => ["rep"].includes(r) },
    { label: "Flag recommendations & open gap tickets", check: (r) => ["rep", "manager", "ops"].includes(r) },
    { label: "Approve rep exceptions & rebalance routes", check: (r) => ["manager"].includes(r) },
    { label: "Access Rule Health & retire rules", check: (r) => ["ops", "manager"].includes(r) },
    { label: "Access immutable audit trail & replay", check: (r) => ["ops", "exec", "manager"].includes(r) },
    { label: "Inspect quality evals & test suites", check: (r) => ["ops", "exec"].includes(r) },
    { label: "Adjust commercial terms & JBP targets", check: (r) => ["kam"].includes(r) },
    { label: "Release offer targets to the field", check: (r) => ["kam"].includes(r) },
    { label: "Assign retention visits & approve tier changes", check: (r) => ["manager"].includes(r) },
    { label: "Switch capabilities & seasonal events", check: (r) => ["ops"].includes(r) },
    { label: "Receive orders & share invoice data", check: (r) => ["partner"].includes(r) },
    { label: "Direct raw database write without policy check", check: () => false },
  ];
  const bodyRows = rows.map((row) => `
    <tr style="border-bottom:1px solid var(--line-soft)">
      <td style="padding:8px 6px;font-size:11px;font-weight:500">${esc(row.label)}</td>
      ${roles.map((r) => {
        const ok = row.check(r);
        return `<td style="padding:8px 6px;text-align:center;font-size:12px">${ok ? `<span class="good-text">✓</span>` : `<span class="muted">-</span>`}</td>`;
      }).join("")}
    </tr>
  `).join("");
  return `
  <div class="presenter-backdrop" data-act="close-rights-matrix" aria-hidden="true"></div>
  <section class="as-sheet enterprise-modal" role="dialog" aria-modal="true" aria-labelledby="rights-modal-title" style="height:auto;max-height:85%;overflow-y:auto;z-index:90">
    <header class="as-head">
      <div>
        <h2 id="rights-modal-title" style="display:flex;align-items:center;gap:6px">
          ${icon("shield", 20)} Role-Based Access Control (RBAC) Matrix
        </h2>
        <small>${esc(ctx.industry.name)} · Legal & Regulatory Approver: <b>${esc(legalApprover)}</b></small>
      </div>
      <button class="icon-btn" data-act="close-rights-matrix" aria-label="Close rights matrix">${icon("x", 20)}</button>
    </header>
    <div style="padding:var(--s4);overflow-x:auto">
      <p class="small muted" style="margin-bottom:12px">Rights are strictly enforced across screens, action buttons, and automated decision routes. Zero direct database writes are permitted for any role.</p>
      <table style="width:100%;border-collapse:collapse;min-width:480px">
        <thead>
          <tr style="border-bottom:2px solid var(--line)">
            <th style="padding:8px 6px;text-align:left;font-size:11px">Capability / Permission</th>
            ${roleHeaders}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
      <div style="margin-top:16px;display:flex;justify-content:flex-end">
        <button class="btn primary sm" data-act="close-rights-matrix" style="min-height:var(--tap);min-width:100px">Done</button>
      </div>
    </div>
  </section>`;
}
function shell(ctx, name, result) {
  const { t, data } = ctx;
  let out = typeof result === 'string' ? result : result.html;
  if (app.screenState === 'loading') {
    out = `
    <div class="screen-state-banner warn" style="margin:8px 16px;padding:6px 12px;display:flex;align-items:center;justify-content:space-between;background:var(--surface-subtle);border-radius:4px;font-size:11px">
      <span><b>Screen State Simulation:</b> Loading skeleton</span>
      <button class="btn text sm" data-act="reset-screen-state" style="min-height:var(--tap);text-decoration:underline">Return to interactive</button>
    </div>
    <div class="skeleton-view" style="padding:16px;display:flex;flex-direction:column;gap:16px">
      <div class="skeleton-shimmer" style="height:28px;width:60%"></div>
      <div class="skeleton-shimmer" style="height:14px;width:40%"></div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <div class="skeleton-shimmer" style="height:20px;width:80%"></div>
        <div class="skeleton-shimmer" style="height:14px;width:100%"></div>
        <div class="skeleton-shimmer" style="height:14px;width:90%"></div>
        <div class="skeleton-shimmer" style="height:36px;width:120px;margin-top:8px"></div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <div class="skeleton-shimmer" style="height:20px;width:75%"></div>
        <div class="skeleton-shimmer" style="height:14px;width:100%"></div>
        <div class="skeleton-shimmer" style="height:36px;width:120px;margin-top:8px"></div>
      </div>
    </div>`;
  } else if (app.screenState === 'empty') {
    out = `
    <div class="screen-state-banner warn" style="margin:8px 16px;padding:6px 12px;display:flex;align-items:center;justify-content:space-between;background:var(--surface-subtle);border-radius:4px;font-size:11px">
      <span><b>Screen State Simulation:</b> Empty state</span>
      <button class="btn text sm" data-act="reset-screen-state" style="min-height:var(--tap);text-decoration:underline">Return to interactive</button>
    </div>
    <section class="card empty-state" style="margin:24px 16px;padding:32px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px">
      <div style="color:var(--muted)">${icon('route', 40)}</div>
      <h3>No items scheduled for this cycle</h3>
      <p class="small muted" style="max-width:320px">All scheduled visits, proposals, and exception audits for this territory are completed or deferred.</p>
      <button class="btn primary" data-act="reset-screen-state" style="min-height:var(--tap);margin-top:8px">Schedule new visit</button>
    </section>`;
  } else if (app.screenState === 'error') {
    out = `
    <div class="screen-state-banner warn" style="margin:8px 16px;padding:6px 12px;display:flex;align-items:center;justify-content:space-between;background:var(--surface-subtle);border-radius:4px;font-size:11px">
      <span><b>Screen State Simulation:</b> Error state</span>
      <button class="btn text sm" data-act="reset-screen-state" style="min-height:var(--tap);text-decoration:underline">Return to interactive</button>
    </div>
    <section class="card error-state" style="margin:24px 16px;padding:24px 16px;border-left:4px solid var(--bad);display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;gap:8px;color:var(--bad)">
        ${icon('shield', 24)}
        <h3 style="margin:0;color:var(--ink)">Downstream Service Connection Failure</h3>
      </div>
      <p class="small" style="margin:0"><b>What happened:</b> The policy evaluation service timed out while synchronizing territory recommendations.</p>
      <p class="small muted" style="margin:0"><b>Who to contact:</b> Market Operations Support Desk at ops-support@enterprise.sample</p>
      <div style="padding:6px 8px;background:var(--surface-subtle);border-radius:4px;font-family:monospace;font-size:11px">
        Support reference code: ERR-GOV-7042
      </div>
      <div style="margin-top:6px">
        <button class="btn primary" data-act="reset-screen-state" style="min-height:var(--tap)">Try again</button>
      </div>
    </section>`;
  }
  const dock = typeof result === 'string' ? '' : result.dock || '';
  const user = personFor(ctx, ctx.persona);
  const actingAsBar = '';
  const deniedHtml = app.deniedNotice ? `
    <div class="notice warn" role="alert" style="margin:var(--s2) var(--s4) var(--s3);display:flex;align-items:center;gap:8px">
      ${icon('shield', 18)}
      <div style="flex:1">
        <b>Access Denied:</b> The "${esc(app.deniedNotice.screen)}" screen is not accessible for ${esc(app.deniedNotice.role)}. Owned by ${esc(app.deniedNotice.team)}.
      </div>
      <button class="icon-btn sm" data-act="dismiss-denial" aria-label="Dismiss">${icon('x', 16)}</button>
    </div>` : '';
  const nav = NAV[ctx.persona].map(([id, label, ic]) => {
    const firstBrief = ctx.m.nextAccount(null)?.accountId || data.planned[0].accountId;
    const href = id === 'brief' ? `#/brief/${firstBrief}` : `#/${id}`;
    const active = name === id || (id === 'brief' && ['brief', 'action', 'order', 'complete'].includes(name)) || (id === 'today' && ['account', 'route', 'ask'].includes(name)) || (id === 'config' && (name === 'problems' || name === 'domains' || (name === 'system' && !NAV[ctx.persona].some(([n]) => n === 'system')))) || (id === 'sales' && name === 'sales');
    const displayLabel = tr(label, ctx.lang || 'en');
    return `<a class="tab${active ? ' on' : ''}" href="${href}" data-nav="${id}"${active ? ' aria-current="page"' : ''}><span class="tab-ic">${icon(ic, 22)}</span><span>${esc(displayLabel)}</span></a>`;
  }).join('');
  const prepared = app.config.prepared ? `<div class="prepared-band" id="prepared">Prepared for ${esc(app.config.prepared)}</div>` : '';
  const offlineText = tr('Offline mode active. Local AES-256 encrypted storage.', ctx.lang || 'en');
  const goOnlineText = tr('Go online', ctx.lang || 'en');
  return `
  <div class="app" data-region="app" data-screen="${name}">
    <header class="appbar">
      <div class="appbar-left">
        <button class="logo" id="logo" aria-label="AI Assistor home">
          <span class="mark">${icon(ctx.industry.icon, 18)}</span><span class="brand">AI Assistor</span>
        </button>
        <span class="crumb-sep" aria-hidden="true">/</span>
        <span class="crumb-screen">${esc(screenTitleFor(ctx, name))}</span>
      </div>
      <div class="appbar-vp-slot" id="appbar-vp-slot"></div>
      <span class="bar-tools">
        <button class="icon-btn bar-tool" id="theme-toggle" data-act="toggle-theme" aria-label="${isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'}" title="${isDarkTheme() ? 'Light mode' : 'Dark mode'}">${icon(isDarkTheme() ? 'sun' : 'moon', 18)}</button>
        ${demoToolButtons(app, ctx)}
      </span>
      <button class="who" data-act="open-sync-modal" aria-haspopup="dialog" aria-label="Enterprise sync telemetry and user profile"><span class="who-text"><b>${esc(user.name)}</b><small><span class="sync-dot ${app.offline ? 'offline' : ''}" aria-hidden="true"></span> ${app.offline ? 'Offline' : esc(t(user.title))}</small></span><span class="avatar" aria-hidden="true">${esc(initials(user.name))}</span></button>
    </header>${actingAsBar}${deniedHtml}${app.offline ? `<div class="offline-strip" id="offline-strip">${icon('sync', 16)} <span>${esc(offlineText)}</span><button class="pill-btn sm" data-act="toggle-offline" style="margin-left:auto;background:rgba(255,255,255,0.2);color:#fff;min-height:var(--tap);display:inline-flex;align-items:center">${esc(goOnlineText)}</button></div>` : ''}${prepared}
    <main class="screen" id="screen" data-region="screen">${out}</main>
    ${dock ? `<div class="dock" data-region="dock">${dock}</div>` : ''}
    <nav class="tabs" aria-label="Main">
      <div class="sidebar-brand-header">
        <button class="sidebar-brand-btn" data-act="go-home" aria-label="AI Assistor home">
          <span class="mark mark-brand">${icon(ctx.industry.icon, 20)}</span>
          <div class="sidebar-brand-text">
            <span class="sidebar-brand-title">AI Assistor</span>
            <span class="sidebar-brand-sub">GOVERNED SALES EXECUTION</span>
          </div>
        </button>
        <div class="sidebar-industry-pill">${esc(ctx.industry.name)} · ${esc(ctx.country.id)}</div>
      </div>
      <div class="sidebar-section-title">WORKSPACE</div>
      <div class="sidebar-nav-list">${nav}</div>
      <div class="sidebar-footer">
        <button class="sidebar-foot-item" data-act="open-guide" aria-label="Architecture and policy guide">
          ${icon('info', 16)}<span>How this works</span>
        </button>
        <button class="sidebar-foot-item" data-act="open-rights-matrix" aria-label="Governance rights matrix">
          ${icon('shield', 16)}<span>Governance & Rights</span>
        </button>
      </div>
    </nav>
  </div>`;
}

// ---- Events ----------------------------------------------------------------

const rbacActions = {
  "go-home": ({ app, api }) => { api.navigate("#/" + (HOME[app.config?.persona] || "today")); },
  "open-rights-matrix": ({ app }) => { (app.ui ||= {}).rightsOpen = true; },
  "close-rights-matrix": ({ app }) => { if (app.ui) app.ui.rightsOpen = false; },
  "dismiss-denial": ({ app }) => { app.deniedNotice = null; },
  "set-theme": ({ app, data }) => { app.theme = THEMES.includes(data.theme) ? data.theme : 'system'; saveTheme(app.theme); applyTheme(app.config ? buildContext(app.config.industryId, app.config.countryId) : null); },
  "toggle-theme": ({ app }) => { app.theme = isDarkTheme() ? 'light' : 'dark'; saveTheme(app.theme); applyTheme(app.config ? buildContext(app.config.industryId, app.config.countryId) : null); },
  "dismiss-acting-as": ({ app }) => { (app.ui ||= {}).actingAsDismissed = true; },
  "restore-acting-as": ({ app }) => { if (app.ui) app.ui.actingAsDismissed = false; },
};
function handle(e, type) {
  const el = e.target.closest(`[data-${type}]`);
  if (!el) return;
  const name = el.dataset[type];
  const fn = ACTIONS[name] || presenterActions[name] || syncActions[name] || rbacActions[name] || governanceActions[name] || labActions[name] || (name === 'set-vp' ? (({ app, data, api }) => { app.vp = data.vp; api.syncUrl(); api.render(); }) : null);
  if (!fn) return;
  if (type === 'act' && el.tagName === 'A') e.preventDefault();
  const ctx = app.config ? buildContext(app.config.industryId, app.config.countryId) : null;
  if (ctx) { ctx.ui = app.ui; ctx.persona = app.config.persona; ctx.app = app; }
  const keepScroll = document.getElementById('screen')?.scrollTop;
  const result = fn({ ctx, app, el, value: el.value, data: el.dataset, event: e, api: { navigate, configure, resetDemo, render, syncUrl: () => writeUrl() } });
  if (result !== false) {
    if (result !== 'nav') app.scrollTop = keepScroll;
    render();
  }
}

export function start() {
  app.config = readConfig();
  const qs = new URLSearchParams(location.search);
  app.assistantEnabled = qs.get('assistant') !== 'off';
  if (LIVE_ENABLED && /^https:\/\//.test(qs.get('live') || '')) app.liveEndpoint = qs.get('live');
  if (app.config && !location.hash) writeUrl(`#/${HOME[app.config.persona]}`);
  window.addEventListener('hashchange', () => { app.ui = { ...app.ui, panel: null }; render(); document.getElementById('screen')?.scrollTo(0, 0); });
  app.theme = THEMES.includes(qs.get('theme')) ? qs.get('theme') : loadTheme();
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if ((app.theme || 'system') !== 'system') return;
      const c = app.config ? buildContext(app.config.industryId, app.config.countryId) : null;
      applyTheme(c);
      render();
    });
  }
  document.addEventListener('click', (e) => handle(e, 'act'));
  document.addEventListener('change', (e) => handle(e, 'change'));
  // Drafts (notes, questions) are captured on every keystroke without a re-render, so nothing typed is lost.
  document.addEventListener('input', (e) => handle(e, 'input'));

  document.addEventListener('keydown', (e) => {
    if (onKeydown(app, e, { render })) return;
    if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) {
      e.preventDefault();
      app.presenterOpen = !app.presenterOpen;
      render();
    } else if (e.key === 'Escape' && app.presenterOpen) {
      app.presenterOpen = false;
      render();
    } else if (e.key === 'Escape' && app.ui.panel) {
      const id = app.ui.panel.id;
      app.ui.panel = null;
      render();
      document.querySelector(`#item-${CSS.escape(id)} [data-act="panel"]`)?.focus();
    } else if (e.key === 'Enter' && (e.target.id === 'ask-input' || e.target.id === 'as-input')) {
      e.preventDefault();
      document.getElementById(e.target.id === 'as-input' ? 'as-send' : 'ask-send')?.click();
    }
  });

  // Long press on the logo opens the presenter menu; a short tap goes home.
  let timer = null;
  let longFired = false;
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#logo')) return;
    longFired = false;
    timer = setTimeout(() => { longFired = true; app.presenterOpen = true; render(); }, 650);
  });
  const cancel = () => { clearTimeout(timer); timer = null; };
  document.addEventListener('pointerup', cancel);
  document.addEventListener('pointerleave', cancel);
  document.addEventListener('pointercancel', cancel);
  document.addEventListener('contextmenu', (e) => { if (e.target.closest('#logo')) e.preventDefault(); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#logo')) return;
    if (longFired) { longFired = false; return; }
    if (app.config) navigate(`#/${HOME[app.config.persona]}`);
  });

  render();
}
