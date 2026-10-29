// R9 Ask AI: the pack's questions with prepared answers, plus a free-text box that answers
// from this territory's generated data. Rule-based in the prototype, and it says so.

import { esc, icon } from '../ui.js';

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'to', 'of', 'i', 'my', 'do', 'what', 'which', 'how', 'can', 'this', 'on', 'for', 'in', 'should', 'it', 'me', 'why', 'does', 'with', 'at', 'be']);
const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

/** Answers a free-text question from pack Q&A first, then from today's data. */
export function answer(ctx, question) {
  const { t, fmt, data, industry, m } = ctx;
  const q = question.toLowerCase();
  const first = data.planned.slice().sort((a, b) => a.rank - b.rank)[0];
  const firstAcc = data.byId[first.accountId];
  if (/first|top|priority|start|most important/.test(q)) {
    const top = first.actions[0];
    return t(`${firstAcc.name} is first. It has ${fmt.money(first.opportunity)} at stake across ${first.actions.length} actions. The top action is "${t(top.title, top.vars)}" because: ${t(top.saw, top.vars)}`);
  }
  if (/not (been )?(seen|visited)|overdue|longest|coverage|neglect/.test(q)) {
    const gap = data.accounts.filter((a) => a.tier === 'A').sort((a, b) => b.lastVisitDays - a.lastVisitDays).slice(0, 3);
    return t(`Tier A {accounts} with the longest gap: ${gap.map((a) => `${a.name} (${a.lastVisitDays} days)`).join(', ')}.`);
  }
  if (/target|achiev|month|kpi/.test(q)) {
    const k = industry.kpis[0];
    return t(`Month to date: ${fmt.money(data.territory.achieved + m.selfStats().value)} of ${fmt.money(data.territory.target)}. ${t(k.label)} is ${data.territory.headlineKpi.value}${k.format === 'pct' ? '%' : ''} against a target of ${k.target}${k.format === 'pct' ? '%' : ''}.`);
  }
  const qw = words(q);
  let best = null;
  let bestScore = 0;
  for (const item of industry.assistant) {
    const score = words(t(item.q)).filter((w) => qw.includes(w)).length;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  if (best && bestScore >= 2) return t(best.a);
  return t('I can answer questions about today\'s plan, coverage gaps, targets and the guardrails for your {accounts}. Try one of the questions above.');
}

export function render(ctx) {
  const { t, industry, ui } = ctx;
  const chat = ui.chat || [];
  const qs = industry.assistant.map((x, i) => `<button class="chip-q" data-act="ask-q" data-i="${i}">${esc(t(x.q))}</button>`).join('');
  const log = chat.map((c) => `<div class="msg me">${esc(c.q)}</div><div class="msg ai" data-answer>${icon('agent', 16)} <span>${esc(c.a)}</span></div>`).join('');
  return `
  <a class="back" href="#/today">${icon('back', 18)} Today</a>
  <section class="hello">
    <h1>Ask AI</h1>
    <p class="muted">Answers come from this demo's sample data and the configured guidance. Rule-based in the prototype.</p>
  </section>
  <div class="chips-q">${qs}</div>
  <div class="chat" id="chat">${log}</div>
  <form class="ask-row" data-ask-form onsubmit="return false">
    <input class="input" id="ask-input" type="text" maxlength="200" placeholder="${esc(t('Ask about today\'s {accounts}'))}">
    <button class="btn primary" data-act="ask-free" id="ask-send">Ask</button>
  </form>
  <p class="foot-note">Sample data. The assistant never gives clinical, credit, pricing or agronomic advice.</p>`;
}

export const actions = {
  'ask-q': ({ ctx, data }) => {
    const item = ctx.industry.assistant[Number(data.i)];
    ctx.ui.chat = [...(ctx.ui.chat || []), { q: ctx.t(item.q), a: ctx.t(item.a) }].slice(-8);
  },
  'ask-free': ({ ctx }) => {
    const input = document.getElementById('ask-input');
    const q = (input?.value || '').trim().slice(0, 200);
    if (!q) return false;
    ctx.ui.chat = [...(ctx.ui.chat || []), { q, a: answer(ctx, q) }].slice(-8);
  },
};

export function mounted(ctx) {
  if (ctx?.ui.chat?.length) { const sc = document.getElementById('screen'); if (sc) sc.scrollTop = sc.scrollHeight; }
}
