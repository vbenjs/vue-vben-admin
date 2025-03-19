import type { ITableApi } from './order';

import { requestClient } from '#/api/request';

export interface ICustomCost {
  id: string;
  type: string;
  name: string;
  note: string;
  periodCost: string;
  dailyCost: string;
  grossSaleRate: number;
  startDate: string;
  endDate: string;
  updatedAt: string;
  createdAt: string;
}

async function getCustomCostList(params: ITableApi.PageFetchParams) {
  return requestClient.get('/api/custom-cost', { params });
}

async function deleteCustomCost(ids: any) {
  return requestClient.delete('/api/custom-cost/', {
    data: {
      ids,
    },
  });
}

async function storeCustomCost(payload: any) {
  return requestClient.post('/api/custom-cost/', payload);
}

export { deleteCustomCost, getCustomCostList, storeCustomCost };
