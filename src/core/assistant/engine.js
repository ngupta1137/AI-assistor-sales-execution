// The answer engine. Rule-based, grounded in generated data and live app state, deterministic.
// Flow: guardrail check, normalise the question into generic words, detect the intent
// (phrase and word scoring plus the current screen), run the handler, then apply the pack's
// vocabulary and the country's spelling. An answer always says what it is based on.

import H, { ABOUT, ABOUT_QUESTIONS } from './handlers.js';
import { INTENTS } from './intents.js';
import { check } from './guard.js';
import { assistantPersona } from './router.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Turns the pack's own words into the generic ones the catalogue uses. */
export function normalise(ctx, question) {
  let s = ` ${String(question).toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ').trim()} `;
  const v = ctx?.industry?.vocab || {};
  const map = [
    [v.accounts, 'account'], [v.account, 'account'], [v.contacts, 'contact'], [v.contact, 'contact'],
    [v.reps, 'rep'], [v.rep, 'rep'], [v.manager, 'manager'], [v.kam, 'kam'], [v.offerings, 'offering'], [v.offering, 'offering'],
    [v.orders, 'order'], [v.order, 'order'], [v.visits, 'visit'], [v.visit, 'visit'],
    ['accounts', 'account'], ['contacts', 'contact'], ['reps', 'rep'], ['offerings', 'offering'], ['orders', 'order'], ['visits', 'visit'], ['proposals', 'order'], ['proposal', 'order'],
  ].filter(([from]) => from).map(([from, to]) => [from.toLowerCase(), to]).sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of map) s = s.replace(new RegExp(`(?<= )${esc(from)}(?= )`, 'g'), to);
  return s.trim();
}

const hasWord = (tokens, w) => tokens.some((t) => t === w || (w.length >= 5 && t.startsWith(w)));

/** @returns {{id: string, score: number} | null} */
export function detectIntent(ctx, question, c) {
  const s = normalise(ctx, question);
  const tokens = s.split(' ');
  let best = null;
  INTENTS.forEach((it, order) => {
    if (it.id.startsWith('about.') && c.screen !== 'setup') return;
    if (!it.id.startsWith('about.') && c.screen === 'setup') return;
    const base = it.phrases.filter((p) => s.includes(p)).length * 3 + it.words.filter((w) => hasWord(tokens, w)).length;
    if (!base) return;
    const score = base + (it.screens.includes(c.screen) ? 1 : 0);
    if (score < 2) return;
    if (!best || score > best.score) best = { id: it.id, score, order };
  });
  return best;
}

/** Suggested questions for the current screen and persona, with tokens resolved. */
export function suggestionsFor(ctx, c) {
  if (c.screen === 'setup') return ABOUT_QUESTIONS;
  const key = assistantPersona(c.persona);
  const other = key === 'rep' ? 'manager' : 'rep';
  const map = ctx.industry.assistantContext?.[c.screen];
  const list = map?.[key] || map?.[other];
  if (list?.length) return list.map((x) => ({ q: ctx.t(x.q), intent: x.intent }));
  return (ctx.industry.assistant || []).slice(0, 4).map((x, i) => ({ q: ctx.t(x.q), intent: `qa:${i}` }));
}

/** What the assistant can answer here, for the fallback message. */
const canAnswer = (ctx, c) => suggestionsFor(ctx, c).slice(0, 4).map((x) => `"${x.q}"`).join(', ');

function pickFocus(ctx, c) {
  const a = ctx.data.byId[c.accountId] || ctx.data.byId[(ctx.m.nextAccount(null) || ctx.data.planned[0]).accountId];
  return { name: a.name, person: a.contacts[0].name, area: a.area, city: a.city };
}

function run(ctx, c, id) {
  if (id.startsWith('answer:')) {
    const key = id.slice(7);
    const tpl = ctx.industry.assistantAnswers?.[key];
    if (!tpl) return null;
    return { text: ctx.t(tpl, pickFocus(ctx, c)), basedOn: `${ctx.industry.name} pack guidance, ${ctx.data.city.name} territory`, links: [] };
  }
  if (id.startsWith('qa:')) {
    const item = ctx.industry.assistant?.[Number(id.slice(3))];
    return item ? { text: ctx.t(item.a), basedOn: `prepared ${ctx.industry.name} answers`, links: [] } : null;
  }
  return H[id] ? H[id](ctx, c) : null;
}

const actor = (ctx, c) => (c.persona === 'manager' ? ctx.data.manager : c.persona === 'admin' ? ctx.data.admin : ctx.data.rep).name;

const finish = (ctx, r) => ({
  ...r,
  text: ctx.t(r.text),
  basedOn: ctx.t(r.basedOn || ''),
  links: (r.links || []).map((l) => ({ ...l, label: ctx.t(l.label) })),
});

/**
 * Answers one question. Never throws: an unexpected failure is reported as an error result,
 * and tests assert it never happens for suggested questions.
 * @param {object} ctx  app context
 * @param {string} question
 * @param {object} c    context object { screen, persona, accountId?, ... }
 * @param {{intent?: string}} [opts]  a forced intent, used by suggested questions
 */
export function answer(ctx, question, c, opts = {}) {
  const q = String(question || '').trim().slice(0, 300);
  if (c.screen === 'setup' || !ctx) {
    const found = opts.intent || detectIntent({ industry: { vocab: {} }, t: (x) => x }, q, c)?.id;
    const a = ABOUT[found];
    return a ? { intent: found, ...a, links: [] } : { intent: null, fallback: true, text: 'I can answer three things here: what AI Assistor is, whether the data is real, and how it changes for an industry. Pick one of the suggested questions.', basedOn: 'the setup screen', links: [] };
  }
  try {
    const refusal = check(ctx, q);
    if (refusal) {
      ctx.m.logAudit(actor(ctx, c), `Assistant declined a question (${c.persona}, ${c.screen} screen). Guardrail ${refusal.guardrailId}. Question: "${q.slice(0, 80)}"`);
      return { intent: 'refusal', text: refusal.text, basedOn: 'the guardrails of this pack', links: [], refusal: { guardrailId: refusal.guardrailId, guardrailText: refusal.guardrailText } };
    }
    const id = opts.intent || detectIntent(ctx, q, c)?.id;
    const raw = id ? run(ctx, c, id) : null;
    if (raw) return { intent: id, ...finish(ctx, raw) };
    return {
      intent: null,
      fallback: true,
      text: ctx.t(`I do not have an answer for that on this screen. On this screen I can answer questions such as ${canAnswer(ctx, c)}.`),
      basedOn: 'the questions this assistant is configured for',
      links: [],
    };
  } catch (e) {
    return { intent: null, error: String(e && e.message), text: 'I could not work that out from the data on this screen.', basedOn: 'nothing, an error occurred', links: [] };
  }
}
