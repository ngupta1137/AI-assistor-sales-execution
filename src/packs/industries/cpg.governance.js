// Governance pack content for cpg: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    legalApprover: "Legal Counsel",
    rules: [
      {
            "id": "r_cpg_promo",
            "title": "Authorized trade promotional tier compliance",
            "owner": "Trade Marketing Lead",
            "approver": "Commercial Director",
            "exactWording": true,
            "scope": "All retail accounts with active Joint Business Plans",
            "neverDecides": "Never approves unbudgeted slotting allowances or cash rebates"
      },
      {
            "id": "r_cpg_purity",
            "title": "Branded fixture display purity standard",
            "owner": "Visual Merchandising Lead",
            "approver": "Field Sales Director",
            "exactWording": false,
            "scope": "Company-owned display units and endcap fixtures",
            "neverDecides": "Never penalizes stores for delayed distributor shipments"
      },
      {
            "id": "r_cpg_shelf",
            "title": "Planogram eye-level core facing priority",
            "owner": "Category Management Lead",
            "approver": "Retail Operations Lead",
            "exactWording": false,
            "scope": "Supermarkets and high-volume convenience formats",
            "neverDecides": "Never forces delisting of competitor contract lines"
      },
      {
            "id": "r_cpg_rma",
            "title": "Segregated physical damage claim authorization",
            "owner": "Accounts Receivable Lead",
            "approver": "Credit Manager",
            "exactWording": false,
            "scope": "All delivery returns and breakages under $250 policy cap",
            "neverDecides": "Never posts general ledger adjustments without accounts receivable sign-off"
      },
      {
            "id": "r_cpg_dock",
            "title": "Receiving dock receiving window adherence",
            "owner": "Logistics Liaison",
            "approver": "Distribution Depot Manager",
            "exactWording": false,
            "scope": "High-density urban distribution beats",
            "neverDecides": "Never reschedules carrier dispatch beyond 48 hours"
      },
      {
            "id": "r_cpg_credit",
            "title": "Net 30 commercial credit terms threshold",
            "owner": "Credit Risk Analyst",
            "approver": "Commercial Finance Director",
            "exactWording": false,
            "scope": "Independent and key account formats",
            "neverDecides": "Never overrides credit holds on delinquent accounts"
      },
      {
            "id": "r_cpg_blitz",
            "title": "Rapid blitz visit protocol for rushed managers",
            "owner": "Field Enablement Lead",
            "approver": "District Sales Manager",
            "exactWording": false,
            "scope": "Peak hour retail calls under 5 minutes duration",
            "neverDecides": "Never bypasses mandatory food safety verification"
      },
      {
            "id": "r_cpg_camera",
            "title": "Electronic manifest attestation for camera-restricted sites",
            "owner": "Compliance Officer",
            "approver": "Key Account Director",
            "exactWording": false,
            "scope": "Accounts with contractual photography restrictions",
            "neverDecides": "Never waives manager physical signature requirements"
      }
    ],
    outcomeCopy: {
      suggest: 'Recommended action ready for {rep} review',
      clarify: 'Action clarification required before {visit} recommendation',
      evidence: 'Insufficient field evidence on file to justify action',
      conflict: 'Policy conflict detected between approved commercial rules',
      stale: 'Data is stale and requires refresh before action',
      role: 'Action outside assigned authority for this role',
      compliance: 'Mandatory compliance review and escalation required',
    },
    readiness: [
      {
            "id": "rd_q4_promos",
            "title": "National Q4 promotional calendar loaded",
            "ready": true,
            "owner": "Trade Marketing",
            "detail": "All 8 seasonal promotional allowances confirmed with wholesale depots"
      },
      {
            "id": "rd_dock_hours",
            "title": "Key account dock receiving schedules updated",
            "ready": true,
            "owner": "Logistics Ops",
            "detail": "Verified dock receiving windows across top 40 accounts"
      },
      {
            "id": "rd_depot_alloc",
            "title": "Regional warehouse core line inventory allocated",
            "ready": true,
            "owner": "Supply Chain",
            "detail": "Minimum 14 days forward cover at central depot"
      },
      {
            "id": "rd_rebate_brackets",
            "title": "Annual volume rebate bracket schedules published",
            "ready": false,
            "owner": "Commercial Finance",
            "detail": "Awaiting finance sign-off on Tier 2 threshold adjustments"
      },
      {
            "id": "rd_rep_tablets",
            "title": "Field companion offline cache sync certified",
            "ready": true,
            "owner": "Sales Operations",
            "detail": "All 14 territory tablets verified on AES-256 local encrypted storage"
      },
      {
            "id": "rd_blitz_cards",
            "title": "Rapid Blitz 45s workflows validated",
            "ready": true,
            "owner": "Field Enablement",
            "detail": "3-tap workflows tested on live retail routes"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_placement",
            "q": "Which display format is agreed with the {contact}?",
            "chips": [
      "Eye-level shelf facing",
                  "Promotional endcap feature",
                  "Checkout counter display",
                  "Secondary entrance stack"
    ],
            "resolvedType": "Merchandising priority"
      },
      {
            "id": "cq_order_timing",
            "q": "What delivery schedule satisfies store dock hours?",
            "chips": [
      "Next scheduled morning beat",
                  "Priority afternoon dispatch",
                  "Next week consolidation"
    ],
            "resolvedType": "Replenishment urgency"
      },
      {
            "id": "cq_camera_policy",
            "q": "Does this retail location permit on-premise photography?",
            "chips": [
      "Photography permitted",
                  "Manager attestation required",
                  "Restricted: signature only"
    ],
            "resolvedType": "Evidence protocol"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Trade spend investment exceeds commercial rep discretionary limit ($250 cap)"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in cpg",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in cpg",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in cpg",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in cpg",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in cpg",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in cpg",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in cpg",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in cpg",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in cpg",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in cpg",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in cpg",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in cpg",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in cpg",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in cpg",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in cpg",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in cpg",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in cpg",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in cpg",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in cpg",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in cpg",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in cpg",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in cpg",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in cpg",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in cpg",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in cpg",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in cpg",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in cpg",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in cpg",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in cpg",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in cpg",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in cpg",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in cpg",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in cpg",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in cpg",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in cpg",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in cpg",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in cpg",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in cpg",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in cpg",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in cpg",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      }
    ],
    blindCases: [
      {
            "id": "bc-1",
            "capability": "potential",
            "scenario": "High volume account with unverified regional footprint",
            "expected": "clarify",
            "actual": "clarify",
            "missType": "none"
      },
      {
            "id": "bc-2",
            "capability": "potential",
            "scenario": "New branch with zero operating history; safe conservative fallback",
            "expected": "declined",
            "actual": "declined",
            "missType": "none"
      },
      {
            "id": "bc-3",
            "capability": "gaps",
            "scenario": "Assortment void with active customer category exclusion",
            "expected": "declined",
            "actual": "declined",
            "missType": "declined"
      },
      {
            "id": "bc-4",
            "capability": "gaps",
            "scenario": "Core line shelf void with confirmed warehouse stockout",
            "expected": "conflict",
            "actual": "conflict",
            "missType": "none"
      },
      {
            "id": "bc-5",
            "capability": "ranking",
            "scenario": "Urgent restocking needed during restricted dock receiving window",
            "expected": "planning",
            "actual": "planning",
            "missType": "none"
      },
      {
            "id": "bc-6",
            "capability": "ranking",
            "scenario": "High value task exceeding rep daily allowable drive time",
            "expected": "declined",
            "actual": "declined",
            "missType": "declined"
      },
      {
            "id": "bc-7",
            "capability": "planning",
            "scenario": "Emergency customer request on scheduled route rest day",
            "expected": "clarify",
            "actual": "clarify",
            "missType": "none"
      },
      {
            "id": "bc-8",
            "capability": "planning",
            "scenario": "Vehicle maintenance issue redistributes stops to nearby representative",
            "expected": "suggest",
            "actual": "suggest",
            "missType": "none"
      },
      {
            "id": "bc-9",
            "capability": "order",
            "scenario": "Proposed volume inadvertently trips unbudgeted rebate bracket",
            "expected": "compliance",
            "actual": "compliance",
            "missType": "none"
      },
      {
            "id": "bc-10",
            "capability": "order",
            "scenario": "Suggested order exceeds local warehouse safety buffer threshold",
            "expected": "conflict",
            "actual": "conflict",
            "missType": "none"
      },
      {
            "id": "bc-11",
            "capability": "order",
            "scenario": "Substitute offering pricing mismatch against master agreement",
            "expected": "wrong",
            "actual": "wrong",
            "missType": "wrong"
      },
      {
            "id": "bc-12",
            "capability": "gaps",
            "scenario": "Promotional display suggested after campaign window close",
            "expected": "wrong",
            "actual": "wrong",
            "missType": "wrong"
      }
    ],
  }),
};
