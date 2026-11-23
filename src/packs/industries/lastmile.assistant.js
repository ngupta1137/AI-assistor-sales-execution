// Assistant content for last-mile delivery: questions on collection times, pickup point
// capacity and the rate card, with refusals for promised delivery times and off-card prices.
// Shared questions come from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which pickup points are close to full today?', intent: 'answer:todayPudo' }] },
    brief: { rep: [{ q: 'What can I say about delivery times here?', intent: 'answer:briefPromise' }] },
    account: { rep: [{ q: 'How do I talk to the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What should I show the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not book the same capacity as last week?', intent: 'answer:orderPeak' }] },
    complete: { rep: [{ q: 'What makes a good {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if a pickup point is closed?', intent: 'answer:routeClosed' }] },
    manager: { manager: [{ q: 'Which merchants need the key merchant manager?', intent: 'answer:managerKey' }] },
    agents: {
      rep: [{ q: 'Can an agent promise a delivery slot?', intent: 'answer:agentsSlot' }],
      manager: [{ q: 'Can an agent promise a delivery slot?', intent: 'answer:agentsSlot' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'For a merchant, meet the operations lead away from the packing line and bring their own parcel data: packing times, failed attempts by reason, returns. For a pickup point, come outside the after-work rush, check the parcel area together and keep it short.',
    goodVisit: 'A good {visit} closes one real gap with evidence: a later collection agreed, an address fix switched on, a pickup point under its space limit with a photo. Nothing is promised that the network has not published.',
    guardrailWhy: 'This assistant only uses published service levels and the published rate card. It never promises a delivery date or slot, never quotes an off-card price and never settles a claim.',
    todayPudo: 'The brief flags pickup points above their agreed space or holding parcels past the collection window. Those go first, because a full point refuses parcels and the network sends them further away.',
    briefPromise: 'Only the published service level for each delivery service. You can show it at checkout and on the rate card, but you cannot promise a specific day or time window.',
    orderPeak: 'Last week does not include the promotion the merchant has planned. The suggestion uses the same weeks last year and the promotion dates, inside the published peak calendar.',
    routeClosed: 'Mark the pickup point closed. Visit Planning drops it, moves the standards check to the next site visit and pulls forward the next most urgent site nearby.',
    managerKey: 'Merchants under contract review, or asking for terms outside the rate card. The key merchant manager owns those conversations, and the field routes them there.',
    agentsSlot: 'No. Agents show published service levels only. Delivery slots and dates come from the network, not from an agent or an account executive.',
  },
  assistantRefusals: [
    {
      id: 'ref-promise-slot', guardrail: 'all1',
      patterns: ['promise delivery tomorrow', 'guarantee delivery slot', 'promise a delivery time', 'guarantee next morning', 'promise the claim', 'guarantee refund for late parcel'],
      refusal: 'I cannot promise a delivery date, a time slot or a claim outcome.',
      allowed: 'I can show the published service level for each delivery service and explain how the claims process works.',
    },
    {
      id: 'ref-offcard-price', guardrail: 'all1',
      patterns: ['discount below the rate card', 'waive the peak surcharge', 'special parcel price', 'match the competitor price'],
      refusal: 'I cannot quote a price, discount or surcharge waiver that is not on the published rate card.',
      allowed: 'I can show the volume tiers on the rate card and what the next tier needs.',
    },
    {
      id: 'ref-overfill-pudo', guardrail: 'gap1',
      patterns: ['send more parcels to the full pickup point', 'ignore the space limit', 'overfill the pickup point'],
      refusal: 'I will not send a pickup point more parcels than its agreed space.',
      allowed: 'I can find a nearby pickup point with space, or help clear expired parcels at this one.',
    },
    {
      id: 'ref-force-peak', guardrail: 'order1',
      patterns: ['book more capacity to hit target', 'inflate the peak booking', 'fill the network quota'],
      refusal: 'I do not suggest capacity bookings above what the site’s own history and plans support.',
      allowed: 'I can base the booking on last year’s same weeks and the promotion dates the site has shared.',
    },
  ],
};
