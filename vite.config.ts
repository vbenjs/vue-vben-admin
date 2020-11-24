import type { UserConfig } from 'vite';

import { resolve } from 'path';

import { modifyVars } from './build/config/lessModifyVars';
import { createProxy } from './build/vite/proxy';

import globbyTransform from './build/vite/plugin/transform/globby';
import dynamicImportTransform from './build/vite/plugin/transform/dynamic-import';

import { isDevFn, loadEnv } from './build/utils';

import { createRollupPlugin, createVitePlugins } from './build/vite/plugin';

const pkg = require('./package.json');

const viteEnv = loadEnv();

const {
  VITE_PORT,
  VITE_PUBLIC_PATH,
  VITE_PROXY,
  VITE_DROP_CONSOLE,
  // VITE_USE_CDN,
} = viteEnv;

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

const viteConfig: UserConfig = {
  /**
   * Entry. Use this to specify a js entry file in setting cases where an
   * `index.html` does not exist (e.g. serving vite assets from a different host)
   * @default 'index.html'
   */
  // TODO build error
  // entry: 'public/index.html',
  /**
   * port
   * @default '3000'
   */
  port: VITE_PORT,
  /**
   * @default 'localhost'
   */
  hostname: 'localhost',
  /**
   * Run to open the browser automatically
   * @default 'false'
   */
  open: false,
  /**
   * Set to `false` to disable minification, or specify the minifier to setting.
   * Available options are 'terser' or 'esbuild'.
   * @default 'terser'
   */
  minify: isDevFn() ? 'esbuild' : 'terser',
  /**
   * Base public path when served in production.
   * @default '/'
   */
  base: VITE_PUBLIC_PATH,

  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  outDir: 'dist',
  /**
   * Whether to generate sourcemap
   * @default false
   */
  sourcemap: false,
  /**
   * Directory relative from `outDir` where the built js/css/image assets will
   * be placed.
   * @default '_assets'
   */
  assetsDir: '_assets',
  /**
   * Static asset files smaller than this number (in bytes) will be inlined as
   * base64 strings. Default limit is `4096` (4kb). Set to `0` to disable.
   * @default 4096
   */
  assetsInlineLimit: 4096,
  /**
   * Transpile target for esbuild.
   * @default 'es2020'
   */
  esbuildTarget: 'es2020',
  /**
   * Whether to log asset info to console
   * @default false
   */
  silent: false,
  /**
   * Import alias. The entries can either be exact request -> request mappings
   * (exact, no wildcard syntax), or request path -> fs directory mappings.
   * When using directory mappings, the key **must start and end with a slash**.
   * ```
   */
  alias: {
    '/@/': pathResolve('src'),
  },
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

  // Local cross-domain proxy
  proxy: createProxy(VITE_PROXY),
  plugins: createVitePlugins(viteEnv),
  rollupInputOptions: {
    // TODO
    // external: VITE_USE_CDN ? externals : [],
    plugins: createRollupPlugin(),
  },
};

export default {
  ...viteConfig,
  transforms: [
    globbyTransform({
      resolvers: viteConfig.resolvers,
      root: viteConfig.root,
      alias: viteConfig.alias,
      includes: [resolve('src/router'), resolve('src/locales')],
    }),
    dynamicImportTransform(viteEnv),
  ],
} as UserConfig;
