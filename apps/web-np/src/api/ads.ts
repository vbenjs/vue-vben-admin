import { requestClient } from '#/api/request';

export async function getAccounts(params: any) {
  return requestClient.get('/api/ads', { params });
}

export async function getAdList(params: any) {
  return requestClient.get('/api/ads/ad-list', { params });
}

export async function deleteAccount(id: string) {
  return requestClient.delete(`/api/ads/${id}`);
}

export async function syncAccount(id: string) {
  return requestClient.post(`/api/ads/${id}/sync`);
}

export async function syncAdInsight(accountId: string, adAccountId: string) {
  const url = `/api/ads/${accountId}/sync-insights/${adAccountId}`;

  return requestClient.post(url);
}

export async function addAdCosts(
  accountId: string,
  adId: string,
  checked: boolean,
) {
  const url = `/api/ads/${accountId}/add-ad-costs/${adId}`;

  return requestClient.post(url, { attach: checked });
}
