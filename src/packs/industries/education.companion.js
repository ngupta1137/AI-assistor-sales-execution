// Sales Companion content for school and education supplies: academic roles, consultant expenses, educational certifications,
// pedagogical training modules, school knowledge base, curriculum pitches and privacy guardrails.

export default {
  companion: {
    roles: { rep: 'Educational sales consultant', manager: 'Regional education director' },
    expenseCategories: [
      { id: 'mileage', label: 'School district travel mileage allowance', limitClass: 'travel' },
      { id: 'parking', label: 'Campus visitor and municipal parking fees', limitClass: 'travel' },
      { id: 'meals', label: 'Field lunch during institutional territory rounds', limitClass: 'meals' },
      { id: 'specimens', label: 'Curriculum evaluation specimen desk copies', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight regional educational conference stay', limitClass: 'lodging' },
      { id: 'stationery', label: 'Educational presentation materials and binders', limitClass: 'other' },
    ],
    certifications: [
      { id: 'childprivacy', label: 'Student data privacy and educational record protection', cycleMonths: 12 },
      { id: 'tenderprocure', label: 'Public education procurement and statutory tender compliance', cycleMonths: 24 },
      { id: 'labsafetycert', label: 'School science laboratory safety and chemical storage rules', cycleMonths: 12 },
      { id: 'roadsafe', label: 'Territory defensive driving and vehicle safety standards', cycleMonths: 24 },
      { id: 'curriccode', label: 'National educational curriculum frameworks and adoption cycles', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Conducting an effective curriculum adoption consultation', minutes: 20, summary: 'Engage department heads during planning periods, present syllabus alignment matrices, and coordinate teacher evaluation sample delivery.' },
      { id: 'mod2', title: 'Navigating public school procurement tender affidavits', minutes: 25, summary: 'Master statutory public education bid criteria, verify vendor non-collusion forms, and prepare audit-ready pricing submissions.' },
      { id: 'mod3', title: 'Presenting digital courseware to vocational faculty', minutes: 20, summary: 'Demonstrate hybrid learning software ergonomics, administrative reporting tools, and student licensing structures.' },
      { id: 'mod4', title: 'Auditing secondary school science laboratory inventory', minutes: 15, summary: 'Inspect student protective eye equipment, review apparatus storage conditions, and identify consumable chemistry replenishment needs.' },
      { id: 'mod5', title: 'Planning back-to-school institutional order timelines', minutes: 20, summary: 'Collaborate with school bursars months before autumn terms to finalize per-pupil classroom orders and schedule warehouse delivery.' },
      { id: 'mod6', title: 'Campus bookstore merchandising and revision sales', minutes: 15, summary: 'Arrange examination study guides, supplementary workbooks, and drafting stationery at bookstore entrances ahead of exam seasons.' },
      { id: 'mod7', title: 'Enforcing strict student privacy and ethical conduct', minutes: 15, summary: 'Protect child privacy by rejecting individual student tracking data and maintaining strictly anonymous enrollment headcounts.' },
      { id: 'mod8', title: 'Collaborating with the institutional accounts director', minutes: 20, summary: 'Structure district-wide supply consortia and coordinate multi-school procurement agreements across regional authorities.' },
      { id: 'mod9', title: 'Managing curriculum evaluation specimen distribution', minutes: 15, summary: 'Track desk copy inventory, collect signed teacher evaluation receipts, and follow up prior to departmental textbook adoption votes.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'How should I respond if an administrator asks to store student names in the app?', text: 'Explain that the platform adheres strictly to international child privacy regulations. Requisitions and adoption models process only anonymous, aggregated grade-level student enrollment numbers.' },
      { id: 'kn2', title: 'What documentation is mandatory for public school district bids?', text: 'Provide the official certified tender response form, public catalog rate schedules, authorized non-collusion affidavits, and proof of public liability insurance.' },
      { id: 'kn3', title: 'Where do consultants find current national curriculum framework outlines?', text: 'Access the digital publisher academic hub. Download verified syllabus cross-walk matrices mapped directly against approved state learning goals.' },
      { id: 'kn4', title: 'How do I handle an educator asking about textbook exam outcome claims?', text: 'State clearly that educational publishers cannot predict specific test results or examination marks. Explain how curriculum modular design supports effective teacher instruction.' },
      { id: 'kn5', title: 'What criteria qualify a school for complimentary teacher resource sets?', text: 'Academic departments adopting at least thirty student sets of a core curriculum line qualify for one complimentary teacher resource manual per classroom.' },
      { id: 'kn6', title: 'Who authorizes custom institutional pricing for school districts?', text: 'Multi-campus educational consortia agreements and volume discount schedules require formal review and written sign-off from the regional education director.' },
      { id: 'kn7', title: 'How should specialists log an academic consultation override?', text: 'Document the specific pedagogical or administrative reason stated by the educator alongside observed department priorities to refine future scheduling.' },
      { id: 'kn8', title: 'What protocol is required when visiting active school premises?', text: 'Sign in at the administrative reception desk immediately upon arrival, display visitor badges visibly, and remain in designated conference or office areas.' },
      { id: 'kn9', title: 'How are travel mileage disbursements processed for institutional rounds?', text: 'Log initial and final vehicle odometer figures for each school and campus stop. Travel expense reimbursements adhere to approved institutional travel schedules.' },
      { id: 'kn10', title: 'How should I prepare for an annual school district review?', text: 'Review historical per-pupil supply expenditures, pending curriculum adoption tenders, and warehouse delivery performance alongside the school bursar.' },
      { id: 'kn11', title: 'What steps resolve textbook shipping delays before the school term starts?', text: 'Check central depot inventory allocations, coordinate expedited freight shipments for immediate classroom needs, and provide temporary digital access codes.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'Regarding {kpi}, your institution currently maintains {kpiValue} relative to our regional benchmark of {kpiTarget}. Focusing our collaborative efforts here optimizes per-pupil classroom funding.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} aligns directly with updated state curriculum framework requirements. Providing evaluation specimen desk copies will allow your faculty committee to assess lesson suitability.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Recent institutional requisition patterns show an overall {trend} trajectory. With {event} approaching in {eventDays} days, finalizing supply orders now ensures classroom delivery before term begins.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Supporting academic classroom excellence and resource stability', uses: ['share', 'orderCount'], text: '{name} has attained an estimated {share} of addressable curriculum resource requirements. Across {orderCount} recent term {orders}, classroom deliveries have remained reliable. Our ongoing focus is aligning curriculum editions with updated national framework standards.' },
      { id: 'vs2', title: 'Enriching departmental STEM and vocational learning', uses: ['offer', 'trend'], text: 'Departmental requisition velocity reflects a {trend} movement. Introducing {offer} enables your teaching staff to modernize practical instruction while maintaining strict budget adherence.' },
      { id: 'vs3', title: 'Maximizing institutional educational budget impact', uses: ['potential', 'share'], text: 'Addressable annual curriculum spend across {name} is estimated at {potential}, with current program representation at {current}. Bridging the estimated gap of {whitespace} through coordinated term ordering forms the cornerstone of our academic partnership.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Back-to-school textbook adoption campaign', startWeek: 1, weeks: 4, perWeek: 6 },
      { id: 'rp2', name: 'Science laboratory safety equipment inspection', startWeek: 2, weeks: 3, perWeek: 5 },
    ],
    guardrails: [
      { id: 'edg1', text: 'Child personal data strictly remains out of all records. Consultants never promise improved test scores or specific learning outcomes. Tenders adhere to procurement laws.', blocked: ['promised higher test scores', 'promise higher grades', 'child tracking record', 'bypass public tender', 'secret exam pass'] },
      { id: 'edg2', text: 'Institutional budget projections utilize sample academic benchmarks. Presentations never promise institutional financial savings or student enrollment figures.', blocked: ['doubles student enrollment', 'zero effort teaching', 'promised school bonus', 'miracle learning method', 'unregistered syllabus'] },
    ],
  },
};
