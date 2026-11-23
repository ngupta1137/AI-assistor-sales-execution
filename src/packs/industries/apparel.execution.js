// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Online account rep', exec: 'Commercial director' },
    partner: null,
    consultative: ["dept", "boutique"],
    orderLed: ["online"],
    termsSource: "The trade agreement and season price list",
    standardOwner: "The merchandising team",
    retentionSignal: "Order budget moved to another label this season",
    offers: {
      mode: "limited",
      program: "the approved in-season support terms",
      decider: "The account manager"
    },
    fulfillment: {
      physical: true,
      source: "distribution center",
      sourceShort: "DC",
      partnerOrg: "logistics team",
      cutoff: "Shipping cutoff",
      slot: "Next shipment",
      runner: "Carrier",
      load: ["Est. shipment", "5 cartons"],
      beat: "replenishment cycle",
      plan: "Season plan and trade terms",
      planShort: "Season plan",
      milestones: ["Floor reset done", "New styles shown", "In-season reorder agreed"],
      fund: "Marketing fund",
      flowIn: "Sell-in",
      flowOut: "Sell-through",
      outSource: "Retailer sales data",
      dock: "Stock room",
      asset: ["Branded fixture", "Season reset", "Done"]
    },
    briefFrame: {
      objectives: ["In-season reorder", "Floor and launch", "Aged stock"],
      coord: [
        ["Visual merchandiser", "Floor reset Fri"],
        ["{Rep} (you)", "In the visit"],
        ["Carrier", "Next delivery Mon"]
      ]
    },
    flows: {
      visibility: {
        name: "Floor display and new styles",
        goal: "The season story is on the floor and online",
        actions: ["floor", "newstyle", "images"],
        kpis: ["Floor displays reset", "New styles shown", "Images and size charts sent", "Actual versus expected sell-through"]
      },
      range: {
        name: "Size runs and reorders",
        goal: "Complete size runs and in-season reorders",
        actions: ["sizes", "reorder", "preseason"],
        kpis: ["Size runs complete", "Styles with an in-season reorder", "Styles ordered this season", "Lines per order"]
      },
      relationship: {
        name: "Buyer relationship",
        goal: "Right buyer, right time, outside the trading peak",
        actions: ["trading", "sample"],
        kpis: ["Visit plan compliance", "Sample sets placed", "At-risk retailers retained", "Order conversion"]
      },
      standard: {
        name: "Aged stock and returns",
        goal: "Aged stock moves and returns fall",
        actions: ["aged", "returns"],
        kpis: ["Return rate", "Aged stock reviewed", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Trade terms verification",
        goal: "Orders follow the trade agreement. The retailer sets resale prices",
        actions: ["reorder"],
        kpis: ["Orders within budget", "Terms gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
