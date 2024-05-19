import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import type { PluginOption, UserConfig } from 'vite';
import type { PluginOptions } from 'vite-plugin-dts';

import viteTurboConsolePlugin from 'unplugin-turbo-console/vite';

export interface IImportMap {
  imports?: Record<string, string>;
  scopes?: {
    [scope: string]: Record<string, string>;
  };
}

/**
 * importmap 插件配置
 */
interface ImportmapPluginOptions {
  /**
   * CDN 供应商
   * @default jspm.io
   */
  defaultProvider?: 'esm.sh' | 'jspm.io';
  /** importmap 配置 */
  importmap?: Array<{ name: string; range?: string }>;
  /** 手动配置importmap */
  inputMap?: IImportMap;
}

/**
 * 用于判断是否需要加载插件
 */
interface ConditionPlugin {
  // 判断条件
  condition?: boolean;
  // 插件对象
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>;
}

interface CommonPluginOptions {
  /** 是否开启devtools */
  devtools?: boolean;
  /** 是否构建模式 */
  isBuild?: boolean;
  /** 构建模式 */
  mode?: string;
  /** 开启依赖分析 */
  visualizer?: PluginVisualizerOptions | boolean;
}

interface AppcationPluginOptions extends CommonPluginOptions {
  /** 开启 gzip 压缩 */
  compress?: boolean;
  /** 压缩类型 */
  compressTypes?: ('brotli' | 'gzip')[];
  /** 在构建的时候抽离配置文件 */
  extraAppConfig?: boolean;
  /** html 插件配置 */
  html?: boolean;
  /** 是否开启i18n */
  i18n?: boolean;
  /** 是否开启 importmap CDN  */
  importmap?: boolean;
  /** importmap 插件配置 */
  importmapOptions?: ImportmapPluginOptions;
  /** 是否注入app loading */
  injectAppLoading?: boolean;
  /** mock 插件配置 */
  mock?: boolean;
  /** turbo-console 插件配置 */
  turboConsole?: Parameters<typeof viteTurboConsolePlugin>[0] | boolean;
}

interface LibraryPluginOptions extends CommonPluginOptions {
  /** 开启 dts 输出 */
  dts?: PluginOptions | boolean;

  /** 是否注入lib css */
  injectLibCss?: boolean;
}

interface AppcationOptions extends AppcationPluginOptions {}

interface LibraryOptions extends LibraryPluginOptions {}

interface DefineAppcationOptions {
  appcation?: AppcationOptions;
  vite?: UserConfig;
}

interface DefineLibraryOptions {
  library?: LibraryOptions;
  vite?: UserConfig;
}

type DefineConfig = {
  type?: 'appcation' | 'auto' | 'library';
} & DefineAppcationOptions &
  DefineLibraryOptions;

export type {
  AppcationPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  DefineAppcationOptions,
  DefineConfig,
  DefineLibraryOptions,
  ImportmapPluginOptions,
  LibraryPluginOptions,
};
