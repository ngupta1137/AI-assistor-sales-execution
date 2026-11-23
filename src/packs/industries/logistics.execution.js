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
    fulfillment: {
      physical: false,
      source: "depot operations",
      sourceShort: "Depot",
      partnerOrg: "depot team",
      cutoff: "Collection cutoff",
      slot: "Next collection",
      runner: "Collection loop",
      load: ["Est. volume", "1.2 pallets"],
      beat: "collection loop",
      plan: "Account plan and rate agreements",
      planShort: "Account plan",
      milestones: ["Late collection agreed", "Peak capacity booked", "Claims review held"],
      fund: null,
      flowIn: "Booked",
      flowOut: "Shipped",
      outSource: "Manifest data",
      dock: "Loading dock",
      asset: ["Label printer", "Status", "Operational"]
    },
    briefFrame: {
      objectives: ["Grow shipments", "Capacity and cutoffs", "Claims and declarations"],
      coord: [
        ["Depot operations", "Dock slot 16:30"],
        ["{Rep} (you)", "In the visit"],
        ["Collection driver", "Next pickup 17:00"]
      ],
      constraints: [
        ["Collection loop", "Running"],
        ["Network capacity", "Available"],
        ["Credit", "Available"],
        ["Rate card", "Filed"]
      ],
      constraintNote: "Suggestions are checked against the collection loop, network capacity, credit and the filed rate card."
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
