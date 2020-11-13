import type { Plugin as VitePlugin } from 'vite';
import type { Plugin as rollupPlugin } from 'rollup';

import { createMockServer } from 'vite-plugin-mock';
import { VitePWA } from 'vite-plugin-pwa';
import ViteHtmlPlugin from 'vite-plugin-html';
import PurgeIcons from 'vite-plugin-purge-icons';

import visualizer from 'rollup-plugin-visualizer';
import gzipPlugin from './gzip/index';

import { hmScript } from '../hm';

// @ts-ignore
import pkg from '../../../package.json';
import { isDevFn, isProdFn, isSiteMode, ViteEnv, isReportMode, isBuildGzip } from '../../utils';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

// gen vite plugins
export function createVitePlugins(viteEnv: ViteEnv) {
  const { VITE_USE_MOCK, VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH, VITE_USE_PWA } = viteEnv;

  const vitePlugins: VitePlugin[] = [];

  // vite-plugin-html
  vitePlugins.push(
    ViteHtmlPlugin({
      // html title
      title: VITE_GLOB_APP_TITLE,
      minify: isProdFn(),
      options: {
        // Package and insert additional configuration files
        injectConfig: isProdFn()
          ? `<script src='${VITE_PUBLIC_PATH || './'}${GLOB_CONFIG_FILE_NAME}?v=${
              pkg.version
            }-${new Date().getTime()}'></script>`
          : '',
        // Insert Baidu statistics code
        hmScript: isSiteMode() ? hmScript : '',
        title: VITE_GLOB_APP_TITLE,
      },
    })
  );

  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());

  if (isProdFn() && VITE_USE_PWA) {
    vitePlugins.push(
      VitePWA({
        manifest: {
          name: 'Vben Admin',
          short_name: 'vben_admin',
          icons: [
            {
              src: './resource/img/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: './resource/img/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      })
    );
  }

  // vite-plugin-mock
  if (isDevFn() && VITE_USE_MOCK) {
    // open mock
    vitePlugins.push(
      createMockServer({
        ignore: /^\_/,
        mockPath: 'mock',
      })
    );
  }
  return vitePlugins;
}

// gen rollup plugins
export function createRollupPlugin() {
  const rollupPlugins: rollupPlugin[] = [];

  if (isProdFn()) {
    if (isReportMode()) {
      // rollup-plugin-visualizer
      rollupPlugins.push(
        visualizer({ filename: './build/.cache/stats.html', open: true }) as Plugin
      );
    }
    if (isBuildGzip() || isSiteMode()) {
      // rollup-plugin-gizp
      rollupPlugins.push(gzipPlugin());
    }
  }
  return rollupPlugins;
}
