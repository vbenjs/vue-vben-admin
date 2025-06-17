import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getAdList } from '#/api';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'accountType',
      title: 'Ad Channel',
      slots: { default: 'accountType' },
      width: 100,
    },
    {
      field: 'id',
      title: 'Attach to costs',
      slots: { default: 'addToCosts' },
      width: 150,
    },
    {
      field: 'adName',
      title: 'Ad Name',
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adGroupName',
      title: 'Group Name',
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adCampaignName',
      title: 'Campaign Name',
      align: 'left',
      minWidth: 250,
    },
    {
      field: 'adAccountName',
      title: 'Accoumt Name',
      align: 'left',
      minWidth: 150,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '',
      minWidth: 110,
      align: 'left',
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  height: 'auto',
  rowConfig: {
    height: 58,
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAdList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }).then((res) => {
          return res;
        });
      },
    },
  },
};
