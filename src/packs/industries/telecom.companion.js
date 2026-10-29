// Sales Companion content for telecom retail. No activation without valid ID; offers follow the published tariff.

export default {
  companion: {
    roles: { rep: 'Channel sales rep', manager: 'Zonal sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel for beat visits', limitClass: 'travel' },
      { id: 'parking', label: 'Parking', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'branding', label: 'Signage and branding materials', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a zone visit', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'kyc', label: 'KYC rules and record checks', cycleMonths: 12 },
      { id: 'tariff', label: 'Published tariff and offer rules', cycleMonths: 6 },
      { id: 'privacy', label: 'Customer data privacy', cycleMonths: 12 },
      { id: 'fair', label: 'Fair selling and no mis-selling', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'KYC at the counter', minutes: 20, summary: 'Valid ID, the live photo and what to do when a customer has no ID with them.' },
      { id: 'm2', title: 'Float and the distributor limit', minutes: 15, summary: 'Read the balance and top up within the limit.' },
      { id: 'm3', title: 'Counting and logging SIM kits', minutes: 10, summary: 'Serial ranges, logging and what to do about a gap.' },
      { id: 'm4', title: 'Explaining a plan from the published tariff', minutes: 20, summary: 'Use the tariff sheet, and match the plan to how the customer uses the phone.' },
      { id: 'm5', title: 'Setting up a live device demo', minutes: 15, summary: 'Demo mode, a charged unit and three points from the feature sheet.' },
      { id: 'm6', title: 'Branding standards', minutes: 10, summary: 'Where signage goes and how to photograph it for the audit.' },
      { id: 'm7', title: 'Festival offer readiness', minutes: 15, summary: 'Display, staff briefing and stock before the peak.' },
      { id: 'm8', title: 'Logging a coverage complaint', minutes: 10, summary: 'Streets, times and what the customer saw.' },
      { id: 'm9', title: 'Visiting before the evening peak', minutes: 10, summary: 'Why early afternoon works at a {account}.' },
    ],
    knowledge: [
      { id: 'k1', title: 'What does KYC need at the counter?', text: 'A valid ID and the live photo, scanned and complete before any activation. The {contact} completes the record with the customer. If an ID is missing, the SIM is not activated.' },
      { id: 'k2', title: 'Why is there a float limit?', text: 'The distributor sets a limit for each {account}. Float above it is a credit risk for the {account} and the distributor. The draft tops up to the usual weekly level and never above the limit.' },
      { id: 'k3', title: 'How do I log SIM kits?', text: 'Count the kits, record the serial range and note any gap. The distributor delivers on fixed days. Never move kits between outlets without logging it.' },
      { id: 'k4', title: 'How do I explain a plan?', text: 'Use the published tariff sheet. Ask how the customer uses the phone first, then suggest a plan that fits. Never describe a price that is not on the sheet.' },
      { id: 'k5', title: 'What is an outlet suspended for KYC?', text: 'An {account} whose records were found incomplete. Activations stop until the records are fixed. Tell your {manager} and the {kam} and help the {contact} complete the records.' },
      { id: 'k6', title: 'How do I set up a device demo?', text: 'Charge the unit, switch on store demo mode and keep it on the counter. Show three points from the approved feature sheet and nothing more.' },
      { id: 'k7', title: 'What can I say about coverage?', text: 'Only what the published coverage map shows. For a complaint, log the street and time and tell the {contact} when the network team will reply.' },
      { id: 'k8', title: 'How do I prepare for a festival offer?', text: 'Place the offer card where customers queue, brief staff on the published terms and check float and SIM stock before the peak.' },
      { id: 'k9', title: 'Which branding items can I claim?', text: 'Signage and danglers needed to replace faded items, inside the sample limit, with a receipt and a photo of the result.' },
      { id: 'k10', title: 'When is the evening peak?', text: 'Most outlets are busiest after work. A {visit} before the peak leaves the counter ready, and a top-up lands before the busiest hours.' },
      { id: 'k11', title: 'What if a customer has no ID with them?', text: 'The answer is always no. Explain what the customer needs to bring and that the rule protects them as well.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there with {person}, before the evening peak.' },
      { id: 'p2', uses: ['offer'], text: 'There is room to push {offer}. Match it to how customers use their phones and explain it from the published tariff, with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Plan float, SIM stock and the offer card with {person} before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A counter ready for the peak', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, float and SIM stock have followed the evening pattern. The next step is to keep both ready before the peak.' },
      { id: 's2', title: 'A new line for customers', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. {offer} gives {person} something new to offer, explained from the published tariff and matched to what each customer needs.' },
      { id: 's3', title: 'Planning for the season', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a sample estimate. It is a reason to plan the season with {person}.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Festival offer launch', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'KYC records check round', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'No activation without a valid ID. The Companion never suggests skipping a KYC check.', blocked: ['skip kyc', 'without id', 'without an id', 'fake id', 'bypass kyc'] },
      { id: 'cg2', text: 'Prices and offers follow the published tariff. The Companion never creates a price or an offer.', blocked: ['special price', 'free data', 'custom plan', 'discount', 'extra validity'] },
    ],
  },
};
