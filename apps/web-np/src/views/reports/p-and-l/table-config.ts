import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { markRaw } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderGetPAndLReport } from '#/api';
import { orderStatusList } from '#/shared/constants';
import { dayjsInGMT } from '#/shared/dayjs';
import { getDatePreset, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store/shop';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import {
  createTotalRow,
  generateDateColumns,
  groupData,
  transformDataRowToColumn,
} from './service';

const shopStore = useShopStore();

export const gridOptions: VxeTableGridOptions = {
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    isHover: true,
  },
  toolbarConfig: {
    search: true,
    refresh: true,
    zoom: true,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    expandAll: true,
  },
  exportConfig: {},
  height: 'auto',
  columns: [],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const data: any = await orderGetPAndLReport({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        if (data.items.length === 0) {
          return data;
        }

        // Group data base on GroupBy type
        if (formValues.groupBy !== 'daily') {
          data.items = groupData(data.items, formValues.groupBy);
        }

        // Create sum record - Start
        data.items.unshift(createTotalRow(data.items));

        generateDateColumns(gridApi, data.items);

        addExtraFields(data.items, false);
        data.items = transformDataRowToColumn(data.items, data.customCostList);

        return data;
      },
    },
  },
};

export const addExtraFields = (data: any, hasTotalCost: boolean = true) => {
  data.forEach((item: any) => {
    item.netProfit =
      item.grossProfit -
      item.totalTax -
      item.totalCustomCost -
      item.totalAdSpend;

    item.netProfitMargin = item.netPayment
      ? toPercentage(item.netProfit / item.netPayment)
      : 0;

    if (hasTotalCost) {
      item.totalCosts =
        item.totalAdSpend +
        item.totalCustomCost +
        item.cogs +
        item.handlingFees +
        item.shippingCosts +
        item.transactionFees;
    }
  });
};

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [
    ['date', ['fromDate', 'toDate'], 'YYYY-MM-DDTHH:mm:ssZ'],
    ['week', ['fromWeek', 'toWeek'], 'YYYY-MM-DDTHH:mm:ssZ'],
    ['month', ['fromMonth', 'toMonth'], 'YYYY-MM-DDTHH:mm:ssZ'],
  ],
  schema: [
    {
      component: 'Select' as any,
      defaultValue: 'daily',
      componentProps: {
        options: [
          {
            value: 'daily',
            label: 'Day',
          },
          {
            value: 'weekly',
            label: 'Week',
          },
          {
            value: 'monthly',
            label: 'Month',
          },
        ],
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'groupBy',
      label: 'Report type',
    },
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'day',
        pickerLimitName: '1 year',
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
      dependencies: {
        if(values) {
          return values.groupBy === 'daily';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjsInGMT().add(-6, 'days'), dayjsInGMT()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'week',
        pickerLimitName: '1 year',
        presets: getDatePreset(
          [
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
      dependencies: {
        if(values) {
          return values.groupBy === 'weekly';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjsInGMT().add(-6, 'days'), dayjsInGMT()],
      fieldName: 'week',
      label: 'Weekly',
    },
    {
      component: markRaw(DateRangePicker),
      componentProps: {
        picker: 'month',
        pickerLimitName: '1 year',
        presets: getDatePreset(
          [
            'lastMonth',
            'last2Months',
            'last3Months',
            'lastYear',
            'previousMonth',
            'thisMonth',
            'thisYear',
          ],
          true,
        ),
        disabled: shopStore.isFreeSubscription,
      },
      dependencies: {
        if(values) {
          return values.groupBy === 'monthly';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjsInGMT().add(-2, 'month'), dayjsInGMT()],
      fieldName: 'month',
      label: 'Month',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: orderStatusList,
        placeholder: 'Payment status',
        disabled: shopStore.isFreeSubscription,
      },
      fieldName: 'financialStatus',
      label: 'Status',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

export { Grid, gridApi };
