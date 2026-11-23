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
    fulfillment: {
      physical: true,
      source: "distributor hub",
      sourceShort: "Hub",
      partnerOrg: "distributor",
      cutoff: "Float top-up cutoff",
      slot: "Next stock drop",
      runner: "Distributor van",
      load: ["Est. stock", "2 SIM boxes"],
      beat: "distributor van run",
      plan: "Retailer plan and offers",
      planShort: "Retailer plan",
      milestones: ["Branding refreshed", "Staff trained on new plans", "Festival offer live"],
      fund: "Branding fund",
      flowIn: "SIMs supplied",
      flowOut: "SIMs activated",
      outSource: "Activation data",
      dock: "Shop counter",
      asset: ["Branded kiosk", "Branding", "Compliant"]
    },
    briefFrame: {
      objectives: ["Grow activations", "Float and stock", "Branding and KYC"],
      coord: [
        ["Brand promoter", "Weekend demo"],
        ["{Rep} (you)", "In the visit"],
        ["Distributor van", "Next drop 16:00"]
      ],
      constraints: [
        ["Float", "Above minimum"],
        ["SIM stock", "Allocated"],
        ["Retailer credit", "Available"],
        ["KYC", "Compliant"]
      ],
      constraintNote: "Suggestions are checked against float, SIM stock, retailer credit and KYC status."
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
