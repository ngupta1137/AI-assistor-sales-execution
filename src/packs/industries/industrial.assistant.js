// Assistant content for industrial supplies: extra questions, industry phrasing, and refusals.
// Shared questions come from assistant-base.js. Everything here is specific to this industry.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have a shutdown coming?', intent: 'answer:todayShutdown' }] },
    brief: { rep: [{ q: 'What does the service agreement allow here?', intent: 'answer:briefAgreement' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not just ship the same box again?', intent: 'answer:orderSame' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the line is down when I arrive?', intent: 'answer:routeLine' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent say a part is rated for a job?', intent: 'answer:agentsRating' }],
      manager: [{ q: 'Can an agent say a part is rated for a job?', intent: 'answer:agentsRating' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Go where the work is. Ask what failed or ran low this week, look at it together and agree one thing you can fix before you leave. Maintenance leads trust a rep who admits what they do not know and routes it to the technical desk.',
    goodVisit: 'A good {visit} fits around the line, not through it. Count the crib, settle the urgent item first, record any datasheet question and leave an {order} that matches real use. End with a date for the next stock check.',
    guardrailWhy: 'This assistant follows the contract price list, the maker datasheets and the rules your company set for the agents.',
    todayShutdown: 'Look at {accounts} whose maintenance calendar shows a planned stop in the next weeks. The shutdown action in each brief shows the date, the job list and what the {account} bought last time. Plan stock early so it can be reserved.',
    briefAgreement: 'The service agreement sets the contract prices, the delivery rules and the minimum levels for stocked items. The agent never suggests terms outside it. If the {contact} asks for more, log it and raise it with your {kam}.',
    orderSame: 'Shipping the same box again keeps the {account} on urgent single-box buys. The draft starts from the minimum level, the days of use left and the delivery lead time, then adds focus items the {account} has a job for. You can change every line.',
    routeLine: 'If the line is down, the team is busy and the {contact} will not have time. Use Mark closed today, then the route re-plans. Return at the next shift change and keep it short.',
    managerKam: 'The ones with overrides that cite the service agreement, and plants with a blocked action. Those need a decision at account level, not a coaching note to the {rep}.',
    agentsRating: 'No. Rating, load and pressure answers come from the technical desk and the maker datasheet. An agent can flag a mismatch between a job note and the datasheet, and a person decides what to do.',
  },
  assistantRefusals: [
    {
      id: 'ref-rating', guardrail: 'gap1',
      patterns: ['is it rated for', 'safe working load', 'max pressure', 'will it hold', 'torque limit', 'safe to use on'],
      refusal: 'I cannot answer load, pressure or rating questions. The technical desk and the datasheet do.',
      allowed: 'I can share the datasheet and flag the question for the technical desk.',
    },
    {
      id: 'ref-price', guardrail: 'all1',
      patterns: ['special price', 'extra discount', 'cut the price', 'off contract', 'price match', 'quote it at'],
      refusal: 'I cannot set a price or a discount. The pricing desk sets prices from the contract list.',
      allowed: 'I can log the quote request with the details the pricing desk needs.',
    },
    {
      id: 'ref-stock', guardrail: 'order1',
      patterns: ['buy extra stock', 'stock them up', 'overload the crib', 'push more boxes', 'year end loading'],
      refusal: 'I do not suggest more than the site can store or use before the shelf life on the label.',
      allowed: 'I can show how the quantity was set from the minimum level and the days of use left.',
    },
    {
      id: 'ref-plant', guardrail: 'planner1',
      patterns: ['drop this plant', 'remove the key plant', 'skip the strategic account', 'stop visiting'],
      refusal: 'I do not drop a plant on a service agreement without your {manager}.',
      allowed: 'I can show how the day re-plans if one stop closes.',
    },
  ],
};
