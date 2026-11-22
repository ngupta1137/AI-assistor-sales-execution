// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Brand account rep', exec: 'Commercial director' },
    partner: null,
    consultative: ["foodbev", "industrial"],
    orderLed: ["retailbrands"],
    termsSource: "The supply contract and tooling agreement",
    standardOwner: "Quality and the certificates on file",
    retentionSignal: "Substrate volume moved to another converter this quarter",
    offers: {
      mode: "limited",
      program: "the approved seasonal supply terms",
      decider: "The enterprise director"
    },
    flows: {
      visibility: {
        name: "Artwork and print proofing",
        goal: "Brands sign off artwork and color before the run",
        actions: ["artsignoff", "presscheck"],
        kpis: ["Print color proof accuracy", "Artwork signed off", "Proofs checked", "Actual versus expected volume"]
      },
      range: {
        name: "Seasonal supply and substrates",
        goal: "Supply matches the season and the line",
        actions: ["bulkpalletorder"],
        kpis: ["Monthly substrate order volume", "Supply plans agreed", "Lines per order", "Stock-outs"]
      },
      relationship: {
        name: "Converter relationship",
        goal: "Right plant, during line changeover",
        actions: ["linesched"],
        kpis: ["Audit plan compliance", "At-risk accounts retained", "Reviews held", "Order conversion"]
      },
      standard: {
        name: "Certificates and pack integrity",
        goal: "Certificates are current and packs perform",
        actions: ["foodcertgap", "barrierleak", "sustaintest", "crushstrength"],
        kpis: ["Tray seal integrity compliance", "Compliance certificate currency", "Box stacking compression index", "Days to correction"]
      },
      price: {
        name: "Contract terms verification",
        goal: "Orders follow the supply contract. People set prices",
        actions: ["artsignoff"],
        kpis: ["Contract gaps escalated", "Days to correction", "Repeat gaps", "Tooling agreements current"]
      }
    }
  },
};
