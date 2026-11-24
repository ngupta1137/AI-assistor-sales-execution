// Ingests and validates customer data (accounts, contacts, offerings, territories)
// for launching a client Proof of Concept (PoC) or populating CustomerDataProvider.
// Usage: node scripts/ingest-client-data.mjs --generate-sample client-data.json
//        node scripts/ingest-client-data.mjs --validate client-data.json

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const VALID_TIERS = ['A', 'B', 'C'];
const VALID_STATUSES = ['core', 'focus', 'new'];

/**
 * Validates a client data payload against the domain model requirements.
 */
export function validateCustomerData(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Input data must be a JSON object'], warnings };
  }

  // 1. Validate Rep / User
  if (!data.rep || typeof data.rep !== 'object') {
    errors.push('Missing required "rep" object { id, name, target }');
  } else {
    if (!data.rep.id) errors.push('rep.id is required');
    if (!data.rep.name) errors.push('rep.name is required');
    if (typeof data.rep.target !== 'number') warnings.push('rep.target should be a number');
  }

  // 2. Validate Accounts
  if (!Array.isArray(data.accounts) || data.accounts.length === 0) {
    errors.push('data.accounts must be a non-empty array');
  } else {
    const accountIds = new Set();
    data.accounts.forEach((acc, idx) => {
      const p = `accounts[${idx}]`;
      if (!acc.id) errors.push(`${p}.id is required`);
      else if (accountIds.has(acc.id)) errors.push(`Duplicate account id: ${acc.id}`);
      else accountIds.add(acc.id);

      if (!acc.name) errors.push(`${p}.name is required`);
      if (!acc.tier || !VALID_TIERS.includes(acc.tier)) {
        errors.push(`${p}.tier must be one of: ${VALID_TIERS.join(', ')}`);
      }
      if (!acc.geo || typeof acc.geo.lat !== 'number' || typeof acc.geo.lng !== 'number') {
        errors.push(`${p}.geo must contain valid numeric lat and lng`);
      }
      if (!Array.isArray(acc.hours) || acc.hours.length !== 2) {
        warnings.push(`${p}.hours should be [openMinutes, closeMinutes] (e.g. [540, 1020])`);
      }
    });
  }

  // 3. Validate Offerings (Products / Services)
  if (!Array.isArray(data.offerings) || data.offerings.length === 0) {
    errors.push('data.offerings must be a non-empty array');
  } else {
    const offeringIds = new Set();
    data.offerings.forEach((off, idx) => {
      const p = `offerings[${idx}]`;
      if (!off.id) errors.push(`${p}.id is required`);
      else if (offeringIds.has(off.id)) errors.push(`Duplicate offering id: ${off.id}`);
      else offeringIds.add(off.id);

      if (!off.name) errors.push(`${p}.name is required`);
      if (typeof off.price !== 'number' && off.price !== null) {
        errors.push(`${p}.price must be a number or null`);
      }
      if (!off.unit) warnings.push(`${p}.unit is missing (e.g. "case", "pack", "unit")`);
      if (!VALID_STATUSES.includes(off.status)) {
        warnings.push(`${p}.status should be one of: ${VALID_STATUSES.join(', ')}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      accountCount: data.accounts?.length || 0,
      offeringCount: data.offerings?.length || 0,
      hasRep: !!data.rep,
    },
  };
}

/**
 * Creates a sample client data payload for onboarding demonstrations.
 */
export function createSampleClientData(clientName = 'Acme Corp') {
  return {
    tenantId: 'client-poc-01',
    clientName,
    rep: {
      id: 'rep-101',
      name: 'Taylor Jordan',
      target: 85000,
    },
    accounts: [
      {
        id: 'ACC-001',
        name: 'Apex Health Center',
        segment: 'enterprise',
        tier: 'A',
        key: true,
        geo: { lat: 41.8781, lng: -87.6298 },
        address: '100 South Michigan Ave, Suite 400',
        city: 'Chicago',
        annualValue: 240000,
        hours: [510, 1080],
        contacts: [
          { name: 'Dr. Sarah Connor', role: 'Chief Medical Officer', lead: true },
          { name: 'Marcus Bell', role: 'Procurement Specialist', lead: false },
        ],
      },
      {
        id: 'ACC-002',
        name: 'Beacon Regional Clinic',
        segment: 'regional',
        tier: 'B',
        key: false,
        geo: { lat: 41.8819, lng: -87.6324 },
        address: '220 West Wacker Dr',
        city: 'Chicago',
        annualValue: 120000,
        hours: [540, 1020],
        contacts: [
          { name: 'David Evans', role: 'Practice Director', lead: true },
        ],
      },
      {
        id: 'ACC-003',
        name: 'Crestview Care Group',
        segment: 'independent',
        tier: 'A',
        key: false,
        geo: { lat: 41.8902, lng: -87.6256 },
        address: '500 North Michigan Ave',
        city: 'Chicago',
        annualValue: 185000,
        hours: [480, 1020],
        contacts: [
          { name: 'Elena Ramos', role: 'Head of Purchasing', lead: true },
        ],
      },
      {
        id: 'ACC-004',
        name: 'Downtown Medical Associates',
        segment: 'independent',
        tier: 'C',
        key: false,
        geo: { lat: 41.8835, lng: -87.6401 },
        address: '600 West Adams St',
        city: 'Chicago',
        annualValue: 60000,
        hours: [540, 960],
        contacts: [
          { name: 'James Miller', role: 'Office Manager', lead: true },
        ],
      },
    ],
    offerings: [
      { id: 'SKU-100', name: 'CardioStat Extended Release 50mg', price: 120, unit: 'box', status: 'core', category: 'Cardiovascular' },
      { id: 'SKU-101', name: 'CardioStat Rapid Release 25mg', price: 95, unit: 'box', status: 'core', category: 'Cardiovascular' },
      { id: 'SKU-102', name: 'EndoShield Pro Immuno-Infusion', price: 450, unit: 'vial', status: 'focus', category: 'Immunology' },
      { id: 'SKU-103', name: 'Vascuflow Anti-inflammatory 10mg', price: 75, unit: 'pack', status: 'new', category: 'Vascular' },
    ],
  };
}

async function main() {
  const args = process.argv.slice(2);
  const genIdx = args.indexOf('--generate-sample');
  const valIdx = args.indexOf('--validate');

  if (genIdx !== -1) {
    const targetFile = args[genIdx + 1] || 'client-poc-sample.json';
    const sample = createSampleClientData();
    await writeFile(targetFile, JSON.stringify(sample, null, 2), 'utf8');
    console.log(`Generated sample client data template: ${targetFile}`);
    console.log(`Contains ${sample.accounts.length} accounts and ${sample.offerings.length} product offerings.`);
    return;
  }

  if (valIdx !== -1) {
    const targetFile = args[valIdx + 1];
    if (!targetFile) {
      console.error('Error: specify a JSON file to validate: node scripts/ingest-client-data.mjs --validate <path>');
      process.exit(1);
    }
    const raw = await readFile(path.resolve(targetFile), 'utf8');
    const parsed = JSON.parse(raw);
    const result = validateCustomerData(parsed);

    console.log('Customer Data Validation Result:');
    console.log(`Valid: ${result.valid ? 'YES' : 'NO'}`);
    console.log(`Accounts: ${result.summary.accountCount}`);
    console.log(`Offerings: ${result.summary.offeringCount}`);

    if (result.warnings.length) {
      console.log('\nWarnings:');
      result.warnings.forEach((w) => console.log(`  [WARN] ${w}`));
    }
    if (result.errors.length) {
      console.log('\nErrors:');
      result.errors.forEach((e) => console.log(`  [ERROR] ${e}`));
      process.exit(1);
    } else {
      console.log('\nReady for PoC deployment in CustomerDataProvider!');
    }
    return;
  }

  console.log('Customer Data Ingestion Utility');
  console.log('Commands:');
  console.log('  node scripts/ingest-client-data.mjs --generate-sample [filename.json]');
  console.log('  node scripts/ingest-client-data.mjs --validate <filename.json>');
}

if (process.argv[1] && process.argv[1].endsWith('ingest-client-data.mjs')) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
