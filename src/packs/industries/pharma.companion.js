// Sales Companion content for pharma. Approved material only. No clinical claims, comparisons or
// inducements anywhere: the Companion helps with access, availability, logging and learning.

export default {
  companion: {
    roles: { rep: 'Medical rep', manager: 'Area manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking at hospitals', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'room', label: 'Approved meeting room hire', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a regional visit', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'code', label: 'Industry code of practice', cycleMonths: 12 },
      { id: 'product', label: 'Approved product knowledge', cycleMonths: 6 },
      { id: 'samples', label: 'Sample handling and logging', cycleMonths: 12 },
      { id: 'adverse', label: 'Adverse event reporting', cycleMonths: 12 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Using approved material, nothing else', minutes: 15, summary: 'Which leave-behinds are approved for your market, how to check the date, and what to do when a {contact} asks for more.' },
      { id: 'm2', title: 'Logging a sample drop with a signed receipt', minutes: 10, summary: 'The per-{visit} limit, the signature, and why a request is not a drop.' },
      { id: 'm3', title: 'Passing a question to Medical Information', minutes: 10, summary: 'How to log what was asked word for word and tell the {contact} what happens next.' },
      { id: 'm4', title: 'Planning {visits} around consultation hours', minutes: 15, summary: 'Ask the practice manager for a regular slot and keep {visits} short.' },
      { id: 'm5', title: 'A five minute detailing structure', minutes: 20, summary: 'Open with a question, use one approved page, close with the next step.' },
      { id: 'm6', title: 'Working with hospital procurement', minutes: 25, summary: 'Who decides listings, what the committee needs, and how long reviews take.' },
      { id: 'm7', title: 'Reporting an adverse event within one day', minutes: 15, summary: 'What to write down, who to tell, and what you never say to the {contact}.' },
      { id: 'm8', title: 'Pharmacy availability checks', minutes: 15, summary: 'Scan the shelf, note gaps, and tell the key account team about supply problems.' },
      { id: 'm9', title: 'Consent for approved emails', minutes: 10, summary: 'How to ask, record and renew consent, and how to honour an opt-out.' },
    ],
    knowledge: [
      { id: 'k1', title: 'Which material can I use with a {contact}?', text: 'Only material approved for your market and still in date. The action names the leave-behind. If the {contact} asks about something it does not cover, do not answer. Log it for Medical Information.' },
      { id: 'k2', title: 'How many samples can I leave?', text: 'At most two packs of each product per {contact} per {visit}. The {order} screen blocks a line over the limit. A drop counts only when the {contact} signs the receipt.' },
      { id: 'k3', title: 'What do I do with a question I cannot answer?', text: 'Write down the question as it was asked, log a Medical Information request the same day and tell the {contact} who will reply. Do not guess and do not discuss what the answer might be.' },
      { id: 'k4', title: 'How do I report an adverse event?', text: 'Record what you were told, who told you and when, and send it to the safety team within one working day. Do not judge the cause and do not advise the {contact}.' },
      { id: 'k5', title: 'What are hospital access rules?', text: 'Each hospital sets who a {rep} may see and when. Follow the rules for the {account}. If a rule blocks a {visit}, use the override with the reason and tell your {kam}.' },
      { id: 'k6', title: 'How does a formulary review work?', text: 'A committee reviews the submitted file and decides on a listing. Offer the approved summary, ask what else the committee needs and route scientific questions to Medical Affairs.' },
      { id: 'k7', title: 'Can I invite a {contact} to a meeting?', text: 'Only to approved education meetings, using the approved invitation. Attendance is logged. Hospitality stays inside the industry code. Never offer anything outside it.' },
      { id: 'k8', title: 'How do I get consent for approved emails?', text: 'Explain what the {contact} will receive and how to opt out, then record a signature. Consent is renewed every twelve months. Never assume or pre-tick consent.' },
      { id: 'k9', title: 'What do I check for near-expiry packs?', text: 'Scan packs with fewer than ninety days left, agree with the pharmacist which go back to the wholesaler and log the batch codes. Rotate newer packs to the back.' },
      { id: 'k10', title: 'Which expenses can I claim for a meeting?', text: 'Approved room hire and travel inside the sample limits. Meals for the {contact} are not claimable unless the industry code allows them for that event. Ask your {manager} first.' },
      { id: 'k11', title: 'How should I prepare for a hospital {visit}?', text: 'Open the brief, read the top actions, bring the approved material and the formulary file, and check open requests from the last {visit}. Keep the {visit} to the time agreed.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Offer the approved material that fits, and agree with {person} when to follow up.' },
      { id: 'p2', uses: ['offer'], text: 'Approved information on {offer} is ready. Ask {person} which part would help, and use only that material.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Confirm that the core range is available, and plan the next {visit} around the practice diary before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Availability and reach', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, supply of the core range has been steady. The next step is to confirm availability and agree a date for the next {visit}.' },
      { id: 's2', title: 'Approved information on request', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. Approved information on {offer} is available for {person} on request, and any question it does not cover goes to Medical Information.' },
      { id: 's3', title: 'Regular {visits}, clear next steps', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a sample estimate. It is a reason to keep {visits} regular, not a statement about any outcome.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Hospital listing support round', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Pharmacy availability check round', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'The Companion uses approved material only. It never writes clinical claims, comparisons or off-label content.', blocked: ['dosing', 'dosage', 'side effect', 'safe for', 'efficacy', 'works better', 'better than', 'off-label', 'off label', 'cures'] },
      { id: 'cg2', text: 'Samples and meetings stay inside compliance limits. The Companion never suggests anything that could be an inducement.', blocked: ['free trip', 'gift for', 'in return for', 'kickback', 'prescribe more', 'switch your patients'] },
    ],
  },
};
