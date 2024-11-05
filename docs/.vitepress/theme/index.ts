// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext, Theme } from 'vitepress';

import { h } from 'vue';

import { useVbenForm } from '@vben/common-ui';

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client';
import { Button, Image } from 'ant-design-vue';
import DefaultTheme from 'vitepress/theme';

import { DemoPreview } from '../components';
import SiteLayout from './components/site-layout.vue';
import VbenContributors from './components/vben-contributors.vue';
import { initHmPlugin } from './plugins/hm';

import './styles';

import 'virtual:group-icons.css';
import '@nolebase/vitepress-plugin-git-changelog/client/style.css';

export default {
  async enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    app.component('VbenContributors', VbenContributors);
    app.component('DemoPreview', DemoPreview);
    app.use(NolebaseGitChangelogPlugin);

    if (!import.meta.env.SSR) {
      const plugin = await import('@vben/plugins/vxe-table');

      plugin.setupVbenVxeTable({
        configVxeTable: (vxeUI) => {
          vxeUI.setConfig({
            grid: {
              align: 'center',
              border: false,
              columnConfig: {
                resizable: true,
              },
              minHeight: 180,
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
            renderDefault(_renderOpts, params) {
              const { column, row } = params;
              return h(Image, { src: row[column.field] } as any);
            },
          });

          // 表格配置项可以用 cellRender: { name: 'CellLink' },
          vxeUI.renderer.add('CellLink', {
            renderDefault(renderOpts) {
              const { props } = renderOpts;
              return h(
                Button,
                { size: 'small', type: 'link' },
                { default: () => props?.text },
              );
            },
          });

          // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
          // vxeUI.formats.add
        },
        useVbenForm,
      });

      app.component('VbenVxeGrid', plugin.VbenVxeGrid);
      app.provide('useVbenVxeGrid', plugin.useVbenVxeGrid);
    }

    // 百度统计
    initHmPlugin();
  },
  extends: DefaultTheme,
  Layout: SiteLayout,
} satisfies Theme;
