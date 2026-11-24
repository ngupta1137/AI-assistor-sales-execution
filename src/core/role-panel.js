// The user's role, what it can and cannot do, and display preferences. Shown in the profile sheet,
// not as a permanent banner, so the screen keeps its height for work.
import { esc } from './text.js';
import { icon } from './icons.js';
import { roleKey as roleKeyOf, titleFor } from './personas.js';

export function rolePanel(ctx) {
  const roleKey = roleKeyOf(ctx.persona);
  const roleTitle = titleFor(ctx.industry, ctx.persona);
  const allowed = ctx.industry.governance?.rights?.actions?.[roleKey] || [];
  const allActions = [...new Set(Object.values(ctx.industry.governance?.rights?.actions || {}).flat())];
  const forbidden = allActions.filter((a) => !allowed.includes(a));
  const actionLabels = {
    approve_brief: "approve visit briefs",
    assign_retention_visit: "assign retention visits",
    approve_tier_change: "approve tier changes",
    release_offer_targets: "release offer targets",
    include_held_account: "include a held-back account",
    confirm_route: "confirm routes",
    receive_orders: "receive orders",
    share_invoices: "share invoice data",
    choose_integration: "choose the integration model",
    switch_capabilities: "switch capabilities on or off",
    set_season: "turn seasonal events on",
    size_value_case: "size the value case",
    adjust_brief: "adjust suggestions",
    override_brief: "override recommendations",
    flag_recommendation: "flag policy rules",
    refresh_stale: "refresh stale data",
    log_evidence: "record field evidence",
    request_clarification: "resolve clarify chips",
    approve_exception: "approve supervisor exceptions",
    rebalance_route: "rebalance territory routes",
    review_coaching: "review rep coaching",
    retire_rule: "retire obsolete rules",
    acknowledge_readiness: "sign off readiness items",
    approve_claim: "approve damage claims",
    tune_jbp: "tune joint business plans",
    export_charter: "export key account charters",
    request_credit_review: "request credit line reviews",
    approve_rebate: "approve tier rebates",
    publish_policy: "publish new policies",
    update_eval_bar: "update quality pass bars",
    claim_gap: "claim backlog gap tickets",
    confirm_term: "confirm local trade terms",
    execute_raw_write: "execute raw database writes",
    export_audit: "export immutable audit logs",
    replay_decision: "replay past decisions step by step",
    override_release_gate: "override release gates",
    sign_off_qbr: "sign off executive QBR decks",
  };
  const canText = allowed.slice(0, 3).map((a) => actionLabels[a] || a.replace(/_/g, " ")).join(", ");
  const cannotText = forbidden.slice(0, 3).map((a) => actionLabels[a] || a.replace(/_/g, " ")).join(", ");
  return `<section class="card role-panel" id="role-panel">
    <p class="small"><b>${icon('shield', 14)} Acting as ${esc(roleTitle)}.</b></p>
    <p class="small muted">Can ${esc(canText || 'view assigned views')}. Cannot ${esc(cannotText || 'modify governance rules')}.</p>
    <div class="role-tools">
      <span class="font-stepper" role="group" aria-label="Text size">
        <button class="seg sm ${(ctx.app?.textSize || 'sm') === 'sm' ? 'on' : ''}" data-act="set-text-size" data-size="sm" title="Standard text size">A</button>
        <button class="seg sm ${ctx.app?.textSize === 'md' ? 'on' : ''}" data-act="set-text-size" data-size="md" title="Large text size">A+</button>
        <button class="seg sm ${ctx.app?.textSize === 'lg' ? 'on' : ''}" data-act="set-text-size" data-size="lg" title="Extra large text size">A++</button>
      </span>
      <button class="btn secondary sm" data-act="toggle-simple-view">${ctx.app?.simpleView ? 'Full view' : 'Simple view'}</button>
      <button class="btn secondary sm" data-act="open-guide">How this works</button>
      <button class="btn secondary sm" data-act="open-rights-matrix">All rights</button>
    </div>
  </section>`;
}
