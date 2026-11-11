// Governance pack content for meddevices: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    // Which rule governs each action. '_' means no specific rule applies; the card shows the general standard.
    ruleFor: {
      "case": "r_md_loaner",
      "reorder": "r_md_consignment",
      "reagents": "r_md_consignment",
      "trial": "r_md_ifu",
      "renew": "r_md_biomed",
      "inservice": "r_md_training",
      "complaint": "r_md_recall",
      "uptime": "r_md_biomed",
      "vac": "r_md_value",
      "consign": "r_md_consignment",
      "orslot": "_",
      "$order": "r_md_consignment",
      "$plan": "_",
    },
    legalApprover: "Quality & Regulatory Compliance Counsel",
    rules: [
      {
            "id": "r_md_ifu",
            "approvedWording": "Use this device only as described in the instructions for use. I cannot advise on any other use.",
            "title": "Strict manufacturer instructions for use compliance",
            "owner": "Regulatory Affairs Manager",
            "approver": "Chief Medical Officer",
            "exactWording": true,
            "scope": "All surgical suites and procedural evaluation areas",
            "neverDecides": "Never demonstrates or advocates off-label surgical techniques"
      },
      {
            "id": "r_md_sterility",
            "title": "Implantable device sterile barrier inspection protocol",
            "owner": "Quality Assurance Lead",
            "approver": "Clinical Operations Director",
            "exactWording": false,
            "scope": "All consigned hospital implant inventory",
            "neverDecides": "Never authorizes usage of device with compromised sterile packaging"
      },
      {
            "id": "r_md_consignment",
            "title": "Consigned surgical tray reconciliation and replenishment",
            "owner": "Consignment Audit Specialist",
            "approver": "Hospital Materials Manager",
            "exactWording": false,
            "scope": "Operating room inventory banks",
            "neverDecides": "Never writes off lost instrumentation without hospital procurement audit"
      },
      {
            "id": "r_md_biomed",
            "title": "Biomedical engineering electrical safety testing sign-off",
            "owner": "Field Service Engineer",
            "approver": "Technical Support Manager",
            "exactWording": false,
            "scope": "Powered surgical tools and diagnostic consoles",
            "neverDecides": "Never connects evaluation hardware without hospital safety inspection tag"
      },
      {
            "id": "r_md_loaner",
            "title": "Emergency surgical loaner set tracking and return SLA",
            "owner": "Loaner Logistics Coordinator",
            "approver": "Supply Chain Director",
            "exactWording": false,
            "scope": "Specialized trauma and revision procedure trays",
            "neverDecides": "Never waives mandatory post-case instrument decontamination sign-off"
      },
      {
            "id": "r_md_value",
            "title": "Clinical value analysis committee submission compliance",
            "owner": "Health Economics Specialist",
            "approver": "Commercial Strategy Lead",
            "exactWording": false,
            "scope": "New device procurement evaluations",
            "neverDecides": "Never promises pricing without formal hospital procurement tender"
      },
      {
            "id": "r_md_recall",
            "title": "Immediate safety notification and medical device alert protocol",
            "owner": "Safety Officer",
            "approver": "Regulatory Affairs Director",
            "exactWording": false,
            "scope": "All affected production lots and clinical sites",
            "neverDecides": "Never delays lot-specific device quarantine instructions"
      },
      {
            "id": "r_md_training",
            "title": "Surgeon and surgical staff technical in-service certification",
            "owner": "Clinical Education Specialist",
            "approver": "Professional Education Director",
            "exactWording": false,
            "scope": "operating room technical support staff",
            "neverDecides": "Never certifies surgical staff without hands-on dry lab completion"
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
            "id": "rd_ifu_curriculum",
            "title": "Updated IFU technical manuals distributed to clinical team",
            "ready": true,
            "owner": "Regulatory Affairs",
            "detail": "Technical revision 4.2 uploaded and acknowledged by all clinical reps"
      },
      {
            "id": "rd_tray_audit",
            "title": "Annual hospital consignment tray count completed",
            "ready": true,
            "owner": "Inventory Audit",
            "detail": "100% sterile tray reconciliation across 32 partner surgical suites"
      },
      {
            "id": "rd_biomed_clearance",
            "title": "Demonstration hardware hospital engineering certs active",
            "ready": true,
            "owner": "Field Service",
            "detail": "All active demo consoles certified for hospital electrical safety"
      },
      {
            "id": "rd_vac_submissions",
            "title": "Hospital value analysis committee dossier sign-offs",
            "ready": false,
            "owner": "Health Economics",
            "detail": "Three regional hospital tender evaluations pending economic dossier review"
      },
      {
            "id": "rd_laser_safety",
            "title": "Clinical laser and energy device safety training certified",
            "ready": true,
            "owner": "Clinical Education",
            "detail": "Specialist certification active through year-end"
      },
      {
            "id": "rd_recall_trace",
            "title": "Mock medical device field safety corrective action drill",
            "ready": true,
            "owner": "Quality Systems",
            "detail": "Demonstrated 100% lot containment within 3 hours"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_procedure_type",
            "q": "What surgical indication is scheduled for this case support?",
            "chips": [
      "Elective primary arthroplasty",
                  "Emergency trauma intervention",
                  "Revision surgical reconstruction",
                  "Diagnostic evaluation"
    ],
            "resolvedType": "Procedural context"
      },
      {
            "id": "cq_consignment_status",
            "q": "What is the current inventory status of the required tray?",
            "chips": [
      "Consigned on-site in hospital sterile core",
                  "Emergency loaner set in transit",
                  "Replenishment order required"
    ],
            "resolvedType": "Supply verification"
      },
      {
            "id": "cq_biomed_tag",
            "q": "Is the powered console tagged with current hospital inspection approval?",
            "chips": [
      "Safety tag current and verified",
                  "Inspection due within 14 days",
                  "Uninspected: biomedical review needed"
    ],
            "resolvedType": "Hardware clearance"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Hospital capital equipment evaluation agreement requires clinical engineering sign-off"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in meddevices",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in meddevices",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in meddevices",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in meddevices",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in meddevices",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in meddevices",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in meddevices",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in meddevices",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in meddevices",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in meddevices",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in meddevices",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in meddevices",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in meddevices",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in meddevices",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in meddevices",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in meddevices",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in meddevices",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in meddevices",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in meddevices",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in meddevices",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in meddevices",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in meddevices",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in meddevices",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in meddevices",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in meddevices",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in meddevices",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in meddevices",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in meddevices",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in meddevices",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in meddevices",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in meddevices",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in meddevices",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in meddevices",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in meddevices",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in meddevices",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in meddevices",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in meddevices",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in meddevices",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in meddevices",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in meddevices",
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
