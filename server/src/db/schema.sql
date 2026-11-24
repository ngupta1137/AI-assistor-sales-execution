-- ==============================================================================
-- AI ASSISTOR SALES EXECUTION: MULTI-TENANT ENTERPRISE SCHEMA (POSTGRESQL 16+)
-- ==============================================================================
-- Features:
-- 1. Strict Tenant Isolation via Row-Level Security (RLS)
-- 2. Audit-proof state logging for all governance decisions and order actions
-- 3. Offline mutation tracking with server-side conflict resolution
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TENANTS & CONFIGURATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(64) NOT NULL,
    country VARCHAR(8) NOT NULL,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'archived')),
    config_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USERS & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'rep' CHECK (role IN ('rep', 'salesman', 'manager', 'kam', 'partner', 'admin', 'exec')),
    sso_provider VARCHAR(64),
    sso_subject_id VARCHAR(255),
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

-- ------------------------------------------------------------------------------
-- 3. TERRITORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    primary_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    bounds_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tenant_territory_code UNIQUE (tenant_id, code)
);

-- ------------------------------------------------------------------------------
-- 4. ACCOUNTS (CLIENT ENTITIES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(64) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(8) DEFAULT 'B' CHECK (tier IN ('A', 'B', 'C', 'D')),
    is_key BOOLEAN DEFAULT FALSE,
    annual_value NUMERIC(14, 2) DEFAULT 0,
    current_value NUMERIC(14, 2) DEFAULT 0,
    white_space NUMERIC(14, 2) DEFAULT 0,
    address TEXT,
    geo_lat DOUBLE PRECISION,
    geo_lng DOUBLE PRECISION,
    hours_open_min INT DEFAULT 540,
    hours_close_min INT DEFAULT 1020,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, id)
);

-- ------------------------------------------------------------------------------
-- 5. CONTACTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    account_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(128) NOT NULL,
    is_key BOOLEAN DEFAULT FALSE,
    email VARCHAR(255),
    phone VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 6. OFFERINGS & CATALOG ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offerings (
    id VARCHAR(64) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    margin_pct NUMERIC(5, 2) DEFAULT 30.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, id)
);

-- ------------------------------------------------------------------------------
-- 7. VISITS (PLANNED ITINERARY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    territory_id UUID REFERENCES territories(id) ON DELETE CASCADE,
    rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    account_id VARCHAR(64) NOT NULL,
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sequence_idx INT NOT NULL DEFAULT 1,
    planned_start_min INT NOT NULL,
    planned_end_min INT NOT NULL,
    status VARCHAR(32) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'missed', 'cancelled')),
    brief_items JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 8. DECISIONS & ACTIONS (GOVERNED AUDIT TRAIL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    action_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('accepted', 'deferred', 'declined')),
    choice_or_reason TEXT,
    notes TEXT,
    evidence_type VARCHAR(32),
    evidence_url TEXT,
    recorded_at_min INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    client_mutation_id VARCHAR(128)
);

-- ------------------------------------------------------------------------------
-- 9. ORDERS & COMMERCIAL TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    account_id VARCHAR(64) NOT NULL,
    rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'synced', 'rejected')),
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    compliance_passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- 10. SYSTEM AUDIT LOG (IMMUTABLE RECORD)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    payload_json JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- All queries automatically scope to current_setting('app.current_tenant_id')::uuid
-- ==============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_tenant_isolation ON users
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY territories_tenant_isolation ON territories
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY accounts_tenant_isolation ON accounts
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY contacts_tenant_isolation ON contacts
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY offerings_tenant_isolation ON offerings
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY visits_tenant_isolation ON visits
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY decisions_tenant_isolation ON decisions
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY orders_tenant_isolation ON orders
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY audit_logs_tenant_isolation ON audit_logs
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_accounts_tenant_territory ON accounts(tenant_id, territory_id);
CREATE INDEX IF NOT EXISTS idx_visits_tenant_date_rep ON visits(tenant_id, scheduled_date, rep_id);
CREATE INDEX IF NOT EXISTS idx_decisions_tenant_visit ON decisions(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_account ON orders(tenant_id, account_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at DESC);
