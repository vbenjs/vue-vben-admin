import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getCustomCostList } from '#/api';
import { formatReportDate } from '#/utils';

import { customCostTypes } from './service';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-semibold',
      title: 'Name',
      minWidth: 200,
    },
    {
      field: 'startDate',
      title: 'Start date',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'endDate',
      title: 'End date',
      formatter: (time: any) => {
        if (!time.cellValue) {
          return 'On going';
        }

        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'type',
      title: 'Type',
      formatter: (val: any): any => {
        return customCostTypes.find((item) => item.value === val.cellValue)
          ?.label;
      },
      width: 200,
    },
    {
      field: 'dailyCost',
      title: 'Daily Cost',
      slots: { default: 'dailyCost' },
      align: 'left',
      width: 200,
    },
    {
      field: 'note',
      title: 'Note',
      align: 'left',
      width: 200,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: 'Action',
      fixed: 'right',
      align: 'right',
      width: 100,
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getCustomCostList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return res;
      },
    },
  },
};
