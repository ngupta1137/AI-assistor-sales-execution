// R9 Ask AI: the full-page view of the same conversation the floating assistant shows.
// All answer logic lives in src/core/assistant/. This screen only renders it.

import { esc, icon } from '../ui.js';
import { renderLog, stateOf, assistantActions } from '../assistant/ui.js';
import { suggestionsFor } from '../assistant/engine.js';

export function render(ctx) {
  const { t, app } = ctx;
  const st = stateOf(app);
  const list = suggestionsFor(ctx, st.c);
  const chip = (s) => `<button class="chip-q" data-act="ask-q" data-intent="${esc(s.intent)}" data-q="${esc(s.q)}">${esc(s.q)}</button>`;
  const hasLog = st.history.length || st.pending;
  const html = `
  <a class="back" href="#/today">${icon('back', 18)} Today</a>
  <section class="page-head">
    <h1>Ask AI</h1>
    <p class="small muted">Sample data. Answers come from configured rules and this scenario's data, not a live model. Same conversation as the Ask button on every screen.</p>
  </section>
  <div class="chat" id="chat"${hasLog ? '' : ' hidden'} role="log" aria-live="polite">${renderLog(ctx, app)}</div>
  <section class="ask-faqs">
    <h2 class="small" style="margin-bottom:8px">Frequently Asked Questions</h2>
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
