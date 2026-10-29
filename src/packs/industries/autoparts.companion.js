// Sales Companion content for auto parts. Genuine parts only; warranty outcomes belong to the warranty team;
// parts follow the vehicle maker's specification; fleets under contract review keep their visits.

export default {
  companion: {
    roles: { rep: 'Field sales rep', manager: 'Area sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'training', label: 'Training session materials', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a regional trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'catalog', label: 'Parts catalog and fitment training', cycleMonths: 12 },
      { id: 'genuine', label: 'Genuine part checks', cycleMonths: 12 },
      { id: 'warranty', label: 'Warranty process', cycleMonths: 12 },
      { id: 'workshop', label: 'Workshop safety', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Reading a parts rack in five minutes', minutes: 15, summary: 'Fast movers first, then ranges and gaps.' },
      { id: 'm2', title: 'Running a fitting session', minutes: 25, summary: 'The approved guide, a cutaway part and signed attendance.' },
      { id: 'm3', title: 'Checking a part against the register', minutes: 10, summary: 'Scan the batch code, check the hologram and report any mismatch.' },
      { id: 'm4', title: 'Collecting warranty facts', minutes: 15, summary: 'The part, the invoice and the fitting date. No promises.' },
      { id: 'm5', title: 'Fitment and vehicle specification', minutes: 20, summary: 'Use the maker\'s specification, and ask technical when unsure.' },
      { id: 'm6', title: 'Enrolling a workshop in the loyalty program', minutes: 10, summary: 'Written consent, genuine parts only.' },
      { id: 'm7', title: 'Fleet maintenance plans', minutes: 25, summary: 'Service schedule, bulk lubricants and contract steps.' },
      { id: 'm8', title: 'Counter displays that help mechanics', minutes: 10, summary: 'Fitment charts and the right place next to the till.' },
      { id: 'm9', title: 'Visiting before the first car is on the lift', minutes: 10, summary: 'Why early works at a {account}.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I check a part is genuine?', text: 'Scan the batch code against the genuine-part register and check the hologram. A code that is not in the register is suspect. Photograph it, report it to brand protection and do not move the stock.' },
      { id: 'k2', title: 'How do I know a part fits the vehicle?', text: 'Check the vehicle maker\'s specification and the fitment list for local models. If the fitment is unclear, ask the technical team before you order.' },
      { id: 'k3', title: 'What do I do with a warranty claim?', text: 'Collect the failed part, the invoice and the fitting date and pass them to the warranty team. They decide. Never promise any outcome or predict one.' },
      { id: 'k4', title: 'How do I run a fitting session?', text: 'Use the approved fitting guide and a cutaway part, and ask each mechanic to sign the attendance sheet. Log the session the same day.' },
      { id: 'k5', title: 'How do I enroll a workshop in the loyalty program?', text: 'Explain that points are earned on genuine part purchases, collect written consent and record a phone number. Enrollment is voluntary.' },
      { id: 'k6', title: 'What belongs in a fleet maintenance plan?', text: 'The service intervals from the fleet\'s own log, the lubricant spec for each vehicle group and the delivery dates. Contract terms are confirmed by your {kam}.' },
      { id: 'k7', title: 'Which lines should a rack always have?', text: 'The fast movers for the local vehicle mix. The draft shows days left on each line. Agree a minimum level for the top five lines with the {contact}.' },
      { id: 'k8', title: 'When are workshops free to talk?', text: 'Early, before the first car is on the lift, or in the lull after lunch. A {visit} in the middle of a job wastes the owner\'s time.' },
      { id: 'k9', title: 'What if the {contact} asks for a cheaper part outside the spec?', text: 'Explain that you only supply parts that match the vehicle maker\'s specification, and show the nearest genuine option. Never suggest a substitute.' },
      { id: 'k10', title: 'Which training costs can I claim?', text: 'Materials for an approved fitting session within the sample limit, with a receipt and the session reference.' },
      { id: 'k11', title: 'How should I handle a suspect pack?', text: 'Do not remove or sell it. Photograph the pack, scan the code, tell the {contact} why and report it so brand protection can follow up.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start at the parts rack with {person}.' },
      { id: 'p2', uses: ['offer'], text: 'There is room for {offer} on the rack. Show {person} the fitment list for local vehicles and suggest a few units to test demand.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Agree rack levels and any training with {person} before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A rack that matches the jobs', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, the fast movers have set the pace. The next step is to agree minimum levels on the top lines.' },
      { id: 's2', title: 'A new part to try', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A few units of {offer}, with the fitment list for local vehicles, let {person} test demand with little risk.' },
      { id: 's3', title: 'Planning the year', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a sample estimate. It is a reason to plan stock and training with {person}.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Fitting session tour', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Genuine-part check round', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Genuine parts only. The Companion never suggests selling or moving a suspected counterfeit.', blocked: ['sell the fake', 'relabel', 'repack', 'cheaper copy', 'grey market', 'any engine'] },
      { id: 'cg2', text: 'Warranty outcomes are decided by the warranty team. The Companion never promises one.', blocked: ['approve the claim', 'promise a replacement', 'will be covered', 'free replacement'] },
    ],
  },
};
