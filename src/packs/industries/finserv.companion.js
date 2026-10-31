// Sales Companion content for financial services. The Companion never sets a price or a rate and never approves credit.
// Suitability and signed consent come before any product. Collections follow the fair treatment policy.

export default {
  companion: {
    roles: { rep: 'Relationship officer', manager: 'Branch sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'courier', label: 'Courier for signed documents', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a regional visit', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'licensing', label: 'Sales licensing and conduct', cycleMonths: 12 },
      { id: 'suitability', label: 'Suitability and consent', cycleMonths: 12 },
      { id: 'aml', label: 'Anti-money laundering awareness', cycleMonths: 12 },
      { id: 'fair', label: 'Fair treatment in collections', cycleMonths: 12 },
      { id: 'privacy', label: 'Customer data privacy', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Running a needs review', minutes: 25, summary: 'Questions about the business, a documented fit and signed consent.' },
      { id: 'm2', title: 'Collecting documents for an application', minutes: 15, summary: 'The checklist, and why you never hint at an outcome.' },
      { id: 'm3', title: 'Refreshing KYC documents', minutes: 15, summary: 'Originals only, scanned and stored.' },
      { id: 'm4', title: 'Terminal health checks', minutes: 10, summary: 'Test payment, reset and when to swap a device.' },
      { id: 'm5', title: 'Early arrears conversations', minutes: 25, summary: 'Listen first, follow the fair treatment script, leave relief to the collections team.' },
      { id: 'm6', title: 'Agent outlet compliance', minutes: 15, summary: 'Fee chart, complaint notice and e-float limits.' },
      { id: 'm7', title: 'Explaining fees from the approved sheet', minutes: 15, summary: 'Say what is on the sheet and nothing more.' },
      { id: 'm8', title: 'Setting up QR payments', minutes: 10, summary: 'Stand, test payment and a photo for the file.' },
      { id: 'm9', title: 'Visiting outside the lunch peak', minutes: 10, summary: 'Quiet slots make a needs review possible.' },
    ],
    knowledge: [
      { id: 'k1', title: 'What is a needs review?', text: 'A short, documented conversation about what the business needs. A product is offered only if it shows a fit, and the {contact} signs consent before any application.' },
      { id: 'k2', title: 'Who decides on credit?', text: 'The credit and underwriting teams. You collect documents and record interest with consent. You never set a rate, hint at an outcome or approve anything.' },
      { id: 'k3', title: 'How do I refresh KYC documents?', text: 'Ask for the originals, scan them in the {visit}, explain how they are stored and record the date. Never accept edited copies.' },
      { id: 'k4', title: 'What do I do if a terminal keeps failing?', text: 'Run a test payment, reset it and check the network. If it fails again, log the serial and ask for a swap. Tell the {contact} when to expect the new device.' },
      { id: 'k5', title: 'How do I talk to a {contact} about missed repayments?', text: 'Listen first, follow the fair treatment script and note what the {contact} says. Hardship options are decided by the collections team, never promised in the {visit}.' },
      { id: 'k6', title: 'What must an agent outlet display?', text: 'The fee chart and the complaint notice, both visible to customers. Photograph them for the compliance record.' },
      { id: 'k7', title: 'Which fees can I explain?', text: 'Only fees on the approved sheet, read as written. If the {contact} asks about something not on the sheet, say you will find out and log it.' },
      { id: 'k8', title: 'How do I record consent?', text: 'Explain what the {contact} agrees to, capture the signature on the signature pad and save it with the date. Consent is not assumed and not pre-filled.' },
      { id: 'k9', title: 'When is a good time to see a {contact}?', text: 'Outside the lunch peak and the end-of-day cash count. A needs review takes about twenty quiet minutes.' },
      { id: 'k10', title: 'Which courier costs can I claim?', text: 'Courier for signed documents within the policy limit, with the receipt and the file reference.' },
      { id: 'k11', title: 'How do I set up QR payments at a {account}?', text: 'Place the stand next to the till, make a test payment with the {contact} and photograph the setup. There is no charge for the kit in this demo.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Ask {person} what is getting in the way before you mention any product.' },
      { id: 'p2', uses: ['offer'], text: 'If the needs review shows a fit, {offer} may be worth explaining from the approved sheet. Get {person}\'s consent first.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so ask {person} how trading will change and what the business needs.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Payments that work', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, activity has been steady. The next step is to keep payments working and to ask what the business needs.' },
      { id: 's2', title: 'A conversation, not a product', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. If a needs review shows a fit, {offer} can be explained from the approved sheet, with consent first and a decision by the credit team where credit is involved.' },
      { id: 's3', title: 'Planning together', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a benchmark estimate. It is a reason to keep talking with {person}, with no outcome promised.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Terminal replacement round', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'KYC refresh campaign', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'The Companion never sets a price or a rate, and never approves credit.', blocked: ['set the rate', 'approve the loan', 'approve credit', 'pre-approve', 'will be approved', 'lower the rate', 'best rate'] },
      { id: 'cg2', text: 'Suitability and signed consent come before any product. No mis-selling and no pressure.', blocked: ['without consent', 'skip the needs review', 'push the loan', 'guarantee approval', 'threaten'] },
    ],
  },
};
