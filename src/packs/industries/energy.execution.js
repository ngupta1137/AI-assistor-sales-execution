// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    partner: null,
    consultative: ["wholesalers", "builders"],
    orderLed: ["installers"],
    termsSource: "The channel price list",
    standardOwner: "The maker documents and qualified designers",
    retentionSignal: "Project quotes went to another brand",
    offers: {
      mode: "limited",
      program: "the approved channel program",
      decider: "The sales manager"
    },
    flows: {
      visibility: {
        name: "Counter displays and training",
        goal: "Partners see and know the current range",
        actions: ["counter", "training", "newline"],
        kpis: ["Counter displays set up", "Installers trained on the range", "New products introduced", "Actual versus expected lift"]
      },
      range: {
        name: "Project stock and range",
        goal: "Stock matches the confirmed project list",
        actions: ["pipeline", "deadline"],
        kpis: ["Core range stocked", "On time and in full", "Orders with storage or monitoring", "Lines per order"]
      },
      relationship: {
        name: "Partner relationship",
        goal: "Right partner, away from install days",
        actions: ["install", "quote", "spec"],
        kpis: ["Visit plan compliance", "Quotes answered within two days", "Specs matched to house types", "At-risk partners retained"]
      },
      standard: {
        name: "Compatibility and warranty",
        goal: "Every system is compatible and claims move",
        actions: ["compat", "warranty"],
        kpis: ["Compatibility checks done", "Open warranty claims", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Channel price verification",
        goal: "Orders follow the channel price list",
        actions: ["quote"],
        kpis: ["Quotes from the price list", "Price gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
