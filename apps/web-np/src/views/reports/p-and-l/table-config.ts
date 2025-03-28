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

        // Group data base on GroupBy type
        if (formValues.groupBy === 'monthly') {
          const newDataItems: any[] = [];
          data.items.forEach((record: any) => {
            const _date = dayjs(record.date).format('YYYY-MM');

            const existingRecord = newDataItems.find(
              (item) => item.date === _date,
            );

            if (existingRecord) {
              for (const key in record) {
                if (key !== 'date') {
                  existingRecord[key] =
                    (existingRecord[key] || 0) + record[key];
                }
              }
            } else {
              newDataItems.push({
                ...record,
                date: _date,
              });
            }
          });

          data.items = newDataItems;
        }

        // Create sum record - Start
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
        // Create sum record - End

        generateDateColumns(data.items);

        // Calculate extra fields
        data.items = addExtraFields(data.items);
        data.items = transformDataRowToColumn(data.items, data.customCostList);

        return data;
      },
    },
  },
};

const generateDateColumns = (data: IPAndLReport[]) => {
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

function transformDataRowToColumn(data: any[], costName: any): any[] {
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

const groupBy = [
  {
    value: 'daily',
    label: 'Daily',
  },
  // {
  //   value: 'weekly',
  //   label: 'Weekly',
  // },
  {
    value: 'monthly',
    label: 'Monthly',
  },
];

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [
    ['date', ['fromDate', 'toDate']],
    ['month', ['fromMonth', 'toMonth']],
  ],
  schema: [
    {
      component: 'Select' as any,
      defaultValue: 'daily',
      componentProps: {
        options: groupBy,
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
