// Packaging and print: food and beverage makers, consumer brands and industrial manufacturers.
// All substrate, converter, facility and individual names are fictional.

import assistant from './packaging.assistant.js';
import companion from './packaging.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'packaging',
  name: 'Packaging and print',
  tagline: 'Food and drink makers, retail brands and manufacturers',
  icon: 'scan',
  accent: '#475569',
  vocab: {
    account: 'converter', accounts: 'converters',
    contact: 'buyer', contacts: 'buyers',
    rep: 'packaging sales specialist', reps: 'packaging sales specialists',
    manager: 'regional packaging director', kam: 'strategic enterprise director',
    offering: 'packaging substrate', offerings: 'packaging substrates',
    order: 'order', orders: 'orders',
    visit: 'packaging audit', visits: 'packaging audits',
  },
  personas: {
    rep: 'Packaging sales specialist',
    manager: 'Regional packaging director',
    admin: 'Packaging operations lead',
  },
  segments: [
    {
      id: 'foodbev', name: 'Food and beverage processors', share: 0.4, key: true, visitMinutes: [30, 50],
      style: 'Technical packaging review on the plant floor, evaluating automated form-fill-seal barrier film performance, food-contact migration certificates and carton palletization.',
      annualValue: [65000, 290000], hours: [7 * 60, 16 * 60], orderQty: [8, 36],
      types: [
        { type: 'Food processor', naming: 'institution', words: { en: ['Foods Processing', 'Baking Works', 'Beverage Bottling'], pt: ['Alimentos', 'Indústria de Bebidas'], es: ['Alimentos Procesados', 'Embotelladora'], de: ['Lebensmittelwerk', 'Abfüllbetrieb'], id: ['Industri Makanan', 'Pabrik Minuman'], fr: ['Agroalimentaire', 'Maison de Salaisons'] } },
      ],
      roles: ['Packaging engineer', 'Plant operations manager', 'Quality assurance director'],
    },
    {
      id: 'retailbrands', name: 'Consumer retail and direct brands', share: 0.35, visitMinutes: [20, 35],
      style: 'Design and brand consultation reviewing sustainable folding cartons, custom unboxing graphics, recyclable mailer pouches and color print proofing.',
      annualValue: [28000, 120000], hours: [8 * 60, 17 * 60], orderQty: [5, 22],
      types: [
        { type: 'Consumer goods brand', naming: 'business', words: { en: ['Consumer Brands', 'Retail Goods', 'Direct Ventures'], pt: ['Marcas de Consumo', 'Bens de Consumo'], es: ['Marcas de Consumo', 'Productos Minoristas'], de: ['Konsumgüter', 'Markenartikel'], id: ['Merek Konsumen', 'Produk Ritel'], fr: ['Marque Grand Public', 'Produits du Quotidien'] } },
      ],
      roles: ['Brand director', 'Procurement lead', 'Creative design manager'],
    },
    {
      id: 'industrial', name: 'Industrial equipment and component makers', share: 0.25, visitMinutes: [20, 35],
      style: 'Heavy packaging audit in the warehouse and shipping yard, evaluating heavy-duty corrugated export boxes, anti-corrosion barrier wraps and strapping.',
      annualValue: [22000, 90000], hours: [7 * 60, 17 * 60], orderQty: [4, 18],
      types: [
        { type: 'Industrial manufacturer', naming: 'institution', words: { en: ['Machinery Works', 'Precision Fabricators', 'Industrial Systems'], pt: ['Metalurgia', 'Máquinas Industriais'], es: ['Maquinaria Pesada', 'Manufacturas Industriales'], de: ['Maschinenbau', 'Industriewerke'], id: ['Industri Permesinan', 'Peralatan Pabrik'], fr: ['Fabrication Industrielle', 'Matériel Mécanique'] } },
      ],
      roles: ['Shipping supervisor', 'Logistics director', 'Plant manager'],
    },
  ],
  offerings: [
    { id: 'corrugatebox', name: 'Boxcraft Double-Wall Corrugated Shipper', category: 'Corrugated', price: 1.85, unit: 'carton', status: 'core' },
    { id: 'barrierfilm', name: 'Freshseal High-Barrier Lidding Film 500 m', category: 'Flexible', price: 145, unit: 'roll', status: 'core' },
    { id: 'foldingcart', name: 'Printlux Bleached Folding Carton Board', category: 'Paperboard', price: 0.42, unit: 'carton', status: 'core' },
    { id: 'biodegmailer', name: 'Biopack Recycled Kraft Padded Mailer', category: 'Mailers', price: 0.38, unit: 'mailer', status: 'core' },
    { id: 'shrinkfilm', name: 'Clearwrap Heat Shrink Bundling Film 1200 m', category: 'Flexible', price: 110, unit: 'roll', status: 'focus' },
    { id: 'vciwrap', name: 'Rustguard Vapor Corrosion Inhibitor Wrap 100 m', category: 'Industrial', price: 85, unit: 'roll', status: 'focus' },
    { id: 'rigidbox', name: 'Prestigepack Rigid Set-Up Gift Box', category: 'Rigid Box', price: 2.6, unit: 'box', status: 'focus' },
    { id: 'compostpouch', name: 'Terrapouch Certified Compostable Stand-Up Bag', category: 'Flexible', price: 0.55, unit: 'pouch', status: 'new' },
    { id: 'customdie', name: 'Precision Structural Die-Cutting Tooling', category: 'Tooling', price: 650, unit: 'die set', status: 'new', kind: 'tooling' },
  ],
  actions: [
    {
      id: 'foodcertgap', type: 'Verify food-contact compliance certificate', agent: 'gap', effort: 8, evidence: 'signature', value: [90, 420], uses: 'core',
      title: 'Inspect food-contact regulatory compliance certificates for {product}',
      saw: 'The packaging quality file lacks updated food-contact migration test records for direct food contact.',
      compared: 'Statutory food packaging safety regulations requiring current certified migration analysis.',
      why: [
        'Direct food-contact substrates require certified laboratory migration compliance on file.',
        'Documenting verified certificates protects food processors during third-party quality audits.',
        'A signed compliance acknowledgment maintains transparent traceability for food safety audits.',
      ],
      talk: [
        'Review the certified migration testing report with {person} on the production floor.',
        'Deliver the signed manufacturer compliance certificate and obtain written acknowledgment.',
      ],
      guardrail: 'Food-contact regulatory claims derive strictly from verified certificates of compliance on file. Specialists never make unverified safety promises.',
    },
    {
      id: 'barrierleak', type: 'Inspect packaging seal integrity', agent: 'gap', effort: 12, evidence: 'photo', value: [130, 620], uses: 'core',
      title: 'Audit automated lidding seal integrity on {product}',
      saw: 'Modified atmosphere packaging lines show intermittent seal channel leaks during morning packing runs.',
      compared: 'Standard vacuum chamber leak test benchmarks maintaining zero bubble penetration.',
      why: [
        'Microscopic tray seal leaks allow gas exchange and shorten refrigerated product shelf life.',
        'Optimizing sealing heat bar dwell time eliminates leaker trays without slowing line speeds.',
        'Photographing the vacuum submersion bubble test confirms proper heat seal bonding.',
      ],
      talk: [
        'Conduct a water bubble submersion chamber test alongside {person} on fresh tray samples.',
        'Adjust tray sealing bar temperature and photograph the leak-free test result.',
      ],
      guardrail: 'Barrier property and shelf-life estimations reference published technical data sheets without unauthorized barrier modifications.',
    },
    {
      id: 'sustaintest', type: 'Review certified compostability test documentation', agent: 'gap', effort: 10, evidence: 'note', value: [100, 480], uses: 'new',
      title: 'Present accredited laboratory compostability test reports for {product}',
      saw: 'The brand marketing team requested compostable certification data prior to eco-line packaging launch.',
      compared: 'International compostability standards requiring accredited laboratory disintegration reports.',
      why: [
        'Retail packaging sustainability claims require rigorous third-party laboratory verification.',
        'Providing verified test documentation shields brand owners from greenwashing allegations.',
        'Clear industrial compostability data speeds packaging qualification with supermarket retail buyers.',
      ],
      talk: [
        'Walk through the independent laboratory test report with {person}.',
        'Clarify the distinction between home and industrial composting certifications explicitly.',
      ],
      guardrail: 'Specialists never make environmental sustainability or compostability claims without an authorized laboratory test report.',
    },
    {
      id: 'crushstrength', type: 'Audit corrugated box stacking strength', agent: 'gap', effort: 14, evidence: 'note', value: [150, 720], uses: 'core',
      title: 'Review corrugated box edge crush strength for {product}',
      saw: 'Warehouse pallet stacks show bottom carton corner creases during extended high-bay storage.',
      compared: 'Standard edge crush test specifications maintaining safe five-high pallet warehousing.',
      why: [
        'Carton corner crushing causes pallet stack lean and risks catastrophic warehouse collapse.',
        'Selecting proper corrugated flute profiles maintains stack rigidity under humid storage conditions.',
        'Optimizing box compression strength protects valuable finished goods from transit damage.',
      ],
      talk: [
        'Inspect bottom pallet tiers with {person} and measure box compression deflection.',
        'Recommend transitioning to heavy-duty double-wall board for bottom pallet positions.',
      ],
    },
    {
      id: 'bulkpalletorder', type: 'Establish seasonal corrugated supply replenishment', agent: 'order', effort: 15, evidence: 'note', value: [320, 1500], uses: 'core', segments: ['foodbev', 'industrial'],
      title: 'Plan corrugated box and pallet wrap replenishment for {event}',
      saw: 'Plant production scheduling indicates packaging volume surges around {event}, {eventDays} days away.',
      compared: 'Historical substrate consumption data recorded for this plant during prior packing seasons (sample data).',
      why: [
        'Advance corrugator booking reserves mill paperboard capacity ahead of seasonal boxboard shortages.',
        'Staged releases prevent plant floor congestion while ensuring steady packaging supply.',
        'Volume-bundled orders optimize truckload shipping economics for the manufacturing facility.',
      ],
      talk: [
        'Review line packing schedules with {person} to map required pallet counts by box size.',
        'Agree on scheduled trailer drops synchronized with weekly finished production output.',
      ],
    },
    {
      id: 'artsignoff', type: 'Secure structural CAD die and artwork sign-off', agent: 'order', effort: 16, evidence: 'signature', value: [220, 1100], uses: 'tooling',
      title: 'Obtain structural CAD drawing and artwork sign-off on {product}',
      saw: 'New product line packaging launch requires custom rotary die-cutting tooling fabrication.',
      compared: 'Standard converter engineering workflows requiring signed CAD dimensional approvals.',
      why: [
        'Custom cutting dies represent permanent tooling that cannot be modified after steel rule bending.',
        'Signed dimensional proofs verify glue flap widths, crease scores, and auto-erect dimensions.',
        'A formal sign-off protects both customer and converter from costly tooling re-fabrication.',
      ],
      talk: [
        'Review the 3D folding carton prototype and CAD dimensional print with {person}.',
        'Verify barcode placement and collect the authorized structural sign-off signature.',
      ],
      guardrail: 'Custom printing plate and die-cut tooling orders require verified structural CAD drawings and formal artwork sign-off.',
    },
    {
      id: 'presscheck', type: 'Conduct live printing color proof inspection', agent: 'order', effort: 12, evidence: 'photo', value: [140, 700], uses: 'focus', segments: ['retailbrands'],
      title: 'Audit live press color proof alignment on {product}',
      saw: 'Brand guidelines specify tight spectrophotometer color tolerance for core logo pantone shades.',
      compared: 'Commercial color printing standards maintaining strict color variance limits.',
      why: [
        'Consistent brand packaging color creates instant consumer shelf recognition in retail aisles.',
        'Catching color drift on press prevents thousands of misprinted cartons from running.',
        'Photographing the certified spectrophotometer reading establishes documented color compliance.',
      ],
      talk: [
        'Pull live press pull sheets with {person} and measure density across the ink keys.',
        'Compare readings against the master color swatch and photograph the verified proof.',
      ],
    },
    {
      id: 'linesched', type: 'Coordinate audit during line changeover', agent: 'planner', effort: 4, evidence: 'note', value: [30, 130], uses: 'none',
      title: 'Coordinate packaging audit timing during plant line changeover',
      saw: 'Previous audits arrived while packaging lines operated at peak throughput.',
      compared: 'Plant shift schedules indicating planned line changeover and sanitation windows.',
      why: [
        'Meeting packaging engineers during scheduled changeovers allows thorough line inspections.',
        'Respecting active production shifts prevents plant floor disruptions and operator distractions.',
        'Optimized route timing avoids waiting in manufacturing security reception areas.',
      ],
      talk: [
        'Confirm upcoming scheduled changeover times with the plant operations manager.',
        'Set itinerary reminders matching plant maintenance shift transitions.',
      ],
    },
  ],
  orderReasons: {
    core: ['Reflects projected seasonal manufacturing packaging requirements across processing plants.', 'Replenishes corrugated shipping containers based on plant packing schedule forecasts.', 'Supports brand unboxing box and padded mailer fulfillment stock.'],
    focus: ['Introduces high-barrier heat shrink film to extend processed food shelf life.', 'Provides specialized anti-corrosion barrier packaging for precision machinery exports.'],
    new: ['Introductory order for certified industrial compostable stand-up pouches.', 'Tooling fabrication charge for newly commissioned custom rotary cutting die set.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 12000, route: 'manager', text: '{Orders} exceeding {limit} require {manager} verification and mill production sign-off.' },
    { kind: 'prerequisite', appliesTo: 'tooling', action: 'artsignoff', evidence: 'signature', text: 'Custom tooling and print cylinder orders require verified structural CAD drawings and formal artwork sign-off.' },
    { kind: 'info', text: 'Substrate and corrugated volume pricing follows approved manufacturing schedules. Specialists cannot offer unapproved mill rate discounts.' },
  ],
  overrideReasons: [
    { label: 'Plant packaging engineer occupied with emergency line breakdown', route: 'manager' },
    { label: 'Converter currently under national contract treaty with competing paper mill', route: 'kam' },
    { label: 'Substrate trial postponed due to raw material ingredient supply delay', route: 'manager' },
    { label: 'Packaging structural CAD drawings awaiting customer legal review', route: 'manager' },
    { label: 'Insufficient review time during packaging line changeover window', route: 'manager' },
    { label: 'Other manufacturing or technical reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Buyer selected competing packaging substrate', blocked: false },
    { label: 'Specialty paperboard caliper temporarily backordered at mill', blocked: true },
    { label: 'Manufacturing account placed on credit administrative hold', blocked: true, route: 'kam' },
    { label: 'Plant operating under restricted quarantine sanitation routine', blocked: false },
  ],
  visitNotes: [
    'Packaging audit completed; inspected tray lidding heat seal integrity on packaging line two.',
    'Food-contact compliance certificate delivered with signed receipt from quality assurance lead.',
    'Corrugated box compression audit conducted; recommended double-wall board for bottom pallet positions.',
    'Structural CAD die drawing approved and signed for rotary cutting fabrication.',
    'Live press color proof inspected with brand manager; verified logo color tolerances.',
  ],
  kpis: [
    { id: 'sealquality', label: 'Tray seal integrity compliance', format: 'pct', range: [80, 100], target: 98 },
    { id: 'cartonorders', label: 'Monthly substrate order volume', format: 'count', range: [10, 70], target: 40 },
    { id: 'foodcertrate', label: 'Compliance certificate currency', format: 'pct', range: [85, 100], target: 100 },
    { id: 'crushindex', label: 'Box stacking compression index', format: 'pct', range: [70, 98], target: 92, segments: ['foodbev', 'industrial'] },
    { id: 'coloraccuracy', label: 'Print color proof accuracy', format: 'pct', range: [75, 99], target: 95, segments: ['retailbrands'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Food-contact regulatory claims derive strictly from verified certificates of compliance on file. Specialists never make environmental sustainability or compostability claims without an authorized laboratory test report.' },
    { id: 'gap1', agent: 'gap', text: 'Barrier property and shelf-life estimations reference published technical data sheets without unauthorized barrier modifications.' },
    { id: 'order1', agent: 'order', text: 'Custom printing plate and die-cut tooling orders require verified structural CAD drawings and formal artwork sign-off.' },
    { id: 'planner1', agent: 'planner', text: 'Multi-plant enterprise supply contracts and custom tooling agreements require consultation with the strategic enterprise director.' },
  ],
  problems: [
    { title: 'Packaging representatives visit small craft workshops while major manufacturing plants are uncalled', text: 'Specialists spend hours with local boutique producers while large-scale food processing plants purchasing thousands of paperboard and film rolls receive rare technical contact.', capability: 'potential' },
    { title: 'Tray seal leakers and barrier failures are found after product reaches retail shelves', text: 'Processors discover microscopic heat seal channel leaks only after complaints of spoiled retail foods emerge, leading to costly product recalls and brand damage.', capability: 'gaps' },
    { title: 'Audits land during chaotic mid-shift plant production emergencies', text: 'Sales specialists arrive while line operators clear conveyor jams and fix labelers, resulting in abrupt dismissals and abandoned technical reviews.', capability: 'ranking' },
    { title: 'Itineraries operate on arbitrary schedules detached from packaging line changeovers', text: 'Consultations arrive during peak throughput rather than synchronizing with planned maintenance windows when line engineers can evaluate test rolls.', capability: 'planning' },
    { title: 'Corrugated orders guess at palletization throughput', text: 'Plants reorder standard box quantities by habit, causing plant dock floor clutter during slow periods and box runouts during seasonal packaging peaks.', capability: 'order' },
    { title: 'Food contact compliance certificates and CAD tooling approvals leave no audit trail', text: 'Crucial food safety migration certificates and custom tooling artwork sign-offs remain scattered across email threads and paper slips, risking compliance failure during audits.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this packaging converter prioritized first on today route?', a: 'It represents high substrate order volume and has open food-contact compliance certificate renewals that must be completed during today audit.' },
    { q: 'Which food processing plants need a tray seal integrity audit?', a: 'Plants utilizing modified atmosphere lidding lines that have operated over three months without a vacuum bubble chamber inspection.' },
    { q: 'Can I verbally confirm that a packaging film is food safe?', a: 'No. Food-contact safety claims require official certificates of compliance supported by certified laboratory migration testing. Verbal assurances are prohibited.' },
    { q: 'How does high-barrier lidding film extend refrigerated food shelf life?', a: 'Engineered barrier polymers prevent oxygen transmission and moisture loss, preserving food freshness without artificial preservatives.' },
    { q: 'How are suggested corrugated box replenishment quantities calculated?', a: 'Quantities derive from confirmed production line packing schedules, warehouse pallet slot capacity, and supplier paperboard lead times.' },
    { q: 'Where does a packaging audit override reason route for review?', a: 'It routes directly to your regional packaging director with your recorded technical notes to calibrate mill production allocations.' },
    { q: 'Which consumer brand accounts require strategic enterprise director alignment?', a: 'Review multi-plant retail brands evaluating enterprise-wide packaging redesigns. The Visit Planner schedules joint executive consultations.' },
    { q: 'What indicates low confidence on a packaging substrate recommendation?', a: 'Low confidence indicates unconfirmed packaging line machine speeds or missing sealing temperature data, advising the specialist to test samples on line.' },
  ],
  storyline: [
    'Select Packaging and print and choose the target country. Remind participants that all plant figures and substrate specifications represent sample demonstration data.',
    'Today screen: review the packaging sales specialist daily itinerary, organized by plant manufacturing priority and packaging industry terminology.',
    'Open the premier packaging audit brief. Approve the food-contact compliance verification. Override the color proof action with documented reason code.',
    'Examine an action card: inspect the manufacturing context, talking points, and the strict guardrail requiring certified migration reports.',
    'Order builder: adjust corrugated container quantities and show how the custom tooling signature requirement gates final order submission.',
    'Conclude the packaging audit. Switch to the regional packaging director persona to review the exception queue and logged notes.',
    'Agent controls view: pause the Order agent to demonstrate how automated substrate orders pause without interrupting scheduled plant audits.',
    'Configuration view: demonstrate how packaging segments, manufacturing KPIs, and safety guardrails adapt dynamically as modular settings.',
  ],
  forbidden: ['patient bedside', 'clinic ward', 'veterinary', 'livestock', 'crop harvest', 'brokerage policy', 'freight carrier', 'textbook syllabus'],
};
