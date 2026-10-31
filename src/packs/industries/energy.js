// Solar and home energy: installers, electrical wholesalers and home builders.
// All product and company names are fictional.

import assistant from './energy.assistant.js';
import companion from './energy.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'energy',
  name: 'Solar and home energy',
  tagline: 'Installers, electrical wholesalers and home builders',
  icon: 'sun',
  accent: '#A16207',
  vocab: {
    account: 'partner', accounts: 'partners',
    contact: 'technical buyer', contacts: 'technical buyers',
    rep: 'territory rep', reps: 'territory reps',
    manager: 'sales manager', kam: 'channel manager',
    offering: 'product', offerings: 'products',
    order: 'order', orders: 'orders',
    visit: 'visit', visits: 'visits',
  },
  personas: { rep: 'Territory rep', manager: 'Sales manager', admin: 'Commercial operations lead' },
  segments: [
    {
      id: 'installers', name: 'Solar installers', share: 0.4, visitMinutes: [25, 40],
      style: 'Visit at the yard or the office, led by the current project list and what is waiting on stock.',
      annualValue: [20000, 95000], hours: [7 * 60, 16 * 60], orderQty: [2, 10],
      types: [
        { type: 'Solar installer', naming: 'family', words: { en: ['Solar', 'Energy Systems', 'Power Installs'], pt: ['Energia Solar', 'Solar'], es: ['Energía Solar', 'Instalaciones Solares'], de: ['Solartechnik', 'Energietechnik'], id: ['Tenaga Surya', 'Solar'], fr: ['Solaire', 'Énergie Solaire', 'Installations Solaires'] } },
      ],
      roles: ['Owner', 'Project manager', 'Purchasing contact'],
    },
    {
      id: 'wholesalers', name: 'Electrical wholesalers', share: 0.3, key: true, visitMinutes: [35, 50],
      style: 'Planned visit at the trade counter, led by stock levels, counter displays and the project pipeline.',
      annualValue: [70000, 260000], hours: [7 * 60, 17 * 60], orderQty: [6, 24],
      types: [
        { type: 'Electrical wholesaler', naming: 'institution', words: { en: ['Electrical Supplies', 'Trade Electrical', 'Wholesale Electrical'], pt: ['Material Elétrico', 'Elétrica'], es: ['Material Eléctrico', 'Eléctricos'], de: ['Elektrogroßhandel', 'Elektrobedarf'], id: ['Grosir Listrik', 'Perlengkapan Listrik'], fr: ['Matériel Électrique', 'Grossiste Électrique', 'Électricité Pro'] } },
      ],
      roles: ['Branch manager', 'Category buyer', 'Counter supervisor'],
    },
    {
      id: 'builders', name: 'Home builders and developers', share: 0.3, visitMinutes: [30, 45],
      style: 'Visit at the site office or head office, led by the build schedule and the energy spec for each house type.',
      annualValue: [40000, 180000], hours: [8 * 60, 16 * 60], orderQty: [4, 18],
      types: [
        { type: 'Home builder', naming: 'institution', words: { en: ['Homes', 'Developments', 'Living'], pt: ['Construtora', 'Incorporadora'], es: ['Constructora', 'Desarrollos'], de: ['Bauträger', 'Wohnbau'], id: ['Pengembang', 'Griya'], fr: ['Promoteur', 'Constructions', 'Habitat'] } },
      ],
      roles: ['Project director', 'Procurement lead'],
    },
  ],
  offerings: [
    { id: 'panel', name: 'Sunvane Solar Panel 430 W, pallet of 31', category: 'Panels', price: 2480, unit: 'pallet', status: 'core' },
    { id: 'inverter', name: 'Gridwell Hybrid Inverter 5 kW', category: 'Inverters', price: 1190, unit: 'each', status: 'core' },
    { id: 'rail', name: 'Roofgrip Mounting Rail Kit', category: 'Mounting', price: 310, unit: 'kit', status: 'core' },
    { id: 'cable', name: 'Solarline DC Cable 100 m', category: 'Cables', price: 140, unit: 'reel', status: 'core' },
    { id: 'isolator', name: 'Safeswitch DC Isolator, box of 5', category: 'Protection', price: 165, unit: 'box', status: 'core' },
    { id: 'battery', name: 'Storewell Home Battery 10 kWh', category: 'Storage', price: 3650, unit: 'each', status: 'focus' },
    { id: 'charger', name: 'Plugwise Wall Charger 7 kW', category: 'Charging', price: 520, unit: 'each', status: 'focus' },
    { id: 'monitor', name: 'Watchpoint Energy Monitor', category: 'Monitoring', price: 210, unit: 'each', status: 'new' },
    { id: 'heatpump', name: 'Warmleaf Heat Pump Water Heater 200 l', category: 'Heating', price: 1480, unit: 'each', status: 'new' },
  ],
  actions: [
    {
      id: 'pipeline', type: 'Plan stock for the project list', agent: 'order', effort: 15, evidence: 'note', value: [300, 2000], uses: 'core', segments: ['installers', 'builders'],
      title: 'Plan stock for the project list at this {account}',
      saw: 'The project list shows {n} installs starting within the next {weeks} weeks, and {product} is on every bill of materials.',
      compared: 'This partner\'s stock position and the lead time quoted for {product} from the depot.',
      why: [
        'A project that waits on a part holds up the crew and the customer.',
        'The list is shared by the partner, so the quantities are real.',
        'Ordering to the list avoids a rush delivery a day before the install.',
      ],
      talk: [
        'Go through the list with {person} and mark what is on the shelf.',
        'Reserve only what the confirmed projects need.',
        'Agree a date to check progress.',
      ],
    },
    {
      id: 'training', type: 'Book product training', agent: 'gap', effort: 20, evidence: 'signature', value: [100, 600], uses: 'focus', segments: ['installers', 'wholesalers'],
      title: 'Book a product training on {product}',
      saw: 'Nobody at this {account} appears on the maker training list for {product}.',
      compared: 'Partners with trained staff, which log fewer support calls on the product.',
      why: [
        'Trained crews commission faster and call support less.',
        'The training is run by the maker. The rep only books it.',
        'The attendance sheet is the record of who was trained.',
      ],
      talk: [
        'Offer two dates and a place, in person or online.',
        'Ask {person} who should attend.',
      ],
      guardrail: 'Training content comes from the maker. The agent never adds technical or safety advice.',
    },
    {
      id: 'compat', type: 'Check product compatibility', agent: 'gap', effort: 10, evidence: 'note', value: [80, 420], uses: 'focus',
      title: 'Check {product} against the compatibility list',
      saw: 'A recent order pairs {product} with a part that the maker\'s compatibility list does not show together.',
      compared: 'The current maker compatibility list.',
      why: [
        'An incompatible pairing can mean a failed commissioning and a second site visit.',
        'The rep flags the pairing and a qualified engineer decides.',
        'Catching it before dispatch costs a phone call.',
      ],
      talk: [
        'Show {person} the compatibility list and the pairing in question.',
        'Offer a call with the technical team before the order ships.',
      ],
      guardrail: 'Electrical design and sizing are done by a qualified engineer. The agent never states that a system will work.',
    },
    {
      id: 'deadline', type: 'Stock up before a deadline', agent: 'order', effort: 12, evidence: 'note', value: [250, 1800], uses: 'core',
      title: 'Plan stock ahead of {event}',
      saw: 'Enquiries at this {account} are rising ahead of {event}, which is {eventDays} days away.',
      compared: 'This partner\'s volumes in the same weeks last year.',
      why: [
        'Demand bunches up before a known date, and lead times stretch.',
        'Orders placed early are filled from stock, not from the next shipment.',
        '{product} is the line most often short at that time.',
      ],
      talk: [
        'Ask {person} how many projects are booked for the weeks around it.',
        'Agree a quantity with a review point rather than one large order.',
      ],
    },
    {
      id: 'newline', type: 'Introduce a new product', agent: 'gap', effort: 12, evidence: 'note', value: [150, 900], uses: 'new',
      title: 'Introduce {product} to the team',
      saw: '{product} became available {weeks} weeks ago and this partner has not asked about it.',
      compared: '{pct}% of similar partners in {city} have placed a first order.',
      why: [
        'Customers are starting to ask for this product type.',
        'The first order can be a single unit for a demo.',
        'The ordering code and datasheet are loaded for this partner.',
      ],
      talk: [
        'Start with the customer question it answers, not the specification.',
        'Offer a demo unit and a date to review.',
      ],
    },
    {
      id: 'counter', type: 'Set up a counter display', agent: 'gap', effort: 15, evidence: 'photo', value: [100, 600], uses: 'focus', segments: ['wholesalers'],
      title: 'Set up a counter display for {product}',
      saw: 'The last counter photo shows no demo or sample of {product}.',
      compared: 'Branches with a counter display, which sold more of the line over the same weeks.',
      why: [
        'Installers pick up what they can see and touch at the counter.',
        'The display unit and price cards are approved and in the car.',
        'The branch decides the position. The rep only proposes.',
      ],
      talk: [
        'Ask {person} for a spot near the trade counter.',
        'Set the display during the visit and take the photo.',
      ],
    },
    {
      id: 'warranty', type: 'Log an open warranty claim', agent: 'gap', effort: 6, evidence: 'note', value: [20, 160], uses: 'none',
      title: 'Log the open warranty claim',
      saw: 'The partner mentioned a failed unit at the last visit and no claim is on file.',
      compared: 'The service team queue, where claims older than a week are flagged.',
      why: [
        'Open claims slow reorders more than a price change does.',
        'The service team decides each claim. The rep only logs it.',
        'A claim with the serial number moves faster.',
      ],
      talk: [
        'Ask {person} for the serial number and the fault description.',
        'Tell them who will reply and when.',
      ],
      guardrail: 'The agent never approves or rejects a warranty claim. The service team decides.',
    },
    {
      id: 'spec', type: 'Match the product to the house spec', agent: 'gap', effort: 15, evidence: 'note', value: [200, 1100], uses: 'focus', segments: ['builders'],
      title: 'Match {product} to the energy spec for the next house type',
      saw: 'The next house type in the build schedule has an energy spec that lists {product} as an option.',
      compared: 'The spec sheet shared by the builder and the maker datasheets.',
      why: [
        'Specs are fixed early and are hard to change once homes are priced.',
        'A confirmed product gets a delivery slot with the build schedule.',
        'The designer approves the final spec. The rep supports the choice.',
      ],
      talk: [
        'Take the spec with {person} and mark where {product} fits.',
        'Offer a call between their designer and our technical team.',
      ],
    },
    {
      id: 'install', type: 'Move the visit away from install days', agent: 'planner', effort: 3, evidence: 'note', value: [30, 120], uses: 'none',
      title: 'Move the next {visit} off the install days',
      saw: '{n} of the last four {visits} landed on a day the crews were out on roofs.',
      compared: 'The crew calendar this partner shared with the depot.',
      why: [
        'The project lead is easier to reach on a yard day.',
        'It avoids a long wait at an empty office.',
        'It matches the day the weekly stock is checked.',
      ],
      talk: [
        'Ask {person} which day the crews are in the yard.',
        'Confirm the day before.',
      ],
    },
    {
      id: 'quote', type: 'Log a project quote request', agent: 'gap', effort: 8, evidence: 'note', value: [50, 300], uses: 'none',
      title: 'Log the project quote request',
      saw: 'The partner asked for pricing on a multi-unit project and no request is on file.',
      compared: 'The pricing desk queue, which handles all project quotes.',
      why: [
        'A late quote loses the project to a faster supplier.',
        'Only the pricing desk may set a project price. The rep carries the request across.',
        'A request with unit counts and dates gets one clear answer.',
      ],
      talk: [
        'Ask {person} for the units, the dates and the site.',
        'Tell them when to expect the quote.',
      ],
      guardrail: 'The agent never gives a price, a saving or a payback estimate. The pricing desk and a qualified designer do.',
    },
  ],
  orderReasons: {
    core: ['Used about {avg} a week. {cover} days of stock left.', 'Needed for the confirmed projects.', 'Covers the shortfall found today.'],
    focus: ['Supports the plan ahead of {event}.', 'Focus line this cycle. The partner has projects that use it.'],
    new: ['Demo quantity for {weeks} weeks.', 'Similar partners nearby have ordered it. Start with one unit.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 8000, route: 'manager', text: '{Orders} above {limit} need {manager} approval.' },
    { kind: 'info', text: 'Prices come from the channel price list. The agent cannot change them or quote savings.' },
  ],
  overrideReasons: [
    { label: 'Technical buyer not available', route: 'manager' },
    { label: 'The partner already has stock on order', route: 'manager' },
    { label: 'Not allowed under the channel agreement', route: 'kam' },
    { label: 'The data looks wrong', route: 'manager' },
    { label: 'Not enough time in this visit', route: 'manager' },
    { label: 'Other', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Technical buyer said no', blocked: false },
    { label: 'Product delayed at the port', blocked: true },
    { label: 'Partner on a credit hold', blocked: true, route: 'kam' },
    { label: 'Crew out, no time to talk', blocked: false },
  ],
  visitNotes: [
    'Order taken, {n} lines.', 'Project list reviewed. Stock reserved.', 'Technical buyer on a roof. Order taken by phone.',
    'Compatibility list shared and the pairing checked.', 'Demo unit left for the next job.',
  ],
  kpis: [
    { id: 'range', label: 'Core range stocked', format: 'pct', range: [50, 94], target: 85 },
    { id: 'otif', label: 'On time and in full', format: 'pct', range: [80, 99], target: 95 },
    { id: 'quotes', label: 'Project quotes answered within two days', format: 'pct', range: [40, 96], target: 85 },
    { id: 'attach', label: 'Orders with storage or monitoring', format: 'pct', range: [5, 60], target: 35, segments: ['installers', 'builders'] },
    { id: 'trained', label: 'Installers trained on the current range', format: 'pct', range: [20, 90], target: 70, segments: ['installers'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Follows the channel price list and the maker documents. Never offers terms outside them.' },
    { id: 'gap1', agent: 'gap', text: 'Never states a saving, payback or output figure. A qualified designer does.' },
    { id: 'order1', agent: 'order', text: 'Never suggests more stock than the partner\'s confirmed projects and the storage rules in the maker manual allow.' },
    { id: 'planner1', agent: 'planner', text: 'Never drops an electrical wholesaler on a channel agreement without the sales manager.' },
  ],
  problems: [
    { title: 'Wholesale branches and small installers get the same visit', text: 'Visits follow the van route. A branch that moves a pallet a week is seen as often as a two-person installer.', capability: 'potential' },
    { title: 'We learn about a delayed project after the crew is booked', text: 'A missing isolator or cable is found on install day. The crew waits, the customer waits and we hear about it later.', capability: 'gaps' },
    { title: 'Every partner gets the same pitch', text: 'Panels, batteries and chargers are shown in the same order to everyone. Nothing is ranked by what this partner is likely to need next.', capability: 'ranking' },
    { title: 'Visits miss install days and deadlines', text: 'A call on a roof day reaches nobody, and a call after a deadline is too late. The calendars sit in separate places.', capability: 'planning' },
    { title: 'Orders are built from habit, not from the project list', text: 'The same panels and cable as last time. The new storage product is only mentioned in passing.', capability: 'order' },
    { title: 'We cannot show what was told to a partner', text: 'Compatibility checks, training bookings and warranty reports are in calls and emails. A dispute later has no record.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this partner first today?', a: 'It has the most value at stake across its actions and its order, and its crew is in the yard before the next stop.' },
    { q: 'Which partners have a project waiting on stock?', a: 'The ones whose project list shows installs starting soon with a part not yet on the shelf. The Order agent drafts the stock plan.' },
    { q: 'What do I say about the new product?', a: 'Start with the customer question it answers, offer a demo unit and agree a date to review how it went.' },
    { q: 'Can I tell a partner what a system will save?', a: 'No. Savings, payback and output figures come from a qualified designer. I can share the datasheets and offer a call.' },
    { q: 'How was the quantity chosen?', a: 'From the confirmed project list, the stock left and the lead time. You can change any line.' },
    { q: 'What happens if I override an action?', a: 'It goes to your sales manager with your reason. An override is feedback for the agents and counts against nobody.' },
    { q: 'Which partners are overdue a visit?', a: 'Check the wholesalers with the longest gap since the last visit. The Visit Planner puts them on the next routes.' },
    { q: 'How much should I trust a low confidence item?', a: 'Each item shows a confidence level. Low confidence means thin data, so check the partner\'s project list before acting.' },
  ],
  storyline: [
    'Pick Solar and home energy and the prospect\'s country. Say all data is fictional demonstration data.',
    'Today: the rep\'s partners, ranked by value, with local cities and currency.',
    'Open the first visit brief. Approve the stock plan. Override the training with "Not allowed under the channel agreement".',
    'Open an action: the reasons, the talking points and the guardrail on savings claims.',
    'Order: edit a line, then show the approval rule when the total passes the limit.',
    'Complete the visit, then switch to the sales manager. The override is in the exception queue.',
    'Agent controls: stop the Order agent and see its stock plan pause in the brief.',
    'How this is configured: partners, products, actions and KPIs. "This is a configuration, not a custom build."',
  ],
  forbidden: ['patient', 'clinic', 'physician', 'farmer', 'loan', 'chef', 'shopper'],
};
