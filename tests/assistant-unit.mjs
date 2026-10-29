// Engine checks without a browser: every suggested question, on every screen, for every persona,
// industry and country that has assistant content. Checks answers are real, grounded and clean.
// Run: node tests/assistant-unit.mjs   (also part of npm run test:static)

import { INDUSTRIES, COUNTRIES } from '../src/packs/index.js';
import { buildContext } from '../src/core/app.js';
import { answer, suggestionsFor, detectIntent, normalise } from '../src/core/assistant/engine.js';
import { contextFor } from '../src/core/assistant/router.js';
import { REQUIRED } from '../src/packs/assistant-base.js';

const failures = [];
let checks = 0;
const check = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

const ONLY = process.env.UNIT_ONLY ? process.env.UNIT_ONLY.split(',') : null;
const SCREENS = ['today', 'brief', 'account', 'action', 'order', 'complete', 'route', 'manager', 'agents', 'config', 'problems'];

export function routeFor(ctx, screen) {
  const first = ctx.data.planned.slice().sort((a, b) => a.rank - b.rank)[0];
  const args = screen === 'action' ? [first.actions[0].id] : ['brief', 'account', 'order', 'complete'].includes(screen) ? [first.accountId] : [];
  return { name: screen, args };
}

export function ctxFor(ind, country, persona) {
  const ctx = buildContext(ind.id, country.id);
  ctx.persona = persona;
  ctx.ui = {};
  ctx.app = {};
  return ctx;
}

if (process.argv[1] && process.argv[1].endsWith('assistant-unit.mjs')) {
  for (const ind of INDUSTRIES.filter((i) => i.assistantContext)) {
    for (const country of COUNTRIES) {
      if (ONLY && !ONLY.includes(`${ind.id}:${country.id}`) && !ONLY.includes(ind.id)) continue;
      for (const persona of ['rep', 'manager', 'admin']) {
        const ctx = ctxFor(ind, country, persona);
        for (const screen of SCREENS) {
          const c = contextFor(ctx, routeFor(ctx, screen), persona);
          const list = suggestionsFor(ctx, c);
          const key = persona === 'rep' ? 'rep' : 'manager';
          if ((REQUIRED[key] || []).includes(screen)) check(list.length >= 4 && list.length <= 6, `${ind.id}x${country.id} ${persona} ${screen}: ${list.length} suggestions`);
          for (const s of list) {
            const tag = `${ind.id}x${country.id} ${persona} ${screen} "${s.q}"`;
            const r = answer(ctx, s.q, c, { intent: s.intent });
            check(!r.error, `${tag}: error ${r.error}`);
            check(!r.fallback && !r.refusal, `${tag}: no real answer (${r.text.slice(0, 80)})`);
            check(r.text && r.text.length > 20, `${tag}: empty answer`);
            check(r.basedOn && r.basedOn.length > 5, `${tag}: missing basedOn line`);
            const all = `${r.text} ${r.basedOn} ${(r.links || []).map((l) => l.label).join(' ')}`;
            check(!/\{[A-Za-z]+\}/.test(all), `${tag}: unresolved token in "${all.match(/\{[A-Za-z]+\}/)?.[0]}": ${r.text.slice(0, 120)}`);
            check(!/undefined|NaN|\[object|null\b/.test(all), `${tag}: bad value in "${r.text.slice(0, 120)}"`);
            check(!/[—–]/.test(all), `${tag}: dash in answer`);
            for (const w of ind.forbidden) check(!new RegExp(`\\b${w}\\b`, 'i').test(all), `${tag}: forbidden word "${w}" in "${r.text.slice(0, 160)}"`);
            for (const l of r.links || []) check(/^#\/[a-z]+(\/[A-Za-z0-9-]+)?$/.test(l.href), `${tag}: bad link ${l.href}`);
          }
        }
      }
    }
  }
  if (failures.length) {
    console.error(`\nAssistant unit checks: ${failures.length} of ${checks} failed\n`);
    failures.slice(0, 60).forEach((f) => console.error(`  x ${f}`));
    process.exit(1);
  }
  console.log(`Assistant unit checks: ${checks} passed`);
}
