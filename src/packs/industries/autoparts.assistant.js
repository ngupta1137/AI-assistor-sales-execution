// Assistant content for auto parts. Genuine parts only, warranty outcomes belong to the warranty team,
// parts follow the vehicle maker's specification, and fleets under contract review keep their visits.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} are low on fast-moving parts?', intent: 'answer:todayFast' }] },
    brief: { rep: [{ q: 'How do I check a part is genuine?', intent: 'answer:briefGenuine' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How do I know a part fits the vehicle?', intent: 'answer:orderFit' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When are workshops free to talk?', intent: 'answer:routeBays' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Who decides a warranty claim?', intent: 'answer:agentsWarranty' }],
      manager: [{ q: 'Who decides a warranty claim?', intent: 'answer:agentsWarranty' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Start at the parts rack and ask what they bought elsewhere last month. Mechanics fit what is on the shelf, so talk about stock, then training. Collect warranty facts without promising an outcome, and check suspect packs with a scan.',
    goodVisit: 'A good {visit} happens before the first car is on the lift. The rack is checked against the usual fast movers, a scan confirms genuine stock, any warranty part is collected with the invoice, and the {order} covers about two weeks of jobs.',
    guardrailWhy: 'This assistant sells genuine parts to specification and leaves warranty decisions to the warranty team.',
    todayFast: '{Accounts} that bought the brand from other suppliers last month, or whose rack count is low on the top lines, come first. The brief names the lines and the quantity for about two weeks of jobs.',
    briefGenuine: 'Scan the batch code against the genuine-part register and check the hologram. A code that is not in the register is suspect. Report it to brand protection, photograph it, and do not remove or sell the stock yourself.',
    orderFit: 'Check the vehicle maker\'s specification and the fitment list for the local models. The app does not suggest a part outside the specification. If the fitment is unclear, ask the technical team before you order.',
    routeBays: 'Early, before the first car is on the lift, or in the lull after lunch. Training and rack checks need the mechanics free for about twenty minutes. A visit in the middle of a job wastes the owner\'s time.',
    managerKam: 'The ones with a fleet contract under review, a warranty claim open for weeks, and accounts reporting suspect stock. Those need a decision at account level.',
    agentsWarranty: 'The warranty team decides. The agent can list the facts to collect: the failed part, the invoice and the fitting date. It never promises a replacement and never predicts the outcome.',
  },
  assistantRefusals: [
    {
      id: 'ref-fake', guardrail: 'all1',
      patterns: ['sell the fake', 'sell counterfeit', 'move the fake', 'relabel', 'repack', 'cheaper copy', 'grey market'],
      refusal: 'Genuine parts only. I never suggest selling or moving a suspected counterfeit.',
      allowed: 'I can show how to scan a batch and where to report suspect stock.',
    },
    {
      id: 'ref-warranty', guardrail: 'gap1',
      patterns: ['approve the claim', 'promise a replacement', 'will be covered', 'promise the claim', 'free replacement'],
      refusal: 'I cannot promise a warranty outcome. The warranty team decides.',
      allowed: 'I can list the facts to collect for the claim.',
    },
    {
      id: 'ref-spec', guardrail: 'order1',
      patterns: ['fit any car', 'any engine', 'universal part', 'substitute part', 'different grade', 'does not match the spec'],
      refusal: 'I never suggest a part outside the vehicle maker\'s specification.',
      allowed: 'I can show the fitment list and ask the technical team about a doubtful case.',
    },
    {
      id: 'ref-fleet', guardrail: 'planner1',
      patterns: ['drop the fleet', 'skip the fleet', 'stop the fleet', 'cancel the fleet visit'],
      refusal: 'Fleet accounts under contract review keep their {visits}. Changes need your {kam}.',
      allowed: 'I can show how the route looks with a routine stop closed instead.',
    },
  ],
};
