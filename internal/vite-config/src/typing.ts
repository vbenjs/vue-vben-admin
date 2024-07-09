import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import type { PluginOptions } from 'vite-plugin-dts';
import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';

import viteTurboConsolePlugin from 'unplugin-turbo-console/vite';

interface IImportMap {
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
  /** 环境变量 */
  env?: Record<string, any>;
  /** 是否注入metadata */
  injectMetadata?: boolean;
  /** 是否构建模式 */
  isBuild?: boolean;
  /** 构建模式 */
  mode?: string;
  /** 开启依赖分析 */
  visualizer?: PluginVisualizerOptions | boolean;
}

interface ApplicationPluginOptions extends CommonPluginOptions {
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
  /** 是否注入版权信息 */
  license?: boolean;
  /** 是否开启pwa */
  pwa?: boolean;
  /** pwa 插件配置 */
  pwaOptions?: Partial<PwaPluginOptions>;
  /** turbo-console 插件配置 */
  turboConsole?: Parameters<typeof viteTurboConsolePlugin>[0] | boolean;
}

interface LibraryPluginOptions extends CommonPluginOptions {
  /** 开启 dts 输出 */
  dts?: PluginOptions | boolean;

  /** 是否注入lib css */
  injectLibCss?: boolean;
}

interface ApplicationOptions extends ApplicationPluginOptions {}

interface LibraryOptions extends LibraryPluginOptions {}

interface DefineApplicationOptions {
  application?:
    | ((config: ConfigEnv) => Promise<ApplicationOptions>)
    | ApplicationOptions;
  vite?: ((config: ConfigEnv) => Promise<UserConfig>) | UserConfig;
}

interface DefineLibraryOptions {
  library?: ((config: ConfigEnv) => Promise<LibraryOptions>) | LibraryOptions;
  vite?: ((config: ConfigEnv) => Promise<UserConfig>) | UserConfig;
}

type DefineConfig = {
  type?: 'application' | 'auto' | 'library';
} & DefineApplicationOptions &
  DefineLibraryOptions;

export type {
  ApplicationPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  DefineApplicationOptions,
  DefineConfig,
  DefineLibraryOptions,
  IImportMap,
  ImportmapPluginOptions,
  LibraryPluginOptions,
};
