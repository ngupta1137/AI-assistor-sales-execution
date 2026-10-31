// Sales Companion content for beverages and alcohol. Responsible marketing, local licensing and age rules first.

export default {
  companion: {
    roles: { rep: 'Brand rep', manager: 'Area sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking near venues', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'glass', label: 'Glassware and serve materials', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for an event', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'rms', label: 'Responsible service and age checks', cycleMonths: 12 },
      { id: 'licensing', label: 'Local licensing rules for on-trade', cycleMonths: 12 },
      { id: 'draught', label: 'Draught quality and line cleaning', cycleMonths: 12 },
      { id: 'marketing', label: 'Responsible marketing code', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Responsible marketing in practice', minutes: 20, summary: 'What an activation may and may not do, and who it must never be aimed at.' },
      { id: 'm2', title: 'Checking a pour and a line', minutes: 20, summary: 'Temperature, clarity, head and the cleaning log, in a fixed order.' },
      { id: 'm3', title: 'Winning a menu listing', minutes: 20, summary: 'Timing around the reprint, support under the trade agreement and a clear next step.' },
      { id: 'm4', title: 'Planning an activation night', minutes: 25, summary: 'Dates, staffing, license cover and the responsible service briefing.' },
      { id: 'm5', title: 'Cooler placement and purity', minutes: 15, summary: 'Where it goes, power, and what the signed form says.' },
      { id: 'm6', title: 'Training bar staff on a serve', minutes: 15, summary: 'The perfect serve, age checks and refusing service.' },
      { id: 'm7', title: 'Keg rotation and weekend cover', minutes: 15, summary: 'Order for about two weekends and no more.' },
      { id: 'm8', title: 'Visiting before service', minutes: 10, summary: 'Why afternoons work, and how to use the time.' },
      { id: 'm9', title: 'Hotels and several outlets', minutes: 20, summary: 'Who decides across outlets and how to keep each {contact} informed.' },
    ],
    knowledge: [
      { id: 'k1', title: 'What does the outlet license allow?', text: 'Each {account} holds its own license, with its own hours and limits. Check that an event is covered before you plan it. If you are not sure, ask the {contact} and your {manager}.' },
      { id: 'k2', title: 'How often should draught lines be cleaned?', text: 'The standard is weekly. The draught action shows the last clean date. Book the cleaning service if the date is old or the pour looks wrong.' },
      { id: 'k3', title: 'How do I plan an activation night?', text: 'Offer two dates, agree staffing with the {contact}, confirm the license covers the event and brief staff on responsible service. Never aim it at anyone under the legal age.' },
      { id: 'k4', title: 'How much stock should an {order} cover?', text: 'About two weekends of expected sales. The draft uses weekend sales and days left on the current keg. More than that spoils and hides problems with the lines.' },
      { id: 'k5', title: 'What do I do if I see an under-age sale?', text: 'Remind the {contact} of the age-check rule, give them the signs, and tell your {manager}. The {account} is responsible for its license, and you protect the brand.' },
      { id: 'k6', title: 'How do I ask for a cooler placement?', text: 'Agree the location and the power point with the {contact}, explain the purity terms before signing and photograph the placement for the audit.' },
      { id: 'k7', title: 'What can I offer to win a menu listing?', text: 'Menu design help and staff training under the trade agreement. Nothing in cash and no free stock. Ask your {kam} if the {contact} asks for more.' },
      { id: 'k8', title: 'How do I handle a hotel with several outlets?', text: 'Find out who decides across outlets, usually the food and beverage manager, and keep each bar manager informed. Escalate group decisions to your {kam}.' },
      { id: 'k9', title: 'When should I visit a bar?', text: 'Between lunch and evening service. The {contact} has time and the bar is quiet enough to check the lines. A {visit} during service helps nobody.' },
      { id: 'k10', title: 'Can I claim glassware I buy locally?', text: 'Yes, inside the policy limit, with a receipt, for serve materials used at an approved activation. Keep the activation reference.' },
      { id: 'k11', title: 'What is the right way to pour a draught drink?', text: 'Hold the glass at an angle, fill steadily, finish upright and check clarity and head. Serve with a clean glass. Use the brand serve guide for the details.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start with the pour or the menu: it is the clearest gap to fix together.' },
      { id: 'p2', uses: ['offer'], text: 'There is room to list {offer} in a small way. Suggest a trial and agree a review date with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so agree dates and staffing for any event with {person} now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A well-kept serve', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, the range has stayed steady. The next step is to check the serve and agree one change to the menu or the cold space.' },
      { id: 's2', title: 'Something new on the menu', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A small trial of {offer} gives {person} something new to offer guests and a clear review date.' },
      { id: 's3', title: 'The season ahead', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a benchmark estimate. It is a reason to plan the season together, within the rules on responsible marketing.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Holiday activation nights', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Draught quality round', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Marketing is responsible and never aimed at people under the legal drinking age. Local licensing rules come first.', blocked: ['under 18', 'underage', 'under age', 'minors', 'binge', 'get drunk', 'drink more'] },
      { id: 'cg2', text: 'The Companion never suggests free drinks, cash or volume incentives to an outlet.', blocked: ['free drinks', 'free beer', 'kickback', 'cash for', 'pay the bar', 'volume bonus'] },
    ],
  },
};
