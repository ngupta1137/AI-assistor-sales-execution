// Sales Companion content for insurance distribution: agency roles, expenses, credential tracking,
// professional development modules, knowledge repository, commercial pitches and compliance boundaries.

export default {
  companion: {
    roles: { rep: 'Agency development manager', manager: 'Territory sales director' },
    expenseCategories: [
      { id: 'mileage', label: 'Agency visitation auto mileage', limitClass: 'travel' },
      { id: 'parking', label: 'Urban garage and brokerage parking', limitClass: 'travel' },
      { id: 'meals', label: 'Field lunch during territory travel', limitClass: 'meals' },
      { id: 'materials', label: 'Approved collateral printing expense', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight commercial territory stay', limitClass: 'lodging' },
      { id: 'telecom', label: 'Mobile data and field communications', limitClass: 'other' },
    ],
    certifications: [
      { id: 'producerlic', label: 'State producer licensing and continuing education', cycleMonths: 24 },
      { id: 'ethicsreg', label: 'Insurance market conduct and ethical sales standards', cycleMonths: 12 },
      { id: 'appetitecert', label: 'Commercial lines underwriting appetite curriculum', cycleMonths: 12 },
      { id: 'roadsafe', label: 'Territory defensive driving certification', cycleMonths: 24 },
      { id: 'privacyreg', label: 'Consumer financial information privacy compliance', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting an effective agency production review', minutes: 20, summary: 'Structure quarterly meetings with principals around submission bind ratios, pipeline gaps, and renewal retention.' },
      { id: 'mod2', title: 'Navigating commercial property underwriting appetite', minutes: 25, summary: 'Interpret construction classifications, protection classes, and hazard profiles to avoid unnecessary submission declination.' },
      { id: 'mod3', title: 'Presenting specialty lines to generalist producers', minutes: 20, summary: 'Guide commercial agents on identifying cyber risk exposures and professional liability vulnerabilities within their business book.' },
      { id: 'mod4', title: 'Analyzing quote conversion friction in the agency', minutes: 15, summary: 'Investigate why issued carrier indications stall before binding and how prompt underwriter communication resolves roadblocks.' },
      { id: 'mod5', title: 'Developing joint renewal defense campaigns', minutes: 20, summary: 'Collaborate with agency account managers months ahead of commercial expirations to insulate lucrative accounts from market competition.' },
      { id: 'mod6', title: 'Partnering with corporate brokerage networks', minutes: 25, summary: 'Coordinate large account placements with the network director to deliver customized risk engineering solutions.' },
      { id: 'mod7', title: 'Bancassurance channel enablement practices', minutes: 15, summary: 'Train retail bank branch representatives to recognize consumer loan insurance triggers and route compliant prospect referrals.' },
      { id: 'mod8', title: 'Auditing agency credential compliance records', minutes: 15, summary: 'Maintain audit-ready documentation confirming that all producers hold current state licenses and carrier appointments.' },
      { id: 'mod9', title: 'Leveraging co-op marketing for local lead generation', minutes: 20, summary: 'Allocate digital promotional co-op funds effectively toward high-potential commercial lines campaigns.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I address an agency with declining commercial volume?', text: 'Review historical loss ratios and submission records with the principal. Pinpoint whether the decline stems from uncompetitive rating tiers, sluggish underwriter turnaround, or agency staff changes.' },
      { id: 'kn2', title: 'What is the procedure when an agency requests an underwriting exception?', text: 'Gather complete risk engineering reports, five-year historical loss runs, and commercial details. Submit the comprehensive portfolio file to the regional underwriting team rather than delivering immediate field commitments.' },
      { id: 'kn3', title: 'Where do field reps locate approved policy marketing literature?', text: 'Access the carrier compliance distribution repository. Download only documentation marked with current regulatory release dates and secure written acknowledgment upon physical delivery.' },
      { id: 'kn4', title: 'How do I handle a producer inquiry regarding a complex claim dispute?', text: 'Explain that field distribution representatives cannot participate in coverage adjudication or settlement negotiations. Route the producer directly to the assigned commercial claims adjuster.' },
      { id: 'kn5', title: 'What metrics determine agency tier classification levels?', text: 'Tier standing reflects rolling twelve-month written premium volume, three-year loss ratio averages, and portfolio retention consistency.' },
      { id: 'kn6', title: 'Who holds authorization to sign joint agency development agreements?', text: 'Development plans carrying co-op marketing allocations or special contingency bonuses require written endorsement from the territory sales director.' },
      { id: 'kn7', title: 'How should producers submit multi-location commercial property risks?', text: 'Direct the agency to utilize the online corporate intake portal with complete building schedules and loss prevention surveys attached.' },
      { id: 'kn8', title: 'What is the protocol for logging partner meeting overrides?', text: 'Document the specific rationale provided by the agency principal alongside current commercial market intelligence. Overrides furnish critical feedback to calibrate carrier appetite models.' },
      { id: 'kn9', title: 'How are travel mileage disbursements calculated correctly?', text: 'Record start and destination odometer logs across each agency itinerary. Reimbursements follow approved organizational vehicle mileage schedules.' },
      { id: 'kn10', title: 'How should I prepare for a strategic corporate brokerage session?', text: 'Review annual premium production figures, pending large commercial submissions, and open client service tickets alongside the broker network director.' },
      { id: 'kn11', title: 'What steps resolve producer dissatisfaction with quotation turnaround?', text: 'Listen attentively to the producer timeline constraints, review operational submission bottlenecks, and coordinate directly with underwriting supervisors to establish transparent review dates.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your organization currently registers {kpiValue} relative to our regional partner target of {kpiTarget}. Focusing our joint efforts here unlocks preferred contingency commission bonuses.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} matches the commercial profile of businesses expanding across your territory. Providing approved marketing literature to your producers will help capture this burgeoning demand.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent agency submission performance shows an overall {trend} trajectory. With {event} arriving in {eventDays} days, scheduling dedicated producer briefings now establishes a robust renewal pipeline.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Fostering profitable commercial agency expansion', uses: ['share', 'orderCount'], text: '{name} has captured an estimated {share} of addressable regional commercial risk. Across {orderCount} recent strategic {orders}, premium volume has remained resilient. Our shared goal is to expand multi-line account density during upcoming renewal cycles.' },
      { id: 'vs2', title: 'Diversifying agency revenue through specialty lines', uses: ['offer', 'trend'], text: 'Recent policy distribution registers a {trend} direction. Expanding placement of {offer} allows your producers to safeguard balance sheets against emerging commercial liabilities while diversifying agency commission revenue.' },
      { id: 'vs3', title: 'Unlocking commercial market potential', uses: ['potential', 'share'], text: 'Estimated commercial market premium in the territory of {name} stands at {potential} annually, with current carrier book representation at {current}. Closing the estimated gap of {whitespace} through targeted appetite alignment forms the foundation of our strategic review.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Commercial renewal campaign rollout', startWeek: 1, weeks: 4, perWeek: 6 },
      { id: 'rp2', name: 'Specialty cyber lines producer education', startWeek: 2, weeks: 3, perWeek: 5 },
    ],
    guardrails: [
      { id: 'ing1', text: 'Agents never deliver personal financial advice, quote binding rates, or promise claim outcomes. Product facts come from the approved brochure only.', blocked: ['guarantee coverage', 'bind on the spot', 'promise claim payout', 'settle this claim', 'waive underwriting', 'zero deductible guarantee'] },
      { id: 'ing2', text: 'Carrier production plans use illustrative sample benchmarks. Presentations never promise commercial sales earnings or guarantee broker bonuses.', blocked: ['doubles premium income', 'promised commission bonus', 'foolproof sales technique', 'eliminate all risk', 'under the table kickback'] },
    ],
  },
};
