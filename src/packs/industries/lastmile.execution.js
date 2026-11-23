// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Small business sales rep', exec: 'Commercial director' },
    partner: null,
    consultative: ['merchants'],
    orderLed: ['smb', 'pudo'],
    termsSource: 'The published rate card',
    standardOwner: 'The network operations team and the pickup point handbook',
    retentionSignal: 'Weekly parcel count fell three weeks in a row',
    offers: { mode: 'limited', program: 'the approved volume tier program', decider: 'The pricing desk' },
    flows: {
      visibility: { name: 'Delivery choices at checkout', goal: 'Shoppers see pickup point and evening options, each with its published service level', actions: ['checkout'], kpis: ['Merchants showing pickup point delivery', 'Checkout choices per merchant', 'Share of parcels to pickup points', 'Actual versus expected first-attempt success'] },
      range: { name: 'Service mix, collection and peak capacity', goal: 'Each merchant has the collection time, returns and peak capacity its volume needs', actions: ['cutoff', 'peakbook', 'returnsetup', 'supplies'], kpis: ['Parcels per week', 'Parcels that waited overnight', 'Peak capacity booked in time', 'Returns through pickup points'] },
      relationship: { name: 'Merchant and partner relationship', goal: 'The right site at a quiet hour, and small shippers able to book alone', actions: ['quiettime', 'onboard'], kpis: ['Site visit plan compliance', 'Small shippers booking in the app', 'Sites at risk retained', 'Site visits in quiet hours'] },
      standard: { name: 'Pickup point and address standards', goal: 'Pickup points under their space limit with working scanners, and complete addresses from merchants', actions: ['pudocap', 'scanner', 'signage', 'address'], kpis: ['Pickup point space used', 'Parcels collected within the window', 'Scanners synced today', 'Complete addresses'] },
      price: { name: 'Rate card verification', goal: 'Every site holds the current rate card. People set every price', actions: ['ratecard'], kpis: ['Sites holding the current rate card', 'Billing disputes after a price change', 'Days to correction', 'Requests sent to the pricing desk'] },
    },
  },
};
