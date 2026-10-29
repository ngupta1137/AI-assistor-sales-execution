// Shared structure for each pack's assistantContext: the questions every industry gets, written
// with vocabulary tokens so each pack reads in its own words. A pack adds its own questions with
// withBase(). Industry-specific wording lives in the pack's assistantAnswers and assistantRefusals.

const q = (text, intent) => ({ q: text, intent });

export const BASE = {
  today: { rep: [q('What should I do first?', 'today.first'), q('Why this order?', 'today.order'), q('What can wait?', 'today.wait'), q('How was the time budget used?', 'today.budget')] },
  brief: { rep: [q('Why is this action ranked first?', 'brief.whyfirst'), q('What did the agent compare against?', 'brief.compared'), q('How sure is it?', 'brief.sure'), q('What happens if I override?', 'brief.override'), q('What evidence is missing?', 'brief.evidence')] },
  account: { rep: [q('Summarize this {account}.', 'account.summary'), q('What changed since the last {visit}?', 'account.changed'), q('Which {offerings} are gaps?', 'account.gaps'), q('Who is the {contact}?', 'account.contact')] },
  action: { rep: [q('How was the value estimated?', 'action.value'), q('What evidence supports it?', 'action.evidence'), q('How long will it take?', 'action.effort'), q('What is the guardrail on this action?', 'action.guardrail')] },
  order: { rep: [q('Why these lines?', 'order.why'), q('What is blocking send?', 'order.blocking'), q('Which rule applies?', 'order.rule'), q('What changes if I edit a line?', 'order.edit')] },
  complete: { rep: [q('What should I log?', 'complete.log'), q('What carries to next time?', 'complete.carry'), q('What will my {manager} see?', 'complete.manager')] },
  route: { rep: [q('Why this sequence?', 'route.why'), q('What if I skip one?', 'route.skip'), q('What if I run late?', 'route.late')] },
  manager: { manager: [q('Which overrides need attention?', 'mgr.attention'), q('Which {reps} are drifting?', 'mgr.drift'), q('What should I coach?', 'mgr.coach'), q('What patterns are in the override reasons?', 'mgr.patterns')] },
  agents: {
    rep: [q('What does each agent do?', 'agents.what'), q('What can the agents not do?', 'agents.cannot'), q('What happens when I press stop?', 'agents.stop')],
    manager: [q('What does each agent do?', 'agents.what'), q('What can the agents not do?', 'agents.cannot'), q('What happens when I press stop?', 'agents.stop')],
  },
  config: {
    rep: [q('How is this configured?', 'config.explain'), q('Which words change in this pack?', 'config.vocab'), q('What changes by country?', 'config.country'), q('How do I add an industry?', 'config.add')],
    manager: [q('How is this configured?', 'config.explain'), q('Which words change in this pack?', 'config.vocab'), q('What changes by country?', 'config.country'), q('How do I add an industry?', 'config.add')],
  },
  problems: {
    rep: [q('Which problem maps to which capability?', 'problems.map'), q('How would a pilot measure this?', 'problems.prove'), q('How is this configured?', 'config.explain'), q('How do I add an industry?', 'config.add')],
    manager: [q('Which problem maps to which capability?', 'problems.map'), q('How would a pilot measure this?', 'problems.prove'), q('How is this configured?', 'config.explain'), q('How do I add an industry?', 'config.add')],
  },
};

/** Screens and personas every pack must cover, 4 to 6 questions each. */
export const REQUIRED = {
  rep: ['today', 'brief', 'account', 'action', 'order', 'complete', 'route', 'agents', 'config', 'problems'],
  manager: ['manager', 'agents', 'config', 'problems'],
};

/**
 * @param {Record<string, {rep?: {q: string, intent: string}[], manager?: {q: string, intent: string}[]}>} extras
 *   The pack's own questions, appended after the shared ones.
 */
export function withBase(extras = {}) {
  const out = {};
  for (const screen of new Set([...Object.keys(BASE), ...Object.keys(extras)])) {
    out[screen] = {};
    for (const persona of ['rep', 'manager']) {
      const merged = [...(BASE[screen]?.[persona] || []), ...(extras[screen]?.[persona] || [])];
      if (merged.length) out[screen][persona] = merged;
    }
  }
  return out;
}
