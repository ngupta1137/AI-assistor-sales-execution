// Foodservice distribution: restaurants, cafes, hotels, caterers and canteens.
// All product and venue names are fictional.

import assistant from './foodservice.assistant.js';
import companion from './foodservice.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'foodservice',
  name: 'Foodservice distribution',
  tagline: 'Restaurants, hotels, caterers and canteens',
  icon: 'home',
  accent: '#047857',
  vocab: {
    account: 'venue', accounts: 'venues',
    contact: 'buyer', contacts: 'buyers',
    rep: 'sales rep', reps: 'sales reps',
    manager: 'regional manager', kam: 'national accounts manager',
    offering: 'product', offerings: 'products',
    order: 'order', orders: 'orders',
    visit: 'visit', visits: 'visits',
  },
  personas: { rep: 'Sales rep', manager: 'Regional manager', admin: 'Commercial operations lead' },
  segments: [
    {
      id: 'dining', name: 'Restaurants and cafes', share: 0.45, visitMinutes: [15, 25],
      style: 'Quick call in the quiet hours between lunch and dinner, led by the chef\'s next menu change.',
      annualValue: [14000, 70000], hours: [10 * 60, 16 * 60], orderQty: [2, 10],
      types: [
        { type: 'Restaurant', words: { en: ['Table', 'Eatery', 'Dining Room'], pt: ['Cantina', 'Restaurante'], es: ['Cocina', 'Fonda'], de: ['Gasthaus', 'Speisehaus'], id: ['Rumah Makan', 'Dapur'], fr: ['Table', 'Bistrot Gourmand', 'Auberge'] } },
        { type: 'Cafe', words: { en: ['Coffee House', 'Cafe', 'Roasters'], pt: ['Cafeteria', 'Padaria'], es: ['Cafetería', 'Café'], de: ['Kaffeehaus', 'Café'], id: ['Kedai Kopi', 'Kafe'], fr: ['Salon de Thé', 'Café', 'Torréfacteur'] } },
      ],
      roles: ['Head chef', 'Owner', 'Purchasing manager'],
    },
    {
      id: 'hotels', name: 'Hotels and caterers', share: 0.25, key: true, visitMinutes: [30, 45],
      style: 'Planned call with the purchasing team, tied to the banquet calendar and the supply contract.',
      annualValue: [60000, 220000], hours: [9 * 60, 17 * 60], orderQty: [6, 24],
      types: [
        { type: 'Hotel', naming: 'institution', words: { en: ['Grand Hotel', 'Hotel', 'Suites'], pt: ['Hotel', 'Pousada'], es: ['Hotel', 'Gran Hotel'], de: ['Hotel', 'Parkhotel'], id: ['Hotel', 'Grand Hotel'], fr: ['Hôtel', 'Grand Hôtel', 'Résidence'] } },
        { type: 'Catering company', words: { en: ['Catering', 'Events Kitchen', 'Banquets'], pt: ['Buffet', 'Eventos'], es: ['Banquetes', 'Eventos'], de: ['Catering', 'Festservice'], id: ['Katering', 'Jasa Boga'], fr: ['Traiteur', 'Réceptions', 'Banquets'] } },
      ],
      roles: ['Food and beverage manager', 'Executive chef', 'Purchasing manager'],
    },
    {
      id: 'canteens', name: 'Canteens and institutions', share: 0.3, visitMinutes: [20, 35],
      style: 'Scheduled call with the catering manager, led by the cycle menu, headcount and delivery windows.',
      annualValue: [25000, 110000], hours: [7 * 60, 15 * 60], orderQty: [4, 16],
      types: [
        { type: 'Canteen', naming: 'institution', words: { en: ['Dining Services', 'Catering Services', 'Kitchen Services'], pt: ['Refeitório', 'Alimentação'], es: ['Comedor', 'Servicio de Comidas'], de: ['Kantine', 'Mensa'], id: ['Kantin', 'Dapur Umum'], fr: ['Restauration Collective', 'Cantine', 'Service Repas'] } },
      ],
      roles: ['Catering manager', 'Cook in charge'],
    },
  ],
  offerings: [
    { id: 'oil', name: 'Harborfry Cooking Oil 15 l', category: 'Oils and fats', price: 38.5, unit: 'drum', status: 'core' },
    { id: 'flour', name: 'Millhouse Bread Flour 25 kg', category: 'Dry goods', price: 26, unit: 'sack', status: 'core' },
    { id: 'rice', name: 'Goldfield Long Grain Rice 10 kg', category: 'Dry goods', price: 21, unit: 'sack', status: 'core' },
    { id: 'tomato', name: 'Sunvale Chopped Tomatoes 6 x 2.5 kg', category: 'Canned', price: 29.4, unit: 'case', status: 'core' },
    { id: 'cream', name: 'Dairyleaf Whipping Cream 12 x 1 l', category: 'Chilled', price: 52.8, unit: 'case', status: 'core' },
    { id: 'stock', name: 'Kettlepot Chicken Stock 6 x 1 kg', category: 'Stocks and sauces', price: 44, unit: 'case', status: 'focus' },
    { id: 'fries', name: 'Crispfield Frozen Fries 4 x 2.5 kg', category: 'Frozen', price: 33.6, unit: 'case', status: 'focus' },
    { id: 'oat', name: 'Oatbarn Barista Oat Drink 12 x 1 l', category: 'Chilled', price: 24, unit: 'case', status: 'new' },
    { id: 'chili', name: 'Fireglow Chili Sauce 2 x 5 l', category: 'Stocks and sauces', price: 30.6, unit: 'case', status: 'new' },
  ],
  actions: [
    {
      id: 'menu', type: 'Place on the next menu', agent: 'gap', effort: 12, evidence: 'note', value: [150, 900], uses: 'new',
      title: 'Get {product} onto the next menu',
      saw: 'The kitchen changes its menu in about {weeks} weeks and {product} is not on the shortlist.',
      compared: '{peers} similar venues in {city} added it to a menu within one cycle.',
      why: [
        'Menu changes are the only time a new line gets a proper trial.',
        'The cost per portion is in line with what this kitchen already uses.',
        'Estimated value over the first quarter on the menu: {amount}.',
      ],
      talk: [
        'Ask {person} which dishes are being reworked and offer a sample case.',
        'Give the cost per portion on paper, not only the case price.',
        'Agree a date to hear back before the menu is printed.',
      ],
    },
    {
      id: 'shortship', type: 'Fix repeat short deliveries', agent: 'gap', effort: 10, evidence: 'note', value: [100, 550], uses: 'core',
      title: 'Fix the repeat short deliveries on {product}',
      saw: 'Delivery notes show {product} short on {n} of the last 8 deliveries.',
      compared: 'Other venues on the same delivery route, which were short on one or two.',
      why: [
        'A short delivery on a core line forces the kitchen to buy elsewhere that day.',
        'The pattern points at a stock allocation gap, not at this venue.',
        'Fixing it protects the standing order that comes with it.',
      ],
      talk: [
        'Own the problem first, then ask {person} what a substitute cost them.',
        'Log the delivery numbers and pass them to the depot lead.',
      ],
    },
    {
      id: 'spec', type: 'Hand over the spec sheet', agent: 'gap', effort: 8, evidence: 'signature', value: [60, 320], uses: 'focus',
      title: 'Hand over the spec sheet for {product}',
      saw: 'The kitchen asked about {product} and no spec sheet is on file for this venue.',
      compared: 'Venues that hold the spec sheet reorder more steadily than those that do not (sample data).',
      why: [
        'Kitchens need allergen and storage details in writing before a new line goes on a menu.',
        'The sheet is the only source for allergen statements. The rep does not improvise them.',
        'A signed copy shows the venue received the current version.',
      ],
      talk: [
        'Hand over the printed sheet and point to the allergen table.',
        'If asked something the sheet does not cover, log it for the product team.',
      ],
      guardrail: 'Allergen and nutrition statements come only from the current spec sheet. The agent never makes its own.',
    },
    {
      id: 'standing', type: 'Set up a standing order', agent: 'order', effort: 10, evidence: 'note', value: [200, 1100], uses: 'core', segments: ['dining', 'canteens'],
      title: 'Set up a standing order for {product}',
      saw: '{product} has been ordered in {weeks} of the last 8 weeks, in similar quantities each time.',
      compared: 'This venue\'s own order history, which varies by less than a case a week.',
      why: [
        'A standing order saves the buyer a call and the venue a stock-out.',
        'The quantity comes from the last 8 weeks, not from a target.',
        'It can be paused for closures and holidays.',
      ],
      talk: [
        'Offer it as a convenience with an easy way to change it.',
        'Agree the cut-off day for changes.',
      ],
    },
    {
      id: 'cover', type: 'Check stock room cover', agent: 'order', effort: 8, evidence: 'photo', value: [120, 600], uses: 'core',
      title: 'Check stock room cover before {event}',
      saw: 'Counts from the last two visits show about {days} days of cover on {product}.',
      compared: 'Expected demand in the weeks around {event}, {eventDays} days away.',
      why: [
        'Busy weeks cause the most emergency orders.',
        'A top-up is cheaper than an emergency delivery for both sides.',
        'The photo records what was actually on the shelf.',
      ],
      talk: [
        'Walk the store room with {person} and count together.',
        'Order to the event, not to the month.',
      ],
    },
    {
      id: 'trial', type: 'Offer a tasting trial', agent: 'gap', effort: 15, evidence: 'note', value: [100, 500], uses: 'new', segments: ['dining', 'hotels'],
      title: 'Offer a tasting trial of {product}',
      saw: '{product} launched {weeks} weeks ago and this kitchen has not tried it.',
      compared: 'Trial-to-order rate for venues of this type in {area} and nearby (sample data).',
      why: [
        'Chefs decide on taste and yield, not on a brochure.',
        'A small trial case carries little risk for the venue.',
        'Trial feedback goes straight back to the product team.',
      ],
      talk: [
        'Ask {person} for the dish they would try it in first.',
        'Leave a one-page feedback card with the sample.',
        'Agree when to call back for the verdict.',
      ],
    },
    {
      id: 'coldchain', type: 'Check cold chain on delivery', agent: 'gap', effort: 10, evidence: 'photo', value: [80, 400], uses: 'core', segments: ['hotels', 'canteens'],
      title: 'Check the cold chain on the chilled drop',
      saw: 'The last two delivery checks for this venue have no temperature reading on the receiving log.',
      compared: 'The receiving checklist agreed with this venue.',
      why: [
        'A missing reading is the first thing an inspector asks about.',
        'It protects the venue and the depot if a product is questioned.',
        'The photo of the log is the record.',
      ],
      talk: [
        'Show {person} where the reading goes on the receiving log.',
        'If the venue has no probe, report it to the regional manager.',
      ],
    },
    {
      id: 'seasonal', type: 'Plan the seasonal stock-up', agent: 'order', effort: 12, evidence: 'note', value: [250, 1400], uses: 'focus', segments: ['hotels', 'canteens'],
      title: 'Plan the stock-up for {event}',
      saw: 'Banquet and cycle-menu bookings show higher covers in the weeks around {event}.',
      compared: 'This venue\'s order volumes in the same weeks last year (sample data).',
      why: [
        'Bookings are known weeks ahead, so stock can be planned, not rushed.',
        '{product} is on the seasonal menu.',
        'Early orders let the depot hold stock for this venue.',
      ],
      talk: [
        'Go through the booking calendar with {person}.',
        'Agree a plan with a review point, not a single big order.',
      ],
    },
    {
      id: 'window', type: 'Move the visit to a quiet window', agent: 'planner', effort: 3, evidence: 'note', value: [30, 120], uses: 'none',
      title: 'Move the next {visit} to the quiet window',
      saw: '{n} of the last four {visits} landed in the lunch rush.',
      compared: 'The service hours this venue shared with the depot.',
      why: [
        'Buyers give more attention between services.',
        'A shorter {visit} in a quiet window beats a longer one in a rush.',
        'It avoids a repeat {visit} to the same venue.',
      ],
      talk: [
        'Ask {person} when the kitchen is calmest.',
        'Confirm the new time by message the day before.',
      ],
    },
    {
      id: 'invoice', type: 'Log an open invoice query', agent: 'gap', effort: 6, evidence: 'note', value: [20, 140], uses: 'none',
      title: 'Log the open invoice query',
      saw: 'The venue raised a query on its last statement and there is no reply on file.',
      compared: 'The accounts team queue, where queries older than a week are flagged.',
      why: [
        'Unanswered queries slow orders more than a price rise does.',
        'The rep logs it. The accounts team resolves it.',
        'The venue hears back sooner when the query has the invoice number.',
      ],
      talk: [
        'Ask {person} for the invoice number and what looks wrong.',
        'Tell them who will reply and by when.',
      ],
      guardrail: 'The agent never changes an invoice, a credit note or a payment term. The accounts team does.',
    },
  ],
  orderReasons: {
    core: ['Averages {avg} units a week. About {cover} days of cover left.', 'Ordered in most of the last {weeks} weeks.', 'Covers the shortfall found today.'],
    focus: ['Supports the plan for {event}.', 'Focus line this cycle. The kitchen has it on a dish.'],
    new: ['Trial quantity for {weeks} weeks.', 'Listed by similar venues nearby. Start with one case.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 2500, route: 'manager', text: '{Orders} above {limit} need {manager} approval.' },
    { kind: 'info', text: 'Prices come from the contract price list. The agent cannot change them.' },
  ],
  overrideReasons: [
    { label: 'Buyer is away this week', route: 'manager' },
    { label: 'The kitchen already chose its supplier', route: 'manager' },
    { label: 'Not allowed under the supply contract', route: 'kam' },
    { label: 'The data looks wrong', route: 'manager' },
    { label: 'Not enough time in this visit', route: 'manager' },
    { label: 'Other', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Buyer said no', blocked: false },
    { label: 'Product out of stock at the depot', blocked: true },
    { label: 'Account on a credit hold', blocked: true, route: 'kam' },
    { label: 'Kitchen too busy to talk', blocked: false },
  ],
  visitNotes: [
    'Order taken, {n} lines.', 'Store room counted with the chef. Top-up agreed.', 'Buyer away. Order taken by phone.',
    'Sample case left for the next menu meeting.', 'Spec sheet handed over and signed for.',
  ],
  kpis: [
    { id: 'range', label: 'Core range ordered', format: 'pct', range: [55, 95], target: 85 },
    { id: 'fill', label: 'Order fill rate', format: 'pct', range: [82, 99], target: 96 },
    { id: 'lines', label: 'Lines per order', format: 'count', range: [4, 16], target: 12 },
    { id: 'menu', label: 'Menu placements this quarter', format: 'count', range: [0, 5], target: 3, segments: ['dining', 'hotels'] },
    { id: 'standing', label: 'Standing orders in place', format: 'pct', range: [20, 80], target: 60 },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Follows the contract price list. Never suggests a price or terms outside it.' },
    { id: 'gap1', agent: 'gap', text: 'Allergen and nutrition statements come only from the current spec sheet.' },
    { id: 'order1', agent: 'order', text: 'Never suggests more stock than the venue can store and use before the date code.' },
    { id: 'planner1', agent: 'planner', text: 'Never drops a hotel or caterer on a supply contract without the regional manager.' },
  ],
  problems: [
    { title: 'The biggest kitchens get the same call as the smallest', text: 'Calls follow habit and the van route. Hotels and caterers with a large menu spend get a monthly call, while small cafes get a weekly one.', capability: 'potential' },
    { title: 'Short deliveries are found at the door', text: 'The kitchen finds the gap when the driver leaves. By then the chef has bought the line from someone else.', capability: 'gaps' },
    { title: 'New lines wait for a menu that nobody planned for', text: 'Menu changes are the one chance to get a new product tried. Reps usually hear about them after the menu is printed.', capability: 'ranking' },
    { title: 'Calls land in the lunch rush', text: 'Fixed routes ignore service hours. The buyer is plating covers while the rep waits at the back door.', capability: 'planning' },
    { title: 'Orders are phoned in from memory', text: 'Reps repeat last week\'s order. Seasonal peaks and new lines are not in it until the kitchen runs out.', capability: 'order' },
    { title: 'We cannot show what was agreed with the kitchen', text: 'Spec sheets, sample trials and receiving checks are on paper or in the rep\'s head. A query months later has no record.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this venue first today?', a: 'It has the most value across its actions and its order, and it is open for calls in the window before the next venue.' },
    { q: 'Which venues are due a menu conversation?', a: 'The ones whose kitchens change menu within a few weeks and have a new product not yet trialed. The Gap agent ranks those first.' },
    { q: 'What should I say about a new product?', a: 'Offer a sample case, give the cost per portion in writing, and agree when you will call back for the verdict.' },
    { q: 'Can I give an allergen answer from memory?', a: 'No. Allergen and nutrition statements come only from the current spec sheet. Hand it over and log any question it does not cover.' },
    { q: 'How did the draft arrive at these quantities?', a: 'From the venue\'s weekly average, the days of cover from the last count and the delivery cycle. You can change any line.' },
    { q: 'Where does an override go?', a: 'It goes to your regional manager with your reason. An override is feedback for the agents, not a mark against you.' },
    { q: 'Which venues have I not seen for a month?', a: 'Check the hotels and caterers with the longest gap. The Visit Planner puts them on the next routes.' },
    { q: 'Should I trust a low confidence item?', a: 'Each item shows a confidence level. Low confidence means thin data, so check the store room before acting.' },
  ],
  storyline: [
    'Pick Foodservice distribution and the prospect\'s country. Say it is sample data.',
    'Today: the rep\'s venues, ranked by value, with local cities and currency.',
    'Open the first visit brief. Approve the menu action. Override the next with "Not allowed under the supply contract".',
    'Open an action: the reasons, the talking points and the spec sheet guardrail.',
    'Order: change a line, then show the approval rule when the total passes the limit.',
    'Complete the visit, then switch to the regional manager. The override is in the exception queue.',
    'Agent controls: press stop on the Order agent and watch its lines pause in the brief.',
    'How this is configured: venues, products, actions and KPIs. "This is a configuration, not a custom build."',
  ],
  forbidden: ['patient', 'clinic', 'physician', 'dealer', 'farmer', 'loan', 'workshop'],
};
