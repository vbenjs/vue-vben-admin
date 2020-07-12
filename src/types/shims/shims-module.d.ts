/* 模块申明 */

// declare namespace NodeJS {
//   type TrueOrFalse = 'TRUE' | 'FALSE';
//   interface Process extends __WebpackModuleApi.NodeProcess {
//     /** 环境变量, 定义常用的几个 */
//     // @ts-ignore
//     env: {
//       /** 运行模式 */
//       NODE_ENV: 'development' | 'production' | 'test';
//       /** 静态资源路径 */
//       BASE_URL: string;

//       // 是否支持ie
//       VUE_APP_SUPPORT_IE: TrueOrFalse;

//       /** app标题 */
//       GLOB_APP_TITLE: string | [string, string][];

//       /** app简称 */
//       GLOB_APP_SHORT_NAME: string | [string, string][];

//       /** 接口地址 */
//       GLOB_API_URL: string | [string, string][];

//       /** 接口地址前缀 */
//       GLOB_API_URL_PREFIX: string | [string, string][];

//       /** 公共资源路径 */
//       VUE_APP_PUBLIC_PATH: string;

//       /** 代理 */
//       VUE_APP_PROXY: [string, string][];

//       /** 静态资源路径 */
//       VUE_APP_ASSETS_DIR: string;

//       /** 端口号 */
//       VUE_APP_PORT: string;

//       /** 打包是否开启gzip */
//       BUILD_ON_GZIP: TrueOrFalse;

//       /** 打包是否删除console */
//       BUILD_ON_CLEAN_CONSOLE: string;
//       [key: string]: any;
//     };
//   }
// }
declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.json' {
  /** 得到json表达的对象/数组【混入到代码中】
   */
  const content: object | any[];
  export default content;
}

declare module '*.svg' {
  /** 文件路径
   */
  const content: string;
  export = content;
}
declare module '*.scss' {
  /** scss 导出 (:export{})
   */
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.less' {
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.styl' {
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.css' {
  /** 一个空对象
   */
  const content: object;
  export default content;
}

declare module '*.module.scss' {
  /** css 模块
   */
  const content: {
    [localClassName: string]: string;
  };
  export default content;
}

/// web workers ///
declare function postMessage(message: any): void;
declare interface WebpackWorker {
  new (): Worker;
}
declare module 'worker-loader!*' {
  export default WebpackWorker;
}

declare interface Fn {
  (): any;
}

// 任意对象
declare interface IObj<T = any> {
  [key: string]: T;
  [key: number]: T;
}
declare namespace echarts {
  interface EChartOption {
    [key: string]: any;
  }
  interface EChartsResponsiveOption {
    [key: string]: any;
  }
  interface ECharts {
    setOption(
      option: () => EChartOption | EChartsResponsiveOption,
      notMerge?: boolean,
      lazyUpdate?: boolean
    ): void;
  }
}
