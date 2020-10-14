import { resolve } from 'path';

import type { UserConfig, Plugin as VitePlugin } from 'vite';

import visualizer from 'rollup-plugin-visualizer';
import { modifyVars } from './build/config/glob/lessModifyVars';
import {
  // externals,
  cdnConf,
} from './build/config/vite/cdn';

import { createProxy } from './build/config/vite/proxy';
import { createMockServer } from 'vite-plugin-mock';
import PurgeIcons from 'vite-plugin-purge-icons';

import { isDevFn, isReportMode, isProdFn, loadEnv } from './build/utils';
const pkg = require('./package.json');

const {
  VITE_USE_MOCK,
  VITE_PORT,
  VITE_PUBLIC_PATH,
  VITE_PROXY,
  VITE_GLOB_APP_TITLE,
  // VITE_USE_CDN,
} = loadEnv();

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

const rollupPlugins: any[] = [];
const vitePlugins: VitePlugin[] = [];

(() => {
  if (isReportMode() && isProdFn()) {
    // report
    rollupPlugins.push(
      visualizer({ filename: './node_modules/.cache/stats.html', open: true }) as Plugin
    );
  }
  if (isDevFn() && VITE_USE_MOCK) {
    // open mock
    vitePlugins.push(
      createMockServer({
        ignore: /^\_/,
        mockPath: 'mock',
      })
    );
  }
})();

const viteConfig: UserConfig = {
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
  minify: 'terser',
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
   * @default 'es2019'
   */
  esbuildTarget: 'es2019',
  silent: false,
  // 别名
  alias: {
    '/@/': pathResolve('src'),
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
  // 配置Dep优化行为
  // 会使用 rollup 对 包重新编译，将编译成符合 esm 模块规范的新的包放入 node_modules 下的 .
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

  plugins: [PurgeIcons(), ...vitePlugins],
  rollupOutputOptions: {},
  rollupInputOptions: {
    // TODO
    // external: VITE_USE_CDN ? externals : [],
    plugins: rollupPlugins,
  },
};

// 用于打包部署站点使用。实际项目可以删除
const isSite = process.env.SITE === 'true';
// 扩展配置, 往打包后的html注入内容
// 只针对生产环境
// TODO 目前只是简单手动注入实现，后续vite应该会提供配置项
export const htmlConfig: {
  title: string;
  addHm?: boolean;
  cdnConf?: {
    css?: string[];
    js?: string[];
  };
  useCdn: boolean;
  minify: {
    enable: boolean;
    removeComments: boolean;
    collapseWhitespace: boolean;
    minifyJS: boolean;
    minifyCSS: boolean;
  };
} = {
  // html title
  title: VITE_GLOB_APP_TITLE,
  // 百度统计，不需要可以删除
  addHm: isSite,
  // 使用cdn打包
  // TODO Cdn esm使用方式需要只能支持google，暂时关闭，后续查询更好的方式
  useCdn: false,
  // useCdn: VITE_USE_CDN,
  // cdn列表
  cdnConf,
  minify: {
    enable: true,
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true,
  },
};
export default viteConfig;
