import { createHmac } from 'crypto';

export interface SessionTokenPayload {
  exp: number;
  fiscalYear?: string;
  roles: string[];
  tenantId?: string;
  tenantName?: string;
  type: 'access' | 'refresh';
  userId: string;
  username: string;
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const base64 = padding === 0 ? normalized : normalized + '='.repeat(4 - padding);
  return Buffer.from(base64, 'base64').toString('utf8');
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createSessionToken(
  payload: Omit<SessionTokenPayload, 'exp'>,
  secret: string,
  expiresInSeconds: number,
) {
  const tokenPayload: SessionTokenPayload = {
    ...payload,
    exp: Date.now() + expiresInSeconds * 1000,
  };
  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string, secret: string) {
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = sign(payloadPart, secret);
  if (expectedSignature !== signaturePart) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadPart)) as SessionTokenPayload;
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
