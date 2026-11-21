// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    partner: "distributor",
    consultative: ["super"],
    orderLed: ["conv", "indep"],
    termsSource: "The trade promotion plan and each retailer agreement",
    standardOwner: "The category team",
    retentionSignal: "A competitor display appeared in the last photo",
    offers: {
      mode: "on",
      tiers: ["Single-case deal", "Multi-case deal", "Display deal"]
    },
    flows: {
      visibility: {
        name: "Secondary displays",
        goal: "The right display in the right stores, in the right window",
        actions: ["display", "promo"],
        kpis: ["Display compliance", "Action completion rate", "Display stock ordered", "Actual versus expected lift"]
      },
      range: {
        name: "Range and listings",
        goal: "Close range gaps with the right range and the right order",
        actions: ["listnew", "winback", "topup"],
        kpis: ["Distribution of core range", "Lines per order", "Listings won", "First-order conversion"]
      },
      relationship: {
        name: "Store relationship",
        goal: "Right store, right frequency, right conversation",
        actions: ["deliveryday", "winback"],
        kpis: ["Visit plan compliance", "Order conversion", "At-risk stores retained", "Engagement strike rate"]
      },
      standard: {
        name: "Shelf and planogram",
        goal: "Fix the shelf against the agreed planogram",
        actions: ["oos", "facings", "rotate"],
        kpis: ["Planogram compliance", "Out-of-stock days", "Must-stock range present", "Gap closure time"]
      },
      price: {
        name: "Price and promotion compliance",
        goal: "The agreed price and promotion reach the shelf, on time",
        actions: ["pricetag", "promo"],
        kpis: ["Price-ticket compliance", "Promotion activation rate", "Days to correction", "Promotion result versus expectation"]
      }
    }
  },
};
