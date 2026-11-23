// Governance pack content for last-mile delivery: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    // Which rule governs each action. '_' means no specific rule applies; the card shows the general standard.
    ruleFor: {
      "cutoff": "r_lastmile_logistics",
      "checkout": "r_lastmile_terms",
      "address": "r_lastmile_sla",
      "ratecard": "r_lastmile_pricing",
      "peakbook": "r_lastmile_logistics",
      "returnsetup": "r_lastmile_sla",
      "onboard": "_",
      "pudocap": "r_lastmile_audit",
      "scanner": "r_lastmile_audit",
      "signage": "r_lastmile_audit",
      "supplies": "_",
      "quiettime": "_",
      "$order": "r_lastmile_credit",
      "$plan": "r_lastmile_logistics",
    },
    legalApprover: "Legal Counsel",
    rules: [
      {
            "id": "r_lastmile_terms",
            "title": "Published service levels in merchant communication",
            "owner": "Network Product Lead",
            "approver": "Commercial Director",
            "exactWording": true,
            "approvedWording": "Delivery choices are shown with their published service level only. No delivery date or time slot is promised.",
            "scope": "Checkout wording, merchant guides and quotes",
            "neverDecides": "Never approves a delivery date or slot that the network has not published"
      },
      {
            "id": "r_lastmile_quality",
            "title": "Parcel handling and packaging standards",
            "owner": "Network Quality Lead",
            "approver": "Operations Director",
            "exactWording": false,
            "scope": "Parcels collected from merchants and small shippers",
            "neverDecides": "Never accepts parcels that break the restricted items list"
      },
      {
            "id": "r_lastmile_credit",
            "title": "Shipper account credit and payment terms",
            "owner": "Credit Control Lead",
            "approver": "Finance Director",
            "exactWording": false,
            "scope": "Bookings on account and payment terms",
            "neverDecides": "Never lifts an account hold for unpaid invoices"
      },
      {
            "id": "r_lastmile_audit",
            "title": "Pickup point partner standards",
            "owner": "Network Partner Lead",
            "approver": "Network Operations Director",
            "exactWording": false,
            "scope": "Pickup point space, scanners, signage and hours",
            "neverDecides": "Never asks a partner to hold more parcels than its agreed space"
      },
      {
            "id": "r_lastmile_logistics",
            "title": "Collection times and peak capacity booking",
            "owner": "Depot Planning Lead",
            "approver": "City Operations Manager",
            "exactWording": false,
            "scope": "Collection loops, cutoff times and peak bookings",
            "neverDecides": "Never books capacity above the published peak calendar"
      },
      {
            "id": "r_lastmile_pricing",
            "title": "Published rate card and volume tiers",
            "owner": "Pricing Analyst",
            "approver": "Commercial Strategy Lead",
            "exactWording": false,
            "scope": "Parcel prices, surcharges and volume tiers",
            "neverDecides": "Never authorizes a price, discount or waiver that is not on the rate card"
      },
      {
            "id": "r_lastmile_safety",
            "title": "Site visit health and safety",
            "owner": "Safety Officer",
            "approver": "EHS Director",
            "exactWording": false,
            "scope": "Fulfillment floors and pickup point counters",
            "neverDecides": "Never walks a marked forklift lane without the required gear"
      },
      {
            "id": "r_lastmile_sla",
            "title": "Failed delivery and returns handling",
            "owner": "Customer Experience Lead",
            "approver": "Service Operations Manager",
            "exactWording": false,
            "scope": "Failed first attempts, address issues and returns",
            "neverDecides": "Never promises a claim outcome or a redelivery time"
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
            "id": "rd_lastmile_pricing",
            "title": "Last-mile published rate card and volume tiers active",
            "ready": true,
            "owner": "Pricing Strategy",
            "detail": "Current rate card loaded for every delivery service and city"
      },
      {
            "id": "rd_lastmile_inventory",
            "title": "Last-mile depot capacity plan published",
            "ready": true,
            "owner": "Supply Chain",
            "detail": "Collection loops and peak capacity published for the next four weeks"
      },
      {
            "id": "rd_lastmile_credit_review",
            "title": "Last-mile annual customer credit limit reviews completed",
            "ready": true,
            "owner": "Credit Control",
            "detail": "92% of active commercial customer files reviewed and rated"
      },
      {
            "id": "rd_lastmile_sla_contracts",
            "title": "Last-mile customer service level commitments updated",
            "ready": false,
            "owner": "Service Operations",
            "detail": "Finalizing delivery SLA addendum for Tier 1 enterprise accounts"
      },
      {
            "id": "rd_lastmile_rep_cert",
            "title": "Last-mile field team handbook certifications current",
            "ready": true,
            "owner": "Training Lead",
            "detail": "All account executives passed the pickup point handbook and data handling modules"
      },
      {
            "id": "rd_lastmile_audit_trail",
            "title": "Last-mile automated governance audit trail logging validated",
            "ready": true,
            "owner": "IT Compliance",
            "detail": "Continuous event logging confirmed with cryptographic integrity"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_lastmile_priority",
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
            "id": "cq_lastmile_timing",
            "q": "What is the agreed fulfillment timeframe?",
            "chips": [
      "Standard depot dispatch",
                  "Expedited express shipment",
                  "Scheduled monthly consolidation"
    ],
            "resolvedType": "Fulfillment schedule"
      },
      {
            "id": "cq_lastmile_authority",
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
    holdReasons: ["Commercial contract commitments exceed representative delegated authority limits for last-mile delivery"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in last-mile delivery",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in last-mile delivery",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in last-mile delivery",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in last-mile delivery",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in last-mile delivery",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in last-mile delivery",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in last-mile delivery",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in last-mile delivery",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in last-mile delivery",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in last-mile delivery",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in last-mile delivery",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in last-mile delivery",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in last-mile delivery",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in last-mile delivery",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in last-mile delivery",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in last-mile delivery",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in last-mile delivery",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in last-mile delivery",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in last-mile delivery",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in last-mile delivery",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in last-mile delivery",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in last-mile delivery",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in last-mile delivery",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in last-mile delivery",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in last-mile delivery",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in last-mile delivery",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in last-mile delivery",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in last-mile delivery",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in last-mile delivery",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in last-mile delivery",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in last-mile delivery",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in last-mile delivery",
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
