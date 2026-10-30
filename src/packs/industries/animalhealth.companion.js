// Sales Companion content for animal health: veterinary roles, clinic expenses, regulatory certifications,
// continuing education modules, technical knowledge repository, clinical pitches and ethical guardrails.

export default {
  companion: {
    roles: { rep: 'Territory account specialist', manager: 'District veterinary director' },
    expenseCategories: [
      { id: 'mileage', label: 'Rural farm and clinic travel mileage', limitClass: 'travel' },
      { id: 'parking', label: 'Veterinary medical center parking fees', limitClass: 'travel' },
      { id: 'meals', label: 'Field meal allowance during rural rounds', limitClass: 'meals' },
      { id: 'samples', label: 'Clinic sample display materials', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight rural territory accommodation', limitClass: 'lodging' },
      { id: 'biosecurity', label: 'On-farm biosecurity apparel and boots', limitClass: 'other' },
    ],
    certifications: [
      { id: 'veterinarycode', label: 'Veterinary pharmaceutical distribution ethics', cycleMonths: 12 },
      { id: 'coldchaincert', label: 'Biological cold chain storage and auditing', cycleMonths: 12 },
      { id: 'biosecuritycert', label: 'Livestock biosecurity and herd sanitation protocols', cycleMonths: 24 },
      { id: 'roadsafe', label: 'Rural territory safe driving and fatigue awareness', cycleMonths: 24 },
      { id: 'labelcomp', label: 'Package label compliance and withdrawal time regulations', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting an effective veterinary clinic audit', minutes: 20, summary: 'Navigate busy practice environments, audit biological storage logs, and engage practice managers on seasonal treatment schedules.' },
      { id: 'mod2', title: 'Maintaining cold chain integrity in transit', minutes: 15, summary: 'Understand critical temperature tolerances for biological vaccines, verify vehicle cooling units, and record digital proof of storage.' },
      { id: 'mod3', title: 'Presenting technical label inserts to practitioners', minutes: 25, summary: 'Communicate registered product indications, dosage forms, and withdrawal periods accurately without venturing into off-label claims.' },
      { id: 'mod4', title: 'Optimizing herd preventative health programs', minutes: 20, summary: 'Synchronize livestock vaccination and parasite management drops with producer calving schedules to ensure maximum preventative impact.' },
      { id: 'mod5', title: 'Managing veterinary prescription compliance documentation', minutes: 15, summary: 'Capture digital practitioner prescription authorizations correctly to maintain airtight state pharmacy and wholesale records.' },
      { id: 'mod6', title: 'Consultative merchandising for pet specialty retail', minutes: 15, summary: 'Arrange over-the-counter flea, tick, and wellness displays at eye level to support retail counter sales and pet parent education.' },
      { id: 'mod7', title: 'Navigating dairy parlor hygiene consultations', minutes: 20, summary: 'Demonstrate proper post-milking barrier teat dip application and evaluate dip cup sanitation alongside herd superintendents.' },
      { id: 'mod8', title: 'Collaborating with the strategic livestock manager', minutes: 20, summary: 'Structure enterprise-scale herd health agreements and coordinate joint consultations across commercial livestock operations.' },
      { id: 'mod9', title: 'Resolving biological backorder communication with practices', minutes: 15, summary: 'Inform veterinary clinics promptly of production delays and establish clear delivery windows for alternative registered therapeutics.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I respond if a practitioner asks about an unapproved dosage?', text: 'Explain politely that representatives can only provide information printed on the registered package insert. Offer to connect the veterinarian with the veterinary medical affairs department for clinical inquiries.' },
      { id: 'kn2', title: 'What documentation confirms valid cold chain delivery?', text: 'Record temperature readings from the calibrated transit data logger upon arrival, inspect secondary container seals, and capture a photo of the clinic refrigerator thermometer.' },
      { id: 'kn3', title: 'Where do specialists find current statutory withdrawal times?', text: 'Official withdrawal tables are located in the technical package monographs on the digital regulatory repository. Always reference the current approved revision date.' },
      { id: 'kn4', title: 'How do I handle a farmer asking for immediate disease diagnosis?', text: 'State clearly that field representatives are prohibited from diagnosing animal diseases or prescribing treatments. Advise the farmer to contact their consulting licensed herd veterinarian.' },
      { id: 'kn5', title: 'What is the required procedure for prescription product delivery?', text: 'Confirm active veterinary surgeon licensing credentials, verify that the prescription details match the order lines, and secure a physical or electronic signature upon receipt.' },
      { id: 'kn6', title: 'Who approves volume discounts on bulk herd preventative programs?', text: 'Tiered wholesale pricing agreements above standard published terms require formal authorization from the district veterinary director.' },
      { id: 'kn7', title: 'How do I log a veterinarian consultation override accurately?', text: 'Record the specific clinical or operational reason given by the practitioner alongside current caseload observations. This information refines automated appointment scheduling.' },
      { id: 'kn8', title: 'What biosecurity measures are mandatory when visiting livestock farms?', text: 'Disinfect footwear prior to stepping on the premises, wear protective disposable coveralls, and respect all quarantine and sanitation signage posted by farm management.' },
      { id: 'kn9', title: 'How are travel mileage disbursements processed for rural routes?', text: 'Record starting and ending odometer readings for all clinic and farm calls. Travel expense reports calculate reimbursements based on approved standard rates.' },
      { id: 'kn10', title: 'How should I prepare for a strategic dairy operation consultation?', text: 'Review annual herd census trends, bulk tank quality metrics, and past preventative health purchase orders in collaboration with the strategic livestock manager.' },
      { id: 'kn11', title: 'What steps resolve practitioner concerns regarding product efficacy?', text: 'Gather batch numbers, expiration dates, and administration logs from the clinic. Submit a formal technical pharmacovigilance inquiry to veterinary scientific affairs.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your facility currently maintains {kpiValue} against a target of {kpiTarget}. Addressing this preventative gap supports overall animal health outcomes.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} offers registered preventative support for patient cohorts treated in your clinic. Providing technical monographs to your staff will assist in protocol evaluation.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent dispensary activity indicates a {trend} movement. With {event} approaching in {eventDays} days, synchronizing preventative inventory now avoids emergency freight charges.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Strengthening clinic preventative care adherence', uses: ['share', 'orderCount'], text: '{name} has attained an estimated {share} of preventative animal health potential. Over the last {orderCount} dispensary {orders}, core preventative volumes have proven steady. Our shared focus is closing seasonal protection gaps through targeted practitioner reviews.' },
      { id: 'vs2', title: 'Expanding veterinary wellness solutions', uses: ['offer', 'trend'], text: 'Dispensary patterns show an overall {trend} trajectory. Introducing {offer} enables your veterinary staff to broaden preventative options while maintaining rigorous clinical label compliance.' },
      { id: 'vs3', title: 'Aligning livestock herd health investments', uses: ['potential', 'share'], text: 'Addressable preventative animal health potential at {name} is estimated at {potential} annually, with current program participation at {current}. Addressing the estimated variance of {whitespace} through synchronized herd drops forms the basis of our consultation.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Seasonal parasite prevention campaign', startWeek: 1, weeks: 4, perWeek: 5 },
      { id: 'rp2', name: 'Livestock pre-calving biological planning', startWeek: 2, weeks: 3, perWeek: 6 },
    ],
    guardrails: [
      { id: 'ahg1', text: 'No dosage, diagnosis, or clinical efficacy claims. Prescription pharmaceuticals dispense strictly under veterinary oversight. Information adheres to the registered label.', blocked: ['cures all symptoms', 'promised clinical recovery', 'prescribe without doctor', 'diagnose sick livestock', 'off label miracle'] },
      { id: 'ahg2', text: 'Practice volume projections rely on sample planning benchmarks. Presentations never promise commercial livestock yields or clinic retail revenue.', blocked: ['doubles dairy milk yield', 'promised clinic profits', 'risk free animal remedy', 'secret farm formula', 'unregistered medicine claim'] },
    ],
  },
};
