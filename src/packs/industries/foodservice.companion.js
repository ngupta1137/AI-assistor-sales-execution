// Sales Companion content for foodservice distribution: role titles, expense categories, required trainings,
// learning, knowledge base, pitch and value story templates, sample activations and guardrails.

export default {
  companion: {
    roles: { rep: 'Sales rep', manager: 'Regional manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and loading bay fees', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'samples', label: 'Sample cases bought locally', limitClass: 'other' },
      { id: 'lodging', label: 'Hotel for an overnight trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'foodhygiene', label: 'Food hygiene for the delivery chain', cycleMonths: 12 },
      { id: 'allergen', label: 'Allergen awareness and spec sheets', cycleMonths: 12 },
      { id: 'contract', label: 'Supply contract and price list rules', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'm1', title: 'Counting a store room in ten minutes', minutes: 15, summary: 'A fixed walk order for dry, chilled and frozen stock, so nothing is missed and the {contact} can follow.' },
      { id: 'm2', title: 'Selling into a menu change', minutes: 25, summary: 'Find out the menu date early, bring a sample and a cost per portion, and agree when to call back.' },
      { id: 'm3', title: 'Reading a spec sheet with a chef', minutes: 20, summary: 'Where the allergen table sits, what the sheet does not say, and when to log a question instead of guessing.' },
      { id: 'm4', title: 'Fixing a short delivery at the root', minutes: 20, summary: 'Tell a stock allocation gap from a picking error, and give the {contact} a clear fix date.' },
      { id: 'm5', title: 'Setting up a standing {order}', minutes: 15, summary: 'Choose lines with steady use, agree the cut-off day and show how to pause it.' },
      { id: 'm6', title: 'Working with the {kam}', minutes: 20, summary: 'When to escalate a contract question and what to log so nothing is lost between teams.' },
      { id: 'm7', title: 'Cold chain checks that hold up', minutes: 15, summary: 'Where the reading goes, what the photo must show, and what to do when a probe is missing.' },
      { id: 'm8', title: 'Planning a day around service hours', minutes: 15, summary: 'Group calls by quiet window so each {visit} gets the {contact}\'s full attention.' },
      { id: 'm9', title: 'Seasonal and banquet planning', minutes: 25, summary: 'Use booking calendars to plan stock weeks ahead rather than on the day.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I offer a sample case?', text: 'Check the sample budget with your {manager}, tell the {contact} what is in the case and leave a feedback card. Log the sample so the product team can follow up on the result.' },
      { id: 'k2', title: 'What counts as a valid receiving check?', text: 'A temperature reading with the product, the time and the name of the person who received it, plus a photo of the log. A check without a reading cannot support a quality query.' },
      { id: 'k3', title: 'Where do I find the current spec sheet?', text: 'The product page holds the latest version with a date. Print it for the {contact} and ask for a signature. Never rely on an old copy from a previous visit.' },
      { id: 'k4', title: 'What if the {contact} asks about an allergen?', text: 'Show the allergen table on the spec sheet and read it with them. If the sheet does not answer the question, log it for the product team and tell the {contact} when to expect a reply.' },
      { id: 'k5', title: 'How do I read days of cover?', text: 'Days of cover is stock on hand divided by average daily use. Under about four days on a core line means order now. The {order} draft shows it for each line.' },
      { id: 'k6', title: 'Who approves a large {order}?', text: 'Orders above the approval limit go to your {manager}. The limit shows on the {order} screen, along with who it is waiting for.' },
      { id: 'k7', title: 'What do I do about a short delivery?', text: 'Log the delivery number, the line and the quantity short. Tell the depot lead the same day and give the {contact} a date for the replacement.' },
      { id: 'k8', title: 'How should I log a refusal?', text: 'Record the reason code, the name of the {contact} and the date. A refusal is useful data and is not a mark against you.' },
      { id: 'k9', title: 'What is the right way to claim mileage?', text: 'Take each trip start and end from the route plan. A claim uses the company mileage rate, in the distance unit of your country.' },
      { id: 'k10', title: 'How do I prepare for a hotel or caterer {visit}?', text: 'Open the {visit} brief, read the top three actions, bring the price list and spec sheets, and check the open items from the last {visit}.' },
      { id: 'k11', title: 'What if the {contact} is unhappy?', text: 'Listen first, write down what they say, fix what you can during the {visit} and tell your {manager} what you could not fix.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there: it is the clearest gap in the store room.' },
      { id: 'p2', uses: ['offer'], text: '{offer} could suit a dish already on the menu. Offer a sample case and agree a date with {person} to hear how it cooked.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so agree stock and delivery days for it now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A steady kitchen supply', uses: ['share', 'orderCount'], text: '{name} has captured {share} of its estimated potential. Across the last {orderCount} {orders}, the core lines were steady. The next step is to close the delivery gaps we found, one at a time, and review them together at the next {visit}.' },
      { id: 's2', title: 'A menu that moves with the season', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A trial of {offer} lets {person} test a new dish without changing the whole range, and the next {order} will show how it went.' },
      { id: 's3', title: 'Ready for the busy weeks', uses: ['potential', 'share'], text: 'Estimated potential at {name} is {potential} a year and the current figure is {current}. The gap of {whitespace} is an estimate from benchmark data. It is the reason to plan the busy weeks together.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Seasonal menu launch', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Spec sheet refresh round', startWeek: 3, weeks: 2, perWeek: 4 },
    ],
    guardrails: [
      { id: 'fg1', text: 'Allergen and nutrition statements come only from the current spec sheet. The Companion never writes its own.', blocked: ['allergen free', 'gluten free', 'safe for allergies', 'nut free', 'guarantee', 'no allergens'] },
      { id: 'fg2', text: 'Prices and terms follow the contract price list. Value stories use benchmark data and say so, and never claim a result.', blocked: ['proven to', 'doubles sales', 'will boost', 'risk free', 'side deal', 'under the table'] },
    ],
  },
};
