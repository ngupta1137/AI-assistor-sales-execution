// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    partner: "wholesaler",
    consultative: ["hosp", "clinic"],
    orderLed: ["pharm"],
    termsSource: "The contracts team and the approved price list",
    standardOwner: "Compliance and Medical Affairs",
    retentionSignal: "Fewer calls accepted by the HCP this cycle",
    offers: {
      mode: "off",
      note: "Not used in pharma. No offers, discounts or free goods to HCPs. Contract terms are set by the contracts team."
    },
    flows: {
      visibility: {
        name: "Approved material and education",
        goal: "Priority HCPs see approved material at the right time",
        actions: ["detail", "education"],
        kpis: ["Priority HCP reach", "Approved material used", "Education invitations accepted", "Calls per priority HCP"]
      },
      range: {
        name: "Formulary and availability",
        goal: "Listed products are available where HCPs prescribe them",
        actions: ["formulary", "stock", "restock"],
        kpis: ["Formulary listings followed up", "Availability of core range", "Pharmacy order conversion", "Days to listing decision"]
      },
      relationship: {
        name: "HCP coverage and contact",
        goal: "Right HCP, right frequency, within contact rules",
        actions: ["unseen", "callslot", "consent"],
        kpis: ["Priority HCPs reached this cycle", "Consent up to date", "Calls outside consultation hours", "HCPs at risk re-engaged"]
      },
      standard: {
        name: "Sample and compliance standards",
        goal: "Every sample, request and pack meets the compliance standard",
        actions: ["sample", "expiry", "medinfo"],
        kpis: ["Sample drops signed and logged", "Packs near expiry", "Medical information requests passed on", "Compliance gaps closed"]
      },
      price: {
        name: "Contract and listing verification",
        goal: "Agreed contract terms reach the account. People set every price",
        actions: ["formulary", "restock"],
        kpis: ["Contract terms verified", "Listing gaps found", "Days to correction", "Gaps escalated to the contracts team"]
      }
    }
  },
};
