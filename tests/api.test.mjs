// ==============================================================================
// ENTERPRISE REST API INTEGRATION TEST SUITE
// ==============================================================================
// Verifies multi-tenant auth, territory endpoints, visit decisions, order creation,
// and batch sync conflict resolution on the Node.js enterprise backend.
// ==============================================================================

import assert from 'node:assert';
import { createServer } from '../server/src/server.mjs';

const PORT = 3099;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

let server;

async function run() {
  console.log('Starting Enterprise REST API Test Suite...');
  let passed = 0;
  const ok = (cond, msg) => {
    assert(cond, msg);
    passed++;
  };

  server = createServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  try {
    // 1. Health Probe
    const resHealth = await fetch(`${BASE_URL}/health`);
    ok(resHealth.status === 200, 'Health endpoint returns 200');
    const dataHealth = await resHealth.json();
    ok(dataHealth.status === 'healthy', 'Health check reports healthy');
    ok(dataHealth.service === 'ai-assistor-sales-api', 'Reports correct service name');

    // 2. Unauthenticated request to protected route
    const resUnauth = await fetch(`${BASE_URL}/auth/me`);
    ok(resUnauth.status === 401, 'Protected route rejects unauthenticated request with 401');

    // 3. Login Flow
    const resLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rep@acme.com', tenantId: 'tenant-acme-global' }),
    });
    ok(resLogin.status === 200, 'Login returns 200');
    const dataLogin = await resLogin.json();
    ok(typeof dataLogin.token === 'string' && dataLogin.token.length > 20, 'Login returns JWT token');
    ok(dataLogin.user.email === 'rep@acme.com', 'Login returns user profile');
    ok(dataLogin.user.tenantId === 'tenant-acme-global', 'Login returns correct tenantId');

    const token = dataLogin.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 4. Current User Profile
    const resMe = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
    ok(resMe.status === 200, '/auth/me returns 200');
    const dataMe = await resMe.json();
    ok(dataMe.user.email === 'rep@acme.com', '/auth/me matches current rep');
    ok(dataMe.tenant && dataMe.tenant.slug === 'acme-global', '/auth/me includes tenant details');

    // 5. Territory Day Schedule & Stops
    const resToday = await fetch(`${BASE_URL}/territories/today`, { headers: authHeaders });
    ok(resToday.status === 200, '/territories/today returns 200');
    const dataToday = await resToday.json();
    ok(Array.isArray(dataToday.plannedStops), 'Planned stops is an array');
    ok(dataToday.plannedStops.length >= 2, 'Contains at least 2 planned stops');
    ok(dataToday.plannedStops[0].account && dataToday.plannedStops[0].account.name, 'Stops have account details');

    // 6. Account Directory
    const resAccounts = await fetch(`${BASE_URL}/territories/accounts`, { headers: authHeaders });
    ok(resAccounts.status === 200, '/territories/accounts returns 200');
    const dataAccounts = await resAccounts.json();
    ok(dataAccounts.accounts.length >= 4, 'Account directory contains expected accounts');

    // 7. Offerings Catalog
    const resOfferings = await fetch(`${BASE_URL}/offerings`, { headers: authHeaders });
    ok(resOfferings.status === 200, '/offerings returns 200');
    const dataOfferings = await resOfferings.json();
    ok(dataOfferings.offerings.length >= 3, 'Offering catalog contains expected offerings');

    // 8. Visit Decisions Recording & Retrieval
    const resPostDecision = await fetch(`${BASE_URL}/visits/vis-1/decisions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        actionId: 'act-101-1',
        status: 'accepted',
        choice: 'Approved standard tier expansion',
        note: 'Customer agreed to sign next month',
        atMin: 575,
      }),
    });
    ok(resPostDecision.status === 201, 'Recording decision returns 201 Created');
    const dataPostDecision = await resPostDecision.json();
    ok(dataPostDecision.decision.status === 'accepted', 'Decision status persisted');

    const resGetDecisions = await fetch(`${BASE_URL}/visits/vis-1/decisions`, { headers: authHeaders });
    ok(resGetDecisions.status === 200, 'Fetching visit decisions returns 200');
    const dataGetDecisions = await resGetDecisions.json();
    ok(dataGetDecisions.decisions.length >= 1, 'Returns at least 1 decision');
    ok(dataGetDecisions.decisions[0].actionId === 'act-101-1', 'Decision actionId matches');

    // 9. Order Creation & Retrieval
    const resPostOrder = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        accountId: 'ACC-101',
        visitId: 'vis-1',
        totalAmount: 3700,
        currency: 'USD',
        items: [
          { offeringId: 'OFF-101', quantity: 2, unitPrice: 1850 },
        ],
      }),
    });
    ok(resPostOrder.status === 201, 'Creating order returns 201 Created');
    const dataPostOrder = await resPostOrder.json();
    ok(dataPostOrder.order.totalAmount === 3700, 'Order total amount persisted');

    const resGetOrders = await fetch(`${BASE_URL}/orders`, { headers: authHeaders });
    ok(resGetOrders.status === 200, 'Fetching orders returns 200');
    const dataGetOrders = await resGetOrders.json();
    ok(dataGetOrders.orders.length >= 1, 'Returns recorded order');

    // 10. Batch Offline Sync & Reconciliation
    const resBatchSync = await fetch(`${BASE_URL}/sync/batch`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mutations: [
          {
            type: 'decision',
            visitId: 'vis-2',
            payload: {
              actionId: 'act-102-1',
              status: 'declined',
              reason: 'Customer already stocked on lubricant',
              atMin: 650,
            },
          },
        ],
      }),
    });
    ok(resBatchSync.status === 200, 'Batch sync returns 200');
    const dataBatchSync = await resBatchSync.json();
    ok(dataBatchSync.status === 'synced', 'Batch sync status is synced');
    ok(dataBatchSync.reconciled.decisionsCreated === 1, 'Batch sync reconciled 1 decision');

    // 11. SAML 2.0 Identity Federation
    const resSamlMeta = await fetch(`${BASE_URL}/auth/saml/metadata`);
    ok(resSamlMeta.status === 200, 'SAML metadata returns 200 OK');
    const samlXml = await resSamlMeta.text();
    ok(samlXml.includes('<md:EntityDescriptor') && samlXml.includes('AssertionConsumerService'), 'Returns valid SAML SP XML metadata');

    const mockSamlResponse = Buffer.from(`
      <saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
        <saml2:Assertion>
          <saml2:Subject>
            <saml2:NameID>saml.rep@enterprise.corp</saml2:NameID>
          </saml2:Subject>
          <saml2:AttributeStatement>
            <saml2:Attribute Name="displayName"><saml2:AttributeValue>Federated Rep</saml2:AttributeValue></saml2:Attribute>
            <saml2:Attribute Name="role"><saml2:AttributeValue>rep</saml2:AttributeValue></saml2:Attribute>
          </saml2:AttributeStatement>
        </saml2:Assertion>
      </saml2p:Response>
    `).toString('base64');

    const resSamlAcs = await fetch(`${BASE_URL}/auth/saml/acs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SAMLResponse: mockSamlResponse, tenantId: 'tenant-acme-global' }),
    });
    ok(resSamlAcs.status === 200, 'SAML ACS login returns 200 OK');
    const dataSamlAcs = await resSamlAcs.json();
    ok(typeof dataSamlAcs.token === 'string', 'SAML ACS returns valid JWT session token');
    ok(dataSamlAcs.user.email === 'saml.rep@enterprise.corp', 'SAML assertion parsed correct user identity');

    // 12. OIDC Token Exchange
    const resOidc = await fetch(`${BASE_URL}/auth/oidc/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'auth_code_mock_9921', tenantId: 'tenant-acme-global' }),
    });
    ok(resOidc.status === 200, 'OIDC token exchange returns 200 OK');
    const dataOidc = await resOidc.json();
    ok(typeof dataOidc.access_token === 'string' && typeof dataOidc.id_token === 'string', 'OIDC returns access_token and id_token');

    // 13. SCIM 2.0 User Provisioning & Lifecycle (RFC 7644)
    const scimHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer scim_token_secret_admin_9182`,
    };

    const resScimSchemas = await fetch(`${BASE_URL}/scim/v2/Schemas`, { headers: scimHeaders });
    ok(resScimSchemas.status === 200, 'SCIM Schemas endpoint returns 200 OK');

    const resScimCreate = await fetch(`${BASE_URL}/scim/v2/Users`, {
      method: 'POST',
      headers: scimHeaders,
      body: JSON.stringify({
        userName: 'scim.user@enterprise.corp',
        displayName: 'SCIM Provisioned Representative',
        roles: [{ value: 'rep' }],
        active: true,
      }),
    });
    ok(resScimCreate.status === 201, 'SCIM Create User returns 201 Created');
    const dataScimUser = await resScimCreate.json();
    ok(dataScimUser.id && dataScimUser.userName === 'scim.user@enterprise.corp', 'SCIM user successfully provisioned');

    const resScimList = await fetch(`${BASE_URL}/scim/v2/Users`, { headers: scimHeaders });
    ok(resScimList.status === 200, 'SCIM Users list returns 200 OK');
    const dataScimList = await resScimList.json();
    ok(dataScimList.totalResults >= 3, 'SCIM Users list reflects newly provisioned user');

    const resScimDeactivate = await fetch(`${BASE_URL}/scim/v2/Users/${dataScimUser.id}`, {
      method: 'PATCH',
      headers: scimHeaders,
      body: JSON.stringify({ active: false }),
    });
    ok(resScimDeactivate.status === 200, 'SCIM User deprovisioning returns 200 OK');
    const dataDeactivated = await resScimDeactivate.json();
    ok(dataDeactivated.active === false, 'SCIM user active status updated to false');

    console.log(`Enterprise REST API: All ${passed} assertions passed cleanly.`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((err) => {
  console.error('API Test Suite Failed:', err);
  process.exit(1);
});
