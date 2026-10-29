// Restricted-claim control for everything the Companion writes: pitch, value story, knowledge answers.
// A pack lists blocked patterns in companion.guardrails. A pitch or story that contains one is withheld,
// and a request for one gets a refusal. The assistant's refusal patterns apply too.

import { check as assistantCheck } from '../assistant/guard.js';

/** Patterns no pack may allow in Companion content: promises and results claims. */
export const COMMON_BLOCKED = ['guarantee', 'will double', 'will boost', 'risk free', 'proven to'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hit = (text, p) => new RegExp(`(^|[^a-z0-9])${esc(p.toLowerCase())}`).test(text);
const clean = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ');

export function blockedPatterns(ctx) {
  return [...COMMON_BLOCKED, ...ctx.industry.companion.guardrails.flatMap((g) => g.blocked)];
}

/** Patterns found in a piece of text. */
export function claimHits(ctx, text) {
  const t = clean(text);
  return blockedPatterns(ctx).filter((p) => hit(t, p));
}

/**
 * Checks what a person asks for or types. Returns a refusal or null.
 * @returns {null | {text: string, guardrailId: string, guardrailText: string}}
 */
export function checkRequest(ctx, text) {
  const t = clean(text);
  for (const g of ctx.industry.companion.guardrails) {
    if (g.blocked.some((p) => hit(t, p))) {
      return { text: `${ctx.t(g.text)} I cannot write or answer that.`, guardrailId: g.id, guardrailText: ctx.t(g.text) };
    }
  }
  const common = COMMON_BLOCKED.find((p) => hit(t, p));
  if (common) {
    return { text: 'I cannot promise or predict results. All numbers here are sample data, and nothing in the Companion claims a result.', guardrailId: 'sample-data', guardrailText: 'The Companion runs on sample data and never promises or predicts results.' };
  }
  const a = assistantCheck(ctx, text);
  return a ? { text: a.text, guardrailId: a.guardrailId, guardrailText: a.guardrailText } : null;
}

/** Withholds text that contains a restricted claim. A safety net: authored templates are tested to be clean. */
export function safe(ctx, text) {
  const hits = claimHits(ctx, text);
  return hits.length ? { text: 'Withheld: this point matched a restricted claim. Use approved material only.', withheld: true, hits } : { text, withheld: false, hits };
}
