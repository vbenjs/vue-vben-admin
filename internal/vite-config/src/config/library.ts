import type { UserConfig } from 'vite';

import type { DefineLibraryOptions } from '../typing';

import { readPackageJSON } from '@vben/node-utils';

import { defineConfig, mergeConfig } from 'vite';

import { getLibraryConditionPlugins } from '../plugins';
import { getCommonConfig } from './common';

function defineLibraryConfig(options: DefineLibraryOptions = {}) {
  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const { library = {}, vite = {} } = options;
    const isBuild = command === 'build';

    const plugins = await getLibraryConditionPlugins({
      dts: false,
      injectLibCss: true,
      isBuild,
      mode,
      ...library,
    });

    const { dependencies = {}, peerDependencies = {} } =
      await readPackageJSON(root);

    const external = [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ];
    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: 'src/index.ts',
          fileName: 'index.mjs',
          formats: ['es'],
        },
        rollupOptions: {
          external,
        },
      },
      plugins,
    };
    const commonConfig = await getCommonConfig();
    const mergedConfig = mergeConfig(commonConfig, packageConfig);
    return mergeConfig(mergedConfig, vite);
  });
}

export { defineLibraryConfig };
