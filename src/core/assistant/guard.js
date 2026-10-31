// Guardrails for the assistant. A question that asks for something outside scope gets a refusal in
// plain language, the allowed alternative, and a "Why can't you answer that?" explanation that
// names the guardrail. Refusal patterns come from the pack (assistantRefusals) plus a common set.

/** Patterns every pack gets: no promises of results, no performance claims. */
export const COMMON_REFUSALS = [
  {
    id: 'sample-data',
    guardrail: 'sample-data',
    patterns: ['guarantee', 'promise me', 'will i hit', 'will we hit', 'will i make', 'how much will i sell', 'how much more will', 'double my', 'predict my sales', 'forecast my sales', 'what results will', 'prove the roi', 'roi of this'],
    refusal: 'I cannot promise or predict results. All numbers here are demonstration data, and no result is claimed before a pilot against matched control territories.',
    allowed: 'I can show the estimate for an action and how it was worked out.',
  },
];

const SAMPLE_GUARDRAIL = 'This prototype runs on demonstration data and never promises or predicts results. Impact is measured in a pilot against matched control territories.';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matches = (text, pattern) => new RegExp(`(^|[^a-z0-9])${esc(pattern.toLowerCase())}`).test(text);

/** @returns {null | {text: string, guardrailId: string, guardrailText: string}} */
export function check(ctx, question) {
  const q = question.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ');
  const all = [...(ctx.industry.assistantRefusals || []), ...COMMON_REFUSALS];
  for (const r of all) {
    if (!r.patterns.some((p) => matches(q, p))) continue;
    const g = ctx.industry.guardrails.find((x) => x.id === r.guardrail);
    return {
      text: `${ctx.t(r.refusal)} ${ctx.t(r.allowed)}`,
      guardrailId: r.guardrail,
      guardrailText: g ? ctx.t(g.text) : SAMPLE_GUARDRAIL,
    };
  }
  return null;
}
