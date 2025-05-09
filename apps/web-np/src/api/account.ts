import { requestClient } from '#/api/request';

export async function getAccounts(params: any) {
  return requestClient.get('/api/account', { params });
}
