// Sales Companion content for apparel and footwear: role titles, expense categories, required trainings,
// learning, knowledge base, pitch and value story templates, sample activations and guardrails.

export default {
  companion: {
    roles: { rep: 'Wholesale rep', manager: 'Area manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and sample van fees', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'props', label: 'Display props bought locally', limitClass: 'other' },
      { id: 'lodging', label: 'Hotel for a trade show trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'trade', label: 'Trade agreement and price list rules', cycleMonths: 12 },
      { id: 'range', label: 'Season range and size curve training', cycleMonths: 6 },
      { id: 'competition', label: 'Fair dealing and resale price rules', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'm1', title: 'Reading a size curve', minutes: 15, summary: 'Compare what sold with what remains, spot a broken run and propose only what is missing.' },
      { id: 'm2', title: 'Selling a new range in person', minutes: 25, summary: 'Let the {contact} handle the sample first, then suggest a small first run in the core sizes.' },
      { id: 'm3', title: 'Pre-season order meetings', minutes: 25, summary: 'Review last season, build around the agreed order budget and set the follow-up date.' },
      { id: 'm4', title: 'Setting a floor display', minutes: 20, summary: 'Use the visual guide, ask where the story can go and respect the {account} layout.' },
      { id: 'm5', title: 'Taking an in-season reorder', minutes: 15, summary: 'Open with sell-through, size to four weeks of sales and confirm the delivery date.' },
      { id: 'm6', title: 'Working with the {kam}', minutes: 20, summary: 'When to escalate a trade agreement question and what to log so nothing is lost.' },
      { id: 'm7', title: 'Handling returns conversations', minutes: 15, summary: 'Group return reasons, separate fit from quality and route each to the right team.' },
      { id: 'm8', title: 'Planning around trading peaks', minutes: 15, summary: 'Book quiet weekdays for range reviews and keep peaks for service calls.' },
      { id: 'm9', title: 'Online listing basics', minutes: 20, summary: 'What a good image pack and size chart contain, and how to check they are live.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I prepare a sample bag?', text: 'Pack the range in the order you will show it, include a size chart and a price sheet, and check each sample for damage. Record the set on the signed receipt before you leave it with a {contact}.' },
      { id: 'k2', title: 'What counts as a valid floor photo?', text: 'One wide photo of the whole display and one close photo of the styles. The date and the {account} visible. Photos that do not show the full display cannot support a layout agreement.' },
      { id: 'k3', title: 'What is the exchange window?', text: 'The trade agreement sets a period during which unsold styles may be exchanged. Check the dates on the agreement and note them in the {visit} record. Never promise a window the agreement does not give.' },
      { id: 'k4', title: 'What if the {contact} asks what to charge?', text: 'The {account} sets its own resale prices. Show the wholesale price list and how the style sold through elsewhere, and leave the decision with the {contact}.' },
      { id: 'k5', title: 'How do I read weeks of cover?', text: 'Weeks of cover is stock on hand divided by average weekly sales. Under about three weeks on a selling style means order now. The {order} draft shows it per line.' },
      { id: 'k6', title: 'Who approves a large {order}?', text: 'Orders above the approval limit go to your {manager}. The limit shows on the {order} screen with whoever it is waiting for.' },
      { id: 'k7', title: 'What if the style sells out at the showroom?', text: 'Offer the closest style from the plan, log the lost demand and tell the {contact} when the next delivery is due. Do not promise a date the depot has not confirmed.' },
      { id: 'k8', title: 'How should I log a refusal?', text: 'When a {contact} says no, note the reason code, the name and the date. The agents learn from refusals, and they are not used to score you.' },
      { id: 'k9', title: 'What is the right way to claim mileage?', text: 'Use the trip start and end from the route plan. Claims follow the company mileage rate and the distance unit set for your country.' },
      { id: 'k10', title: 'How do I prepare for a department store appointment?', text: 'Open the {visit} brief, read the top three actions, bring last season\'s sell-through and the price list, and check the open items from the last appointment.' },
      { id: 'k11', title: 'What if the {contact} is unhappy?', text: 'Hear the complaint out, write it down in their words, put right what you can in the room and pass the rest to your {manager} the same day.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there: it is the clearest gap on the floor.' },
      { id: 'p2', uses: ['offer'], text: '{offer} could fill a gap in the current range. Let {person} handle the sample and suggest a first run in the core sizes.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so settle the plan and the order budget now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A range that sells through', uses: ['share', 'orderCount'], text: '{name} has captured {share} of its estimated potential. Across the last {orderCount} {orders}, the core sizes sold best. The next step is to repair the sizes we found missing and look at sell-through again at the next {visit}.' },
      { id: 's2', title: 'A new style for the floor', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A first run of {offer} lets {person} test a new look in the core sizes without changing the rest of the range.' },
      { id: 's3', title: 'Ready for the season', uses: ['potential', 'share'], text: 'Estimated potential at {name} is {potential} a year and the current figure is {current}. The gap of {whitespace} is an estimate from benchmark data. It is the reason to plan the season together.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Pre-season showroom days', startWeek: 1, weeks: 3, perWeek: 6 },
      { id: 'r2', name: 'In-season reorder calls', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'ag1', text: 'The retailer sets its own resale prices. The Companion never recommends a price or a markdown.', blocked: ['sell it at', 'retail price of', 'mark it down', 'guarantee', 'price match', 'under the table'] },
      { id: 'ag2', text: 'Value stories use benchmark data and say so. They never claim a result for a season.', blocked: ['proven to', 'doubles sales', 'will boost', 'risk free', 'will sell out', 'side deal'] },
    ],
  },
};
