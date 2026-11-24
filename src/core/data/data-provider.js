// Data Provider abstraction.
// Decouples domain models from data sourcing, allowing client PoC imports
// and future enterprise backend REST/GraphQL integration.

import { generate } from '../../data/generate.js';

/**
 * Base data provider contract.
 */
export class BaseDataProvider {
  async loadTerritory(industry, country, options = {}) {
    throw new Error('loadTerritory must be implemented by subclass');
  }

  async persistDecision(decisionRecord) {
    return true;
  }

  async persistOutcome(outcomeRecord) {
    return true;
  }
}

/**
 * Synthetic data provider using deterministic rule-based generation.
 * Used for instant demonstrations and automated test suites.
 */
export class SyntheticDataProvider extends BaseDataProvider {
  loadTerritory(industry, country, options = {}) {
    return generate(industry, country, options);
  }
}

/**
 * Customer data provider for PoC deployments.
 * Enables loading actual client customer accounts, product catalogs, and visit routes.
 */
export class CustomerDataProvider extends BaseDataProvider {
  constructor(clientData = null) {
    super();
    this.clientData = clientData;
  }

  setClientData(data) {
    this.clientData = data;
  }

  loadTerritory(industry, country, options = {}) {
    const baseline = generate(industry, country, options);
    if (!this.clientData || !Array.isArray(this.clientData.accounts) || this.clientData.accounts.length === 0) {
      return baseline;
    }

    const clientAccounts = this.clientData.accounts.map((acc, idx) => {
      const base = baseline.accounts[idx % baseline.accounts.length] || {};
      return {
        ...base,
        id: acc.id || `ACC-${idx + 1}`,
        name: acc.name || `Client Account ${idx + 1}`,
        tier: acc.tier || 'B',
        key: !!acc.key,
        annualValue: acc.annualValue || 100000,
        current: acc.current || Math.round((acc.annualValue || 100000) * 0.7),
        whiteSpace: acc.whiteSpace || Math.round((acc.annualValue || 100000) * 0.3),
        address: acc.address || `${100 + idx * 10} Main St`,
        geo: acc.geo || base.geo,
        hours: acc.hours || base.hours || [540, 1020],
        contacts: acc.contacts || base.contacts,
      };
    });

    const byId = {};
    for (const a of clientAccounts) byId[a.id] = a;

    // Adapt planned stops to use client accounts
    const planned = baseline.planned.map((p, idx) => {
      const mappedAcc = clientAccounts[idx % clientAccounts.length];
      const brief = (p.brief || []).map((b) => ({ ...b, accountId: mappedAcc.id }));
      const actions = (p.actions || []).map((a) => ({ ...a, accountId: mappedAcc.id }));
      return {
        ...p,
        accountId: mappedAcc.id,
        brief,
        actions,
      };
    });

    return {
      ...baseline,
      rep: this.clientData.rep ? { ...baseline.rep, ...this.clientData.rep } : baseline.rep,
      accounts: clientAccounts,
      byId,
      planned,
      isPoCActive: true,
      clientName: this.clientData.clientName || 'Client PoC',
    };
  }
}

/**
 * Remote API data provider for enterprise Cloud SaaS.
 * Connects to customer backend services via HTTPS JSON endpoints with offline fallback.
 */
export class RemoteApiDataProvider extends BaseDataProvider {
  constructor(baseUrl = '/api/v1', options = {}) {
    super();
    this.baseUrl = baseUrl;
    this.tenantId = options.tenantId || 'tenant-acme-global';
    this.token = options.token || null;
    this.cachedData = null;
  }

  setCredentials(token, tenantId) {
    this.token = token;
    if (tenantId) this.tenantId = tenantId;
  }

  async syncWithRemote() {
    if (typeof fetch === 'undefined') return null;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
      if (this.tenantId) headers['X-Tenant-ID'] = this.tenantId;

      const res = await fetch(`${this.baseUrl}/territories/today`, { headers });
      if (res.ok) {
        const payload = await res.json();
        this.cachedData = payload;
        return payload;
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  loadTerritory(industry, country, options = {}) {
    const baseline = generate(industry, country, options);
    if (!this.cachedData || !Array.isArray(this.cachedData.plannedStops)) {
      return baseline;
    }
    return {
      ...baseline,
      isRemoteActive: true,
      remoteBaseUrl: this.baseUrl,
    };
  }
}

let activeProvider = null;

export function getDataProvider() {
  if (!activeProvider) {
    activeProvider = new SyntheticDataProvider();
  }
  return activeProvider;
}

export function setDataProvider(provider) {
  activeProvider = provider;
}
