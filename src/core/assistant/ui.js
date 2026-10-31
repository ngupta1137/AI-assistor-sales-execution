// Assistant UI: floating launcher, bottom sheet, the conversation, focus handling.
// One conversation is shared by the sheet and the Ask AI page. Answers come from the engine.

import { esc, icon } from '../ui.js';
import { suggestionsFor } from './engine.js';
import { contextFor } from './router.js';
import { getProvider } from './provider.js';
import { getCountryLanguage, translateQuestion, translateAnswer, translateBasedOn } from './i18n.js';

export const SAMPLE_LINE = "Answers come from configured rules and this scenario's data, not a live model.";

export const newAssistantState = () => ({
  open: false,
  history: [],
  draft: '',
  pending: null,
  why: {},
  last: null,
  c: null,
  focus: null,
  typewriterTimer: null,
  lang: 'en',
  askScreen: null,
});

export const stateOf = (app) => (app.assistant ||= newAssistantState());

/** Clears any active typewriter interval and reveals the full text immediately. */
export function finishTypewriter(app, api) {
  const st = stateOf(app);
  if (st.typewriterTimer) {
    clearInterval(st.typewriterTimer);
    st.typewriterTimer = null;
  }
  const last = st.history.at(-1);
  if (last && last.typing) {
    last.typing = false;
    last.typed = (last.res?.text || '').length;
    if (api) api.render();
  }
}

function shouldAnimateTypewriter() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const flag = params.get('typewriter');
  if (flag === 'off' || flag === '0') return false;
  if (flag === 'normal' || flag === 'on' || flag === '1') return true;
  // In automated Playwright sweeps over file:// without query parameter, skip animation
  if (typeof navigator !== 'undefined' && navigator.webdriver && location.protocol === 'file:' && !flag) return false;
  return true;
}

function startTypewriter(app, api, item) {
  const st = stateOf(app);
  if (!shouldAnimateTypewriter()) {
    item.typing = false;
    item.typed = (item.res?.text || '').length;
    st.history.push(item);
    api.render();
    return;
  }

  item.typing = true;
  item.typed = 0;
  st.history.push(item);
  api.render();

  const lang = st.lang || 'en';
  const fullText = lang !== 'en' ? translateAnswer(item.res?.text || '', lang) : (item.res?.text || '');
  // Balanced typing speed: ~25ms per character, so every character is distinctly seen
  const stepMs = Math.max(20, Math.min(32, Math.floor(2500 / Math.max(1, fullText.length))));
  let idx = 0;

  st.typewriterTimer = setInterval(() => {
    if (app.assistant !== st || !item.typing) {
      clearInterval(st.typewriterTimer);
      st.typewriterTimer = null;
      return;
    }
    idx += 1;
    item.typed = idx;
    const spans = document.querySelectorAll('.as-tw-text');
    spans.forEach((span) => {
      span.textContent = fullText.slice(0, idx);
    });
    const logs = [document.getElementById('as-log'), document.getElementById('chat')];
    logs.forEach((log) => {
      if (log) log.scrollTop = log.scrollHeight;
    });

    if (idx >= fullText.length) {
      clearInterval(st.typewriterTimer);
      st.typewriterTimer = null;
      item.typing = false;
      item.typed = fullText.length;
      api.render();
    }
  }, stepMs);
}

/** Updates the context for this render. The Ask page reuses the last screen's context. */
export function syncContext(app, ctx, route, persona) {
  const st = stateOf(app);
  const c = contextFor(ctx, route, persona, st.last);
  if (route.name !== 'ask' && ctx) st.last = c;
  st.c = c;
  return c;
}

const delayFor = (q) => {
  let h = 0;
  for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) >>> 0;
  return 150 + (h % 151); // 150ms to 300ms quick thinking indicator
};

/** Sends a question. The reply appears after a short typing indicator, 150 to 300 ms, the same each time. */
export function submit(ctx, app, api, q, intent) {
  const st = stateOf(app);
  finishTypewriter(app, api);
  const text = String(q || '').trim().slice(0, 200);
  if (!text || st.pending) return false;
  const c = st.c;
  const started = Date.now();
  st.pending = { q: text };
  st.draft = '';
  api.render();
  getProvider(app).answer(ctx, text, c, { intent }).then((res) => {
    const wait = Math.max(0, delayFor(text) - (Date.now() - started));
    setTimeout(() => {
      if (app.assistant !== st) return;
      st.pending = null;
      if (res.go) {
        st.history.push({ q: text, res, screen: c.screen, persona: c.persona });
        st.open = false;
        st.focus = 'launcher';
        api.navigate(res.go);
        return;
      }
      startTypewriter(app, api, { q: text, res, screen: c.screen, persona: c.persona });
    }, wait);
  });
  return true;
}

function renderMessage(ctx, st, item, i) {
  const r = item.res;
  const lang = st.lang || 'en';
  const ansText = lang !== 'en' ? translateAnswer(r.text, lang) : r.text;
  const basedText = lang !== 'en' ? translateBasedOn(r.basedOn, lang) : (r.basedOn ? `Based on: ${r.basedOn}` : '');

  if (item.typing) {
    const fullText = lang !== 'en' ? translateAnswer(r.text || '', lang) : (r.text || '');
    const typedText = fullText.slice(0, item.typed || 0);
    return `<div class="msg me"><small>You</small><div class="bubble">${esc(item.q)}</div></div>
      <div class="msg ai" data-typing role="status"><small>AI Assistor</small>
        <div class="bubble as-typewriter" data-act="as-skip-type" title="Click to reveal all"><span class="as-tw-text">${esc(typedText)}</span><span class="as-cursor" aria-hidden="true"></span></div>
      </div>`;
  }
  const links = (r.links || []).map((l) => `<a class="btn secondary sm" href="${esc(l.href)}" data-act="as-link">${esc(l.label)}</a>`).join('');
  const why = r.refusal ? `
    <button class="btn text sm" data-act="as-why" data-i="${i}" aria-expanded="${!!st.why[i]}" aria-controls="as-why-${i}">Why can't you answer that?</button>
    ${st.why[i] ? `<div class="guardrail" id="as-why-${i}" data-why>${icon('shield', 20)}<span><b>Guardrail ${esc(r.refusal.guardrailId)}.</b> ${esc(ctx.t(ctx.industry.assistantAnswers.guardrailWhy))} ${esc(r.refusal.guardrailText)}</span></div>` : ''}` : '';
  return `<div class="msg me"><small>You</small><div class="bubble">${esc(item.q)}</div></div>
    <div class="msg ai"><small>AI Assistor</small><div class="bubble" data-answer>${esc(ansText)}</div>
      ${basedText ? `<p class="based" data-based>${esc(basedText)}</p>` : ''}
      ${links ? `<div class="btn-row">${links}</div>` : ''}${why}</div>`;
}

/** The conversation, shared by the sheet and the Ask page. */
export function renderLog(ctx, app) {
  const st = stateOf(app);
  const msgs = st.history.map((item, i) => renderMessage(ctx, st, item, i)).join('');
  const typing = st.pending ? `<div class="msg me"><small>You</small><div class="bubble">${esc(st.pending.q)}</div></div>
    <div class="msg ai" role="status"><small>AI Assistor</small><div class="bubble typing" data-typing>AI Assistor is typing<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div></div>` : '';
  return msgs + typing;
}

export function renderChips(ctx, app, attrs = 'data-act="ask-q"') {
  const st = stateOf(app);
  const c = st.c;
  const lang = st.lang || 'en';
  return suggestionsFor(ctx, c).map((s) => {
    const label = translateQuestion(s.q, lang);
    return `<button class="chip-q" ${attrs} data-intent="${esc(s.intent)}" data-q="${esc(s.q)}">${esc(label)}</button>`;
  }).join('');
}

/** Launcher and sheet. Rendered inside the phone frame on every screen except the Ask page. */
export function renderAssistant(app, ctx, route) {
  if (app.assistantEnabled === false) return '';
  const st = stateOf(app);
  const setup = !ctx;
  if (route.name === 'ask' && ctx) return '';
  const label = setup ? 'About this demo' : 'Ask AI';
  const launcher = `<button class="as-launcher" id="as-launcher" data-act="as-open" aria-haspopup="dialog" aria-expanded="${st.open}">${icon('ask', 20)}<span>${label}</span></button>`;
  if (!st.open) return launcher;
  const chips = setup ? suggestionsFor(null, { screen: 'setup' }).map((s) => `<button class="chip-q" data-act="as-q" data-intent="${esc(s.intent)}" data-q="${esc(s.q)}">${esc(s.q)}</button>`).join('') : renderChips(ctx, app, 'data-act="as-q"');
  const hasLog = st.history.length || st.pending;
  const intro = hasLog ? '' : `<p class="small muted as-intro">${setup ? 'Ask what this demo is. Pick a question or type your own.' : 'Ask about what is on this screen. Pick a question or type your own.'}</p>`;
  
  const countryLang = getCountryLanguage(ctx?.country?.id);
  const showLang = countryLang.code !== 'en';
  const curLang = st.lang || 'en';
  const langToggle = showLang ? `
    <div class="as-lang-bar" role="group" aria-label="Language">
      <button class="pill-btn sm ${curLang === 'en' ? 'active' : ''}" data-act="as-set-lang" data-lang="en">EN</button>
      <button class="pill-btn sm ${curLang === countryLang.code ? 'active' : ''}" data-act="as-set-lang" data-lang="${countryLang.code}">${countryLang.code.toUpperCase()}</button>
    </div>` : '';

  return `${launcher}
  <div class="as-backdrop" data-act="as-close" aria-hidden="true"></div>
  <section class="as-sheet" role="dialog" aria-modal="true" aria-labelledby="as-title" data-region="assistant">
    <header class="as-head">
      <div>
        <div style="display:flex;align-items:center;gap:8px">
          <h2 id="as-title">${setup ? 'About this demo' : 'AI Assistor'}</h2>
          ${langToggle}
        </div>
        <small>${esc(SAMPLE_LINE)}</small>
      </div>
      <button class="icon-btn" data-act="as-close" id="as-close" aria-label="Close assistant">${icon('x', 20)}</button>
    </header>
    <div class="as-log" id="as-log" role="log" aria-live="polite" aria-label="Conversation">${intro}${renderLog(ctx || { t: (x) => x, industry: { assistantAnswers: { guardrailWhy: '' } } }, app)}</div>
    <details class="as-suggest" open><summary>Suggested questions</summary><div class="chips-q">${chips}</div></details>
    <form class="as-composer" onsubmit="return false">
      <label class="sr-only" for="as-input">Your question</label>
      <input class="input" id="as-input" type="text" maxlength="200" autocomplete="off" placeholder="Type a question" data-input="as-draft" value="${esc(st.draft)}">
      <button class="btn primary" data-act="as-send" id="as-send">Ask</button>
    </form>
  </section>`;
}

/** After each render: apply pending focus, keep the newest message in view, position the launcher. */
export function afterRender(app) {
  const st = stateOf(app);
  const inner = document.getElementById('root');
  if (inner) {
    const chrome = inner.querySelector('.dock') || inner.querySelector('.tabs') || inner.querySelector('.setup-foot');
    if (chrome) inner.style.setProperty('--as-bottom', `${Math.round(inner.getBoundingClientRect().bottom - chrome.getBoundingClientRect().top + 12)}px`);
  }
  const log = document.getElementById('as-log') || document.getElementById('chat');
  if (log && st.history.length) log.querySelector('.msg:last-child')?.scrollIntoView({ block: 'nearest' });
  if (st.focus === 'launcher') document.getElementById('as-launcher')?.focus({ preventScroll: true });
  else if (st.focus === 'input') document.getElementById('as-input')?.focus({ preventScroll: true });
  st.focus = null;
}

/** Keyboard: Escape closes, Tab stays inside the sheet. Returns true when the event was handled. */
export function onKeydown(app, e, api) {
  const st = app.assistant;
  if (!st?.open) return false;
  if (e.key === 'Escape') { e.preventDefault(); finishTypewriter(app, api); st.open = false; st.focus = 'launcher'; api.render(); return true; }
  if (e.key === 'Tab') {
    const sheet = document.querySelector('.as-sheet');
    if (!sheet) return false;
    const items = [...sheet.querySelectorAll('button, a[href], input, summary, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null);
    if (!items.length) return false;
    const first = items[0];
    const last = items.at(-1);
    if (e.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { e.preventDefault(); last.focus(); return true; }
    if (!e.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { e.preventDefault(); first.focus(); return true; }
  }
  return false;
}

export const assistantActions = {
  'as-open': ({ app }) => { const st = stateOf(app); st.open = true; st.focus = 'input'; },
  'as-close': ({ app, api }) => { finishTypewriter(app, api); const st = stateOf(app); st.open = false; st.focus = 'launcher'; },
  'as-q': ({ ctx, app, api, data }) => submit(ctx, app, api, data.q, data.intent),
  'ask-q': ({ ctx, app, api, data }) => submit(ctx, app, api, data.q, data.intent),
  'as-send': ({ ctx, app, api }) => { const st = stateOf(app); if (!submit(ctx, app, api, document.getElementById('as-input')?.value ?? st.draft)) return false; st.focus = 'input'; },
  'ask-free': ({ ctx, app, api }) => submit(ctx, app, api, document.getElementById('ask-input')?.value ?? stateOf(app).draft),
  'as-draft': ({ app, value }) => { stateOf(app).draft = value.slice(0, 200); return false; },
  'ask-draft': ({ app, value }) => { stateOf(app).draft = value.slice(0, 200); return false; },
  'as-why': ({ app, data }) => { const st = stateOf(app); st.why[data.i] = !st.why[data.i]; },
  'as-link': ({ app, api, el }) => { finishTypewriter(app, api); const st = stateOf(app); st.open = false; st.focus = null; api.navigate(el.getAttribute('href')); return 'nav'; },
  'as-skip-type': ({ app, api }) => finishTypewriter(app, api),
  'as-set-lang': ({ app, api, data }) => { const st = stateOf(app); st.lang = data.lang; api.render(); },
  'as-screen-faq': ({ app, api, data }) => { const st = stateOf(app); st.askScreen = data.screen; api.render(); },
};
