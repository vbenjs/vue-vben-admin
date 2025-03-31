import { requestClient } from '#/api/request';

export async function getLTVReport(params: any) {
  return requestClient.get('/api/customer/ltv-report', { params });
}
