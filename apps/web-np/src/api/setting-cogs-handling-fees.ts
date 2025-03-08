import { requestClient } from '#/api/request';

export async function getHandlingFeesAndCOGS(params: any) {
  return requestClient.get('/api/shop/settings/cogs-handling-fees', { params });
}

export async function updateCalcCOGSBy(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/calc-by',
    data,
  );
}

export async function updateCogsByDate(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/cogs/by-date',
    data,
  );
}

export async function updateCogsByRegion(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/cogs/by-date-rage',
    data,
  );
}

export async function updateHandlingFees(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/handling-fees',
    data,
  );
}

export async function updateRegionProducts(data: any) {
  return requestClient.put(
    '/api/shop/settings/cogs-handling-fees/region-products',
    data,
  );
}

export async function exportCogsHandlingFees(data: any) {
  return requestClient.post(
    '/api/shop/settings/cogs-handling-fees/export',
    data,
  );
}
