// App shell: configuration from the URL, hash routing, rendering, event delegation.

import { INDUSTRIES, COUNTRIES, findIndustry, findCountry } from '../packs/index.js';
import { generate } from '../data/generate.js';
import { createText, esc } from './text.js';
import { createFormat } from './format.js';
import { createModel, resetSessions } from './state.js';
import { icon } from './icons.js';
import { initials } from './ui.js';
import { SCREENS, ACTIONS } from './screens/index.js';
import { renderPresenter, renderNotes, presenterActions } from './presenter.js';

export const PERSONAS = ['rep', 'manager', 'admin'];
export const HOME = { rep: 'today', manager: 'manager', admin: 'config' };
const NAV = {
  rep: [['today', 'Today', 'home'], ['brief', 'Brief', 'brief'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config'], ['problems', 'Problems', 'bulb']],
  manager: [['manager', 'Team', 'team'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config'], ['problems', 'Problems', 'bulb']],
  admin: [['config', 'Config', 'config'], ['agents', 'Agents', 'agent'], ['problems', 'Problems', 'bulb'], ['manager', 'Team', 'team']],
};

const app = {
  config: null,        // { industryId, countryId, persona, prepared, color }
  ui: {},              // transient UI state (open panels, setup picks)
  presenterOpen: false,
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
  writeUrl(home ? `#/${HOME[app.config.persona]}` : undefined);
  if (home) navigate(`#/${HOME[app.config.persona]}`); else render();
}

export function resetDemo() {
  resetSessions();
  app.cache.clear();
  app.ui = {};
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

function applyTheme(ctx) {
  const pick = app.ui.setup?.industry && !ctx ? findIndustry(app.ui.setup.industry)?.accent : null;
  const accent = app.config?.color && ctx ? readableAccent(app.config.color) : ctx?.industry.accent || pick || '#334155';
  document.documentElement.style.setProperty('--accent', accent);
}

export function render() {
  const root = document.getElementById('root');
  const route = parseRoute();
  let html;
  let ctx = null;
  if (!app.config || route.name === 'setup') {
    applyTheme(null);
    html = SCREENS.setup.render({ app, INDUSTRIES, COUNTRIES, buildContext });
  } else {
    ctx = buildContext(app.config.industryId, app.config.countryId);
    ctx.persona = app.config.persona;
    ctx.ui = app.ui;
    ctx.app = app;
    applyTheme(ctx);
    const name = SCREENS[route.name] && route.name !== 'setup' ? route.name : HOME[ctx.persona];
    const out = SCREENS[name].render(ctx, route.args);
    html = shell(ctx, name, out);
  }
  root.innerHTML = html + renderPresenter(app, ctx, { INDUSTRIES, COUNTRIES, PERSONAS, shareLink: shareLink() });
  const side = document.getElementById('side');
  if (side) side.innerHTML = renderNotes(app, ctx);
  document.body.classList.toggle('notes-open', app.notesOpen && !!ctx);
  const scroller = document.getElementById('screen');
  if (scroller && app.scrollTop != null) { scroller.scrollTop = app.scrollTop; app.scrollTop = null; }
  SCREENS[route.name]?.mounted?.(ctx, route.args);
}

function shell(ctx, name, out) {
  const { t, data } = ctx;
  const user = ctx.persona === 'rep' ? data.rep : ctx.persona === 'manager' ? data.manager : data.admin;
  const nav = NAV[ctx.persona].map(([id, label, ic]) => {
    const firstBrief = ctx.m.nextAccount(null)?.accountId || data.planned[0].accountId;
    const href = id === 'brief' ? `#/brief/${firstBrief}` : `#/${id}`;
    const active = name === id || (id === 'brief' && ['brief', 'action', 'order', 'complete'].includes(name)) || (id === 'today' && ['account', 'route', 'ask'].includes(name));
    return `<a class="tab${active ? ' on' : ''}" href="${href}" data-nav="${id}">${icon(ic, 22)}<span>${esc(label)}</span></a>`;
  }).join('');
  const prepared = app.config.prepared ? `<div class="prepared-band" id="prepared">Prepared for ${esc(app.config.prepared)}</div>` : '';
  return `
  <div class="app" data-region="app" data-screen="${name}">
    <header class="appbar">
      <button class="logo" id="logo" aria-label="AI Assistor home. Long press for presenter menu">
        <span class="mark">${icon(ctx.industry.icon, 18)}</span><span class="brand">AI Assistor</span>
      </button>
      <div class="appbar-right">
        <div class="who" title="${esc(user.name)}"><span class="who-text"><b>${esc(user.name)}</b><small>${esc(t(user.title))}</small></span><span class="avatar">${esc(initials(user.name))}</span></div>
      </div>
    </header>${prepared}
    <main class="screen" id="screen" data-region="screen">${out}</main>
    <nav class="tabs" aria-label="Main">${nav}</nav>
  </div>`;
}

// ---- Events ----------------------------------------------------------------

function handle(e, type) {
  const el = e.target.closest(`[data-${type}]`);
  if (!el) return;
  const name = el.dataset[type];
  const fn = ACTIONS[name] || presenterActions[name];
  if (!fn) return;
  if (type === 'act' && el.tagName === 'A') e.preventDefault();
  const ctx = app.config ? buildContext(app.config.industryId, app.config.countryId) : null;
  if (ctx) { ctx.ui = app.ui; ctx.persona = app.config.persona; ctx.app = app; }
  const keepScroll = document.getElementById('screen')?.scrollTop;
  const result = fn({ ctx, app, el, value: el.value, data: el.dataset, event: e, api: { navigate, configure, resetDemo, render } });
  if (result !== false) {
    if (result !== 'nav') app.scrollTop = keepScroll;
    render();
  }
}

export function start() {
  app.config = readConfig();
  if (app.config && !location.hash) writeUrl(`#/${HOME[app.config.persona]}`);
  window.addEventListener('hashchange', () => { app.ui = { ...app.ui, panel: null }; render(); document.getElementById('screen')?.scrollTo(0, 0); });
  document.addEventListener('click', (e) => handle(e, 'act'));
  document.addEventListener('change', (e) => handle(e, 'change'));

  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'D' || e.key === 'd') && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) {
      e.preventDefault();
      app.presenterOpen = !app.presenterOpen;
      render();
    } else if (e.key === 'Escape' && app.presenterOpen) {
      app.presenterOpen = false;
      render();
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
