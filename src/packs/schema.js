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
 * @property {Record<string, string[]>} orderReasons  Keyed by offering kind or status.
 * @property {{kind: 'totalAbove'|'lineMax'|'humanPrice'|'info', amount?: number, max?: number, appliesTo?: string, route?: 'manager'|'kam', text: string}[]} orderRules
 * @property {{label: string, route: 'manager'|'kam'}[]} overrideReasons
 * @property {{label: string, blocked: boolean, route?: 'manager'|'kam'}[]} outcomeReasons
 * @property {string[]} visitNotes
 * @property {{id: string, label: string, format: 'pct'|'count'|'money'|'days', range: [number, number], target: number, lowerIsBetter?: boolean}[]} kpis  First KPI is the headline.
 * @property {{agent: 'all'|'planner'|'gap'|'order', text: string}[]} guardrails
 * @property {{title: string, text: string, capability: 'potential'|'gaps'|'ranking'|'planning'|'order'|'evidence'}[]} problems  Exactly 6.
 * @property {{q: string, a: string}[]} assistant  8 to 10.
 * @property {string[]} storyline           8 steps, PRD section 14.
 * @property {string[]} forbidden           Words that must never render for this industry.
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
  Object.entries(p.orderReasons || {}).forEach(([k, arr]) => arr.forEach((s) => checkTokens(e, `${p.id}.orderReasons.${k}`, s, vocab, ORDER_VARS)));
  req((p.orderRules || []).length >= 2, 'needs at least 2 orderRules');
  for (const r of p.orderRules || []) {
    req(['totalAbove', 'lineMax', 'humanPrice', 'info'].includes(r.kind), `orderRule kind ${r.kind}`);
    if (r.kind === 'totalAbove') req(r.amount > 0, 'totalAbove needs amount');
    if (r.kind === 'lineMax') req(r.max > 0 && r.appliesTo, 'lineMax needs max and appliesTo');
    checkTokens(e, `${p.id}.orderRules`, r.text, vocab, RULE_VARS);
  }
  if ((p.offerings || []).some((o) => o.price === null)) req((p.orderRules || []).some((r) => r.kind === 'humanPrice'), 'offerings priced by people need a humanPrice rule');
  req((p.overrideReasons || []).length >= 4 && p.overrideReasons.every((r) => r.label && ['manager', 'kam'].includes(r.route)), 'overrideReasons need 4+ with route');
  req((p.overrideReasons || []).some((r) => r.route === 'kam'), 'at least one override reason routes to the KAM');
  req((p.outcomeReasons || []).length >= 3 && p.outcomeReasons.some((r) => r.blocked), 'outcomeReasons need 3+ with at least one blocked');
  range(p.visitNotes, 3, 8, 'visitNotes');
  (p.visitNotes || []).forEach((s) => checkTokens(e, `${p.id}.visitNotes`, s, vocab, NOTE_VARS));
  range(p.kpis, 4, 6, 'kpis');
  (p.kpis || []).forEach((k) => req(k.id && k.label && ['pct', 'count', 'money', 'days'].includes(k.format) && k.range?.length === 2 && typeof k.target === 'number', `kpi ${k.id}`));
  range(p.guardrails, 3, 8, 'guardrails');
  (p.guardrails || []).forEach((g) => req(['all', 'planner', 'gap', 'order'].includes(g.agent) && g.text, 'guardrail agent and text'));
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
