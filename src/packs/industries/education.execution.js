// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Retail sales rep', exec: 'Sales director' },
    partner: null,
    consultative: ["schools", "training"],
    orderLed: ["retail"],
    termsSource: "The tender terms and the approved price list",
    standardOwner: "The curriculum team and procurement rules",
    retentionSignal: "Requisitions moved to another supplier this term",
    offers: {
      mode: "off",
      note: "Not used in education. Tenders follow public procurement rules, so no offers are targeted."
    },
    fulfillment: {
      physical: true,
      source: "publisher warehouse",
      sourceShort: "Warehouse",
      partnerOrg: "logistics team",
      cutoff: "Order cutoff",
      slot: "Next delivery",
      runner: "Courier",
      load: ["Est. shipment", "8 cartons"],
      beat: "term delivery",
      plan: "Institution plan and tender terms",
      planShort: "Institution plan",
      milestones: ["Evaluation packs delivered", "Curriculum workshop held", "Tender submitted"],
      fund: null,
      flowIn: "Supplied",
      flowOut: "In use",
      outSource: "Requisition data",
      dock: "School office",
      asset: ["Display stand", "Range on display", "Current titles"]
    },
    briefFrame: {
      objectives: ["Curriculum adoption", "Requisitions", "Safety and tenders"],
      coord: [
        ["Curriculum consultant", "Workshop Thu"],
        ["{Rep} (you)", "In the visit"],
        ["Courier", "Next delivery Mon"]
      ],
      constraints: [
        ["Planning period", "Open"],
        ["Warehouse stock", "Allocated"],
        ["Budget", "Approved"],
        ["Tender", "Compliant"]
      ],
      constraintNote: "Suggestions are checked against planning periods, warehouse stock, approved budgets and tender rules."
    },
    flows: {
      visibility: {
        name: "Evaluation packs and displays",
        goal: "Educators can evaluate materials before they choose",
        actions: ["examplersample", "shelfmerch"],
        kpis: ["Evaluation packs delivered", "Displays refreshed", "Adoption decisions", "Institutions reached"]
      },
      range: {
        name: "Curriculum adoption and requisitions",
        goal: "Materials match the curriculum and enrollment",
        actions: ["curricgap", "vocationalgap", "bursarreview"],
        kpis: ["Curriculum framework adoption", "Monthly requisition volume", "Modules reviewed", "Requisitions finalised"]
      },
      relationship: {
        name: "Institution relationship",
        goal: "Right educator, during planning periods",
        actions: ["termsched"],
        kpis: ["Consultation plan compliance", "At-risk institutions retained", "Reviews held", "Requisition conversion"]
      },
      standard: {
        name: "Safety and tender compliance",
        goal: "Lab inventories are safe and tenders comply",
        actions: ["labsafety", "tendersubmit"],
        kpis: ["Procurement tender compliance rate", "Lab safety inspections done", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Tender price verification",
        goal: "Requisitions follow the tender terms. People set prices",
        actions: ["tendersubmit"],
        kpis: ["Tender terms verified", "Price gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
