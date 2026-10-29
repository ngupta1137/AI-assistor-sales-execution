// Pack schema (JSDoc) and validator. The validator runs in tests/static.mjs and
// in development, so a malformed pack fails fast instead of rendering "undefined".

/**
 * @typedef {Object} AccountType
 * @property {string} type                  Display label, for example "Pharmacy".
 * @property {'business'|'institution'|'family'|'person'} [naming]  Which country name patterns apply.
 * @property {{en: string[], pt?: string[], es?: string[], de?: string[], id?: string[]}} words  Name suffixes per language.
 *
 * @typedef {Object} Segment
 * @property {string} id
 * @property {string} name
 * @property {number} share                 Share of accounts, all segments sum to about 1.
 * @property {boolean} [key]                Key account segment: overrides route to the KAM.
 * @property {[number, number]} visitMinutes
 * @property {string} style                 How a visit in this segment works.
 * @property {[number, number]} annualValue Reference annual value in USD before the country price factor.
 * @property {[number, number]} hours       Opening hours in minutes after midnight.
 * @property {[number, number]} [orderQty]  Default suggested quantity range.
 * @property {AccountType[]} types
 * @property {(string|{role: string, prefix?: string})[]} roles  First role is the main contact.
 *
 * @typedef {Object} Offering
 * @property {string} id
 * @property {string} name                  Fictional.
 * @property {string} category
 * @property {number|null} price            Reference price in USD. 0 = no charge. null = priced by people, never the agent.
 * @property {string} unit
 * @property {'core'|'focus'|'new'} status
 * @property {string} [kind]                Special class, for example "sample". Only actions whose uses names this kind talk about it.
 * @property {string[]} [segments]
 * @property {[number, number]} [qty]
 *
 * @typedef {Object} ActionDef
 * @property {string} id
 * @property {string} type
 * @property {'planner'|'gap'|'order'} agent
 * @property {number} effort                Minutes.
 * @property {'photo'|'signature'|'note'|'scan'} evidence
 * @property {[number, number]} value       Reference value in USD.
 * @property {string} uses                  'none', 'any', or an offering status, category or kind.
 * @property {string[]} [segments]
 * @property {string} title                 Templates may use {product} {days} {pct} {qty} {peers} {n} {weeks} {area} {city} {person} {role} {event} {eventDays} {type} {segment} {amount} and vocabulary tokens.
 * @property {string} saw
 * @property {string} compared
 * @property {string[]} why                 3 to 5 lines.
 * @property {string[]} talk                2 to 3 lines.
 * @property {string} [guardrail]
 *
 * @typedef {Object} IndustryPack
 * @property {string} id
 * @property {string} name
 * @property {string} tagline
 * @property {string} icon
 * @property {string} accent                Hex colour with at least 4.5:1 contrast against white.
 * @property {Record<string, string>} vocab
 * @property {{rep: string, manager: string, admin: string}} personas
 * @property {Segment[]} segments           2 or 3.
 * @property {Offering[]} offerings         8 to 12.
 * @property {ActionDef[]} actions          8 to 12.
 * @property {Record<string, string[]> & {bySegment?: Record<string, Record<string, string[]>>}} orderReasons
 *   Keyed by offering kind or status. bySegment overrides them for one segment (for example projects).
 * @property {{kind: 'totalAbove'|'lineMax'|'humanPrice'|'prerequisite'|'info', amount?: number, max?: number, appliesTo?: string, action?: string, evidence?: string, route?: 'manager'|'kam', text: string}[]} orderRules
 *   prerequisite: lines matching appliesTo ('humanPrice' or an offering status, category or kind) cannot be sent until
 *   the account's action `action` is done with evidence of type `evidence`. Blocks submission.
 * @property {{label: string, route: 'manager'|'kam'}[]} overrideReasons
 * @property {{label: string, blocked: boolean, route?: 'manager'|'kam'}[]} outcomeReasons
 * @property {(string|{text: string, segments: string[]})[]} visitNotes
 * @property {{id: string, label: string, format: 'pct'|'count'|'money'|'days', range: [number, number], target: number, lowerIsBetter?: boolean, segments?: string[]}[]} kpis
 *   First KPI is the territory headline. segments limits a KPI to the account segments it applies to.
 * @property {{id: string, agent: 'all'|'planner'|'gap'|'order', text: string}[]} guardrails
 *   id is unique within the pack (all1, gap1, order1, planner1 ...). Refusals refer to it.
 * @property {{title: string, text: string, capability: 'potential'|'gaps'|'ranking'|'planning'|'order'|'evidence'}[]} problems  Exactly 6.
 * @property {{q: string, a: string}[]} assistant  8 to 10.
 * @property {string[]} storyline           8 steps, PRD section 14.
 * @property {string[]} forbidden           Words that must never render for this industry.
 *
 * @typedef {Object} CompanionContent  (added to IndustryPack as `companion`)
 * @property {{rep: string, manager: string}} roles                 Role titles in this industry's words.
 * @property {{id: string, label: string, limitClass: 'meals'|'travel'|'lodging'|'other'}[]} expenseCategories  5 to 6. limitClass picks the country's sample limit.
 * @property {{id: string, label: string, cycleMonths: number}[]} certifications  4 to 6 required trainings or accreditations.
 * @property {{id: string, title: string, minutes: number, summary: string}[]} learningModules  8 to 10.
 * @property {{id: string, title: string, text: string}[]} knowledge  10 to 12 how-to entries and FAQs.
 * @property {{id: string, uses: ('kpi'|'offer'|'trend'|'event')[], text: string}[]} pitchTemplates  Exactly 3. One talking point each. Vars: {name} {person} {kpi} {kpiValue} {kpiTarget} {offer} {trend} {event} {eventDays}. uses lists the data each point reads, shown as its source.
 * @property {{id: string, title: string, text: string, uses: ('share'|'potential'|'trend'|'offer'|'orders')[]}[]} valueStoryTemplates  Exactly 3. Vars: {name} {person} {share} {potential} {current} {whitespace} {orders} {trend} {offer}.
 * @property {{id: string, name: string, startWeek: number, weeks: number, perWeek: number}[]} resourcePlans  Exactly 2 sample activations. perWeek is rep-days needed each week.
 * @property {{id: string, text: string, blocked: string[]}[]} guardrails  How regulated limits apply to the Companion. blocked: lowercase patterns no pitch, story, knowledge entry or chatbot answer may contain; asking for one is refused.
 *
 * Country pack additions: publicHolidays (6 to 8 {name, monthDay}), leaveTypes (3 to 4 {id, label, days}),
 * expenseLimits ({meals, travel, lodging, other}, sample amounts in local currency), mileageUnit ('mi'|'km'),
 * payslipLabel (generic wording), tempUnit ('C'|'F').
 *
 * @typedef {Object} AssistantQuestion
 * @property {string} q        Question text with vocabulary tokens.
 * @property {string} intent   An id from src/core/assistant/intents.js, answer:<key> (a key of assistantAnswers) or qa:<n>.
 *
 * @typedef {Object} AssistantRefusal
 * @property {string} id
 * @property {string} guardrail   A guardrail id of this pack. The "Why can't you answer that?" panel shows its text.
 * @property {string[]} patterns  Lowercase words or phrases that trigger the refusal (matched from the start of a word).
 * @property {string} refusal     Plain-language refusal.
 * @property {string} allowed     What the assistant can do instead.
 *
 * @typedef {Object} AssistantContent  (added to IndustryPack)
 * @property {Record<string, {rep?: AssistantQuestion[], manager?: AssistantQuestion[]}>} assistantContext
 *   Screen to persona to 4 to 6 suggested questions. Build it with withBase() from src/packs/assistant-base.js.
 *   Required: rep on today, brief, account, action, order, complete, route, agents, config, problems; manager on manager, agents, config, problems.
 * @property {{talkToContact: string, goodVisit: string, guardrailWhy: string, [key: string]: string}} assistantAnswers
 *   Industry phrasing. Tokens: vocabulary tokens plus {name} {person} {area} {city} of the focused account.
 * @property {AssistantRefusal[]} assistantRefusals  4 to 6 out-of-scope patterns, each tied to a guardrail.
 *
 * @typedef {Object} City
 * @property {string} name
 * @property {string} [region]
 * @property {number} lat
 * @property {number} lng
 * @property {string} postcode              Pattern: {d} digit, {L} letter.
 * @property {string} [phone]
 * @property {string[]} areas
 *
 * @typedef {Object} CountryPack
 * @property {string} id                    ISO-style code used in URLs.
 * @property {string} name
 * @property {string} locale                Intl locale for numbers.
 * @property {string} currency              ISO 4217.
 * @property {number} decimals
 * @property {number} priceFactor           Local price level vs the USD reference. Not an exchange rate.
 * @property {number} [priceStep]
 * @property {{value: number, suffix: string, min?: number}[]} [compactUnits]
 * @property {'km'|'mi'} distance
 * @property {'mdy'|'dmy'} dateOrder
 * @property {'/'|'.'|'-'} dateSep
 * @property {'12h'|'24h'} clock
 * @property {'us'|'uk'} spelling
 * @property {number[]} weekend             0 = Sunday.
 * @property {number} speedKmh              Average urban travel speed.
 * @property {City[]} cities
 * @property {string[]} streets
 * @property {string[]} firstNames
 * @property {string[]} lastNames
 * @property {'en'|'pt'|'es'|'de'|'id'} nameLang
 * @property {string[]} prefixes
 * @property {{business: string[], institution: string[], family: string[], person: string[]}} patterns
 * @property {string} address
 * @property {string} phone
 * @property {{name: string, note: string, monthDay?: string, dates?: Record<number, string>}[]} events
 * @property {string[]} notes
 */

import { isKnownIntent } from '../core/assistant/intents.js';
import { REQUIRED } from './assistant-base.js';

export const PITCH_VARS = ['name', 'person', 'kpi', 'kpiValue', 'kpiTarget', 'offer', 'trend', 'event', 'eventDays'];
export const STORY_VARS = ['name', 'person', 'share', 'potential', 'current', 'whitespace', 'orders', 'trend', 'offer'];
const ANSWER_VARS = ['name', 'person', 'area', 'city'];
const VOCAB_KEYS = ['account', 'accounts', 'contact', 'contacts', 'rep', 'reps', 'manager', 'kam', 'offering', 'offerings', 'order', 'orders', 'visit', 'visits', 'territory'];
export const ACTION_VARS = ['product', 'days', 'pct', 'qty', 'peers', 'n', 'weeks', 'area', 'city', 'person', 'role', 'event', 'eventDays', 'type', 'segment', 'amount'];
export const ORDER_VARS = ['qty', 'avg', 'cover', 'event', 'eventDays', 'weeks'];
export const RULE_VARS = ['limit', 'max', 'lines'];
export const NOTE_VARS = ['n', 'person'];
const CAPS = ['potential', 'gaps', 'ranking', 'planning', 'order', 'evidence'];

function luminance(hex) {
  const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export const contrastWithWhite = (hex) => 1.05 / (luminance(hex) + 0.05);

/** Tokens used in a template string. */
export const tokensOf = (s) => [...String(s).matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((m) => m[1]);

/** Checks every token in a template is a vocabulary key (any case) or an allowed variable. */
function checkTokens(errors, where, s, vocab, vars = []) {
  for (const tok of tokensOf(s)) {
    const lower = tok[0].toLowerCase() + tok.slice(1);
    if (!(tok in vocab) && !(lower in vocab) && !vars.includes(tok) && !vars.includes(lower)) errors.push(`${where}: unknown token {${tok}} in "${s}"`);
  }
}

/** @param {IndustryPack} p @param {string[]} iconKeys */
export function validateIndustry(p, iconKeys = []) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(`${p.id || '?'}: ${msg}`); };
  const range = (arr, lo, hi, what) => req(Array.isArray(arr) && arr.length >= lo && arr.length <= hi, `${what} needs ${lo} to ${hi} items (has ${arr?.length ?? 0})`);
  req(/^[a-z][a-z0-9]*$/.test(p.id || ''), 'id must be lowercase letters and digits');
  ['name', 'tagline', 'icon', 'accent'].forEach((k) => req(typeof p[k] === 'string' && p[k], `missing ${k}`));
  if (iconKeys.length) req(iconKeys.includes(p.icon), `unknown icon ${p.icon}`);
  req(/^#[0-9A-Fa-f]{6}$/.test(p.accent || ''), 'accent must be #RRGGBB');
  if (/^#[0-9A-Fa-f]{6}$/.test(p.accent || '')) req(contrastWithWhite(p.accent) >= 4.5, `accent ${p.accent} has contrast ${contrastWithWhite(p.accent).toFixed(2)} with white, needs 4.5`);
  const vocab = p.vocab || {};
  VOCAB_KEYS.forEach((k) => req(typeof vocab[k] === 'string' && vocab[k], `vocab.${k} missing`));
  ['rep', 'manager', 'admin'].forEach((k) => req(p.personas?.[k], `personas.${k} missing`));

  range(p.segments, 2, 3, 'segments');
  const segIds = (p.segments || []).map((s) => s.id);
  const share = (p.segments || []).reduce((a, s) => a + (s.share || 0), 0);
  req(Math.abs(share - 1) < 0.02, `segment shares sum to ${share.toFixed(2)}, need 1`);
  for (const s of p.segments || []) {
    ['id', 'name', 'style'].forEach((k) => req(s[k], `segment ${s.id} missing ${k}`));
    req(s.visitMinutes?.length === 2 && s.visitMinutes[0] <= s.visitMinutes[1], `segment ${s.id} visitMinutes`);
    req(s.annualValue?.length === 2 && s.annualValue[0] < s.annualValue[1], `segment ${s.id} annualValue`);
    req(s.hours?.length === 2 && s.hours[0] < s.hours[1] && s.hours[1] < 1440, `segment ${s.id} hours`);
    req(s.types?.length >= 1 && s.types.every((t) => t.type && t.words?.en?.length), `segment ${s.id} types need words.en`);
    req(s.roles?.length >= 1, `segment ${s.id} needs roles`);
  }
  req((p.segments || []).some((s) => s.key), 'at least one segment must be key: true');

  range(p.offerings, 8, 12, 'offerings');
  const offIds = new Set();
  const tags = new Set(['none', 'any']);
  for (const o of p.offerings || []) {
    req(!offIds.has(o.id), `duplicate offering ${o.id}`); offIds.add(o.id);
    req(o.name && o.category && o.unit, `offering ${o.id} needs name, category, unit`);
    req(o.price === null || (typeof o.price === 'number' && o.price >= 0), `offering ${o.id} price must be a number >= 0 or null`);
    req(['core', 'focus', 'new'].includes(o.status), `offering ${o.id} status`);
    (o.segments || []).forEach((s) => req(segIds.includes(s), `offering ${o.id} unknown segment ${s}`));
    [o.status, o.category, o.kind].filter(Boolean).forEach((x) => tags.add(x));
    req(p.orderReasons?.[o.kind] || p.orderReasons?.[o.status] || p.orderReasons?.core, `no orderReasons for offering ${o.id}`);
  }
  for (const s of p.segments || []) req((p.offerings || []).some((o) => !o.segments || o.segments.includes(s.id)), `segment ${s.id} has no offerings`);

  range(p.actions, 8, 12, 'actions');
  const actIds = new Set();
  for (const a of p.actions || []) {
    const w = `${p.id}.actions.${a.id}`;
    req(!actIds.has(a.id), `duplicate action ${a.id}`); actIds.add(a.id);
    req(['planner', 'gap', 'order'].includes(a.agent), `${w} agent`);
    req(['photo', 'signature', 'note', 'scan'].includes(a.evidence), `${w} evidence`);
    req(a.effort > 0 && a.value?.length === 2 && a.value[0] < a.value[1], `${w} effort and value`);
    req(tags.has(a.uses), `${w} uses "${a.uses}" matches no offering status, category or kind`);
    (a.segments || []).forEach((s) => req(segIds.includes(s), `${w} unknown segment ${s}`));
    req(a.title && a.saw && a.compared, `${w} needs title, saw, compared`);
    range(a.why, 3, 5, `${w}.why`);
    range(a.talk, 2, 3, `${w}.talk`);
    [a.title, a.saw, a.compared, ...(a.why || []), ...(a.talk || []), a.guardrail || ''].forEach((s) => checkTokens(e, w, s, vocab, ACTION_VARS));
    if (a.uses === 'none') [a.title, a.saw, a.compared, ...(a.why || []), ...(a.talk || [])].forEach((s) => req(!tokensOf(s).includes('product'), `${w} uses none but references {product}`));
  }
  ['planner', 'gap', 'order'].forEach((ag) => req((p.actions || []).some((a) => a.agent === ag), `no action for agent ${ag}`));
  for (const s of p.segments || []) {
    const n = (p.actions || []).filter((a) => !a.segments || a.segments.includes(s.id)).length;
    req(n >= 3, `segment ${s.id} has only ${n} eligible actions, needs 3`);
  }
  const { bySegment, ...reasons } = p.orderReasons || {};
  Object.entries(reasons).forEach(([k, arr]) => arr.forEach((s) => checkTokens(e, `${p.id}.orderReasons.${k}`, s, vocab, ORDER_VARS)));
  Object.entries(bySegment || {}).forEach(([segId, map]) => {
    req(segIds.includes(segId), `orderReasons.bySegment unknown segment ${segId}`);
    Object.entries(map).forEach(([k, arr]) => arr.forEach((s) => checkTokens(e, `${p.id}.orderReasons.bySegment.${segId}.${k}`, s, vocab, ORDER_VARS)));
  });
  req((p.orderRules || []).length >= 2, 'needs at least 2 orderRules');
  for (const r of p.orderRules || []) {
    req(['totalAbove', 'lineMax', 'humanPrice', 'prerequisite', 'info'].includes(r.kind), `orderRule kind ${r.kind}`);
    if (r.kind === 'prerequisite') {
      const def = (p.actions || []).find((a) => a.id === r.action);
      req(def, `prerequisite rule names unknown action ${r.action}`);
      req(['photo', 'signature', 'note', 'scan'].includes(r.evidence) && def?.evidence === r.evidence, `prerequisite evidence ${r.evidence} must match action ${r.action}'s evidence type`);
      req(r.appliesTo === 'humanPrice' || tags.has(r.appliesTo), `prerequisite appliesTo ${r.appliesTo} matches no offering`);
      const lines = (p.offerings || []).filter((o) => (r.appliesTo === 'humanPrice' ? o.price === null : [o.status, o.category, o.kind].includes(r.appliesTo)));
      for (const o of lines) for (const s of o.segments || segIds) req(!def?.segments || def.segments.includes(s), `offering ${o.id} needs action ${r.action}, which is not available in segment ${s}`);
    }
    if (r.kind === 'totalAbove') req(r.amount > 0, 'totalAbove needs amount');
    if (r.kind === 'lineMax') req(r.max > 0 && r.appliesTo, 'lineMax needs max and appliesTo');
    checkTokens(e, `${p.id}.orderRules`, r.text, vocab, RULE_VARS);
  }
  if ((p.offerings || []).some((o) => o.price === null)) req((p.orderRules || []).some((r) => r.kind === 'humanPrice'), 'offerings priced by people need a humanPrice rule');
  req((p.overrideReasons || []).length >= 4 && p.overrideReasons.every((r) => r.label && ['manager', 'kam'].includes(r.route)), 'overrideReasons need 4+ with route');
  req((p.overrideReasons || []).some((r) => r.route === 'kam'), 'at least one override reason routes to the KAM');
  req((p.outcomeReasons || []).length >= 3 && p.outcomeReasons.some((r) => r.blocked), 'outcomeReasons need 3+ with at least one blocked');
  range(p.visitNotes, 3, 10, 'visitNotes');
  (p.visitNotes || []).forEach((n) => {
    const s = typeof n === 'string' ? n : n.text;
    if (typeof n !== 'string') (n.segments || []).forEach((sid) => req(segIds.includes(sid), `visitNote unknown segment ${sid}`));
    checkTokens(e, `${p.id}.visitNotes`, s, vocab, NOTE_VARS);
  });
  for (const sid of segIds) req((p.visitNotes || []).filter((n) => typeof n === 'string' || !n.segments || n.segments.includes(sid)).length >= 2, `segment ${sid} needs 2+ visitNotes`);
  range(p.kpis, 4, 6, 'kpis');
  (p.kpis || []).forEach((k) => {
    req(k.id && k.label && ['pct', 'count', 'money', 'days'].includes(k.format) && k.range?.length === 2 && typeof k.target === 'number', `kpi ${k.id}`);
    (k.segments || []).forEach((sid) => req(segIds.includes(sid), `kpi ${k.id} unknown segment ${sid}`));
  });
  for (const sid of segIds) req((p.kpis || []).filter((k) => !k.segments || k.segments.includes(sid)).length >= 3, `segment ${sid} needs 3+ KPIs`);
  range(p.guardrails, 3, 8, 'guardrails');
  (p.guardrails || []).forEach((g) => req(['all', 'planner', 'gap', 'order'].includes(g.agent) && g.text && /^[a-z]+\d+$/.test(g.id || ''), `guardrail needs agent, text and an id like all1: ${g.text}`));
  req(new Set((p.guardrails || []).map((g) => g.id)).size === (p.guardrails || []).length, 'guardrail ids must be unique');
  if (p.assistantContext || p.assistantAnswers || p.assistantRefusals) validateAssistant(p, vocab, e, req);
  if (p.companion) validateCompanion(p, vocab, e, req);
  req(p.problems?.length === 6, 'needs exactly 6 problems');
  (p.problems || []).forEach((x) => req(x.title && x.text && CAPS.includes(x.capability), `problem "${x.title}" capability`));
  range(p.assistant, 8, 10, 'assistant');
  req(p.storyline?.length === 8, 'storyline needs 8 steps');
  req(Array.isArray(p.forbidden) && p.forbidden.length >= 5, 'forbidden needs 5+ words');
  const plain = [p.tagline, ...(p.guardrails || []).map((g) => g.text), ...(p.problems || []).flatMap((x) => [x.title, x.text]), ...(p.assistant || []).flatMap((x) => [x.q, x.a]), ...(p.storyline || []), ...(p.overrideReasons || []).map((r) => r.label), ...(p.outcomeReasons || []).map((r) => r.label), ...(p.kpis || []).map((k) => k.label), ...(p.segments || []).map((s) => s.style)];
  plain.forEach((s) => checkTokens(e, `${p.id}.text`, s, vocab, []));
  return e;
}

/** @param {CountryPack} c */
export function validateCountry(c) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(`${c.id || '?'}: ${msg}`); };
  req(/^[A-Z]{2}$/.test(c.id || ''), 'id must be two capital letters');
  ['name', 'locale', 'currency', 'address', 'phone', 'nameLang'].forEach((k) => req(typeof c[k] === 'string' && c[k], `missing ${k}`));
  req(Number.isInteger(c.decimals) && c.decimals >= 0 && c.decimals <= 3, 'decimals');
  req(c.priceFactor > 0, 'priceFactor must be > 0');
  req(['km', 'mi'].includes(c.distance), 'distance');
  req(['mdy', 'dmy'].includes(c.dateOrder), 'dateOrder');
  req(['/', '.', '-'].includes(c.dateSep), 'dateSep');
  req(['12h', '24h'].includes(c.clock), 'clock');
  req(['us', 'uk'].includes(c.spelling), 'spelling');
  req(Array.isArray(c.weekend) && c.weekend.length >= 1, 'weekend');
  req(c.speedKmh > 5, 'speedKmh');
  req(c.cities?.length >= 4, 'needs 4+ cities');
  (c.cities || []).forEach((x) => req(x.name && Math.abs(x.lat) <= 90 && Math.abs(x.lng) <= 180 && x.areas?.length >= 5 && x.postcode, `city ${x.name}`));
  req(c.streets?.length >= 8, 'needs 8+ streets');
  req(c.firstNames?.length >= 16 && c.lastNames?.length >= 16, 'needs 16+ first and last names');
  req(c.prefixes?.length >= 8, 'needs 8+ name prefixes');
  ['business', 'institution', 'family', 'person'].forEach((k) => req(c.patterns?.[k]?.length >= 1 && c.patterns[k].every((p) => p.includes('{type}')), `patterns.${k} must include {type}`));
  req(c.address.includes('{street}') && c.address.includes('{city}'), 'address needs {street} and {city}');
  req(c.events?.length >= 5 && c.events.every((x) => x.name && x.note && (x.monthDay || x.dates)), 'needs 5+ events with dates');
  req(c.notes?.length >= 2, 'needs notes');
  try { new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency }).format(1); } catch { req(false, 'locale or currency rejected by Intl'); }
  return e;
}

/** Assistant content: questions, industry phrasing and refusals (all three are required). */
function validateAssistant(p, vocab, e, req) {
  const ctxMap = p.assistantContext;
  const answers = p.assistantAnswers;
  const refusals = p.assistantRefusals;
  req(ctxMap && typeof ctxMap === 'object', 'assistantContext missing');
  req(answers && typeof answers === 'object', 'assistantAnswers missing');
  req(Array.isArray(refusals), 'assistantRefusals missing');
  if (!ctxMap || !answers || !Array.isArray(refusals)) return;
  for (const k of ['talkToContact', 'goodVisit', 'guardrailWhy']) req(typeof answers[k] === 'string' && answers[k], `assistantAnswers.${k} missing`);
  Object.entries(answers).forEach(([k, v]) => checkTokens(e, `${p.id}.assistantAnswers.${k}`, v, vocab, ANSWER_VARS));
  for (const [persona, screens] of Object.entries(REQUIRED)) {
    for (const screen of screens) {
      const list = ctxMap[screen]?.[persona];
      req(Array.isArray(list) && list.length >= 4 && list.length <= 6, `assistantContext.${screen}.${persona} needs 4 to 6 questions (has ${list?.length ?? 0})`);
    }
  }
  const seen = new Set();
  for (const [screen, byPersona] of Object.entries(ctxMap)) {
    for (const [persona, list] of Object.entries(byPersona)) {
      for (const x of list) {
        const where = `${p.id}.assistantContext.${screen}.${persona}`;
        req(x.q && x.intent, `${where} entry needs q and intent`);
        checkTokens(e, where, x.q, vocab, []);
        req(isKnownIntent(x.intent), `${where}: unknown intent "${x.intent}"`);
        if (x.intent?.startsWith('answer:')) req(answers[x.intent.slice(7)], `${where}: intent ${x.intent} has no assistantAnswers.${x.intent.slice(7)}`);
        if (x.intent?.startsWith('qa:')) req((p.assistant || [])[Number(x.intent.slice(3))], `${where}: ${x.intent} points past the assistant list`);
        const key = `${screen}|${persona}|${x.q}`;
        req(!seen.has(key), `${where}: duplicate question "${x.q}"`);
        seen.add(key);
      }
    }
  }
  req(refusals.length >= 4 && refusals.length <= 6, `assistantRefusals needs 4 to 6 entries (has ${refusals.length})`);
  const gids = new Set((p.guardrails || []).map((g) => g.id));
  const rids = new Set();
  for (const r of refusals) {
    req(r.id && !rids.has(r.id), `refusal id missing or duplicate: ${r.id}`);
    rids.add(r.id);
    req(gids.has(r.guardrail), `refusal ${r.id} names unknown guardrail ${r.guardrail}`);
    req(Array.isArray(r.patterns) && r.patterns.length >= 3 && r.patterns.every((x) => x === x.toLowerCase() && x.length >= 4), `refusal ${r.id} needs 3+ lowercase patterns of 4+ characters`);
    req(r.refusal && r.allowed, `refusal ${r.id} needs refusal and allowed text`);
    checkTokens(e, `${p.id}.assistantRefusals.${r.id}`, `${r.refusal} ${r.allowed}`, vocab, []);
  }
}

const LIMIT_CLASSES = ['meals', 'travel', 'lodging', 'other'];

/** Companion content for an industry (roles, expenses, certifications, learning, pitch, story, resources, guardrails). */
function validateCompanion(p, vocab, e, req) {
  const c = p.companion;
  const n = (arr, lo, hi, what) => req(Array.isArray(arr) && arr.length >= lo && arr.length <= hi, `companion.${what} needs ${lo} to ${hi} entries (has ${arr?.length ?? 0})`);
  req(c.roles?.rep && c.roles?.manager, 'companion.roles needs rep and manager');
  n(c.expenseCategories, 5, 6, 'expenseCategories');
  (c.expenseCategories || []).forEach((x) => req(x.id && x.label && LIMIT_CLASSES.includes(x.limitClass), `expense category ${x.id} needs id, label and a limitClass`));
  n(c.certifications, 4, 6, 'certifications');
  (c.certifications || []).forEach((x) => req(x.id && x.label && x.cycleMonths >= 3 && x.cycleMonths <= 36, `certification ${x.id} needs id, label and cycleMonths 3 to 36`));
  n(c.learningModules, 8, 10, 'learningModules');
  (c.learningModules || []).forEach((x) => req(x.id && x.title && x.minutes >= 5 && x.minutes <= 120 && x.summary, `learning module ${x.id} needs id, title, minutes and summary`));
  n(c.knowledge, 10, 12, 'knowledge');
  (c.knowledge || []).forEach((x) => req(x.id && x.title && x.text && x.text.length >= 60, `knowledge entry ${x.id} needs id, title and at least 60 characters of text`));
  req((c.pitchTemplates || []).length === 3, 'companion.pitchTemplates needs exactly 3');
  (c.pitchTemplates || []).forEach((x) => { req(x.id && x.text && x.uses?.length, `pitch template ${x.id} needs id, text and uses`); checkTokens(e, `${p.id}.companion.pitch.${x.id}`, x.text, vocab, PITCH_VARS); });
  req((c.valueStoryTemplates || []).length === 3, 'companion.valueStoryTemplates needs exactly 3');
  (c.valueStoryTemplates || []).forEach((x) => { req(x.id && x.title && x.text && x.uses?.length, `value story ${x.id} needs id, title, text and uses`); checkTokens(e, `${p.id}.companion.story.${x.id}`, x.text, vocab, STORY_VARS); });
  req((c.resourcePlans || []).length === 2, 'companion.resourcePlans needs exactly 2');
  (c.resourcePlans || []).forEach((x) => req(x.id && x.name && x.startWeek >= 0 && x.startWeek <= 4 && x.weeks >= 2 && x.weeks <= 5 && x.perWeek >= 1, `resource plan ${x.id} needs name, startWeek 0 to 4, weeks 2 to 5, perWeek`));
  n(c.guardrails, 2, 5, 'guardrails');
  (c.guardrails || []).forEach((g) => {
    req(g.id && g.text && Array.isArray(g.blocked) && g.blocked.length >= 3, `companion guardrail ${g.id} needs text and 3+ blocked patterns`);
    (g.blocked || []).forEach((b) => req(b === b.toLowerCase() && b.length >= 4, `companion guardrail ${g.id}: pattern "${b}" must be lowercase and 4+ characters`));
    checkTokens(e, `${p.id}.companion.guardrail.${g.id}`, g.text, vocab, []);
  });
  [...(c.expenseCategories || []).map((x) => x.label), ...(c.certifications || []).map((x) => x.label), ...(c.learningModules || []).flatMap((x) => [x.title, x.summary]), ...(c.knowledge || []).flatMap((x) => [x.title, x.text]), c.roles?.rep, c.roles?.manager]
    .filter(Boolean).forEach((s) => checkTokens(e, `${p.id}.companion`, s, vocab, []));
}

/** Companion fields for a country pack. */
export function validateCountryCompanion(c) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(`${c.id || '?'}: ${msg}`); };
  req(Array.isArray(c.publicHolidays) && c.publicHolidays.length >= 6 && c.publicHolidays.length <= 8, 'publicHolidays needs 6 to 8');
  (c.publicHolidays || []).forEach((h) => req(h.name && /^\d{2}-\d{2}$/.test(h.monthDay || ''), `holiday ${h.name} needs name and monthDay MM-DD`));
  req(Array.isArray(c.leaveTypes) && c.leaveTypes.length >= 3 && c.leaveTypes.length <= 4, 'leaveTypes needs 3 to 4');
  (c.leaveTypes || []).forEach((t) => req(t.id && t.label && t.days > 0, `leave type ${t.id} needs id, label and days`));
  req(c.expenseLimits && LIMIT_CLASSES.every((k) => c.expenseLimits[k] > 0), 'expenseLimits needs meals, travel, lodging and other');
  req(['mi', 'km'].includes(c.mileageUnit), 'mileageUnit must be mi or km');
  req(c.payslipLabel, 'payslipLabel missing');
  req(['C', 'F'].includes(c.tempUnit), 'tempUnit must be C or F');
  return e;
}
