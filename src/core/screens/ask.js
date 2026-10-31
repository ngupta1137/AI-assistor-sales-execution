// R9 Ask AI: the full-page view of the same conversation the floating assistant shows.
// All answer logic lives in src/core/assistant/. This screen only renders it.

import { esc, icon } from '../ui.js';
import { renderLog, stateOf, assistantActions } from '../assistant/ui.js';
import { suggestionsFor } from '../assistant/engine.js';
import { getCountryLanguage, translateQuestion } from '../assistant/i18n.js';

export function render(ctx) {
  const { t, app } = ctx;
  const st = stateOf(app);
  const currentLang = st.lang || 'en';
  const countryLang = getCountryLanguage(ctx.country?.id);
  const showLangToggle = countryLang.code !== 'en';

  const defaultScreen = st.c?.screen && st.c.screen !== 'ask' ? st.c.screen : (ctx.persona === 'manager' ? 'manager' : 'today');
  const activeScreen = st.askScreen || defaultScreen;

  const screens = ctx.persona === 'manager' ? [
    { id: 'manager', label: t('Exceptions') },
    { id: 'today', label: t('Today') },
    { id: 'account', label: t('{account}') },
    { id: 'order', label: t('{order}') },
    { id: 'agents', label: t('Agents') },
  ] : [
    { id: 'today', label: t('Today') },
    { id: 'brief', label: t('{visit} Brief') },
    { id: 'account', label: t('{account} 360') },
    { id: 'action', label: t('Action') },
    { id: 'order', label: t('{order}') },
    { id: 'route', label: t('Route') },
  ];

  const list = suggestionsFor(ctx, { ...st.c, screen: activeScreen, persona: ctx.persona });
  const chip = (s) => {
    const label = translateQuestion(s.q, currentLang);
    return `<button class="chip-q" data-act="ask-q" data-intent="${esc(s.intent)}" data-q="${esc(s.q)}">${esc(label)}</button>`;
  };

  const hasLog = st.history.length || st.pending;

  const langBar = showLangToggle ? `
    <div class="as-lang-bar" role="group" aria-label="Language selection">
      <button class="pill-btn sm ${currentLang === 'en' ? 'active' : ''}" data-act="as-set-lang" data-lang="en">English</button>
      <button class="pill-btn sm ${currentLang === countryLang.code ? 'active' : ''}" data-act="as-set-lang" data-lang="${countryLang.code}">${countryLang.label}</button>
    </div>` : '';

  const screenPills = `
    <div class="screen-pills" role="tablist" aria-label="Screen FAQs">
      ${screens.map((sc) => `<button class="pill-btn sm ${sc.id === activeScreen ? 'active' : ''}" data-act="as-screen-faq" data-screen="${sc.id}">${sc.label}</button>`).join('')}
    </div>`;

  const html = `
  <div class="head-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
    <a class="back" href="#/today">${icon('back', 18)} Today</a>
    ${langBar}
  </div>
  <section class="page-head">
    <h1>Ask AI</h1>
    <p class="small muted">Sample data. Answers come from configured rules and this scenario's data, not a live model. Select a screen topic or pick an FAQ below.</p>
  </section>
  <div class="chat" id="chat"${hasLog ? '' : ' hidden'} role="log" aria-live="polite">${renderLog(ctx, app)}</div>
  <section class="ask-faqs">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;flex-wrap:wrap">
      <h2 class="small" style="margin:0">${currentLang === 'en' ? 'Screen FAQs' : (countryLang.label + ' FAQs')}</h2>
      ${screenPills}
    </div>
    <div class="chips-q">${list.map(chip).join('')}</div>
  </section>
  <p class="foot-note">The assistant never gives clinical, credit, pricing or agronomic advice.</p>`;
  const dock = `<form class="ask-row" onsubmit="return false">
    <label class="sr-only" for="ask-input">Question</label>
    <input class="input" id="ask-input" type="text" maxlength="200" autocomplete="off" placeholder="${esc(t('Ask about today\'s {accounts}'))}" data-input="ask-draft" value="${esc(st.draft)}">
    <button class="btn primary" data-act="ask-free" id="ask-send">Ask</button>
  </form>`;
  return { html, dock };
}

export const actions = assistantActions;
