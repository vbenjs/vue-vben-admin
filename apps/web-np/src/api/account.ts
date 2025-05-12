import { requestClient } from '#/api/request';

export async function getAccounts(params: any) {
  return requestClient.get('/api/account', { params });
}

export async function deleteAccount(id: string) {
  return requestClient.delete(`/api/account/${id}`);
}

export async function syncAccount(id: string) {
  return requestClient.post(`/api/account/${id}/sync`);
}
