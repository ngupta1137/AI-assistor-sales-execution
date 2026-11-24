# Client PoC Onboarding and Deployment Guide

This guide describes how to deploy, configure, and evaluate the AI Assistor Sales Execution platform during a customer Proof of Concept (PoC) or pilot evaluation.

---

## 1. Overview & Architecture

The AI Assistor platform is designed for enterprise field sales execution. For client PoCs, the platform runs in a **zero-infrastructure, privacy-preserving client-side architecture**:

- **No Remote Exfiltration**: Customer data remains entirely inside the client session and local browser storage (`LocalStorageAdapter`).
- **Offline Capable (PWA)**: Field sales representatives can run briefings, record approvals, log overrides, and capture evidence without continuous mobile connectivity.
- **Pluggable Data Architecture**: Switch seamlessly between synthetic industry demonstrations and real customer accounts using `CustomerDataProvider`.
- **Governed Audit Trail**: All field rep decisions, compliance waivers, and order changes generate an exportable audit log.

---

## 2. Ingesting Real Customer Data

To test the application with real customer accounts, territories, and product catalogs, use the built-in ingestion CLI:

### Step 2.1: Prepare the JSON Dataset
Create a client payload file matching the schema defined in `scripts/sample-client-poc.json`:

```json
{
  "clientName": "Acme Industrial Corp",
  "tenantId": "acme-global",
  "industry": "manufacturing",
  "country": "US",
  "accounts": [
    {
      "id": "ACC-001",
      "name": "Apex Engineering Solutions",
      "tier": "A",
      "key": true,
      "annualValue": 250000,
      "current": 180000,
      "whiteSpace": 70000,
      "address": "1200 Industrial Pkwy, Chicago, IL",
      "contacts": [
        { "name": "Elena Rostova", "role": "VP Operations", "key": true }
      ]
    }
  ],
  "offerings": [
    {
      "id": "OFF-100",
      "name": "Precision Sensor Unit A4",
      "category": "Sensors",
      "price": 1250,
      "margin": 38
    }
  ]
}
```

### Step 2.2: Validate Dataset via CLI
Run the automated validator to confirm schema compliance before loading:

```bash
node scripts/ingest-client-data.mjs --file ./path-to-customer-data.json
```

The CLI verifies:
1. Valid account entries with ID, name, tier, and value attributes.
2. Offering catalog pricing and margin ranges.
3. Industry and country pack compatibility.

---

## 3. Loading Customer Data into the App

### Option A: In-App 1-Click Load (Recommended for Demos)
1. Launch the application.
2. Click the **Sync & Settings** button in the lower toolbar (or upper menu).
3. Select **Tab 5: Client PoC & Export**.
4. Click **Load Sample Client PoC Dataset**.
5. The application will instantly switch to the customer dataset, persist the state, and reload planned accounts.
6. To return to the synthetic baseline, click **Revert to Synthetic Demonstration Data**.

### Option B: Local File Ingestion
In Tab 5 of the Sync dialog, paste or drag-and-drop the prepared JSON file directly into the client ingestion box. The data provider automatically adapts the planned stops and account profiles.

---

## 4. Field Testing & Offline Execution (PWA)

Field representatives can install and test the application on mobile devices (iOS / Android) or laptops:

1. **Install as PWA**: Open the application in Safari (iOS) or Chrome (Android / Desktop) and choose **Add to Home Screen** or **Install App**.
2. **Offline Simulation**: In Tab 5 or via the offline toggle, disconnect network access. All brief updates, signatures, photos, and decisions continue functioning seamlessly.
3. **Session Persistence**: Closing the browser or refreshing the page retains all pending orders, notes, and checklist items.

---

## 5. Exporting Pilot Results for Executive Review

At the conclusion of a pilot day or sales week, export the recorded decisions for management review:

1. Open **Sync & Settings -> Tab 5: Client PoC & Export**.
2. Click **Export Decisions CSV** to download a structured CSV containing:
   - Action ID
   - Account ID and Account Name
   - Action Status (Accepted, Deferred, Declined)
   - Choice or Override Reason
   - Rep Notes and Time Stamp
3. Click **Export Full Session JSON** for complete state backup and CRM sync readiness.

---

## 6. Security and Compliance Checklist

- [x] **Zero Server Dependency**: No customer account names or financial values leave the browser during client evaluation.
- [x] **No Third-Party Trackers**: Zero telemetry or third-party analytics scripts embedded.
- [x] **Compliant AI Guardrails**: All recommendations cite deterministic governance rules with refusal triggers for out-of-policy actions.
