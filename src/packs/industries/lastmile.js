// Last-mile delivery: the commercial and network field team of a parcel delivery company.
// Covers online merchants, small shippers and the pickup point partners that hold parcels
// for collection. Drivers and dispatch are out of scope on purpose: this pack is about the
// people who win, grow and keep volume, and who keep the pickup network working.
// All carrier, merchant, partner and individual names are fictional.

import assistant from './lastmile.assistant.js';
import companion from './lastmile.companion.js';
import governance from './lastmile.governance.js';
import execution from './lastmile.execution.js';

/** @type {import('../schema.js').IndustryPack} */
export default {
  ...assistant,
  ...companion,
  ...governance,
  ...execution,
  id: 'lastmile',
  name: 'Last-mile delivery',
  tagline: 'Online merchants, small shippers and pickup points',
  icon: 'pin',
  aliases: ['last-mile', 'parcel', 'parcels', 'delivery'],
  accent: '#9C4626',
  vocab: {
    account: 'site', accounts: 'sites',
    contact: 'site contact', contacts: 'site contacts',
    rep: 'last-mile account executive', reps: 'last-mile account executives',
    manager: 'city commercial manager', kam: 'key merchant manager',
    offering: 'delivery service', offerings: 'delivery services',
    order: 'booking', orders: 'bookings',
    visit: 'site visit', visits: 'site visits',
  },
  personas: {
    rep: 'Last-mile account executive',
    manager: 'City commercial manager',
    admin: 'Network operations lead',
  },
  segments: [
    {
      id: 'merchants', name: 'Online merchants', share: 0.3, key: true, visitMinutes: [35, 55],
      style: 'Working session at the merchant fulfillment floor with the operations lead: checkout delivery options, address quality, late collection and returns, over the last four weeks of parcel data.',
      annualValue: [60000, 280000], hours: [9 * 60, 17 * 60], orderQty: [40, 220],
      types: [
        { type: 'Online merchant', naming: 'business', words: { en: ['Online Store', 'Direct', 'Goods Online'], pt: ['Loja Online', 'Vendas Diretas'], es: ['Tienda en Línea', 'Venta Directa'], de: ['Onlineshop', 'Direktversand'], id: ['Toko Daring', 'Jualan Langsung'], fr: ['Boutique en Ligne', 'Vente Directe'] } },
      ],
      roles: ['Operations lead', 'E-commerce manager', 'Warehouse supervisor'],
    },
    {
      id: 'smb', name: 'Small shippers', share: 0.35, visitMinutes: [15, 25],
      style: 'Short call at the counter or back office of a small business that ships a few dozen parcels a week, usually with the owner, between customers.',
      annualValue: [6000, 32000], hours: [9 * 60, 18 * 60], orderQty: [10, 60],
      types: [
        { type: 'Small shipper', naming: 'family', words: { en: ['Crafts', 'Trading', 'Workshop'], pt: ['Artesanato', 'Comércio'], es: ['Artesanías', 'Comercial'], de: ['Manufaktur', 'Handel'], id: ['Kerajinan', 'Dagang'], fr: ['Atelier', 'Négoce'] } },
      ],
      roles: ['Owner', 'Office manager', 'Shipping clerk'],
    },
    {
      id: 'pudo', name: 'Pickup point partners', share: 0.35, visitMinutes: [10, 20],
      style: 'Quick standards check at a partner shop that holds parcels for collection: space, scanner, signage and parcels waiting too long, timed outside the after-work pickup rush.',
      annualValue: [3000, 14000], hours: [8 * 60, 20 * 60], orderQty: [1, 4],
      types: [
        { type: 'Pickup point', naming: 'family', words: { en: ['News and Parcels', 'Corner Shop', 'Convenience'], pt: ['Banca e Encomendas', 'Mercadinho'], es: ['Kiosco y Paquetes', 'Tienda de Barrio'], de: ['Kiosk und Pakete', 'Späti'], id: ['Warung Paket', 'Toko Kelontong'], fr: ['Relais Colis', 'Épicerie du Coin'] } },
      ],
      roles: ['Shop owner', 'Shift lead', 'Counter staff'],
    },
  ],
  offerings: [
    { id: 'nextday', name: 'Next-day home delivery', category: 'Home delivery', price: 6.4, unit: 'parcel', status: 'core', segments: ['merchants', 'smb'] },
    { id: 'pudodelivery', name: 'Delivery to a pickup point', category: 'Out of home', price: 4.1, unit: 'parcel', status: 'core', segments: ['merchants', 'smb'] },
    { id: 'returnsdrop', name: 'Returns drop-off at pickup points', category: 'Returns', price: 3.6, unit: 'parcel', status: 'core', segments: ['merchants', 'smb'] },
    { id: 'eveningslot', name: 'Evening two-hour delivery slot', category: 'Home delivery', price: 8.9, unit: 'parcel', status: 'focus', segments: ['merchants'] },
    { id: 'sameday', name: 'Same-day city delivery', category: 'Home delivery', price: 11.5, unit: 'parcel', status: 'focus', segments: ['merchants'] },
    { id: 'lockerdelivery', name: 'Locker delivery', category: 'Out of home', price: 3.9, unit: 'parcel', status: 'new', segments: ['merchants', 'smb'] },
    { id: 'bulkytwo', name: 'Two-person bulky item delivery', category: 'Bulky', price: 39, unit: 'item', status: 'new', segments: ['merchants'] },
    { id: 'pudobags', name: 'Pickup point bags and label rolls', category: 'Supplies', price: null, unit: 'pack', status: 'core', segments: ['pudo'] },
    { id: 'pudoshelving', name: 'Parcel shelving extension', category: 'Supplies', price: null, unit: 'unit', status: 'focus', segments: ['pudo'] },
  ],
  actions: [
    {
      id: 'cutoff', type: 'Move the collection cutoff later', agent: 'gap', effort: 10, evidence: 'note', value: [180, 900], uses: 'core', segments: ['merchants', 'smb'],
      title: 'Agree a later collection time for {product}',
      saw: 'Parcels packed after the current collection time waited overnight on {n} of the last ten working days.',
      compared: 'Merchants of a similar size in {city} whose collection runs after their afternoon packing peak.',
      why: [
        'Parcels that miss collection add a day for the shopper, and late parcels drive delivery complaints.',
        'A later collection uses an existing driver loop, so it rarely costs a dedicated vehicle.',
        'The packing log shows when the floor actually finishes, so the new time is based on fact.',
      ],
      talk: [
        'Look at the last two weeks of packing completion times with {person}.',
        'Offer the later loop that already passes the {area} industrial estate.',
      ],
    },
    {
      id: 'checkout', type: 'Add delivery choices at checkout', agent: 'gap', effort: 14, evidence: 'note', value: [260, 1300], uses: 'focus', segments: ['merchants'],
      title: 'Show {product} as a checkout choice',
      saw: 'The checkout offers one home delivery option. {pct} percent of the merchant’s orders come from postcodes with a pickup point within a short walk.',
      compared: 'Merchants in the same category that show pickup point and evening options at checkout.',
      why: [
        'Shoppers who are out during the day choose pickup points or evening slots when they can see them.',
        'Pickup point parcels avoid failed first attempts, which cost a second trip.',
        'Each option shows the published service level only, so nothing is promised that the network cannot keep.',
      ],
      talk: [
        'Walk through the checkout on a phone with {person} and count the delivery choices.',
        'Show the published service levels for each option and leave the integration guide.',
      ],
      guardrail: 'Checkout wording uses the published service levels only. Nobody promises a delivery date or time window that the network has not published.',
    },
    {
      id: 'address', type: 'Fix address data quality', agent: 'gap', effort: 12, evidence: 'note', value: [150, 760], uses: 'core', segments: ['merchants', 'smb'],
      title: 'Cut incomplete addresses on {product} parcels',
      saw: '{pct} percent of last month’s parcels had a missing flat number or an unmatched postcode, and most of those failed at the first attempt.',
      compared: 'The share of incomplete addresses for merchants using address lookup at checkout.',
      why: [
        'A failed first attempt costs a second trip and a worse shopper experience.',
        'Address lookup at checkout fixes most errors before the label is printed.',
        'The merchant sees the failed parcels by reason, so the fix is visible within weeks.',
      ],
      talk: [
        'Open the failed-attempt report by reason with {person}.',
        'Show how address lookup works in their shop platform and agree a date to switch it on.',
      ],
    },
    {
      id: 'ratecard', type: 'Hand over the current rate card', agent: 'gap', effort: 8, evidence: 'signature', value: [60, 300], uses: 'core', segments: ['merchants', 'smb'],
      title: 'Give the current rate card for {product}',
      saw: 'The site is still quoting last year’s parcel prices to its own customers.',
      compared: 'Sites that hold the current rate card and see no billing disputes after a price change.',
      why: [
        'The rate card is the only source of prices. A signed copy prevents disputes later.',
        'Volume tiers are on the card, so the site can see what the next tier needs.',
        'Fuel and peak surcharges are explained once, in writing, before they appear on an invoice.',
      ],
      talk: [
        'Hand the printed rate card to {person} and point out the volume tiers.',
        'Explain the peak surcharge dates and ask for a signature on receipt.',
      ],
      guardrail: 'Prices come only from the published rate card. Executives never quote a price, discount or credit term that is not on it.',
    },
    {
      id: 'peakbook', type: 'Book peak capacity', agent: 'order', effort: 15, evidence: 'note', value: [300, 1500], uses: 'core', segments: ['merchants', 'smb'],
      title: 'Book peak collection capacity for {event}',
      saw: 'The merchant plans promotions before {event}, {eventDays} days away, but has not booked extra collection capacity.',
      compared: 'This site’s parcel counts in the same weeks last year.',
      why: [
        'Booked capacity is protected when the network is full. Unbooked volume waits.',
        'A daily forecast lets the depot plan drivers and vehicles before the peak.',
        'Booking early avoids surcharges that apply to late, unplanned volume.',
      ],
      talk: [
        'Go through the promotion calendar with {person} and estimate parcels per day.',
        'Book the daily volume and agree what happens if the forecast is beaten.',
      ],
    },
    {
      id: 'returnsetup', type: 'Set up returns through pickup points', agent: 'order', effort: 12, evidence: 'note', value: [140, 700], uses: 'Returns', segments: ['merchants'],
      title: 'Set up {product} for this merchant',
      saw: 'Returns run at {pct} percent of orders and shoppers must print a label at home.',
      compared: 'Merchants that let shoppers drop returns at a pickup point with a code on their phone.',
      why: [
        'Label-free drop-off makes returns easier for shoppers, which supports repeat orders.',
        'Returns come back consolidated, which is cheaper than single parcels.',
        'The merchant sees each return scanned at drop-off, so refunds can start earlier.',
      ],
      talk: [
        'Show {person} how the drop-off code works on a phone.',
        'Agree the weekly returns pallet collection.',
      ],
    },
    {
      id: 'onboard', type: 'Get the shipper using the shipping app', agent: 'gap', effort: 12, evidence: 'note', value: [80, 420], uses: 'core', segments: ['smb'],
      title: 'Switch {person} to labels from the shipping app',
      saw: 'The shipper still writes addresses by hand and books by phone. {n} parcels were re-labelled at the depot last month.',
      compared: 'Small shippers in {area} who print labels from the app and book collection online.',
      why: [
        'Printed labels remove handwriting errors that send parcels to the wrong depot.',
        'Online booking shows the collection slot straight away, without a phone call.',
        'The app keeps a history, so the shipper can track every parcel themselves.',
      ],
      talk: [
        'Install the app with {person} and print a test label together.',
        'Book the next collection in the app before you leave.',
      ],
    },
    {
      id: 'pudocap', type: 'Free up pickup point space', agent: 'gap', effort: 10, evidence: 'photo', value: [90, 460], uses: 'none', segments: ['pudo'],
      title: 'Clear parcels past their collection window',
      saw: 'The partner is at {pct} percent of its parcel space, with {n} parcels past the collection window.',
      compared: 'Pickup points in {area} that return expired parcels every day and stay under the space limit.',
      why: [
        'A full pickup point refuses parcels, and the network sends them to a point further away.',
        'Expired parcels should go back on the next driver pickup, not sit on the shelf.',
        'A photo of the parcel area shows the network team the real space, not the scanner count.',
      ],
      talk: [
        'Scan the expired parcels with {person} and bag them for the next driver pickup.',
        'Agree a daily time to check for expired parcels.',
      ],
    },
    {
      id: 'scanner', type: 'Fix the handheld scanner', agent: 'gap', effort: 8, evidence: 'photo', value: [70, 360], uses: 'none', segments: ['pudo'],
      title: 'Get the pickup point scanner syncing again',
      saw: 'The scanner has not synced for {days} days, so shoppers see parcels as not yet arrived.',
      compared: 'Pickup points whose scanners sync several times a day.',
      why: [
        'Without a sync, shoppers get no collection message and the parcel waits.',
        'Most sync faults are a login or network setting that takes minutes to fix.',
        'A photo of the sync screen confirms the fix for the network team.',
      ],
      talk: [
        'Check the scanner login and network with {person}.',
        'Run a test scan and confirm it shows in the network view.',
      ],
    },
    {
      id: 'signage', type: 'Put up pickup point signage', agent: 'gap', effort: 6, evidence: 'photo', value: [40, 200], uses: 'none', segments: ['pudo'],
      title: 'Put up the pickup point sign and opening hours',
      saw: 'The pickup point sign is missing from the window, and the listed opening hours differ from the door.',
      compared: 'The network standard for pickup point signage and listed hours.',
      why: [
        'Shoppers who cannot find the point call the carrier or give up.',
        'Wrong hours send shoppers to a closed door.',
        'The photo shows the network team the sign is up and the hours match.',
      ],
      talk: [
        'Fix the sign in the window with {person} and check the hours on the door.',
        'Correct the listed opening hours in the partner app.',
      ],
    },
    {
      id: 'supplies', type: 'Restock pickup point supplies', agent: 'order', effort: 6, evidence: 'note', value: [30, 160], uses: 'Supplies', segments: ['pudo'],
      title: 'Restock {product}',
      saw: 'The partner is down to its last {qty} return bags and label rolls.',
      compared: 'The usual monthly use at pickup points of this size.',
      why: [
        'Without bags and labels, returns drop-offs are refused.',
        'Supplies are free to partners, so the only cost of running out is lost parcels.',
        'A standing restock avoids the next emergency call.',
      ],
      talk: [
        'Count the remaining supplies with {person}.',
        'Book the restock for the next driver pickup.',
      ],
    },
    {
      id: 'quiettime', type: 'Visit outside the pickup rush', agent: 'planner', effort: 4, evidence: 'note', value: [20, 100], uses: 'none',
      title: 'Time the site visit outside the busy hours',
      saw: 'The last site visit landed during the after-work pickup rush, and the contact had no time.',
      compared: 'Scan data showing the quiet hours at this site.',
      why: [
        'A calm hour gets the standards check and the conversation done properly.',
        'The busy hours belong to the site’s own customers.',
        'Visit Planning uses the site’s own scan data to pick the window.',
      ],
      talk: [
        'Confirm the quiet window with the site contact.',
        'Update the visit note so the next site visit lands at the same time.',
      ],
    },
  ],
  orderReasons: {
    core: ['Matches the last four weeks of parcel counts at this site.', 'Covers the expected volume before the next site visit.', 'Keeps the site above the minimum it needs for daily collection.'],
    focus: ['Adds a delivery choice that similar sites already offer their shoppers.', 'Covers growth the site has planned for the coming weeks.'],
    new: ['Small trial booking for a newer delivery service.', 'Pilot volume to test the service before a wider rollout.'],
  },
  orderRules: [
    { kind: 'totalAbove', amount: 3000, route: 'manager', text: '{Orders} above {limit} need sign-off by the {manager}.' },
    { kind: 'humanPrice', route: 'manager', text: 'Pickup point supplies carry no price. The network team confirms the quantity before dispatch.' },
    { kind: 'info', text: 'Prices come from the published rate card. Pickup point supplies are free to partners.' },
  ],
  overrideReasons: [
    { label: 'Operations lead tied up with a late carrier pickup', route: 'manager' },
    { label: 'Merchant is in a contract review with the key merchant manager', route: 'kam' },
    { label: 'Pickup point busy with the after-work collection rush', route: 'manager' },
    { label: 'Scanner fault needs the network support desk', route: 'manager' },
    { label: 'Not enough time in this site visit', route: 'manager' },
    { label: 'Other operational reason', route: 'manager' },
  ],
  outcomeReasons: [
    { label: 'Site contact declined for now', blocked: false },
    { label: 'Network capacity full in that area this week', blocked: true },
    { label: 'Account on hold for unpaid invoices', blocked: true, route: 'kam' },
    { label: 'Pickup point closed when we arrived', blocked: false },
  ],
  visitNotes: [
    'Reviewed packing times; later collection agreed on the existing evening loop.',
    'Checkout walkthrough done; pickup point option to go live after the platform update.',
    'Address lookup switch-on agreed; failed attempts to be reviewed in four weeks.',
    { text: 'Expired parcels bagged for return; daily check time agreed with the shop owner.', segments: ['pudo'] },
    { text: 'Scanner login fixed and test scan confirmed in the network view.', segments: ['pudo'] },
  ],
  kpis: [
    { id: 'firstattempt', label: 'First-attempt delivery success', format: 'pct', range: [78, 97], target: 94, segments: ['merchants', 'smb'] },
    { id: 'parcelsweek', label: 'Parcels per week', format: 'count', range: [20, 900], target: 400, segments: ['merchants', 'smb'] },
    { id: 'addressok', label: 'Complete addresses', format: 'pct', range: [82, 99], target: 97, segments: ['merchants', 'smb'] },
    { id: 'pudospace', label: 'Pickup point space used', format: 'pct', range: [45, 98], target: 75, segments: ['pudo'] },
    { id: 'collected', label: 'Parcels collected within the window', format: 'pct', range: [80, 98], target: 95, segments: ['pudo'] },
    { id: 'scansync', label: 'Days with a scanner sync', format: 'pct', range: [60, 100], target: 98, segments: ['pudo'] },
  ],
  guardrails: [
    { id: 'all1', agent: 'all', text: 'Prices come only from the published rate card. Nobody promises a delivery date, a time window or a claim outcome the network has not published.' },
    { id: 'gap1', agent: 'gap', text: 'Pickup point standards follow the network handbook. A partner is never asked to hold more parcels than its agreed space.' },
    { id: 'order1', agent: 'order', text: 'Capacity bookings follow the site’s own parcel history and the published peak calendar, never a target to fill.' },
    { id: 'planner1', agent: 'planner', text: 'Changes to a key merchant’s collection plan go through the key merchant manager first.' },
  ],
  problems: [
    { title: 'Account executives visit small shippers while large merchants grow with another carrier', text: 'Visits follow habit. The merchants with the most parcels to win get the fewest visits, and nobody sees their volume moving until it has gone.', capability: 'potential' },
    { title: 'Failed first attempts are found on the invoice, not at the merchant', text: 'Incomplete addresses and late collection cause failed deliveries. The merchant hears about it from shoppers before anyone from the carrier raises it.', capability: 'gaps' },
    { title: 'Pickup point visits land in the after-work rush', text: 'Executives arrive when the counter is busiest. The standards check is skipped and full parcel shelves stay full.', capability: 'ranking' },
    { title: 'Site visits follow a fixed list instead of where problems are', text: 'A pickup point refusing parcels or a merchant missing collection waits for its turn on the list.', capability: 'planning' },
    { title: 'Peak capacity is booked late or not at all', text: 'Merchants run promotions without telling the carrier. Volume arrives unplanned and waits at the depot.', capability: 'order' },
    { title: 'Agreed collection times and standards fixes leave no record', text: 'A later collection agreed at a site visit, or a pickup point fix, lives in a notebook and is lost when people change.', capability: 'evidence' },
  ],
  assistant: [
    { q: 'Why is this merchant first on my list today?', a: 'It has the largest gap between parcels it ships and parcels it sends with us, and its failed first attempts have risen for three weeks.' },
    { q: 'Which pickup points are close to full?', a: 'The brief flags pickup points above their space limit or holding parcels past the collection window. Clear expired parcels there first.' },
    { q: 'Can I promise a merchant next-morning delivery?', a: 'No. You can show the published service level for each delivery service. Nobody promises a date or time the network has not published.' },
    { q: 'How do incomplete addresses cost the merchant?', a: 'Each failed first attempt means a second trip or a pickup point redirect, and a shopper who waits longer. Address lookup at checkout prevents most of them.' },
    { q: 'How is the peak booking suggested?', a: 'From the site’s parcel counts in the same weeks last year and the promotion dates it has shared, inside the published peak calendar.' },
    { q: 'Where does an override on a merchant go?', a: 'To your city commercial manager with your note. Contract questions for key merchants go to the key merchant manager.' },
    { q: 'Which merchants need the key merchant manager?', a: 'Merchants under contract review or asking for terms outside the rate card. The key merchant manager owns those conversations.' },
    { q: 'What does low confidence mean on a pickup point action?', a: 'The scanner has not synced recently, so the space and parcel counts may be out of date. Check the parcel area in person before acting.' },
  ],
  storyline: [
    'Pick Last-mile delivery and a country. Say upfront: the company, sites and numbers are fictional sample data, and drivers and dispatch are out of scope.',
    'Today: the account executive’s day mixes one key merchant, small shippers and pickup point partners, ranked by value and urgency.',
    'Open the merchant brief. Approve the later collection time. Override the checkout action with a reason, and see where it goes.',
    'Open the address quality action: what the agent saw, what it compared with, and the rule that no delivery date is ever promised.',
    'Open a pickup point brief: free up space, fix the scanner, and capture photo evidence before leaving.',
    'Booking: book peak capacity before the event and watch the sign-off limit trigger above the threshold.',
    'Switch to the city commercial manager: overrides with reasons, retention watch, and a retention site visit assigned to the field.',
    'System: the eight capabilities, the pickup point standard flow, and how activation by tier works for a new city.',
  ],
  forbidden: ['patient', 'prescription', 'livestock', 'crop', 'insurance policy', 'mortgage', 'clinic', 'planogram'],
};
