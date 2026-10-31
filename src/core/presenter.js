// Hidden presenter menu (Shift+D or long press on the logo) and the optional
// presenter notes panel shown beside the phone frame on desktop.

import { esc } from './text.js';
import { icon } from './icons.js';

const STEP_ROUTES = (ctx) => {
  const first = ctx.data.planned[0];
  const firstAction = first.actions[0];
  return ['#/setup', '#/today', `#/brief/${first.accountId}`, `#/action/${firstAction.id}`, `#/order/${first.accountId}`, `#/complete/${first.accountId}`, '#/agents', '#/config'];
};

export function renderPresenter(app, ctx, { INDUSTRIES, COUNTRIES, PERSONAS, shareLink }) {
  if (!app.presenterOpen) return '';
  const c = app.config || {};
  const opt = (list, cur) => list.map((x) => `<option value="${esc(x.id)}"${x.id === cur ? ' selected' : ''}>${esc(x.name)}</option>`).join('');
  const personaName = { rep: 'Field rep', manager: 'Manager', admin: 'Sales ops admin' };
  const configured = !!app.config;
  return `
  <div class="presenter-backdrop" data-act="presenter-close"></div>
  <section class="presenter" role="dialog" aria-modal="true" aria-label="Presenter menu" data-region="presenter">
    <header class="presenter-head">
      <div><b>Presenter menu</b></div>
      <button class="icon-btn" data-act="presenter-close" aria-label="Close">${icon('x', 20)}</button>
    </header>
    <div class="presenter-body">
      <label class="field"><span>Industry</span>
        <select data-change="p-industry" id="p-industry">${configured ? '' : '<option value="">Choose</option>'}${opt(INDUSTRIES, c.industryId)}</select></label>
      <label class="field"><span>Country</span>
        <select data-change="p-country" id="p-country">${configured ? '' : '<option value="">Choose</option>'}${opt(COUNTRIES, c.countryId)}</select></label>
      <label class="field"><span>Device viewport</span>
        <select data-change="p-viewport" id="p-viewport">
          <option value="phone"${(app.vp || 'phone') === 'phone' ? ' selected' : ''}>Phone (390 px - field)</option>
          <option value="tablet"${app.vp === 'tablet' ? ' selected' : ''}>Tablet (768 px - iPad)</option>
          <option value="desktop"${app.vp === 'desktop' ? ' selected' : ''}>Desktop Portal (100% width)</option>
        </select></label>
      <label class="field"><span>Persona</span>
        <select data-change="p-persona" id="p-persona">${PERSONAS.map((p) => `<option value="${p}"${p === c.persona ? ' selected' : ''}>${personaName[p]}</option>`).join('')}</select></label>
      <label class="field"><span>Prepared for (optional)</span>
        <input type="text" maxlength="40" data-change="p-prepared" value="${esc(c.prepared || '')}" placeholder="Prospect name"></label>
      ${configured ? `<label class="field"><span>Share link</span><input type="text" readonly value="${esc(shareLink)}" id="p-link" data-act="p-select"></label>` : ''}
      <div class="presenter-actions">
        ${configured ? `<button class="btn secondary" data-act="p-copy">${icon('note', 20)}Copy link</button>
        <button class="btn secondary" data-act="p-notes">${icon('brief', 20)}${app.notesOpen ? 'Hide' : 'Show'} presenter notes</button>` : ''}
        <button class="btn secondary" data-act="p-assistant" id="p-assistant" aria-pressed="${app.assistantEnabled !== false}">${icon('ask', 20)}Assistant: ${app.assistantEnabled === false ? 'off. Show assistant' : 'on. Hide assistant'}</button>
        ${configured ? `<button class="btn secondary" data-act="p-chat-reset" id="p-chat-reset">${icon('route', 20)}Reset chat</button>` : ''}
        <button class="btn secondary" data-act="p-setup">${icon('config', 20)}Open setup screen</button>
        ${configured ? `<hr>${app.confirmReset
    ? `<p class="small">Clear every decision, outcome and ${esc(ctx ? ctx.t('{order}') : 'order')} in ${esc(INDUSTRIES.find((i) => i.id === c.industryId)?.name || '')}, ${esc(COUNTRIES.find((x) => x.id === c.countryId)?.name || '')} and all other scenarios? The demo data itself stays the same.</p>
        <div class="btn-row" style="flex-wrap:nowrap"><button class="btn secondary" style="flex:1" data-act="p-reset-cancel">Cancel</button>
        <button class="btn danger" style="flex:1" data-act="p-reset-confirm" id="p-reset-confirm">Reset demo</button></div>`
    : `<button class="btn danger" data-act="p-reset" id="p-reset">${icon('route', 20)}Reset demo</button>`}` : ''}
      </div>
      ${app.copied === true ? '<p class="small ok-text" role="status">Link copied.</p>' : app.copied === 'failed' ? '<p class="small warn-text" role="status">Copy failed. Select the link and copy it.</p>' : ''}
      <p class="small muted">All names, places and numbers are generated for demonstration. Nothing here describes a real company or a real result. Shortcut: Shift+D.</p>
    </div>
  </section>`;
}

export function renderNotes(app, ctx) {
  if (!ctx || !app.notesOpen) return '';
  const routes = STEP_ROUTES(ctx);
  const hash = location.hash || '#/today';
  // The most specific matching step: exact route first, then the screen name.
  let current = routes.findIndex((r) => r === hash);
  if (current < 0) current = routes.findIndex((r) => r.split('/')[1] === hash.split('/')[1]);
  const steps = ctx.industry.storyline.map((s, i) => `<li${i === current ? ' class="current" aria-current="step"' : ''}><a href="${routes[i] || '#/today'}">${esc(ctx.t(s))}</a></li>`).join('');
  return `<div class="side-inner" data-region="notes">
    <div class="side-head"><b>Presenter notes</b></div>
    <p class="small muted">${esc(ctx.industry.name)} · ${esc(ctx.country.name)}. Presenter notes are visible beside the app, so hide them before you share this window.</p>
    <ol class="story">${steps}</ol>
    <div class="side-switch">
      <button class="btn secondary sm" data-act="p-as" data-persona="rep">As rep</button>
      <button class="btn secondary sm" data-act="p-as" data-persona="manager">As manager</button>
      <button class="btn secondary sm" data-act="p-as" data-persona="admin">As admin</button>
    </div>
  </div>`;
}

export const presenterActions = {
  'presenter-close': ({ app }) => { app.presenterOpen = false; app.copied = false; app.confirmReset = false; },
  'p-industry': ({ value, api, app }) => {
    if (!value) return false;
    const next = { industryId: value, persona: app.config?.persona || 'rep' };
    if (!app.config && !document.getElementById('p-country').value) { app.pendingIndustry = value; return false; }
    if (!app.config) next.countryId = document.getElementById('p-country').value;
    app.presenterOpen = false;
    api.configure(next, { home: true });
    return 'nav';
  },
  'p-country': ({ value, api, app }) => {
    if (!value) return false;
    const next = { countryId: value, persona: app.config?.persona || 'rep' };
    if (!app.config) {
      const ind = document.getElementById('p-industry').value;
      if (!ind) return false;
      next.industryId = ind;
    }
    app.presenterOpen = false;
    api.configure(next, { home: true });
    return 'nav';
  },
  'p-persona': ({ value, api, app }) => {
    if (!app.config) return false;
    app.presenterOpen = false;
    api.configure({ persona: value }, { home: true });
    return 'nav';
  },
  'p-prepared': ({ value, api, app }) => {
    if (!app.config) return false;
    api.configure({ prepared: value.trim().slice(0, 40) });
    return 'nav';
  },
  'p-as': ({ data, api }) => { api.configure({ persona: data.persona }, { home: true }); return 'nav'; },
  'p-select': ({ el }) => { el.select(); return false; },
  'p-copy': ({ app, api }) => {
    const input = document.getElementById('p-link');
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(input.value).then(() => { app.copied = true; api.render(); }, () => { app.copied = 'failed'; api.render(); });
        return false;
      }
      input.select();
      app.copied = document.execCommand('copy') ? true : 'failed';
    } catch { app.copied = 'failed'; }
  },
  'p-notes': ({ app }) => { app.notesOpen = !app.notesOpen; },
  'p-assistant': ({ app, api }) => { app.assistantEnabled = app.assistantEnabled === false; api.syncUrl(); },
  'p-chat-reset': ({ app }) => { const st = app.assistant; if (st) { st.history = []; st.pending = null; st.why = {}; st.draft = ''; st.open = false; } },
  'p-reset': ({ app }) => { app.confirmReset = true; },
  'p-reset-cancel': ({ app }) => { app.confirmReset = false; },
  'p-reset-confirm': ({ api, app }) => {
    app.confirmReset = false;
    api.resetDemo();
    app.presenterOpen = false;
    api.navigate(`#/${{ rep: 'today', manager: 'manager', admin: 'config' }[app.config.persona]}`);
    return 'nav';
  },
  'p-setup': ({ app, api }) => { app.presenterOpen = false; api.navigate('#/setup'); return 'nav'; },
};
