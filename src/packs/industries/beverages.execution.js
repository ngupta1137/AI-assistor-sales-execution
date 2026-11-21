// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    partner: "wholesaler",
    consultative: ["hotels", "ontrade"],
    orderLed: ["offtrade"],
    termsSource: "The approved promotion plan",
    standardOwner: "The brand team",
    retentionSignal: "A competitor tap or cooler appeared since the last visit",
    offers: {
      mode: "limited",
      program: "the approved consumer promotion",
      decider: "The brand team and the outlet"
    },
    flows: {
      visibility: {
        name: "Coolers, menus and activations",
        goal: "The brand is seen where people choose a drink",
        actions: ["cooler", "menu", "activation", "promo"],
        kpis: ["Menu presence", "Cooler purity", "Activations run", "Actual versus expected result"]
      },
      range: {
        name: "Range and distribution",
        goal: "The right range in each outlet, ordered to sell through",
        actions: ["range", "topup"],
        kpis: ["Numeric distribution", "Lines per order", "Listings won", "Visits with an order"]
      },
      relationship: {
        name: "Outlet relationship",
        goal: "Right outlet, right time, before service",
        actions: ["service", "staff"],
        kpis: ["Visit plan compliance", "Staff trained", "At-risk outlets retained", "Order conversion"]
      },
      standard: {
        name: "Quality and responsible service",
        goal: "Draught quality and age checks meet the standard",
        actions: ["draught", "agecheck"],
        kpis: ["Draught quality checks passed", "Age-verification signs in place", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Promotion compliance",
        goal: "The approved promotion runs as agreed. The outlet sets its own prices",
        actions: ["promo"],
        kpis: ["Promotion activation rate", "Material in place", "Days to correction", "Result versus expectation"]
      }
    }
  },
};
