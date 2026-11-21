// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    partner: null,
    consultative: ["hosp", "lab"],
    orderLed: ["asc"],
    termsSource: "The contracts team",
    standardOwner: "Quality and clinical education",
    retentionSignal: "A competitor trial was mentioned at the last visit",
    offers: {
      mode: "off",
      note: "Not used in medical devices. Contract prices and terms are set by the contracts team."
    },
    flows: {
      visibility: {
        name: "Trials and in-service training",
        goal: "Clinical teams know the product before the case",
        actions: ["trial", "inservice"],
        kpis: ["Trials run to plan", "Staff trained this quarter", "Supported cases", "Trial-to-contract conversion"]
      },
      range: {
        name: "Consumables and reagents",
        goal: "The installed base pulls through the right consumables",
        actions: ["reorder", "reagents", "consign"],
        kpis: ["Consumable pull-through vs plan", "Consignment counts on time", "Reagent stock-outs", "Lines per order"]
      },
      relationship: {
        name: "Account coverage and case support",
        goal: "Right stakeholder, right time, around the schedule",
        actions: ["case", "orslot", "vac"],
        kpis: ["Supported cases this quarter", "Visits timed to the schedule", "Value analysis files ready", "At-risk accounts re-engaged"]
      },
      standard: {
        name: "Uptime and complaint handling",
        goal: "Devices run, and every complaint reaches quality in time",
        actions: ["uptime", "complaint"],
        kpis: ["Installed base uptime", "Complaints sent within 24 hours", "Open device complaints", "Days to close a gap"]
      },
      price: {
        name: "Contract and renewal verification",
        goal: "Agreed contract terms are in place and renewed on time",
        actions: ["renew"],
        kpis: ["Contracts renewed on time", "Terms verified", "Gaps escalated to the contracts team", "Days to correction"]
      }
    }
  },
};
