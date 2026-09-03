export type { SupportedLanguages } from '@vben-core/typings';

/**
 * 扩展支持的语言（演示）：
 * 通过模块增强向 SupportedLanguages 注册表追加 zh-TW，
 * SupportedLanguagesType 联合类型会自动包含 'zh-TW'，
 * 运行时语言列表需在 bootstrap 中通过 setSupportLanguages 注册。
 *
 * 注意：顶部的 re-export 不可省略——它使本文件成为模块，
 * declare module 才是模块增强而非覆盖原模块的环境声明；
 * 同时应用必须声明 `@vben-core/typings` 依赖以保证模块可解析。
 */
declare module '@vben-core/typings' {
  interface SupportedLanguages {
    'zh-TW': '繁體中文';
  }
}
