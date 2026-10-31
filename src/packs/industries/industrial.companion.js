// Sales Companion content for industrial supplies: role titles, expense categories, required trainings,
// learning, knowledge base, pitch and value story templates, sample activations and guardrails.

export default {
  companion: {
    roles: { rep: 'Sales engineer', manager: 'Regional sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and site access fees', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'ppe', label: 'Safety gear bought locally', limitClass: 'other' },
      { id: 'lodging', label: 'Hotel for an overnight trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'siteinduction', label: 'Site safety induction for customer plants', cycleMonths: 12 },
      { id: 'datasheet', label: 'Reading datasheets and product ratings', cycleMonths: 12 },
      { id: 'contract', label: 'Contract price list and service agreement rules', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'm1', title: 'Counting a crib in fifteen minutes', minutes: 15, summary: 'Work the shelves in a fixed order, record counts against the site minimum and agree the figures with the {contact}.' },
      { id: 'm2', title: 'Setting up a restock bin', minutes: 25, summary: 'Choose steady-use items, set the minimum from real use and show the {contact} how a refill request reaches us.' },
      { id: 'm3', title: 'Reading a datasheet on site', minutes: 20, summary: 'Find the rated limits, spot a job note that falls outside them and route the question to the technical desk.' },
      { id: 'm4', title: 'Planning stock for a shutdown', minutes: 25, summary: 'Match the job list to items, reserve stock early and set dates to confirm the final list.' },
      { id: 'm5', title: 'Replacing a discontinued item', minutes: 15, summary: 'Use the supersession list, show old and new side by side and flag changes in size or rating.' },
      { id: 'm6', title: 'Working with the {kam}', minutes: 20, summary: 'When to escalate a service agreement question and what to log so nothing is lost.' },
      { id: 'm7', title: 'Running a short toolbox talk', minutes: 15, summary: 'Use maker material, keep to ten minutes and collect the attendance sheet as the record.' },
      { id: 'm8', title: 'Planning a day around shift changes', minutes: 15, summary: 'Group visits by shift pattern so each {contact} has time to talk.' },
      { id: 'm9', title: 'Logging a quote request well', minutes: 10, summary: 'Capture quantity, date needed and the job so the pricing desk can answer in one pass.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I set a minimum level for a bin?', text: 'Take weekly use from the last 12 weeks, add the delivery lead time and a small buffer agreed with the {contact}. Write the level on the bin label and record it in the {account} notes.' },
      { id: 'k2', title: 'What counts as proof of a toolbox talk?', text: 'A signed attendance sheet with the date, the topic and the supervisor name. Keep a photo of the sheet. A talk without a sheet cannot support an audit question.' },
      { id: 'k3', title: 'Where do I find the current datasheet?', text: 'The item page holds the latest version with a revision date. Share that version with the {contact} and note the revision in your {visit} notes.' },
      { id: 'k4', title: 'What do I say when the {contact} asks about the limits of a part?', text: 'Do not answer from memory. Show the rated limits on the datasheet, then offer a call with the technical desk and log the question with the job details.' },
      { id: 'k5', title: 'How do I read days of use?', text: 'Days of use is stock on hand divided by average daily use. Under about five days on a core item means order now. The {order} draft shows it for each line.' },
      { id: 'k6', title: 'Who approves a large {order}?', text: 'Orders above the approval limit go to your {manager}. The limit shows on the {order} screen with the name of whoever it is waiting on.' },
      { id: 'k7', title: 'What do I do about calibration dates?', text: 'List the units with a due date in the next 30 days and hand it to the {contact}. Offer to book the lab collection. Never state that a tool is in or out of tolerance.' },
      { id: 'k8', title: 'How should I log a refusal?', text: 'When a {contact} declines, log the reason code, who said it and when. The agents learn from that, and nobody is scored on it.' },
      { id: 'k9', title: 'What is the right way to claim mileage?', text: 'Use the trip start and end from the route plan. Claims follow the company mileage rate and the distance unit used in your country.' },
      { id: 'k10', title: 'How do I prepare for a plant {visit}?', text: 'Open the {visit} brief, read the top three actions, bring the datasheets and the price list, and check the open items from the last {visit}.' },
      { id: 'k11', title: 'What if the {contact} is unhappy?', text: 'Listen first, note what they say, fix what you can on the day and tell your {manager} what you could not fix.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there: it is the clearest gap in the crib.' },
      { id: 'p2', uses: ['offer'], text: '{offer} could replace a part the team buys in a rush. Leave one unit for a real job and agree with {person} who will send feedback.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so settle the job list and the reserved stock now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A crib that runs itself', uses: ['share', 'orderCount'], text: '{name} has captured {share} of its estimated potential. Across the last {orderCount} {orders}, many were urgent single boxes. The next step is to agree minimum levels together and look again at the next {visit}.' },
      { id: 's2', title: 'A new item on a real job', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A trial of {offer} on one job gives {person} a way to test it without changing the contract range.' },
      { id: 's3', title: 'Ready for the stop', uses: ['potential', 'share'], text: 'Estimated potential at {name} is {potential} a year and the current figure is {current}. The gap of {whitespace} is an estimate from benchmark data. It is the reason to plan the next stop together.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Shutdown season support', startWeek: 1, weeks: 4, perWeek: 5 },
      { id: 'r2', name: 'Crib count round', startWeek: 3, weeks: 2, perWeek: 4 },
    ],
    guardrails: [
      { id: 'ig1', text: 'Rating, load and pressure statements come only from the maker datasheet and the technical desk. The Companion never writes its own.', blocked: ['rated for', 'safe working load', 'will hold', 'guarantee', 'no risk', 'certified for'] },
      { id: 'ig2', text: 'Prices follow the contract list. Value stories use benchmark data and say so, and never claim a result.', blocked: ['proven to', 'doubles output', 'will boost', 'risk free', 'special price', 'under the table'] },
    ],
  },
};
