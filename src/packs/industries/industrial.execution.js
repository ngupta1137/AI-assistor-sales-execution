// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Route sales rep', exec: 'Commercial director' },
    partner: null,
    consultative: ["plants"],
    orderLed: ["fab", "contractors"],
    termsSource: "The contract price list",
    standardOwner: "The technical desk and the maker datasheets",
    retentionSignal: "Contract items are being bought elsewhere",
    offers: {
      mode: "limited",
      program: "the approved contract renewal terms",
      decider: "The pricing desk"
    },
    flows: {
      visibility: {
        name: "New items and toolbox talks",
        goal: "Teams on site know what is new and how to use it safely",
        actions: ["newitem", "talk"],
        kpis: ["New items shown", "Toolbox talks run", "Trial-to-order conversion", "Actual versus expected lift"]
      },
      range: {
        name: "Contract range and restock bins",
        goal: "Contract items are on the bin, not bought elsewhere",
        actions: ["bins", "crib", "shutdown", "obsolete"],
        kpis: ["Contract items bought", "Restock bins in place", "Crib stock-outs", "Lines per order"]
      },
      relationship: {
        name: "Site relationship",
        goal: "Right site, right shift, the next job planned",
        actions: ["shift", "quote"],
        kpis: ["Visit plan compliance", "Quotes answered within a day", "At-risk sites retained", "Order conversion"]
      },
      standard: {
        name: "Rating and calibration",
        goal: "The right rating for the job and calibrations on time",
        actions: ["rating", "calibration"],
        kpis: ["Calibrations flagged on time", "Rating questions sent to the technical desk", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Contract price verification",
        goal: "Orders follow the contract price list",
        actions: ["quote"],
        kpis: ["Quotes from the pricing desk", "Price gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
