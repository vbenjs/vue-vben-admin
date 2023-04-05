import { type UserConfig, defineConfig, mergeConfig } from 'vite';
import { readPackageJSON } from 'pkg-types';
import { commonConfig } from './common';
import dts from 'vite-plugin-dts';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

function definePackageConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;
  const root = process.cwd();
  return defineConfig(async () => {
    const { dependencies = {}, peerDependencies = {} } = await readPackageJSON(root);
    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es'],
          fileName: () => 'index.mjs',
        },
        rollupOptions: {
          external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
        },
      },
      plugins: [
        dts({
          logLevel: 'error',
        }),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig, packageConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfig };
