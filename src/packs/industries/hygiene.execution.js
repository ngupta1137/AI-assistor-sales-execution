// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Hospitality account rep', exec: 'Commercial director' },
    partner: null,
    consultative: ["contractors", "facilities"],
    orderLed: ["hospitality"],
    termsSource: "The contract price list",
    standardOwner: "The technical desk and the safety data sheets",
    retentionSignal: "Drum volume fell for two quarters",
    offers: {
      mode: "limited",
      program: "the approved equipment program",
      decider: "The contractor director"
    },
    flows: {
      visibility: {
        name: "Dispenser installation",
        goal: "The right dispensers are installed and in use",
        actions: ["equipinstall", "handwashgap"],
        kpis: ["Dispensers installed", "Dispenser operational uptime", "Washroom gaps closed", "Actual versus expected use"]
      },
      range: {
        name: "Bulk supply and replenishment",
        goal: "Bulk supply matches real use",
        actions: ["quarterbulk", "handwashgap"],
        kpis: ["Quarterly chemical drum volume", "Lines per order", "Stock-outs", "Replenishment plans agreed"]
      },
      relationship: {
        name: "Facility relationship",
        goal: "Right facility, around the shift handover",
        actions: ["shiftsched"],
        kpis: ["Visit plan compliance", "At-risk facilities retained", "Reviews held", "Order conversion"]
      },
      standard: {
        name: "Safety and dilution standards",
        goal: "Safety documents are current and dilution is calibrated",
        actions: ["sdscheck", "diluteaudit", "laundrytitrate", "careclean"],
        kpis: ["Safety documentation currency", "Dispensers calibrated", "Linen brightness index", "Days to correction"]
      },
      price: {
        name: "Contract price verification",
        goal: "Drum and dispenser orders follow the contract price list",
        actions: ["quarterbulk"],
        kpis: ["Price gaps escalated", "Chemical cost control index", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
