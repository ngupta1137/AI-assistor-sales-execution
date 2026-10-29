// Assistant content for consumer goods: extra questions, industry phrasing, and refusals.
// Shared questions come from assistant-base.js. Everything here is specific to this industry.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} are at risk of empty shelves?', intent: 'answer:todayShelf' }] },
    brief: { rep: [{ q: 'What does the retailer agreement allow here?', intent: 'answer:briefAgreement' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: "Why not repeat last week's {order}?", intent: 'answer:orderRepeat' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the delivery has not arrived?', intent: 'answer:routeDelivery' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent change a shelf price?', intent: 'answer:agentsPrice' }],
      manager: [{ q: 'Can an agent change a shelf price?', intent: 'answer:agentsPrice' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Start with the shelf, not the pitch. Walk the aisle with the {contact}, point at the gap you can both see, and agree one fix before you leave. Keep it short: they are working the floor.',
    goodVisit: 'A good {visit} is short and ends with something changed on the shelf. Check the empty days first, fix the top gap, confirm the display or listing you agreed, take the photo, and leave a {order} that matches what the shelf sells.',
    guardrailWhy: 'This assistant follows each retailer agreement and the rules your company set for the agents.',
    todayShelf: 'Look for {accounts} with empty days on core lines and little back stock. The out-of-stock action in each brief shows the days missed and how similar {accounts} in the same area compare. Fix the ordering gap, not only the shelf.',
    briefAgreement: 'The retailer agreement sets what a supplier may do: how many displays, where material may go, what shelf space is agreed. The agent never suggests terms outside it. If the {contact} asks for more, log it and raise it with your {kam}.',
    orderRepeat: 'Copying the last {order} keeps the range flat and misses new lines. The draft starts from sell-through and days of cover, then adds the focus and new lines the {account} has space for. You can change every line.',
    routeDelivery: 'If the delivery is late, move that {visit} to the day after it lands, so the shelf can be filled and checked in one trip. Use Mark closed today for now and the route re-plans.',
    managerKam: 'The ones with overrides that cite the retailer agreement, and key {accounts} with a blocked action. Those need a decision at account level, not a coaching note to the {rep}.',
    agentsPrice: 'No. The store sets its own shelf prices. An agent can flag a tag that does not match the retailer price file, and the store corrects it.',
  },
  assistantRefusals: [
    {
      id: 'ref-price', guardrail: 'gap1',
      patterns: ['change the price', 'set the price', 'lower the price', 'raise the price', 'reprice', 'price tag to', 'shelf price to'],
      refusal: 'I cannot set or change a shelf price. The store sets its own prices.',
      allowed: 'I can flag a price that does not match the retailer price file.',
    },
    {
      id: 'ref-terms', guardrail: 'all1',
      patterns: ['discount', 'extra margin', 'free goods', 'free stock', 'side deal', 'pay for the display', 'pay the store', 'kickback', 'bonus to the store'],
      refusal: 'I cannot suggest terms outside the retailer agreement.',
      allowed: 'I can show what the agreement allows for a display or a promotion.',
    },
    {
      id: 'ref-load', guardrail: 'order1',
      patterns: ['load the store', 'load up the store', 'stuff the store', 'overstock', 'fill the back room', 'push extra stock', 'month end loading'],
      refusal: 'I do not plan stock beyond about two weeks of expected sales.',
      allowed: 'I can show how the quantity was worked out and what the shelf actually sells.',
    },
    {
      id: 'ref-key', guardrail: 'planner1',
      patterns: ['drop this store', 'remove the key account', 'skip the key account', 'stop visiting'],
      refusal: 'I do not drop a key account from the plan without your {manager}.',
      allowed: 'I can show what the route looks like if a stop closes today.',
    },
  ],
};
