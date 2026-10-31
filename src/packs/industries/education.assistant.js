// Assistant content for school and education supplies: custom inquiries, academic phrasing, and privacy refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} face upcoming curriculum adoption deadlines?', intent: 'answer:todayDeadlines' }] },
    brief: { rep: [{ q: 'What does the national curriculum framework require?', intent: 'answer:briefCurriculum' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What pedagogical points should I present to the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not repeat past classroom requisition volumes?', intent: 'answer:orderRequisition' }] },
    complete: { rep: [{ q: 'What defines a constructive {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if educators are teaching active classes?', intent: 'answer:routeTeaching' }] },
    manager: { manager: [{ q: 'Which {accounts} need institutional accounts director escalation?', intent: 'answer:managerInstitutional' }] },
    agents: {
      rep: [{ q: 'Can an agent predict student exam performance?', intent: 'answer:agentsPerformance' }],
      manager: [{ q: 'Can an agent predict student exam performance?', intent: 'answer:agentsPerformance' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Meet the department head or curriculum coordinator during designated planning periods. Review syllabus revision mapping documents, discuss laboratory apparatus requirements, present teacher evaluation specimen packs, and discuss bulk term purchasing without promising specific examination improvements.',
    goodVisit: 'A constructive {visit} audits classroom material alignment with current national curriculum standards, delivers teacher evaluation desk copies with signed receipts, verifies laboratory protective equipment compliance, and confirms public tender compliance affidavits. Record educator feedback and verify grade enrollment figures.',
    guardrailWhy: 'This assistant enforces strict educational privacy and procurement compliance. It protects student personal privacy and adheres to public tender laws without forecasting test score results.',
    todayDeadlines: 'Focus on {accounts} where departmental curriculum adoption committees meet within the next 30 days. The brief highlights schools where presenting evaluation specimen packs ensures placement on the formal textbook adoption shortlist.',
    briefCurriculum: 'Published curriculum framework documents outline mandatory learning objectives, modular progression tiers, and laboratory practical hours. Educational materials must conform to these published benchmarks without unauthorized syllabus deviations.',
    orderRequisition: 'Duplicating prior-year supply orders fails to account for grade enrollment fluctuations, newly introduced elective tracks, or revised textbook editions. Proposed requisitions analyze confirmed student headcounts and per-pupil allowances.',
    routeTeaching: 'If educators are actively engaged in instructional or examination supervision, adjust your itinerary to visit campus bookstores or meet the school bursar regarding procurement tender documentation. Mark the academic contact delayed to recalculate driving routes.',
    managerInstitutional: 'Multi-campus public school districts issuing comprehensive educational tenders or vocational networks negotiating enterprise digital licensing require direct coordination with the institutional accounts director.',
    agentsPerformance: 'No. Automated recommendations never predict student examination grades or guarantee academic learning outcomes. Academic outcomes depend on classroom instruction, student effort, and school environment.',
  },
  assistantRefusals: [
    {
      id: 'ref-child-privacy', guardrail: 'all1',
      patterns: ['student name', 'enter child data', 'student test grades', 'individual student record', 'child private information'],
      refusal: 'I cannot record or process personal student data, child identities, or individual academic grades.',
      allowed: 'I can record anonymous aggregate student enrollment headcounts and institutional grade-level supply requirements.',
    },
    {
      id: 'ref-outcome-claims', guardrail: 'gap1',
      patterns: ['promise test scores', 'promise higher grades', 'promised exam pass', 'boost student iq', 'proven exam success'],
      refusal: 'I cannot promise specific learning outcomes, predict higher examination marks, or forecast student test scores.',
      allowed: 'I can supply approved curriculum alignment matrices and describe syllabus coverage across subject modules.',
    },
    {
      id: 'ref-tender-bypass', guardrail: 'order1',
      patterns: ['bypass procurement tender', 'skip public bidding', 'side deal with school head', 'off catalog discount'],
      refusal: 'I cannot bypass statutory public procurement tender procedures or offer unapproved institutional pricing concessions.',
      allowed: 'I can reference official tender rate schedules and prepare certified public procurement compliance documentation.',
    },
    {
      id: 'ref-district-drop', guardrail: 'planner1',
      patterns: ['drop school district', 'terminate school contract', 'stop visiting academy'],
      refusal: 'I cannot disengage public school district accounts or cancel institutional tender supply commitments without director approval.',
      allowed: 'I can identify low-activity educational institutions and propose adjusted review intervals for supervisory consideration.',
    },
  ],
};
