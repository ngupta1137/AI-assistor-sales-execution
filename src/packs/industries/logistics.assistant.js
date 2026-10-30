// Assistant content for logistics and courier services: custom inquiries, freight phrasing, and tariff refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} are experiencing late pickup bottlenecks?', intent: 'answer:todayPickups' }] },
    brief: { rep: [{ q: 'What does the filed rate card require here?', intent: 'answer:briefRatecard' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What operational points should I present to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not repeat past trailer booking allocations?', intent: 'answer:orderTrailer' }] },
    complete: { rep: [{ q: 'What defines an effective {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if warehouse docks are congested?', intent: 'answer:routeCongestion' }] },
    manager: { manager: [{ q: 'Which {accounts} need strategic logistics director escalation?', intent: 'answer:managerStrategic' }] },
    agents: {
      rep: [{ q: 'Can an agent commit to exact delivery hours?', intent: 'answer:agentsArrival' }],
      manager: [{ q: 'Can an agent commit to exact delivery hours?', intent: 'answer:agentsArrival' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Meet the shipping supervisor or warehouse dispatcher in the shipping office away from active forklift lanes. Review daily outbound package manifests, inspect carton cubing and packaging methods, and present service lane solutions that improve transit performance without promising unverified delivery arrival hours.',
    goodVisit: 'An effective {visit} audits outbound carton dimension accuracy, delivers official carrier rate card updates with written receipt, resolves evening pickup cutoff bottlenecks, and confirms peak shipping manifest capacity. Record dock door observations and verify packaging integrity.',
    guardrailWhy: 'This assistant enforces strict transportation tariff compliance. It relies on filed rate cards and standard operating schedules without promising definite delivery hours or guaranteeing claims settlements.',
    todayPickups: 'Focus on {accounts} where warehouse packing volume misses standard evening driver sweeps. The brief identifies shippers whose daily order velocity justifies dedicated late trailer pickups to ensure same-day dispatch.',
    briefRatecard: 'Filed rate card schedules define base shipping tariffs, accessorial charges, and fuel index adjustments by weight and destination zone. Representatives cannot grant off-card discounts or modify published freight rules.',
    orderTrailer: 'Repeating past shipping bookings overlooks promotional volume surges, shifting regional delivery zones, and seasonal freight patterns. Proposed allocations analyze recent manifest velocity and dock staging capacity to optimize trailer bookings.',
    routeCongestion: 'If dock congestion or unloading bottlenecks delay warehouse dispatchers, adjust your itinerary to visit nearby commercial SME offices or conduct cubing audits at e-commerce packing hubs. Mark the shipper delayed to recalculate driving routes.',
    managerStrategic: 'Large wholesale distributors with substantial pallet freight volume or regional cross-dock operators negotiating contract line-haul rates require executive alignment with the strategic logistics director.',
    agentsArrival: 'No. Exact delivery arrival hours and transit guarantees cannot be authorized by automated systems. Service lane performance follows published transit guidelines and weather operating conditions.',
  },
  assistantRefusals: [
    {
      id: 'ref-transit-guarantee', guardrail: 'all1',
      patterns: ['promise delivery by tomorrow', 'guarantee transit time', 'certain delivery hour', 'promise delivery time', 'guarantee claim settlement', 'promise full claim payout'],
      refusal: 'I cannot promise definite delivery arrival hours or guarantee freight claim reimbursement outcomes.',
      allowed: 'I can supply published service lane transit schedules, explain tracking milestones, and reference filed claims documentation rules.',
    },
    {
      id: 'ref-tariff-waiver', guardrail: 'gap1',
      patterns: ['discount below rate card', 'waive fuel surcharge', 'custom unapproved freight rate', 'ignore dimensional weight tariff'],
      refusal: 'I cannot grant unapproved shipping discounts or waive published tariff rules and fuel surcharges.',
      allowed: 'I can reference official carrier rate cards, explain volume tier requirements, and explain dimensional weight calculation methods.',
    },
    {
      id: 'ref-trailer-dump', guardrail: 'order1',
      patterns: ['overbook line haul', 'dump excess freight manifest', 'force pallet quota'],
      refusal: 'I do not propose trailer bookings that exceed validated warehouse packing throughput or carrier network sortation limits.',
      allowed: 'I can analyze historical manifest trends and daily packaging curves to calculate realistic shipping volume projections.',
    },
    {
      id: 'ref-distributor-drop', guardrail: 'planner1',
      patterns: ['drop regional distributor', 'terminate freight account', 'stop visiting shipper'],
      refusal: 'I cannot disengage wholesale distributor freight accounts without strategic logistics director authorization.',
      allowed: 'I can identify unprofitable freight lanes and recommend adjusted review schedules for supervisory evaluation.',
    },
  ],
};
