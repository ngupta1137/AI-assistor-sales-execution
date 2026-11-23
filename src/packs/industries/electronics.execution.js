// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Multi-brand sales rep', exec: 'Commercial director', partner: 'Distributor manager' },
    partner: "distributor",
    consultative: ["chain"],
    orderLed: ["mbo"],
    termsSource: "Each retailer agreement and the approved scheme",
    standardOwner: "The trade marketing team",
    retentionSignal: "A rival brand took display space since the last visit",
    offers: {
      mode: "on",
      tiers: ["Standard sell-out scheme", "Display scheme", "Launch scheme"]
    },
    fulfillment: {
      physical: true,
      source: "distributor warehouse",
      sourceShort: "Warehouse",
      partnerOrg: "distributor",
      cutoff: "Dispatch cutoff",
      slot: "Next delivery",
      runner: "Distributor truck",
      load: ["Est. shipment", "6 cartons"],
      beat: "distributor run",
      plan: "Retailer plan and schemes",
      planShort: "Retailer plan",
      milestones: ["Launch display set up", "Promoters trained", "Aged stock review"],
      fund: "Display fund",
      flowIn: "Sell-in",
      flowOut: "Sell-out",
      outSource: "Retailer sales data",
      dock: "Stock room",
      asset: ["Demo wall", "Units live", "11 of 12"]
    },
    briefFrame: {
      objectives: ["Grow sell-out", "Display and launch", "Aged stock"],
      coord: [
        ["In-store promoter", "On shift today"],
        ["{Rep} (you)", "In the visit"],
        ["Distributor truck", "Next drop Fri"]
      ]
    },
    flows: {
      visibility: {
        name: "Launch and display share",
        goal: "The right models on display, live and explained",
        actions: ["launch", "wall", "demolive"],
        kpis: ["Display compliance", "Demo units live", "Launch displays set up", "Actual versus expected sell-out"]
      },
      range: {
        name: "Range and sell-out",
        goal: "The right models in stock, moving before they age",
        actions: ["restock", "aged", "sellout"],
        kpis: ["Sell-out share", "Stock older than 90 days", "Lines per order", "Restock conversion"]
      },
      relationship: {
        name: "Store and promoter relationship",
        goal: "Right store, right time, promoters who know the range",
        actions: ["weekday", "promoter", "competitor"],
        kpis: ["Visit plan compliance", "Promoters trained", "Competitor activity logged", "At-risk stores retained"]
      },
      standard: {
        name: "Display standard",
        goal: "Every display matches the agreed standard",
        actions: ["demolive", "wall"],
        kpis: ["Display compliance", "Demo units live", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Price tag compliance",
        goal: "The agreed price reaches the tag. The retailer sets resale prices",
        actions: ["tags"],
        kpis: ["Price tag compliance", "Days to correction", "Gaps escalated", "Scheme result versus expectation"]
      }
    }
  },
};
