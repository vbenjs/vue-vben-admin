import type { UserConfig } from 'vite';

import type { DefineServerOptions } from '../typing';

import { defineConfig, loadEnv, mergeConfig } from 'vite';

import { loadServerPlugins } from '../plugins';
import { loadServerEnv } from '../utils/env';
import { getCommonConfig } from './common';

function defineServerConfig(userConfigPromise?: DefineServerOptions) {
  return defineConfig(async (config) => {
    const options = await userConfigPromise?.(config);
    const { port, ...envConfig } = await loadServerEnv();
    const { command, mode } = config;
    const { server = {}, vite = {} } = options || {};
    const root = process.cwd();
    const isBuild = command === 'build';
    const env = loadEnv(mode, root);

    const plugins = await loadServerPlugins({
      env,
      injectMetadata: true,
      isBuild,
      mode,
      noElement: true,
      ...envConfig,
      ...server,
    });

    const serverConfig: UserConfig = {
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger',
            ]
          : [],
        legalComments: 'none',
      },
      optimizeDeps: {
        exclude: [
          '@nestjs/microservices',
          '@nestjs/websockets',
          'cache-manager',
          'class-transformer',
          'class-validator',
          'fastify-swagger',
        ],
      },
      plugins,
      server: { host: true, port },
    };

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      serverConfig,
    );
    return mergeConfig(mergedCommonConfig, vite);
  });
}

export { defineServerConfig };
