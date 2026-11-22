// Personas: who can sign in, their home screen, nav, title and named person.
// The partner persona exists only in packs where a partner takes the order.
// People beyond rep, manager, admin and key account lead use their own seeded generator,
// so generated data and existing names never change.

import { createRng } from './rng.js';

export const PERSONAS = ['rep', 'salesman', 'manager', 'kam', 'partner', 'admin', 'exec'];

export const HOME = { rep: 'today', salesman: 'sales', manager: 'manager', kam: 'kam', partner: 'partner', admin: 'config', exec: 'exec' };

export const NAV = {
  rep: [['today', 'Today', 'home'], ['brief', 'Brief', 'brief'], ['companion', 'Companion', 'companion'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config']],
  salesman: [['sales', 'Route', 'route'], ['companion', 'Companion', 'companion'], ['system', 'System', 'pulse'], ['config', 'Config', 'config']],
  manager: [['manager', 'Team', 'team'], ['health', 'Health', 'heart'], ['system', 'System', 'pulse'], ['companion', 'Companion', 'companion'], ['config', 'Config', 'config']],
  kam: [['kam', 'Accounts', 'brief'], ['system', 'System', 'pulse'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config']],
  partner: [['partner', 'Partner', 'sync'], ['system', 'System', 'pulse'], ['config', 'Config', 'config']],
  admin: [['config', 'Config', 'config'], ['system', 'System', 'pulse'], ['agents', 'Agents', 'agent'], ['problems', 'Problems', 'bulb'], ['manager', 'Team', 'team']],
  exec: [['exec', 'Overview', 'sun'], ['system', 'System', 'pulse'], ['agents', 'Agents', 'agent'], ['config', 'Config', 'config']],
};

/** Labels used outside a pack (setup screen before a pack is picked, presenter menu). */
export const PERSONA_INFO = {
  rep: { label: 'Field rep', text: 'A ranked day and an explained plan for every {visit}.' },
  salesman: { label: 'Order-led rep', text: 'Many short {visits} where the {order} leads.' },
  manager: { label: 'Manager', text: 'Team view, exceptions and {account} health.' },
  kam: { label: 'Key account lead', text: 'Key {accounts}, agreements and offer targeting.' },
  partner: { label: 'Partner', text: '{Orders} received, data shared, integration model.' },
  admin: { label: 'Sales ops admin', text: 'Configuration, activation and agent controls.' },
  exec: { label: 'Executive', text: 'Capabilities, adoption and the value case.' },
};

/** Governance role for rights checks. */
export const roleKey = (persona) => ({ admin: 'ops', salesman: 'rep' }[persona] || persona);

/** Personas available in this pack. */
export const personasFor = (industry) => PERSONAS.filter((p) => p !== 'partner' || !!industry?.execution?.partner);

export const validPersona = (industry, persona) => personasFor(industry).includes(persona);

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Title of a persona in this pack. */
export function titleFor(industry, persona) {
  const r = industry.execution?.roles || {};
  return {
    rep: industry.personas.rep, manager: industry.personas.manager, admin: industry.personas.admin,
    kam: cap(industry.vocab.kam), salesman: r.salesman, partner: r.partner, exec: r.exec,
  }[persona] || PERSONA_INFO[persona]?.label || persona;
}

/** Extra people for the added personas, memoized on the data object. */
export function extraPeople(industry, country, data) {
  if (data._extraPeople) return data._extraPeople;
  const rng = createRng(`people2|${data.seedKey}`);
  const used = new Set([data.rep, data.manager, data.admin, data.kam, ...(data.reps || [])].map((p) => p?.name));
  const person = () => {
    for (let i = 0; i < 60; i++) {
      const p = { first: rng.pick(country.firstNames), last: rng.pick(country.lastNames) };
      const name = `${p.first} ${p.last}`;
      if (!used.has(name)) { used.add(name); return { ...p, name }; }
    }
    const p = { first: rng.pick(country.firstNames), last: rng.pick(country.lastNames) };
    return { ...p, name: `${p.first} ${p.last}` };
  };
  const ex = industry.execution || {};
  const out = {
    salesman: { ...person(), title: ex.roles?.salesman, city: data.city.name },
    exec: { ...person(), title: ex.roles?.exec, city: data.city.name },
  };
  if (ex.partner) {
    const lead = person();
    out.partner = { ...lead, title: ex.roles?.partner, city: data.city.name, company: `${lead.last} ${cap(ex.partner)}s` };
  }
  data._extraPeople = out;
  return out;
}

/** The named person signed in as this persona. */
export function personFor(ctx, persona) {
  const { data, industry, country } = ctx;
  if (persona === 'manager') return data.manager;
  if (persona === 'admin') return data.admin;
  if (persona === 'kam') return data.kam;
  if (['salesman', 'partner', 'exec'].includes(persona)) return extraPeople(industry, country, data)[persona] || data.rep;
  return data.rep;
}
