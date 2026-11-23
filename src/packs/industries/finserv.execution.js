// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Merchant officer', exec: 'Head of distribution' },
    partner: null,
    consultative: ["sme"],
    orderLed: ["merchant", "agent"],
    termsSource: "Credit, pricing and the published fee chart",
    standardOwner: "Compliance and risk",
    retentionSignal: "Card volume moved to another acquirer this month",
    offers: {
      mode: "limited",
      program: "an approved product within suitability",
      decider: "Credit and underwriting"
    },
    fulfillment: {
      physical: false,
      source: "product operations",
      sourceShort: "Operations",
      partnerOrg: "operations team",
      cutoff: "Processing cutoff",
      slot: "Next processing window",
      runner: "Back-office queue",
      load: ["Est. turnaround", "2 working days"],
      beat: "processing cycle",
      plan: "Relationship plan and approved products",
      planShort: "Relationship plan",
      milestones: ["Terminal installed", "Merchant staff trained", "Annual KYC refresh"],
      fund: null,
      flowIn: "Approved",
      flowOut: "In use",
      outSource: "Transaction data",
      dock: "Merchant counter",
      asset: ["Payment terminal", "Uptime", "99% (sample)"]
    },
    briefFrame: {
      objectives: ["Grow merchant volume", "Activate products", "KYC and compliance"],
      coord: [
        ["Terminal engineer", "Install Wed"],
        ["{Rep} (you)", "In the visit"],
        ["Credit team", "No open request"]
      ],
      constraints: [
        ["KYC", "Complete"],
        ["Terminal stock", "Available"],
        ["Credit review", "Not needed"],
        ["Suitability", "Recorded"]
      ],
      constraintNote: "Suggestions are checked against KYC status, suitability notes and the credit policy. Credit and pricing stay with people."
    },
    flows: {
      visibility: {
        name: "Terminal and QR presence",
        goal: "Merchants can take payment and customers see it",
        actions: ["terminal", "qrsetup"],
        kpis: ["Terminal uptime", "QR set up", "Active merchants", "Gaps closed"]
      },
      range: {
        name: "Product need and activation",
        goal: "The right product, within suitability, activated and used",
        actions: ["needs", "activate", "loandocs"],
        kpis: ["Proposals with documented suitability", "Dormant accounts activated", "Applications followed up", "Products in use"]
      },
      relationship: {
        name: "Merchant relationship",
        goal: "Right merchant, right time, a fair conversation",
        actions: ["offpeak", "arrears"],
        kpis: ["Visit plan compliance", "Accounts in early arrears", "At-risk merchants retained", "Complaints handled"]
      },
      standard: {
        name: "KYC and agent compliance",
        goal: "KYC is complete and agents follow the fee chart",
        actions: ["kyc", "feechart", "efloat"],
        kpis: ["KYC up to date", "Agents compliant", "E-float availability", "Days to correction"]
      },
      price: {
        name: "Fee chart verification",
        goal: "The published fees reach the customer. People set every price and rate",
        actions: ["feechart"],
        kpis: ["Fee chart compliance", "Gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
