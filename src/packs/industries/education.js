// School and education supplies: primary and secondary schools, vocational training institutes and academic bookshops.
// All curriculum, publisher, institution and individual names are fictional.

import assistant from './education.assistant.js';
import companion from './education.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'education',
  name: 'School and education supplies',
  tagline: 'Schools, training providers and bookshops',
  icon: 'book',
  accent: '#4C1D95',
  vocab: {
    account: 'institution', accounts: 'institutions',
    contact: 'educator', contacts: 'educators',
    rep: 'educational sales consultant', reps: 'educational sales consultants',
    manager: 'regional education director', kam: 'institutional accounts director',
    offering: 'curriculum product', offerings: 'curriculum products',
    order: 'requisition', orders: 'requisitions',
    visit: 'academic consultation', visits: 'academic consultations',
  },
  personas: {
    rep: 'Educational sales consultant',
    manager: 'Regional education director',
    admin: 'Educational operations lead',
  },
  segments: [
    {
      id: 'schools', name: 'Primary and secondary schools', share: 0.45, key: true, visitMinutes: [30, 45],
      style: 'Formal consultation with the school bursar or department head during administrative periods, reviewing curriculum adoptions, classroom stationery and laboratory kits.',
      annualValue: [25000, 115000], hours: [8 * 60, 16 * 60], orderQty: [5, 25],
      types: [
        { type: 'Primary or secondary school', naming: 'institution', words: { en: ['Academy', 'Grammar School', 'Preparatory School'], pt: ['Colégio', 'Escola Integrada'], es: ['Colegio', 'Instituto Educativo'], de: ['Gymnasium', 'Gesamtschule'], id: ['Sekolah Menengah', 'Akademi Belajar'], fr: ['Collège', 'Lycée', 'Institution Scolaire'] } },
      ],
      roles: ['School bursar', 'Curriculum coordinator', 'Department head'],
    },
    {
      id: 'training', name: 'Vocational institutes and academies', share: 0.3, visitMinutes: [20, 35],
      style: 'Curriculum alignment review with training directors, coordinating technical certification workbooks, vocational kits and digital course vouchers.',
      annualValue: [18000, 78000], hours: [9 * 60, 18 * 60], orderQty: [4, 18],
      types: [
        { type: 'Vocational institute', naming: 'institution', words: { en: ['Technical Institute', 'Vocational College', 'Training Academy'], pt: ['Instituto Técnico', 'Centro de Formação'], es: ['Instituto Técnico', 'Centro de Capacitación'], de: ['Berufskolleg', 'Fachakademie'], id: ['Institut Kejuruan', 'Balai Latihan'], fr: ['Institut Technique', 'Pôle de Formation'] } },
      ],
      roles: ['Training director', 'Vocational instructor', 'Registrar'],
    },
    {
      id: 'retail', name: 'Educational bookstores and stationers', share: 0.25, visitMinutes: [15, 30],
      style: 'Merchandising and back-to-school replenishment review with the bookshop manager, auditing study guide displays, art supplies and stationery shelving.',
      annualValue: [14000, 54000], hours: [9 * 60, 19 * 60], orderQty: [4, 20],
      types: [
        { type: 'Educational bookshop', naming: 'business', words: { en: ['Campus Bookstore', 'Scholastic Books', 'Academic Stationers'], pt: ['Livraria Acadêmica', 'Papelaria Universitária'], es: ['Librería Académica', 'Papelería Escolar'], de: ['Universitätsbuchhandlung', 'Schulbedarf'], id: ['Toko Buku Akademik', 'Alat Tulis Sekolah'], fr: ['Librairie Universitaire', 'Papeterie d’Études'] } },
      ],
      roles: ['Bookshop manager', 'Retail buyer', 'Store supervisor'],
    },
  ],
  offerings: [
    { id: 'mathcurric', name: 'Numeracystep Primary Mathematics Set', category: 'Mathematics', price: 42, unit: 'student pack', status: 'core' },
    { id: 'sciencedisc', name: 'Sciencequest Laboratory Starter Kit', category: 'Science', price: 160, unit: 'lab kit', status: 'core' },
    { id: 'litanthol', name: 'Broadview World Literature Reader', category: 'Language Arts', price: 28, unit: 'textbook', status: 'core' },
    { id: 'classstation', name: 'Scholarcraft Heavyweight Drawing Pad 50 Sheet', category: 'Art & Stationery', price: 18, unit: 'pack', status: 'core' },
    { id: 'stemrobot', name: 'Robocraft STEM Robotics Activity Box', category: 'STEM', price: 195, unit: 'kit', status: 'focus' },
    { id: 'digitstudy', name: 'Omniknow Digital Courseware License', category: 'Digital', price: 35, unit: 'license', status: 'focus' },
    { id: 'voctraining', name: 'Techniskill Mechanical Trade Workbook', category: 'Vocational', price: 32, unit: 'workbook', status: 'focus' },
    { id: 'earlychild', name: 'Playbright Early Years Sensory Block Set', category: 'Early Learning', price: 65, unit: 'set', status: 'new' },
    { id: 'teachmanual', name: 'Masterclass Educator Teacher Resource Guide', category: 'Teacher Resources', price: 0, unit: 'manual', status: 'new', kind: 'curriculum' },
  ],
  actions: [
    {
      id: 'curricgap', type: 'Review academic syllabus alignment', agent: 'gap', effort: 14, evidence: 'note', value: [160, 820], uses: 'core',
      title: 'Align course materials with revised curriculum framework on {product}',
      saw: 'The academic department uses previous-edition textbooks for {product} following syllabus revisions.',
      compared: 'Adoption benchmarks across secondary schools in {city} transitioning to current standards.',
      why: [
        'Updated learning resources align directly with standardized national curriculum goals.',
        'Transitioning to current editions eliminates student confusion over outdated problem sets.',
        'Structured adoption planning assists the school bursar in phased departmental budgeting.',
      ],
      talk: [
        'Review the curriculum cross-walk document alongside {person} during department planning.',
        'Highlight newly included modular STEM exercises and updated problem chapters.',
      ],
      guardrail: 'Curriculum alignment proposals reference approved national curriculum frameworks without pedagogical outcome claims.',
    },
    {
      id: 'examplersample', type: 'Deliver curriculum evaluation pack', agent: 'gap', effort: 10, evidence: 'signature', value: [90, 440], uses: 'focus',
      title: 'Provide teacher evaluation specimen kit for {product}',
      saw: 'Faculty members requested examination copies of {product} for departmental committee review.',
      compared: 'Schools receiving comprehensive evaluation specimen kits showing higher adoption rates.',
      why: [
        'Educators require physical examination copies to assess grade-level readability and pedagogy.',
        'Signed evaluation receipts document the compliant distribution of educational review materials.',
        'Faculty committee consensus expedites formal departmental procurement decisions.',
      ],
      talk: [
        'Hand over the teacher specimen desk copy and modular workbook to {person}.',
        'Review the online teacher digital lesson planning portal accompanying the physical text.',
        'Collect a signed acknowledgment of specimen curriculum materials.',
      ],
      guardrail: 'Student personal data strictly remains out of the product. Consultants never promise specific learning outcomes or test score improvements.',
    },
    {
      id: 'bursarreview', type: 'Finalize back-to-school requisition budget', agent: 'order', effort: 15, evidence: 'note', value: [280, 1350], uses: 'core',
      title: 'Finalize back-to-school classroom requisition for {event}',
      saw: 'Annual academic term enrollment projections indicate supply requisition deadlines around {event}, {eventDays} days away.',
      compared: 'Historical per-pupil classroom material expenditures recorded for this institution (sample data).',
      why: [
        'Early requisition submission ensures classroom delivery prior to the opening day of school.',
        'Bulk term ordering avoids expedited freight surcharges during late summer warehouse rushes.',
        'Consolidated purchase orders align neatly with departmental public fund allocations.',
      ],
      talk: [
        'Review projected student enrollment headcounts by grade with {person}.',
        'Verify delivery loading dock schedules prior to teacher orientation week.',
      ],
    },
    {
      id: 'tendersubmit', type: 'Certify procurement tender compliance', agent: 'order', effort: 18, evidence: 'signature', value: [350, 1800], uses: 'core',
      title: 'Confirm institutional procurement tender compliance on {product}',
      saw: 'Annual school district educational supply tender requires formal vendor compliance verification.',
      compared: 'Public procurement tender regulations governing educational authority supply contracts.',
      why: [
        'Statutory procurement compliance is mandatory for participation in public education contracts.',
        'Signed tender attestations maintain transparent audit trails for regional school boards.',
        'Strict bid compliance prevents legal disqualification during public tender evaluations.',
      ],
      talk: [
        'Verify formal tender specification criteria and pricing schedules with {person}.',
        'Obtain authorized institutional signature on public procurement compliance affidavits.',
      ],
      guardrail: 'Institutional bids adhere strictly to statutory public procurement rules. Consultants never offer unauthorized tender pricing concessions.',
    },
    {
      id: 'labsafety', type: 'Inspect laboratory science safety inventory', agent: 'gap', effort: 12, evidence: 'photo', value: [110, 560], uses: 'core', segments: ['schools'],
      title: 'Audit science laboratory safety and starter kit storage',
      saw: 'Secondary school science laboratory inventory shows depleted student eye protection and glassware.',
      compared: 'Academic science teaching standards requiring complete protective equipment per student station.',
      why: [
        'Adequate student protective gear is required prior to conducting practical chemistry labs.',
        'Restocking basic consumable glassware prevents laboratory activity cancellation.',
        'Photographic inventory audits confirm compliance with school board laboratory standards.',
      ],
      talk: [
        'Inspect laboratory reagent and apparatus storage cabinets alongside {person}.',
        'Photograph stocked protective eye goggles and recommend starter kit replenishment.',
      ],
    },
    {
      id: 'shelfmerch', type: 'Refresh bookstore educational display', agent: 'order', effort: 10, evidence: 'photo', value: [80, 390], uses: 'core', segments: ['retail'],
      title: 'Merchandise campus bookstore study guide display for {product}',
      saw: 'Retail examination study guide tables show depleted titles ahead of upcoming revision weeks.',
      compared: 'Standard academic bookstore floor layouts highlighting core reference titles at checkout.',
      why: [
        'Students purchase supplementary revision guides when study aids are displayed prominently.',
        'Keeping study guide racks fully stocked captures critical examination revision sales traffic.',
        'Photographic display records verify compliant cooperative publisher placement.',
      ],
      talk: [
        'Replenish revision workbook shelves with {person} using backroom inventory.',
        'Photograph the refreshed academic bookstore display for promotional verification.',
      ],
    },
    {
      id: 'termsched', type: 'Coordinate consultation during planning periods', agent: 'planner', effort: 4, evidence: 'note', value: [30, 120], uses: 'none',
      title: 'Coordinate consultation timing during teacher planning periods',
      saw: 'Previous consultations arrived while faculty supervised active classroom instruction.',
      compared: 'School bell schedules indicating structured departmental planning periods in early afternoon.',
      why: [
        'Meeting educators during scheduled planning periods ensures focused academic discussions.',
        'Respecting classroom teaching hours preserves instructional time and faculty goodwill.',
        'Optimized route sequencing enables visits across multiple institutions within an academic cluster.',
      ],
      talk: [
        'Confirm preferred departmental planning hours with the school administrative assistant.',
        'Schedule future consultation calendar reminders matching the institutional timetable.',
      ],
    },
    {
      id: 'vocationalgap', type: 'Review vocational certification modules', agent: 'gap', effort: 12, evidence: 'note', value: [130, 640], uses: 'focus', segments: ['training'],
      title: 'Audit trade certification workbook curriculum on {product}',
      saw: 'Vocational training modules reflect previous technical codes for practical mechanical apprentices.',
      compared: 'Industry apprenticeship accreditation standards requiring updated technical manuals.',
      why: [
        'Apprentices require current technical code instruction to pass statutory certification exams.',
        'Updating practical trade workbooks maintains institutional vocational accreditation.',
        'Providing modular technical manuals simplifies classroom instruction for instructors.',
      ],
      talk: [
        'Review industry certification syllabus changes alongside {person}.',
        'Present specimen trade workbooks covering updated practical workshop standards.',
      ],
    },
  ],
  orderReasons: {
    core: ['Supports projected student enrollment for the upcoming academic school term.', 'Replenishes laboratory and classroom stationery consumables based on class counts.', 'Restocks campus bookstore reference shelving ahead of examination revision.'],
    focus: ['Introduces interactive robotics activity kits for modern STEM classroom curriculum.', 'Expands digital courseware licenses for hybrid vocational and technical training.'],
    new: ['Introductory specimen placement for early childhood sensory developmental manipulatives.', 'Teacher resource manual package provided alongside adopted school curriculum lines.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 8000, route: 'manager', text: '{Orders} exceeding {limit} require {manager} verification and educational tender confirmation.' },
    { kind: 'prerequisite', appliesTo: 'core', action: 'tendersubmit', evidence: 'signature', text: 'School requisition submissions require verified institutional procurement compliance certification.' },
    { kind: 'info', text: 'Curriculum and school supplies pricing adheres to statutory education tender rate cards. Consultants cannot offer unauthorized institutional discounts.' },
  ],
  overrideReasons: [
    { label: 'Department head supervising standardized examinations', route: 'manager' },
    { label: 'Institution bound by municipal public education purchasing consortium', route: 'kam' },
    { label: 'School district curriculum review committee meeting postponed', route: 'manager' },
    { label: 'Institutional procurement tender documentation awaiting board legal review', route: 'manager' },
    { label: 'Academic consultation interrupted by unexpected school fire drill', route: 'manager' },
    { label: 'Other academic or administrative reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Educator selected competing curriculum publisher', blocked: false },
    { label: 'Curriculum workbook edition temporarily out of stock at publisher depot', blocked: true },
    { label: 'School district municipal account subject to budget freeze', blocked: true, route: 'kam' },
    { label: 'Campus closed for scheduled teacher professional development holiday', blocked: false },
  ],
  visitNotes: [
    'Academic consultation completed; reviewed curriculum framework alignment with mathematics faculty.',
    'Teacher evaluation specimen kit delivered with signed receipt from curriculum coordinator.',
    'Science laboratory inventory audited; photographed apparatus storage cabinets for safety records.',
    'Public procurement compliance affidavit verified and signed for annual district tender.',
    'Campus bookstore study guide display merchandised; restocked revision titles for upcoming exams.',
  ],
  kpis: [
    { id: 'curricadopt', label: 'Curriculum framework adoption', format: 'pct', range: [60, 98], target: 88 },
    { id: 'requisitionvol', label: 'Monthly requisition volume', format: 'count', range: [10, 65], target: 35 },
    { id: 'tendercomp', label: 'Procurement tender compliance rate', format: 'pct', range: [85, 100], target: 100 },
    { id: 'perpupilcost', label: 'Per-pupil budget efficiency index', format: 'pct', range: [70, 98], target: 92, segments: ['schools'] },
    { id: 'sellthrough', label: 'Academic bookstore sell-through', format: 'pct', range: [65, 95], target: 85, segments: ['retail'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Student personal data strictly remains out of the product. Consultants never promise specific learning outcomes or test score improvements. Institutional bids adhere strictly to statutory public procurement rules.' },
    { id: 'gap1', agent: 'gap', text: 'Curriculum alignment proposals reference approved national curriculum frameworks without pedagogical outcome claims.' },
    { id: 'order1', agent: 'order', text: 'Classroom material requisitions reflect verified student enrollment figures and standard per-pupil budgetary caps.' },
    { id: 'planner1', agent: 'planner', text: 'District-wide school tender agreements and multi-campus supply contracts require joint review with the institutional accounts director.' },
  ],
  problems: [
    { title: 'Educational sales representatives visit small daycares while major school districts are unserved', text: 'Consultants drop into small independent nurseries while massive municipal school clusters purchasing thousands of curriculum packs receive sporadic contact.', capability: 'potential' },
    { title: 'Curriculum adoption deadlines pass before textbook evaluation specimens are delivered', text: 'Academic committees select alternative textbook publishers because specimen copies arrive weeks after formal departmental review meetings have adjourned.', capability: 'gaps' },
    { title: 'Consultations interrupt active classroom teaching hours', text: 'Representatives knock on classroom doors while teachers deliver lectures, generating administrative irritation and abrupt dismissals from campus.', capability: 'ranking' },
    { title: 'Sales itineraries ignore school term calendars and municipal tender deadlines', text: 'Itineraries operate on uniform monthly cycles, arriving in the middle of summer breaks when campuses are locked and faculty are on vacation.', capability: 'planning' },
    { title: 'Classroom requisitions guess at student enrollment figures', text: 'School supply orders blindly copy prior-year quantities, stranding unused workbooks in storage closets while expanding grade levels experience shortages.', capability: 'order' },
    { title: 'Curriculum specimen handovers and procurement affidavits leave no audit trail', text: 'Evaluation sample deliveries and statutory tender disclosures are handled casually without signed records, complicating subsequent public audit scrutiny.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this educational institution prioritized first today?', a: 'It represents high curriculum requisition potential and holds an upcoming public procurement tender deadline requiring compliance sign-off.' },
    { q: 'Which schools are due a curriculum alignment consultation?', a: 'Institutions utilizing outdated textbook editions following state syllabus updates should receive evaluation specimen packs.' },
    { q: 'Can I enter student names or grades into the system?', a: 'No. Child and student personal data strictly remains out of the product under international privacy laws. Requisitions track only anonymous aggregated headcounts.' },
    { q: 'Does this curriculum program promise improved student test scores?', a: 'No. Consultants never promise specific learning outcomes or test score results. Materials align with national curriculum standards and support teacher pedagogy.' },
    { q: 'How are classroom supply requisition quantities calculated?', a: 'Quantities derive from confirmed grade enrollment figures, approved per-pupil supply allowances, and verified inventory counts.' },
    { q: 'Where does an academic consultation override route for review?', a: 'It routes directly to your regional education director with your recorded notes to calibrate academic scheduling models.' },
    { q: 'Which school districts require a strategic procurement review?', a: 'Review public school districts with upcoming multi-school supply tenders. The Visit Planner coordinates joint calls with the institutional accounts director.' },
    { q: 'What indicates low confidence on an educational recommendation?', a: 'Low confidence indicates unconfirmed student enrollment numbers or missing school board adoption calendars, advising the consultant to verify figures with the bursar.' },
  ],
  storyline: [
    'Select School and education supplies and pick the prospect country. Remind participants that all student enrollment figures and institution names represent sample demonstration data.',
    'Today screen: review the educational sales consultant daily schedule, prioritized by academic term deadlines and educational sector terminology.',
    'Open the premier academic consultation brief. Approve the curriculum alignment review. Override the laboratory inspection with appropriate reason code.',
    'Examine an action card: inspect the pedagogical context, talking points, and the strict guardrail protecting student personal data.',
    'Requisition builder: adjust student pack quantities and show how the statutory tender compliance affidavit gates final submission.',
    'Conclude the academic consultation. Switch to the regional education director persona to inspect the logged exception queue and reason notes.',
    'Agent controls view: pause the Order agent to demonstrate how automated classroom requisitions pause without halting scheduled school consultations.',
    'Configuration view: demonstrate how educational segments, academic KPIs, and privacy guardrails adjust dynamically as modular settings.',
  ],
  forbidden: ['patient bedside', 'clinic ward', 'veterinary', 'livestock', 'crop harvest', 'brokerage policy', 'freight carrier', 'auto repair'],
};
