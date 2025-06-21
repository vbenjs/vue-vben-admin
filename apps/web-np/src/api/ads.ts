import { requestClient } from '#/api/request';

// Connection - Start
export async function getAccounts(params: any) {
  return requestClient.get('/api/ads/connection', { params });
}

export async function deleteAccount(id: string) {
  return requestClient.delete(`/api/ads/connection/${id}`);
}

export async function syncAccount(id: string) {
  return requestClient.post(`/api/ads/connection/${id}/sync`);
}

export async function syncAdInsight(accountId: string, adAccountId: string) {
  const url = `/api/ads/connection/${accountId}/sync-insights/${adAccountId}`;

  return requestClient.post(url);
}
// Connection - End

// Ad - Start
export async function getAdList(params: any) {
  return requestClient.get('/api/ads/ad', { params });
}

export async function adAttachToCosts(
  attachType: string,
  accountType: string,
  accountId: string,
  id: string,
  attach: boolean,
) {
  const url = `/api/ads/ad/attach-to-costs`;

  return requestClient.post(url, {
    attachType,
    accountType,
    accountId,
    id,
    attach,
  });
}

export async function syncAdInfo(
  accountType: string,
  accountId: string,
  adId: string,
) {
  const url = `/api/ads/ad/sync-ad-info`;

  return requestClient.post(url, { accountType, accountId, adId });
}
// Ad - End

// Ad Insights - Start
export async function getAdInsights(params: any) {
  return requestClient.get('/api/ads/insights', { params });
}
// Ad Insights - End
