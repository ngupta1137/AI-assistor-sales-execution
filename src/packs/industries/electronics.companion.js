// Sales Companion content for consumer electronics. Price promises follow the retailer agreement;
// product claims use the approved feature sheet; launch weeks keep their visits.

export default {
  companion: {
    roles: { rep: 'Retail account manager', manager: 'Regional sales manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel and tolls', limitClass: 'travel' },
      { id: 'parking', label: 'Parking at malls and parks', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'demo', label: 'Demo unit accessories and cables', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a launch', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'range', label: 'Product range and feature sheet training', cycleMonths: 6 },
      { id: 'agreement', label: 'Retailer agreement and price rules', cycleMonths: 12 },
      { id: 'promoter', label: 'Promoter coaching standards', cycleMonths: 12 },
      { id: 'privacy', label: 'Customer data privacy', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving and fatigue', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Keeping demo units live', minutes: 10, summary: 'Power, demo mode and a daily switch-on routine.' },
      { id: 'm2', title: 'Coaching a promoter on a new model', minutes: 25, summary: 'Three points from the approved feature sheet, then role-play.' },
      { id: 'm3', title: 'Checking tags against the promotion file', minutes: 10, summary: 'Compare, photograph and let the {account} correct.' },
      { id: 'm4', title: 'Building a launch display', minutes: 25, summary: 'The checklist, placement and photos for the audit.' },
      { id: 'm5', title: 'Winning wall space', minutes: 20, summary: 'Use the agreed layout, and log it if space was sold to another brand.' },
      { id: 'm6', title: 'Capturing weekly sell-out', minutes: 15, summary: 'Scan stock, confirm units sold and agree a weekly report.' },
      { id: 'm7', title: 'Moving aged stock with a bundle', minutes: 15, summary: 'Bundles move stock without a price move.' },
      { id: 'm8', title: 'Weekday visits that work', minutes: 10, summary: 'Why weekday mornings beat Saturdays.' },
      { id: 'm9', title: 'Working with a {kam} on a chain', minutes: 20, summary: 'What to escalate and what to settle in the {visit}.' },
    ],
    knowledge: [
      { id: 'k1', title: 'What can a promoter say about a model?', text: 'Only points from the approved feature sheet, one at a time. A promoter can say what a model does. If it is not on the sheet, do not say it, and ask your {manager}.' },
      { id: 'k2', title: 'How do I keep demo units live?', text: 'Check power and the demo loop with the {contact}, and agree that the unit is switched on at opening each day. Photograph a live wall for the audit.' },
      { id: 'k3', title: 'What do I do about a wrong price tag?', text: 'Compare the tag with the retailer promotion file, show the {contact} the mismatch and photograph the corrected tag. The retailer sets prices. You flag, and never change a tag.' },
      { id: 'k4', title: 'How many weeks of sell-out should an {order} cover?', text: 'About two weeks for a model. More ties up cash and makes aged stock. Launch models get an opening quantity instead, because there is no history yet.' },
      { id: 'k5', title: 'How do I build a launch display?', text: 'Follow the launch checklist: location from the plan, demo units live, price cards matching the file and the kit complete. Photograph it the same day.' },
      { id: 'k6', title: 'What if space on the wall was given to another brand?', text: 'Show the agreed layout to the {contact}. If the space was sold, log it and raise it with your {kam}. Do not move other brands\' products.' },
      { id: 'k7', title: 'How do I capture sell-out?', text: 'Scan the stock room and the floor, confirm units sold with the {contact} and agree a weekly report by message. Without sell-out, support goes to the wrong stores.' },
      { id: 'k8', title: 'How do I move aged stock?', text: 'Propose a bundle with accessories. Any price change needs retailer and brand approval, and you cannot promise cover against a later price drop.' },
      { id: 'k9', title: 'When is a weekday visit the right choice?', text: 'Managers have time on weekday mornings, displays can be fixed before the weekend crowd and promoters can be trained before their shift fills up.' },
      { id: 'k10', title: 'May I photograph a competitor display?', text: 'Ask the {contact} first, photograph only what is on display and note prices only as shown. Head office plans the response from field photos.' },
      { id: 'k11', title: 'Which demo accessories can I claim?', text: 'Cables and stands for demo units within the sample limit, with a receipt and the model name. Keep them with the unit.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Walk the floor with {person} and fix the biggest gap first.' },
      { id: 'p2', uses: ['offer'], text: 'There is room for {offer} on the floor. Show {person} the approved feature sheet and agree where a live demo unit goes.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Plan stock and the display with {person} before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'A floor that sells', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, the range has followed the floor. The next step is to keep demo units live and tags right.' },
      { id: 's2', title: 'A new model on the wall', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A live demo of {offer}, with promoters trained on the feature sheet, gives {person} a clear way to show it.' },
      { id: 's3', title: 'Planning for the peak', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a sample estimate. It is a reason to plan the peak weeks with {person}.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'New model launch week', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Promoter coaching round', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Price promises follow the retailer agreement. The Companion never offers price protection or a price match.', blocked: ['price protection', 'price match', 'refund the difference', 'match the online'] },
      { id: 'cg2', text: 'Product claims use the approved feature sheet only.', blocked: ['best phone', 'fastest', 'battery lasts', 'waterproof', 'no lag', 'better than'] },
    ],
  },
};
