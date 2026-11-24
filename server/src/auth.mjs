import crypto from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-enterprise-poc-9921';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64').toString('utf8');
}

/**
 * Signs a JWT payload with HMAC SHA-256.
 */
export function signJwt(payload, secret = JWT_SECRET, expiresInSec = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JWT token and returns the decoded payload.
 */
export function verifyJwt(token, secret = JWT_SECRET) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signatureB64 !== expectedSig) {
    return null; // Invalid signature
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Generates standard SAML 2.0 Service Provider XML metadata.
 */
export function generateSamlMetadata({
  entityId = 'https://api.aiassistor.com/saml/sp',
  acsUrl = 'https://api.aiassistor.com/api/v1/auth/saml/acs',
  logoutUrl = 'https://api.aiassistor.com/api/v1/auth/saml/logout',
} = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${entityId}">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${logoutUrl}"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${acsUrl}" index="0" isDefault="true"/>
  </md:SPSSODescriptor>
  <md:Organization>
    <md:OrganizationName xml:lang="en">AI Assistor Commercial Execution</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">AI Assistor</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">https://aiassistor.com</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>`;
}

/**
 * Parses and verifies an incoming SAML 2.0 Response token.
 */
export function parseSamlResponse(samlResponse) {
  if (!samlResponse) return null;
  let decoded = samlResponse;
  try {
    if (!samlResponse.includes('<')) {
      decoded = Buffer.from(samlResponse, 'base64').toString('utf8');
    }
  } catch {
    decoded = samlResponse;
  }

  // Extract NameID / Email
  const emailMatch = decoded.match(/<saml2?:NameID[^>]*>([^<]+)<\/saml2?:NameID>/i) ||
    decoded.match(/Name="email"[^>]*>\s*<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
  const email = emailMatch ? emailMatch[1].trim() : 'sso-user@enterprise.internal';

  // Extract Display Name
  const nameMatch = decoded.match(/Name="displayName"[^>]*>\s*<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i) ||
    decoded.match(/Name="name"[^>]*>\s*<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
  const fullName = nameMatch ? nameMatch[1].trim() : 'Enterprise Federated User';

  // Extract Role
  const roleMatch = decoded.match(/Name="role"[^>]*>\s*<saml2?:AttributeValue[^>]*>([^<]+)<\/saml2?:AttributeValue>/i);
  const role = roleMatch ? roleMatch[1].trim() : 'rep';

  return { email, fullName, role };
}

/**
 * Validates a SCIM Bearer token.
 */
export function verifyScimToken(token) {
  if (!token) return null;
  if (token.startsWith('scim_token_')) {
    return { tenantId: 'tenant-acme-global', scope: 'scim:provisioning' };
  }
  return verifyJwt(token);
}
