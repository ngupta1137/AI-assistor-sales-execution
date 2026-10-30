// Fast checks with no browser: pack schema, template tokens, copy rules, fictional names,
// distinct content per industry, no industry nouns in core screens, determinism, formatting.
// Run: npm run test:static

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDUSTRIES, COUNTRIES, findCountry, findIndustry } from '../src/packs/index.js';
import { validateIndustry, validateCountry, validateCountryCompanion } from '../src/packs/schema.js';
import { ICON_KEYS } from '../src/core/icons.js';
import { generate } from '../src/data/generate.js';
import { createFormat } from '../src/core/format.js';
import { createText } from '../src/core/text.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
let checks = 0;
const check = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

async function walk(dir) {
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...await walk(p)); else if (/\.(js|css|html)$/.test(d.name)) out.push(p);
  }
  return out;
}
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

// 1. Schema
for (const p of INDUSTRIES) validateIndustry(p, ICON_KEYS).forEach((m) => check(false, `schema: ${m}`));
for (const c of COUNTRIES) validateCountry(c).forEach((m) => check(false, `schema: ${m}`));
for (const c of COUNTRIES) validateCountryCompanion(c).forEach((m) => check(false, `schema: ${m}`));
for (const p of INDUSTRIES) check(!!p.companion, `${p.id}: Companion content (companion) is required`);
for (const p of INDUSTRIES) check(!!(p.assistantContext && p.assistantAnswers && p.assistantRefusals), `${p.id}: assistant content (assistantContext, assistantAnswers, assistantRefusals) is required`);
check(INDUSTRIES.length === 14, `expected 14 industries, found ${INDUSTRIES.length}`);
check(COUNTRIES.length === 11, `expected 11 countries, found ${COUNTRIES.length}`);
check(new Set(INDUSTRIES.map((p) => p.id)).size === INDUSTRIES.length, 'duplicate industry ids');
check(new Set(INDUSTRIES.map((p) => p.accent.toLowerCase())).size === INDUSTRIES.length, 'two industries share an accent colour');

// 2. Copy rules over every source file the app ships.
const srcFiles = await walk(path.join(root, 'src'));
const SPELLING_EXEMPT = [`${path.sep}countries${path.sep}`, `core${path.sep}text.js`];
const HYPE = ['revolutionary', 'revolutionise', 'revolutionize', 'game-changing', 'game changer', 'cutting-edge', 'best-in-class', 'world-class', 'seamless', 'seamlessly', 'supercharge', 'unleash', 'effortless', 'next-generation', 'state-of-the-art', 'synergy', 'disruptive', 'guaranteed', 'skyrocket', 'magic'];
for (const f of srcFiles) {
  const rel = path.relative(root, f);
  const raw = await readFile(f, 'utf8');
  check(!/[—–]/.test(raw), `${rel}: contains an em or en dash`);
  const lower = stripComments(raw).toLowerCase();
  for (const w of HYPE) check(!new RegExp(`\\b${w}\\b`).test(lower), `${rel}: hype word "${w}"`);
}

// 2b. Source copy is US English; the text gate converts it for UK-spelling countries.
// Country packs are exempt: their place names are local (City Centre).
const UK_ONLY = ['colour', 'centre', 'centres', 'licence', 'organise', 'organised', 'organiser', 'catalogue', 'behaviour', 'prioritise', 'analyse', 'analyser', 'fertiliser', 'theatre', 'programme', 'tyre', 'tyres', 'neighbourhood', 'favourite', 'enrolment', 'orthopaedic', 'litre', 'metre'];
for (const f of srcFiles.filter((x) => !SPELLING_EXEMPT.some((e) => x.includes(e)))) {
  const code = stripComments(await readFile(f, 'utf8')).toLowerCase();
  for (const w of UK_ONLY) check(!new RegExp(`\\b${w}\\b`).test(code), `${path.relative(root, f)}: UK spelling "${w}" in source (write US; the text gate converts)`);
}

// 3. Real brand, chain and company names must never appear (case-sensitive, whole word).
const BRANDS = ['Walmart', 'Kroger', 'Costco', 'Tesco', 'Sainsbury', 'Asda', 'Aldi', 'Lidl', 'Rewe', 'Edeka', 'Carrefour', 'Oxxo', 'Soriana', 'Alfamart', 'Indomaret', 'Spinneys', 'Reliance', 'DMart', 'Walgreens', 'CVS', 'Boots', 'Pfizer', 'Novartis', 'Roche', 'Sanofi', 'GSK', 'AstraZeneca', 'Merck', 'Bayer', 'Abbott', 'Medtronic', 'Stryker', 'Siemens', 'Philips', 'Heineken', 'Diageo', 'Budweiser', 'Corona', 'Coca-Cola', 'Pepsi', 'PepsiCo', 'Nestle', 'Nestlé', 'Unilever', 'Procter', 'Colgate', 'Tide', 'Ariel', 'Dulux', 'Sherwin', 'AkzoNobel', 'Nerolac', 'Berger', 'Syngenta', 'Corteva', 'BASF', 'Monsanto', 'Airtel', 'Jio', 'Vodafone', 'Verizon', 'Telcel', 'Telkomsel', 'Etisalat', 'Samsung', 'Sony', 'Xiaomi', 'Huawei', 'Bosch', 'Castrol', 'Shell', 'Exide', 'Visa', 'Mastercard', 'Paytm', 'PhonePe', 'Itaú', 'Bradesco', 'Santander', 'HSBC', 'Barclays', 'HDFC', 'ICICI', 'Chase', 'Amazon', 'Flipkart', 'Croma', 'MediaMarkt', 'Raiffeisen', 'Kingfisher', 'Bacardi', 'Smirnoff', 'Absolut', 'Lipton', 'Nescafe', 'Cadbury', 'Kellogg', 'Amul', 'Britannia', 'Ambev', 'Brahma', 'Bintang', 'Dettol', 'Gillette', 'Pantene', 'Apollo', 'Lulu', 'Tata', 'Mahindra', 'Bimbo', 'Natura', 'Drogasil', 'Guardian', 'Watsons', 'Spar', 'Coles', 'Woolworths', 'Countdown', 'Leclerc', 'Auchan', 'Intermarche', 'Monoprix', 'Bunnings', 'Kmart', 'Myer', 'Nike', 'Adidas', 'Puma', 'Zara', 'Uniqlo', 'Sysco', 'Grainger', 'Fastenal', 'Enphase', 'SolarEdge', 'Tesla', 'Siemens', 'Bosch', 'Decathlon', 'Fnac', 'Boulanger'];
for (const f of srcFiles.filter((x) => x.includes(`${path.sep}packs${path.sep}`))) {
  const raw = stripComments(await readFile(f, 'utf8'));
  for (const b of BRANDS) check(!new RegExp(`(^|[^A-Za-z])${b.replace(/[-.]/g, '\\$&')}([^A-Za-z]|$)`).test(raw), `${path.relative(root, f)}: real brand or company name "${b}"`);
}

// 4. No prose copied between industries (structure may repeat, sentences may not).
const seen = new Map();
for (const p of INDUSTRIES) {
  const strings = [
    p.tagline, ...p.actions.flatMap((a) => [a.title, a.saw, a.compared, ...a.why, ...a.talk, a.guardrail || '']),
    ...p.problems.flatMap((x) => [x.title, x.text]), ...p.assistant.flatMap((x) => [x.q, x.a]),
    ...p.guardrails.map((g) => g.text), ...p.storyline, ...p.segments.map((s) => s.style), ...p.visitNotes.map((n) => (typeof n === 'string' ? n : n.text)),
    ...(p.companion ? [...p.companion.pitchTemplates.map((x) => x.text), ...p.companion.valueStoryTemplates.map((x) => x.text), ...p.companion.knowledge.map((x) => x.text), ...p.companion.learningModules.map((x) => x.summary), ...p.companion.guardrails.map((g) => g.text)] : []),
    ...Object.values(p.assistantAnswers || {}), ...(p.assistantRefusals || []).flatMap((r) => [r.refusal, r.allowed]),
  ].filter((s) => s && s.length >= 30);
  for (const s of new Set(strings)) {
    if (seen.has(s) && seen.get(s) !== p.id) check(false, `copied text in ${p.id} and ${seen.get(s)}: "${s}"`);
    else seen.set(s, p.id);
  }
}

// 5. Core screens must not hard-code industry nouns: they come from vocabulary tokens.
const NOUNS = ['store', 'stores', 'shop', 'shops', 'clinic', 'clinics', 'hospital', 'hospitals', 'pharmacy', 'dealer', 'dealers', 'outlet', 'outlets', 'merchant', 'merchants', 'workshop', 'workshops', 'SKU', 'SKUs', 'doctor', 'physician', 'farmer', 'farmers', 'shelf', 'HCP', 'patient', 'contractor', 'retailer'];
for (const f of srcFiles.filter((x) => x.includes(`${path.sep}core${path.sep}`) || x.includes(`${path.sep}data${path.sep}`))) {
  const code = stripComments(await readFile(f, 'utf8'));
  const literals = code.match(/'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g) || [];
  for (const lit of literals) for (const n of NOUNS) check(!new RegExp(`\\b${n}\\b`, 'i').test(lit), `${path.relative(root, f)}: industry noun "${n}" hard-coded in ${lit.slice(0, 80)}`);
}

// 6. Every combination generates, deterministically, with every template resolved.
const ONE_DAY = new Date(2026, 9, 29, 9, 0);
for (const ind of INDUSTRIES) {
  for (const c of COUNTRIES) {
    const fmt = createFormat(c, ONE_DAY);
    const t = createText(ind.vocab, c.spelling);
    const a = generate(ind, c, { today: ONE_DAY, fmt });
    const b = generate(ind, c, { today: ONE_DAY, fmt });
    const tag = `${ind.id}x${c.id}`;
    check(JSON.stringify(a) === JSON.stringify(b), `${tag}: generation is not deterministic`);
    check(a.accounts.length >= 24 && a.accounts.length <= 30, `${tag}: ${a.accounts.length} accounts, need 24 to 30`);
    check(a.planned.length >= 6 && a.planned.length <= 8, `${tag}: ${a.planned.length} planned, need 6 to 8`);
    check(a.reps.length === 4 && a.agents.length === 3, `${tag}: needs 4 reps and 3 agents`);
    check(new Set(a.accounts.map((x) => x.name)).size === a.accounts.length, `${tag}: duplicate account names`);
    for (const seg of ind.segments) check(a.accounts.some((x) => x.segmentId === seg.id), `${tag}: no accounts in segment ${seg.id}`);
    for (const p of a.planned) {
      check(p.actions.length >= 3 && p.actions.length <= 6, `${tag}: ${p.actions.length} actions for ${p.accountId}`);
      check(p.order.length >= 1, `${tag}: empty order for ${p.accountId}`);
      for (const it of p.brief) {
        for (const tpl of [it.title, it.saw, it.compared]) {
          const out = t(tpl, it.vars);
          check(!/\{[A-Za-z]+\}/.test(out), `${tag}: unresolved token in "${out}"`);
          check(!/undefined|NaN|null/.test(out), `${tag}: bad value in "${out}"`);
        }
      }
      const acc = a.byId[p.accountId];
      check(p.start >= acc.hours[0] && p.start + acc.visitMinutes <= acc.hours[1], `${tag}: ${acc.name} planned at ${p.start} min outside opening hours ${acc.hours}`);
      for (const l of p.order) check(!/\{[A-Za-z]+\}/.test(t(l.reason, l.vars)), `${tag}: unresolved order reason "${t(l.reason, l.vars)}"`);
    }
    for (const acc of a.accounts) check(!/\{|undefined/.test(acc.address + acc.name + acc.contacts.map((x) => x.phone).join()), `${tag}: bad account fields ${acc.name} ${acc.address}`);
  }
}

// 6b. Truthful order copy and satisfiable prerequisites (functional review F01, F02).
const CLAIMS = /signed at the call|consent recorded|interest recorded with consent|signed for\b/i;
for (const ind of INDUSTRIES) {
  const { bySegment, ...reasons } = ind.orderReasons;
  const all = [...Object.values(reasons).flat(), ...Object.values(bySegment || {}).flatMap((m) => Object.values(m).flat())];
  for (const r of all) check(!CLAIMS.test(r), `${ind.id}: order reason claims evidence that does not exist yet: "${r}"`);
  for (const rule of ind.orderRules.filter((x) => x.kind === 'prerequisite')) {
    for (const c of COUNTRIES) {
      const d = generate(ind, c, { today: ONE_DAY, fmt: createFormat(c, ONE_DAY) });
      for (const p of d.planned) {
        const applies = p.order.some((l) => { const o = ind.offerings.find((x) => x.id === l.offeringId); return rule.appliesTo === 'humanPrice' ? o.price === null : [o.status, o.category, o.kind].includes(rule.appliesTo); });
        if (applies) check(p.actions.some((x) => x.defId === rule.action), `${ind.id}x${c.id} ${p.accountId}: order needs ${rule.action} but the brief does not include it`);
      }
    }
  }
}

// 7. Formatting by country (PRD sections 7 and 11).
if (COUNTRIES.length === 11) {
const fmtOf = (id) => createFormat(findCountry(id), ONE_DAY);
check(fmtOf('IN').money(12345678).includes('1,23,45,678'), `IN lakh grouping: ${fmtOf('IN').money(12345678)}`);
check(/1\.2 Cr/.test(fmtOf('IN').moneyShort(12345678)), `IN crore: ${fmtOf('IN').moneyShort(12345678)}`);
check(/12\.3 L/.test(fmtOf('IN').moneyShort(1234567)), `IN lakh: ${fmtOf('IN').moneyShort(1234567)}`);
check(/19,50/.test(fmtOf('DE').price(19.5)), `DE comma decimals: ${fmtOf('DE').price(19.5)}`);
check(/19,50/.test(fmtOf('BR').price(19.5)), `BR comma decimals: ${fmtOf('BR').price(19.5)}`);
check(/R\$/.test(fmtOf('BR').money(100)), `BR symbol: ${fmtOf('BR').money(100)}`);
check(/£/.test(fmtOf('UK').money(100)), 'UK symbol');
check(/AED/.test(fmtOf('AE').money(100)), 'AE currency');
check(/Rp/.test(fmtOf('ID').money(12500)) && !/,00/.test(fmtOf('ID').money(12500)), `ID: ${fmtOf('ID').money(12500)}`);
check(/ mi$/.test(fmtOf('US').distance(10)) && / km$/.test(fmtOf('DE').distance(10)), 'distance units');
check(fmtOf('US').date(ONE_DAY) === '10/29/2026' && fmtOf('DE').date(ONE_DAY) === '29.10.2026' && fmtOf('UK').date(ONE_DAY) === '29/10/2026', 'date order');
check(/19,50/.test(fmtOf('FR').price(19.5)) && /€/.test(fmtOf('FR').money(100)), `FR format: ${fmtOf('FR').price(19.5)} ${fmtOf('FR').money(100)}`);
check(/\$/.test(fmtOf('AU').money(100)) && fmtOf('AU').date(ONE_DAY) === '29/10/2026', `AU format: ${fmtOf('AU').money(100)} ${fmtOf('AU').date(ONE_DAY)}`);
check(/\$/.test(fmtOf('NZ').money(100)) && / km$/.test(fmtOf('NZ').distance(10)), `NZ format: ${fmtOf('NZ').money(100)}`);
check(createText({}, 'uk')('Color center catalog') === 'Colour centre catalogue', 'UK spelling');
check(findCountry('gb')?.id === 'UK' && findIndustry('PHARMA')?.id === 'pharma', 'URL aliases');
}

if (failures.length) {
  console.error(`\nStatic checks: ${failures.length} of ${checks} failed\n`);
  failures.slice(0, 80).forEach((f) => console.error(`  x ${f}`));
  if (failures.length > 80) console.error(`  ... and ${failures.length - 80} more`);
  process.exit(1);
}
console.log(`Static checks: ${checks} passed (${INDUSTRIES.length} industries, ${COUNTRIES.length} countries)`);
