// Assistant content for foodservice distribution: extra questions, industry phrasing, and refusals.
// Shared questions come from assistant-base.js. Everything here is specific to this industry.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} are about to change menu?', intent: 'answer:todayMenu' }] },
    brief: { rep: [{ q: 'What does the supply contract allow here?', intent: 'answer:briefContract' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not phone in the usual {order}?', intent: 'answer:orderUsual' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the kitchen is in service?', intent: 'answer:routeService' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent give an allergen answer?', intent: 'answer:agentsAllergen' }],
      manager: [{ q: 'Can an agent give an allergen answer?', intent: 'answer:agentsAllergen' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Start in the kitchen, not at the desk. Ask what is on the pass this week, listen for what is hard to source, and offer one thing that helps before you mention anything new. Keep it short: service starts soon.',
    goodVisit: 'A good {visit} fits between services and ends with something agreed in writing: a sample, a spec sheet handed over, a standing order or a menu date. Count the store room, fix the top item, and leave an {order} that matches what the kitchen really uses.',
    guardrailWhy: 'This assistant follows the contract price list and the rules your company set for the agents.',
    todayMenu: 'Look for {accounts} where the menu changes within a few weeks and a new product has not been trialed. The menu action in each brief shows the timing and how similar {accounts} in the same area did. Offer a sample case and a cost per portion.',
    briefContract: 'The supply contract sets prices, delivery days and minimum {order} sizes. The agent never suggests terms outside it. If the {contact} asks for more, log it and raise it with your {kam}.',
    orderUsual: 'Phoning in the usual {order} keeps the range flat and misses seasonal peaks. The draft starts from the weekly average and the days of cover from the last count, then adds focus and new lines the kitchen has a dish for. You can change every line.',
    routeService: 'If the kitchen is in service, move that {visit} to the quiet window after it. Use Mark closed today and the route re-plans. A short call after service beats a long wait at the back door.',
    managerKam: 'The ones with overrides that cite the supply contract, and hotels or caterers with a blocked action. Those need a decision at account level, not a coaching note to the {rep}.',
    agentsAllergen: 'No. Allergen and nutrition statements come only from the current spec sheet. An agent can remind the {rep} to hand over the sheet, and a person answers anything the sheet does not cover.',
  },
  assistantRefusals: [
    {
      id: 'ref-allergen', guardrail: 'gap1',
      patterns: ['is it gluten free', 'free from nuts', 'safe for allergies', 'allergen status', 'contains no nuts', 'vegan certified'],
      refusal: 'I cannot make allergen or nutrition statements. Those come only from the spec sheet.',
      allowed: 'I can remind you to hand over the current spec sheet and log a question it does not cover.',
    },
    {
      id: 'ref-terms', guardrail: 'all1',
      patterns: ['discount', 'lower price', 'special price', 'free case', 'side deal', 'rebate for', 'match their price'],
      refusal: 'I cannot suggest prices or terms outside the contract price list.',
      allowed: 'I can show what the contract allows and who to ask for an exception.',
    },
    {
      id: 'ref-load', guardrail: 'order1',
      patterns: ['stock them up', 'load the store room', 'overstock', 'push extra cases', 'fill their freezer', 'month end push'],
      refusal: 'I do not plan stock beyond what the venue can store and use before the date code.',
      allowed: 'I can show how the quantity was worked out and the days of cover from the last count.',
    },
    {
      id: 'ref-key', guardrail: 'planner1',
      patterns: ['drop this venue', 'remove the hotel', 'skip the caterer', 'stop visiting'],
      refusal: 'I do not drop a hotel or caterer on a supply contract without your {manager}.',
      allowed: 'I can show how the day re-plans if one stop is closed.',
    },
  ],
};
