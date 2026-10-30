// Logistics and courier services: e-commerce merchants, commercial SMEs and wholesale distributors.
// All carrier, shipper, lane and individual names are fictional.

import assistant from './logistics.assistant.js';
import companion from './logistics.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'logistics',
  name: 'Logistics and courier services',
  tagline: 'E-commerce sellers, SMEs and distributors',
  icon: 'route',
  accent: '#991B1B',
  vocab: {
    account: 'shipper', accounts: 'shippers',
    contact: 'dispatcher', contacts: 'dispatchers',
    rep: 'commercial logistics executive', reps: 'commercial logistics executives',
    manager: 'regional freight director', kam: 'strategic logistics director',
    offering: 'service lane', offerings: 'service lanes',
    order: 'booking', orders: 'bookings',
    visit: 'shipping consultation', visits: 'shipping consultations',
  },
  personas: {
    rep: 'Commercial logistics executive',
    manager: 'Regional freight director',
    admin: 'Commercial operations lead',
  },
  segments: [
    {
      id: 'ecommerce', name: 'E-commerce and online merchants', share: 0.4, visitMinutes: [20, 35],
      style: 'Afternoon fulfillment consultation at the packing depot, reviewing daily parcel manifest volumes, return rates and late cutoff pickups.',
      annualValue: [28000, 135000], hours: [8 * 60, 18 * 60], orderQty: [5, 26],
      types: [
        { type: 'E-commerce merchant', naming: 'business', words: { en: ['Fulfillment Hub', 'Direct Goods', 'Online Logistics'], pt: ['Comércio Digital', 'Operador Virtual'], es: ['Comercio Digital', 'Logística En Línea'], de: ['Versandhandel', 'E-Commerce Hub'], id: ['Pusat Daring', 'Perniagaan Digital'], fr: ['Vente Numérique', 'Pôle E-Commerce'] } },
      ],
      roles: ['Fulfillment director', 'E-commerce manager', 'Shipping supervisor'],
    },
    {
      id: 'smes', name: 'Commercial SMEs and traders', share: 0.35, visitMinutes: [15, 30],
      style: 'Practical consultation with the business owner or shipping clerk, auditing weekly carton volume, dimension scanning accuracy and scheduled collection windows.',
      annualValue: [16000, 72000], hours: [8 * 60, 17 * 60], orderQty: [3, 16],
      types: [
        { type: 'Commercial enterprise', naming: 'business', words: { en: ['Commercial Goods', 'Trading Enterprise', 'Business Supplies'], pt: ['Comércio Geral', 'Distribuidora Comercial'], es: ['Comercializadora', 'Empresas Unidas'], de: ['Handelshaus', 'Warenvertrieb'], id: ['Usaha Dagang', 'Niaga Bersama'], fr: ['Négoce Commercial', 'Comptoir d’Échanges'] } },
      ],
      roles: ['Business owner', 'Dispatch supervisor', 'Logistics coordinator'],
    },
    {
      id: 'distributors', name: 'Regional wholesale distributors', share: 0.25, key: true, visitMinutes: [35, 55],
      style: 'Strategic freight and pallet network review at the cross-dock terminal, coordinating scheduled line-haul departures, freight claims trends and pallet pricing agreements.',
      annualValue: [75000, 340000], hours: [7 * 60, 16 * 60], orderQty: [8, 38],
      types: [
        { type: 'Wholesale distributor', naming: 'institution', words: { en: ['Freight Terminal', 'Cross-Dock Depot', 'Distribution Hub'], pt: ['Terminal de Cargas', 'Entreposto Logístico'], es: ['Terminal de Carga', 'Centro de Consolidación'], de: ['Frachtzentrum', 'Umschlagslager'], id: ['Terminal Kargo', 'Depot Distribusi'], fr: ['Plateforme Fret', 'Pôle de Transit'] } },
      ],
      roles: ['Supply chain director', 'Depot operations lead', 'Freight procurement manager'],
    },
  ],
  offerings: [
    { id: 'nextdayexp', name: 'Velocity Overnight Parcel Express', category: 'Express', price: 24, unit: 'shipment', status: 'core' },
    { id: 'groundstd', name: 'Roadlink Regional Ground Transit', category: 'Ground', price: 14, unit: 'shipment', status: 'core' },
    { id: 'palletltl', name: 'Transpallet Less-Than-Truckload Freight', category: 'Pallet Freight', price: 210, unit: 'pallet', status: 'core' },
    { id: 'ecomreturns', name: 'Swiftreturn Reverse Logistics Portal', category: 'Returns', price: 9, unit: 'shipment', status: 'core' },
    { id: 'tempcontrol', name: 'Thermotrack Cold Chain Courier', category: 'Specialty', price: 42, unit: 'shipment', status: 'focus' },
    { id: 'samedaymetro', name: 'Cityflyer Same-Day Metro Courier', category: 'Express', price: 36, unit: 'shipment', status: 'focus' },
    { id: 'crossborder', name: 'Continental Cross-Border Freight Lane', category: 'Cross-Border', price: 165, unit: 'shipment', status: 'focus' },
    { id: 'bulklinehaul', name: 'Dedicated Line-Haul Trailer Service', category: 'Truckload', price: 950, unit: 'trailer', status: 'new' },
    { id: 'greendelivery', name: 'Ecozero Carbon-Neutral Ground Transit', category: 'Ground', price: 17, unit: 'shipment', status: 'new' },
  ],
  actions: [
    {
      id: 'latepickup', type: 'Optimize evening collection cutoff', agent: 'gap', effort: 10, evidence: 'note', value: [140, 720], uses: 'core',
      title: 'Extend evening dispatch pickup window for {product}',
      saw: 'The packing warehouse misses the 16:30 carrier sweep on {n} of the last ten business days.',
      compared: 'Peer e-commerce merchant shipping schedules across the {city} industrial logistics corridor.',
      why: [
        'A later collection window allows same-day processing of afternoon web orders.',
        'Eliminating overnight warehouse dwell directly reduces buyer delivery transit times.',
        'Consistent collection reliability protects standing parcel account commitments.',
      ],
      talk: [
        'Examine warehouse picking throughput rhythms with {person} to map packing completion curves.',
        'Propose an adjusted 18:00 trailer dispatch sweep synchronized with evening driver routes.',
      ],
    },
    {
      id: 'dimweightgap', type: 'Conduct dimensional weight audit', agent: 'gap', effort: 12, evidence: 'photo', value: [120, 600], uses: 'core',
      title: 'Audit carton dimension weight measurements on {product}',
      saw: 'Carrier automated cubing scans recorded dimensional weight adjustments on {pct} percent of outbound cartons.',
      compared: 'Standard shipping packaging guidelines ensuring optimal box sizing and cube utilization.',
      why: [
        'Volumetric weight surcharges inflate invoice totals and generate billing disputes.',
        'Matching product dimensions to standardized box sizes lowers dimensional weight penalties.',
        'Photographing calibrated tape scans provides objective proof during billing reconciliations.',
      ],
      talk: [
        'Measure sample outbound cartons alongside {person} using the calibrated dimension ruler.',
        'Demonstrate right-sized carton alternatives that avoid dimensional pricing bracket jumps.',
      ],
      guardrail: 'Freight classification and dimensional weight audits adhere to certified national carrier tariffs without arbitrary waivers.',
    },
    {
      id: 'ratecardhand', type: 'Deliver filed rate card documentation', agent: 'gap', effort: 8, evidence: 'signature', value: [70, 340], uses: 'focus',
      title: 'Provide approved carrier rate card schedule for {product}',
      saw: 'The shipper inquired regarding pallet freight tiers without holding the current filed rate schedule.',
      compared: 'Commercial accounts holding published rate agreements that experience zero rating adjustments.',
      why: [
        'Shippers require official rate schedules to allocate shipping costs accurately across product margins.',
        'Signed rate card receipts confirm commercial acceptance of published fuel surcharge index mechanisms.',
        'Clear documentation prevents unapproved rate promises from entering freight billing systems.',
      ],
      talk: [
        'Deliver the approved printed tariff schedule directly to {person}.',
        'Review the fuel surcharge index and accessorial fee definitions clearly.',
        'Obtain a signature acknowledging receipt of the published rate schedule.',
      ],
      guardrail: 'Transportation rates come strictly from the filed rate card. Executives never promise definite delivery times or guarantee claim outcomes.',
    },
    {
      id: 'peakmanifest', type: 'Establish seasonal shipping capacity plan', agent: 'order', effort: 15, evidence: 'note', value: [280, 1400], uses: 'core', segments: ['ecommerce', 'distributors'],
      title: 'Establish peak parcel manifest capacity for {event}',
      saw: 'E-commerce promotional schedules project parcel volume surges around {event}, {eventDays} days away.',
      compared: 'Historical outbound manifest data recorded for this shipper during prior seasonal peaks (sample data).',
      why: [
        'Reserving hub sortation capacity avoids parcel metering delays during holiday spikes.',
        'Advance trailer staging ensures sufficient empty equipment at the shipper dock.',
        'Accurate forecasting helps the depot schedule feeder line-haul drivers efficiently.',
      ],
      talk: [
        'Review promotional sales projections with {person} to map daily parcel volume tiers.',
        'Confirm dock door staging allocations and empty pallet replenishment schedules.',
      ],
    },
    {
      id: 'returnportal', type: 'Streamline customer returns logistics', agent: 'order', effort: 12, evidence: 'note', value: [160, 820], uses: 'core', segments: ['ecommerce'],
      title: 'Integrate automated returns management workflow',
      saw: 'Inbound customer returns increased to {pct} percent of gross volume following recent product promotions.',
      compared: 'Standard omnichannel retail benchmarks utilizing scan-based return shipping portals.',
      why: [
        'Frictionless returns build customer purchasing confidence and drive repeat web orders.',
        'Consolidated return freight reduces per-item processing costs compared to fragmented post.',
        'Automated return tracking speeds item restocking and customer refund processing.',
      ],
      talk: [
        'Demonstrate the customer self-service QR code return portal to {person}.',
        'Establish scheduled return consolidation pallet returns from the regional central hub.',
      ],
    },
    {
      id: 'palletbooking', type: 'Coordinate scheduled LTL pallet pickups', agent: 'order', effort: 14, evidence: 'note', value: [220, 1100], uses: 'core', segments: ['distributors', 'smes'],
      title: 'Schedule dedicated LTL pallet collection on {product}',
      saw: 'Dock staging floor space is congested with {n} outbound pallets awaiting line-haul freight transfer.',
      compared: 'Standard cross-dock operations maintaining empty dock floor staging guidelines.',
      why: [
        'Prompt pallet dispatch frees valuable packing floor space for ongoing warehouse fulfillment.',
        'Scheduled recurring collections prevent last-minute freight broker rate premiums.',
        'Direct depot line-haul loading reduces multiple cross-dock handling touches.',
      ],
      talk: [
        'Review pallet destinations with {person} to group shipments by delivery freight terminal.',
        'Agree on scheduled daily tractor-trailer arrival windows.',
      ],
    },
    {
      id: 'docksched', type: 'Harmonize consultation around sortation cycles', agent: 'planner', effort: 4, evidence: 'note', value: [30, 130], uses: 'none',
      title: 'Coordinate consultation timing between dock sortation windows',
      saw: 'Prior consultations arrived during intense early-morning parcel unloading and sorting shifts.',
      compared: 'Fulfillment center operating hours indicating calm administrative review windows in early afternoon.',
      why: [
        'Meeting logistics dispatchers during quiet intervals enables thorough operational discussions.',
        'Avoiding busy forklift loading hours respects warehouse safety protocols.',
        'Optimized route sequencing allows multiple freight consultations across the logistics zone.',
      ],
      talk: [
        'Confirm preferred afternoon meeting times with the dock operations supervisor.',
        'Update route guidance notes to coordinate arrival after morning dispatch clears.',
      ],
    },
    {
      id: 'claimaudit', type: 'Review freight claim incident ledger', agent: 'gap', effort: 14, evidence: 'note', value: [150, 750], uses: 'none',
      title: 'Review freight damage and loss exception ledger',
      saw: 'The shipper logged {n} damage inquiries across recent pallet transfers without inspection reports.',
      compared: 'National freight claim procedures requiring prompt carton inspection photos and packaging audits.',
      why: [
        'Reviewing packaging integrity resolves repeat freight handling damage at the source.',
        'Documenting proper pallet stretch-wrapping and corner boarding prevents intransit shifting.',
        'Transparent claims tracking improves carrier relationship trust and operational feedback.',
      ],
      talk: [
        'Inspect damaged carton packing methods alongside {person} on the warehouse floor.',
        'Provide packaging guideline diagrams to improve pallet stability and carton strength.',
      ],
      guardrail: 'Damage reviews inspect packaging techniques. Representatives never adjudicate claims or promise reimbursement amounts.',
    },
  ],
  orderReasons: {
    core: ['Reflects projected seasonal outbound e-commerce parcel volume.', 'Maintains scheduled pallet freight dispatch for cross-dock warehouse replenishment.', 'Secures dedicated trailer capacity ahead of peak promotional shipping events.'],
    focus: ['Expands refrigerated courier transit for temperature-sensitive fulfillment.', 'Enables same-day metropolitan delivery for high-priority local orders.'],
    new: ['Trial booking for dedicated regional line-haul freight transport.', 'Pilot allocation of carbon-neutral ground transit for sustainable brands.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 15000, route: 'manager', text: '{Orders} exceeding {limit} require {manager} verification and rate sign-off.' },
    { kind: 'info', text: 'Shipping tariffs adhere to approved carrier rate cards. Executives cannot alter filed freight tariff rates.' },
  ],
  overrideReasons: [
    { label: 'Dispatch supervisor occupied with emergency outbound trailer load', route: 'manager' },
    { label: 'Shipper holds exclusive regional transportation contract with competitor', route: 'kam' },
    { label: 'Hazardous material cargo requires specialized certified carrier permit', route: 'manager' },
    { label: 'Carrier terminal dock equipment currently at full sorting capacity', route: 'manager' },
    { label: 'Insufficient consultation time during afternoon shipping cutoff', route: 'manager' },
    { label: 'Other logistics or operational reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Shipper declined transportation lane booking', blocked: false },
    { label: 'Trailer equipment temporarily unavailable at regional depot', blocked: true },
    { label: 'Shipper corporate credit account past due or administratively blocked', blocked: true, route: 'kam' },
    { label: 'Warehouse dock doors blocked by severe weather delivery delay', blocked: false },
  ],
  visitNotes: [
    'Shipping consultation completed; audited evening parcel cutoff and agreed on trailer dispatch sweep.',
    'Carton cubing audit conducted; demonstrated right-sized boxes to reduce dimensional weight penalties.',
    'Approved carrier rate card delivered with signed receipt from fulfillment director.',
    'Peak shipping manifest projections reviewed and reserved for upcoming promotional campaign.',
    'Freight packaging review completed; recommended corner-board reinforcement for pallet shipments.',
  ],
  kpis: [
    { id: 'ontimepickup', label: 'On-time collection performance', format: 'pct', range: [80, 100], target: 98 },
    { id: 'manifestvol', label: 'Weekly parcel manifest volume', format: 'count', range: [20, 120], target: 70 },
    { id: 'dimaccuracy', label: 'Dimensional declaration accuracy', format: 'pct', range: [75, 99], target: 95 },
    { id: 'returnrate', label: 'Reverse logistics processing speed', format: 'pct', range: [70, 98], target: 90, segments: ['ecommerce'] },
    { id: 'palletdwell', label: 'Dock pallet clearance index', format: 'pct', range: [65, 95], target: 88, segments: ['distributors'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Transportation rates come strictly from the filed rate card. Executives never promise definite delivery times or guarantee claim outcomes.' },
    { id: 'gap1', agent: 'gap', text: 'Freight classification and dimensional weight audits adhere to certified national carrier tariffs without arbitrary waivers.' },
    { id: 'order1', agent: 'order', text: 'Manifest booking projections derive from verified daily package counts and vehicle payload capacity limits.' },
    { id: 'planner1', agent: 'planner', text: 'Contract wholesale freight agreements with regional distributors require consultation with the strategic logistics director before schedule changes.' },
  ],
  problems: [
    { title: 'Logistics representatives call on small retailers while major e-commerce fulfillment hubs are unvisited', text: 'Territory sales executives make routine calls on corner shops while massive e-commerce fulfillment operations generating thousands of daily parcels receive sporadic attention.', capability: 'potential' },
    { title: 'Carton dimension charges surprise shippers on freight invoices', text: 'Shippers discover volumetric cubing surcharges only when monthly invoices arrive, sparking friction and threats to divert parcel volume to competitors.', capability: 'gaps' },
    { title: 'Consultations arrive during chaotic morning inbound cross-dock freight sorting', text: 'Representatives walk into shipping hubs while forklifts race to unload trailers, leading to quick dismissals by preoccupied dispatch managers.', capability: 'ranking' },
    { title: 'Pickup schedules fail to coordinate with fulfillment packing throughput rhythms', text: 'Fixed driver sweeps arrive before afternoon e-commerce orders are boxed, stranding hundreds of cartons until the next day.', capability: 'planning' },
    { title: 'Trailer bookings rely on guesswork rather than order manifest projections', text: 'Dispatch managers book extra line-haul trailers by instinct, leaving equipment half-empty on slow days and leaving freight behind during promotions.', capability: 'order' },
    { title: 'Pickup window commitments and tariff agreements leave no operational record', text: 'Adjusted pickup agreements, freight rate exceptions and pallet packaging advice stay on scratch pads, disappearing when dispatch staff changes.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this shipper prioritized first on today itinerary?', a: 'It generates significant outbound parcel volume and exhibits high dimensional weight billing adjustments that need packaging review.' },
    { q: 'Which shippers need an evening pickup cutoff extension?', a: 'E-commerce warehouses with high afternoon order volumes that miss early carrier sweeps should be evaluated for an extended trailer dispatch window.' },
    { q: 'Can I promise a shipper that a package will arrive tomorrow by noon?', a: 'No. Representatives cannot promise definite delivery arrival hours. Service lane transit expectations adhere strictly to published carrier transit schedules.' },
    { q: 'How does carton dimension optimization reduce transportation invoices?', a: 'Selecting appropriate box sizes eliminates excess air volume, preventing cubic weight surcharge jumps and optimizing trailer cargo density.' },
    { q: 'How are suggested trailer booking volumes calculated?', a: 'Projections derive from historical manifest data, daily packing throughput curves, and verified pallet floor capacity.' },
    { q: 'Where does a shipper consultation override route?', a: 'It routes directly to your regional freight director with your logged operational notes to refine regional trailer dispatch planning.' },
    { q: 'Which regional distributors require a strategic freight agreement review?', a: 'Review cross-dock wholesale distributors with high pallet freight volume. The Visit Planner schedules joint calls with the strategic logistics director.' },
    { q: 'What indicates low confidence on a shipping recommendation?', a: 'Low confidence indicates irregular manifest history or unverified parcel weight data, advising the executive to inspect dock staging areas before confirming orders.' },
  ],
  storyline: [
    'Select Logistics and courier services and choose the target country. Remind participants that all shipping figures and corporate names represent sample demonstration data.',
    'Today screen: review the commercial logistics executive daily itinerary, prioritized by freight volume and transportation industry vocabulary.',
    'Open the premier shipper consultation brief. Approve the evening pickup optimization. Override the pallet freight action with documented reason code.',
    'Examine an action card: inspect the operational context, talking points, and the strict guardrail prohibiting transit time promises.',
    'Booking builder: adjust line-haul trailer allocations and observe the regional freight director approval threshold trigger.',
    'Conclude the shipping consultation. Switch to the regional freight director persona to inspect the logged exception queue and reason notes.',
    'Agent controls view: pause the Order agent to demonstrate how automated freight bookings pause without interrupting scheduled consultations.',
    'Configuration view: display how transportation segments, freight KPIs, and rate guardrails adjust dynamically as modular settings.',
  ],
  forbidden: ['patient bedside', 'veterinary', 'livestock', 'crop harvest', 'brokerage policy', 'auto warranty', 'mortgage loan', 'clinic ward'],
};
