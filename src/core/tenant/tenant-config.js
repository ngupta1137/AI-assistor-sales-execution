// Tenant and customer configuration management.
// Allows launching with various enterprise customers by applying client-specific
// vocabulary, branding, catalog overrides, and custom governance rules without
// modifying underlying industry pack files.

export class TenantConfigManager {
  constructor(defaultTenantId = 'standard') {
    this.tenantId = defaultTenantId;
    this.configs = new Map();
    this.initDefaultConfig();
  }

  initDefaultConfig() {
    this.configs.set('standard', {
      tenantId: 'standard',
      name: 'Default Tenant',
      vocabOverrides: {},
      customRules: [],
      branding: {
        accentColor: null,
        companyName: null,
      },
    });
  }

  registerTenant(config) {
    if (!config || !config.tenantId) throw new Error('Tenant config requires tenantId');
    this.configs.set(config.tenantId, {
      ...this.configs.get('standard'),
      ...config,
    });
  }

  getTenantConfig(tenantId = this.tenantId) {
    return this.configs.get(tenantId) || this.configs.get('standard');
  }

  setTenant(tenantId) {
    if (this.configs.has(tenantId)) {
      this.tenantId = tenantId;
    }
  }

  /**
   * Applies client-specific overrides cleanly over an industry pack context.
   */
  applyTenantOverrides(baseContext) {
    const config = this.getTenantConfig();
    if (!config) return baseContext;

    // Apply vocabulary customizations if defined
    if (config.vocabOverrides && Object.keys(config.vocabOverrides).length > 0) {
      baseContext.industry = {
        ...baseContext.industry,
        vocab: {
          ...baseContext.industry.vocab,
          ...config.vocabOverrides,
        },
      };
    }

    // Apply client custom business rules
    if (config.customRules && config.customRules.length > 0) {
      const existingRules = baseContext.industry.governance?.rules || [];
      baseContext.industry = {
        ...baseContext.industry,
        governance: {
          ...(baseContext.industry.governance || {}),
          rules: [...existingRules, ...config.customRules],
        },
      };
    }

    return baseContext;
  }
}

let activeTenantManager = null;

export function getTenantManager() {
  if (!activeTenantManager) {
    activeTenantManager = new TenantConfigManager();
  }
  return activeTenantManager;
}

export function setTenantManager(manager) {
  activeTenantManager = manager;
}
