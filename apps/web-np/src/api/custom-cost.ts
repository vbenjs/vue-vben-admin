import type { ITableApi } from './order';

import { requestClient } from '#/api/request';

export interface ICustomCost {
  type: string;
}

async function getCustomCostList(params: ITableApi.PageFetchParams) {
  return requestClient.get('/api/custom-cost', { params });
}

export { getCustomCostList };
