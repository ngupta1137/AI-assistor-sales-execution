// Provider adapter. `rule` is the default and the only one in the shipped build.
// `live` calls an endpoint you supply. It is compiled out unless the build sets ASSISTANT_LIVE=1,
// and even then it runs only when the page URL carries ?live=<https endpoint>.
// Never put an API key in this repository: the endpoint holds the key, the page does not.
// A live provider sends only the question, the screen context and the rule answer built from
// generated sample data. Guardrail refusals are applied before the call and to the reply.

import { answer as ruleAnswer } from './engine.js';
import { check } from './guard.js';

/* global __ASSISTANT_LIVE__ */
export const LIVE_ENABLED = typeof __ASSISTANT_LIVE__ !== 'undefined' && __ASSISTANT_LIVE__ === true;

const rule = { id: 'rule', answer: async (ctx, question, c, opts) => ruleAnswer(ctx, question, c, opts) };

function live(endpoint) {
  return {
    id: 'live',
    async answer(ctx, question, c, opts) {
      const base = ruleAnswer(ctx, question, c, opts);
      if (base.refusal) return base;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            marker: 'ai-assistor-live-provider',
            question: String(question).slice(0, 300),
            context: { screen: c.screen, persona: c.persona, industry: ctx.industry.id, country: ctx.country.id },
            facts: { answer: base.text, basedOn: base.basedOn },
          }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const body = await res.json();
        const text = String(body.text || '').slice(0, 1200);
        if (!text) throw new Error('empty reply');
        const blocked = check(ctx, text);
        if (blocked) return { ...base, text: blocked.text, refusal: { guardrailId: blocked.guardrailId, guardrailText: blocked.guardrailText } };
        return { ...base, text, live: true };
      } catch {
        return { ...base, text: `${base.text} (The live model could not be reached, so this answer comes from the built-in rules.)` };
      }
    },
  };
}

export function getProvider(app) {
  // The condition is written out here so the bundler folds it to false and drops live() from the shipped build.
  if (typeof __ASSISTANT_LIVE__ !== 'undefined' && __ASSISTANT_LIVE__ === true && app.liveEndpoint) return live(app.liveEndpoint);
  return rule;
}
