// Animal health: veterinary practices, livestock producers and specialty pet retail.
// All therapeutic, brand, facility and personal names are fictional.

import assistant from './animalhealth.assistant.js';
import companion from './animalhealth.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'animalhealth',
  name: 'Animal health',
  tagline: 'Vet clinics, livestock farms and pet stores',
  icon: 'pulse',
  accent: '#166534',
  vocab: {
    account: 'practice', accounts: 'practices',
    contact: 'practitioner', contacts: 'practitioners',
    rep: 'territory account specialist', reps: 'territory account specialists',
    manager: 'district veterinary director', kam: 'strategic livestock manager',
    offering: 'health product', offerings: 'health products',
    order: 'order', orders: 'orders',
    visit: 'clinical consultation', visits: 'clinical consultations',
  },
  personas: {
    rep: 'Territory account specialist',
    manager: 'District veterinary director',
    admin: 'Veterinary operations lead',
  },
  segments: [
    {
      id: 'clinics', name: 'Veterinary clinics and hospitals', share: 0.45, visitMinutes: [20, 35],
      style: 'Consultative meeting between surgical blocks, reviewing preventive vaccines, diagnostic tests and parasiticide compliance.',
      annualValue: [22000, 95000], hours: [8 * 60, 18 * 60], orderQty: [3, 16],
      types: [
        { type: 'Veterinary clinic', naming: 'business', words: { en: ['Veterinary Clinic', 'Animal Hospital', 'Vet Care'], pt: ['Clínica Veterinária', 'Hospital Veterinário'], es: ['Clínica Veterinaria', 'Hospital Veterinario'], de: ['Tierklinik', 'Tierarztpraxis'], id: ['Klinik Hewan', 'Praktik Dokter Hewan'], fr: ['Clinique Vétérinaire', 'Pôle Vétérinaire'] } },
      ],
      roles: ['Veterinary surgeon', 'Practice manager', 'Lead vet nurse'],
    },
    {
      id: 'farms', name: 'Livestock and dairy operations', share: 0.3, key: true, visitMinutes: [35, 55],
      style: 'On-farm consultation scheduled around herd feeding routines, evaluating herd immunization schedules and biosecurity sanitation.',
      annualValue: [45000, 210000], hours: [6 * 60, 16 * 60], orderQty: [6, 28],
      types: [
        { type: 'Livestock operation', naming: 'institution', words: { en: ['Pastures Farm', 'Livestock Ranch', 'Dairy Holdings'], pt: ['Fazenda Agropecuária', 'Pecuária'], es: ['Hacienda Ganadera', 'Finca Pecuaria'], de: ['Agrarbetrieb', 'Milchhof'], id: ['Peternakan Sapi', 'Usaha Ternak'], fr: ['Élevage Pastoral', 'Exploitation Bovine'] } },
      ],
      roles: ['Herd manager', 'Farm superintendent', 'Operations director'],
    },
    {
      id: 'petretail', name: 'Pet specialty retailers', share: 0.25, visitMinutes: [15, 30],
      style: 'Merchandising and replenishment call at the retail sales counter, checking shelf facings for over-the-counter wellness lines.',
      annualValue: [14000, 58000], hours: [9 * 60, 19 * 60], orderQty: [4, 20],
      types: [
        { type: 'Pet retail store', naming: 'family', words: { en: ['Pet Supplies', 'Animal Nutrition', 'Pet Depot'], pt: ['Pet Shop', 'Casa de Ração'], es: ['Tienda de Mascotas', 'Nutrición Animal'], de: ['Tierfachmarkt', 'Zoobedarf'], id: ['Toko Hewan', 'Pakan Ternak'], fr: ['Animalerie', 'Alimentation Animale'] } },
      ],
      roles: ['Store owner', 'Retail buyer', 'Floor supervisor'],
    },
  ],
  offerings: [
    { id: 'bovivax', name: 'Bovishield Respiratory Vaccine 50 Dose', category: 'Biologicals', price: 145, unit: 'vial', status: 'core', kind: 'rx' },
    { id: 'caninedeworm', name: 'Caniplus Multi-Spectrum Dewormer 20 Tab', category: 'Parasiticides', price: 38, unit: 'box', status: 'core' },
    { id: 'mastiseal', name: 'Lactafence Teat Barrier Dip 20 l', category: 'Hygiene', price: 82, unit: 'drum', status: 'core' },
    { id: 'fleaovipet', name: 'Vectoguard Topical Flea Spot-On 6 Dose', category: 'Parasiticides', price: 46, unit: 'pack', status: 'core' },
    { id: 'rumenpro', name: 'Fermaflor Rumen Buffer Premix 25 kg', category: 'Nutrition', price: 64, unit: 'bag', status: 'focus' },
    { id: 'equiflex', name: 'Equiarthro Joint Support Paste 100 ml', category: 'Specialty', price: 52, unit: 'syringe', status: 'focus' },
    { id: 'antiseptwash', name: 'Saniprobe Surgical Antiseptic 5 l', category: 'Clinical Supplies', price: 41, unit: 'jug', status: 'focus' },
    { id: 'avianelect', name: 'Poultryvital Soluble Electrolytes 10 kg', category: 'Nutrition', price: 78, unit: 'drum', status: 'new' },
    { id: 'felineprocalm', name: 'Purrcalm Feline Calming Drops 50 ml', category: 'Wellness', price: 29, unit: 'bottle', status: 'new' },
  ],
  actions: [
    {
      id: 'dewormgap', type: 'Review preventative parasite schedule', agent: 'gap', effort: 12, evidence: 'note', value: [140, 680], uses: 'core',
      title: 'Review seasonal parasite prevention coverage on {product}',
      saw: 'Client reorder intervals for {product} lag historical seasonal tick and flea activity by {weeks} weeks.',
      compared: 'Practice reorder cycles across companion animal clinics in {city} during corresponding seasonal surges.',
      why: [
        'Pet owners seek preventive parasiticide treatment proactively ahead of warmer weather periods.',
        'Ensuring adequate in-clinic stock prevents client defection to online retail dispensaries.',
        'Consistent preventative treatment safeguards companion animal household health.',
      ],
      talk: [
        'Examine seasonal treatment booking calendars with {person} to evaluate expected patient volume.',
        'Propose pre-season clinic display materials focusing on regional vector awareness.',
      ],
    },
    {
      id: 'coldchain', type: 'Audit biological cold chain storage', agent: 'gap', effort: 10, evidence: 'photo', value: [90, 480], uses: 'core',
      title: 'Inspect biological storage cold chain log',
      saw: 'Biological inventory logs indicate missing refrigeration temperature readings over the prior seven days.',
      compared: 'Good clinical storage practices requiring continuous 2 to 8 Celsius monitoring.',
      why: [
        'Biological efficacy depends critically on uninterrupted temperature-controlled storage.',
        'Documented cold storage compliance satisfies statutory veterinary board audit inspections.',
        'Capturing digital log photos protects distributor warranty and product integrity records.',
      ],
      talk: [
        'Review the daily thermometer log with {person} and note any defrost cycles.',
        'Capture a clear photograph of the current digital temperature display reading.',
      ],
      guardrail: 'Biological storage checks monitor temperature maintenance. Specialists never alter manufacturer vaccine storage protocols.',
    },
    {
      id: 'labelhandover', type: 'Provide technical label literature', agent: 'gap', effort: 8, evidence: 'signature', value: [70, 360], uses: 'focus',
      title: 'Deliver registered product label documentation for {product}',
      saw: 'The practice requested technical efficacy data on {product} without current product monographs on file.',
      compared: 'Practices holding registered label inserts that demonstrate elevated clinical protocol adoption.',
      why: [
        'Veterinarians require authorized package documentation prior to dispensing novel therapeutics.',
        'Signed distribution receipts verify that statutory label guidelines were delivered in person.',
        'Precise withdrawal time documentation protects commercial dairy and meat residue compliance.',
      ],
      talk: [
        'Hand the official product technical insert directly to {person}.',
        'Highlight statutory meat and milk withdrawal periods stated explicitly on the registered label.',
        'Obtain a signature confirming receipt of the technical package insert.',
      ],
      guardrail: 'No dosage, diagnosis, or clinical efficacy claims. Product advice strictly follows the approved registered package label.',
    },
    {
      id: 'rxdelivery', type: 'Verify licensed prescription authorization', agent: 'order', effort: 12, evidence: 'signature', value: [190, 920], uses: 'rx',
      title: 'Obtain veterinary prescription authorization for {product}',
      saw: 'Pending prescription order requires verified veterinary practitioner registration validation.',
      compared: 'Statutory wholesale distribution requirements for prescription-only veterinary biologicals.',
      why: [
        'Restricted veterinary therapeutics require authorized veterinary surgeon prescription oversight.',
        'Digital signature verification maintains tamper-evident audit records for regulatory oversight.',
        'Strict dispensing compliance prevents unlicensed pharmaceutical diversion.',
      ],
      talk: [
        'Verify the active clinical license number with {person}.',
        'Collect the veterinarian digital authorization signature prior to confirming wholesale release.',
      ],
      guardrail: 'Prescription therapeutics release exclusively under verified veterinary authorization. Specialists never dispense without a valid license on file.',
    },
    {
      id: 'precalvingorder', type: 'Coordinate seasonal herd replenishment', agent: 'order', effort: 14, evidence: 'note', value: [260, 1300], uses: 'core', segments: ['farms'],
      title: 'Coordinate preventative herd health replenishment for {event}',
      saw: 'Calving and breeding schedules indicate peak herd treatment requirements around {event}, {eventDays} days away.',
      compared: 'Historical treatment replenishment volumes recorded during previous seasonal management cycles.',
      why: [
        'Timely immunization prior to calving transfers essential maternal antibodies to newborn calves.',
        'Securing adequate bulk volumes prevents costly emergency treatment shipments during weather events.',
        'Structured replenishment allows the farm manager to plan operational crew labor efficiently.',
      ],
      talk: [
        'Review upcoming head counts and breeding schedules with {person}.',
        'Agree on scheduled delivery drops synchronized with farm chute handling dates.',
      ],
    },
    {
      id: 'shelfmerch', type: 'Audit retail product merchandising', agent: 'order', effort: 10, evidence: 'photo', value: [80, 420], uses: 'core', segments: ['petretail'],
      title: 'Optimize retail wellness display for {product}',
      saw: 'Counter displays for over-the-counter wellness lines show missing facings and depleted stock.',
      compared: 'Standard retail placement guidelines featuring eye-level educational point-of-sale displays.',
      why: [
        'Pet parents make spontaneous wellness purchases when informative signage is visible at checkout.',
        'Restocking depleted display trays directly drives front-of-store retail sales velocity.',
        'Visual photographic verification confirms compliant placement of promotional header cards.',
      ],
      talk: [
        'Restock depleted merchandise shelves with {person} using backroom inventory.',
        'Photograph the refreshed retail display for cooperative merchandising verification.',
      ],
    },
    {
      id: 'clinicsched', type: 'Harmonize consultation appointment window', agent: 'planner', effort: 4, evidence: 'note', value: [30, 140], uses: 'none',
      title: 'Coordinate consultation timing between surgical hours',
      saw: 'Recent consultations landed during peak morning pet intake and triage hours.',
      compared: 'Practice operating schedules indicating quiet consultation windows between midday surgeries.',
      why: [
        'Engaging veterinarians during quiet intervals ensures thoughtful technical discussions.',
        'Minimizing clinic floor disruption builds lasting practitioner goodwill and collaboration.',
        'Optimized route sequencing allows multiple clinic visits without unnecessary idling.',
      ],
      talk: [
        'Confirm preferred consultation windows with the practice receptionist or manager.',
        'Set field calendar reminders matching the veterinary clinic surgical block rotation.',
      ],
    },
    {
      id: 'milkinghygiene', type: 'Evaluate herd milking hygiene protocol', agent: 'gap', effort: 15, evidence: 'note', value: [160, 800], uses: 'focus', segments: ['farms'],
      title: 'Review parlor sanitation and teat conditioning routine',
      saw: 'Bulk tank somatic cell count trends reflect seasonal elevation across recent testing cycles.',
      compared: 'Herd health benchmark standards established for regional dairy quality programs.',
      why: [
        'Consistent barrier teat dips reduce environmental pathogen colonization post-milking.',
        'Improving milk quality metrics directly preserves dairy cooperative volume premiums.',
        'Evaluating parlor application technique identifies dilution or equipment coverage errors.',
      ],
      talk: [
        'Observe parlor application routines alongside {person} during morning milking shifts.',
        'Verify that dip cups and spray nozzles deliver thorough teat coverage.',
      ],
      guardrail: 'Hygiene recommendations address proper application of approved barrier products. Specialists never diagnose mastitis pathogens.',
    },
  ],
  orderReasons: {
    core: ['Supports anticipated seasonal herd preventative protocol needs.', 'Replenishes clinic dispensary stock based on historic monthly procedure counts.', 'Restocks retail counter display to meet seasonal pet wellness traffic.'],
    focus: ['Introduces specialized nutritional support for intensive production livestock.', 'Implements upgraded parlor sanitation to support milk quality benchmarks.'],
    new: ['Introductory stocking order for newly approved companion animal wellness item.', 'Trial quantity for poultry production flock electrolyte supplementation.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 5000, route: 'manager', text: '{Orders} exceeding {limit} require {manager} review and confirmation.' },
    { kind: 'prerequisite', appliesTo: 'rx', action: 'rxdelivery', evidence: 'signature', text: 'Prescription therapeutics require verified licensed practitioner authorization before order confirmation.' },
    { kind: 'info', text: 'Veterinary pharmaceuticals adhere to statutory wholesale pricing schedules. Field representatives cannot modify approved price tiers.' },
  ],
  overrideReasons: [
    { label: 'Veterinarian engaged in emergency surgery', route: 'manager' },
    { label: 'Practice currently stocked through veterinary buying group agreement', route: 'kam' },
    { label: 'Farm herd health protocol determined by consulting private veterinarian', route: 'manager' },
    { label: 'Veterinary prescription license documentation pending state renewal', route: 'manager' },
    { label: 'Insufficient consultation time during clinic midday window', route: 'manager' },
    { label: 'Other clinical or operational reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Practitioner declined therapeutic line', blocked: false },
    { label: 'Biological product temporarily backordered at central depot', blocked: true },
    { label: 'Veterinary license expired or verification unavailable', blocked: true, route: 'kam' },
    { label: 'Clinic staff overwhelmed with critical trauma admissions', blocked: false },
  ],
  visitNotes: [
    'Clinical consultation completed; reviewed seasonal immunization protocol with the lead veterinarian.',
    'Cold chain storage inspection conducted; refrigerator log photographed for compliance.',
    'Technical package insert delivered with signed receipt from practice manager.',
    'Prescription authorization verified and signed for scheduled pharmaceutical shipment.',
    'Parlor sanitation review completed with herd superintendent; replenished barrier dip supply.',
  ],
  kpis: [
    { id: 'biolcomp', label: 'Biological protocol compliance', format: 'pct', range: [60, 95], target: 85 },
    { id: 'dispensevol', label: 'Monthly clinic dispense volume', format: 'count', range: [10, 60], target: 35 },
    { id: 'coldaudit', label: 'Cold chain compliance rate', format: 'pct', range: [80, 100], target: 98 },
    { id: 'somaticcount', label: 'Bulk milk quality index', format: 'pct', range: [70, 98], target: 90, segments: ['farms'] },
    { id: 'rxverify', label: 'Prescription authorization currency', format: 'pct', range: [85, 100], target: 100 },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'No dosage, diagnosis, or clinical efficacy claims. Prescription items distribute only through licensed veterinarians. Advice strictly follows the registered product label.' },
    { id: 'gap1', agent: 'gap', text: 'Diagnostic testing protocols reference published manufacturer package inserts without off-label application.' },
    { id: 'order1', agent: 'order', text: 'Dispensing volumes align with verified animal patient headcounts and standard treatment durations.' },
    { id: 'planner1', agent: 'planner', text: 'Commercial dairy or livestock operations on annual preventive programs require consultation with the strategic livestock manager before schedule alterations.' },
  ],
  problems: [
    { title: 'Field visits target convenient small clinics while major livestock accounts are neglected', text: 'Territory representatives spend hours visiting neighborhood pet clinics while large-scale dairy and livestock enterprises with massive preventative health budgets receive sporadic attention.', capability: 'potential' },
    { title: 'Biological cold chain vulnerabilities are detected only after product arrives spoiled', text: 'Vaccine storage temperature dips are discovered after inventory degrades, leading to compromised herd immunity and contentious distributor returns.', capability: 'gaps' },
    { title: 'Clinic calls happen during hectic morning patient check-in hours', text: 'Representatives arrive while veterinarians perform emergency surgeries and staff manage frantic pet check-ins, causing abrupt dismissals and wasted visits.', capability: 'ranking' },
    { title: 'Farm visits ignore breeding and calving seasonal management calendars', text: 'Sales itineraries operate on fixed monthly rotations, arriving weeks after preventative vaccination windows have closed on commercial herds.', capability: 'planning' },
    { title: 'Inventory replenishment guesses at herd treatment requirements', text: 'Dispensary orders repeat past quantities without accounting for seasonal vector spikes, herd expansion or changing animal patient census figures.', capability: 'order' },
    { title: 'Prescription authorizations and technical disclosures lack verifiable compliance trails', text: 'Veterinary prescription authorizations and required technical withdrawal instructions remain undocumented, risking regulatory sanctions during state pharmacy board audits.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this veterinary practice prioritized first today?', a: 'It has high therapeutic dispensing volume and holds open prescription orders awaiting practitioner license verification.' },
    { q: 'Which practices require seasonal parasite protocol reviews?', a: 'Practices whose parasite prevention reorder dates lag seasonal temperature rises should be presented with regional vector risk data.' },
    { q: 'What information can I provide regarding off-label use?', a: 'None. All product discussions strictly adhere to registered label indications and withdrawal periods. Off-label inquiries are directed to veterinary medical affairs.' },
    { q: 'Can an automated recommendation prescribe an antibiotic dose?', a: 'No. Clinical diagnosis, therapeutic selection, and dosage determinations remain the sole legal responsibility of licensed veterinarians.' },
    { q: 'How are biological order quantities calculated?', a: 'Quantities derive from documented animal patient populations, standard label dose regimens, and local clinic storage capacity.' },
    { q: 'Where does an override reason route for review?', a: 'It submits directly to your district veterinary director with your recorded notes to improve clinical demand modeling.' },
    { q: 'Which commercial livestock herds are due an annual biosecurity review?', a: 'Check production farm accounts with extended gaps since their last on-farm visit. The Visit Planner integrates them into upcoming rural routes.' },
    { q: 'What does a low confidence indicator signify on an action item?', a: 'It reflects limited recent animal census or purchasing history, advising the specialist to confirm herd numbers with the practitioner before finalizing order suggestions.' },
  ],
  storyline: [
    'Select Animal health and the target country. Remind participants that all clinical records and numbers represent fictional demonstration data.',
    'Today view: explore the territory account specialist clinical agenda, prioritized by therapeutic demand and local animal health vocabulary.',
    'Open the initial clinical consultation brief. Approve the biological cold chain inspection. Override the retail merchandising task with reason code.',
    'Review an action card: inspect the rationale, talking points, and the clear guardrail against unauthorized clinical diagnosis.',
    'Order builder: adjust biological vaccine quantities and show how the prescription signature rule gates final submission.',
    'Conclude the clinical consultation. Switch to the district veterinary director persona to inspect the logged exception queue.',
    'Agent controls view: pause the Order agent to show automated dispensary lines held in pending state without disrupting scheduled consultations.',
    'Configuration view: display how veterinary segments, clinical KPIs, and regulatory guardrails adjust dynamically as modular settings.',
  ],
  forbidden: ['human patient', 'hospital bed', 'pediatric', 'mortgage', 'automotive', 'dealer showroom', 'tenant lease'],
};
