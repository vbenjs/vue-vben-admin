import { requestClient } from '#/api/request';
import { calcGrossProfitMargin } from '#/utils';

export async function getProductSalesReport(params: any) {
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
