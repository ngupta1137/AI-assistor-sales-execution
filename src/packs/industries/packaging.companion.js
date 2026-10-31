// Sales Companion content for packaging and print: converter roles, plant expenses, material certifications,
// technical training modules, substrate knowledge base, commercial pitches and food safety guardrails.

export default {
  companion: {
    roles: { rep: 'Packaging sales specialist', manager: 'Regional packaging director' },
    expenseCategories: [
      { id: 'mileage', label: 'Manufacturing plant travel mileage allowance', limitClass: 'travel' },
      { id: 'parking', label: 'Industrial park and facility visitor parking', limitClass: 'travel' },
      { id: 'meals', label: 'Field lunch during manufacturing territory rounds', limitClass: 'meals' },
      { id: 'specimens', label: 'Printed folding carton and film sample swatches', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight regional converter territory stay', limitClass: 'lodging' },
      { id: 'safetygear', label: 'Plant floor steel-toed footwear and ear protection', limitClass: 'other' },
    ],
    certifications: [
      { id: 'foodcontactcert', label: 'Food-contact packaging regulatory standards and migration compliance', cycleMonths: 12 },
      { id: 'sustaincert', label: 'Compostability testing and environmental packaging claims substantiation', cycleMonths: 24 },
      { id: 'presscolordim', label: 'Spectrophotometer color management and ISO press proofing', cycleMonths: 12 },
      { id: 'roadsafe', label: 'Territory defensive driving and vehicle safety standards', cycleMonths: 24 },
      { id: 'corrugatetest', label: 'Corrugated board compression testing and structural box design', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting an effective packaging plant audit', minutes: 20, summary: 'Walk automated packaging lines during changeovers, inspect heat sealing jaws, and evaluate carton stacking integrity.' },
      { id: 'mod2', title: 'Auditing food-contact migration compliance certificates', minutes: 25, summary: 'Interpret analytical laboratory migration reports, verify specific chemical threshold limits, and maintain audit-ready records.' },
      { id: 'mod3', title: 'Presenting sustainable compostable barrier pouches', minutes: 20, summary: 'Explain accredited industrial disintegration test reports and contrast oxygen barrier properties against conventional films.' },
      { id: 'mod4', title: 'Diagnosing automated tray lidding seal leakers', minutes: 15, summary: 'Conduct vacuum submersion bubble tests, evaluate sealing bar temperature consistency, and recommend polymer film adjustments.' },
      { id: 'mod5', title: 'Coordinating custom rotary die and CAD approvals', minutes: 20, summary: 'Verify structural carton dimensional drawings, review carton auto-bottom glue flap clearances, and collect signed CAD approvals.' },
      { id: 'mod6', title: 'Conducting on-press color proofing inspections', minutes: 15, summary: 'Measure spectrophotometer delta-E color variance across live print sheets to ensure brand pantone matching before full runs.' },
      { id: 'mod7', title: 'Optimizing corrugated box edge crush strength', minutes: 15, summary: 'Select appropriate board flute combinations to ensure five-high warehouse pallet stability without excess paperboard weight.' },
      { id: 'mod8', title: 'Collaborating with the strategic enterprise director', minutes: 20, summary: 'Structure multi-plant paperboard contracts and coordinate national supply chain agreements across major food processors.' },
      { id: 'mod9', title: 'Managing seasonal packaging substrate replenishment', minutes: 15, summary: 'Analyze customer production forecasts months ahead of food harvest seasons to secure corrugator mill board capacity.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I respond if a food maker requests immediate verbal confirmation of food safety?', text: 'Explain that verbal food safety assurances are legally prohibited. Provide the official certificate of compliance supported by accredited laboratory migration test data.' },
      { id: 'kn2', title: 'What documentation substantiates retail compostability packaging claims?', text: 'Provide third-party laboratory test reports certifying compliance with international industrial compostability standards and disintegration timelines.' },
      { id: 'kn3', title: 'Where do specialists find updated technical barrier property data sheets?', text: 'Access the digital converter technical portal. Download certified data sheets detailing oxygen transmission rates and water vapor transmission rates.' },
      { id: 'kn4', title: 'How do I handle a buyer asking about custom die tooling timelines?', text: 'Explain that custom rotary cutting dies require verified CAD structural approval and full artwork sign-off before steel rule fabrication commences.' },
      { id: 'kn5', title: 'What criteria qualify a converter for mill truckload pricing discounts?', text: 'Orders exceeding twelve thousand dollars of combined corrugated board or full trailer loads qualify for direct mill volume pricing schedules.' },
      { id: 'kn6', title: 'Who authorizes custom substrate pricing for multi-plant accounts?', text: 'Custom price agreements and extended warehousing inventory reservations require written approval from the regional packaging director.' },
      { id: 'kn7', title: 'How should specialists log a packaging audit override accurately?', text: 'Document the specific operational reason provided by the plant engineer alongside observed production line constraints to refine automated scheduling.' },
      { id: 'kn8', title: 'What safety gear is mandatory when walking active converter plant floors?', text: 'Steel-toed boots, high-visibility vests, protective eyewear, and hearing protection are required across all operating manufacturing areas.' },
      { id: 'kn9', title: 'How are travel mileage reimbursements processed for plant rounds?', text: 'Log initial and final vehicle odometer figures for each manufacturing facility call. Travel expense reports calculate payouts according to approved rates.' },
      { id: 'kn10', title: 'How should I prepare for an enterprise food processor review?', text: 'Review historical monthly board consumption, open custom tooling projects, and certificate renewal schedules alongside the strategic enterprise director.' },
      { id: 'kn11', title: 'What steps resolve tray lidding leakers on modified atmosphere lines?', text: 'Inspect sealing head heat distribution, check for product contamination on the tray flange, and verify machine dwell time settings.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your plant currently registers {kpiValue} compared to our manufacturing benchmark of {kpiTarget}. Improving this technical metric reduces packaging line waste.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} provides certified barrier protection while optimizing pallet cube density for your finished goods. Reviewing our technical specifications will demonstrate the operational benefits.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent substrate consumption reflects an overall {trend} trajectory. With {event} arriving in {eventDays} days, scheduling corrugated deliveries now avoids seasonal mill delays.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Enhancing packaging line reliability and barrier integrity', uses: ['share', 'orderCount'], text: '{name} has attained an estimated {share} of addressable manufacturing packaging volume. Across {orderCount} recent monthly {orders}, substrate consumption has proven steady. Our ongoing focus is eliminating tray seal leakers through optimized temperature calibration.' },
      { id: 'vs2', title: 'Modernizing consumer packaging with certified compostable materials', uses: ['offer', 'trend'], text: 'Substrate usage shows a {trend} movement. Introducing {offer} enables your marketing team to launch sustainable packaging backed by certified third-party laboratory disintegration test data.' },
      { id: 'vs3', title: 'Optimizing enterprise packaging procurement investments', uses: ['potential', 'share'], text: 'Addressable annual packaging substrate spend across {name} is estimated at {potential}, with current program representation standing at {current}. Bridging the estimated gap of {whitespace} through coordinated mill scheduling forms the basis of our partnership.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Food processing seal integrity campaign', startWeek: 1, weeks: 4, perWeek: 6 },
      { id: 'rp2', name: 'Sustainable folding carton redesign initiative', startWeek: 2, weeks: 3, perWeek: 5 },
    ],
    guardrails: [
      { id: 'pkg1', text: 'Food-contact regulatory claims derive strictly from verified certificates of compliance on file. Specialists never make sustainability claims without an authorized laboratory test report.', blocked: ['claim food safe without test', 'untested biodegradable claim', 'promise compostable without test', 'verbal food safe promise', 'unverified recyclable claim'] },
      { id: 'pkg2', text: 'Packaging line throughput projections utilize sample engineering benchmarks. Presentations never promise commercial production savings or guarantee factory output.', blocked: ['doubles line speed', 'zero defect packaging promise', 'promised converter bonus', 'miracle box design', 'unregistered polymer resin'] },
    ],
  },
};

