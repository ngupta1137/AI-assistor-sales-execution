// Governance pack content for pharma: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    // Which rule governs each action. '_' means no specific rule applies; the card shows the general standard.
    ruleFor: {
      "detail": "r_ph_claims",
      "sample": "r_ph_samples",
      "stock": "r_ph_storage",
      "formulary": "r_ph_formulary",
      "restock": "_",
      "education": "r_ph_spend",
      "unseen": "r_ph_detailing",
      "consent": "_",
      "medinfo": "r_ph_adverse",
      "callslot": "_",
      "expiry": "r_ph_storage",
      "$order": "_",
      "$plan": "_",
    },
    legalApprover: "Medical & Regulatory Affairs Director",
    rules: [
      {
            "id": "r_ph_claims",
            "approvedWording": "I can only share information within the approved prescribing information. I cannot discuss uses outside the approved indication.",
            "title": "Approved indications and statutory prescribing information",
            "owner": "Medical Affairs Lead",
            "approver": "Medical Director",
            "exactWording": true,
            "scope": "All interactions with healthcare practitioners",
            "neverDecides": "Never provides off-label advice, dosing changes or comparative clinical efficacy claims"
      },
      {
            "id": "r_ph_samples",
            "title": "Physical medical sample allocation and accountability limits",
            "owner": "Sample Compliance Specialist",
            "approver": "Regulatory Affairs Manager",
            "exactWording": false,
            "scope": "Licensed healthcare practitioners with signed request forms",
            "neverDecides": "Never issues samples without verified medical practitioner license and signed receipt"
      },
      {
            "id": "r_ph_spend",
            "title": "Healthcare professional aggregate transfer-of-value ceiling",
            "owner": "Ethics & Compliance Officer",
            "approver": "Chief Legal Officer",
            "exactWording": false,
            "scope": "All educational events and hospitality",
            "neverDecides": "Never exceeds statutory annual meal or hospitality expenditure caps"
      },
      {
            "id": "r_ph_adverse",
            "title": "Mandatory 24-hour adverse event reporting protocol",
            "owner": "Pharmacovigilance Officer",
            "approver": "Head of Patient Safety",
            "exactWording": false,
            "scope": "All product experience feedback and spontaneous safety reports",
            "neverDecides": "Never classifies an adverse event as non-urgent without clinical triage"
      },
      {
            "id": "r_ph_grant",
            "title": "Segregation of commercial sales and independent educational grants",
            "owner": "Compliance Officer",
            "approver": "Medical Education Committee",
            "exactWording": false,
            "scope": "Hospital clinical departments and academic medical centers",
            "neverDecides": "Never links educational funding to hospital formulary adoption"
      },
      {
            "id": "r_ph_formulary",
            "title": "Hospital formulary committee inclusion status verification",
            "owner": "Market Access Manager",
            "approver": "Commercial Strategy Lead",
            "exactWording": false,
            "scope": "Tertiary hospitals and institutional health authorities",
            "neverDecides": "Never promises commercial rebates to individual prescribing clinicians"
      },
      {
            "id": "r_ph_detailing",
            "title": "Scientific exchange dwell time minimums",
            "owner": "Field Operations Specialist",
            "approver": "Medical Sales Director",
            "exactWording": false,
            "scope": "In-clinic scientific discussions",
            "neverDecides": "Never logs detailing events without licensed healthcare professional present"
      },
      {
            "id": "r_ph_storage",
            "title": "Cold-chain vaccine and biologic temperature monitoring",
            "owner": "Quality Assurance Specialist",
            "approver": "Supply Chain Operations Lead",
            "exactWording": false,
            "scope": "Refrigerated medicine storage and transit",
            "neverDecides": "Never dispenses stock with temperature excursion history"
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
            "id": "rd_pi_refresh",
            "title": "Approved prescribing information regulatory review",
            "ready": true,
            "owner": "Regulatory Affairs",
            "detail": "All active detailing materials validated against latest package insert"
      },
      {
            "id": "rd_sample_audit",
            "title": "Physician license verification and active status check",
            "ready": true,
            "owner": "Compliance Ops",
            "detail": "100% practitioner state license registry verification completed"
      },
      {
            "id": "rd_pv_training",
            "title": "Annual pharmacovigilance field certification",
            "ready": true,
            "owner": "Patient Safety",
            "detail": "All territory medical reps passed 24h reporting protocol examination"
      },
      {
            "id": "rd_spend_tracker",
            "title": "Aggregate spend reporting ledger reconciliation",
            "ready": false,
            "owner": "Finance & Compliance",
            "detail": "Reconciling Q3 educational hospitality records against statutory cap"
      },
      {
            "id": "rd_cold_chain",
            "title": "Clinic sample refrigeration log validation",
            "ready": true,
            "owner": "Quality Assurance",
            "detail": "Calibrated temperature data logger download verified"
      },
      {
            "id": "rd_ethics_charter",
            "title": "Medical interaction compliance charter sign-off",
            "ready": true,
            "owner": "Legal Counsel",
            "detail": "Annual ethical field engagement rules ratified"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_call_type",
            "q": "What is the primary scientific objective of this discussion?",
            "chips": [
      "Approved indication clinical update",
                  "Formulary access review",
                  "Sample accountability sign-off",
                  "Safety and pharmacovigilance check"
    ],
            "resolvedType": "Interaction classification"
      },
      {
            "id": "cq_hcp_specialty",
            "q": "What is the prescribing specialty of the {contact}?",
            "chips": [
      "Primary care physician",
                  "Consultant specialist",
                  "Hospital clinical pharmacologist"
    ],
            "resolvedType": "Medical audience"
      },
      {
            "id": "cq_sample_request",
            "q": "Has the {contact} completed a signed sample requisition?",
            "chips": [
      "Signed digital requisition on file",
                  "Physical form collected",
                  "Informational discussion only"
    ],
            "resolvedType": "Sample eligibility"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Statutory healthcare professional educational spend threshold requires Medical Affairs pre-approval"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in pharma",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in pharma",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in pharma",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in pharma",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in pharma",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in pharma",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in pharma",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in pharma",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in pharma",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in pharma",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in pharma",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in pharma",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in pharma",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in pharma",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in pharma",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in pharma",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in pharma",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in pharma",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in pharma",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in pharma",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in pharma",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in pharma",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in pharma",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in pharma",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in pharma",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in pharma",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in pharma",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in pharma",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in pharma",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in pharma",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in pharma",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in pharma",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in pharma",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in pharma",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in pharma",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in pharma",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in pharma",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in pharma",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in pharma",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in pharma",
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
