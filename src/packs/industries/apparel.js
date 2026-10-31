// Apparel and footwear wholesale: department stores, boutiques and online sellers.
// All brand, style and store names are fictional.

import assistant from './apparel.assistant.js';
import companion from './apparel.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'apparel',
  name: 'Apparel and footwear',
  tagline: 'Department stores, boutiques and online sellers',
  icon: 'heart',
  accent: '#A21CAF',
  vocab: {
    account: 'retailer', accounts: 'retailers',
    contact: 'buyer', contacts: 'buyers',
    rep: 'wholesale rep', reps: 'wholesale reps',
    manager: 'area manager', kam: 'key account manager',
    offering: 'style', offerings: 'styles',
    order: 'order', orders: 'orders',
    visit: 'visit', visits: 'visits',
  },
  personas: { rep: 'Wholesale rep', manager: 'Area manager', admin: 'Commercial operations lead' },
  segments: [
    {
      id: 'dept', name: 'Department stores', share: 0.2, key: true, visitMinutes: [45, 60],
      style: 'Appointment with the buyer, built around the season plan, the floor layout and the order budget.',
      annualValue: [80000, 280000], hours: [9 * 60, 17 * 60], orderQty: [6, 22],
      types: [
        { type: 'Department store', naming: 'institution', words: { en: ['Department Store', 'Emporium', 'Fashion House'], pt: ['Magazine', 'Loja de Departamentos'], es: ['Almacén', 'Grandes Almacenes'], de: ['Kaufhaus', 'Modehaus'], id: ['Toserba', 'Pusat Mode'], fr: ['Grand Magasin', 'Maison de Mode', 'Galerie'] } },
      ],
      roles: ['Fashion buyer', 'Footwear buyer', 'Merchandise planner'],
    },
    {
      id: 'boutique', name: 'Independent boutiques', share: 0.5, visitMinutes: [20, 35],
      style: 'Relationship visit with the owner, often by appointment, with a sample bag and a size chart.',
      annualValue: [9000, 38000], hours: [10 * 60, 18 * 60], orderQty: [2, 8],
      types: [
        { type: 'Boutique', naming: 'family', words: { en: ['Boutique', 'Style House', 'Wardrobe'], pt: ['Butique', 'Moda'], es: ['Boutique', 'Moda'], de: ['Modeladen', 'Boutique'], id: ['Butik', 'Rumah Mode'], fr: ['Boutique', 'Maison de Style', 'Garde-Robe'] } },
        { type: 'Shoe shop', naming: 'family', words: { en: ['Footwear', 'Shoe Room', 'Soles'], pt: ['Calçados', 'Sapataria'], es: ['Zapatería', 'Calzado'], de: ['Schuhhaus', 'Schuhe'], id: ['Toko Sepatu', 'Alas Kaki'], fr: ['Chaussures', 'Cordonnerie Mode', 'Pointure'] } },
      ],
      roles: ['Owner', 'Store manager'],
    },
    {
      id: 'online', name: 'Online and marketplace sellers', share: 0.3, visitMinutes: [20, 30],
      style: 'Scheduled call, often by video, led by sell-through data, images and return reasons.',
      annualValue: [15000, 70000], hours: [9 * 60, 17 * 60], orderQty: [3, 12],
      types: [
        { type: 'Online seller', words: { en: ['Direct', 'Online Store', 'Marketplace'], pt: ['Loja Virtual', 'Digital'], es: ['Tienda en Línea', 'Digital'], de: ['Onlineshop', 'Direkt'], id: ['Toko Online', 'Daring'], fr: ['Boutique en Ligne', 'Direct', 'Digital'] } },
      ],
      roles: ['Category manager', 'Buyer'],
    },
  ],
  offerings: [
    { id: 'runner', name: 'Trailmark Everyday Runner, size run of 12', category: 'Footwear', price: 420, unit: 'size run', status: 'core' },
    { id: 'boot', name: 'Fieldline Leather Boot, size run of 12', category: 'Footwear', price: 540, unit: 'size run', status: 'core' },
    { id: 'tee', name: 'Brightseam Cotton Tee, carton of 24', category: 'Tops', price: 260, unit: 'carton', status: 'core' },
    { id: 'jeans', name: 'Denimcraft Straight Jean, curve of 24', category: 'Bottoms', price: 610, unit: 'curve', status: 'core' },
    { id: 'socks', name: 'Softstride Sports Socks, 12 pack', category: 'Accessories', price: 72, unit: 'box', status: 'core' },
    { id: 'jacket', name: 'Northhaven Rain Jacket, curve of 12', category: 'Outerwear', price: 690, unit: 'curve', status: 'focus' },
    { id: 'knit', name: 'Woolmere Merino Sweater, carton of 12', category: 'Knitwear', price: 480, unit: 'carton', status: 'focus' },
    { id: 'tote', name: 'Carryall Canvas Tote, carton of 20', category: 'Accessories', price: 150, unit: 'carton', status: 'new' },
    { id: 'trainer', name: 'Pacelight Recycled Trainer, size run of 12', category: 'Footwear', price: 470, unit: 'size run', status: 'new' },
  ],
  actions: [
    {
      id: 'sizes', type: 'Restore a broken size run', agent: 'gap', effort: 10, evidence: 'scan', value: [150, 800], uses: 'core',
      title: 'Restore the missing sizes on {product}',
      saw: 'The retailer\'s stock file shows {product} sold out in {n} of its middle sizes while the end sizes remain.',
      compared: 'The size curve of the {peers} best-selling retailers of this style in {city}.',
      why: [
        'Middle sizes sell first, and a broken run loses the customer, not just the sale.',
        'The depot has the missing sizes in stock today.',
        'A repaired run lets the style keep its floor space.',
      ],
      talk: [
        'Show {person} the stock file and the size curve side by side.',
        'Propose only the missing sizes, not a full run.',
        'Agree a delivery date before the next weekend.',
      ],
    },
    {
      id: 'reorder', type: 'Take an in-season reorder', agent: 'order', effort: 12, evidence: 'note', value: [250, 1500], uses: 'core',
      title: 'Take a reorder on {product} while it is selling',
      saw: 'Sell-through of {product} is {pct}% in the first {weeks} weeks, ahead of the plan for this retailer.',
      compared: 'The retailer\'s own season plan and the sell-through of similar retailers.',
      why: [
        'Fast sellers run out before the season ends.',
        'Reorder lead time is short only while fabric is held at the factory.',
        'The quantity follows actual sales, not the original forecast.',
      ],
      talk: [
        'Open with the sell-through figure and ask {person} how the floor feels.',
        'Offer a reorder sized to four weeks of sales.',
      ],
    },
    {
      id: 'preseason', type: 'Take the pre-season order', agent: 'order', effort: 20, evidence: 'note', value: [400, 2400], uses: 'focus', segments: ['dept', 'boutique'],
      title: 'Take the pre-season order before {event}',
      saw: 'The retailer\'s order budget for the next season is open and {eventDays} days remain before {event}.',
      compared: 'Last season\'s order and what sold through.',
      why: [
        'Pre-season orders get the best delivery dates.',
        '{product} is in the range plan for the coming season.',
        'The agreed order budget is known, so the order can be sized to it.',
      ],
      talk: [
        'Walk {person} through last season\'s winners and misses first.',
        'Build the new order around the agreed budget, not above it.',
        'Book a follow-up to confirm sizes.',
      ],
    },
    {
      id: 'floor', type: 'Reset the floor display', agent: 'gap', effort: 15, evidence: 'photo', value: [100, 650], uses: 'focus', segments: ['dept', 'boutique'],
      title: 'Reset the floor display for {product}',
      saw: 'The last floor photo shows {product} on a back wall with no mannequin or table space.',
      compared: 'The visual guide for this season and photos from {peers} similar retailers.',
      why: [
        'Styles on a front table sell faster than the same style on a back rail.',
        'The visual guide is approved and the props are in the car.',
        'The retailer keeps control of its layout. The rep only proposes.',
      ],
      talk: [
        'Ask {person} which table or wall can carry the story.',
        'Offer to set it yourself and take down last season\'s props.',
      ],
    },
    {
      id: 'newstyle', type: 'Show a new style', agent: 'gap', effort: 12, evidence: 'note', value: [150, 900], uses: 'new',
      title: 'Show {product} from the new range',
      saw: '{product} arrived {weeks} weeks ago and this retailer has not seen it in person.',
      compared: '{pct}% of similar retailers in {city} have ordered a first run of it.',
      why: [
        'Buyers decide on touch and fit, not on photos.',
        'First orders get the early delivery slots.',
        'The sample set is in the car.',
      ],
      talk: [
        'Let {person} handle the sample before you describe it.',
        'Suggest a small first run in the core sizes.',
      ],
    },
    {
      id: 'aged', type: 'Review aged stock', agent: 'gap', effort: 10, evidence: 'note', value: [80, 480], uses: 'core',
      title: 'Review the aged stock of {product}',
      saw: '{qty} units of {product} have sat in the store for more than {weeks} weeks.',
      compared: 'The retailer\'s own aging report and the trade agreement terms on returns and exchanges.',
      why: [
        'Aged stock ties up the retailer\'s budget for the next season.',
        'The trade agreement may allow an exchange within a set window.',
        'Clearing space early keeps the floor fresh.',
      ],
      talk: [
        'Ask {person} what they plan to do with the stock.',
        'Explain the exchange window in the trade agreement and note the date.',
      ],
      guardrail: 'The retailer sets its own resale prices. The agent never recommends a resale price or markdown.',
    },
    {
      id: 'images', type: 'Send product images and size charts', agent: 'gap', effort: 8, evidence: 'note', value: [60, 340], uses: 'focus', segments: ['online'],
      title: 'Send product images and size charts for {product}',
      saw: 'The seller\'s listings for {product} use older images and no size chart.',
      compared: 'Sellers with a current size chart and images, which show fewer fit-related returns.',
      why: [
        'Fit questions are the main reason for returns online.',
        'The image pack and chart are ready to send.',
        'Better listings help the style sell without discounting.',
      ],
      talk: [
        'Ask {person} how listings are updated and who does it.',
        'Share the pack and confirm they received it.',
      ],
    },
    {
      id: 'returns', type: 'Review the returns pattern', agent: 'gap', effort: 10, evidence: 'note', value: [60, 380], uses: 'none', segments: ['online', 'boutique'],
      title: 'Review the returns pattern with the {contact}',
      saw: 'Return reasons on this retailer\'s last {n} returns point to fit and sizing, not quality.',
      compared: 'The return reason codes shared in the monthly report.',
      why: [
        'Fit problems can often be fixed with a chart or a size note.',
        'Quality problems need a different team, so the reason matters.',
        'The pattern is only visible when the codes are read together.',
      ],
      talk: [
        'Go through the reasons with {person} one by one.',
        'Log any quality issue for the product team.',
      ],
    },
    {
      id: 'sample', type: 'Leave a next-season sample set', agent: 'gap', effort: 15, evidence: 'signature', value: [100, 700], uses: 'new', segments: ['dept', 'boutique'],
      title: 'Leave a sample set of {product} for next season',
      saw: 'Next season\'s buying window opens in {weeks} weeks and this retailer holds no sample set.',
      compared: 'Retailers that held samples before the window opened placed larger first orders.',
      why: [
        'A buyer who can try on the sample orders with more confidence.',
        'The signed receipt tracks where the sample set is.',
        'Sample sets return to the showroom after the window.',
      ],
      talk: [
        'Agree who in the team will handle the samples.',
        'Set the date for pick-up in the signed receipt.',
      ],
    },
    {
      id: 'trading', type: 'Visit outside the trading peak', agent: 'planner', effort: 3, evidence: 'note', value: [30, 120], uses: 'none',
      title: 'Move the next {visit} away from the trading peak',
      saw: '{n} of the last four {visits} fell on a Saturday or a promotion day.',
      compared: 'The retailer\'s trading calendar shared with the showroom.',
      why: [
        'Buyers and owners are on the floor during peaks.',
        'A quieter weekday gives time to look at the range properly.',
        'It avoids a wasted trip.',
      ],
      talk: [
        'Ask {person} which weekday works best.',
        'Send a confirmation the day before.',
      ],
    },
  ],
  orderReasons: {
    core: ['Selling about {avg} units a week. {cover} weeks of cover left.', 'Sold through {qty} units in the last four weeks.', 'Repairs the sizes missing today.'],
    focus: ['Fits the range plan for {event}.', 'Focus style this season. The retailer has floor space.'],
    new: ['First run of {weeks} weeks for the new range.', 'Similar retailers nearby have ordered it. Start with the core sizes.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 6000, route: 'manager', text: '{Orders} above {limit} need {manager} approval.' },
    { kind: 'info', text: 'Wholesale prices come from the season price list. The agent cannot change them or suggest resale prices.' },
  ],
  overrideReasons: [
    { label: 'Buyer is away this week', route: 'manager' },
    { label: 'The retailer already bought the range elsewhere', route: 'manager' },
    { label: 'Not allowed under the trade agreement', route: 'kam' },
    { label: 'The data looks wrong', route: 'manager' },
    { label: 'Not enough time in this visit', route: 'manager' },
    { label: 'Other', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Buyer said no', blocked: false },
    { label: 'Style sold out at the showroom', blocked: true },
    { label: 'Retailer on a credit hold', blocked: true, route: 'kam' },
    { label: 'Buyer in a meeting, no time', blocked: false },
  ],
  visitNotes: [
    'Order taken, {n} lines.', 'Sample set shown. Buyer to decide next {visit}.', 'Buyer away. Order confirmed by phone.',
    'Size run repaired and floor display reset.', 'Returns reasons reviewed with the team.',
  ],
  kpis: [
    { id: 'sellthru', label: 'Sell-through this season', format: 'pct', range: [35, 85], target: 70 },
    { id: 'sizes', label: 'Size runs complete', format: 'pct', range: [50, 98], target: 90 },
    { id: 'styles', label: 'Styles ordered this season', format: 'count', range: [3, 18], target: 12 },
    { id: 'reorder', label: 'Styles with an in-season reorder', format: 'pct', range: [10, 70], target: 40 },
    { id: 'returns', label: 'Return rate', format: 'pct', range: [4, 28], target: 12, lowerIsBetter: true, segments: ['boutique', 'online'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Follows the trade agreement and the season price list. Never offers terms outside them.' },
    { id: 'gap1', agent: 'gap', text: 'The retailer sets its own resale prices. The agent never recommends one.' },
    { id: 'order1', agent: 'order', text: 'Never suggests an order above the retailer\'s agreed order budget.' },
    { id: 'planner1', agent: 'planner', text: 'Never drops a department store on a trade agreement without the area manager.' },
  ],
  problems: [
    { title: 'Big department stores and small boutiques get the same visit', text: 'Calls follow the showroom calendar, not the order potential. A department store with a large budget gets one season visit and a small boutique gets three.', capability: 'potential' },
    { title: 'Broken size runs are found at the end of the season', text: 'The middle sizes sell out in week two. The retailer finds out in week eight, and we find out when the sell-through report arrives.', capability: 'gaps' },
    { title: 'Reps show everything and decide nothing', text: 'A bag of samples and a long range list. The three styles that matter for this retailer are not ranked above the rest.', capability: 'ranking' },
    { title: 'Visits land on trading peaks and buying deadlines', text: 'A Saturday visit or a visit after the buying window closes loses the order. Calendars sit in several places.', capability: 'planning' },
    { title: 'Orders repeat last season\'s curve', text: 'The same sizes and styles, in the same ratio. Sell-through and size problems are not in the order until it is too late.', capability: 'order' },
    { title: 'We cannot show what was agreed in the showroom', text: 'Sample receipts, exchange windows and display agreements are in emails. A dispute later has no record.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this retailer first today?', a: 'It has the largest value across its actions and its order, and its buying window fits before the next appointment.' },
    { q: 'Which retailers have broken size runs?', a: 'The ones whose stock files show end sizes left and middle sizes gone. The Gap agent ranks the repair first.' },
    { q: 'What should I say about the new style?', a: 'Let the buyer handle the sample first, suggest a small first run in core sizes and agree a date to confirm the order.' },
    { q: 'Can I suggest a retail price?', a: 'No. The retailer sets its own resale prices. I can show the wholesale price list and what sold through.' },
    { q: 'How did the draft decide the quantities?', a: 'From sell-through, the weeks of cover left and the agreed order budget. You can change any line.' },
    { q: 'Who sees my override?', a: 'It goes to your area manager with your reason. An override is feedback for the agents, not a mark against you.' },
    { q: 'Which retailers have I not seen this season?', a: 'Check the department stores with the longest gap since the last appointment. The Visit Planner puts them on the next routes.' },
    { q: 'How sure is the agent about this item?', a: 'Each item shows a confidence level. Low confidence means thin data, so look at the stock file before acting.' },
  ],
  storyline: [
    'Pick Apparel and footwear and the prospect\'s country. Say all data is fictional demonstration data.',
    'Today: the rep\'s retailers, ranked by value, with local cities and currency.',
    'Open the first visit brief. Approve the size run repair. Override the pre-season order with "Not allowed under the trade agreement".',
    'Open an action: the reasons, the talking points and the resale price guardrail.',
    'Order: edit a quantity, then show the approval rule when the total passes the limit.',
    'Complete the visit, then switch to the area manager. The override is in the exception queue.',
    'Agent controls: stop the Order agent and see its reorders pause in the brief.',
    'How this is configured: retailers, styles, actions and KPIs. "This is a configuration, not a custom build."',
  ],
  forbidden: ['patient', 'clinic', 'physician', 'farmer', 'loan', 'crib', 'chef'],
};
