// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Branch sales officer', exec: 'Head of distribution' },
    partner: null,
    consultative: ["brokers", "agencies"],
    orderLed: ["branches"],
    termsSource: "Underwriting and the filed rates",
    standardOwner: "Compliance and underwriting",
    retentionSignal: "Submissions moved to another carrier this quarter",
    offers: {
      mode: "off",
      note: "Not used in insurance distribution. Rates and terms come from underwriting and filed rates only."
    },
    fulfillment: {
      physical: false,
      source: "underwriting",
      sourceShort: "Underwriting",
      partnerOrg: "underwriting team",
      cutoff: "Submission cutoff",
      slot: "Next underwriting review",
      runner: "Underwriting queue",
      load: ["Est. turnaround", "3 working days"],
      beat: "underwriting cycle",
      plan: "Agency plan and appetite",
      planShort: "Agency plan",
      milestones: ["Appetite briefing held", "Producer licensing checked", "Book review completed"],
      fund: null,
      flowIn: "Submitted",
      flowOut: "Bound",
      outSource: "Policy data",
      dock: "Agency office",
      asset: ["Agency signage", "Branding", "Current"]
    },
    briefFrame: {
      objectives: ["Grow submissions", "Retention", "Licensing and appetite"],
      coord: [
        ["Underwriter", "Review Thu"],
        ["{Rep} (you)", "In the visit"],
        ["Claims liaison", "No open escalation"]
      ],
      constraints: [
        ["Licensing", "Current"],
        ["Appetite", "Within guidelines"],
        ["Commission terms", "Active"],
        ["Compliance", "Clear"]
      ],
      constraintNote: "Suggestions are checked against producer licensing and published appetite. Rates come from underwriting only."
    },
    flows: {
      visibility: {
        name: "Approved brochures and briefings",
        goal: "Producers have the approved material and know the products",
        actions: ["brochuredel", "bancatrain"],
        kpis: ["Approved brochures delivered", "Briefing sessions run", "Multi-line penetration", "Active producing agents"]
      },
      range: {
        name: "Binder plan and product mix",
        goal: "Each agency has a binder plan that fits its capacity",
        actions: ["volplan", "bookrecon"],
        kpis: ["Quarterly bound policies", "Binder plans agreed", "Multi-line penetration", "Retention audits done"]
      },
      relationship: {
        name: "Agency relationship",
        goal: "Right agency, right rhythm, the right conversation",
        actions: ["cadenceopt", "quoteconv"],
        kpis: ["Commercial retention rate", "Submission bind ratio", "Review plan compliance", "At-risk agencies re-engaged"]
      },
      standard: {
        name: "Licensing and appetite compliance",
        goal: "Every producer is licensed and quotes within published appetite",
        actions: ["licenselog", "cyberapp"],
        kpis: ["Credentials verified", "Appetite questions answered from guidelines", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Filed rate verification",
        goal: "Quotes follow the filed rates. People set every rate",
        actions: ["quoteconv"],
        kpis: ["Quote gaps escalated", "Days to correction", "Repeat gaps", "Submissions bound"]
      }
    }
  },
};
