// Assistant content for animal health: custom inquiries, veterinary phrasing, and regulatory refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} are due seasonal parasite prevention reviews?', intent: 'answer:todayParasite' }] },
    brief: { rep: [{ q: 'What does the approved product label state?', intent: 'answer:briefLabel' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What clinical talking points apply here?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not reorder standard dispensary stock?', intent: 'answer:orderDispensary' }] },
    complete: { rep: [{ q: 'What defines a compliant {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if surgeries run late at the clinic?', intent: 'answer:routeSurgery' }] },
    manager: { manager: [{ q: 'Which {accounts} need strategic livestock manager escalation?', intent: 'answer:managerLivestock' }] },
    agents: {
      rep: [{ q: 'Can an agent recommend therapeutic dosages?', intent: 'answer:agentsDosage' }],
      manager: [{ q: 'Can an agent recommend therapeutic dosages?', intent: 'answer:agentsDosage' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Meet the veterinarian between surgical blocks or during clinic administrative rounds. Inquire about current caseload patterns, discuss recent cold chain storage audits, and present technical package literature that answers specific clinical questions without making unverified efficacy claims.',
    goodVisit: 'A compliant {visit} verifies biological storage integrity, delivers registered package inserts with written receipt, secures required veterinary prescription authorizations, and aligns upcoming replenishment with documented animal patient volume. Record practitioner feedback and verify cold storage logs.',
    guardrailWhy: 'This assistant operates under strict veterinary regulatory boundaries. It provides registered product facts without diagnosing animal conditions, calculating therapeutic dosages, or modifying withdrawal times.',
    todayParasite: 'Focus on {accounts} where seasonal parasite prevention orders lag regional vector risk periods. The brief highlights clinics where pre-season stocking campaigns help companion animal practitioners protect local patient populations.',
    briefLabel: 'Registered package labels define approved species indications, administration routes, contraindications, and statutory withdrawal periods. For clinical scenarios not covered on the approved label, direct practitioners to carrier medical affairs.',
    orderDispensary: 'Repeating static dispensary quantities fails to reflect upcoming calving cycles, seasonal tick emergence, or clinic patient census growth. Suggested quantities analyze procedure history and clinic refrigeration capacity to ensure appropriate stock.',
    routeSurgery: 'If morning surgeries run over schedule, adjust your itinerary to visit community pet retail partners or complete cold chain compliance audits. Mark the practice as delayed so the route planner rebalances subsequent consultation stops.',
    managerLivestock: 'Commercial livestock operations facing persistent somatic cell spikes or large dairies requesting custom preventative health agreements require executive alignment with the strategic livestock manager.',
    agentsDosage: 'No. Therapeutic diagnosis, prescription issuance, and clinical dosage determinations remain the exclusive legal responsibility of licensed veterinary practitioners. System recommendations focus solely on inventory availability and compliance tracking.',
  },
  assistantRefusals: [
    {
      id: 'ref-dosage-claims', guardrail: 'all1',
      patterns: ['diagnose the animal', 'prescribe dosage', 'recommend off label dose', 'clinical cure guarantee', 'treat sick herd without vet'],
      refusal: 'I cannot diagnose animal medical conditions, determine pharmaceutical dosages, or offer clinical treatment advice.',
      allowed: 'I can supply registered product labels, explain approved administration guidelines, and log questions for veterinary medical affairs.',
    },
    {
      id: 'ref-rx-dispensing', guardrail: 'gap1',
      patterns: ['sell rx without vet', 'bypass prescription', 'dispense to non veterinarian', 'ship prescription item directly'],
      refusal: 'I cannot approve or process prescription-only veterinary biologicals without verified licensed practitioner authorization.',
      allowed: 'I can verify practitioner registration status and record veterinary digital prescription signatures.',
    },
    {
      id: 'ref-inventory-dump', guardrail: 'order1',
      patterns: ['overstock the clinic', 'dump extra vaccine vials', 'push expired date codes', 'excess farm loading'],
      refusal: 'I do not propose inventory volumes that exceed validated patient census requirements or clinic refrigerated capacity.',
      allowed: 'I can evaluate seasonal patient counts and historical dispensary replenishment records to calculate appropriate order sizes.',
    },
    {
      id: 'ref-herd-removal', guardrail: 'planner1',
      patterns: ['drop dairy farm', 'terminate livestock account', 'stop visiting livestock herd'],
      refusal: 'I cannot remove commercial dairy or livestock operations on annual preventative programs without strategic manager approval.',
      allowed: 'I can highlight scheduling conflicts and suggest rebalanced rural itinerary sequences for supervisory review.',
    },
  ],
};
