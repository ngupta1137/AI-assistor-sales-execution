// Small rendering helpers shared by screens. No industry nouns here: use tokens.

import { esc } from './text.js';
import { icon } from './icons.js';

export { esc, icon };

export const AGENT_LABEL = { planner: 'Visit Planner', gap: 'Gap agent', order: 'Order agent' };
export const EVIDENCE = {
  photo: { label: 'Photo', icon: 'camera' },
  signature: { label: 'Signature', icon: 'pen' },
  note: { label: 'Note', icon: 'note' },
  scan: { label: 'Scan', icon: 'scan' },
};
export const LEVELS = {
  1: 'Watches and reports only',
  2: 'Suggests. A person approves every item',
  3: 'Acts on routine items. A person approves the rest',
  4: 'Acts alone within set limits',
};
export const CAPABILITIES = {
  potential: { name: 'Account Potential', decides: 'Where effort goes' },
  gaps: { name: 'Gap Detection', decides: 'What is missing or wrong at each {account}' },
  ranking: { name: 'Action Ranking', decides: 'What to do first in each {visit}' },
  planning: { name: 'Visit Planning', decides: 'Which {accounts}, how often, in what order' },
  order: { name: '{Order} Suggestion', decides: 'What to suggest, and how much' },
  evidence: { name: 'Evidence and Learning', decides: 'Did it happen, and did it work' },
};

export function confidence(c) {
  const pct = Math.round(c * 100);
  if (c >= 0.8) return { label: 'High', tone: 'good', pct, text: `High confidence (${pct}%)` };
  if (c >= 0.65) return { label: 'Medium', tone: 'mid', pct, text: `Medium confidence (${pct}%)` };
  return { label: 'Low', tone: 'low', pct, text: `Low confidence (${pct}%). Check before acting.` };
}

export const pill = (text, tone = '') => `<span class="pill ${tone}">${esc(text)}</span>`;

export function kpiValue(k, v, fmt) {
  if (k.format === 'pct') return fmt.pct(v);
  if (k.format === 'money') return fmt.moneyShort(v);
  if (k.format === 'days') return `${fmt.number(v)} days`;
  return fmt.number(v);
}

export function kpiOk(k, v) { return k.lowerIsBetter ? v <= k.target : v >= k.target; }

export function bar(value, max, tone = '') {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return `<div class="bar ${tone}" role="img" aria-label="${Math.round(pct)} percent"><span style="width:${pct.toFixed(1)}%"></span></div>`;
}

export const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Za-zÀ-ž]/.test(w) && !/\.$/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function emptyState(text) { return `<div class="empty">${esc(text)}</div>`; }

/** "Type · Segment", dropping the segment when it only repeats the type (Supermarket · Supermarkets). */
export function typeLine(t, a) {
  const type = t(a.type);
  const seg = t(a.segment);
  return seg.toLowerCase().startsWith(type.toLowerCase()) ? type : `${type} · ${seg}`;
}
