// Industry wording for the parts of core screens that describe how an {order} is fulfilled,
// the account plan and the people around a {visit}. Each pack sets these in its execution
// overlay (fulfillment, briefFrame). Packs without physical stock (financial services,
// insurance, carriers) describe processing and capacity instead of depots and pallets.

const DEFAULT = {
  physical: true, source: 'supply depot', sourceShort: 'Depot', partnerOrg: 'distributor',
  cutoff: 'Delivery cutoff', slot: 'Next delivery', runner: 'Delivery run', load: ['Est. load', '1 pallet'], beat: 'delivery run',
  plan: 'Account plan', planShort: 'Account plan', milestones: ['Plan agreed', 'Activity in place', 'Quarterly review'], fund: null,
  flowIn: 'Sell-in', flowOut: 'Sell-out', outSource: 'Sales data', dock: 'Receiving', asset: ['Field equipment', 'Condition', 'Operational'],
};

/** Fulfillment and account-plan wording for this pack. */
export function wording(industry) {
  return { ...DEFAULT, ...(industry?.execution?.fulfillment || {}) };
}

/** Brief frame: call objectives, constraints checked, and who else serves the {account}. */
export function briefFrame(industry) {
  const f = wording(industry);
  const bf = industry?.execution?.briefFrame || {};
  return {
    objectives: bf.objectives || ['Grow the {account}', 'Reorder', 'Fix a standard gap'],
    constraints: bf.constraints || [[f.dock, 'Open'], [`${f.sourceShort} stock`, 'Allocated'], ['Credit', 'Available'], ['Contract', 'Active']],
    constraintNote: bf.constraintNote || `Suggestions are checked against ${f.dock.toLowerCase()} hours, ${f.source} stock and credit limits.`,
    coordTitle: bf.coordTitle || 'Who else serves this {account}',
    coordNote: bf.coordNote || 'The people who serve this {account} share one view, so nobody undoes another’s work.',
    coord: bf.coord || [['{Manager}', 'Review Thu'], ['{Rep} (you)', 'In the visit'], [f.runner, `${f.slot} tomorrow`]],
  };
}
