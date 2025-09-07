import { requestClient } from '#/api/request';
import { calcGrossProfitMargin } from '#/shared/utils';

export async function productGetList(params: any) {
  return requestClient.get('/api/product', { params });
}

export async function productBulkUpdateFees(data: any) {
  return requestClient.put('/api/product/cost/bulk-update', data);
}

export async function productUpdateCogsByDateRange(data: any) {
  return requestClient.put('/api/product/cost/cogs-by-date-range', data);
}

export async function productGetSalesReport(params: any) {
  return requestClient
    .get('/api/product/sales-report', { params })
    .then((res) => {
      res.items = res.items.map((item: any) => {
        item.grossProfit = item.netPayment - item.cogs - item.handlingFees;
        item.grossProfitMargin = calcGrossProfitMargin(item);
        return item;
      });

      return res;
    });
}
