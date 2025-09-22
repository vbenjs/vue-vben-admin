import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { markRaw } from 'vue';

import { $t } from '@vben/locales';

import { productGetSalesReport } from '#/api';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset } from '#/shared/utils';
import { useShopStore } from '#/store';
import Products from '#/views/settings/cogs-handling-fees/modules/products.vue';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

const shopStore = useShopStore();

export const gridOptions: VxeTableGridOptions = {
  height: 'auto',
  rowConfig: {
    height: 48,
    isHover: true,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page, sort }, formValues) => {
        const res = await productGetSalesReport({
          page: page.currentPage,
          pageSize: page.pageSize,
          sortBy: sort.field,
          sortOrder: sort.order,
          ...formValues,
        });

        return res;
      },
    },
    sort: true,
  },
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  sortConfig: {
    remote: true,
    defaultSort: {
      field: 'grossProfitMargin',
      order: 'desc',
    },
  },
  columns: [
    {
      field: 'productName',
      title: 'Name',
      slots: { default: 'productName' },
      minWidth: 300,
      align: 'left',
    },
    {
      field: 'quantityCurrent',
      className: 'font-semibold',
      title: 'Units Sold',
      minWidth: 130,
      sortable: true,
    },
    {
      field: 'quantityRefund',
      title: 'Refund',
      minWidth: 130,
      sortable: true,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      field: 'netPayment',
      title: $t('field-name.netPayment'),
      align: 'right',
      minWidth: 150,
      sortable: true,
    },
    {
      cellRender: { name: 'cellMoney' },
      field: 'cogs',
      title: $t('field-name.cogs'),
      titlePrefix: {
        content: $t('field-name.cogsExplain'),
      },
      align: 'right',
      minWidth: 150,
      sortable: true,
    },
    {
      cellRender: { name: 'cellMoney' },
      field: 'handlingFees',
      title: $t('field-name.handlingFees'),
      titlePrefix: {
        content: $t('field-name.handlingFeesExplain'),
      },
      align: 'right',
      minWidth: 150,
      sortable: true,
    },
    {
      cellRender: { name: 'cellMoney' },
      className: 'font-semibold',
      field: 'grossProfit',
      title: $t('field-name.grossProfit'),
      titlePrefix: {
        content: 'Gross profit = Revenue - COGS - Handling',
      },
      align: 'right',
      minWidth: 150,
      sortable: true,
    },
    {
      cellRender: { name: 'CellPercentage' },
      className: 'font-semibold',
      field: 'grossProfitMargin',
      title: $t('field-name.grossProfitMargin'),
      titlePrefix: {
        content: $t('field-name.grossProfitMarginExplain'),
      },
      align: 'right',
      minWidth: 170,
      sortable: true,
    },
  ],
};

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['fromDate', 'toDate'], 'YYYY-MM-DDTHH:mm:ssZ']],
  schema: [
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'day',
        pickerLimitName: '6 months',
        presets: getDatePreset(
          [
            'today',
            'last7Days',
            'last14Days',
            'lastMonth',
            'last2Months',
            'last3Months',
            'previousMonth',
            'thisMonth',
          ],
          true,
        ),
        disabled: shopStore.isFreeSubscription,
      },
      defaultValue: [dayjsInGMT().add(-1, 'month').add(1, 'day'), dayjsInGMT()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: markRaw(Products),
      defaultValue: [],
      fieldName: 'productIds',
      label: 'Products',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};
