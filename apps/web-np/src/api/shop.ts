import { requestClient } from '#/api/request';

export async function getShopStatistic(payload: any) {
  return requestClient.get('/api/shop/statistic', {
    params: payload,
  });
}

export async function updateGeneralSettings(data: any) {
  return requestClient.put('/api/shop/settings/general', data);
}

export async function updateTransactionFees(data: any) {
  return requestClient.put('/api/shop/settings/transaction-fees', {
    transactionFees: data,
  });
}

export async function shopUpdateSubscriptionInfo() {
  return requestClient.post('/api/shop/subscription/sync');
}

export async function updateRegion(data: any) {
  return requestClient.post('/api/region', data);
}

export async function removeRegion(uuid: any) {
  return requestClient.delete(`/api/region/${uuid}`);
}

export async function shopMailReport(payload: any) {
  return requestClient.post(`/api/shop/mail/report`, payload);
}

export async function shopUpdateMailReport(data: any) {
  return requestClient.put('/api/shop/settings/mail-report', data);
}
