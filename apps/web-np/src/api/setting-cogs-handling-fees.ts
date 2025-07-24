import { requestClient } from '#/api/request';

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

export async function importCogsHandlingFees(data: any) {
  return requestClient.request('/api/shop/settings/cogs-handling-fees/import', {
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
