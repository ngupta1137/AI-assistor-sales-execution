// Assistant content for telecom retail. No activation without valid ID; offers follow the published tariff.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} will run out of float today?', intent: 'answer:todayFloat' }] },
    brief: { rep: [{ q: 'What does KYC need at the counter?', intent: 'answer:briefKyc' }] },
    account: { rep: [{ q: 'How do I talk to the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why is there a float cap?', intent: 'answer:orderFloat' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'When is the evening recharge peak?', intent: 'answer:routePeak' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'What does the agent do about KYC?', intent: 'answer:agentsKyc' }],
      manager: [{ q: 'What does the agent do about KYC?', intent: 'answer:agentsKyc' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Visit before the evening rush, when the owner can talk. Check float and SIM stock first, then branding. Ask how many customers were turned away this week, and show the KYC records that are incomplete. Plans are matched to how the customer actually uses the phone.',
    goodVisit: 'A good {visit} is short and leaves the counter ready for the peak. Float is topped up within the limit, SIM kits are counted and logged, incomplete KYC records are shown to the {contact}, and branding is fresh. You photograph what changed.',
    guardrailWhy: 'This assistant never skips a KYC check, never creates a price, and never suggests a plan the customer does not need.',
    todayFloat: '{Accounts} whose float balance covers only a few hours at today\'s rate come first. The brief shows the balance and the usual evening pattern. The top-up stays within the distributor limit.',
    briefKyc: 'A valid ID and the live photo, scanned and complete before any activation. The {contact} completes the record with the customer. You check records and never edit them. If an ID is missing, the SIM is not activated.',
    orderFloat: 'The distributor sets a float limit for each {account}. A higher float is a credit risk for the {account} and for the distributor. The draft tops up to the usual weekly level and never above the limit.',
    routePeak: 'Most {accounts} peak in the evening, after work. Visits before the peak leave the counter ready, and a top-up lands before the busiest hours. Check the hourly pattern in the brief for each {account}.',
    managerKam: 'The ones under a KYC review, outlets suspended for incomplete records, and any {account} with a float limit set by the distributor. Those need a decision at account level.',
    agentsKyc: 'The agent lists activations with incomplete records and asks you to check them with the {contact}. It never skips a check, never edits a record, and never suggests activating without a valid ID.',
  },
  assistantRefusals: [
    {
      id: 'ref-kyc', guardrail: 'all1',
      patterns: ['skip kyc', 'without id', 'without an id', 'forgot their id', 'bypass kyc', 'activate without', 'fake id'],
      refusal: 'No activation without a valid ID. I never skip a KYC check.',
      allowed: 'I can show which records are incomplete and what the customer needs to bring.',
    },
    {
      id: 'ref-tariff', guardrail: 'all2',
      patterns: ['special price', 'custom price', 'discount', 'free data', 'extra validity', 'create a plan', 'change the tariff'],
      refusal: 'Prices and offers follow the published tariff. I cannot create one.',
      allowed: 'I can show the published offers for this period.',
    },
    {
      id: 'ref-selling', guardrail: 'gap1',
      patterns: ['without telling', 'do not mention', 'force the customer', 'unwanted plan', 'upsell without'],
      refusal: 'I do not suggest anything that would mislead a customer.',
      allowed: 'I can show how to match a plan to how the customer uses the phone.',
    },
    {
      id: 'ref-float', guardrail: 'order1',
      patterns: ['beyond the cap', 'raise the float cap', 'float cap to', 'more float than', 'above the float limit'],
      refusal: 'I never top up float above the distributor limit.',
      allowed: 'I can show the limit for this {account} and the usual weekly level.',
    },
  ],
};
