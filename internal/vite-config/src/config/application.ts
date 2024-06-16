import type { UserConfig } from 'vite';

import type { DefineApplicationOptions } from '../typing';

import { resolve } from 'node:path';

import { defineConfig, loadEnv, mergeConfig } from 'vite';

import { getApplicationConditionPlugins } from '../plugins';
import { getCommonConfig } from './common';

function defineApplicationConfig(options: DefineApplicationOptions = {}) {
  return defineConfig(async (config) => {
    const { command, mode } = config;
    const { application = {}, vite = {} } = options;
    const root = process.cwd();
    const isBuild = command === 'build';
    const env = loadEnv(mode, root);

    const plugins = await getApplicationConditionPlugins({
      compress: false,
      compressTypes: ['brotli', 'gzip'],
      devtools: true,
      env,
      extraAppConfig: true,
      html: true,
      i18n: true,
      injectAppLoading: true,
      isBuild,
      mock: true,
      mode,
      pwa: true,
      turboConsole: false,
      ...(typeof application === 'function'
        ? application(config)
        : application),
    });

    const applicationConfig: UserConfig = {
      build: {
        rollupOptions: {
          output: {
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            chunkFileNames: 'js/[name]-[hash].mjs',
            entryFileNames: 'jse/index-[name]-[hash].mjs',
          },
        },
        target: 'es2015',
      },
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger',
            ]
          : [],
        legalComments: 'none',
      },
      plugins,
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: `${resolve(root, '.', 'src')}/`,
          },
          /**
           * 确保大仓内的子包，如果通过源码方式引用，可以直接使用@别名
           */
          // {
          //   find: '@',
          //   replacement: '@',
          //   customResolver(source, importer) {
          //     if (source[0] === '@') {
          //       const realPath = source.replace(
          //         /^@/,
          //         resolve(findUpPackageDir(importer), 'src'),
          //       );
          //       return findFileByExtension(realPath);
          //     }
          //     return null;
          //   },
          // },
        ],
      },
      server: {
        host: true,
        warmup: {
          // 预热文件
          clientFiles: ['./index.html', './src/{views,layouts}/*'],
        },
      },
    };

    const mergedConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig,
    );
    return mergeConfig(
      mergedConfig,
      typeof vite === 'function' ? vite(config) : vite,
    );
  });
}

export { defineApplicationConfig };
