/**
 * 支持的语言注册表（核心默认语言）。
 *
 * 接口值仅为文档用途的语言标签，类型系统只消费键。
 * 模板通过模块增强引用自身的语言清单，无需逐个声明语言：
 *
 * ```ts
 * import type { AppLocale } from './index';
 * import '@vben-core/typings';
 * declare module '@vben-core/typings' {
 *   interface SupportedLanguages extends Record<AppLocale, string> {}
 * }
 * ```
 *
 * 追加后 `SupportedLanguagesType` 联合类型会自动包含新语言，
 * 所有引用该类型的包（preferences、locales、constants 等）同步获得类型约束；
 * 运行时语言列表则通过 `setSupportLanguages` 注册。
 */
export interface SupportedLanguages {
  'en-US': 'English';
  'zh-CN': '简体中文';
}

/**
 * 支持的语言类型
 */
export type SupportedLanguagesType = keyof SupportedLanguages;
