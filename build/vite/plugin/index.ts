import type { Plugin } from 'vite';

import PurgeIcons from 'vite-plugin-purge-icons';

import visualizer from 'rollup-plugin-visualizer';

// @ts-ignore
import pkg from '../../../package.json';
import { ViteEnv, isReportMode } from '../../utils';
import { configHtmlPlugin } from './html';
import { configPwaConfig } from './pwa';
import { configMockPlugin } from './mock';
import { configGzipPlugin } from './gzip';
import { configStyleImportConfig } from './style-import';

// gen vite plugins
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, mode: string) {
  const vitePlugins: (Plugin | Plugin[])[] = [];

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-pwa
  vitePlugins.push(configPwaConfig(viteEnv, isBuild));

  // vite-plugin-mock
  vitePlugins.push(configMockPlugin(viteEnv, isBuild));

  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportConfig());

  // rollup-plugin-gzip
  vitePlugins.push(configGzipPlugin(isBuild));

  // rollup-plugin-visualizer
  if (isReportMode()) {
    vitePlugins.push(
      visualizer({
        filename: './build/.cache/stats.html',
        open: true,
      }) as Plugin
    );
  }

  return vitePlugins;
}
