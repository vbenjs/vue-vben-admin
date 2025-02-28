import { requestClient } from '#/api/request';

export async function updateGeneralSettings(data: any) {
  return requestClient.put('/api/shop/settings/general', data);
}

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

export async function updateTransactionFees(data: any) {
  return requestClient.put('/api/shop/settings/transaction-fees', {
    transactionFees: data,
  });
}

export async function updateRegion(data: any) {
  return requestClient.post('/api/region', data);
}

export async function removeRegion(uuid: any) {
  return requestClient.delete(`/api/region/${uuid}`);
}
