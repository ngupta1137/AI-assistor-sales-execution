// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'SME sales rep', exec: 'Sales director' },
    partner: null,
    consultative: ["distributors", "ecommerce"],
    orderLed: ["smes"],
    termsSource: "The filed rate card",
    standardOwner: "The carrier tariff and operations",
    retentionSignal: "Parcel volume moved to another carrier this month",
    offers: {
      mode: "limited",
      program: "the approved peak capacity plan",
      decider: "The logistics director"
    },
    flows: {
      visibility: {
        name: "Pickup cutoffs and returns service",
        goal: "Shippers can hand over late and process returns easily",
        actions: ["latepickup", "returnportal"],
        kpis: ["On-time collection performance", "Reverse logistics processing speed", "Late cutoffs agreed", "Actual versus expected volume"]
      },
      range: {
        name: "Service lanes and capacity",
        goal: "Each shipper has the lanes and capacity it needs",
        actions: ["peakmanifest", "palletbooking"],
        kpis: ["Weekly parcel manifest volume", "Dock pallet clearance index", "Capacity plans agreed", "Bookings per shipper"]
      },
      relationship: {
        name: "Shipper relationship",
        goal: "Right shipper, around the sortation cycle",
        actions: ["docksched", "claimaudit"],
        kpis: ["Consultation plan compliance", "Claims reviewed", "At-risk shippers retained", "Booking conversion"]
      },
      standard: {
        name: "Declaration accuracy",
        goal: "Declared dimensions and weights match the tariff",
        actions: ["dimweightgap"],
        kpis: ["Dimensional declaration accuracy", "Gaps closed", "Days to correction", "Repeat gaps"]
      },
      price: {
        name: "Rate card verification",
        goal: "Bookings follow the filed rate card. No delivery promises",
        actions: ["ratecardhand"],
        kpis: ["Rate cards delivered", "Rate gaps escalated", "Days to correction", "Repeat gaps"]
      }
    }
  },
};
