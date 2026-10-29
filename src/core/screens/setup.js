// Demo setup: pick industry, country and persona. Full product name lives here.

import { esc, icon } from '../ui.js';

const PERSONA_INFO = {
  rep: { label: 'Field rep', text: 'A ranked day and an explained plan for every {visit}.' },
  manager: { label: 'Manager', text: 'Team view and the exception queue.' },
  admin: { label: 'Sales ops admin', text: 'Configuration, agent controls and problems solved.' },
};

export function render({ app, INDUSTRIES, COUNTRIES, buildContext }) {
  const s = app.ui.setup || (app.ui.setup = {
    industry: app.config?.industryId || '', country: app.config?.countryId || '', persona: app.config?.persona || 'rep', prepared: app.config?.prepared || '',
  });
  const ready = s.industry && s.country;
  let preview = '<p class="muted small">Pick an industry and a country to see who you sign in as.</p>';
  let ctx = null;
  if (ready) {
    ctx = buildContext(s.industry, s.country);
    const who = s.persona === 'rep' ? ctx.data.rep : s.persona === 'manager' ? ctx.data.manager : ctx.data.admin;
    preview = `<p class="signin">Signs in as <b>${esc(who.name)}</b>, ${esc(ctx.t(who.title))}, ${esc(ctx.data.city.name)}</p>`;
  }
  const tiles = INDUSTRIES.map((ind) => `
    <button class="tile${s.industry === ind.id ? ' on' : ''}" data-act="setup-industry" data-id="${ind.id}" style="--tile:${ind.accent}" aria-pressed="${s.industry === ind.id}">
      <span class="tile-ic">${icon(ind.icon, 24)}</span>
      <span class="tile-name">${esc(ind.name)}</span>
      <span class="tile-sub">${esc(ind.tagline)}</span>
    </button>`).join('');
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

  return `
  <div class="setup" data-region="setup">
    <header class="setup-head">
      <div class="setup-logo">${icon('agent', 26)}</div>
      <h1>AI Assistor Sales Execution</h1>
      <p class="muted">An AI field sales app that plans each rep's day, ranks what to do in every visit, and shows what happened.</p>
      <span class="sample-tag">Sample data. All names are fictional.</span>
    </header>
    ${app.notice ? `<div class="notice">${esc(app.notice)}</div>` : ''}
    <section><h2 class="setup-step">1. Industry</h2><div class="tiles">${tiles}</div></section>
    <section><h2 class="setup-step">2. Country</h2><div class="chips">${countries}</div></section>
    <section><h2 class="setup-step">3. Persona</h2><div class="personas">${personas}</div></section>
    <section><h2 class="setup-step">4. Prepared for <span class="muted small">(optional)</span></h2>
      <input class="input" type="text" maxlength="40" placeholder="Prospect name, shown as Prepared for" value="${esc(s.prepared)}" data-change="setup-prepared" id="setup-prepared">
    </section>
    <div class="setup-foot">
      ${preview}
      <button class="btn primary block" data-act="setup-start" id="start-demo" ${ready ? '' : 'disabled'}>Start demo</button>
    </div>
  </div>`;
}

export const actions = {
  'setup-industry': ({ app, data }) => { app.ui.setup.industry = data.id; },
  'setup-country': ({ app, data }) => { app.ui.setup.country = data.id; },
  'setup-persona': ({ app, data }) => { app.ui.setup.persona = data.id; },
  'setup-prepared': ({ app, value }) => { app.ui.setup.prepared = value.trim().slice(0, 40); },
  'setup-start': ({ app, api }) => {
    const s = app.ui.setup;
    if (!s.industry || !s.country) return false;
    app.notice = '';
    api.configure({ industryId: s.industry, countryId: s.country, persona: s.persona, prepared: s.prepared }, { home: true });
    return 'nav';
  },
};
