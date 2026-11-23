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
    fulfillment: {
      physical: true,
      source: "plant warehouse",
      sourceShort: "Plant",
      partnerOrg: "plant logistics",
      cutoff: "Production cutoff",
      slot: "Next run",
      runner: "Plant freight",
      load: ["Est. load", "6 pallets"],
      beat: "production run",
      plan: "Supply plan and tooling agreements",
      planShort: "Supply plan",
      milestones: ["Artwork signed off", "Line trial completed", "Certificate renewal"],
      fund: null,
      flowIn: "Supplied",
      flowOut: "Run on line",
      outSource: "Line data",
      dock: "Goods-in",
      asset: ["Sample library", "Samples current", "Yes"]
    },
    briefFrame: {
      objectives: ["Grow volume", "Artwork and launch", "Certificates and quality"],
      coord: [
        ["Packaging technologist", "Line trial Wed"],
        ["{Rep} (you)", "In the visit"],
        ["Plant freight", "Next drop Thu"]
      ],
      constraints: [
        ["Production slot", "Booked"],
        ["Substrate stock", "Allocated"],
        ["Credit", "Available"],
        ["Certificates", "Current"]
      ],
      constraintNote: "Suggestions are checked against the production slot, substrate stock, credit and certificates on file."
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
