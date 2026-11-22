// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Retail sales executive', exec: 'Commercial director', partner: 'Distributor manager' },
    partner: "distributor",
    consultative: ["franchise", "device"],
    orderLed: ["sim"],
    termsSource: "The published tariff",
    standardOwner: "The channel compliance team",
    retentionSignal: "Activations shifted to another network this month",
    offers: {
      mode: "on",
      tiers: ["Standard offer", "Bundle offer", "Festival port-in offer"]
    },
    flows: {
      visibility: {
        name: "Branding and device demos",
        goal: "The network is visible and devices are live to try",
        actions: ["branding", "demo"],
        kpis: ["Branding compliance", "Live demo units", "Demos run", "Actual versus expected activations"]
      },
      range: {
        name: "Float, SIM and plan range",
        goal: "Float and SIM kits never run out; the right plans are on offer",
        actions: ["float", "simstock", "attach"],
        kpis: ["Float availability", "SIM kits in stock", "Plans attached to devices", "Lines per order"]
      },
      relationship: {
        name: "Outlet relationship",
        goal: "Right outlet, right time, before the evening peak",
        actions: ["peak", "plantrain", "coverage"],
        kpis: ["Visit plan compliance", "Staff trained on new plans", "Coverage complaints logged", "At-risk outlets retained"]
      },
      standard: {
        name: "KYC compliance",
        goal: "Every activation has valid ID and complete KYC",
        actions: ["kyc"],
        kpis: ["KYC records complete", "Gaps closed", "Days to correction", "Repeat gaps"]
      },
      price: {
        name: "Tariff and offer compliance",
        goal: "Published tariffs and approved offers run as agreed",
        actions: ["festival"],
        kpis: ["Offer activation rate", "Tariff gaps found", "Days to correction", "Offer result versus expectation"]
      }
    }
  },
};
