// Execution system overlay for this pack: process flows, visit archetypes, offer policy.
// Generic phase text lives in src/core/execution/model.js. Fictional content only.

/** @type {{execution: import('../schema.js').ExecutionContent}} */
export default {
  execution: {
    roles: { salesman: 'Dealer sales officer', exec: 'Commercial director', partner: 'Distributor manager' },
    partner: "distributor",
    consultative: ["coop", "farmer"],
    orderLed: ["dealer"],
    termsSource: "The approved season scheme",
    standardOwner: "The agronomy team and the product label",
    retentionSignal: "A rival brand was seen on the dealer counter",
    offers: {
      mode: "on",
      tiers: ["Early-season scheme", "Volume scheme", "Cooperative scheme"]
    },
    flows: {
      visibility: {
        name: "Demo plots and farmer meetings",
        goal: "Farmers see results on plots they trust",
        actions: ["demo", "meeting"],
        kpis: ["Demo plots visited", "Farmer meetings run", "Demo-to-sale conversion", "Farmers reached this season"]
      },
      range: {
        name: "Season range and stock",
        goal: "Dealers hold the right range before the season",
        actions: ["preseason", "newseed"],
        kpis: ["Season sell-in vs plan", "Lines per order", "New hybrids introduced", "Pre-season plans agreed"]
      },
      relationship: {
        name: "Dealer and cooperative relationship",
        goal: "Right customer at the right crop stage",
        actions: ["cropstage", "program", "counter"],
        kpis: ["Visits timed to crop stage", "Member programs agreed", "Counter staff trained", "At-risk dealers retained"]
      },
      standard: {
        name: "Label-compliant advice and genuine product",
        goal: "Advice follows the label and only genuine product is sold",
        actions: ["advice", "genuine"],
        kpis: ["Advice logged with label reference", "Counterfeit checks done", "Gaps closed", "Days to correction"]
      },
      price: {
        name: "Scheme and dues compliance",
        goal: "The agreed scheme reaches the customer. People decide credit",
        actions: ["dues"],
        kpis: ["Scheme activation rate", "Dues collected on time", "Days to correction", "Scheme result versus expectation"]
      }
    }
  },
};
