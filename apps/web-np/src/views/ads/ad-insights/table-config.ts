import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { format } from 'currency-formatter';

import { getAdInsights } from '#/api';
import { formatReportDate } from '#/shared/utils';

const state = reactive({
  footerData: <any>null,
});

export const gridOptions: VxeTableGridOptions = {
  showFooter: true,
  mergeFooterItems: [{ row: 0, col: 0, rowspan: 1, colspan: 3 }],
  footerMethod: () => {
    if (!state.footerData) {
      return [];
    }

    return [state.footerData];
  },
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'accountType',
      title: 'Ad Channel',
      footerClassName: 'font-semibold',
      slots: { default: 'accountType' },
      width: 100,
      fixed: 'left',
    },
    {
      field: 'date',
      title: 'Date',
      footerClassName: 'font-semibold',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      width: 110,
      fixed: 'left',
    },
    {
      field: 'adName',
      title: 'Ad Name',
      footerClassName: 'font-semibold',
      minWidth: 110,
      align: 'left',
    },
    {
      field: 'adGroupName',
      title: 'Ad Group',
      footerClassName: 'font-semibold',
      minWidth: 150,
      align: 'left',
      visible: false,
    },
    {
      field: 'adCampaignName',
      title: 'Ad Campaign',
      footerClassName: 'font-semibold',
      minWidth: 150,
      align: 'left',
      visible: false,
    },
    {
      field: 'adAccountName',
      title: 'Ad Account',
      footerClassName: 'font-semibold',
      minWidth: 150,
      align: 'left',
      visible: false,
    },
    {
      field: 'impressions',
      title: 'Impressions',
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'reach',
      title: 'Reach',
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'clicks',
      title: 'Clicks',
      footerClassName: 'font-semibold',
      minWidth: 120,
    },
    {
      field: 'ctr',
      title: 'CTR',
      footerClassName: 'font-semibold',
      cellRender: { name: 'CellPercentage' },
      minWidth: 120,
    },
    {
      field: 'spendUSD',
      title: 'Spend (USD)',
      className: 'font-semibold',
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
    {
      field: 'cpcUSD',
      title: 'CPC (USD)',
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
    {
      field: 'cppUSD',
      title: 'CPP (USD)',
      footerClassName: 'font-semibold',
      align: 'right',
      cellRender: { name: 'cellMoney', props: { currency: 'USD', rate: 1 } },
      minWidth: 120,
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    refresh: { code: 'query' },
    zoom: true,
    custom: true,
  },
  height: 'auto',
  rowConfig: {
    height: 58,
  },
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAdInsights({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        }).then((res) => {
          res.items.forEach((item: any) => {
            item.ctr = format(item.ctr, { precision: 2 });
          });

          if (res.summary) {
            state.footerData = res.summary;

            // Reset some fields
            state.footerData.accountType = `${res.total} Item(s)`;
            state.footerData.date = null;
            state.footerData.ctr = format(state.footerData.ctr, {
              precision: 2,
            });
          } else {
            state.footerData = null;
          }

          return res;
        });
      },
    },
  },
};
