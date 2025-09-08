import { requestClient } from '#/api/request';
import { calcGrossProfitMargin } from '#/shared/utils';

export namespace ITableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function orderGetList(params: ITableApi.PageFetchParams) {
  return requestClient.get('/api/order', { params }).then((res) => {
    res.items = res.items.map((item: any) => {
      item.grossProfitMargin = calcGrossProfitMargin(item);
      return item;
    });

    return res;
  });
}

export async function orderRecalculateCosts(payload: any) {
  return requestClient.post('/api/order/recalculate-costs', payload);
}

export async function orderSyncManually(payload: any) {
  return requestClient.post('/api/order/sync', payload);
}

export async function orderGetPAndLReport(params: any) {
  return requestClient.get('/api/order/p-and-l', { params });
}

export async function orderGetDetail(params: any) {
  return requestClient.get('/api/order/detail', { params });
}

export async function orderDelete(ids: any) {
  return requestClient.delete('/api/order', {
    data: { ids },
  });
}

export async function orderUpdateCostsManually(payload: any) {
  return requestClient.post('/api/order/update-costs-manually', payload);
}
