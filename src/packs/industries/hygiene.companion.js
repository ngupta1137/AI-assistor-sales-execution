// Sales Companion content for hygiene and cleaning supplies: housekeeping roles, audit expenses, safety credentials,
// operational training modules, chemical knowledge base, commercial pitches and environmental safety guardrails.

export default {
  companion: {
    roles: { rep: 'Hygiene account specialist', manager: 'Regional hygiene director' },
    expenseCategories: [
      { id: 'mileage', label: 'Facility inspection route travel mileage', limitClass: 'travel' },
      { id: 'parking', label: 'Commercial parking and hotel garage fees', limitClass: 'travel' },
      { id: 'meals', label: 'Field lunch during territory service calls', limitClass: 'meals' },
      { id: 'testkits', label: 'Water hardness test strips and titration reagents', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight commercial property stay', limitClass: 'lodging' },
      { id: 'ppe', label: 'Chemical splash goggles and inspection footwear', limitClass: 'other' },
    ],
    certifications: [
      { id: 'chemsafety', label: 'Chemical hazard communication and safety data sheet standards', cycleMonths: 12 },
      { id: 'dispensercert', label: 'Closed-loop proportioning equipment installation and calibration', cycleMonths: 24 },
      { id: 'pathogencert', label: 'Bloodborne pathogen disinfection protocols for institutions', cycleMonths: 12 },
      { id: 'roadsafe', label: 'Territory defensive driving and vehicle safety', cycleMonths: 24 },
      { id: 'warewashcert', label: 'Commercial warewash and laundry chemical titration', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting a comprehensive washroom hygiene audit', minutes: 20, summary: 'Evaluate touchless dispenser operation, inspect soap cartridge levels, and assess odor neutralization across commercial restrooms.' },
      { id: 'mod2', title: 'Calibrating wall-mounted chemical proportioners', minutes: 25, summary: 'Test water inlet pressure, select color-coded metering tips, and measure solution concentration with a refractometer test kit.' },
      { id: 'mod3', title: 'Auditing chemical safety data sheet stations', minutes: 15, summary: 'Verify that secondary spray bottles bear hazard labels and ensure visible safety binders are stocked at janitorial chemical stations.' },
      { id: 'mod4', title: 'Optimizing commercial laundry wash formulas', minutes: 20, summary: 'Diagnose linen graying and alkalinity imbalances by testing wash wheel water hardness and adjusting automated injection pumps.' },
      { id: 'mod5', title: 'Presenting closed-loop dispensing to hotel leadership', minutes: 20, summary: 'Demonstrate employee safety advantages, eliminated chemical contact hazards, and predictable cost per diluted gallon.' },
      { id: 'mod6', title: 'Managing contract cleaning chemical logistics', minutes: 25, summary: 'Coordinate bulk drum shipments to regional depots and schedule preventive dispenser maintenance across multiple job sites.' },
      { id: 'mod7', title: 'Enforcing healthcare surface contact dwell times', minutes: 15, summary: 'Train environmental services personnel on maintaining proper wet surface dwell times for hospital-grade disinfectant liquids.' },
      { id: 'mod8', title: 'Collaborating with the strategic contractor director', minutes: 20, summary: 'Structure multi-property chemical supply agreements and review quarterly volume rebate tiers for commercial janitorial contractors.' },
      { id: 'mod9', title: 'Managing emergency chemical spill response protocol', minutes: 15, summary: 'Guide facility personnel on immediate containment steps, personal protective equipment usage, and technical desk notification.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I respond when asked if two cleaning chemicals can be mixed?', text: 'Never recommend or endorse mixing cleaning formulations. State clearly that combining products creates toxic fumes and hazardous reactions, and provide the official safety data sheet.' },
      { id: 'kn2', title: 'What equipment verifies accurate chemical dilution ratios?', text: 'Utilize a handheld optical refractometer and chemical test paper strips. Compare refractive readings against the published dilution chart on the product technical data sheet.' },
      { id: 'kn3', title: 'Where can specialists download current safety data sheets?', text: 'Access the digital regulatory compliance hub. Download only the latest revision sheets with verified regulatory clearance dates and leave printed copies at the property.' },
      { id: 'kn4', title: 'What is the procedure when a chemical dispenser experiences water pressure drops?', text: 'Inspect the incoming water line strainer for debris, test dynamic pressure with an inline gauge, and install a pressure-compensating regulator if line pressure fluctuates.' },
      { id: 'kn5', title: 'What criteria qualify a facility for automated dispenser installation?', text: 'Properties utilizing at least four concentrate cases monthly or commercial facilities with multiple janitorial closets qualify for loaned closed-loop stations.' },
      { id: 'kn6', title: 'Who authorizes custom chemical pricing for large cleaning contractors?', text: 'Custom price schedules and equipment placement allowances for multi-site contractors require written approval from the regional hygiene director.' },
      { id: 'kn7', title: 'How do specialists log an inspection override effectively?', text: 'Record the specific operational reason stated by the facility supervisor alongside observed building conditions. This documentation refines automated maintenance schedules.' },
      { id: 'kn8', title: 'What personal protective equipment is mandatory during chemical inspections?', text: 'Wear splash-resistant safety glasses, nitrile chemical gloves, and slip-resistant footwear whenever handling concentrated detergents or calibrating dispensers.' },
      { id: 'kn9', title: 'How are travel mileage disbursements calculated for field audits?', text: 'Log initial and final vehicle odometer figures for each facility service stop. Reimbursement claims calculate payouts according to approved company travel rates.' },
      { id: 'kn10', title: 'How should I prepare for a commercial hotel group review?', text: 'Review historical occupied room counts, chemical cost per occupied room metrics, and outstanding equipment repair requests alongside the operations director.' },
      { id: 'kn11', title: 'What steps resolve laundry linen graying complaints?', text: 'Perform a comprehensive wash wheel titration test, measure water rinse temperature, check iron content, and adjust detergent builder injection levels.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your property currently scores {kpiValue} compared to our commercial benchmark of {kpiTarget}. Improving this operational metric lowers overall cleaning chemical spend.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} delivers reliable sanitization while reducing packaging waste across housekeeping departments. Setting up an introductory demonstration will show your staff the closed-loop safety benefits.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent property chemical consumption indicates an overall {trend} trajectory. With {event} arriving in {eventDays} days, scheduling dispenser maintenance now ensures uninterrupted washroom uptime.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Standardizing facility cleaning operational excellence', uses: ['share', 'orderCount'], text: '{name} has attained an estimated {share} of addressable institutional sanitation requirements. Across {orderCount} recent monthly {orders}, chemical spend has remained predictable. Our joint focus is optimizing dispenser dilution to prevent product waste.' },
      { id: 'vs2', title: 'Elevating surface sanitization and guest safety', uses: ['offer', 'trend'], text: 'Chemical usage patterns demonstrate a {trend} movement. Integrating {offer} enables your environmental services team to achieve consistent sanitization while safeguarding employee safety.' },
      { id: 'vs3', title: 'Optimizing commercial hygiene operational investments', uses: ['potential', 'share'], text: 'Addressable annual sanitation potential across {name} is estimated at {potential}, with current program participation standing at {current}. Bridging the estimated gap of {whitespace} through closed-loop proportioning forms the foundation of our partnership.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Washroom dispenser modernization campaign', startWeek: 1, weeks: 4, perWeek: 5 },
      { id: 'rp2', name: 'Contract cleaning safety documentation audit', startWeek: 2, weeks: 3, perWeek: 6 },
    ],
    guardrails: [
      { id: 'hyg1', text: 'Chemical safety inquiries refer exclusively to the safety data sheet and technical service desk. Specialists never give chemical mixing instructions.', blocked: ['mix bleach and ammonia', 'safe to combine chemicals', 'acid mixing recipe', 'ignore safety data sheet', 'off label chemical blend'] },
      { id: 'hyg2', text: 'Facility chemical savings estimates rely on illustrative sample data. Presentations never promise commercial contract margins or labor savings.', blocked: ['doubles cleaning speed', 'zero labor cleaning', 'eliminates all germs forever', 'promised contractor bonus', 'miracle stain eraser'] },
    ],
  },
};
