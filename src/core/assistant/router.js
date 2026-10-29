// Builds the context object the assistant receives on every open:
// { screen, persona, accountId?, actionId?, visitId?, orderId?, filters? }

import { SCREEN_IDS } from './intents.js';

/** Persona for suggested questions: admin sees the manager set. */
export const assistantPersona = (persona) => (persona === 'rep' ? 'rep' : 'manager');

/**
 * @param {object} ctx  app context (m, data, ui)
 * @param {{name: string, args: string[]}} route
 * @param {string} persona
 * @param {object} [last]  the last non-Ask context, used when the Ask page is the current view
 */
export function contextFor(ctx, route, persona, last) {
  if (!ctx) return { screen: 'setup', persona };
  let name = route.name || { rep: 'today', manager: 'manager', admin: 'config' }[persona];
  if (name === 'ask' && last) return { ...last, persona, viaAsk: true };
  if (name === 'ask') name = persona === 'rep' ? 'today' : 'manager';
  const c = { screen: SCREEN_IDS.includes(name) ? name : 'today', persona };
  const [arg] = route.args || [];
  if (name === 'brief' || name === 'account' || name === 'complete') { c.accountId = arg; if (name !== 'account') c.visitId = arg; }
  if (name === 'order') { c.accountId = arg; c.orderId = arg; }
  if (name === 'action') {
    const it = ctx.m.findAction(arg);
    c.actionId = arg;
    if (it) { c.accountId = it.accountId; c.visitId = it.accountId; }
  }
  if (name === 'manager') c.filters = { route: ctx.ui?.exFilter || 'all' };
  if (c.accountId && !ctx.data.byId[c.accountId]) delete c.accountId;
  return c;
}

/** Links an answer may offer, as hash routes. Labels carry vocabulary tokens. */
export const link = {
  brief: (id) => ({ label: 'Go to the {visit} brief', href: `#/brief/${id}` }),
  account: (id) => ({ label: 'Open this {account}', href: `#/account/${id}` }),
  order: (id) => ({ label: 'Open the {order} builder', href: `#/order/${id}` }),
  action: (id) => ({ label: 'Open the action', href: `#/action/${id}` }),
  route: () => ({ label: 'See the route plan', href: '#/route' }),
  manager: () => ({ label: 'Open the exception queue', href: '#/manager' }),
  agents: () => ({ label: 'Open agent controls', href: '#/agents' }),
  config: () => ({ label: 'See how this is configured', href: '#/config' }),
  complete: (id) => ({ label: 'Finish the {visit}', href: `#/complete/${id}` }),
  today: () => ({ label: 'Back to Today', href: '#/today' }),
};
