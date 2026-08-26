/**
 * 支持的语言注册表（核心默认语言）。
 *
 * 接口值仅为文档用途的语言标签，类型系统只消费键。
 * 应用如需扩展语言，无需改动核心包，只需在应用内新建 d.ts 文件，
 * 通过模块增强（declaration merging）追加语言键：
 *
 * ```ts
 * declare module '@vben-core/typings' {
 *   interface SupportedLanguages {
 *     'zh-TW': '繁體中文';
 *   }
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
