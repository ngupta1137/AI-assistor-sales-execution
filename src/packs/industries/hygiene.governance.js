// Governance pack content for hygiene: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    // Which rule governs each action. '_' means no specific rule applies; the card shows the general standard.
    ruleFor: {
      "sdscheck": "r_hygiene_safety",
      "diluteaudit": "r_hygiene_quality",
      "handwashgap": "r_hygiene_logistics",
      "quarterbulk": "r_hygiene_logistics",
      "laundrytitrate": "r_hygiene_quality",
      "equipinstall": "r_hygiene_audit",
      "shiftsched": "_",
      "careclean": "r_hygiene_safety",
      "$order": "r_hygiene_credit",
      "$plan": "r_hygiene_logistics",
    },
    legalApprover: "Legal Counsel",
    rules: [
      {
            "id": "r_hygiene_terms",
            "title": "Hygiene commercial agreement terms compliance",
            "owner": "Commercial Operations Lead",
            "approver": "Sales Director",
            "exactWording": true,
            "scope": "All commercial accounts and contract orders",
            "neverDecides": "Never approves off-contract terms or unauthorized volume rebates"
      },
      {
            "id": "r_hygiene_quality",
            "title": "Hygiene product quality and specification standards",
            "owner": "Quality Assurance Lead",
            "approver": "Technical Director",
            "exactWording": false,
            "scope": "All product deliveries and site installations",
            "neverDecides": "Never accepts substandard goods without technical engineering sign-off"
      },
      {
            "id": "r_hygiene_credit",
            "title": "Hygiene commercial credit risk and exposure limit",
            "owner": "Credit Risk Lead",
            "approver": "Finance Director",
            "exactWording": false,
            "scope": "All credit accounts and terms extensions",
            "neverDecides": "Never overrides credit stop on delinquent customer ledger"
      },
      {
            "id": "r_hygiene_audit",
            "title": "Hygiene site compliance and asset verification",
            "owner": "Audit Specialist",
            "approver": "Operations Manager",
            "exactWording": false,
            "scope": "Customer operating locations and field equipment",
            "neverDecides": "Never waives mandatory annual asset reconciliation"
      },
      {
            "id": "r_hygiene_logistics",
            "title": "Hygiene delivery scheduling and cutoff compliance",
            "owner": "Logistics Coordinator",
            "approver": "Distribution Manager",
            "exactWording": false,
            "scope": "Standard and expedited transport routes",
            "neverDecides": "Never bypasses carrier freight manifest safety guidelines"
      },
      {
            "id": "r_hygiene_pricing",
            "title": "Hygiene standard discount tier schedule",
            "owner": "Pricing Analyst",
            "approver": "Commercial Strategy Lead",
            "exactWording": false,
            "scope": "Volume pricing agreements",
            "neverDecides": "Never authorizes margin concessions below floor rate"
      },
      {
            "id": "r_hygiene_safety",
            "title": "Hygiene operational health and safety standards",
            "owner": "Safety Officer",
            "approver": "EHS Director",
            "exactWording": false,
            "scope": "All customer site visits and handling areas",
            "neverDecides": "Never compromises required personal protective equipment rules"
      },
      {
            "id": "r_hygiene_sla",
            "title": "Hygiene exception turnaround SLA enforcement",
            "owner": "Customer Experience Lead",
            "approver": "Service Operations Manager",
            "exactWording": false,
            "scope": "All field exceptions and manager escalations",
            "neverDecides": "Never extends resolution deadline without customer consent"
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
            "id": "rd_hygiene_pricing",
            "title": "Hygiene commercial price book and discount tables active",
            "ready": true,
            "owner": "Pricing Strategy",
            "detail": "All active catalog items verified against commercial margin targets"
      },
      {
            "id": "rd_hygiene_inventory",
            "title": "Hygiene primary depot stock allocations confirmed",
            "ready": true,
            "owner": "Supply Chain",
            "detail": "Core product lines maintain minimum 14 days safety cover"
      },
      {
            "id": "rd_hygiene_credit_review",
            "title": "Hygiene annual customer credit limit reviews completed",
            "ready": true,
            "owner": "Credit Control",
            "detail": "92% of active commercial customer files reviewed and rated"
      },
      {
            "id": "rd_hygiene_sla_contracts",
            "title": "Hygiene customer service level commitments updated",
            "ready": false,
            "owner": "Service Operations",
            "detail": "Finalizing delivery SLA addendum for Tier 1 enterprise accounts"
      },
      {
            "id": "rd_hygiene_rep_cert",
            "title": "Hygiene field team technical product certifications current",
            "ready": true,
            "owner": "Training Lead",
            "detail": "All territory representatives passed annual product curriculum"
      },
      {
            "id": "rd_hygiene_audit_trail",
            "title": "Hygiene automated governance audit trail logging validated",
            "ready": true,
            "owner": "IT Compliance",
            "detail": "Continuous event logging confirmed with cryptographic integrity"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_hygiene_priority",
            "q": "What is the primary commercial priority for this {visit}?",
            "chips": [
      "Core range replenishment",
                  "New offering introduction",
                  "Contract terms review",
                  "Operational service audit"
    ],
            "resolvedType": "Visit priority"
      },
      {
            "id": "cq_hygiene_timing",
            "q": "What is the agreed fulfillment timeframe?",
            "chips": [
      "Standard depot dispatch",
                  "Expedited express shipment",
                  "Scheduled monthly consolidation"
    ],
            "resolvedType": "Fulfillment schedule"
      },
      {
            "id": "cq_hygiene_authority",
            "q": "Is customer procurement authority confirmed for this transaction?",
            "chips": [
      "Primary contact sign-off",
                  "Corporate procurement purchase order required",
                  "Review pending budget release"
    ],
            "resolvedType": "Authority check"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Commercial contract commitments exceed representative delegated authority limits for Hygiene"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in hygiene",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in hygiene",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in hygiene",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in hygiene",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in hygiene",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in hygiene",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in hygiene",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in hygiene",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in hygiene",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in hygiene",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in hygiene",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in hygiene",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in hygiene",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in hygiene",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in hygiene",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in hygiene",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in hygiene",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in hygiene",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in hygiene",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in hygiene",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in hygiene",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in hygiene",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in hygiene",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in hygiene",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in hygiene",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in hygiene",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in hygiene",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in hygiene",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in hygiene",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in hygiene",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in hygiene",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in hygiene",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in hygiene",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in hygiene",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in hygiene",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in hygiene",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in hygiene",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in hygiene",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in hygiene",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in hygiene",
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
