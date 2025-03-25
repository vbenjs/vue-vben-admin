import type { VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPAndLReport } from '#/api';

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
        }).then((res) => {
          return res;
        });

        generateColumns(data.items);

        data.items = transformData(data.items);

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
      width: 150,
      align: 'left',
    },
  ];

  data.forEach((item) => {
    ymCols.push({
      title: item.date,
      field: item.date,
      width: 150,
      align: 'right',
      cellRender: { name: 'cellMoney' },
    });
  });

  gridApi.setGridOptions({
    columns: ymCols,
  });
};

function transformData(data: any[]): any[] {
  const result: any[] = [];

  if (data.length === 0) return result;

  const keys = Object.keys(data[0]).filter((key) => key !== 'date');

  keys.forEach((key) => {
    const obj: any = { id: key };
    data.forEach((entry) => {
      obj[entry.date] = entry[key];
    });
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
        options: [
          {
            value: 'AUTHORIZED',
            label: 'Authorized',
          },
          {
            value: 'PAID',
            label: 'Paid',
          },
          {
            value: 'PARTIALLY_PAID',
            label: 'Partially Paid',
          },
          {
            value: 'PARTIALLY_REFUNDED',
            label: 'Partially Refunded',
          },
          {
            value: 'PENDING',
            label: 'Pending',
          },
          {
            value: 'VOIDED',
            label: 'Voided',
          },
        ],
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
