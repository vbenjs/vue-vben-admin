import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getAccounts } from '#/api';
import { formatReportDate } from '#/shared/utils';

export const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    expandAll: false,
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
      field: 'nextSyncedAt',
      title: 'Next Sync',
      slots: { default: 'nextSyncedAt' },
      minWidth: 110,
    },
    {
      field: 'lastSyncedAt',
      title: 'Last Sync',
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
    {
      field: 'id',
      title: 'Attach to costs',
      titlePrefix: {
        content: 'Attach/Detach the Ad Accounts to the costs.',
      },
      slots: { default: 'addToCosts' },
      width: 150,
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
        return await generateTableData(page, formValues);
      },
    },
  },
};

async function generateTableData(page: any, formValues: any): Promise<any> {
  const onlyShowActiveAdAccounts = formValues.onlyShowActiveAdAccounts ?? false;
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
        if (onlyShowActiveAdAccounts && _adAccount.status !== 'active') {
          return;
        }

        if (_item.status === 'disconnected') {
          _adAccount.status = _item.status;
        }

        _adAccount.parentId = _item.id;
        _adAccount.expiredAt = null;
        children.push(_adAccount);
      });
    });

    res.items = [...res.items, ...children];
  }
}
