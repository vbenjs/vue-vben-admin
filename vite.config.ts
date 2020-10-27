import type { UserConfig } from 'vite';

import { resolve } from 'path';

import { modifyVars } from './build/config/lessModifyVars';
import { createProxy } from './build/vite/proxy';
import globbyTransform from './build/vite/plugin/context/transform';

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
   * Entry. Use this to specify a js entry file in use cases where an
   * `index.html` does not exist (e.g. serving vite assets from a different host)
   * @default 'index.html'
   */
  // TODO build error
  // entry: './public/index.html',
  /**
   * 端口号
   * @default '3000'
   */
  port: VITE_PORT,
  /**
   * 服务地址
   * @default 'localhost'
   */
  hostname: 'localhost',
  /**
   * 运行自动打开浏览器·
   * @default 'false'
   */
  open: false,
  /**
   * 压缩代码
   *  boolean | 'terser' | 'esbuild'
   * @default 'terser'
   */
  minify: isDevFn() ? 'esbuild' : 'terser',
  /**
   * 基本公共路径
   * @default '/'
   */
  base: VITE_PUBLIC_PATH,

  /**
   * 打包输入路径
   * @default 'dist'
   */
  outDir: 'dist',
  /**
   * @default 'false'
   */
  sourcemap: false,
  /**
   * 资源输出路径
   * @default '_assets'
   */
  assetsDir: '_assets',
  /**
   * 静态资源小于该大小将会内联，默认4096kb
   * @default '4096'
   */
  assetsInlineLimit: 4096,
  /**
   * esbuild转换目标。
   * @default 'es2020'
   */
  esbuildTarget: 'es2020',
  silent: false,
  // 别名
  alias: {
    '/@/': pathResolve('src'),
  },
  // terser配置
  terserOptions: {
    compress: {
      // 是否删除console
      drop_console: VITE_DROP_CONSOLE,
    },
  },
  define: {
    __VERSION__: pkg.version,
  },
  // css预处理
  cssPreprocessOptions: {
    less: {
      modifyVars: modifyVars,
      javascriptEnabled: true,
    },
  },
  // 会使用 rollup 对 包重新编译，将编译成符合 esm 模块规范的新的包放入 node_modules/.vite_opt_cache
  optimizeDeps: {
    include: [
      'echarts',
      'echarts/map/js/china',
      'ant-design-vue/es/locale/zh_CN',
      '@ant-design/icons-vue',
      'moment/locale/zh-cn',
    ],
  },

  // 本地跨域代理
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
  transforms: [globbyTransform(viteConfig)],
} as UserConfig;
