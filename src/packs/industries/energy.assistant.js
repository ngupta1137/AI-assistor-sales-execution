// Assistant content for solar and home energy: extra questions, industry phrasing, and refusals.
// Shared questions come from assistant-base.js. Everything here is specific to this industry.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have projects waiting on stock?', intent: 'answer:todayProjects' }] },
    brief: { rep: [{ q: 'What does the channel agreement allow here?', intent: 'answer:briefChannel' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not reorder what we shipped last time?', intent: 'answer:orderHabit' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the crew is out on a roof?', intent: 'answer:routeCrew' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent quote a saving for a system?', intent: 'answer:agentsSaving' }],
      manager: [{ q: 'Can an agent quote a saving for a system?', intent: 'answer:agentsSaving' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Ask about the next three projects before you mention a product. Technical buyers want to know what will be ready when the crew arrives. Listen for a part they are worried about and fix that first.',
    goodVisit: 'A good {visit} starts from the project list and ends with stock reserved against it. Check what is short, settle one open question, log anything technical for the right team and leave an {order} that matches the confirmed jobs.',
    guardrailWhy: 'This assistant follows the channel price list, the maker documents and the rules your company set for the agents.',
    todayProjects: 'Look at {accounts} whose project list shows installs starting in the next weeks with a part not yet on the shelf. The stock plan action in each brief names the parts and the lead times. Start with the earliest start date.',
    briefChannel: 'The channel agreement sets the price list, the delivery rules and the support routes. The agent never suggests terms outside it. If the {contact} asks for more, log it and raise it with your {kam}.',
    orderHabit: 'Reordering what shipped last time ignores what the {account} is actually installing next. The draft starts from the confirmed project list and stock left, then adds focus lines that the projects use. You can change every line.',
    routeCrew: 'If the crew is out on a roof, the {contact} is hard to reach. Use Mark closed today and the route re-plans. Return on a yard day, and confirm by message the day before.',
    managerKam: 'The ones with overrides that cite the channel agreement, and wholesalers with a blocked action. Those need a decision at account level, not a coaching note to the {rep}.',
    agentsSaving: 'No. Savings, payback and output figures for a customer\'s roof come from a qualified designer. An agent can share the datasheets and book a call with the technical team.',
  },
  assistantRefusals: [
    {
      id: 'ref-saving', guardrail: 'gap1',
      patterns: ['how much will it save', 'payback period', 'pay itself off', 'annual output', 'bill reduction', 'cut their bills'],
      refusal: 'I cannot state a saving, payback or output figure. A qualified designer does that for each roof.',
      allowed: 'I can share the datasheets and book a call with the technical team.',
    },
    {
      id: 'ref-terms', guardrail: 'all1',
      patterns: ['special price', 'extra discount', 'free inverter', 'off the price list', 'side deal', 'rebate for'],
      refusal: 'I cannot suggest prices or terms outside the channel price list.',
      allowed: 'I can show what the channel agreement allows and log a quote request for the pricing desk.',
    },
    {
      id: 'ref-stock', guardrail: 'order1',
      patterns: ['stock them up', 'overload the warehouse', 'push extra pallets', 'quarter end loading', 'buy ahead of need'],
      refusal: 'I do not suggest more stock than the confirmed projects and the maker storage rules allow.',
      allowed: 'I can show how the quantity was built from the project list and stock left.',
    },
    {
      id: 'ref-key', guardrail: 'planner1',
      patterns: ['drop this wholesaler', 'remove the key branch', 'skip the wholesaler', 'stop visiting'],
      refusal: 'I do not drop an electrical wholesaler on a channel agreement without your {manager}.',
      allowed: 'I can show how the route changes if one stop is closed.',
    },
  ],
};
