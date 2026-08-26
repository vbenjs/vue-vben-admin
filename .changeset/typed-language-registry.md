---
'@vben-core/composables': patch
'@vben-core/preferences': patch
'@vben-core/typings': patch
'@vben/constants': patch
'@vben/layouts': patch
'@vben/locales': patch
'@vben/plugins': patch
---

refactor(locales): 语言类型支持声明合并扩展，恢复编译期类型安全。`SupportedLanguagesType` 改为由 `SupportedLanguages` 接口的 `keyof` 派生，应用可通过 `declare module '@vben-core/typings'` 模块增强扩展语言，无需改动核心包；运行时语言列表仍由 `setSupportLanguages` 注册，未打包语言包的语言回退 en-US 的行为保持不变
