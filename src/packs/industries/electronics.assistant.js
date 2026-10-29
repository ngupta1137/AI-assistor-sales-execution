// Assistant content for consumer electronics. Price promises follow the retailer agreement;
// product claims use the approved feature sheet; launch weeks keep their visits.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} need a launch display?', intent: 'answer:todayLaunch' }] },
    brief: { rep: [{ q: 'What can a promoter say about a model?', intent: 'answer:briefClaims' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How many weeks of sell-out should an {order} cover?', intent: 'answer:orderWeeks' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if a launch day clashes with a {visit}?', intent: 'answer:routeLaunch' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'What does the agent do about price tags?', intent: 'answer:agentsTags' }],
      manager: [{ q: 'What does the agent do about price tags?', intent: 'answer:agentsTags' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Start on the floor, with the demo wall. Check that every unit is on and running the store demo, then look at display share and price tags against the promotion file. Promoters sell the model, so give them the approved feature sheet and nothing else.',
    goodVisit: 'A good {visit} is timed for a weekday morning. Demo units are live, tags match the retailer promotion file, promoters have signed the training log, and the launch display is built to the plan. You photograph the wall and leave a {order} for about two weeks of sell-out.',
    guardrailWhy: 'This assistant follows the retailer agreement on prices, uses only the approved feature sheet for claims, and keeps launch week visits.',
    todayLaunch: '{Accounts} where the launch kit has arrived but the display is not built come first, then those with the biggest wall share gap. The brief shows the launch date and the checklist to follow.',
    briefClaims: 'Only points from the approved feature sheet, one at a time. A promoter can say what a model does. Comparisons with other brands, speed claims and battery claims need approved material. If it is not on the sheet, do not say it.',
    orderWeeks: 'About two weeks of sell-out for a model. More ties up the {account}\'s cash and makes aged stock. Launch models get an opening quantity instead, because there is no history yet.',
    routeLaunch: 'Launch weeks keep their {visits}. If a routine {visit} clashes, move the routine one: use Mark closed today on it and the route re-plans. Moving a launch visit needs your {manager}.',
    managerKam: 'The ones where the retailer agreement blocked a display or a price promise, and chains with a launch at risk. Those need a decision at group level, not coaching.',
    agentsTags: 'The agent compares each tag with the retailer\'s promotion file and flags a mismatch. The retailer sets prices. The agent never changes a tag and never promises a price.',
  },
  assistantRefusals: [
    {
      id: 'ref-price', guardrail: 'all1',
      patterns: ['price protection', 'price drop cover', 'price match', 'guarantee the price', 'refund the difference', 'match the online'],
      refusal: 'I never offer price protection or promise a price. Price promises follow the retailer agreement.',
      allowed: 'I can flag a tag that does not match the promotion file.',
    },
    {
      id: 'ref-claims', guardrail: 'gap1',
      patterns: ['best phone', 'better than', 'fastest', 'battery lasts', 'waterproof', 'safest', 'no lag'],
      refusal: 'I only use points from the approved feature sheet.',
      allowed: 'I can show the approved points for this model.',
    },
    {
      id: 'ref-stock', guardrail: 'order1',
      patterns: ['stock for six months', 'load the store', 'overstock', 'channel stuffing', 'push extra units', 'month end loading'],
      refusal: 'I do not suggest more than about two weeks of sell-out for a model.',
      allowed: 'I can show the sell-out trend behind the suggested quantity.',
    },
    {
      id: 'ref-launch', guardrail: 'planner1',
      patterns: ['skip the launch', 'move the launch visit', 'cancel the launch', 'postpone the launch'],
      refusal: 'Launch weeks keep their {visits}. Moving one needs your {manager}.',
      allowed: 'I can show the route with a routine stop closed instead.',
    },
  ],
};
