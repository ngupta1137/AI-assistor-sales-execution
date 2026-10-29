// Assistant content for pharma. No clinical claims: the assistant points to approved material,
// logs questions for Medical Information, and never answers dosing, safety or comparison questions.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} have a priority {contact} I have not seen?', intent: 'answer:todayPriority' }] },
    brief: { rep: [{ q: 'Which approved material can I use on this {visit}?', intent: 'answer:briefMaterial' }] },
    account: { rep: [{ q: 'How do I approach the {contact} here?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I say to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'How many samples can I leave?', intent: 'answer:orderSamples' }] },
    complete: { rep: [{ q: 'What does a good {visit} look like?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if the {contact} is running behind?', intent: 'answer:routeWait' }] },
    manager: { manager: [{ q: 'Which {accounts} need a {kam} conversation?', intent: 'answer:managerKam' }] },
    agents: {
      rep: [{ q: 'What is the sample limit and who enforces it?', intent: 'answer:agentsSamples' }],
      manager: [{ q: 'What is the sample limit and who enforces it?', intent: 'answer:agentsSamples' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Keep it short and use only the approved leave-behind. Ask what information would help, listen, and log any question you cannot answer for Medical Information. Never add your own claims, and never link a sample or a favour to a request.',
    goodVisit: 'A good {visit} fits between consultations. You use approved material only, ask one useful question, note anything that needs Medical Information, record any sample drop with a signed receipt, and agree the next {visit} before you leave.',
    guardrailWhy: 'This assistant is built to keep approved content and Medical Information separate from the rep.',
    todayPriority: 'Priority {contacts} are on the list for this cycle. The {visit} planner puts an {account} on today\'s route when it holds a priority {contact} with no {visit} for several weeks. The brief shows how long it has been.',
    briefMaterial: 'Only material approved for your market and in date. The action names the leave-behind to use. If the {contact} asks about anything the material does not cover, do not answer it. Log it for Medical Information.',
    orderSamples: 'At most two packs of each product per {contact} per {visit}. A request over the limit is blocked on the {order} screen. Submitting sends a request. A drop is recorded only when the {contact} signs the receipt.',
    routeWait: 'Long waits cost {visits}. If the {contact} is running behind, offer a shorter slot, or use Mark closed today and let the route re-plan. Ask the practice manager for a slot outside consultation hours next time.',
    managerKam: 'The ones with overrides that cite hospital access rules, and any hospital {order} above the approval limit. Those need a decision at account level, not coaching for the {rep}.',
    agentsSamples: 'Compliance sets the limit and the {order} screen applies it before a request can be sent. A drop counts only with a signed receipt. The agents never suggest samples above the limit, and never link a sample to a request.',
  },
  assistantRefusals: [
    {
      id: 'ref-clinical', guardrail: 'all2',
      patterns: ['dose', 'dosage', 'dosing', 'side effect', 'contraindicat', 'safe for', 'safety of', 'interaction with', 'pregnan', 'which patients', 'should a patient', 'prescribe'],
      refusal: 'I cannot answer clinical questions such as dosing, safety or who a product suits.',
      allowed: 'I can log it as a Medical Information request and show the approved material for this product.',
    },
    {
      id: 'ref-claims', guardrail: 'all1',
      patterns: ['better than', 'works better', 'more effective', 'efficacy', 'superior', 'outperform', 'off-label', 'off label'],
      refusal: 'I do not write claims or comparisons, and I never suggest off-label content.',
      allowed: 'I can show which approved material covers this product.',
    },
    {
      id: 'ref-sample', guardrail: 'gap1',
      patterns: ['extra samples', 'more samples', 'without a signature', 'skip the signature', 'sign for them', 'unsigned'],
      refusal: 'I cannot suggest samples above the limit or a drop without a signed receipt.',
      allowed: 'I can show the limit and what is still needed to record a drop.',
    },
    {
      id: 'ref-inducement', guardrail: 'order1',
      patterns: ['gift', 'free goods', 'free trip', 'hospitality for', 'incentive for the', 'discount'],
      refusal: 'I do not suggest anything that could be an inducement.',
      allowed: 'I can show what the approved education meeting offers and how attendance is logged.',
    },
    {
      id: 'ref-contact', guardrail: 'planner1',
      patterns: ['personal mobile', 'private number', 'call them at home', 'after hours call'],
      refusal: 'I do not plan contact that breaks the local rules on reaching an {contact}.',
      allowed: 'I can show the best slot in the practice diary and the route for today.',
    },
  ],
};
