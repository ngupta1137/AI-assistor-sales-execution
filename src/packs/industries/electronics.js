// Consumer electronics: large format stores and multi-brand outlets. Model names are coined.
// Price promises follow the retailer agreement; product claims use the approved feature sheet.

import assistant from './electronics.assistant.js';
import companion from './electronics.companion.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  id: 'electronics',
  name: 'Consumer electronics',
  tagline: 'Electronics stores and multi-brand outlets',
  icon: 'screen',
  accent: '#4338CA',
  vocab: {
    account: 'store', accounts: 'stores',
    contact: 'store manager', contacts: 'store managers',
    rep: 'retail account manager', reps: 'retail account managers',
    manager: 'regional sales manager', kam: 'key account manager',
    offering: 'model', offerings: 'models',
    order: 'order', orders: 'orders',
    visit: 'visit', visits: 'visits',
  },
  personas: { rep: 'Retail account manager', manager: 'Regional sales manager', admin: 'Retail operations lead' },
  segments: [
    {
      id: 'chain', name: 'Large format stores', share: 0.4, key: true, visitMinutes: [35, 50],
      style: 'Chain store visit: display compliance, promoters and launch execution.',
      annualValue: [120000, 400000], hours: [10 * 60, 22 * 60], orderQty: [3, 12],
      types: [{ type: 'Electronics superstore', words: { en: ['Electronics Superstore', 'Tech Hall'], fr: ['Espace Électronique', 'Maison du Numérique'], pt: ['Mega Eletrônicos', 'Casa da Tecnologia'], es: ['Mega Electrónica', 'Casa de la Tecnología'], de: ['Elektromarkt', 'Technik-Center'], id: ['Mega Elektronik', 'Pusat Elektronik'] } }],
      roles: ['Store manager', 'Department manager', 'In-store promoter'],
    },
    {
      id: 'mbo', name: 'Multi-brand outlets', share: 0.6, visitMinutes: [20, 30],
      style: 'Multi-brand outlet visit: share of display, demo units and weekly sell-out.',
      annualValue: [25000, 90000], hours: [10 * 60, 21 * 60 + 30], orderQty: [2, 8],
      types: [{ type: 'Multi-brand outlet', naming: 'family', words: { en: ['Electronics', 'Digital', 'Appliances'], fr: ['Électronique', 'Numérique', 'Électroménager'], pt: ['Eletrônicos', 'Eletro'], es: ['Electrónica', 'Electrodomésticos'], de: ['Elektro', 'Technik'], id: ['Elektronik', 'Electronic'] } }],
      roles: ['Store owner', 'Floor manager'],
    },
  ],
  offerings: [
    { id: 'tv55', name: 'Lumora 55-inch 4K TV', category: 'TVs', price: 420, unit: 'unit', status: 'core', qty: [2, 8] },
    { id: 'tv65', name: 'Lumora 65-inch QLED TV', category: 'TVs', price: 690, unit: 'unit', status: 'focus', qty: [1, 6] },
    { id: 'tv43', name: 'Lumora 43-inch Smart TV', category: 'TVs', price: 260, unit: 'unit', status: 'core', qty: [2, 10] },
    { id: 'bar', name: 'Lumora 3.1 Soundbar', category: 'Audio', price: 160, unit: 'unit', status: 'focus' },
    { id: 'x9', name: 'Veyra X9 smartphone', category: 'Phones', price: 520, unit: 'unit', status: 'new' },
    { id: 'a5', name: 'Veyra A5 smartphone', category: 'Phones', price: 190, unit: 'unit', status: 'core' },
    { id: 'buds', name: 'Veyra Buds 2', category: 'Audio', price: 70, unit: 'unit', status: 'core' },
    { id: 'lap', name: 'Corvant 14 laptop', category: 'Laptops', price: 610, unit: 'unit', status: 'new', qty: [1, 5] },
    { id: 'wash', name: 'Aquella 8 kg front-load washer', category: 'Appliances', price: 380, unit: 'unit', status: 'core', qty: [1, 4] },
    { id: 'demo', name: 'Display demo unit (not for sale)', category: 'Display', price: 0, unit: 'unit', status: 'focus', kind: 'demo', qty: [1, 2] },
  ],
  actions: [
    {
      id: 'demolive', type: 'Make a demo unit live', agent: 'gap', effort: 10, evidence: 'photo', value: [200, 900], uses: 'focus',
      title: 'Get the {product} demo unit live',
      saw: 'The {product} demo unit was switched off in the last photo.',
      compared: 'Display standard: every demo unit on and running the store demo.',
      why: [
        'Shoppers choose by watching and touching.',
        'A dark screen sells the next brand on the wall.',
        'Estimated sell-out at risk this month: {amount}.',
      ],
      talk: [
        'Check power and the demo loop with {person}.',
        'Ask the promoter to switch it on at opening each day.',
      ],
    },
    {
      id: 'promoter', type: 'Train promoters', agent: 'gap', effort: 20, evidence: 'signature', value: [200, 800], uses: 'new',
      title: 'Train promoters on {product}',
      saw: '{n} promoters joined since the last launch training.',
      compared: 'Launch training records for this store.',
      why: [
        'Promoters steer most premium purchases on the floor.',
        'Training uses the approved feature sheet only.',
        'Each promoter signs the training log.',
      ],
      talk: [
        'Walk through the three features shoppers ask about most.',
        'Rehearse one comparison question using only approved points.',
      ],
      guardrail: 'Product claims use the approved feature sheet only.',
    },
    {
      id: 'tags', type: 'Fix price tags', agent: 'gap', effort: 8, evidence: 'photo', value: [80, 300], uses: 'core',
      title: 'Fix the price tag on {product}',
      saw: 'The tag for {product} does not match this week\'s promotion.',
      compared: 'Retailer promotion file for this week.',
      why: [
        'Shoppers walk away when the tag and the till disagree.',
        'The retailer sets the price. The rep flags the mismatch.',
        'It takes minutes.',
      ],
      talk: [
        'Show {person} the promotion file and the wrong tag.',
        'Photograph the corrected tag.',
      ],
      guardrail: 'The retailer sets prices. The agent flags mismatches and never promises a price.',
    },
    {
      id: 'sellout', type: 'Track sell-out', agent: 'gap', effort: 10, evidence: 'scan', value: [100, 500], uses: 'core', segments: ['mbo'],
      title: 'Capture weekly sell-out for {product}',
      saw: 'No sell-out report from this store for {weeks} weeks.',
      compared: 'Sell-out at {peers} similar stores.',
      why: [
        'Without sell-out, restock and support go to the wrong stores.',
        'A shelf and stock room scan takes ten minutes.',
        'The owner gets a free view of the brand\'s weekly trend.',
      ],
      talk: [
        'Scan stock with {person} and confirm units sold.',
        'Agree a weekly report by message.',
      ],
    },
    {
      id: 'launch', type: 'Set up a launch display', agent: 'gap', effort: 25, evidence: 'photo', value: [500, 2500], uses: 'new', segments: ['chain'],
      title: 'Set up the launch display for {product}',
      saw: 'The launch kit for {product} was delivered but the display is not built.',
      compared: 'Launch execution checklist for large format stores.',
      why: [
        '{event} is {eventDays} days away.',
        'Launch weeks set the model\'s place in the store for the season.',
        'Estimated launch value in this store: {amount}.',
      ],
      talk: [
        'Agree the location with {person} from the launch plan.',
        'Check the demo units and price cards before you leave.',
      ],
    },
    {
      id: 'wall', type: 'Win display share', agent: 'gap', effort: 15, evidence: 'photo', value: [300, 1200], uses: 'focus',
      title: 'Gain wall space for {product}',
      saw: 'Brand share of the TV wall is below the agreed share in the last photo.',
      compared: 'Display share in the retailer agreement.',
      why: [
        'Wall share drives sell-out share.',
        'The agreement gives the brand this space.',
        'Premium models need eye-level positions.',
      ],
      talk: [
        'Show {person} the agreed layout.',
        'If the space was sold to another brand, log it for the key account manager.',
      ],
    },
    {
      id: 'restock', type: 'Restock fast sellers', agent: 'order', effort: 8, evidence: 'scan', value: [300, 1200], uses: 'core',
      title: 'Restock {product} before the weekend',
      saw: 'Store stock of {product} covers about {days} days of sales.',
      compared: 'This store\'s weekly sell-out trend.',
      why: [
        'Weekends bring most of the week\'s footfall.',
        'Distributor delivery takes two days.',
        'Units are already in the suggested order.',
      ],
      talk: [
        'Confirm stock room counts with {person}.',
        'Order to two weeks of sell-out.',
      ],
    },
    {
      id: 'aged', type: 'Move aged stock', agent: 'gap', effort: 8, evidence: 'scan', value: [150, 600], uses: 'core', segments: ['mbo'],
      title: 'Plan a move for aged stock of {product}',
      saw: '{qty} units of {product} have been in stock for more than 90 days.',
      compared: 'Stock age policy agreed with the store.',
      why: [
        'Old models block space for new ones.',
        'Any price move needs retailer and brand approval.',
        'A bundle often moves stock without a price cut.',
      ],
      talk: [
        'Propose a bundle with accessories.',
        'Do not promise price protection.',
      ],
    },
    {
      id: 'competitor', type: 'Log competitor activity', agent: 'gap', effort: 5, evidence: 'photo', value: [50, 200], uses: 'none',
      title: 'Photograph the new competitor display',
      saw: 'Promoters report a new competitor display near the entrance.',
      compared: 'Competitor activity logged in {city} this month.',
      why: [
        'Head office plans the response from field photos.',
        'Early notice protects launch weeks.',
        'It takes two minutes.',
      ],
      talk: [
        'Ask {person} if photos are allowed.',
        'Note prices only as displayed.',
      ],
    },
    {
      id: 'weekday', type: 'Visit before the weekend rush', agent: 'planner', effort: 3, evidence: 'note', value: [30, 150], uses: 'none',
      title: 'Book the next {visit} on a weekday morning',
      saw: '{n} of the last four visits were on Saturdays when staff were busy.',
      compared: 'Footfall pattern for this store.',
      why: [
        'Managers have time on weekday mornings.',
        'Displays can be fixed before the weekend crowd.',
        'Promoters can be trained before their shift fills up.',
      ],
      talk: [
        'Agree a regular weekday slot with {person}.',
        'Share the visit agenda the day before.',
      ],
    },
  ],
  orderReasons: {
    core: ['Sells about {avg} a week. About {cover} days of stock left.', 'Matches sell-out over the last four weeks.'],
    focus: ['Premium model for the {event} season.', 'Wall space agreed today.'],
    new: ['Launch model. Opening quantity.', 'Pre-orders from shoppers at this store.'],
    demo: ['Replacement demo unit for the display. Not for sale.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 8000, route: 'manager', text: '{Orders} above {limit} need {manager} approval.' },
    { kind: 'info', text: 'Price promises follow the retailer agreement. The agent never offers price protection or extra margin.' },
  ],
  overrideReasons: [
    { label: 'Store manager not available', route: 'manager' },
    { label: 'Not allowed by the retailer agreement', route: 'kam' },
    { label: 'Promoter on leave', route: 'manager' },
    { label: 'The data looks wrong', route: 'manager' },
    { label: 'Not enough time in this visit', route: 'manager' },
    { label: 'Other', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Store manager said no', blocked: false },
    { label: 'Model out of stock at the distributor', blocked: true },
    { label: 'Account on credit hold', blocked: true, route: 'kam' },
    { label: 'Display fixture broken', blocked: false },
  ],
  visitNotes: [
    'Demo units checked and live.', 'Promoters trained, {n} signed.', 'Launch display built.',
    'Sell-out captured for {n} models.', 'Price tags corrected.',
  ],
  kpis: [
    { id: 'share', label: 'Sell-out share', format: 'pct', range: [14, 38], target: 30 },
    { id: 'disp', label: 'Display compliance', format: 'pct', range: [50, 95], target: 90 },
    { id: 'demo', label: 'Demo units live', format: 'pct', range: [60, 100], target: 95 },
    { id: 'train', label: 'Promoters trained this quarter', format: 'pct', range: [40, 95], target: 90 },
    { id: 'aged', label: 'Stock older than 90 days', format: 'pct', range: [3, 18], target: 5, lowerIsBetter: true },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Price promises follow the retailer agreement. Never offers price protection.' },
    { id: 'gap1', agent: 'gap', text: 'Product claims use the approved feature sheet only.' },
    { id: 'order1', agent: 'order', text: 'Never orders more than about two weeks of sell-out for a model.' },
    { id: 'planner1', agent: 'planner', text: 'Launch weeks keep their store visits. Moving them needs the regional sales manager.' },
  ],
  problems: [
    { title: 'Big stores get visits, small ones get forgotten', text: 'Multi-brand outlets with real potential see a rep once a month.', capability: 'potential' },
    { title: 'Demo units sit dark for weeks', text: 'Nobody checks until a shopper walks out to another brand.', capability: 'gaps' },
    { title: 'Visits are spent counting stock', text: 'Promoter training and display share wait while the rep fills in a form.', capability: 'ranking' },
    { title: 'Launch weeks clash with routine visits', text: 'The rep is at a quiet store while the launch display waits elsewhere.', capability: 'planning' },
    { title: 'Orders ignore sell-out', text: 'Stores reorder what they had, so old models pile up and new ones run out.', capability: 'order' },
    { title: 'We cannot prove launch execution', text: 'Head office gets a tick box, not a photo and a sell-out trend.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Which stores have demo units switched off?', a: 'Stores where the last photo showed a dark unit. The Gap agent ranks them by sell-out at risk.' },
    { q: 'Can I promise a store price protection?', a: 'No. Price promises follow the retailer agreement. Talk to your key account manager.' },
    { q: 'Why is this outlet first today?', a: 'It has the most value at stake: a launch display to build and promoters to train.' },
    { q: 'What can promoters say about the new model?', a: 'Only points from the approved feature sheet. Training covers them one by one.' },
    { q: 'How was the restock quantity worked out?', a: 'From the store\'s weekly sell-out and two days of delivery time. Change any line.' },
    { q: 'What happens to my override?', a: 'It goes to your regional sales manager with your reason. It is feedback, not a penalty.' },
    { q: 'Which models are aging in stock?', a: 'Models older than 90 days appear as aged stock actions with a bundle suggestion.' },
    { q: 'Do I need permission to photograph a competitor display?', a: 'Ask the store manager first. Log only what is on display.' },
  ],
  storyline: [
    'Pick Consumer electronics and the prospect\'s country. Say it is sample data.',
    'Today: superstores and multi-brand outlets ranked by value.',
    'Open the first brief. Approve the demo unit fix. Override one with "Not allowed by the retailer agreement".',
    'Open the promoter training action: why now, approved claims guardrail.',
    'Order: raise a TV line and show the approval limit.',
    'Finish the visit, then switch to the regional sales manager. The override is with the key account manager.',
    'Agent controls: the price promise guardrail, then stop the Order agent.',
    'How this is configured: stores, models, actions and KPIs. "A configuration, not a custom build."',
  ],
  forbidden: ['HCP', 'clinic', 'physician', 'prescriber', 'formulary', 'merchant', 'dealer', 'workshop', 'patient', 'farmer', 'loan', 'SKU'],
};
