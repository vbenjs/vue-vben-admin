import type { Request } from 'express';

import type { AppRequestContext } from './request-context.types';

function normalizeHeaderValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
}

function parseFiscalYear(value: string) {
  const fiscalYear = value.trim();
  return /^\d{4}$/.test(fiscalYear) ? fiscalYear : undefined;
}

function parseTenantId(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  const tenantId = Number.parseInt(normalized, 10);
  return Number.isInteger(tenantId) && tenantId > 0 ? tenantId : undefined;
}

function parseTenantName(value: string) {
  const tenantName = value.trim();
  if (!tenantName) {
    return undefined;
  }
  try {
    return decodeURIComponent(tenantName);
  } catch {
    return tenantName;
  }
}

export function parseRequestContext(request: Request): AppRequestContext {
  return {
    fiscalYear: parseFiscalYear(normalizeHeaderValue(request.headers['x-fiscal-year'])),
    tenantId: parseTenantId(normalizeHeaderValue(request.headers['x-tenant-id'])),
    tenantName: parseTenantName(normalizeHeaderValue(request.headers['x-tenant-name'])),
  };
}
