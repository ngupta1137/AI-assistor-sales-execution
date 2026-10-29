// Assistant content for beverages and alcohol. Responsible marketing, local licensing and age rules come first.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} could host an activation night?', intent: 'answer:todayActivation' }] },
    brief: { rep: [{ q: 'What does the outlet license allow?', intent: 'answer:briefLicense' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How much keg stock is too much?', intent: 'answer:orderKeg' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When is the best time to visit a bar?', intent: 'answer:routeService' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'What does the agent do about age checks?', intent: 'answer:agentsAge' }],
      manager: [{ q: 'What does the agent do about age checks?', intent: 'answer:agentsAge' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Visit before service, pour a drink the way it should be served, and ask what is not selling. Offer menu design help and staff training under the trade agreement, not stock or favours. Staff must know how to check age and refuse service.',
    goodVisit: 'A good {visit} happens before service. You check the pour and the lines, agree one listing or activation, confirm the age-check signs are up, photograph what changed, and leave a {order} that covers the next two weekends and no more.',
    guardrailWhy: 'This assistant follows responsible marketing, local licensing and age rules before any sales suggestion.',
    todayActivation: 'The best candidates are bars and hotels with no event booked before the next holiday, steady sales and a manager who answers. The planner lists them in the brief with the date to book by. Every activation follows responsible marketing rules.',
    briefLicense: 'Each {account} holds its own license, with its own hours and limits. Check that an event is covered before you plan it. The agent never suggests anything that would break local licensing, and licensing rules come before any suggestion.',
    orderKeg: 'More than about two weekends of expected sales. Kegs go off, and a full cold room hides a problem with the lines. The draft is built from weekend sales and days left on the current keg, so it will not load the {account}.',
    routeService: 'Before evening service, between lunch and dinner. The manager has time then and the bar is quiet enough to check the lines. A visit during service wastes both of your time.',
    managerKam: 'The ones with an exclusive supply contract with another brand, and hotels with several outlets. Those need a decision at group level, not a coaching note to the {rep}.',
    agentsAge: 'The agent reminds the {account} to display age-check signs and to check ID. It never aims marketing at anyone under the legal drinking age, and an activation brief always includes the responsible service points.',
  },
  assistantRefusals: [
    {
      id: 'ref-age', guardrail: 'all1',
      patterns: ['under 18', 'under 21', 'underage', 'under age', 'teenagers', 'minors', 'students only'],
      refusal: 'I never suggest marketing aimed at people under the legal drinking age.',
      allowed: 'I can show the responsible service points for an activation night.',
    },
    {
      id: 'ref-license', guardrail: 'all2',
      patterns: ['without a licen', 'serve after', 'after hours', 'bypass the licen', 'around the licen'],
      refusal: 'Local licensing rules come first, so I cannot suggest anything that works around them.',
      allowed: 'I can show what an event needs to be covered by the outlet license.',
    },
    {
      id: 'ref-incentive', guardrail: 'gap1',
      patterns: ['free drinks', 'free beer', 'free keg', 'kickback', 'volume bonus', 'cash for the menu', 'pay the bar'],
      refusal: 'I do not suggest free drinks, cash or volume incentives to an outlet.',
      allowed: 'I can show the menu support and staff training allowed under the trade agreement.',
    },
    {
      id: 'ref-load', guardrail: 'order1',
      patterns: ['load the outlet', 'overstock', 'push extra kegs', 'fill the cold room', 'month end loading'],
      refusal: 'I do not plan stock beyond about two weekends of expected sales.',
      allowed: 'I can show how the quantity was worked out from weekend sales.',
    },
  ],
};
