// Shared baseline and helper for each industry pack's governance content.
// Provides standard rights matrix, default error limits, and template generators
// so every pack receives rich, authentic, and fully validated governance metadata.

export const STANDARD_ROLES = ['rep', 'manager', 'kam', 'ops', 'exec'];

export const BASE_OUTCOMES = {
  suggest: 'Recommended action ready for execution',
  clarify: 'Action clarification required before review',
  evidence: 'Insufficient field evidence on file to proceed',
  conflict: 'Policy conflict detected between approved rules',
  stale: 'Data is stale and requires refresh before action',
  role: 'Action outside assigned authority for this role',
  compliance: 'Mandatory compliance review and escalation',
};

export const BASE_ERROR_LIMITS = {
  missingData: 25,
  staleData: 30,
  integrationFailed: 15,
  wrongReported: 10,
  notFeasible: 20,
  syncConflict: 5,
};

export const BASE_RIGHTS = {
  roles: STANDARD_ROLES,
  legalApprover: 'Legal Counsel',
  screens: {
    rep: ['today', 'brief', 'account', 'action', 'order', 'complete', 'route', 'companion'],
    manager: ['manager', 'companion', 'agents', 'rule-health', 'audit-trail', 'config', 'qbr'],
    kam: ['account', 'manager', 'rule-health', 'config'],
    ops: ['agents', 'rule-health', 'audit-trail', 'quality', 'pm-views', 'lab', 'config'],
    exec: ['agents', 'rule-health', 'audit-trail', 'quality', 'pm-views', 'lab', 'qbr'],
  },
  actions: {
    rep: ['approve_brief', 'adjust_brief', 'override_brief', 'flag_recommendation', 'refresh_stale', 'log_evidence', 'request_clarification'],
    manager: ['approve_exception', 'rebalance_route', 'review_coaching', 'retire_rule', 'acknowledge_readiness', 'approve_claim'],
    kam: ['tune_jbp', 'export_charter', 'request_credit_review', 'approve_rebate'],
    ops: ['publish_policy', 'retire_rule', 'update_eval_bar', 'claim_gap', 'confirm_term', 'execute_raw_write'],
    exec: ['export_audit', 'replay_decision', 'override_release_gate', 'sign_off_qbr'],
  },
};

/**
 * Creates a fully populated governance object for an industry.
 * Merges industry-specific customizations with baseline defaults.
 *
 * @param {Object} spec
 * @returns {Object}
 */
export function buildGovernance(spec) {
  return {
    rules: spec.rules,
    outcomeCopy: { ...BASE_OUTCOMES, ...(spec.outcomeCopy || {}) },
    rights: {
      ...BASE_RIGHTS,
      legalApprover: spec.legalApprover || BASE_RIGHTS.legalApprover,
      ...(spec.rights || {}),
    },
    readiness: spec.readiness,
    clarifyQuestions: spec.clarifyQuestions,
    staleLimitDays: spec.staleLimitDays || 14,
    evidenceRules: spec.evidenceRules || [
      { type: 'photo', description: 'Clear optical capture of physical site display or shelf facing', validity: '30 days' },
      { type: 'signature', description: 'Digital signature from authorized contact or site manager', validity: 'Visit session' },
      { type: 'note', description: 'Structured text observation with categorized reason tags', validity: '60 days' },
      { type: 'scan', description: 'Barcode or RFID tag confirmation for delivery inventory', validity: 'Immediate' },
    ],
    agents: {
      holdReasons: spec.holdReasons || ['Requires commercial manager approval for volume bracket adjustment'],
      neverDecides: spec.agentNeverDecides || {
        planner: ['Never sets territory revenue quotas', 'Never penalizes reps for transit delays'],
        gap: ['Never contacts account personnel directly', 'Never alters agreed contract terms'],
        order: ['Never sets custom unit prices', 'Never approves uncollateralized credit'],
        orchestrator: ['Never bypasses statutory regulatory holds', 'Never alters audit trail logs'],
      },
    },
    accountFeatures: spec.accountFeatures || [
      { id: 'f_potential', name: 'Annual account potential', capability: 'potential', typicalAgeDays: 30, unit: 'currency' },
      { id: 'f_share', name: 'Category value share', capability: 'potential', typicalAgeDays: 14, unit: 'percent' },
      { id: 'f_gaps', name: 'Open assortment gap count', capability: 'gaps', typicalAgeDays: 7, unit: 'count' },
      { id: 'f_urgency', name: 'Restock urgency index', capability: 'ranking', typicalAgeDays: 3, unit: 'score' },
      { id: 'f_transit', name: 'Optimized drive time', capability: 'planning', typicalAgeDays: 1, unit: 'minutes' },
      { id: 'f_runrate', name: 'Historical weekly reorder pace', capability: 'order', typicalAgeDays: 7, unit: 'cases' },
      { id: 'f_dock', name: 'Receiving dock availability', capability: 'planning', typicalAgeDays: 1, unit: 'hours' },
    ],
    memorySamples: spec.memorySamples || [
      { id: 'mem-1', date: '2026-10-14', ageDays: 15, text: 'Prefers deliveries before noon. Dock 2 has pallet jack.', author: 'Alex Morgan', category: 'preference', status: 'active' },
      { id: 'mem-2', date: '2026-10-02', ageDays: 27, text: 'Discussed promotional display for upcoming holiday campaign.', author: 'Alex Morgan', category: 'commitment', status: 'active' },
      { id: 'mem-3', date: '2026-08-20', ageDays: 70, text: 'Temporary construction on service road caused 15 minute delay.', author: 'Alex Morgan', category: 'issue', status: 'expired' },
      { id: 'mem-4', date: '2026-09-11', ageDays: 48, text: 'Personal comment regarding previous owner family relocation.', author: 'Alex Morgan', category: 'preference', status: 'do_not_use' },
    ],
    goldenCases: spec.goldenCases,
    blindCases: spec.blindCases,
    errorLimits: { ...BASE_ERROR_LIMITS, ...(spec.errorLimits || {}) },
    metricTree: spec.metricTree || {
      headline: 'Actions that moved commercial numbers per 100 visits',
      reachTarget: 85,
      reachCurrent: 82,
      acceptanceTarget: 80,
      acceptanceCurrent: 74,
      completionTarget: 90,
      completionCurrent: 88,
    },
  };
}

