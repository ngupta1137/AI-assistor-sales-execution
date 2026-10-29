// Assistant content for agri inputs. Crop protection advice follows the product label only;
// credit decisions stay with people; demo results are observations, not yield promises.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} need pre-season stock first?', intent: 'answer:todayStock' }] },
    brief: { rep: [{ q: 'What does the product label cover?', intent: 'answer:briefLabel' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How is a season {order} different from a normal one?', intent: 'answer:orderSeason' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When is the best time to see a grower?', intent: 'answer:routeCrop' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Who decides credit for a {account}?', intent: 'answer:agentsCredit' }],
      manager: [{ q: 'Who decides credit for a {account}?', intent: 'answer:agentsCredit' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Ask about the crop and the stage before you talk about a product. Read the label together if the question is about a spray: crop, pest, rate, interval and protective equipment. If it is not on the label, do not recommend it, and point to the agronomist.',
    goodVisit: 'A good {visit} is timed to the crop. You walk the plot or the shelf, check stock against the season plan, give advice only from the label and log it, train the counter if needed, and agree dates for dues and the next {visit}.',
    guardrailWhy: 'This assistant follows the product label for crop protection and leaves credit and agronomy decisions to people.',
    todayStock: '{Accounts} with the fewest days of cover against expected season demand come first. The Order agent plans the stock in two drops, so the {account} is not carrying everything at once. The brief shows days of cover for each line.',
    briefLabel: 'The label lists the crops, pests, rates, intervals before harvest and the protective equipment. The app does not restate them. Read the printed label on the pack. For anything it does not cover, ask the agronomist.',
    orderSeason: 'A season {order} follows the planting area and the sowing date, in two drops. A normal {order} follows the last few weeks of sales. The reasons on each line say which one applies. Neither goes above expected demand.',
    routeCrop: 'Around the crop stage: sowing, early growth and flowering are when decisions are made. The planner uses the sowing date you recorded. Rain can move it, and the route re-plans when you mark a stop closed.',
    managerKam: 'The ones on credit hold, cooperatives with a member program waiting for approval, and any {account} where field work stopped for weather. Those need a decision at account level.',
    agentsCredit: 'People decide. Credit teams set terms and limits. The agent can share a statement and help agree a payment date. It never extends credit or changes a limit.',
  },
  assistantRefusals: [
    {
      id: 'ref-label', guardrail: 'all1',
      patterns: ['what dose', 'dosage', 'how much to spray', 'tank mix', 'spray rate', 'off-label', 'off label', 'can i use it on'],
      refusal: 'Crop protection advice follows the product label only. I do not state rates or uses.',
      allowed: 'I can point to the label on the pack and to the agronomist for anything it does not cover.',
    },
    {
      id: 'ref-credit', guardrail: 'all2',
      patterns: ['extend credit', 'more credit', 'raise the credit', 'credit limit to', 'approve credit', 'waive the'],
      refusal: 'I cannot extend or change credit. People decide.',
      allowed: 'I can show the season statement and help agree a payment date.',
    },
    {
      id: 'ref-yield', guardrail: 'gap1',
      patterns: ['yield will', 'how much yield', 'guarantee', 'promise a yield', 'increase my yield by', 'extra bags'],
      refusal: 'I do not promise yield. Demo plot results are observations from one field.',
      allowed: 'I can show the plot photos and what they record, as observations.',
    },
    {
      id: 'ref-stock', guardrail: 'order1',
      patterns: ['stock above', 'load the dealer', 'overstock', 'push extra bags', 'dump stock'],
      refusal: 'I do not plan season stock above expected demand.',
      allowed: 'I can show how the season plan was worked out and how the two drops are split.',
    },
  ],
};
