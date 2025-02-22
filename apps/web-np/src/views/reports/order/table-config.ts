import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { formatDate } from '@vben/utils';

import { getReportOrderApi } from '#/api';
import { useShopStore } from '#/store';
import { calcGrossProfitMargin } from '#/utils';

const shopStore = useShopStore();
const state = reactive({
  currency: shopStore.shop.currency,
  rate: shopStore.shop.currencyRate ?? 1,
  footerData: <any>null,
});

export const orderTableOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-semibold',
      title: 'Order ID',
      minWidth: 120,
    },
    {
      field: 'processedAt',
      title: 'Date',
      formatter: (time: any) => {
        return formatDate(time.cellValue, 'MMM DD, YYYY');
      },
      minWidth: 110,
    },
    {
      field: 'quantityTotal',
      footerClassName: 'font-semibold',
      title: 'Items',
      minWidth: 100,
    },
    {
      field: 'quantityCurrent',
      footerClassName: 'font-semibold',
      title: 'Current Items',
      minWidth: 130,
      visible: false,
    },
    {
      field: 'quantityRefund',
      footerClassName: 'font-semibold',
      title: 'Refund Items',
      minWidth: 130,
      visible: false,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'grossSales',
      title: 'Gross Sales',
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'customerFee',
      title: 'Customer Paid',
      titlePrefix: {
        content: 'The fees paid by the customer. Ex: shipping, tips, etc.',
      },
      align: 'right',
      minWidth: 140,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'discount',
      title: 'Discount',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'refundTotal',
      title: 'Refund',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'netPayment',
      title: 'Revenue',
      titlePrefix: {
        content:
          'Net payment = Revenue = Gross sales + Customer paid - Discount - Refund',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'cogs',
      title: 'COGS',
      titlePrefix: {
        content:
          'Cost of Goods Sold (COGS) is the direct costs attributable to the production of the goods sold in a company. This amount includes the cost of the materials used in creating the good along with the direct labor costs used to produce the good.',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'handlingFees',
      title: 'Handling',
      titlePrefix: {
        content:
          'Handling fees are the costs associated with the handling of goods, including the cost of labor, packaging, and shipping.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'shippingCosts',
      title: 'Shipping Cost',
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'transactionFees',
      title: 'Transaction',
      titlePrefix: {
        content:
          'Transaction fees are fees that a merchant must pay every time a customer makes a purchase with a credit card. These fees can vary depending on the credit card company and the merchant account provider.',
      },
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'grossProfit',
      title: 'Gross Profit',
      titlePrefix: {
        content:
          'Gross profit = Revenue - COGS - Handling - Shipping cost - Transaction',
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellPercentage' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'grossProfitMargin',
      title: 'Gross Profit Margin',
      titlePrefix: {
        content: 'Gross profit margin = (Gross profit / Revenue) * 100%',
      },
      align: 'right',
      minWidth: 170,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getReportOrderApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        if (res.summary) {
          state.footerData = res.summary;

          // Reset some fields
          state.footerData.name = `${res.total} order(s)`;
          state.footerData.processedAt = '';
          state.footerData.grossProfitMargin = calcGrossProfitMargin(
            state.footerData,
          ).toString();
        } else {
          state.footerData = null;
        }

        return res;
      },
    },
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  showFooter: true,
  footerMethod: () => {
    if (!state.footerData) {
      return [];
    }

    return [state.footerData];
  },
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 2 }],
};
