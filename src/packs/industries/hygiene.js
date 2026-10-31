// Hygiene and cleaning supplies: hospitality, commercial facilities and cleaning contractors.
// All formulation, manufacturer, facility and individual names are fictional.

import assistant from './hygiene.assistant.js';
import companion from './hygiene.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'hygiene',
  name: 'Hygiene and cleaning supplies',
  tagline: 'Hotels, offices, care homes and contract cleaners',
  icon: 'bulb',
  accent: '#086F83',
  vocab: {
    account: 'facility', accounts: 'facilities',
    contact: 'supervisor', contacts: 'supervisors',
    rep: 'hygiene account specialist', reps: 'hygiene account specialists',
    manager: 'regional hygiene director', kam: 'strategic contractor director',
    offering: 'sanitation product', offerings: 'sanitation products',
    order: 'order', orders: 'orders',
    visit: 'hygiene audit', visits: 'hygiene audits',
  },
  personas: {
    rep: 'Hygiene account specialist',
    manager: 'Regional hygiene director',
    admin: 'Commercial hygiene lead',
  },
  segments: [
    {
      id: 'hospitality', name: 'Hotels and lodging properties', share: 0.35, visitMinutes: [20, 35],
      style: 'Morning inspection with housekeeping leadership, evaluating guestroom amenities, laundry chemical dispensers and public area sanitation.',
      annualValue: [20000, 80000], hours: [8 * 60, 16 * 60], orderQty: [4, 18],
      types: [
        { type: 'Hospitality venue', naming: 'institution', words: { en: ['Suites Resort', 'Boutique Hotel', 'Hospitality Inn'], pt: ['Hotel Resort', 'Pousada'], es: ['Hotel Turístico', 'Resort'], de: ['Residenzhotel', 'Gästehaus'], id: ['Resor Wisata', 'Hotel Bisnis'], fr: ['Résidence Hôtelière', 'Hôtel de Séjour'] } },
      ],
      roles: ['Executive housekeeper', 'Operations director', 'Purchasing manager'],
    },
    {
      id: 'facilities', name: 'Commercial offices and senior care', share: 0.3, visitMinutes: [25, 40],
      style: 'Facilities walk-through reviewing washroom hand care, surface disinfection, dilution dispenser calibration and odor neutralization.',
      annualValue: [25000, 115000], hours: [7 * 60, 17 * 60], orderQty: [5, 22],
      types: [
        { type: 'Senior care facility', naming: 'institution', words: { en: ['Care Manor', 'Senior Living', 'Healthcare Living'], pt: ['Casa de Repouso', 'Lar de Idosos'], es: ['Residencia de Mayores', 'Centro Asistencial'], de: ['Seniorenresidenz', 'Pflegeheim'], id: ['Panti Wreda', 'Griya Lansia'], fr: ['Maison de Repos', 'Pôle d’Accueil'] } },
        { type: 'Commercial building', naming: 'business', words: { en: ['Corporate Tower', 'Business Hub', 'Commerce Park'], pt: ['Edifício Corporativo', 'Centro Empresarial'], es: ['Edificio Corporativo', 'Torre de Negocios'], de: ['Bürokomplex', 'Gewerbepark'], id: ['Gedung Perkantoran', 'Kawasan Niaga'], fr: ['Immeuble Affaires', 'Parc Tertiaire'] } },
      ],
      roles: ['Facilities director', 'Environmental services lead', 'Property manager'],
    },
    {
      id: 'contractors', name: 'Contract cleaning service providers', share: 0.35, key: true, visitMinutes: [30, 50],
      style: 'Contract operational review at the regional operations depot, coordinating bulk drum supply, dilution dispensing equipment and safety training.',
      annualValue: [60000, 260000], hours: [6 * 60, 15 * 60], orderQty: [8, 36],
      types: [
        { type: 'Cleaning contractor', naming: 'business', words: { en: ['Facility Services', 'Cleaning Contractors', 'Janitorial Specialists'], pt: ['Serviços de Limpeza', 'Prestadora Predial'], es: ['Servicios de Limpieza', 'Empresas Integrales'], de: ['Gebäudereinigung', 'Reinigungsservice'], id: ['Jasa Pembersih', 'Solusi Fasilitas'], fr: ['Société de Propreté', 'Services d’Entretien'] } },
      ],
      roles: ['Operations manager', 'Contract supervisor', 'Procurement lead'],
    },
  ],
  offerings: [
    { id: 'multisurf', name: 'Omnishine Multi-Surface Concentrate 5 l', category: 'Surface Care', price: 34, unit: 'jug', status: 'core' },
    { id: 'disinfec4', name: 'Quatracide Neutral Hospital Disinfectant 5 l', category: 'Disinfectants', price: 48, unit: 'jug', status: 'core' },
    { id: 'foamsoap', name: 'Purelather Antimicrobial Foam Wash 6 x 1 l', category: 'Hand Hygiene', price: 42, unit: 'case', status: 'core' },
    { id: 'dishdet', name: 'Progleam Commercial Dish Detergent 20 l', category: 'Warewash', price: 76, unit: 'drum', status: 'core' },
    { id: 'laundrybright', name: 'Optiwash Commercial Laundry Liquid 20 l', category: 'Laundry', price: 88, unit: 'drum', status: 'focus' },
    { id: 'floorstrip', name: 'Powermelt Floor Polish Stripper 10 l', category: 'Floor Care', price: 58, unit: 'pail', status: 'focus' },
    { id: 'odorneut', name: 'Aeropure Odor Counteractant 4 x 1 l', category: 'Air Care', price: 36, unit: 'case', status: 'focus' },
    { id: 'ecodegrease', name: 'Biogreen Plant-Based Kitchen Degreaser 5 l', category: 'Degreasers', price: 44, unit: 'jug', status: 'new' },
    { id: 'dispenserunit', name: 'Smartdose Wall Dilution Station', category: 'Equipment', price: 0, unit: 'unit', status: 'new', kind: 'equipment' },
  ],
  actions: [
    {
      id: 'sdscheck', type: 'Verify chemical safety documentation', agent: 'gap', effort: 8, evidence: 'signature', value: [80, 380], uses: 'core',
      title: 'Inspect station safety data sheet records for {product}',
      saw: 'Housekeeping chemical stations lack updated safety data sheets for currently stocked formulations.',
      compared: 'Occupational safety standards requiring accessible safety sheets at all chemical preparation areas.',
      why: [
        'Accessible safety sheets provide vital first aid and emergency response protocols for staff.',
        'Documenting verified safety binder compliance satisfies statutory occupational health audits.',
        'A signed inspection receipt establishes verifiable chemical training compliance for the property.',
      ],
      talk: [
        'Review the yellow safety binder with {person} to ensure current documentation is present.',
        'Replace worn hazard warning cards and secure a signed verification receipt.',
      ],
      guardrail: 'Chemical safety questions route strictly to the technical desk and the safety data sheet. Specialists never give chemical mixing advice.',
    },
    {
      id: 'diluteaudit', type: 'Calibrate proportioning dispenser equipment', agent: 'gap', effort: 12, evidence: 'photo', value: [110, 520], uses: 'core',
      title: 'Calibrate dilution ratio dispenser on {product}',
      saw: 'Water pressure fluctuations at this facility altered automatic dilution proportioning ratios by {pct} percent.',
      compared: 'Factory calibration specifications ensuring accurate product cleaning efficacy and cost per use.',
      why: [
        'Over-concentrated chemical mixtures leave sticky floor residue and accelerate container depletion.',
        'Under-concentrated solutions fail microbiological sanitization and pathogen kill claims.',
        'Photographing the metering tip calibration confirms equipment compliance.',
      ],
      talk: [
        'Test dilution concentration with {person} using a refractometer test kit.',
        'Install the correct color-coded metering tip and photograph the calibrated display.',
      ],
      guardrail: 'Dispenser dilution equipment maintenance follows calibrated factory ratios without manual chemical tampering.',
    },
    {
      id: 'handwashgap', type: 'Address washroom dispenser replenishment', agent: 'gap', effort: 10, evidence: 'note', value: [90, 440], uses: 'core',
      title: 'Resolve touchless hand soap refill shortages',
      saw: 'Public washroom soap dispensers show empty reservoirs in {n} high-traffic lobby restrooms.',
      compared: 'Restroom inspection standards maintained across leading corporate office facilities in {city}.',
      why: [
        'Empty washroom hand soap reservoirs trigger immediate building tenant complaints.',
        'Standardizing on sealed cartridge refills prevents dirty bulk reservoir contamination.',
        'Restoring regular cartridge inventory stabilizes automated monthly replenishment orders.',
      ],
      talk: [
        'Walk restroom facilities with {person} to count depleted wall dispensers.',
        'Propose an initial top-up cartridge delivery to maintain continuous tenant coverage.',
      ],
    },
    {
      id: 'quarterbulk', type: 'Establish seasonal bulk drum replenishment', agent: 'order', effort: 14, evidence: 'note', value: [240, 1200], uses: 'core', segments: ['contractors'],
      title: 'Plan bulk drum supply delivery for {event}',
      saw: 'Facility contract staffing schedules indicate increased cleaning cycles around {event}, {eventDays} days away.',
      compared: 'Historical bulk chemical consumption patterns recorded across contract accounts during prior quarters (sample data).',
      why: [
        'Advance drum replenishment prevents operational work stoppages across major client job sites.',
        'Coordinated drum deliveries minimize freight charges and reduce forklift dock congestion.',
        'Securing quarterly inventory commitments protects volume tier rebate eligibility.',
      ],
      talk: [
        'Review cleaning job site schedules with {person} to project required drum quantities.',
        'Coordinate dock delivery windows and pallet offloading staging locations.',
      ],
    },
    {
      id: 'laundrytitrate', type: 'Audit commercial laundry wash cycles', agent: 'gap', effort: 15, evidence: 'note', value: [180, 850], uses: 'focus', segments: ['hospitality'],
      title: 'Audit laundry wash formula and linen brightness on {product}',
      saw: 'Linen rewash rates increased over the past month due to water hardness changes.',
      compared: 'Standard hotel laundry wash parameters maintaining linen brightness and tensile strength.',
      why: [
        'Excessive linen rewash drives up water, energy, and labor operating costs.',
        'Correcting chemical injection volumes restores linen brightness and extends sheet lifespan.',
        'Optimizing wash formulas delivers noticeable cleanliness improvements for hotel guests.',
      ],
      talk: [
        'Test wash wheel water hardness and alkalinity with {person} during a live linen cycle.',
        'Calibrate automatic liquid injection pumps to match linen classification formulas.',
      ],
    },
    {
      id: 'equipinstall', type: 'Schedule closed-loop dispenser installation', agent: 'order', effort: 16, evidence: 'signature', value: [150, 750], uses: 'equipment',
      title: 'Schedule closed-loop dilution station installation',
      saw: 'Staff currently mix cleaning chemicals manually from gallon jugs into mop buckets.',
      compared: 'Facility safety standards requiring closed-loop dilution systems to prevent chemical splashes.',
      why: [
        'Closed-loop dispensing eliminates employee chemical contact and splash hazards.',
        'Controlled dilution locks in predictable chemical cost per diluted gallon.',
        'Securing a signed equipment agreement authorizes installation team dispatch.',
      ],
      talk: [
        'Demonstrate the wall-mounted dilution station ergonomics to {person}.',
        'Obtain a signed installation authorization detailing plumbing backflow compliance.',
      ],
    },
    {
      id: 'shiftsched', type: 'Coordinate audit around shift handover', agent: 'planner', effort: 4, evidence: 'note', value: [30, 130], uses: 'none',
      title: 'Align audit schedule with housekeeping shift change',
      saw: 'Previous audits arrived during mid-morning guest checkout and room turnover rushes.',
      compared: 'Property operational schedules indicating calm handover windows in the early afternoon.',
      why: [
        'Conducting audits during shift transitions allows supervisors to participate without distraction.',
        'Addressing housekeeping leads directly ensures immediate operational feedback adoption.',
        'Optimized route timing avoids waiting in service elevator corridors.',
      ],
      talk: [
        'Verify optimal afternoon meeting windows with the executive housekeeper.',
        'Update property access notes to streamline future audit arrivals.',
      ],
    },
    {
      id: 'careclean', type: 'Review healthcare surface disinfection protocol', agent: 'gap', effort: 14, evidence: 'note', value: [160, 780], uses: 'focus', segments: ['facilities'],
      title: 'Audit high-touch surface disinfection procedures on {product}',
      saw: 'Senior living environmental services records indicate variable contact dwell times on high-touch surfaces.',
      compared: 'Healthcare surface disinfection protocols requiring verified ten-minute wet contact dwell times.',
      why: [
        'Strict disinfectant dwell times are necessary to neutralize environmental pathogen transmission.',
        'Consistent sanitization protocols protect vulnerable resident health populations.',
        'Documenting staff protocol alignment satisfies annual public health facility inspections.',
      ],
      talk: [
        'Review disinfectant label contact times and dwell procedures with {person}.',
        'Distribute laminated dwell time reference cards for environmental services carts.',
      ],
      guardrail: 'Surface disinfection guidance follows approved disinfectant label contact times. Specialists never provide clinical medical claims.',
    },
  ],
  orderReasons: {
    core: ['Maintains recommended safety stock based on monthly facility occupied room nights.', 'Replenishes high-traffic washroom hand care cartridges to prevent empty dispensers.', 'Supports planned commercial floor care and surface maintenance cycles.'],
    focus: ['Improves commercial laundry linen brightness and extends textile service life.', 'Addresses senior care disinfection compliance across resident common areas.'],
    new: ['Introductory installation package for automated closed-loop dilution equipment.', 'Trial allocation of plant-based degreaser for commercial kitchen ventilation care.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 3000, route: 'manager', text: '{Orders} exceeding {limit} require {manager} verification and sign-off.' },
    { kind: 'info', text: 'Contract cleaning pricing follows agreed corporate schedules. Specialists cannot alter chemical volume discount tiers.' },
  ],
  overrideReasons: [
    { label: 'Executive housekeeper engaged in emergency property inspection', route: 'manager' },
    { label: 'Chemical supplies currently restricted by national hotel brand mandate', route: 'kam' },
    { label: 'Contract cleaning company awaiting property management contract renewal', route: 'manager' },
    { label: 'Plumbing connection requires building engineering department sign-off', route: 'manager' },
    { label: 'Housekeeping staff unavailable during scheduled audit window', route: 'manager' },
    { label: 'Other operational reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Supervisor declined chemical program change', blocked: false },
    { label: 'Packaging container size temporarily out of stock at depot', blocked: true },
    { label: 'Commercial facility account placed on credit administrative hold', blocked: true, route: 'kam' },
    { label: 'Environmental services crew occupied with water damage cleanup', blocked: false },
  ],
  visitNotes: [
    'Hygiene audit completed; inspected washroom dispenser stations and tested proportioning calibration.',
    'Safety data sheet binder audited; replaced missing technical documentation at main housekeeping depot.',
    'Laundry titration test conducted with laundry manager; adjusted wash formula pumps.',
    'Closed-loop dilution station agreement signed; scheduled plumbing technician installation.',
    'Contract cleaning review completed; confirmed quarterly chemical drum shipment schedule.',
  ],
  kpis: [
    { id: 'dispenseruptime', label: 'Dispenser operational uptime', format: 'pct', range: [75, 100], target: 95 },
    { id: 'sdscompliance', label: 'Safety documentation currency', format: 'pct', range: [80, 100], target: 100 },
    { id: 'costperroom', label: 'Chemical cost control index', format: 'pct', range: [65, 95], target: 85 },
    { id: 'linenquality', label: 'Linen brightness index', format: 'pct', range: [70, 98], target: 92, segments: ['hospitality'] },
    { id: 'drumvolume', label: 'Quarterly chemical drum volume', format: 'count', range: [5, 40], target: 24, segments: ['contractors'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Chemical safety questions route strictly to the technical desk and the safety data sheet. Specialists never provide chemical mixing advice.' },
    { id: 'gap1', agent: 'gap', text: 'Dispenser dilution equipment maintenance follows calibrated factory ratios without manual chemical tampering.' },
    { id: 'order1', agent: 'order', text: 'Automated chemical replenishment matches facility washroom dispenser capacity and verified guestroom turns.' },
    { id: 'planner1', agent: 'planner', text: 'Multi-site contract cleaning service agreements require joint review with the strategic contractor director.' },
  ],
  problems: [
    { title: 'Field visits target low-volume boutique hotels while major cleaning contractors are ignored', text: 'Specialists spend hours visiting individual small properties while commercial cleaning contractors managing dozens of corporate towers receive inadequate technical support.', capability: 'potential' },
    { title: 'Chemical proportioning dispensers drift out of calibration unnoticed', text: 'Dilution pumps pull too much concentrate or under-dilute sanitizers for months, resulting in high chemical bills, floor residue, and failed cleanliness standards.', capability: 'gaps' },
    { title: 'Audits arrive during morning guest checkout room turnover crunches', text: 'Representatives knock on housekeeping doors while teams race to strip beds and clean departures, leading to rushed interactions and missed technical checks.', capability: 'ranking' },
    { title: 'Itineraries operate on calendar intervals ignoring contract cleaning billing milestones', text: 'Visits land arbitrarily throughout the month rather than aligning with contractor supply cutoffs and quarterly deep cleaning project planning.', capability: 'planning' },
    { title: 'Chemical replenishment orders guess at facility consumption rates', text: 'Orders repeat previous purchase quantities without checking actual dispenser levels, leading to backroom clutter of some lines and washroom runouts of others.', capability: 'order' },
    { title: 'Safety data sheet deliveries and equipment agreements leave no audit trail', text: 'Safety binder updates and dispenser loan agreements are recorded informally on paper slips, creating compliance vulnerabilities during safety inspections.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this facility prioritized first on today schedule?', a: 'It registers low dispenser uptime and has an unverified safety data sheet binder that must be addressed during today audit.' },
    { q: 'Which facilities are overdue for dispenser calibration testing?', a: 'Properties showing abnormal chemical reorder volumes or those where dilution equipment has operated over six months without a calibration test.' },
    { q: 'Can I advise a customer on blending chemical products?', a: 'No. Mixing chemical formulations is strictly prohibited. All safety and handling questions route to the technical desk and the official safety data sheet.' },
    { q: 'How does automated proportioning save facility operating costs?', a: 'Closed-loop dispensers ensure exact dilution ratios, preventing product waste, floor streaking, and employee chemical exposure.' },
    { q: 'How are recommended chemical order quantities determined?', a: 'Suggested replenishment derives from active dispenser counts, monthly facility room night census, and historical washroom traffic patterns.' },
    { q: 'Where does an audit override reason submit for review?', a: 'It routes to your regional hygiene director with your recorded notes to calibrate territory equipment maintenance priorities.' },
    { q: 'Which contract cleaning contractors need an executive account review?', a: 'Review contractor accounts operating multiple job sites with pending dilution installations. The Visit Planner arranges joint director calls.' },
    { q: 'What indicates low confidence on an equipment recommendation?', a: 'Low confidence indicates incomplete backroom inventory counts or missing water pressure data, advising the specialist to inspect the janitorial closet before ordering.' },
  ],
  storyline: [
    'Select Hygiene and cleaning supplies and choose the prospect country. State that facility numbers and names represent sample demonstration data.',
    'Today screen: review the hygiene account specialist route, organized by facility operational priority and cleaning industry terminology.',
    'Open the premier facility audit brief. Approve the safety data sheet inspection. Override the floor care action with appropriate explanation.',
    'Examine an action card: inspect the rationale, talking points, and the strict guardrail prohibiting chemical mixing advice.',
    'Order builder: adjust chemical drum quantities and observe the regional director approval threshold trigger.',
    'Complete the facility audit. Switch to the regional hygiene director persona to review the exception queue and logged notes.',
    'Agent controls view: pause the Order agent to demonstrate how automated chemical deliveries hold pending without stopping scheduled audits.',
    'Configuration overview: demonstrate how lodging segments, commercial cleaning KPIs, and safety guardrails adapt cleanly as modular configurations.',
  ],
  forbidden: ['patient bedside', 'veterinary', 'livestock', 'crop harvest', 'brokerage policy', 'auto warranty', 'mortgage loan'],
};

