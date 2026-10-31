// Assistant content for packaging and print: custom inquiries, converter phrasing, and compliance refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} show pending food contact certificate updates?', intent: 'answer:todayCertificates' }] },
    brief: { rep: [{ q: 'What does the certified migration test report state?', intent: 'answer:briefMigration' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What technical points should I review with the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not repeat past corrugated substrate volumes?', intent: 'answer:orderSubstrate' }] },
    complete: { rep: [{ q: 'What defines a thorough {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if packaging lines are running full production?', intent: 'answer:routeProduction' }] },
    manager: { manager: [{ q: 'Which {accounts} need strategic enterprise director escalation?', intent: 'answer:managerEnterprise' }] },
    agents: {
      rep: [{ q: 'Can an agent approve custom cutting die tooling?', intent: 'answer:agentsTooling' }],
      manager: [{ q: 'Can an agent approve custom cutting die tooling?', intent: 'answer:agentsTooling' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Meet the packaging engineer or plant operations manager during line changeover windows. Inspect automated heat sealing jaws, review laboratory migration certificates on file, check corrugated carton edge crush strength, and review custom structural tooling without making verbal food-safety or sustainability claims.',
    goodVisit: 'A thorough {visit} audits tray sealing integrity using bubble submersion tests, delivers accredited food-contact compliance certificates with signed receipts, verifies corrugated stack strength on pallet tiers, and secures authorized CAD sign-offs for custom cutting dies. Document sealing temperatures and corrugate stock.',
    guardrailWhy: 'This assistant enforces strict packaging safety and environmental substantiation standards. It references certified migration test reports and accredited laboratory data without making unverified green or compostable claims.',
    todayCertificates: 'Focus on {accounts} where direct food-contact packaging materials have operating migration certificates approaching annual renewal. The brief highlights processors where verified technical documentation preserves audit readiness.',
    briefMigration: 'Certified laboratory migration reports quantify overall and specific substance migration limits under specified temperature and duration conditions. Regulatory compliance mandates that direct food-contact substrates satisfy statutory migration thresholds.',
    orderSubstrate: 'Duplicating historical box orders overlooks upcoming plant shift expansions, seasonal harvest schedules, and shifting pallet pack configurations. Proposed requisitions analyze confirmed packing line throughput and warehouse pallet capacity.',
    routeProduction: 'If packaging lines are operating at peak speeds without scheduled downtime, resequence your route to audit warehouse carton storage or meet consumer brand buyers at design offices. Mark the converter delayed to recalculate travel routes.',
    managerEnterprise: 'Multi-plant food processors negotiating enterprise resin contracts or consumer retail brands planning complete packaging overhauls require strategic coordination with the strategic enterprise director.',
    agentsTooling: 'No. Custom rotary cutting dies, embossing plates, and printing cylinders require verified physical structural CAD drawings and authorized customer signatures. Automated systems cannot sign off on permanent tooling fabrication.',
  },
  assistantRefusals: [
    {
      id: 'ref-food-claims', guardrail: 'all1',
      patterns: ['unverified food safe', 'claim food contact without certificate', 'verbal food safe promise', 'exempt from migration test'],
      refusal: 'I cannot validate food-contact regulatory compliance without an accredited laboratory certificate of compliance on file.',
      allowed: 'I can supply approved migration testing certificates and review statutory food-contact compliance documentation.',
    },
    {
      id: 'ref-green-claims', guardrail: 'gap1',
      patterns: ['claim compostable without report', 'promise 100 percent biodegradable', 'untested green claim', 'plastic free guarantee'],
      refusal: 'I cannot endorse environmental sustainability or compostability claims without an authorized third-party test report.',
      allowed: 'I can provide accredited laboratory disintegration reports and explain certified industrial composting standards.',
    },
    {
      id: 'ref-tooling-bypass', guardrail: 'order1',
      patterns: ['skip artwork approval', 'bypass cad signoff', 'rush tooling without drawing'],
      refusal: 'I cannot authorize custom printing cylinder or rotary cutting die tooling fabrication without formal CAD artwork sign-off.',
      allowed: 'I can generate structural dimension review sheets and prepare tooling specification packages for engineering sign-off.',
    },
    {
      id: 'ref-enterprise-drop', guardrail: 'planner1',
      patterns: ['drop packaging converter', 'terminate manufacturing agreement', 'stop visiting food maker'],
      refusal: 'I cannot disengage enterprise packaging converter accounts without strategic enterprise director authorization.',
      allowed: 'I can highlight low-margin substrate accounts and propose adjusted audit frequencies for management evaluation.',
    },
  ],
};
