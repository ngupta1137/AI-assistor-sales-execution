// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Pet retail rep', exec: 'Commercial director', partner: 'Wholesaler manager' },
    partner: "wholesaler",
    consultative: ["farms", "clinics"],
    orderLed: ["petretail"],
    termsSource: "The approved price list",
    standardOwner: "Veterinary technical services and the product label",
    retentionSignal: "Fewer protocol orders this season",
    offers: {
      mode: "off",
      note: "Not used in animal health. Prescription products go only through vets, and no incentives are targeted."
    },
    flows: {
      visibility: {
        name: "Label literature and protocols",
        goal: "Practitioners have the current label literature",
        actions: ["labelhandover", "dewormgap"],
        kpis: ["Label literature handed over", "Protocols reviewed", "Biological protocol compliance", "Practices reached"]
      },
      range: {
        name: "Herd and clinic replenishment",
        goal: "The right products are in stock for the season",
        actions: ["precalvingorder", "rxdelivery", "shelfmerch"],
        kpis: ["Monthly clinic dispense volume", "Prescription authorization currency", "Lines per order", "Seasonal plans agreed"]
      },
      relationship: {
        name: "Practice relationship",
        goal: "Right practice, between surgical blocks or feeding routines",
        actions: ["clinicsched"],
        kpis: ["Visit plan compliance", "At-risk practices retained", "Consultations held", "Order conversion"]
      },
      standard: {
        name: "Cold chain and hygiene",
        goal: "Biologicals stay cold and protocols are followed",
        actions: ["coldchain", "milkinghygiene"],
        kpis: ["Cold chain compliance rate", "Bulk milk quality index", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Price list verification",
        goal: "Orders follow the approved price list",
        actions: ["rxdelivery"],
        kpis: ["Price gaps escalated", "Days to correction", "Repeat gaps", "Authorisations current"]
      }
    }
  },
};
