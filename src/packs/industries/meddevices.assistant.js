// Assistant content for medical devices. Approved claims only; the surgeon decides clinical questions;
// contract prices belong to the contracts team; complaint causes belong to quality.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have a case coming up?', intent: 'answer:todayCases' }] },
    brief: { rep: [{ q: 'What counts as case support?', intent: 'answer:briefCase' }] },
    account: { rep: [{ q: 'How do I work with the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why is the service contract not priced here?', intent: 'answer:orderContract' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the OR schedule changes?', intent: 'answer:routeOr' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'Can an agent help with sizing?', intent: 'answer:agentsSize' }],
      manager: [{ q: 'Can an agent help with sizing?', intent: 'answer:agentsSize' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Confirm what is on site and how the product works, then stop there. Sizing, technique and clinical choices belong to the surgeon. Bring the instructions for use and approved materials, and ask the OR manager when the room is free.',
    goodVisit: 'A good {visit} fits the OR schedule. You confirm instruments and sizes are on site, check par levels, run any training with a signed sheet, log case support, and collect facts on any open complaint without guessing a cause.',
    guardrailWhy: 'This assistant supports product use. It does not make clinical decisions or set contract terms.',
    todayCases: 'Cases come from the OR schedule shared with the territory. The planner keeps those {visits} on the route and puts case support above routine checks. The brief shows the day and the instrument set to confirm.',
    briefCase: 'Support is limited to product use: confirming instruments, sizes on site and how the system works. It is logged for compliance. The surgeon makes every clinical decision, and the app never recommends one.',
    orderContract: 'Contract pricing and terms are set by the contracts team. The agent only records that a renewal is due. Starting it here opens the process; the offer comes from the contracts team.',
    routeOr: 'OR schedules move. If a case shifts, use Mark closed today for the {visit} it clashes with, or move it to a lighter day. Case support days stay protected, and the route re-plans the rest.',
    managerKam: 'The ones with a contract under negotiation, a purchase order on hold or an open complaint on a key {account}. Those need a conversation at {account} level, not a coaching note.',
    agentsSize: 'No. Sizing and technique are the surgeon\'s decision. An agent can confirm which sizes are on site and which instrument set the case needs. Anything clinical stays with the surgeon.',
  },
  assistantRefusals: [
    {
      id: 'ref-clinical', guardrail: 'planner1',
      patterns: ['which size', 'what size', 'implant size', 'which implant should', 'best technique', 'recommend the implant', 'should the surgeon'],
      refusal: 'I cannot make or suggest clinical decisions. Sizing and technique belong to the surgeon.',
      allowed: 'I can confirm which sizes and instrument sets are on site for the case.',
    },
    {
      id: 'ref-claims', guardrail: 'all1',
      patterns: ['better than', 'longer lasting', 'safer than', 'reduces infection', 'proven to', 'clinical evidence', 'outcomes better'],
      refusal: 'I only use approved claims from the instructions for use and approved materials.',
      allowed: 'I can show the instructions for use and approved material for this device.',
    },
    {
      id: 'ref-price', guardrail: 'order1',
      patterns: ['quote a price', 'contract price', 'discount on', 'best price', 'lower the price', 'price match'],
      refusal: 'I cannot set or suggest contract prices or terms. The contracts team does.',
      allowed: 'I can record that a renewal is due and show what the contracts team needs.',
    },
    {
      id: 'ref-complaint', guardrail: 'gap1',
      patterns: ['root cause', 'what caused', 'cause of the failure', 'is it a defect', 'blame', 'admit fault'],
      refusal: 'I do not suggest a cause for a device complaint. That is for the quality team.',
      allowed: 'I can list the facts to collect: lot number, what happened and when, and who reported it.',
    },
  ],
};
