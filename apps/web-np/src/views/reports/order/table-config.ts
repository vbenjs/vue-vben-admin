import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { $t } from '@vben/locales';

import { orderGetList } from '#/api';
import { calcGrossProfitMargin, formatReportDate } from '#/shared/utils';
import { useShopStore } from '#/store';

const shopStore = useShopStore();
const state = reactive({
  currency: shopStore.shop.currency,
  rate: shopStore.shop.currencyRate ?? 1,
  footerData: <any>null,
});

export const orderTableOptions: VxeTableGridOptions = {
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  rowConfig: {
    isHover: true,
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: { code: 'query' },
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
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await orderGetList({
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
  columns: [
    {
      type: 'checkbox',
      slots: { default: 'name' },
      field: 'name',
      footerClassName: 'font-semibold',
      title: 'Order ID',
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'processedAt',
      title: 'Date',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      minWidth: 110,
      fixed: 'left',
    },
    {
      field: 'financialStatus',
      cellRender: { name: 'cellTitle' },
      title: 'Status',
      minWidth: 200,
      visible: false,
    },
    {
      field: 'quantityCurrent',
      footerClassName: 'font-semibold',
      title: 'Current Items',
      minWidth: 130,
    },
    {
      field: 'quantityRefund',
      footerClassName: 'font-semibold',
      title: 'Refund Items',
      minWidth: 130,
      visible: false,
    },
    {
      field: 'quantityTotal',
      footerClassName: 'font-semibold',
      title: 'Total Items',
      minWidth: 100,
      visible: false,
    },
    {
      field: 'weight',
      title: 'Weight (Kg)',
      minWidth: 100,
      visible: false,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'grossSales',
      title: $t('field-name.grossSales'),
      titlePrefix: {
        content: $t('field-name.grossSalesExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'totalDiscount',
      title: $t('field-name.totalDiscount'),
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'totalRefund',
      title: $t('field-name.totalRefund'),
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'netPayment',
      title: $t('field-name.netPayment'),
      titlePrefix: {
        content: $t('field-name.netPaymentExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'cogs',
      title: $t('field-name.cogs'),
      titlePrefix: {
        content: $t('field-name.cogsExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'handlingFees',
      title: $t('field-name.handlingFees'),
      titlePrefix: {
        content: $t('field-name.handlingFeesExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'shippingCosts',
      title: $t('field-name.shippingCosts'),
      align: 'right',
      minWidth: 120,
    },
    {
      cellRender: { name: 'cellTitle' },
      field: 'paymentGateway',
      title: $t('field-name.paymentGateway'),
      align: 'center',
      minWidth: 160,
      visible: false,
    },
    {
      cellRender: { name: 'cellMoney' },
      footerClassName: 'font-semibold',
      field: 'transactionFees',
      title: $t('field-name.transactionFees'),
      titlePrefix: {
        content: $t('field-name.transactionFeesExplain'),
      },
      align: 'right',
      minWidth: 160,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'grossProfit',
      title: $t('field-name.grossProfit'),
      titlePrefix: {
        content: $t('field-name.grossProfitExplain'),
      },
      align: 'right',
      minWidth: 150,
    },
    {
      cellRender: { name: 'CellPercentage' },
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      field: 'grossProfitMargin',
      title: $t('field-name.grossProfitMargin'),
      titlePrefix: {
        content: $t('field-name.grossProfitMarginExplain'),
      },
      align: 'right',
      minWidth: 170,
    },
  ],
};
