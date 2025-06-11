import { requestClient } from '#/api/request';
import { calcGrossProfitMargin } from '#/shared/utils';

export namespace ITableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function getOrders(params: ITableApi.PageFetchParams) {
  return requestClient.get('/api/order', { params }).then((res) => {
    res.items = res.items.map((item: any) => {
      item.grossProfitMargin = calcGrossProfitMargin(item);
      return item;
    });

    return res;
  });
}

export async function recalculateOrderCosts(payload: any) {
  return requestClient.post('/api/order/recalculate-costs', payload);
}

export async function getPAndLReport(params: any) {
  return requestClient.get('/api/order/p-and-l', { params });
}

export async function getOrderDetail(params: any) {
  return requestClient.get('/api/order/detail', { params });
}
