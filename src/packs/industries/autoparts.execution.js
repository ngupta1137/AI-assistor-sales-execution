// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Workshop sales rep', exec: 'Commercial director', partner: 'Distributor manager' },
    partner: "distributor",
    consultative: ["fleet", "retail"],
    orderLed: ["workshop"],
    termsSource: "The approved price list and counter promotion",
    standardOwner: "The vehicle makers and the brand team",
    retentionSignal: "Order lines moved to a non-genuine brand",
    offers: {
      mode: "on",
      tiers: ["Counter promotion", "Loyalty bonus tier", "Bulk lubricant deal"]
    },
    flows: {
      visibility: {
        name: "Counter displays and training",
        goal: "Mechanics know and see the genuine range",
        actions: ["display", "train"],
        kpis: ["Counter displays placed", "Mechanics trained", "Loyalty enrollment", "Actual versus expected lift"]
      },
      range: {
        name: "Range and fast movers",
        goal: "Fast movers never run out; the range grows",
        actions: ["fast", "range", "switch"],
        kpis: ["Lines per order", "Order fill rate", "Range gaps closed", "Lubricant switches won"]
      },
      relationship: {
        name: "Workshop and fleet relationship",
        goal: "Right account, right time of day, a plan that sticks",
        actions: ["early", "loyalty", "fleetplan"],
        kpis: ["Visit plan compliance", "Fleet vehicles on a plan", "Loyalty members active", "At-risk accounts retained"]
      },
      standard: {
        name: "Genuine parts and warranty",
        goal: "Only genuine parts are sold; warranty claims move",
        actions: ["genuine", "warranty"],
        kpis: ["Counterfeit checks done", "Open warranty claims", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Promotion and price compliance",
        goal: "The approved promotion reaches the counter",
        actions: ["display"],
        kpis: ["Promotion activation rate", "Price gaps found", "Days to correction", "Promotion result versus expectation"]
      }
    }
  },
};
