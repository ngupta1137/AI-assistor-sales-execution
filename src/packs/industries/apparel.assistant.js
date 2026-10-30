// Assistant content for apparel and footwear: extra questions, industry phrasing, and refusals.
// Shared questions come from assistant-base.js. Everything here is specific to this industry.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have the buying window closing?', intent: 'answer:todayWindow' }] },
    brief: { rep: [{ q: 'What does the trade agreement allow here?', intent: 'answer:briefTrade' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not copy last season\'s {order}?', intent: 'answer:orderLast' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the {contact} has to cancel?', intent: 'answer:routeCancel' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent suggest a resale price?', intent: 'answer:agentsResale' }],
      manager: [{ q: 'Can an agent suggest a resale price?', intent: 'answer:agentsResale' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Start with what sold, not with the new range. Ask the {contact} which styles moved and which did not, listen, then show the one new style that answers a gap. A buyer who feels heard decides faster.',
    goodVisit: 'A good {visit} is built on the sell-through numbers. Walk the floor, repair what is broken first, show one new idea, and leave with a clear next step: a reorder, a sample or a date for the pre-season order.',
    guardrailWhy: 'This assistant follows the trade agreement, the season price list and the rules your company set for the agents.',
    todayWindow: 'Look at {accounts} whose buying window closes within a few weeks and that have not placed a pre-season {order}. The pre-season action in each brief shows the days left and last season\'s result. Start with the largest.',
    briefTrade: 'The trade agreement sets the wholesale prices, exchange windows and the order budget. The agent never suggests terms outside it. If the {contact} asks for more, log it and raise it with your {kam}.',
    orderLast: 'Copying last season\'s {order} repeats last season\'s misses. The draft starts from sell-through and the size curve of what actually sold, then adds focus and new styles that the {account} has floor space for. You can change every line.',
    routeCancel: 'If the {contact} cancels, use Mark closed today and the route re-plans. Offer another weekday away from the trading peak, and send a confirmation the day before.',
    managerKam: 'The ones with overrides that cite the trade agreement, and department stores with a blocked action. Those need a decision at account level, not a coaching note to the {rep}.',
    agentsResale: 'No. The {account} sets its own resale prices. An agent can show the wholesale price list and sell-through, and a person agrees the order.',
  },
  assistantRefusals: [
    {
      id: 'ref-resale', guardrail: 'gap1',
      patterns: ['retail price', 'resale price', 'sell it at', 'price it at', 'mark it down to', 'markdown to'],
      refusal: 'I cannot recommend a resale price or a markdown. The retailer sets its own.',
      allowed: 'I can show the wholesale price list and how the style sold through.',
    },
    {
      id: 'ref-terms', guardrail: 'all1',
      patterns: ['extra discount', 'free goods', 'better terms', 'longer payment', 'side deal', 'secret rebate'],
      refusal: 'I cannot suggest terms outside the trade agreement and the season price list.',
      allowed: 'I can show what the trade agreement allows and who to ask for an exception.',
    },
    {
      id: 'ref-budget', guardrail: 'order1',
      patterns: ['go over the budget', 'push more styles', 'load the retailer', 'overbook the order', 'fill the stockroom', 'end of season dump'],
      refusal: 'I do not suggest an order above the retailer\'s agreed order budget.',
      allowed: 'I can show how the quantities were built from sell-through and weeks of cover.',
    },
    {
      id: 'ref-dept', guardrail: 'planner1',
      patterns: ['drop this department store', 'remove the key retailer', 'skip the department store', 'stop visiting'],
      refusal: 'I do not drop a department store on a trade agreement without your {manager}.',
      allowed: 'I can show how the schedule changes if one appointment is moved.',
    },
  ],
};
