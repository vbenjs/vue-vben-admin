import type { UserConfig, Resolver } from 'vite';
import { resolve } from 'path';

import { modifyVars } from './build/config/lessModifyVars';
import { createProxy } from './build/vite/proxy';

import globbyTransform from './build/vite/plugin/transform/globby';
import dynamicImportTransform from './build/vite/plugin/transform/dynamic-import';

import { loadEnv } from './build/utils';

import { createRollupPlugin, createVitePlugins } from './build/vite/plugin';

const pkg = require('./package.json');

const viteEnv = loadEnv();

const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_DYNAMIC_IMPORT } = viteEnv;

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

const alias: Record<string, string> = {
  '/@/': pathResolve('src'),
};

const root: string = process.cwd();

const resolvers: Resolver[] = [];

const viteConfig: UserConfig = {
  root,
  alias,
  /**
   * port
   * @default '3000'
   */
  port: VITE_PORT,

  /**
   * Base public path when served in production.
   * @default '/'
   */
  base: VITE_PUBLIC_PATH,

  /**
   * Transpile target for esbuild.
   * @default 'es2020'
   */
  esbuildTarget: 'es2019',

  // terser options
  terserOptions: {
    compress: {
      drop_console: VITE_DROP_CONSOLE,
    },
  },
  define: {
    __VERSION__: pkg.version,
    // setting vue-i18-next
    // Suppress warning
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_FULL_INSTALL__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  cssPreprocessOptions: {
    less: {
      modifyVars: modifyVars,
      javascriptEnabled: true,
    },
  },
  // The package will be recompiled using rollup, and the new package compiled into the esm module specification will be put into node_modules/.vite_opt_cache
  optimizeDeps: {
    include: [
      'echarts/map/js/china',
      'ant-design-vue/es/locale/zh_CN',
      'ant-design-vue/es/locale/en_US',
      '@ant-design/icons-vue',
    ],
  },

  proxy: createProxy(VITE_PROXY),
  plugins: createVitePlugins(viteEnv),
  rollupInputOptions: {
    plugins: createRollupPlugin(),
  },
  transforms: [
    globbyTransform({
      resolvers: resolvers,
      root: root,
      alias: alias,
      includes: [resolve('src/router'), resolve('src/locales')],
    }),
    dynamicImportTransform(VITE_DYNAMIC_IMPORT),
  ],
};

export default viteConfig;
