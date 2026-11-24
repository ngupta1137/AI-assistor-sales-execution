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
    if (this.clientData && this.clientData.accounts && this.clientData.accounts.length > 0) {
      return this.clientData;
    }
    // Fall back to synthetic data if customer dataset is not yet populated
    return generate(industry, country, options);
  }
}

/**
 * Remote API data provider stub for enterprise Production SaaS.
 * Connects to customer backend services via HTTPS JSON endpoints.
 */
export class RemoteApiDataProvider extends BaseDataProvider {
  constructor(baseUrl = '/api/v1') {
    super();
    this.baseUrl = baseUrl;
  }

  async loadTerritory(industry, country, options = {}) {
    // In full production, this fetches from the tenant API gateway.
    return generate(industry, country, options);
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
