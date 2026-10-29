// Sales Companion content for building materials and paints. Quotes above the threshold need approval;
// discounts and credit are decided by people; performance claims use the approved data sheet.

export default {
  companion: {
    roles: { rep: 'Territory sales officer', manager: 'Area sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and site access', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'shade', label: 'Shade cards and sample boards', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a project visit', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'product', label: 'Product range and data sheet training', cycleMonths: 12 },
      { id: 'tinting', label: 'Tinting machine calibration', cycleMonths: 12 },
      { id: 'site', label: 'Site safety induction', cycleMonths: 12 },
      { id: 'quotes', label: 'Quoting and approval rules', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Planning dealer stock from sell-out', minutes: 20, summary: 'Read counter sales and days of stock, and plan about four weeks, not a month-end push.' },
      { id: 'm2', title: 'Refreshing a shade display', minutes: 15, summary: 'Replace the fan deck, clear old cards and make premium shades easy to see.' },
      { id: 'm3', title: 'Calibrating a tinting machine', minutes: 20, summary: 'The monthly calibration card, what to log and when to call service.' },
      { id: 'm4', title: 'Running a contractor meet', minutes: 25, summary: 'A live demo of coverage and finish, then consent for the loyalty program.' },
      { id: 'm5', title: 'Following a project lead', minutes: 25, summary: 'Specification stage, the architect, and what needs approval before a quote goes out.' },
      { id: 'm6', title: 'Handling a site complaint', minutes: 20, summary: 'Photos, batch number and surface preparation. The technical team decides any remedy.' },
      { id: 'm7', title: 'Using the data sheet in a conversation', minutes: 15, summary: 'Quote the sheet, not memory.' },
      { id: 'm8', title: 'Talking about dues without extending credit', minutes: 15, summary: 'Share the statement, agree a date and leave terms to finance.' },
      { id: 'm9', title: 'Repaint season readiness', minutes: 20, summary: 'Stock cover and displays before the repaint peak.' },
    ],
    knowledge: [
      { id: 'k1', title: 'Who approves a large quote?', text: 'Your {manager}. Quotes above the threshold shown on the {order} screen need approval before they are sent. The agent never offers special terms, and neither should you in the {visit}.' },
      { id: 'k2', title: 'How do I plan stock for a dealer?', text: 'Use counter sell-out and days of stock, and plan about four weeks. Walk the stock room with the {contact} before agreeing quantities. Do not load stock to reach a target.' },
      { id: 'k3', title: 'What should I check on a tinting machine?', text: 'Run the calibration card, check for repeated errors in the log and photograph the reading. If errors continue, book a service visit. It is free under the dealer agreement.' },
      { id: 'k4', title: 'How do I follow a project lead?', text: 'Meet the project manager or architect with the specification sheet and a finished sample, and ask which performance points matter. Do not quote special terms. Approval comes after the {visit}.' },
      { id: 'k5', title: 'What do I do with a site complaint?', text: 'Photograph the problem, note the batch number and surface preparation, and send it to the technical team. They decide any remedy. Do not promise one on site.' },
      { id: 'k6', title: 'How do I run a contractor meet?', text: 'Demonstrate coverage and finish using the approved data sheet, take attendance, and enroll painters in the loyalty program only with their written consent.' },
      { id: 'k7', title: 'Can I extend credit to a dealer?', text: 'No. Credit terms and limits stay with finance. You can share the statement and agree a payment date, nothing more.' },
      { id: 'k8', title: 'How do I refresh a shade display?', text: 'Replace the old fan deck and cards with the current collection, place the premium shades at eye level and photograph the display for the audit.' },
      { id: 'k9', title: 'What can I say about how long a finish lasts?', text: 'Only what the approved data sheet says, in its own words. If it is not on the sheet, do not say it.' },
      { id: 'k10', title: 'How do I claim shade cards and sample boards?', text: 'Within the sample limit, with a receipt and the dealer or project name. Boards made for a specific specification meeting are allowed.' },
      { id: 'k11', title: 'When is a {visit} best at a dealer?', text: 'Early, or in the quiet hours after lunch, before contractors arrive for pickups. A quiet counter also leaves room to refresh the display.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there, with {person} at the counter or on site.' },
      { id: 'p2', uses: ['offer'], text: 'There is room to bring in {offer}. Show a finished sample and the data sheet, and agree a small trial with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Plan stock for about four weeks with {person} before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Counter and site together', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, counter sales have set the pace. The next step is to agree stock for about four weeks and refresh the display.' },
      { id: 's2', title: 'A new finish to try', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A trial of {offer}, with a finished sample and the data sheet, lets {person} see how it works before committing.' },
      { id: 's3', title: 'The repaint season', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a sample estimate. It is a reason to plan the season with {person}, with no promise attached.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Shade collection refresh', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Contractor meet series', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Quotes above the threshold need approval. The Companion never offers a discount or a special price.', blocked: ['discount', 'best price', 'price cut', 'special price', 'match the competitor'] },
      { id: 'cg2', text: 'Performance claims use the approved data sheet only.', blocked: ['lasts longer', 'lifetime', 'never peels', 'ten years', 'twenty years', 'maintenance free'] },
    ],
  },
};
