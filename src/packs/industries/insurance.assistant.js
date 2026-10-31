// Assistant content for insurance distribution: custom inquiries, industry phrasing, and guardrail refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} hold pending commercial renewals?', intent: 'answer:todayRenewals' }] },
    brief: { rep: [{ q: 'What risk classifications fit our appetite?', intent: 'answer:briefAppetite' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What strategy should I suggest to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not repeat last quarters allocation?', intent: 'answer:orderAllocation' }] },
    complete: { rep: [{ q: 'What defines a productive {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if agency principals are unavailable?', intent: 'answer:routeAvailability' }] },
    manager: { manager: [{ q: 'Which {accounts} require network director escalation?', intent: 'answer:managerEscalate' }] },
    agents: {
      rep: [{ q: 'Can an agent quote custom policy rates?', intent: 'answer:agentsPricing' }],
      manager: [{ q: 'Can an agent quote custom policy rates?', intent: 'answer:agentsPricing' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Begin with commercial market conditions and local loss trends rather than sales quotas. Inquire about submission roadblocks with current underwriters, listen to placement challenges on complex risks, and present appetite solutions that make their producers more competitive.',
    goodVisit: 'A productive {visit} concludes with documented commercial priorities: resolved quote bottlenecks, delivered compliance documentation, agreed renewal targets, or scheduled joint calls on major corporate accounts. Record producer feedback and verify credential status.',
    guardrailWhy: 'This assistant enforces strict insurance distribution compliance. It relies on approved brochures and carrier guidelines without delivering individual consumer advice or binding terms.',
    todayRenewals: 'Review {accounts} with commercial expiration cycles occurring over the next 60 days. The pipeline action highlights policy accounts where proactive renewal reviews protect premium retention before clients begin shopping competing carriers.',
    briefAppetite: 'Published carrier appetite guides specify target industry sectors, acceptable property protection tiers, and deductible parameters. For borderline risks, summarize underwriting information and request formal home office review.',
    orderAllocation: 'Static renewal rollovers overlook expansion in growing industrial corridors and changing local business formations. Proposed allocations analyze expiration ledgers and producer staffing to project achievable growth.',
    routeAvailability: 'If key agency leadership is engaged in client reviews or claims conferences, coordinate with the commercial lines manager or resequence your itinerary to visit nearby partners. Mark the record appropriately to recalculate travel paths.',
    managerEscalate: 'Direct attention toward corporate brokerages reporting persistent underwriting friction or distribution partners approaching tier reclassification thresholds. These strategic relationships benefit from direct executive alignment.',
    agentsPricing: 'No. Premium determinations, coverage binding, and policy endorsements remain the exclusive domain of certified carrier underwriters. System intelligence assists with appetite identification and submission readiness.',
  },
  assistantRefusals: [
    {
      id: 'ref-claims-advice', guardrail: 'all1',
      patterns: ['quote a premium', 'bind coverage now', 'approve this claim', 'payout promise', 'guarantee claim payment', 'personal financial advice'],
      refusal: 'I cannot provide personal financial advice, quote binding premium rates, or adjudicate insurance claims.',
      allowed: 'I can supply approved product brochures, explain standard coverage outlines, and outline carrier submission requirements.',
    },
    {
      id: 'ref-underwriting-waiver', guardrail: 'gap1',
      patterns: ['underwrite this risk', 'waive policy exclusion', 'accept declined submission', 'bypass underwriting', 'custom endorsement term'],
      refusal: 'I cannot grant underwriting exceptions or modify standard contract exclusions.',
      allowed: 'I can reference published appetite classifications and help prepare submissions for regional underwriting consideration.',
    },
    {
      id: 'ref-mandatory-quota', guardrail: 'order1',
      patterns: ['enforce sales quota', 'mandatory premium target', 'force agency quota', 'penalize for low volume'],
      refusal: 'I do not establish mandatory production quotas or punitive sales requirements for independent distribution partners.',
      allowed: 'I can evaluate historic production capacity to propose realistic quarterly binder planning volumes.',
    },
    {
      id: 'ref-broker-termination', guardrail: 'planner1',
      patterns: ['drop this brokerage', 'terminate broker partnership', 'remove corporate broker', 'stop visiting broker'],
      refusal: 'I cannot remove or disengage corporate brokerage accounts without formal executive director concurrence.',
      allowed: 'I can highlight underperforming partner accounts and propose adjusted review frequencies for management assessment.',
    },
  ],
};

