// Assistant content for building materials and paints. Quotes above the threshold need approval;
// discounts and credit are decided by people; performance claims use the approved data sheet.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have a project at finishing stage?', intent: 'answer:todayProjects' }] },
    brief: { rep: [{ q: 'What counts as an approved quote?', intent: 'answer:briefQuote' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How is dealer stock different from a project quote?', intent: 'answer:orderQuote' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When are dealers free to talk?', intent: 'answer:routeCounter' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Who decides credit for a dealer?', intent: 'answer:agentsCredit' }],
      manager: [{ q: 'Who decides credit for a dealer?', intent: 'answer:agentsCredit' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'With a dealer, start at the counter: shade display, tinting machine, stock. With a contractor, talk about the job on site and surface preparation. With an architect, bring the specification sheet and a finished sample, and leave pricing for the approval route.',
    goodVisit: 'A good {visit} changes something people can see: a fresh shade display, a calibrated machine, a contractor trial or a specification sheet in an architect\'s hands. You log it with a photo or signature and leave a stock plan for about four weeks of sales.',
    guardrailWhy: 'This assistant never offers a discount, never touches credit terms, and quotes performance only from the approved data sheet.',
    todayProjects: 'Projects with a site update in the next few weeks appear as project lead actions. The planner puts them early in the day when the project manager is on site. The value shown is an estimate, and quotes above the threshold need approval.',
    briefQuote: 'A quote above the threshold goes to your {manager} for approval before it is sent. The agent never offers a discount and never adds special terms. Lines in a quote come from the finish schedule, not from a stock plan.',
    orderQuote: 'A dealer {order} is stock for about four weeks of counter sales. A project quote follows the finish schedule and the bill of quantities. The quantity logic differs, so the reasons on each line differ too.',
    routeCounter: 'Early in the morning or in the quiet hours after lunch, before contractors arrive for pickups. The counter is busy at the start of the day. A quiet slot also leaves room to refresh the shade display.',
    managerKam: 'The ones with a project put on hold, a quote waiting for approval, or an account on credit hold. Those need a decision at account level, not coaching.',
    agentsCredit: 'Finance decides credit terms and limits. The agent can share a statement and help agree a payment date, nothing more. It never extends credit or changes terms.',
  },
  assistantRefusals: [
    {
      id: 'ref-discount', guardrail: 'all1',
      patterns: ['discount', 'best price', 'special price', 'match the competitor', 'lower the quote', 'price cut'],
      refusal: 'I never offer a discount. Quotes above the threshold need your {manager}\'s approval.',
      allowed: 'I can show the approval rule and what a quote needs before it goes to approval.',
    },
    {
      id: 'ref-credit', guardrail: 'all2',
      patterns: ['extend credit', 'more credit', 'raise the credit', 'credit limit to', 'approve credit', 'write off'],
      refusal: 'I cannot change credit terms or limits. Finance decides.',
      allowed: 'I can show the statement and help agree a payment date.',
    },
    {
      id: 'ref-loading', guardrail: 'order1',
      patterns: ['load the dealer', 'push stock', 'month end push', 'dump stock', 'hit the target with stock'],
      refusal: 'I do not push stock beyond about four weeks of sell-out.',
      allowed: 'I can show how the stock plan was worked out from counter sales.',
    },
    {
      id: 'ref-claims', guardrail: 'gap1',
      patterns: ['lasts longer', 'guarantee', 'lifetime', 'will never peel', 'ten years', 'twenty years'],
      refusal: 'I only state performance from the approved data sheet.',
      allowed: 'I can show the data sheet figures for this product and how to apply it.',
    },
  ],
};
