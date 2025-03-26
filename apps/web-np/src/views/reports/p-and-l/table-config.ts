import type { VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPAndLReport } from '#/api';
import { orderStatusList } from '#/constants';
import { toPercentage } from '#/utils';

interface IPAndLReport {
  date: string;
}

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

        // eslint-disable-next-line unicorn/no-array-reduce
        const sumRecords = data.items.reduce((acc: any, record: any) => {
          for (const key in record) {
            if (key !== 'date') {
              acc[key] = (acc[key] || 0) + record[key];
            }
          }
          return acc;
        }, {});

        sumRecords.date = 'Total';
        data.items.unshift(sumRecords);

        generateColumns(data.items);

        // Calculate extra fields
        data.items = addExtraFields(data.items);
        data.items = transformData(data.items, data.customCostList);

        return data;
      },
    },
  },
};

const generateColumns = (data: IPAndLReport[]) => {
  const ymCols: VxeGridPropTypes.Columns = [
    {
      title: 'Date',
      field: 'id',
      slots: { default: 'id' },
      width: 200,
      align: 'left',
      treeNode: true,
    },
  ];

  data.forEach((item) => {
    ymCols.push({
      title: item.date,
      field: item.date,
      width: 150,
      align: 'right',
      slots: { default: 'date' },
    });
  });

  gridApi.setGridOptions({
    columns: ymCols,
  });
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

function transformData(data: any[], costName: any): any[] {
  const result: any[] = [];

  if (data.length === 0) return result;

  const keys = Object.keys(data[0]).filter((key) => key !== 'date');

  keys.forEach((key) => {
    const obj: any = { id: key };
    data.forEach((entry) => {
      obj[entry.date] = entry[key];
    });

    // Check key include string 'totalCustomCost'
    if (key.includes('totalCustomCost_')) {
      obj.parentId = 'totalCustomCost';

      const costId: any = key.split('_')[1];
      obj.costName = 'N/A';

      if (costName[costId]) {
        obj.costName = costName[costId];
      }
    }

    result.push(obj);
  });

  return result;
}

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['fromDate', 'toDate']]],
  schema: [
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
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
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
