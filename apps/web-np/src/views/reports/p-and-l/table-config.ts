import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPAndLReport } from '#/api';
import { orderStatusList } from '#/constants';
import { toPercentage } from '#/utils';

import {
  createTotalRow,
  generateDateColumns,
  groupData,
  transformDataRowToColumn,
} from './service';

export const gridOptions: VxeTableGridOptions = {
  pagerConfig: {
    enabled: false,
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
        const data: any = await getPAndLReport({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        if (data.items.length === 0) {
          return data;
        }

        // Group data base on GroupBy type
        if (formValues.groupBy !== 'daily') {
          data.items = groupData(data.items, formValues);
        }

        // Create sum record - Start
        data.items.unshift(createTotalRow(data.items));

        generateDateColumns(gridApi, data.items);

        data.items = addExtraFields(data.items);
        data.items = transformDataRowToColumn(data.items, data.customCostList);

        return data;
      },
    },
  },
};

const addExtraFields = (data: any) => {
  data.forEach((item: any) => {
    item.netProfit = item.grossProfit - item.totalTax - item.totalCustomCost;
    item.netProfitMargin = item.netPayment
      ? toPercentage(item.netProfit / item.netPayment)
      : 0;
  });

  return data;
};

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [
    ['date', ['fromDate', 'toDate']],
    ['week', ['fromWeek', 'toWeek']],
    ['month', ['fromMonth', 'toMonth']],
    ['quarter', ['fromQuarter', 'toQuarter']],
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
          {
            value: 'quarter',
            label: 'Quarter',
          },
        ],
      },
      fieldName: 'groupBy',
      label: 'Report type',
    },
    {
      component: 'RangePicker',
      componentProps: {
        // Show last week button
        presets: [
          { label: 'Today', value: [dayjs().add(-1, 'd'), dayjs()] },
          { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
          { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
          { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
        ],
      },
      dependencies: {
        if(values) {
          return values.groupBy === 'daily';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'RangePicker',
      componentProps: {
        picker: 'week',
      },
      dependencies: {
        if(values) {
          return values.groupBy === 'weekly';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjs(), dayjs()],
      fieldName: 'week',
      label: 'Weekly',
    },
    {
      component: 'RangePicker',
      componentProps: {
        picker: 'month',
      },
      dependencies: {
        if(values) {
          return values.groupBy === 'monthly';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjs(), dayjs()],
      fieldName: 'month',
      label: 'Month',
    },
    {
      component: 'RangePicker',
      componentProps: {
        picker: 'quarter',
      },
      dependencies: {
        if(values) {
          return values.groupBy === 'quarter';
        },
        triggerFields: ['groupBy'],
      },
      defaultValue: [dayjs(), dayjs()],
      fieldName: 'quarter',
      label: 'Quarter',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: orderStatusList,
        placeholder: 'Payment status',
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
