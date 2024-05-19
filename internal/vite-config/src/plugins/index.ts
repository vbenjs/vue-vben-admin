import type { PluginOption } from 'vite';

import { join } from 'node:path';

import viteVueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { getPackage } from '@vben/node-utils';
import viteVue from '@vitejs/plugin-vue';
import viteVueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer';
import viteTurboConsolePlugin from 'unplugin-turbo-console/vite';
import viteCompressPlugin from 'vite-plugin-compression';
import viteDtsPlugin from 'vite-plugin-dts';
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html';
import { libInjectCss as viteLibInjectCss } from 'vite-plugin-lib-inject-css';
import { viteMockServe as viteMockPlugin } from 'vite-plugin-mock';
import viteVueDevTools from 'vite-plugin-vue-devtools';

import { viteExtraAppConfigPlugin } from './extra-app-config';
import { viteImportMapPlugin } from './importmap';
import { viteInjectAppLoadingPlugin } from './inject-app-loading';

import type {
  AppcationPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  LibraryPluginOptions,
} from '../typing';

/**
 * 获取条件成立的 vite 插件
 * @param conditionPlugins
 */
async function getConditionEstablishedPlugins(
  conditionPlugins: ConditionPlugin[],
) {
  const plugins: PluginOption[] = [];
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins();
      plugins.push(...realPlugins);
    }
  }
  return plugins.flat();
}

/**
 * 根据条件获取通用的vite插件
 */
async function getCommonConditionPlugins(
  options: CommonPluginOptions,
): Promise<ConditionPlugin[]> {
  const { devtools, isBuild, visualizer } = options;
  return [
    {
      condition: true,
      plugins: () => [
        viteVue({
          script: {
            defineModel: true,
            // propsDestructure: true,
          },
        }),
        viteVueJsx(),
      ],
    },
    {
      condition: !isBuild && devtools,
      plugins: () => [viteVueDevTools()],
    },
    {
      condition: isBuild && !!visualizer,
      plugins: () => [<PluginOption>viteVisualizerPlugin({
          filename: './node_modules/.cache/visualizer/stats.html',
          gzipSize: true,
          open: true,
        })],
    },
  ];
}

/**
 * 根据条件获取应用类型的vite插件
 */
async function getApplicationConditionPlugins(
  options: AppcationPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild;

  const {
    compress,
    compressTypes,
    extraAppConfig,

    html,
    i18n,
    importmap,
    importmapOptions,
    injectAppLoading,
    mock,
    turboConsole,
    ...commonOptions
  } = options;

  const commonPlugins = await getCommonConditionPlugins(commonOptions);

  return await getConditionEstablishedPlugins([
    ...commonPlugins,
    {
      condition: i18n,
      plugins: async () => {
        const pkg = await getPackage('@vben/locales');
        const include = `${join(pkg?.dir ?? '', isBuild ? 'dist' : 'src', 'langs')}/*.yaml`;
        return [
          viteVueI18nPlugin({
            compositionOnly: true,
            fullInstall: true,
            include,
            runtimeOnly: true,
          }),
        ];
      },
    },
    {
      condition: injectAppLoading,
      plugins: async () => [await viteInjectAppLoadingPlugin()],
    },
    {
      condition: isBuild && !!compress,
      plugins: () => {
        const compressPlugins: PluginOption[] = [];
        if (compressTypes?.includes('brotli')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.br' }),
          );
        }
        if (compressTypes?.includes('gzip')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.gz' }),
          );
        }
        return compressPlugins;
      },
    },
    {
      condition: !!html,
      plugins: () => [viteHtmlPlugin({ minify: true })],
    },

    {
      condition: isBuild && importmap,
      plugins: () => {
        return [viteImportMapPlugin(importmapOptions)];
      },
    },
    {
      condition: isBuild && extraAppConfig,
      plugins: async () => [
        await viteExtraAppConfigPlugin({ isBuild: true, root: process.cwd() }),
      ],
    },
    {
      condition: !isBuild && !!turboConsole,
      plugins: () => [viteTurboConsolePlugin()],
    },
    {
      condition: !!mock,
      plugins: () => [
        viteMockPlugin({
          enable: true,
          ignore: /^_/,
          mockPath: 'mock',
        }),
      ],
    },
  ]);
}

/**
 * 根据条件获取库类型的vite插件
 */
async function getLibraryConditionPlugins(
  options: LibraryPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild;
  const { dts, injectLibCss, ...commonOptions } = options;
  const commonPlugins = await getCommonConditionPlugins(commonOptions);
  return await getConditionEstablishedPlugins([
    ...commonPlugins,
    {
      condition: isBuild && !!dts,
      plugins: () => [viteDtsPlugin({ logLevel: 'error' })],
    },
    {
      condition: injectLibCss,
      plugins: () => [viteLibInjectCss()],
    },
  ]);
}

export {
  getApplicationConditionPlugins,
  getLibraryConditionPlugins,
  viteCompressPlugin,
  viteDtsPlugin,
  viteHtmlPlugin,
  viteMockPlugin,
  viteTurboConsolePlugin,
  viteVisualizerPlugin,
};
