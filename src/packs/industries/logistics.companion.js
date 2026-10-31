// Sales Companion content for logistics and courier services: transportation roles, field expenses, freight certifications,
// operational training modules, carrier knowledge base, commercial pitches and tariff compliance guardrails.

export default {
  companion: {
    roles: { rep: 'Commercial logistics executive', manager: 'Regional freight director' },
    expenseCategories: [
      { id: 'mileage', label: 'Commercial shipper itinerary travel mileage', limitClass: 'travel' },
      { id: 'tolls', label: 'Highway logistics corridor toll fees', limitClass: 'travel' },
      { id: 'meals', label: 'Field lunch during territory route consultations', limitClass: 'meals' },
      { id: 'samples', label: 'Packaging samples and dimension audit rulers', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight regional freight territory accommodation', limitClass: 'lodging' },
      { id: 'telecom', label: 'Mobile tracking and field dispatch connectivity', limitClass: 'other' },
    ],
    certifications: [
      { id: 'hazardouscert', label: 'Hazardous materials transport and handling compliance', cycleMonths: 12 },
      { id: 'dimcert', label: 'National freight tariff and dimensional weight standards', cycleMonths: 24 },
      { id: 'cargosec', label: 'Supply chain security and cargo loss prevention', cycleMonths: 12 },
      { id: 'roadsafe', label: 'Commercial territory safe driving and fatigue awareness', cycleMonths: 24 },
      { id: 'claimscert', label: 'Freight damage inspection and claims documentation rules', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting an effective fulfillment center shipping audit', minutes: 20, summary: 'Evaluate parcel packaging workflows, measure outbound carton dimension weights, and assess evening trailer cutoff windows.' },
      { id: 'mod2', title: 'Navigating dimensional weight freight calculations', minutes: 25, summary: 'Master cubic divisor formulas, explain carton volumetric surcharges to shippers, and propose right-sized packaging options.' },
      { id: 'mod3', title: 'Presenting published carrier rate schedules to shippers', minutes: 15, summary: 'Explain base transportation tariffs, zone structures, and fuel index surcharges clearly without offering unfiled rate concessions.' },
      { id: 'mod4', title: 'Optimizing e-commerce evening trailer pickup schedules', minutes: 20, summary: 'Analyze warehouse packing throughput curves to negotiate extended pickup sweeps that prevent same-day parcel dwell.' },
      { id: 'mod5', title: 'Implementing automated customer return logistics', minutes: 20, summary: 'Guide online merchants on deploying scan-based return portals and scheduled freight consolidation from regional sort hubs.' },
      { id: 'mod6', title: 'Structuring contract pallet freight agreements', minutes: 25, summary: 'Coordinate scheduled LTL pickups, dock staging allocations, and line-haul departure windows for regional wholesale distributors.' },
      { id: 'mod7', title: 'Auditing transit damage packaging techniques on the dock', minutes: 15, summary: 'Inspect pallet stretch-wrapping tension, corner-board protection, and internal box cushioning to prevent intransit cargo shifting.' },
      { id: 'mod8', title: 'Collaborating with the strategic logistics director', minutes: 20, summary: 'Align multi-terminal line-haul commitments and review executive freight proposals for enterprise-scale wholesale accounts.' },
      { id: 'mod9', title: 'Managing seasonal peak shipping capacity allocation', minutes: 15, summary: 'Collaborate with shippers weeks ahead of promotional holidays to secure trailer equipment and hub sortation capacity.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I respond if a shipper demands a committed arrival hour?', text: 'Explain that filed carrier tariffs do not promise specific arrival hours. Provide published service lane transit benchmarks and explain that severe weather and transit conditions affect line-haul transit.' },
      { id: 'kn2', title: 'What is the standard procedure for auditing carton dimensional weight?', text: 'Measure length, width, and height with a certified tape, multiply dimensions, and divide by the applicable carrier dimensional divisor to verify billed cubic weight.' },
      { id: 'kn3', title: 'Where do executives locate current published fuel surcharge rates?', text: 'Access the commercial carrier portal. Review weekly updated fuel surcharge tables tied to the national diesel fuel index and share official documentation with shippers.' },
      { id: 'kn4', title: 'How do I handle a shipper requesting on-the-spot claim reimbursement?', text: 'State clearly that field representatives do not adjudicate freight claims or authorize payments. Assist the shipper in gathering delivery receipts, inspection photos, and invoices for formal claims review.' },
      { id: 'kn5', title: 'What criteria qualify an e-commerce merchant for dedicated trailer pickup?', text: 'Merchants generating at least two hundred outbound parcels daily or twenty cubic yards of freight qualify for a scheduled evening trailer sweep.' },
      { id: 'kn6', title: 'Who authorizes custom tariff pricing for large wholesale distributors?', text: 'Custom transportation rate schedules and volume tier incentives require formal review and written approval from the regional freight director.' },
      { id: 'kn7', title: 'How should specialists log a shipper consultation override?', text: 'Document the specific operational reason provided by the dispatcher alongside observed dock staging conditions. This feedback refines regional pickup route scheduling.' },
      { id: 'kn8', title: 'What safety gear is mandatory when walking warehouse dock floors?', text: 'High-visibility safety vests, steel-toed footwear, and eye protection are mandatory at all times when traversing active loading docks or forklift areas.' },
      { id: 'kn9', title: 'How are travel mileage disbursements calculated for commercial routes?', text: 'Log beginning and ending odometer numbers across all shipper consultations. Expense reimbursements follow approved corporate vehicle allowance policies.' },
      { id: 'kn10', title: 'How should I prepare for a strategic wholesale distributor review?', text: 'Review historical weekly pallet volumes, line-haul on-time dispatch records, and damage exception ledgers alongside the strategic logistics director.' },
      { id: 'kn11', title: 'What steps resolve recurring package transit damage issues?', text: 'Inspect the shipper packaging materials, check carton edge crush ratings, evaluate box void fill, and recommend reinforced corrugate or pallet banding.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your shipping operations currently register {kpiValue} relative to our regional benchmark of {kpiTarget}. Improving this operational metric shortens overall customer delivery transit.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} expands regional delivery reach while maintaining dependable collection sweeps for your fulfillment facility. Reviewing our rate schedule will demonstrate the network advantages.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent shipping manifest data reflects an overall {trend} trajectory. With {event} arriving in {eventDays} days, reserving trailer capacity now secures required equipment availability.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Streamlining fulfillment center transportation operations', uses: ['share', 'orderCount'], text: '{name} has captured an estimated {share} of regional transportation volume. Across {orderCount} recent monthly {orders}, outbound parcel manifests have shown strong consistency. Our collaborative focus is optimizing pickup schedules to ensure same-day departure.' },
      { id: 'vs2', title: 'Expanding regional distribution lane velocity', uses: ['offer', 'trend'], text: 'Outbound shipping manifests indicate a {trend} movement. Utilizing {offer} allows your dispatch team to extend delivery coverage while maintaining strict carton dimension compliance.' },
      { id: 'vs3', title: 'Unlocking commercial supply chain potential', uses: ['potential', 'share'], text: 'Addressable annual transportation spend across {name} is estimated at {potential}, with current carrier book share standing at {current}. Addressing the estimated gap of {whitespace} through scheduled line-haul freight forms the core of our partnership.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Peak holiday shipping capacity campaign', startWeek: 1, weeks: 4, perWeek: 6 },
      { id: 'rp2', name: 'Dimensional weight and carton packaging audit', startWeek: 2, weeks: 3, perWeek: 5 },
    ],
    guardrails: [
      { id: 'lg1', text: 'Rates adhere strictly to filed carrier rate cards. Representatives never promise delivery arrival hours or guarantee claim reimbursement outcomes.', blocked: ['promised delivery time', 'promise arrival by noon', 'promised claim reimbursement', 'settle freight claim on spot', 'waive fuel surcharge'] },
      { id: 'lg2', text: 'Shipping cost projections derive from sample freight planning data. Presentations never guarantee commercial profit margins or eliminated transit damage.', blocked: ['doubles shipping profits', 'zero cargo damage claim', 'promised freight rebate', 'secret shipping loophole', 'unregistered tariff rate'] },
    ],
  },
};
