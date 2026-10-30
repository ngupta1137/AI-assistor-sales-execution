// Sales Companion content for solar and home energy: role titles, expense categories, required trainings,
// learning, knowledge base, pitch and value story templates, sample activations and guardrails.

export default {
  companion: {
    roles: { rep: 'Territory rep', manager: 'Sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel', limitClass: 'travel' },
      { id: 'parking', label: 'Parking and yard access fees', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'demo', label: 'Demo materials bought locally', limitClass: 'other' },
      { id: 'lodging', label: 'Hotel for an overnight trip', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'electrical', label: 'Electrical safety awareness for visitors', cycleMonths: 12 },
      { id: 'range', label: 'Current product range and compatibility lists', cycleMonths: 6 },
      { id: 'channel', label: 'Channel agreement and price list rules', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
      { id: 'privacy', label: 'Data privacy for field teams', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'm1', title: 'Reading a partner project list', minutes: 20, summary: 'Match the bill of materials to stock on the shelf and mark what is short, in start-date order.' },
      { id: 'm2', title: 'Using the compatibility list', minutes: 15, summary: 'Check a pairing against the maker list, flag a mismatch and route it to the technical team.' },
      { id: 'm3', title: 'Introducing storage and monitoring', minutes: 25, summary: 'Start from the customer question, offer a demo unit and agree a review date with the {contact}.' },
      { id: 'm4', title: 'Planning stock before a deadline', minutes: 20, summary: 'Use last year\'s volumes and the project list to set a quantity with a review point.' },
      { id: 'm5', title: 'Running a trade counter display', minutes: 15, summary: 'Where to place it, what to show and how to photograph it for the record.' },
      { id: 'm6', title: 'Working with the {kam}', minutes: 20, summary: 'When to escalate a channel agreement question and what to log so nothing is lost.' },
      { id: 'm7', title: 'Booking maker training', minutes: 15, summary: 'Offer two dates, collect the attendance sheet and keep the record.' },
      { id: 'm8', title: 'Planning a day around install days', minutes: 15, summary: 'Group visits on yard days and keep roof days free for crews.' },
      { id: 'm9', title: 'Logging a project quote request', minutes: 10, summary: 'Capture units, dates and site so the pricing desk can answer in one pass.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I check a compatibility pairing?', text: 'Open the current maker list, find both parts and read the notes. If the pairing is not shown, do not say it works. Log it with the {account} name and offer a call with the technical team.' },
      { id: 'k2', title: 'What counts as proof of a training session?', text: 'A signed attendance sheet with the date, topic and trainer name. Keep a photo of the sheet. A session without a sheet cannot support a certification question.' },
      { id: 'k3', title: 'Where do I find the current datasheet?', text: 'Each product page holds the latest version with a revision date. Share that version with the {contact} and note the revision in the {visit} record.' },
      { id: 'k4', title: 'What if the {contact} asks what a system will save?', text: 'Do not give a figure. Savings and output depend on the roof and the household, and a qualified designer works them out. Offer a call and log the question.' },
      { id: 'k5', title: 'How do I read days of stock?', text: 'Days of stock is stock on hand divided by average daily use. Under about ten days on a core line means order now. The {order} draft shows it per line.' },
      { id: 'k6', title: 'Who approves a large {order}?', text: 'An {order} over the approval limit is routed to your {manager}. The {order} screen shows the limit and the name of the approver.' },
      { id: 'k7', title: 'What do I do with a warranty claim?', text: 'Log the serial number, the fault and the date, and pass it to the service team the same day. Tell the {contact} who will reply. Never say whether it will be accepted.' },
      { id: 'k8', title: 'How should I log a refusal?', text: 'When a {contact} declines, record the reason code, the name and the date. The agents learn from refusals and nobody is scored on them.' },
      { id: 'k9', title: 'What is the right way to claim mileage?', text: 'Copy the start and end of each trip from the route plan into the claim. The company mileage rate applies, in your country\'s distance unit.' },
      { id: 'k10', title: 'How do I prepare for a wholesaler {visit}?', text: 'Open the {visit} brief, read the top three actions, bring the price list and datasheets, and check the open items from the last {visit}.' },
      { id: 'k11', title: 'What if the {contact} is unhappy?', text: 'Let them finish, note the problem in their own words, settle what you can on the spot and give your {manager} the rest by the end of the day.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there: it is the clearest gap in the stock room.' },
      { id: 'p2', uses: ['offer'], text: '{offer} answers a question customers are starting to ask. Offer a demo unit and agree a review date with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. {event} is {eventDays} days away, so match stock to the project list now.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Stock that matches the projects', uses: ['share', 'orderCount'], text: '{name} has captured {share} of its estimated potential. Across the last {orderCount} {orders}, several parts arrived close to install day. The next step is to match stock to the project list and look again at the next {visit}.' },
      { id: 's2', title: 'A new product for customers who ask', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A demo of {offer} lets {person} answer a customer question without changing the whole range.' },
      { id: 's3', title: 'Ready for the busy weeks', uses: ['potential', 'share'], text: 'At {name}, estimated potential is {potential} a year against {current} today. The {whitespace} difference is a sample-data estimate, and it is the reason to line up the peak weeks with {person} early.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Installer training round', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Wholesaler counter display push', startWeek: 3, weeks: 2, perWeek: 4 },
    ],
    guardrails: [
      { id: 'eg1', text: 'Savings, payback and output figures come from a qualified designer. The Companion never writes them.', blocked: ['will save', 'payback in', 'cut your bill', 'guarantee', 'zero bills', 'pays for itself'] },
      { id: 'eg2', text: 'Prices follow the channel list. Value stories use sample data and say so, and never claim a result.', blocked: ['proven to', 'doubles output', 'will boost', 'risk free', 'special price', 'under the table'] },
    ],
  },
};
