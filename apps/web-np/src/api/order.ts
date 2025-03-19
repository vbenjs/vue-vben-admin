import { requestClient } from '#/api/request';
import { calcGrossProfitMargin } from '#/utils';

export namespace ITableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

async function getReportOrderApi(params: ITableApi.PageFetchParams) {
  return requestClient.get('/api/order', { params }).then((res) => {
    res.items = res.items.map((item: any) => {
      item.grossProfitMargin = calcGrossProfitMargin(item);
      return item;
    });

    return res;
  });
}

export { getReportOrderApi };
