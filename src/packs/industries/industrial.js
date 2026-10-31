// Industrial supplies: plants, fabrication shops, contractors and facilities teams.
// All product and site names are fictional.

import assistant from './industrial.assistant.js';
import companion from './industrial.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'industrial',
  name: 'Industrial supplies',
  tagline: 'Plants, machine shops, contractors and facilities teams',
  icon: 'config',
  accent: '#1E40AF',
  vocab: {
    account: 'site', accounts: 'sites',
    contact: 'maintenance lead', contacts: 'maintenance leads',
    rep: 'sales engineer', reps: 'sales engineers',
    manager: 'regional sales manager', kam: 'strategic accounts manager',
    offering: 'item', offerings: 'items',
    order: 'order', orders: 'orders',
    visit: 'visit', visits: 'visits',
  },
  personas: { rep: 'Sales engineer', manager: 'Regional sales manager', admin: 'Commercial operations lead' },
  segments: [
    {
      id: 'plants', name: 'Plants and factories', share: 0.25, key: true, visitMinutes: [40, 60],
      style: 'Planned visit around the maintenance calendar, with a walk through the crib and the line-side bins.',
      annualValue: [90000, 320000], hours: [7 * 60, 16 * 60], orderQty: [8, 30],
      types: [
        { type: 'Manufacturing plant', naming: 'institution', words: { en: ['Works', 'Manufacturing', 'Plant'], pt: ['Indústria', 'Fábrica'], es: ['Planta', 'Manufacturas'], de: ['Werke', 'Produktion'], id: ['Pabrik', 'Industri'], fr: ['Usine', 'Manufacture', 'Production'] } },
      ],
      roles: ['Maintenance manager', 'Plant engineer', 'Stores supervisor'],
    },
    {
      id: 'fab', name: 'Machine and fabrication shops', share: 0.4, visitMinutes: [20, 35],
      style: 'Shorter visit at the counter or on the floor, led by what broke this week and what is running low.',
      annualValue: [12000, 60000], hours: [7 * 60, 17 * 60], orderQty: [3, 12],
      types: [
        { type: 'Fabrication shop', naming: 'family', words: { en: ['Fabrication', 'Metalworks', 'Engineering'], pt: ['Serralheria', 'Usinagem'], es: ['Metalmecánica', 'Talleres Metálicos'], de: ['Metallbau', 'Maschinenbau'], id: ['Fabrikasi', 'Teknik Logam'], fr: ['Chaudronnerie', 'Mécanique', 'Ateliers Métal'] } },
        { type: 'Machine shop', naming: 'family', words: { en: ['Machining', 'Precision', 'Tooling'], pt: ['Usinagem', 'Ferramentaria'], es: ['Maquinados', 'Herramientas'], de: ['Zerspanung', 'Präzision'], id: ['Permesinan', 'Perkakas'], fr: ['Usinage', 'Précision', 'Outillage'] } },
      ],
      roles: ['Owner', 'Shop foreman', 'Buyer'],
    },
    {
      id: 'contractors', name: 'Contractors and facilities teams', share: 0.35, visitMinutes: [15, 30],
      style: 'Quick visit on site or at the yard, led by the job in hand and the next call-out.',
      annualValue: [8000, 42000], hours: [7 * 60, 16 * 60], orderQty: [2, 10],
      types: [
        { type: 'Maintenance contractor', naming: 'family', words: { en: ['Maintenance Services', 'Facilities', 'Mechanical Services'], pt: ['Manutenção', 'Serviços Técnicos'], es: ['Mantenimiento', 'Servicios Técnicos'], de: ['Instandhaltung', 'Haustechnik'], id: ['Perawatan', 'Jasa Teknik'], fr: ['Maintenance', 'Services Techniques', 'Multiservices'] } },
      ],
      roles: ['Owner', 'Site supervisor'],
    },
  ],
  offerings: [
    { id: 'gloves', name: 'Gripmark Cut-Resistant Gloves 12 pairs', category: 'Safety', price: 62, unit: 'box', status: 'core' },
    { id: 'bearing', name: 'Rotaline Ball Bearing 6205 box of 10', category: 'Bearings', price: 48, unit: 'box', status: 'core' },
    { id: 'grease', name: 'Slidewell Grease Cartridge 400 g, 24 pack', category: 'Lubricants', price: 72, unit: 'case', status: 'core' },
    { id: 'discs', name: 'Edgecut Cutting Discs 125 mm, 50 pack', category: 'Abrasives', price: 56, unit: 'box', status: 'core' },
    { id: 'bolts', name: 'Boltfield Stainless Bolt Kit M8', category: 'Fasteners', price: 34, unit: 'kit', status: 'core' },
    { id: 'filter', name: 'Airline Compressed Air Filter Element', category: 'Filtration', price: 88, unit: 'box', status: 'focus' },
    { id: 'torque', name: 'Torquemate Calibrated Torque Wrench 200 Nm', category: 'Tools', price: 189, unit: 'each', status: 'focus' },
    { id: 'sensor', name: 'Gaugeline Digital Pressure Sensor Kit', category: 'Instruments', price: 240, unit: 'kit', status: 'new' },
    { id: 'glasses', name: 'Clearview Anti-Fog Safety Glasses, box of 20', category: 'Safety', price: 78, unit: 'box', status: 'new' },
  ],
  actions: [
    {
      id: 'bins', type: 'Set up a restock bin', agent: 'order', effort: 15, evidence: 'photo', value: [200, 1200], uses: 'core', segments: ['plants', 'fab'],
      title: 'Set up a restock bin for {product}',
      saw: '{product} was bought {n} times in the last 12 weeks, mostly as urgent single-box orders.',
      compared: 'Sites with a labeled bin and a minimum level, which had no urgent buys of this item in the same period.',
      why: [
        'An urgent buy costs the site a stoppage and costs us a rushed delivery.',
        'Usage is steady enough to set a minimum level with confidence.',
        'The bin photo records the agreed location and level.',
        'Estimated value of the bin over three months: {amount}.',
      ],
      talk: [
        'Walk to the crib with {person} and agree where the bin goes.',
        'Set the minimum from actual use, not from a guess.',
        'Show how a refill request reaches us.',
      ],
    },
    {
      id: 'rating', type: 'Confirm the rating for the job', agent: 'gap', effort: 10, evidence: 'note', value: [60, 340], uses: 'focus',
      title: 'Confirm {product} suits the job it is bought for',
      saw: 'The last {n} orders for {product} came with a job note that the datasheet does not list as a use.',
      compared: 'The datasheet for the item, as published by the maker.',
      why: [
        'Using an item outside its rating is a safety and warranty risk for the site.',
        'The rep flags the mismatch. The technical desk answers it.',
        'A short note now avoids a failure later.',
      ],
      talk: [
        'Ask {person} what the item is used for and read out the rated limits.',
        'If the job is outside them, offer a call with the technical desk.',
      ],
      guardrail: 'Load, pressure and rating questions go to the technical desk. The agent never answers them.',
    },
    {
      id: 'shutdown', type: 'Plan stock for the shutdown', agent: 'order', effort: 15, evidence: 'note', value: [500, 2600], uses: 'core', segments: ['plants'],
      title: 'Plan stock for the shutdown around {event}',
      saw: 'The maintenance calendar shows a planned stop about {eventDays} days out, with a job list for the plant.',
      compared: 'Consumption in the last planned stop at this plant.',
      why: [
        'A planned stop is the one time the plant buys many items at once.',
        'Ordering early lets us reserve stock and book delivery slots.',
        'Missing a part during a stop costs far more than the part.',
      ],
      talk: [
        'Take the job list from {person} and match it line by line.',
        'Agree which items are reserved and which are called off as needed.',
        'Set a date to confirm the final list.',
      ],
    },
    {
      id: 'obsolete', type: 'Replace a discontinued item', agent: 'gap', effort: 12, evidence: 'note', value: [100, 700], uses: 'core',
      title: 'Replace the discontinued {product}',
      saw: 'The maker announced an end of life for a variant of {product} that this site buys regularly.',
      compared: 'The supersession list, which names the replacement and any change in size or rating.',
      why: [
        'A silent switch to a different item can fit badly or fail a check.',
        'Telling the site early lets it use up stock and test the replacement.',
        'The replacement is already available from the depot.',
      ],
      talk: [
        'Show {person} the old and new item side by side.',
        'Point out any change in size, rating or part number.',
      ],
    },
    {
      id: 'talk', type: 'Run a toolbox talk', agent: 'gap', effort: 20, evidence: 'signature', value: [80, 420], uses: 'focus', segments: ['plants', 'contractors'],
      title: 'Offer a toolbox talk on {product}',
      saw: 'Two near-miss reports mention incorrect use of {product} at this site in the last year.',
      compared: 'Sites that held a short talk on the item, which had fewer repeat reports.',
      why: [
        'A ten-minute talk costs little compared with an incident.',
        'The attendance sheet is the record that the talk was held.',
        'The material comes from the maker, not from the rep.',
      ],
      talk: [
        'Offer a slot at shift start and keep it to ten minutes.',
        'Use the maker material and leave the handout with the supervisor.',
      ],
      guardrail: 'Talks use the maker material only. The agent never adds safety advice of its own.',
    },
    {
      id: 'newitem', type: 'Show a new item', agent: 'gap', effort: 12, evidence: 'note', value: [150, 800], uses: 'new',
      title: 'Show {product} to the team',
      saw: '{product} launched {weeks} weeks ago and the site buys the item it would replace.',
      compared: '{pct}% of similar sites in {city} have tried it, most within two orders.',
      why: [
        'The new item solves a problem this site has logged more than once.',
        'A trial unit lets the team test it on a real job.',
        'The ordering code is already loaded for the site.',
      ],
      talk: [
        'Describe the problem it solves before you describe the item.',
        'Leave one unit with a short feedback form.',
      ],
    },
    {
      id: 'crib', type: 'Count the tool crib', agent: 'order', effort: 10, evidence: 'photo', value: [100, 550], uses: 'core', segments: ['plants', 'fab'],
      title: 'Count the tool crib and top up {product}',
      saw: 'The last count shows {product} at about {days} days of use, below the site minimum.',
      compared: 'The minimum level agreed with this site and its consumption over 12 weeks.',
      why: [
        'Stock-outs at the crib stop jobs and send the team to buy locally.',
        'The count is cheap and the top-up is already drafted.',
        'The photo shows the real level on the shelf at the time of the count.',
      ],
      talk: [
        'Count with {person} and agree the figures before you order.',
        'Keep the top-up to the agreed minimum, not above it.',
      ],
    },
    {
      id: 'calibration', type: 'Flag calibration due dates', agent: 'gap', effort: 8, evidence: 'scan', value: [60, 300], uses: 'focus', segments: ['plants', 'fab'],
      title: 'Flag the calibration due dates on {product}',
      saw: 'Scans of the tag on {n} units show a calibration date within the next 30 days.',
      compared: 'The site calibration register shared at the last visit.',
      why: [
        'Out-of-date tools fail audits and put measurements in doubt.',
        'Calibration is done by an accredited lab. The rep flags the date.',
        'Booking early avoids a gap with no tool on the floor.',
      ],
      talk: [
        'Hand {person} the list of units with the due date.',
        'Offer to book the collection with the lab.',
      ],
      guardrail: 'The agent flags due dates only. It never states that a tool is in or out of tolerance.',
    },
    {
      id: 'shift', type: 'Move the visit to a shift change', agent: 'planner', effort: 3, evidence: 'note', value: [30, 120], uses: 'none',
      title: 'Move the next {visit} to the shift change',
      saw: '{n} of the last four {visits} happened while the line was running at full pace.',
      compared: 'The shift pattern this site shared with the depot.',
      why: [
        'Maintenance leads can talk when the line is handed over.',
        'It avoids standing by a machine for ten minutes.',
        'It lines up with the day the crib is restocked.',
      ],
      talk: [
        'Ask {person} when the quietest hour is.',
        'Confirm the time the day before.',
      ],
    },
    {
      id: 'quote', type: 'Log a quote request', agent: 'gap', effort: 6, evidence: 'note', value: [40, 250], uses: 'none',
      title: 'Log the quote request',
      saw: 'The site asked for a quote on a large or custom item and no request is on file.',
      compared: 'The pricing desk queue, which handles all quotes.',
      why: [
        'Quotes that wait lose the job to a quicker supplier.',
        'The pricing desk sets the price. The rep passes on the request.',
        'A complete request gets an answer in one pass.',
      ],
      talk: [
        'Ask {person} for the quantity, the date needed and the job.',
        'Tell them when to expect an answer.',
      ],
      guardrail: 'The agent never quotes a price or a discount. The pricing desk does.',
    },
  ],
  orderReasons: {
    core: ['Used about {avg} a week. {cover} days left in the crib.', 'Bought in most of the last {weeks} weeks.', 'Covers the count shortfall from today.'],
    focus: ['Supports the plan around {event}.', 'Focus item this cycle. The site has a job for it.'],
    new: ['Trial quantity for {weeks} weeks.', 'Similar sites nearby have it in use. Start with one unit.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 4000, route: 'manager', text: '{Orders} above {limit} need {manager} approval.' },
    { kind: 'info', text: 'Prices come from the contract price list and the pricing desk. The agent cannot change them.' },
  ],
  overrideReasons: [
    { label: 'Maintenance lead not on site', route: 'manager' },
    { label: 'The site already holds a rival contract', route: 'manager' },
    { label: 'Not allowed under the service agreement', route: 'kam' },
    { label: 'The data looks wrong', route: 'manager' },
    { label: 'Not enough time in this visit', route: 'manager' },
    { label: 'Other', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Maintenance lead said no', blocked: false },
    { label: 'Item on backorder at the depot', blocked: true },
    { label: 'Site on a credit hold', blocked: true, route: 'kam' },
    { label: 'Line was down, no time to talk', blocked: false },
  ],
  visitNotes: [
    'Order taken, {n} lines.', 'Crib counted with the team. Minimum levels agreed.', 'Maintenance lead on a call-out. Order taken by phone.',
    'Datasheet shared and the job use confirmed.', 'Trial unit left for the next job.',
  ],
  kpis: [
    { id: 'range', label: 'Contract items bought', format: 'pct', range: [45, 92], target: 80 },
    { id: 'otif', label: 'On time and in full', format: 'pct', range: [84, 99], target: 95 },
    { id: 'stockouts', label: 'Crib stock-outs (last 30 days)', format: 'count', range: [0, 8], target: 1, lowerIsBetter: true },
    { id: 'bins', label: 'Restock bins in place', format: 'pct', range: [10, 85], target: 65, segments: ['plants', 'fab'] },
    { id: 'quotes', label: 'Quotes answered within a day', format: 'pct', range: [50, 98], target: 90 },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Follows the contract price list and the maker datasheet for each item.' },
    { id: 'gap1', agent: 'gap', text: 'Load, pressure and rating questions go to the technical desk. The agent never answers them.' },
    { id: 'order1', agent: 'order', text: 'Never suggests more than the site can store or use before the shelf life on the label.' },
    { id: 'planner1', agent: 'planner', text: 'Never drops a plant on a service agreement without the regional sales manager.' },
  ],
  problems: [
    { title: 'Big plants and small shops get the same visit rhythm', text: 'Visits follow the van route. A plant with a shutdown coming gets a call every month, while a small shop is seen every week.', capability: 'potential' },
    { title: 'We find out about a stoppage after it happens', text: 'The crib runs out of a bearing or a filter and the team buys it locally. We hear about it a week later, if at all.', capability: 'gaps' },
    { title: 'Reps chase the loudest customer', text: 'A long list of open items, none ranked. The planned shutdown is lost behind this week\'s urgent request.', capability: 'ranking' },
    { title: 'Visits miss shift changes and shutdown dates', text: 'Fixed call cycles ignore the maintenance calendar. The best order of the year is placed with someone else.', capability: 'planning' },
    { title: 'Orders are one box at a time', text: 'Without counts and minimums, orders are urgent single boxes. Delivery costs rise and the site pays for the rush.', capability: 'order' },
    { title: 'We cannot show what a site was told', text: 'Datasheet questions, toolbox talks and calibration dates live in emails and notebooks. A question after an incident has no record.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this site first today?', a: 'It has the most value at stake across its actions and its order, and its shift change fits before the next site.' },
    { q: 'Which sites have a shutdown coming?', a: 'The plants whose maintenance calendar shows a planned stop in the next few weeks. The Order agent drafts a stock plan for each one.' },
    { q: 'What do I say about a new item?', a: 'Describe the problem it solves before the item itself, leave one unit for a real job and agree who will send feedback.' },
    { q: 'Can I say a part is rated for a job?', a: 'No. Rating, load and pressure questions go to the technical desk. Share the datasheet and offer a call with them.' },
    { q: 'How was the top-up quantity set?', a: 'From the site minimum, the days of use left at the last count and the delivery lead time. You can change any line.' },
    { q: 'What happens to an override?', a: 'It goes to your regional sales manager with the reason you picked. It is feedback for the agents and no penalty for you.' },
    { q: 'Which sites have I not seen in a month?', a: 'Check the plants with the longest gap since the last visit. The Visit Planner adds them to the next routes.' },
    { q: 'When should I doubt an item?', a: 'When it shows low confidence. That means thin data, so count the crib yourself before acting.' },
  ],
  storyline: [
    'Pick Industrial supplies and the prospect\'s country. Say all data is fictional demonstration data.',
    'Today: the engineer\'s sites, ranked by value, with local cities and currency.',
    'Open the first visit brief. Approve the restock bin. Override the toolbox talk with "Not allowed under the service agreement".',
    'Open an action: the reasons, the talking points and the rating guardrail.',
    'Order: change a quantity, then show the approval rule when the total passes the limit.',
    'Complete the visit, then switch to the regional sales manager. The override is in the exception queue.',
    'Agent controls: stop the Order agent and watch its crib counts pause in the brief.',
    'How this is configured: sites, items, actions and KPIs. "This is a configuration, not a custom build."',
  ],
  forbidden: ['patient', 'clinic', 'physician', 'farmer', 'loan', 'chef', 'shopper'],
};
