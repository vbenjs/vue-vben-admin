import { requestClient } from '#/api/request';

export async function regionUpdate(data: any) {
  return requestClient.post('/api/region', data);
}

export async function regionDelete(uuid: any) {
  return requestClient.delete(`/api/region/${uuid}`);
}
