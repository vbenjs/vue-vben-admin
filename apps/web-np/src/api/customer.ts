import { requestClient } from '#/api/request';

export async function customerGetLTVReport(params: any) {
  return requestClient.get('/api/customer/ltv-report', { params });
}
