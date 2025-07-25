import { requestClient } from '#/api/request';

export async function shopGetList(params: any) {
  return requestClient.get('/admin/shop', { params });
}

export async function shopGenerateToken(shopId: any) {
  return requestClient.get(`/admin/shop/${shopId}/token`);
}
