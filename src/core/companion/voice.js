// Voice debrief parser. Rule-based, a simulation: it turns text (typed, dictated, or the sample)
// into structured fields (outcome, issues, follow-ups, order intent) for the rep to confirm.
// It is not a speech or language model, and the screen says so.

import { normalise } from '../assistant/engine.js';

const POSITIVE = ['went well', 'agreed', 'happy', 'pleased', 'signed', 'will reorder', 'keen', 'positive', 'interested', 'confirmed', 'great', 'good meeting', 'on board'];
const NEGATIVE = ['declined', 'refused', 'unhappy', 'complain', 'cancel', 'not interested', 'angry', 'upset', 'lost', 'went badly', 'rejected'];
const ISSUE = ['issue', 'problem', 'out of stock', 'missing', 'late', 'delay', 'broken', 'damaged', 'error', 'empty', 'faulty', 'concern', 'blocked', 'stuck', 'wrong'];
const FOLLOW = ['follow up', 'follow-up', 'call back', 'send', 'remind', 'check with', 'book', 'schedule', 'revisit', 'return', 'come back', 'email', 'confirm by'];
const ORDER = ['order', 'reorder', 'restock', 'top up', 'stock up'];
const NEGATED_ORDER = ['no order', 'not order', 'will not order', 'wont order', "won't order", 'did not order', 'no reorder'];
const WHEN = /(next week|tomorrow|today|this week|on (?:mon|tues|wednes|thurs|fri|satur|sun)day|by (?:mon|tues|wednes|thurs|fri|satur|sun)day|next (?:mon|tues|wednes|thurs|fri|satur|sun)day|in \d+ (?:days|weeks))/i;

const split = (text) => String(text).split(/[.!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 2);
const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** True if any phrase starts at a word boundary, so "happy" does not match "unhappy". */
const has = (s, list) => list.some((w) => new RegExp(`(^|[^a-z0-9])${esc(w)}`).test(s));

/**
 * @returns {{outcome: {label: 'Positive'|'Neutral'|'Negative', evidence: string[]}, issues: string[], followUps: {text: string, when: string}[], order: {intent: boolean, lines: string[], evidence: string}, sentences: number}}
 */
export function parseDebrief(ctx, text) {
  const raw = split(text);
  const norm = raw.map((s) => normalise(ctx, s));
  let pos = 0; let neg = 0;
  const posEv = []; const negEv = [];
  const issues = []; const followUps = [];
  let orderEv = '';
  let orderIntent = false;
  raw.forEach((s, i) => {
    const n = norm[i];
    const lower = s.toLowerCase();
    if (has(n, POSITIVE)) { pos++; posEv.push(s); }
    if (has(n, NEGATIVE)) { neg++; negEv.push(s); }
    if (has(n, ISSUE) && !has(n, ['no issue', 'no problem'])) issues.push(s);
    if (has(n, FOLLOW)) followUps.push({ text: s, when: (WHEN.exec(s) || [''])[0] });
    if (has(n, ORDER)) {
      if (has(n, NEGATED_ORDER) || /\bnot\b.*\border\b/.test(n)) { orderIntent = false; orderEv = s; } else { orderIntent = true; orderEv = s; }
    }
    void lower;
  });
  const lines = [];
  for (const o of ctx.industry.offerings) {
    const name = ctx.t(o.name).toLowerCase();
    const first = name.split(/\s+/)[0];
    if (norm.join(' ').includes(name) || (first.length >= 5 && norm.join(' ').includes(first))) lines.push(ctx.t(o.name));
  }
  const label = pos > neg ? 'Positive' : neg > pos ? 'Negative' : 'Neutral';
  return {
    outcome: { label, evidence: label === 'Positive' ? posEv : label === 'Negative' ? negEv : [] },
    issues: [...new Set(issues)],
    followUps,
    order: { intent: orderIntent, lines: [...new Set(lines)].slice(0, 3), evidence: orderEv },
    sentences: raw.length,
  };
}

/** A sample dictation that works in any demo. Uses the account and its first suggested product. */
export function sampleDictation(ctx, acct) {
  const plan = ctx.m.plannedFor(acct.id);
  const prod = plan?.order[0] ? ctx.industry.offerings.find((o) => o.id === plan.order[0].offeringId) : ctx.industry.offerings[0];
  const person = acct.contacts[0].name;
  return ctx.t(`Visited ${acct.name} today. ${person} was happy with the changes and agreed to reorder next week. There is an issue: ${ctx.t(prod.name)} was out of stock for two days. Please follow up with the distributor by Friday. I will send the {order} draft tomorrow.`);
}
