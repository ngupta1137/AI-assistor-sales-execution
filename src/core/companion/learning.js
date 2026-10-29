// Learning: knowledge base search and a rule-based chatbot. The chatbot reuses the assistant's
// normaliser and guardrail check, then answers only from this pack's knowledge base, learning
// modules and certification tracker. It never invents an answer and refuses restricted claims.

import { normalise } from '../assistant/engine.js';
import { checkRequest } from './claims.js';

const STOP = new Set(['what', 'when', 'where', 'which', 'with', 'that', 'this', 'have', 'does', 'from', 'about', 'should', 'would', 'could', 'there', 'their', 'your', 'into', 'how', 'the', 'and', 'for', 'are', 'can', 'any', 'you', 'its', 'not', 'need', 'make', 'much', 'many', 'long']);
const words = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w));
const stem = (w) => w.replace(/(ing|ed|es|s)$/, '');

const entryText = (ctx, e) => ({ title: ctx.t(e.title), text: ctx.t(e.text) });

/** Knowledge entries ranked for a query. Title words count double. */
export function searchKnowledge(ctx, query) {
  const q = new Set(words(normalise(ctx, query)).map(stem));
  if (!q.size) return ctx.industry.companion.knowledge.map((e) => ({ e, score: 0 }));
  return ctx.industry.companion.knowledge.map((e) => {
    const { title, text } = entryText(ctx, e);
    const tw = new Set(words(title).map(stem)); const bw = new Set(words(text).map(stem));
    let score = 0;
    for (const w of q) { if (tw.has(w)) score += 2; else if (bw.has(w)) score += 1; }
    return { e, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
}

const actor = (ctx) => (ctx.persona === 'manager' ? ctx.data.manager : ctx.persona === 'admin' ? ctx.data.admin : ctx.data.rep).name;

/** @returns {{text: string, basedOn: string, links: {label: string, href: string}[], refusal?: {guardrailId: string, guardrailText: string}, fallback?: boolean}} */
export function askLearning(ctx, question) {
  const q = String(question || '').trim().slice(0, 200);
  const refusal = checkRequest(ctx, q);
  if (refusal) {
    ctx.m.logAudit(actor(ctx), `Learning chatbot declined a question (${ctx.persona}, companion screen). Guardrail ${refusal.guardrailId}. Question: "${q.slice(0, 80)}"`);
    return { text: refusal.text, basedOn: 'the guardrails of this pack', links: [], refusal: { guardrailId: refusal.guardrailId, guardrailText: refusal.guardrailText } };
  }
  const { comp, cm, fmt } = ctx;
  const norm = normalise(ctx, q);
  const found = searchKnowledge(ctx, q);
  const best = found[0];
  const certs = /\b(renew|renewal|due|expire|expiry|certif|accredit|licen|valid)/.test(norm);
  const progress = /\b(progress|module|course|learned|completed|my training)/.test(norm);
  if (certs && (!best || best.score < 4)) {
    const flagged = comp.certs.filter((c) => c.dueIn <= 30).sort((a, b) => a.dueIn - b.dueIn);
    const list = flagged.map((c) => `${ctx.t(c.label)} (${c.dueIn < 0 ? `overdue by ${-c.dueIn} days` : `due in ${c.dueIn} days`})`);
    return {
      text: flagged.length ? `${flagged.length} renewal${flagged.length === 1 ? '' : 's'} due within 30 days or overdue: ${list.join('; ')}. Start a renewal from the certification tracker.` : 'No renewal is due within 30 days.',
      basedOn: `the certification tracker, ${comp.certs.length} certifications`, links: [{ label: 'Open the certification tracker', href: '#/companion/learning' }],
    };
  }
  if (progress && (!best || best.score < 4)) {
    const done = comp.modules.filter((m) => cm.moduleStatus(m.id) === 'done').length;
    const next = comp.modules.find((m) => cm.moduleStatus(m.id) !== 'done');
    return {
      text: `You have finished ${done} of ${comp.modules.length} learning modules.${next ? ` Next: ${ctx.t(next.title)} (${next.minutes} minutes).` : ' All are done.'}`,
      basedOn: `your learning modules, ${comp.modules.length} in this pack`, links: [{ label: 'Open the learning modules', href: '#/companion/learning' }],
    };
  }
  if (best && best.score >= 2) {
    const { title, text } = entryText(ctx, best.e);
    return { text, basedOn: `the knowledge base: "${title}"`, links: [{ label: 'Open the knowledge base', href: '#/companion/learning' }] };
  }
  const titles = ctx.industry.companion.knowledge.slice(0, 3).map((e) => `"${ctx.t(e.title)}"`).join(', ');
  void fmt;
  return { fallback: true, text: `I could not find that in the knowledge base. I can answer questions such as ${titles}, and about your certification renewals and learning progress.`, basedOn: 'the knowledge base and your certification tracker', links: [] };
}
