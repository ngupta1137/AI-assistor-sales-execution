// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Route sales rep', exec: 'Commercial director' },
    partner: null,
    consultative: ["hotels", "canteens"],
    orderLed: ["dining"],
    termsSource: "The contract price list",
    standardOwner: "The quality team and the spec sheet",
    retentionSignal: "Fewer lines on the last two orders",
    offers: {
      mode: "limited",
      program: "the approved menu support program",
      decider: "The account manager and the contract"
    },
    fulfillment: {
      physical: true,
      source: "distribution center",
      sourceShort: "DC",
      partnerOrg: "fleet",
      cutoff: "Order cutoff",
      slot: "Next delivery",
      runner: "Delivery route",
      load: ["Est. load", "2 roll cages"],
      beat: "delivery route",
      plan: "Account plan and menu support",
      planShort: "Account plan",
      milestones: ["Menu placement confirmed", "Chef tasting held", "Standing order review"],
      fund: "Menu support fund",
      flowIn: "Delivered",
      flowOut: "Used on menu",
      outSource: "Kitchen usage",
      dock: "Kitchen door",
      asset: ["Branded dispenser", "Hygiene check", "Passed"]
    },
    briefFrame: {
      objectives: ["Menu wins", "Core range", "Delivery quality"],
      coord: [
        ["Chef consultant", "Tasting Thu"],
        ["{Rep} (you)", "In the visit"],
        ["Delivery driver", "Next drop 06:00"]
      ],
      constraints: [
        ["Delivery window", "Open"],
        ["DC stock", "Allocated"],
        ["Credit", "Available"],
        ["Contract price", "Current"]
      ],
      constraintNote: "Suggestions are checked against delivery windows, distribution center stock, credit and the contract price list."
    },
    flows: {
      visibility: {
        name: "Menu placement and tastings",
        goal: "Products earn a place on the next menu",
        actions: ["menu", "trial"],
        kpis: ["Menu placements this quarter", "Tastings run", "Trial-to-order conversion", "Actual versus expected lift"]
      },
      range: {
        name: "Core range and standing orders",
        goal: "The core range is ordered every time",
        actions: ["standing", "cover", "seasonal"],
        kpis: ["Core range ordered", "Standing orders in place", "Lines per order", "Order fill rate"]
      },
      relationship: {
        name: "Venue relationship",
        goal: "Right venue, right quiet window, right conversation",
        actions: ["window", "invoice"],
        kpis: ["Visit plan compliance", "Invoice queries closed", "At-risk venues retained", "Order conversion"]
      },
      standard: {
        name: "Delivery and cold chain",
        goal: "Deliveries arrive complete and cold",
        actions: ["shortship", "coldchain", "spec"],
        kpis: ["Order fill rate", "Cold chain checks passed", "Spec sheets handed over", "Days to correction"]
      },
      price: {
        name: "Contract price verification",
        goal: "Invoices match the contract price list",
        actions: ["invoice"],
        kpis: ["Invoice queries resolved", "Price gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
