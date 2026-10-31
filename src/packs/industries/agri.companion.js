// Sales Companion content for agri inputs. Crop protection advice follows the product label only;
// credit decisions stay with people; demo plot results are observations, never a yield promise.

export default {
  companion: {
    roles: { rep: 'Field sales officer', manager: 'Area manager' },
    expenseCategories: [
      { id: 'fuel', label: 'Fuel for field travel', limitClass: 'travel' },
      { id: 'meals', label: 'Meals on the road', limitClass: 'meals' },
      { id: 'meeting', label: 'Farmer meeting setup costs', limitClass: 'other' },
      { id: 'demo', label: 'Demo plot signs and markers', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for a distant visit', limitClass: 'lodging' },
      { id: 'phone', label: 'Phone and data for work', limitClass: 'other' },
    ],
    certifications: [
      { id: 'label', label: 'Product label and safe use', cycleMonths: 12 },
      { id: 'steward', label: 'Product stewardship', cycleMonths: 12 },
      { id: 'protect', label: 'Protective equipment and storage', cycleMonths: 12 },
      { id: 'counterfeit', label: 'Spotting look-alike packs', cycleMonths: 12 },
      { id: 'driving', label: 'Safe driving on rural roads', cycleMonths: 24 },
    ],
    learningModules: [
      { id: 'm1', title: 'Reading a product label together', minutes: 20, summary: 'Crop, pest, rate, interval and protective equipment, in the order the label lists them.' },
      { id: 'm2', title: 'Planning pre-season stock', minutes: 20, summary: 'Days of cover against expected demand, in two drops.' },
      { id: 'm3', title: 'Running a demo plot visit', minutes: 25, summary: 'Photograph at each stage and describe what you see as an observation.' },
      { id: 'm4', title: 'Running a farmer meeting', minutes: 25, summary: 'Approved flipchart, safe storage and use, and notes on who attended.' },
      { id: 'm5', title: 'Talking about dues without changing credit', minutes: 15, summary: 'Share the statement, agree a date and leave limits to the credit team.' },
      { id: 'm6', title: 'Training counter staff on the label', minutes: 15, summary: 'Line by line, then ask the trainee to explain it back.' },
      { id: 'm7', title: 'Checking batch codes', minutes: 10, summary: 'Scan, compare with the register and report anything that does not match.' },
      { id: 'm8', title: 'Timing a visit to crop stage', minutes: 15, summary: 'Use the sowing date and plan around flowering.' },
      { id: 'm9', title: 'Member programs with a cooperative', minutes: 20, summary: 'Delivery points, dates and what needs {manager} approval.' },
    ],
    knowledge: [
      { id: 'k1', title: 'How do I give advice on a product?', text: 'Read the label with the {contact}: crop, pest, rate, interval and protective equipment. If the crop or the pest is not on the label, do not recommend the product. Ask the agronomist.' },
      { id: 'k2', title: 'How do I plan season stock for a {account}?', text: 'Start from expected demand and sowing dates, plan in two drops, and never above expected demand. The {order} reasons show days of cover for each line.' },
      { id: 'k3', title: 'What do I do at a demo plot?', text: 'Photograph the plot at the agreed stage, note the label rate that was used and describe the result as an observation from one field. Never describe it as a promise.' },
      { id: 'k4', title: 'Who decides credit for a {account}?', text: 'The credit team. Share the season statement and agree a payment date. Do not change credit terms or promise a new limit.' },
      { id: 'k5', title: 'How do I spot a look-alike pack?', text: 'Scan the batch code against the register and compare the print and the seal. If the code is not in the register, photograph the pack, report it and do not sell it.' },
      { id: 'k6', title: 'How do I run a farmer meeting?', text: 'Use the approved flipchart and the product label. Cover safe storage, mixing and protective equipment. Record who attended and leave your contact details.' },
      { id: 'k7', title: 'When is the best time to see a grower?', text: 'Around the crop stage: sowing, early growth and flowering. The planner uses the sowing date you recorded and re-plans when rain stops field work.' },
      { id: 'k8', title: 'What do I do if rain stops field work?', text: 'Use Mark closed today on the {visit}, tell the {contact} and book the next slot. The route re-plans the rest of the day.' },
      { id: 'k9', title: 'How do I train counter staff?', text: 'Walk the label line by line, role-play one customer question and ask the trainee to explain the rate and the interval back. Record the signed sheet.' },
      { id: 'k10', title: 'Which meeting costs can I claim?', text: 'Setup costs for an approved farmer meeting within the policy limit, with receipts. Gifts and payments to attendees are not claimable.' },
      { id: 'k11', title: 'What do I tell a customer about storing products?', text: 'Follow the label and the stewardship guidance: keep products in their original packs, locked, away from food and feed, and out of reach of children.' },
    ],
    pitchTemplates: [
      { id: 'p1', uses: ['kpi'], text: 'On {kpi}, {name} is at {kpiValue} against a target of {kpiTarget}. Start there with {person}, using the label and the season plan.' },
      { id: 'p2', uses: ['offer'], text: 'There is a case for trying {offer} in a small area. Show the demo plot photos as observations and read the label together with {person}.' },
      { id: 'p3', uses: ['trend', 'event'], text: 'The last {order} was {trend}. Agree stock and dates for the season with {person} before {event}.' },
    ],
    valueStoryTemplates: [
      { id: 's1', title: 'Ready for the season', uses: ['share', 'orderCount'], text: '{name} has reached {share} of its estimated potential. Across the last {orderCount} {orders}, supply has followed the season. The next step is to plan stock in two drops and agree dates for the first {visit}.' },
      { id: 's2', title: 'A small trial', uses: ['offer', 'trend'], text: 'The last {order} was {trend}. A small trial of {offer} lets {person} see it on their own land first, using the label rate and photos at each stage.' },
      { id: 's3', title: 'Planning with the crop calendar', uses: ['potential', 'share'], text: 'The estimate for {name} is {potential} a year, and the current figure is {current}. The difference of {whitespace} is a benchmark estimate. It is a reason to plan with the crop calendar, not a forecast of any harvest.' },
    ],
    resourcePlans: [
      { id: 'r1', name: 'Pre-season stock round', startWeek: 1, weeks: 3, perWeek: 5 },
      { id: 'r2', name: 'Demo plot observation visits', startWeek: 3, weeks: 3, perWeek: 4 },
    ],
    guardrails: [
      { id: 'cg1', text: 'Crop protection advice follows the product label only. The Companion never states a dose or an off-label use.', blocked: ['what dose', 'dosage', 'spray rate', 'tank mix', 'off-label', 'off label', 'pre-harvest'] },
      { id: 'cg2', text: 'Demo results are observations. The Companion never promises a yield.', blocked: ['yield will', 'guarantee a yield', 'increase your yield', 'extra bags', 'higher yield'] },
      { id: 'cg3', text: 'Credit decisions stay with people. The Companion never extends or promises credit.', blocked: ['extend credit', 'more credit', 'credit limit to', 'waive the'] },
    ],
  },
};
