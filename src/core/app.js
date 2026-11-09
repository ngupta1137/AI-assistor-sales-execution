import { renderGuideModal, renderTryCase, governanceActions } from './governance-ui.js';
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
import { renderAssistant, syncContext, afterRender, onKeydown, newAssistantState } from './assistant/ui.js';
import { LIVE_ENABLED } from './assistant/provider.js';

export const PERSONAS = ['rep', 'manager', 'admin'];
export const HOME = { rep: 'today', manager: 'manager', admin: 'config' };
const NAV = {
  rep: [['today', 'Today', 'home'], ['brief', 'Brief', 'brief'], ['companion', 'Companion', 'companion'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config']],
  manager: [['manager', 'Team', 'team'], ['companion', 'Companion', 'companion'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config']],
  admin: [['config', 'Config', 'config'], ['agents', 'Agents', 'agent'], ['problems', 'Problems', 'bulb'], ['manager', 'Team', 'team']],
};

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
  const persona = PERSONAS.includes(q.get('persona')) ? q.get('persona') : 'rep';
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
  if (app.assistantEnabled === false) q.set('assistant', 'off');
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
  if (app.assistantEnabled === false) q.set('assistant', 'off');
  return `${location.origin === 'null' ? 'file://' : location.origin}${location.pathname}?${q}`;
}

/** Context for one industry + country. Cached so switching back is instant. */
export function buildContext(industryId, countryId) {
  const key = `${industryId}|${countryId}`;
  if (app.cache.has(key)) return app.cache.get(key);
  const industry = findIndustry(industryId);
  const country = findCountry(countryId);
  const t = createText(industry.vocab, country.spelling);
  const fmt = createFormat(country);
  const data = generate(industry, country, { fmt });
  const ctx = { industry, country, t, fmt, data };
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

function applyTheme(ctx) {
  const pick = app.ui.setup?.industry && !ctx ? findIndustry(app.ui.setup.industry)?.accent : null;
  const raw = (app.config?.color && ctx ? app.config.color : ctx?.industry.accent || pick) || '#334155';
  const accent = readableAccent(raw);
  const root = document.documentElement.style;
  root.setProperty('--accent-raw', raw);
  root.setProperty('--accent', accent);
  root.setProperty('--accent-hover', mix(accent, '#000000', 0.1));
  root.setProperty('--accent-pressed', mix(accent, '#000000', 0.2));
  root.setProperty('--accent-soft', mix(accent, '#ffffff', 0.92));
  root.setProperty('--accent-line', mix(accent, '#ffffff', 0.7));
  root.setProperty('--surface-subtle', mix(accent, '#ffffff', 0.97));
  root.setProperty('--surface-inset', mix(accent, '#ffffff', 0.93));
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
    ctx.persona = app.config.persona;
    ctx.ui = app.ui;
    ctx.app = app;
    applyTheme(ctx);
    const name = SCREENS[route.name] && route.name !== 'setup' ? route.name : HOME[ctx.persona];
    syncContext(app, ctx, { name, args: route.args }, ctx.persona);
    const out = SCREENS[name].render(ctx, route.args);
    html = shell(ctx, name, out);
  }
  document.body.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
  document.body.classList.add(`text-size-${app.textSize || 'sm'}`);
  document.body.classList.toggle('simple-view', !!app.simpleView);
  root.innerHTML = html + renderAssistant(app, ctx, { name: ctx ? (SCREENS[route.name] && route.name !== 'setup' ? route.name : HOME[ctx.persona]) : 'setup' }) + renderPresenter(app, ctx, { INDUSTRIES, COUNTRIES, PERSONAS, shareLink: shareLink() }) + renderSyncModal(app, ctx) + renderRightsModal(app, ctx) + renderGuideModal(app, ctx) + renderTryCase(app, ctx);
  const side = document.getElementById('side');
  if (side) side.innerHTML = renderNotes(app, ctx);
  document.body.classList.toggle('notes-open', app.notesOpen && !!ctx);
  const scroller = document.getElementById('screen');
  if (scroller && app.scrollTop != null) { scroller.scrollTop = app.scrollTop; app.scrollTop = null; }
  if (scroller && fresh) scroller.classList.add('enter');
  if (keep && !fresh) document.querySelector(keep)?.focus({ preventScroll: true });
  SCREENS[route.name]?.mounted?.(ctx, route.args);
  afterRender(app);
}

function renderActingAsBar(ctx) {
  const roleKey = ctx.persona === "admin" ? "ops" : ctx.persona;
  const roleTitle = ctx.industry.personas?.[ctx.persona] || (ctx.persona === "admin" ? "Market Operations" : ctx.persona === "manager" ? "Sales Manager" : "Sales Representative");
  const allowed = ctx.industry.governance?.rights?.actions?.[roleKey] || [];
  const allActions = [...new Set(Object.values(ctx.industry.governance?.rights?.actions || {}).flat())];
  const forbidden = allActions.filter((a) => !allowed.includes(a));
  const actionLabels = {
    approve_brief: "approve visit briefs",
    adjust_brief: "adjust suggestions",
    override_brief: "override recommendations",
    flag_recommendation: "flag policy rules",
    refresh_stale: "refresh stale data",
    log_evidence: "record field evidence",
    request_clarification: "resolve clarify chips",
    approve_exception: "approve supervisor exceptions",
    rebalance_route: "rebalance territory routes",
    review_coaching: "review rep coaching",
    retire_rule: "retire obsolete rules",
    acknowledge_readiness: "sign off readiness items",
    approve_claim: "approve damage claims",
    tune_jbp: "tune joint business plans",
    export_charter: "export key account charters",
    request_credit_review: "request credit line reviews",
    approve_rebate: "approve tier rebates",
    publish_policy: "publish new policies",
    update_eval_bar: "update quality pass bars",
    claim_gap: "claim backlog gap tickets",
    confirm_term: "confirm local trade terms",
    execute_raw_write: "execute raw database writes",
    export_audit: "export immutable audit logs",
    replay_decision: "replay past decisions step by step",
    override_release_gate: "override release gates",
    sign_off_qbr: "sign off executive QBR decks",
  };
  const canText = allowed.slice(0, 3).map((a) => actionLabels[a] || a.replace(/_/g, " ")).join(", ");
  const cannotText = forbidden.slice(0, 3).map((a) => actionLabels[a] || a.replace(/_/g, " ")).join(", ");
  return `<div class="acting-as-bar" style="background:var(--surface-subtle);border-bottom:1px solid var(--line-soft);padding:6px var(--s4);font-size:11px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <span style="font-weight:600;color:var(--ink)">You are ${esc(roleTitle)}.</span>
      <span class="muted">You can: ${esc(canText || "view assigned views")}.</span>
      <span class="muted">You cannot: ${esc(cannotText || "modify governance rules")}.</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <div class="font-stepper" style="display:inline-flex;align-items:center;gap:2px">
        <button class="seg sm ${(ctx.app?.textSize || 'sm') === 'sm' ? 'on' : ''}" data-act="set-text-size" data-size="sm" title="Standard text size" style="min-height:var(--tap);min-width:var(--tap);font-size:11px">A</button>
        <button class="seg sm ${ctx.app?.textSize === 'md' ? 'on' : ''}" data-act="set-text-size" data-size="md" title="Large text size" style="min-height:var(--tap);min-width:var(--tap);font-size:13px">A+</button>
        <button class="seg sm ${ctx.app?.textSize === 'lg' ? 'on' : ''}" data-act="set-text-size" data-size="lg" title="Extra large text size" style="min-height:var(--tap);min-width:var(--tap);font-size:15px">A++</button>
      </div>
      <button class="btn text sm" data-act="toggle-simple-view" style="min-height:var(--tap);min-width:var(--tap);display:inline-flex;align-items:center;padding:0 8px;font-size:11px;text-decoration:underline">${ctx.app?.simpleView ? 'Full view' : 'Simple view'}</button>
      <button class="btn text sm" data-act="open-guide" style="min-height:var(--tap);min-width:var(--tap);display:inline-flex;align-items:center;padding:0 8px;font-size:11px;text-decoration:underline">How this works</button>
      <button class="btn text sm" data-act="open-rights-matrix" style="min-height:var(--tap);min-width:var(--tap);display:inline-flex;align-items:center;padding:0 8px;font-size:11px;text-decoration:underline">See all rights</button>
    </div>
  </div>`;
}

function renderRightsModal(app, ctx) {
  if (!app?.ui?.rightsOpen || !ctx) return "";
  const g = ctx.industry.governance;
  const roles = g?.rights?.roles || ["rep", "manager", "kam", "ops", "exec"];
  const roleNames = {
    rep: ctx.industry.personas?.rep || "Sales Rep",
    manager: ctx.industry.personas?.manager || "Sales Manager",
    kam: ctx.industry.personas?.kam || "Key Account Lead",
    ops: ctx.industry.personas?.admin || "Market Operations",
    exec: "Executive Leader",
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
  const user = ctx.persona === 'rep' ? data.rep : ctx.persona === 'manager' ? data.manager : data.admin;
  const actingAsBar = renderActingAsBar(ctx);
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
    const active = name === id || (id === 'brief' && ['brief', 'action', 'order', 'complete'].includes(name)) || (id === 'today' && ['account', 'route', 'ask'].includes(name)) || (id === 'config' && name === 'problems');
    return `<a class="tab${active ? ' on' : ''}" href="${href}" data-nav="${id}"${active ? ' aria-current="page"' : ''}><span class="tab-ic">${icon(ic, 22)}</span><span>${esc(label)}</span></a>`;
  }).join('');
  const prepared = app.config.prepared ? `<div class="prepared-band" id="prepared">Prepared for ${esc(app.config.prepared)}</div>` : '';
  return `
  <div class="app" data-region="app" data-screen="${name}">
    <header class="appbar">
      <button class="logo" id="logo" aria-label="AI Assistor home">
        <span class="mark">${icon(ctx.industry.icon, 18)}</span><span class="brand">AI Assistor</span>
      </button>
      <button class="who" data-act="open-sync-modal" aria-haspopup="dialog" aria-label="Enterprise sync telemetry and user profile"><span class="who-text"><b>${esc(user.name)}</b><small><span class="sync-dot ${app.offline ? 'offline' : ''}" aria-hidden="true"></span> ${app.offline ? 'Offline' : esc(t(user.title))}</small></span><span class="avatar" aria-hidden="true">${esc(initials(user.name))}</span></button>
    </header>${actingAsBar}${deniedHtml}${app.offline ? `<div class="offline-strip" id="offline-strip">${icon('sync', 16)} <span>Offline mode active. Local AES-256 encrypted storage.</span><button class="pill-btn sm" data-act="toggle-offline" style="margin-left:auto;background:rgba(255,255,255,0.2);color:#fff;min-height:var(--tap);display:inline-flex;align-items:center">Go online</button></div>` : ''}${prepared}
    <main class="screen" id="screen" data-region="screen">${out}</main>
    ${dock ? `<div class="dock" data-region="dock">${dock}</div>` : ''}
    <nav class="tabs" aria-label="Main">${nav}</nav>
  </div>`;
}

// ---- Events ----------------------------------------------------------------

const rbacActions = {
  "open-rights-matrix": ({ app }) => { (app.ui ||= {}).rightsOpen = true; },
  "close-rights-matrix": ({ app }) => { if (app.ui) app.ui.rightsOpen = false; },
  "dismiss-denial": ({ app }) => { app.deniedNotice = null; },
};
function handle(e, type) {
  const el = e.target.closest(`[data-${type}]`);
  if (!el) return;
  const name = el.dataset[type];
  const fn = ACTIONS[name] || presenterActions[name] || syncActions[name] || rbacActions[name] || governanceActions[name] || (name === 'set-vp' ? (({ app, data, api }) => { app.vp = data.vp; api.render(); }) : null);
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
