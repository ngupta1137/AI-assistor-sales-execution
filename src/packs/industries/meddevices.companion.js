// Sales Companion content for medical devices. Approved claims only; the surgeon makes clinical decisions;
// contract pricing belongs to the contracts team; complaints go to quality.

export default {
  companion: {
    roles: { rep: 'Territory manager', manager: 'Regional sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking at hospitals', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'instr', label: 'Instrument transport and courier', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for case support', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'product', label: 'Product and instructions-for-use training', cycleMonths: 12 },
      { id: 'compliance', label: 'Compliance and approved claims', cycleMonths: 12 },
      { id: 'orconduct', label: 'Operating room conduct and hygiene', cycleMonths: 12 },
      { id: 'complaints', label: 'Complaint handling', cycleMonths: 12 },
      { id: 'privacy', label: 'Patient privacy awareness', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'm1', title: 'Supporting a case without crossing a line', minutes: 20, summary: 'What case support covers, what stays with the surgeon, and how to log it.' },
      { id: 'm2', title: 'Confirming instruments and sizes the day before', minutes: 15, summary: 'A checklist for sets, sizes on site and sterile supply.' },
      { id: 'm3', title: 'Par levels and consumable reorders', minutes: 15, summary: 'Read par levels, order to par and avoid stockpiling.' },
      { id: 'm4', title: 'Collecting the facts for a complaint', minutes: 20, summary: 'Lot number, what happened, when, and who reported it. No guesses about cause.' },
      { id: 'm5', title: 'Running an in-service session', minutes: 25, summary: 'Use the approved deck, take attendance and collect signatures.' },
      { id: 'm6', title: 'Value analysis committee basics', minutes: 25, summary: 'What the committee asks for and how to prepare an approved file.' },
      { id: 'm7', title: 'Service contracts and renewals', minutes: 15, summary: 'When a renewal starts, who prices it, and what you can record.' },
      { id: 'm8', title: 'Consignment counts', minutes: 15, summary: 'Count, scan, log differences and leave resolution to the back office.' },
      { id: 'm9', title: 'Working with the OR manager', minutes: 15, summary: 'Timing visits around the schedule and respecting the room.' },
    ],
    knowledge: [
      { id: 'k1', title: 'What does case support cover?', text: 'Confirming instruments and sizes on site, explaining how the system works and noting what was used. Choices about the patient stay with the surgeon. Case support is logged for compliance.' },
      { id: 'k2', title: 'How do I log a device complaint?', text: 'Record the lot number, what happened, when and who reported it. Send it to the quality team within one working day. Do not offer a cause and do not promise a result.' },
      { id: 'k3', title: 'Who prices a service contract?', text: 'The contracts team. Starting a renewal records that one is due. The offer comes from the contracts team, so never quote a price in the {visit}.' },
      { id: 'k4', title: 'How do I order consumables to par?', text: 'Read the par level with the {contact}, count what is on the shelf and order the difference. The {order} draft shows days left for each line. Do not stockpile.' },
      { id: 'k5', title: 'What should I bring to a value analysis meeting?', text: 'The approved economic summary, training and service facts, and the instructions for use. Missing items push the decision to the next meeting.' },
      { id: 'k6', title: 'How do I run a consignment count?', text: 'Agree a time with the OR manager, scan every item, and log differences with the usage report. Do not try to settle differences on the spot.' },
      { id: 'k7', title: 'What counts as an approved claim?', text: 'Anything stated in the instructions for use or in material approved for your market. If it is not there, do not say it, and ask Regulatory first.' },
      { id: 'k8', title: 'How do I run an in-service session?', text: 'Use the approved deck, let each attendee handle the device, and collect signatures on the attendance sheet. Log the session the same day.' },
      { id: 'k9', title: 'When is a trial allowed?', text: 'Only under the approved trial agreement and a signed evaluation form. Nothing beyond the agreed trial terms is offered.' },
      { id: 'k10', title: 'What do I do if a case is cancelled?', text: 'Tell the contracts and logistics teams, return unused sets, and use Mark closed today on the route if a {visit} depended on it.' },
      { id: 'k11', title: 'Which expenses are allowed for instrument transport?', text: 'Courier and tolls for instrument sets, inside the policy limits. Keep the receipt and the case reference. Anything unusual needs your {manager} first.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Ask {person} what is getting in the way and offer to review it together.' },
      { id: 'p2', uses: ['offer'], text: '{offer} is part of the current range for this team. Offer the approved instructions for use and an in-service session for {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Agree par levels with {person} before {event}, so supply stays steady.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Supply that follows the schedule', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, the pattern follows the operating schedule. The next step is to agree par levels and instrument sets for the weeks ahead.' },
      { id: 's2', title: 'Training and support', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. An in-service session on {offer} gives {person} and the team the approved instructions and a signed record of who attended.' },
      { id: 's3', title: 'A plan for the year', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a benchmark estimate. It is a prompt for a conversation with {person}, not a statement about any result.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'New system training round', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Consignment count week', startWeek: 3, weeks: 2, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'The Companion supports product use and never makes clinical decisions. It uses approved claims only.', blocked: ['clinical outcome', 'better outcomes', 'safer than', 'reduces infection', 'proven to', 'longer lasting', 'clinical evidence'] },
      { id: 'cg2', text: 'Contract prices and terms are set by the contracts team. The Companion never quotes or suggests one.', blocked: ['discount', 'best price', 'free equipment', 'price match', 'below cost'] },
    ],
  },
};
