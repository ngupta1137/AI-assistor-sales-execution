// Sales Companion content for consumer goods: role titles, expense categories, required trainings,
// learning, knowledge base, pitch and value story templates, sample activations and guardrails.

export default {
  companion: {
    roles: { rep: 'Sales rep', manager: 'Area sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and tolls', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'display', label: 'Display materials bought locally', limitClass: 'other' },
      { id: 'lodging', label: 'Hotel for an overnight trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'agreement', label: 'Retailer agreement and display standards', cycleMonths: 12 },
      { id: 'foodsafety', label: 'Food safety and handling basics', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
      { id: 'launch', label: 'Product range and launch training', cycleMonths: 6 },
    ],
    learningModules: [
      { id: 'm1', title: 'Reading the shelf in five minutes', minutes: 15, summary: 'Check facings, price tags, dates and gaps in a fixed order, so no aisle is skipped.' },
      { id: 'm2', title: 'Fixing an out-of-stock at the root', minutes: 20, summary: 'Tell a shelf gap from an ordering gap, and agree a minimum quantity with the {contact}.' },
      { id: 'm3', title: 'Building a display that gets approved', minutes: 25, summary: 'What the retailer agreement allows, where material may go, and how to ask for space.' },
      { id: 'm4', title: 'Listing a new product', minutes: 20, summary: 'Prepare the case for one facing, a trial quantity and a review date.' },
      { id: 'm5', title: 'Taking an {order} that matches the shelf', minutes: 15, summary: 'Use days of cover and sell-through, not last week\'s {order}.' },
      { id: 'm6', title: 'Working with the {kam}', minutes: 20, summary: 'When to escalate, what to log, and how to keep the {contact} informed.' },
      { id: 'm7', title: 'Photos that prove a display', minutes: 10, summary: 'Angles, lighting and what the audit needs to see.' },
      { id: 'm8', title: 'Planning a day around delivery days', minutes: 15, summary: 'Visit after delivery so a gap can be fixed in one trip.' },
      { id: 'm9', title: 'Holiday season readiness', minutes: 25, summary: 'Space booking, stock cover and display timing before the holiday peak.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I request extra display space?', text: 'Ask the {contact} for a specific spot and a date range, and show the display plan. Follow the retailer agreement. If the answer is no, log it and raise it with your {kam}.' },
      { id: 'k2', title: 'What counts as a valid shelf photo?', text: 'One wide photo of the whole bay and one close photo of the gap. Date and store visible. No people in the frame. Photos that do not show the bay cannot support a display audit.' },
      { id: 'k3', title: 'How do I flag a wrong shelf price?', text: 'Compare the tag with the retailer price file, photograph the mismatch and tell the {contact}. The {account} corrects the tag. Never change a price tag yourself.' },
      { id: 'k4', title: 'What if a delivery has not arrived?', text: 'Check with the distributor, then move the {visit} to the day after delivery. Use Mark closed today on the route and the plan re-plans.' },
      { id: 'k5', title: 'How do I read days of cover?', text: 'Days of cover is stock on hand divided by average daily sales. Under about five days on a fast line means order now. The {order} draft shows it for each line.' },
      { id: 'k6', title: 'Who approves a large {order}?', text: 'Orders above the approval limit go to your {manager}. The limit is shown on the {order} screen, and the {order} says who it is waiting for.' },
      { id: 'k7', title: 'How do I handle near-date product?', text: 'Agree with the {contact} which units go to the markdown area, scan the batch codes so the return is logged, and rotate the rest to the front.' },
      { id: 'k8', title: 'How should I log a refusal?', text: 'Record the reason code, the name of the {contact} and the date. A refusal is useful data. It is not a mark against you.' },
      { id: 'k9', title: 'What is the right way to claim mileage?', text: 'Log the start and end of each trip from the route plan. Claims follow the company mileage rate and the distance unit for your country.' },
      { id: 'k10', title: 'How do I prepare for a key {account} {visit}?', text: 'Open the {visit} brief, read the top three actions, bring the display plan and the price file, and check the open items from the last {visit}.' },
      { id: 'k11', title: 'What do I do if a {contact} is unhappy?', text: 'Listen first, write down what they say, fix what you can in the {visit} and tell your {manager} what you could not fix.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there: it is the clearest gap on the shelf.' },
      { id: 'p2', uses: ['offer'], text: 'There is room to list {offer} with one facing. Suggest a trial quantity and agree a review date with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so agree stock and space for it now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Shelf and sell-through', uses: ['share', 'orderCount'], text: '{name} has captured {share} of its estimated potential. Across the last {orderCount} {orders}, the shelf has kept the same core lines. The next step is to close the gaps we found together, one at a time, and look again at the next {visit}.' },
      { id: 's2', title: 'A range that grows with the shelf', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. Adding {offer} in a small trial gives {person} a new line to test without giving up space, and the next {order} will show how it sells.' },
      { id: 's3', title: 'Space for the season', uses: ['potential', 'share'], text: 'Estimated potential at {name} is {potential} a year and the current figure is {current}. The gap of {whitespace} is an estimate from sample data. It is the reason to plan the season display together.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Holiday display launch', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'New product listing push', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Display terms and prices follow each retailer agreement. The Companion never promises a price, a margin or a sales result.', blocked: ['guarantee', 'free goods', 'extra margin', 'price match', 'will increase', 'side deal', 'under the table'] },
      { id: 'cg2', text: 'Value stories use sample data and say so. They never claim a performance result.', blocked: ['proven to', 'always sells', 'doubles sales', 'will boost', 'risk free'] },
    ],
  },
};
