import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getAccounts } from '#/api';
import { formatReportDate } from '#/utils';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'type',
      title: 'Type',
      slots: { default: 'type' },
      align: 'left',
      minWidth: 250,
    },
    // {
    //   field: 'status',
    //   title: 'Status',
    // },
    {
      field: 'expiredAt',
      title: 'Expired At',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      minWidth: 110,
    },
    {
      field: 'createdAt',
      title: 'Created At',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      minWidth: 110,
    },
    // {
    //   field: 'action',
    //   slots: { default: 'action' },
    //   title: 'Action',
    //   fixed: 'right',
    //   align: 'right',
    //   width: 100,
    // },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  height: 'auto',
  rowConfig: {
    height: 48,
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getAccounts({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return res;
      },
    },
  },
};
