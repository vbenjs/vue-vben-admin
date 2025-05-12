import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getAccounts } from '#/api';
import { formatReportDate } from '#/utils';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    expandAll: true,
  },
  columns: [
    {
      field: 'type',
      title: 'Channel & Ad Accounts',
      slots: { default: 'type' },
      align: 'left',
      treeNode: true,
      minWidth: 250,
    },
    {
      field: 'status',
      title: 'Status',
      slots: { default: 'status' },
      align: 'center',
      minWidth: 110,
    },
    {
      field: 'lastSyncedAt',
      title: 'Last Synced',
      formatter: (time: any) => {
        return time.cellValue
          ? formatReportDate(time.cellValue)
          : (null as any);
      },
      minWidth: 110,
    },
    {
      field: 'nextSyncedAt',
      title: 'Next Synced',
      formatter: (time: any) => {
        return time.cellValue
          ? formatReportDate(time.cellValue)
          : (null as any);
      },
      minWidth: 110,
    },
    {
      field: 'expiredAt',
      title: 'Expired At',
      titlePrefix: {
        content:
          'For security reasons, the connection will expire, and you will need to reconnect manually.',
      },
      formatter: (time: any) => {
        return time.cellValue
          ? formatReportDate(time.cellValue)
          : (null as any);
      },
      minWidth: 110,
    },
    // {
    //   field: 'createdAt',
    //   title: 'Created At',
    //   formatter: (time: any) => {
    //     return formatReportDate(time.cellValue);
    //   },
    //   minWidth: 110,
    // },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '',
      minWidth: 110,
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
        return await generateTableData(page, formValues);
      },
    },
  },
};

async function generateTableData(page: any, formValues: any): Promise<any> {
  return await getAccounts({
    page: page.currentPage,
    pageSize: page.pageSize,
    ...formValues,
  }).then((res) => {
    generateChildrenRows(res);

    return res;
  });

  function generateChildrenRows(res: any) {
    const children: any = [];

    res.items.forEach((_item: any) => {
      _item.adAccounts.forEach((_adAccount: any) => {
        _adAccount.parentId = _item.id;
        _adAccount.expiredAt = null;
        children.push(_adAccount);
      });
    });

    res.items = [...res.items, ...children];
  }
}
