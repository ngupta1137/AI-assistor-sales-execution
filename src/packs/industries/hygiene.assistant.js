// Assistant content for hygiene and cleaning supplies: custom inquiries, sanitation phrasing, and safety refusals.
// Shared inquiries derive from assistant-base.js. Industry-specific items are authored here.

import { withBase } from '../assistant-base.js';

export default {
  assistantContext: withBase({
    today: { rep: [{ q: 'Which {accounts} show dispenser calibration alerts?', intent: 'answer:todayCalibration' }] },
    brief: { rep: [{ q: 'What safety data sheets are required here?', intent: 'answer:briefSds' }] },
    account: { rep: [{ q: 'How do I consult with the {contact}?', intent: 'global.talk' }] },
    action: { rep: [{ q: 'What technical guidance should I give the {contact}?', intent: 'action.talk' }] },
    order: { rep: [{ q: 'Why not reorder past cleaning chemical volumes?', intent: 'answer:orderChemical' }] },
    complete: { rep: [{ q: 'What defines a thorough {visit}?', intent: 'global.goodvisit' }] },
    route: { rep: [{ q: 'What if housekeeping crews are turning over rooms?', intent: 'answer:routeTurnover' }] },
    manager: { manager: [{ q: 'Which {accounts} need contractor director escalation?', intent: 'answer:managerContractor' }] },
    agents: {
      rep: [{ q: 'Can an agent provide chemical mixing formulas?', intent: 'answer:agentsMixing' }],
      manager: [{ q: 'Can an agent provide chemical mixing formulas?', intent: 'answer:agentsMixing' }],
    },
  }),
  assistantAnswers: {
    talkToContact: 'Meet the environmental services lead or executive housekeeper during shift transitions. Walk the laundry room and chemical supply closets together, inspect dispenser metering tips, verify safety data sheet binders, and demonstrate closed-loop dispensing benefits without offering unofficial chemical mixing advice.',
    goodVisit: 'A thorough {visit} verifies dilution dispenser calibration with refractometer testing, checks safety data sheets across chemical stations, resolves washroom dispenser shortages, and secures signed agreements for required equipment installations. Document metering tip status and chemical drum inventory.',
    guardrailWhy: 'This assistant enforces strict chemical handling safety guidelines. It references official safety data sheets and manufacturer instructions without formulating unapproved chemical blends or modifying dilution ratios.',
    todayCalibration: 'Review {accounts} where dilution equipment has not received calibration verification in over six months or where chemical concentrate consumption diverges from occupied room counts. Testing proportioning ratios prevents product waste.',
    briefSds: 'Occupational safety standards require active safety data sheets for every stocked formulation, including multi-surface concentrates, hospital disinfectants, and mechanical warewash liquids. The technical service portal maintains current revision sheets.',
    orderChemical: 'Repeating static purchase orders risks washroom soap runouts or backroom chemical drum overcrowding. Proposed orders analyze occupied room night forecasts, banquet event schedules, and active dispenser counts to optimize deliveries.',
    routeTurnover: 'If morning room turnover occupies the housekeeping team, resequence your route to conduct washroom audits in commercial office lobbies or meet contract cleaning supervisors at their depot. Mark the facility delayed to recalculate driving routes.',
    managerContractor: 'Large contract cleaning providers experiencing multi-facility equipment failures or bidding on regional janitorial tenders require executive coordination with the strategic contractor director.',
    agentsMixing: 'No. Combining chemical cleaning products is dangerous and strictly prohibited. Inquiries regarding chemical compatibility and emergency handling route directly to the technical service desk and the safety data sheet.',
  },
  assistantRefusals: [
    {
      id: 'ref-chemical-mixing', guardrail: 'all1',
      patterns: ['mix chemicals together', 'blend bleach and acid', 'combine detergents', 'custom chemical recipe', 'dilute without dispenser'],
      refusal: 'I cannot provide chemical mixing advice or instructions for combining cleaning formulations.',
      allowed: 'I can supply official safety data sheets, explain registered dilution ratios, and connect you with the technical service desk.',
    },
    {
      id: 'ref-safety-waiver', guardrail: 'gap1',
      patterns: ['skip safety data sheet', 'bypass sds requirement', 'override hazard label', 'ignore chemical warning'],
      refusal: 'I cannot waive safety data sheet placement requirements or override chemical hazard warnings.',
      allowed: 'I can generate printable safety data sheet replacement packets and log required emergency station documentation.',
    },
    {
      id: 'ref-drum-overstock', guardrail: 'order1',
      patterns: ['overstock chemical drums', 'dump excess detergent', 'push expired cleaning stock'],
      refusal: 'I do not suggest chemical drum quantities that exceed documented facility storage limits or monthly consumption capacity.',
      allowed: 'I can calculate accurate replenishment volumes based on occupied room census and active dispenser counts.',
    },
    {
      id: 'ref-contractor-drop', guardrail: 'planner1',
      patterns: ['drop cleaning contractor', 'terminate janitorial agreement', 'stop visiting facility'],
      refusal: 'I cannot disengage multi-site contract cleaning service accounts without strategic contractor director authorization.',
      allowed: 'I can identify underperforming facilities and recommend adjusted audit intervals for supervisory consideration.',
    },
  ],
};
