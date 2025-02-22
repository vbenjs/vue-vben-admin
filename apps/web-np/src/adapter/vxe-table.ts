import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image, Typography } from 'ant-design-vue';

import { useShopStore } from '#/store';
import { formatMoney, numberWithCommas } from '#/utils';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(Image, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    vxeUI.renderer.add('CellStatus', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    const cellMoney = (renderOpts: any, params: any) => {
      const shopStore = useShopStore();

      const { props } = renderOpts;
      const { column, row } = params;

      const number =
        props?.useBaseCurrency === true
          ? formatMoney(row[column.field], shopStore.shop.currency, 1)
          : formatMoney(
              row[column.field],
              shopStore.shop.currencyFromApp,
              shopStore.shop.currencyRate,
            );

      return h(Typography.Text, props, number);
    };
    vxeUI.renderer.add('cellMoney', {
      renderTableDefault: cellMoney,
      renderTableFooter: cellMoney,
    });

    const cellPercentage = (renderOpts: any, params: any) => {
      const { props } = renderOpts;
      const { column, row } = params;
      const number = `${row[column.field]}%`;

      return h(Typography.Text, props, numberWithCommas(number));
    };
    vxeUI.renderer.add('CellPercentage', {
      renderTableDefault: cellPercentage,
      renderTableFooter: cellPercentage,
    });
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
