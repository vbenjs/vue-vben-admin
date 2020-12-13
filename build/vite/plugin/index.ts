import type { Plugin as VitePlugin } from 'vite';
import type { Plugin as rollupPlugin } from 'rollup';

import PurgeIcons from 'vite-plugin-purge-icons';

import visualizer from 'rollup-plugin-visualizer';
import gzipPlugin from './gzip/index';

// @ts-ignore
import pkg from '../../../package.json';
import { isProdFn, isSiteMode, ViteEnv, isReportMode, isBuildGzip } from '../../utils';
import { setupHtmlPlugin } from './html';
import { setupPwaPlugin } from './pwa';
import { setupMockPlugin } from './mock';

// gen vite plugins
export function createVitePlugins(viteEnv: ViteEnv) {
  const vitePlugins: VitePlugin[] = [];

  // vite-plugin-html
  setupHtmlPlugin(vitePlugins, viteEnv);
  // vite-plugin-pwa
  setupPwaPlugin(vitePlugins, viteEnv);
  // vite-plugin-mock
  setupMockPlugin(vitePlugins, viteEnv);

  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());

  return vitePlugins;
}

// gen rollup plugins
export function createRollupPlugin() {
  const rollupPlugins: rollupPlugin[] = [];

  if (!isProdFn() && isReportMode()) {
    // rollup-plugin-visualizer
    rollupPlugins.push(visualizer({ filename: './build/.cache/stats.html', open: true }) as Plugin);
  }

  if (!isProdFn() && (isBuildGzip() || isSiteMode())) {
    // rollup-plugin-gizp
    rollupPlugins.push(gzipPlugin());
  }

  return rollupPlugins;
}
