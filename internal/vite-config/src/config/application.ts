import type { UserConfig } from 'vite';

import type { DefineApplicationOptions } from '../typing';

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
      injectMetadata: true,
      isBuild,
      license: true,
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
