// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Dealer sales officer', exec: 'Commercial director' },
    partner: null,
    consultative: ["project", "contractor"],
    orderLed: ["dealer"],
    termsSource: "The approved dealer scheme and price list",
    standardOwner: "The trade marketing team",
    retentionSignal: "The dealer is pushing a rival brand at the counter",
    offers: {
      mode: "on",
      tiers: ["Scheme level 1", "Scheme level 2", "Scheme level 3"]
    },
    fulfillment: {
      physical: true,
      source: "regional depot",
      sourceShort: "Depot",
      partnerOrg: "logistics team",
      cutoff: "Dispatch cutoff",
      slot: "Next truck",
      runner: "Depot truck",
      load: ["Est. load", "0.8 truck"],
      beat: "depot truck run",
      plan: "Dealer plan and schemes",
      planShort: "Dealer plan",
      milestones: ["Shade display refreshed", "Contractor meet held", "Scheme level review"],
      fund: "Scheme fund",
      flowIn: "Sell-in",
      flowOut: "Sell-out",
      outSource: "Dealer sales data",
      dock: "Dealer yard",
      asset: ["Tinting machine", "Calibration", "Current"]
    },
    briefFrame: {
      objectives: ["Grow dealer sell-in", "Contractor demand", "Shade and tinting"],
      coord: [
        ["Tinting technician", "Machine service Wed"],
        ["{Rep} (you)", "In the visit"],
        ["Depot truck", "Next drop Thu"]
      ],
      constraints: [
        ["Depot dispatch", "Open"],
        ["Depot stock", "Allocated"],
        ["Dealer credit", "Available"],
        ["Scheme", "Active"]
      ],
      constraintNote: "Suggestions are checked against depot dispatch, depot stock and dealer credit."
    },
    flows: {
      visibility: {
        name: "Shade displays and counter presence",
        goal: "The brand is seen and recommended at the counter",
        actions: ["shade", "newprod"],
        kpis: ["Shade displays refreshed", "Premium share of sales", "New products introduced", "Actual versus expected lift"]
      },
      range: {
        name: "Dealer stock and range",
        goal: "Each dealer stocks the right range for the season",
        actions: ["stockplan", "newprod"],
        kpis: ["Dealer sell-in vs plan", "Lines per order", "Range gaps closed", "First-order conversion"]
      },
      relationship: {
        name: "Contractor and project relationship",
        goal: "Contractors trust the product; projects specify it",
        actions: ["meet", "loyalty", "lead", "spec", "quietday"],
        kpis: ["Active loyalty painters", "Specification wins", "Project conversion", "Contractors at risk re-engaged"]
      },
      standard: {
        name: "Tinting and site quality",
        goal: "Machines run and site complaints close fast",
        actions: ["tint", "complaint"],
        kpis: ["Tinting machine uptime", "Site complaints resolved", "Days to close a gap", "Repeat complaints"]
      },
      price: {
        name: "Scheme and dues compliance",
        goal: "The agreed scheme reaches the dealer. Finance owns credit",
        actions: ["dues"],
        kpis: ["Scheme activation rate", "Dues collected on time", "Days to correction", "Scheme result versus expectation"]
      }
    }
  },
};
