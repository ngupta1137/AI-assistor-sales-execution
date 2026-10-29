// Demo setup: pick industry, country and persona. Full product name lives here.

import { esc, icon } from '../ui.js';

const PERSONA_INFO = {
  rep: { label: 'Field rep', text: 'A ranked day and an explained plan for every {visit}.' },
  manager: { label: 'Manager', text: 'Team view and the exception queue.' },
  admin: { label: 'Sales ops admin', text: 'Configuration, agent controls and problems solved.' },
};

export function render({ app, INDUSTRIES, COUNTRIES, buildContext }) {
  const s = app.ui.setup || (app.ui.setup = {
    industry: app.config?.industryId || '', country: app.config?.countryId || '', persona: app.config?.persona || 'rep', prepared: app.config?.prepared || '', color: app.config?.color || '',
  });
  const ready = s.industry && s.country;
  let preview = '<p class="signin">Choose an industry and a country to start.</p>';
  let ctx = null;
  if (ready) {
    ctx = buildContext(s.industry, s.country);
    const who = s.persona === 'rep' ? ctx.data.rep : s.persona === 'manager' ? ctx.data.manager : ctx.data.admin;
    preview = `<p class="signin">Signs in as <b>${esc(who.name)}</b>, ${esc(ctx.t(who.title))}, ${esc(ctx.data.city.name)}</p>`;
  }
  const check = icon('check', 14);
  const tiles = INDUSTRIES.map((ind) => `<li>
    <button class="choice tile${s.industry === ind.id ? ' on' : ''}" data-act="setup-industry" data-id="${ind.id}" style="--tile:${ind.accent}" aria-pressed="${s.industry === ind.id}">
      <span class="tile-ic">${icon(ind.icon, 20)}</span>
      <span class="txt"><b class="tile-name">${esc(ind.name)}</b><small class="tile-sub">${esc(ind.tagline)}</small></span>
      <span class="check" aria-hidden="true">${s.industry === ind.id ? check : ''}</span>
    </button></li>`).join('');
  const countries = COUNTRIES.map((c) => `
    <button class="chip${s.country === c.id ? ' on' : ''}" data-act="setup-country" data-id="${c.id}" aria-pressed="${s.country === c.id}">
      <b>${esc(c.name)}</b><small>${esc(c.currency)}</small>
    </button>`).join('');
  const personas = Object.entries(PERSONA_INFO).map(([id, p]) => {
    const title = ctx ? ctx.industry.personas[id] : p.label;
    const text = ctx ? ctx.t(p.text) : p.text.replace('{visit}', 'visit');
    return `<button class="persona${s.persona === id ? ' on' : ''}" data-act="setup-persona" data-id="${id}" aria-pressed="${s.persona === id}">
      <b>${esc(title)}</b><small>${esc(text)}</small></button>`;
  }).join('');
  const chosen = ready ? `${INDUSTRIES.find((i) => i.id === s.industry).name} · ${COUNTRIES.find((c) => c.id === s.country).name}` : '';

  return `
  <div class="setup" data-region="setup">
    <div class="setup-scroll">
      <header class="setup-head">
        <div class="setup-brand"><span class="mark">${icon('agent', 18)}</span>AI Assistor</div>
        <h1>AI Assistor Sales Execution</h1>
        <p class="muted small">Plans each rep's day, ranks what to do in every visit, and shows what happened. Choose a sample scenario.</p>
        <span><span class="sample-tag">Sample data. All names are fictional.</span></span>
      </header>
      ${app.notice ? `<div class="notice warn">${icon('flag', 18)}<span>${esc(app.notice)}</span></div>` : ''}
      <section><h2 class="setup-step">Industry</h2><ul class="choice-list tiles">${tiles}</ul></section>
      <section><h2 class="setup-step">Country</h2><div class="chips">${countries}</div></section>
      <section><h2 class="setup-step">Role</h2><div class="personas">${personas}</div></section>
      <details ${s.prepared || s.color ? 'open' : ''}><summary>Prepared for (optional)</summary>
        <label class="field">Prospect name, shown as Prepared for
          <input class="input" type="text" maxlength="40" value="${esc(s.prepared)}" data-change="setup-prepared" id="setup-prepared"></label>
        <label class="color-row"><span>Accent</span>
          <input type="color" value="${esc(s.color || (INDUSTRIES.find((i) => i.id === s.industry)?.accent || '#334155'))}" data-change="setup-color" id="setup-color">
          ${s.color ? '<button class="btn secondary sm" data-act="setup-color-reset">Use industry default</button>' : ''}
        </label>
        <p class="small muted">Name and accent only. Never use a real company's logo.</p>
      </details>
    </div>
    <div class="setup-foot">
      ${chosen ? `<p class="small"><b>${esc(chosen)}</b></p>` : ''}
      ${preview}
      <span class="small warn-text">Sample data</span>
      <button class="btn primary block" data-act="setup-start" id="start-demo" ${ready ? '' : 'disabled'}>${ready ? 'Start demo' : 'Choose an industry and a country'}</button>
    </div>
  </div>`;
}

export const actions = {
  'setup-industry': ({ app, data }) => { app.ui.setup.industry = data.id; },
  'setup-country': ({ app, data }) => { app.ui.setup.country = data.id; },
  'setup-persona': ({ app, data }) => { app.ui.setup.persona = data.id; },
  'setup-prepared': ({ app, value }) => { app.ui.setup.prepared = value.trim().slice(0, 40); },
  'setup-color': ({ app, value }) => { if (/^#[0-9a-fA-F]{6}$/.test(value)) app.ui.setup.color = value; },
  'setup-color-reset': ({ app }) => { app.ui.setup.color = ''; },
  'setup-start': ({ app, api }) => {
    const s = app.ui.setup;
    if (!s.industry || !s.country) return false;
    app.notice = '';
    api.configure({ industryId: s.industry, countryId: s.country, persona: s.persona, prepared: s.prepared, color: s.color }, { home: true });
    return 'nav';
  },
};
