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
      <div><b>Presenter menu</b><span class="sample-tag">Sample data</span></div>
      <button class="icon-btn" data-act="presenter-close" aria-label="Close">${icon('x', 20)}</button>
    </header>
    <div class="presenter-body">
      <label class="field"><span>Industry</span>
        <select data-change="p-industry" id="p-industry">${configured ? '' : '<option value="">Choose</option>'}${opt(INDUSTRIES, c.industryId)}</select></label>
      <label class="field"><span>Country</span>
        <select data-change="p-country" id="p-country">${configured ? '' : '<option value="">Choose</option>'}${opt(COUNTRIES, c.countryId)}</select></label>
      <label class="field"><span>Persona</span>
        <select data-change="p-persona" id="p-persona">${PERSONAS.map((p) => `<option value="${p}"${p === c.persona ? ' selected' : ''}>${personaName[p]}</option>`).join('')}</select></label>
      <label class="field"><span>Prepared for (optional)</span>
        <input type="text" maxlength="40" data-change="p-prepared" value="${esc(c.prepared || '')}" placeholder="Prospect name"></label>
      ${configured ? `<label class="field"><span>Share link</span><input type="text" readonly value="${esc(shareLink)}" id="p-link" data-act="p-select"></label>` : ''}
      <div class="presenter-actions">
        ${configured ? `<button class="btn ghost" data-act="p-copy">${icon('note', 18)}Copy link</button>
        <button class="btn ghost" data-act="p-notes">${icon('brief', 18)}${app.notesOpen ? 'Hide' : 'Show'} presenter notes</button>
        <button class="btn ghost" data-act="p-reset" id="p-reset">${icon('route', 18)}Reset demo</button>` : ''}
        <button class="btn ghost" data-act="p-setup">${icon('config', 18)}Open setup screen</button>
      </div>
      ${app.copied ? '<p class="small ok-text">Link copied.</p>' : ''}
      <p class="small muted">All names, places and numbers are generated sample data. Nothing here describes a real company or a real result. Shortcut: Shift+D.</p>
    </div>
  </section>`;
}

export function renderNotes(app, ctx) {
  if (!ctx || !app.notesOpen) return '';
  const routes = STEP_ROUTES(ctx);
  const steps = ctx.industry.storyline.map((s, i) => `<li><a href="${routes[i] || '#/today'}">${esc(ctx.t(s))}</a></li>`).join('');
  return `<div class="side-inner" data-region="notes">
    <div class="side-head"><b>Presenter notes</b><span class="sample-tag">Sample data</span></div>
    <p class="small muted">${esc(ctx.industry.name)} · ${esc(ctx.country.name)}. Only you see this panel.</p>
    <ol class="story">${steps}</ol>
    <div class="side-switch">
      <button class="btn ghost sm" data-act="p-as" data-persona="rep">As rep</button>
      <button class="btn ghost sm" data-act="p-as" data-persona="manager">As manager</button>
      <button class="btn ghost sm" data-act="p-as" data-persona="admin">As admin</button>
    </div>
  </div>`;
}

export const presenterActions = {
  'presenter-close': ({ app }) => { app.presenterOpen = false; app.copied = false; },
  'p-industry': ({ value, api, app }) => {
    if (!value) return false;
    const next = { industryId: value, persona: app.config?.persona || 'rep' };
    if (!app.config && !document.getElementById('p-country').value) { app.pendingIndustry = value; return false; }
    if (!app.config) next.countryId = document.getElementById('p-country').value;
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
    api.configure(next, { home: true });
    return 'nav';
  },
  'p-persona': ({ value, api, app }) => {
    if (!app.config) return false;
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
  'p-copy': ({ app }) => {
    const input = document.getElementById('p-link');
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(input.value).catch(() => {});
      else { input.select(); document.execCommand('copy'); }
      app.copied = true;
    } catch { app.copied = false; }
  },
  'p-notes': ({ app }) => { app.notesOpen = !app.notesOpen; },
  'p-reset': ({ api, app }) => {
    api.resetDemo();
    app.presenterOpen = false;
    api.navigate(`#/${{ rep: 'today', manager: 'manager', admin: 'config' }[app.config.persona]}`);
    return 'nav';
  },
  'p-setup': ({ app, api }) => { app.presenterOpen = false; api.navigate('#/setup'); return 'nav'; },
};
