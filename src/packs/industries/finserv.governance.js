// Governance pack content for finserv: rules, rights, readiness, outcomes,
// clarify questions, account features, memory notes, golden cases and blind evaluation suites.
// Plain language, short sentences, zero em dashes, fictional sample data throughout.

import { buildGovernance } from '../governance-base.js';

export default {
  governance: buildGovernance({
    legalApprover: "Chief Compliance Officer",
    rules: [
      {
            "id": "r_fs_credit",
            "title": "Strict credit underwriting authority limits and delegation",
            "owner": "Credit Underwriting Lead",
            "approver": "Credit Committee Chair",
            "exactWording": true,
            "scope": "All credit facilities and loan proposals",
            "neverDecides": "Never approves loans, sets interest rates or waives debt service covenants"
      },
      {
            "id": "r_fs_kyc",
            "title": "Customer identification and anti-money laundering verification",
            "owner": "AML Compliance Officer",
            "approver": "Head of Financial Crime",
            "exactWording": false,
            "scope": "All new account onboarding and high-value transactions",
            "neverDecides": "Never proceeds with account setup without verified institutional beneficial ownership"
      },
      {
            "id": "r_fs_suitability",
            "title": "Commercial product suitability and client classification check",
            "owner": "Conduct Risk Specialist",
            "approver": "Regulatory Compliance Director",
            "exactWording": false,
            "scope": "Complex structured and commercial financing instruments",
            "neverDecides": "Never classifies a retail client as wholesale without statutory asset verification"
      },
      {
            "id": "r_fs_conflict",
            "title": "Intermediary commission and fee disclosure transparency",
            "owner": "Fair Trading Specialist",
            "approver": "Commercial Ethics Officer",
            "exactWording": false,
            "scope": "All broker arrangements and commercial intermediary commissions",
            "neverDecides": "Never conceals intermediary fee splits or trailing commissions"
      },
      {
            "id": "r_fs_vulnerable",
            "title": "Customer vulnerability identification and protection protocol",
            "owner": "Customer Care Lead",
            "approver": "Operations Director",
            "exactWording": false,
            "scope": "Personal guarantee providers and small business guarantors",
            "neverDecides": "Never enforces expedited asset security against identified vulnerable counterparties"
      },
      {
            "id": "r_fs_pricing",
            "title": "Approved commercial pricing matrix and margin floors",
            "owner": "Treasury Pricing Lead",
            "approver": "Chief Financial Officer",
            "exactWording": false,
            "scope": "Standard commercial lending and treasury products",
            "neverDecides": "Never discounts margin below cost-of-funds transfer pricing floor"
      },
      {
            "id": "r_fs_sanctions",
            "title": "Real-time sanctions and politically exposed persons screening",
            "owner": "Sanctions Compliance Officer",
            "approver": "General Counsel",
            "exactWording": false,
            "scope": "All cross-border transactions and new commercial counterparties",
            "neverDecides": "Never overrides automated sanctions screening alert"
      },
      {
            "id": "r_fs_advice",
            "title": "Clear demarcation between factual information and advice",
            "owner": "Legal Counsel",
            "approver": "Chief Compliance Officer",
            "exactWording": false,
            "scope": "All field discussions and marketing presentations",
            "neverDecides": "Never provides tailored investment advice without registered adviser license"
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
            "id": "rd_aml_audit",
            "title": "Independent AML program audit and screening tool validation",
            "ready": true,
            "owner": "Financial Crime",
            "detail": "Annual audit report signed with zero high-risk findings"
      },
      {
            "id": "rd_rate_matrix",
            "title": "Central treasury cost-of-funds margin floors published",
            "ready": true,
            "owner": "Treasury Ops",
            "detail": "Current commercial interest rate tables synchronized across fleet"
      },
      {
            "id": "rd_kyc_refresh",
            "title": "Enterprise KYC periodic review schedule on track",
            "ready": true,
            "owner": "Client Onboarding",
            "detail": "94% of intermediary master files updated within statutory cycle"
      },
      {
            "id": "rd_delegation_table",
            "title": "Annual credit committee delegated authority schedule ratified",
            "ready": true,
            "owner": "Credit Policy",
            "detail": "Board approved credit authority matrices active"
      },
      {
            "id": "rd_broker_conduct",
            "title": "Intermediary conduct review and licensing check",
            "ready": false,
            "owner": "Distribution Compliance",
            "detail": "Verifying professional indemnity certificates for 12 regional brokers"
      },
      {
            "id": "rd_disclaimer_gate",
            "title": "Statutory disclaimer gate verified across mobile client",
            "ready": true,
            "owner": "Legal Systems",
            "detail": "Mandatory disclaimer display confirmed on mobile workflows"
      }
    ],
    clarifyQuestions: [
      {
            "id": "cq_client_entity",
            "q": "What is the statutory business structure of this commercial client?",
            "chips": [
      "Registered corporate enterprise",
                  "Partnership entity",
                  "Trust structure",
                  "Sole proprietor"
    ],
            "resolvedType": "Entity classification"
      },
      {
            "id": "cq_facility_type",
            "q": "What financial product is requested by the intermediary?",
            "chips": [
      "Secured equipment finance",
                  "Working capital revolving facility",
                  "Commercial real estate loan",
                  "Treasury hedging line"
    ],
            "resolvedType": "Product suitability"
      },
      {
            "id": "cq_kyc_status",
            "q": "Is beneficial ownership documentation current and verified?",
            "chips": [
      "Current verified within 90 days",
                  "Refresh documentation requested",
                  "Incomplete: escalation required"
    ],
            "resolvedType": "Regulatory compliance"
      }
    ],
    staleLimitDays: 14,
    holdReasons: ["Proposed credit facility or underwriting commitment exceeds representative delegated authority limit"],
    goldenCases: [
      {
            "id": "gc-potential-1",
            "capability": "potential",
            "scenario": "High confidence potential opportunity with verified field evidence in finserv",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-2",
            "capability": "potential",
            "scenario": "Ambiguous customer context requires clarification question before potential recommendation in finserv",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-3",
            "capability": "potential",
            "scenario": "Historical record missing required field documentation; asks for evidence update in finserv",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-potential-4",
            "capability": "potential",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this potential in finserv",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-5",
            "capability": "potential",
            "scenario": "Source data for potential is older than agreed freshness threshold; flags stale and offers refresh in finserv",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-6",
            "capability": "potential",
            "scenario": "Attempted action on potential falls outside current user assigned role authority in finserv",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-7",
            "capability": "potential",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in finserv",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-potential-8",
            "capability": "potential",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in finserv",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-1",
            "capability": "gaps",
            "scenario": "High confidence gaps opportunity with verified field evidence in finserv",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-2",
            "capability": "gaps",
            "scenario": "Ambiguous customer context requires clarification question before gaps recommendation in finserv",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-3",
            "capability": "gaps",
            "scenario": "Historical record missing required field documentation; asks for evidence update in finserv",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-4",
            "capability": "gaps",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this gaps in finserv",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-5",
            "capability": "gaps",
            "scenario": "Source data for gaps is older than agreed freshness threshold; flags stale and offers refresh in finserv",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-6",
            "capability": "gaps",
            "scenario": "Attempted action on gaps falls outside current user assigned role authority in finserv",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-7",
            "capability": "gaps",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in finserv",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-gaps-8",
            "capability": "gaps",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in finserv",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-1",
            "capability": "ranking",
            "scenario": "High confidence ranking opportunity with verified field evidence in finserv",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-2",
            "capability": "ranking",
            "scenario": "Ambiguous customer context requires clarification question before ranking recommendation in finserv",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-3",
            "capability": "ranking",
            "scenario": "Historical record missing required field documentation; asks for evidence update in finserv",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-4",
            "capability": "ranking",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this ranking in finserv",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-5",
            "capability": "ranking",
            "scenario": "Source data for ranking is older than agreed freshness threshold; flags stale and offers refresh in finserv",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-6",
            "capability": "ranking",
            "scenario": "Attempted action on ranking falls outside current user assigned role authority in finserv",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-7",
            "capability": "ranking",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in finserv",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-ranking-8",
            "capability": "ranking",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in finserv",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-1",
            "capability": "planning",
            "scenario": "High confidence planning opportunity with verified field evidence in finserv",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-2",
            "capability": "planning",
            "scenario": "Ambiguous customer context requires clarification question before planning recommendation in finserv",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-3",
            "capability": "planning",
            "scenario": "Historical record missing required field documentation; asks for evidence update in finserv",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-planning-4",
            "capability": "planning",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this planning in finserv",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-5",
            "capability": "planning",
            "scenario": "Source data for planning is older than agreed freshness threshold; flags stale and offers refresh in finserv",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-6",
            "capability": "planning",
            "scenario": "Attempted action on planning falls outside current user assigned role authority in finserv",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-7",
            "capability": "planning",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in finserv",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-planning-8",
            "capability": "planning",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in finserv",
            "expectedDecision": "evidence",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-1",
            "capability": "order",
            "scenario": "High confidence order opportunity with verified field evidence in finserv",
            "expectedDecision": "suggest",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-2",
            "capability": "order",
            "scenario": "Ambiguous customer context requires clarification question before order recommendation in finserv",
            "expectedDecision": "clarify",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-3",
            "capability": "order",
            "scenario": "Historical record missing required field documentation; asks for evidence update in finserv",
            "expectedDecision": "evidence",
            "critical": true,
            "status": "Pass"
      },
      {
            "id": "gc-order-4",
            "capability": "order",
            "scenario": "Two approved corporate policies disagree on prioritization threshold for this order in finserv",
            "expectedDecision": "conflict",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-5",
            "capability": "order",
            "scenario": "Source data for order is older than agreed freshness threshold; flags stale and offers refresh in finserv",
            "expectedDecision": "stale",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-6",
            "capability": "order",
            "scenario": "Attempted action on order falls outside current user assigned role authority in finserv",
            "expectedDecision": "role",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-7",
            "capability": "order",
            "scenario": "Statutory regulatory limit detected; mandatory compliance escalation triggered in finserv",
            "expectedDecision": "compliance",
            "critical": false,
            "status": "Pass"
      },
      {
            "id": "gc-order-8",
            "capability": "order",
            "scenario": "Camera photo is blurred or incomplete; asks for retake without claiming validation in finserv",
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
