# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一个实用性优先的 CSS 框架，用于快速构建自定义设计。当前项目使用的是 **Tailwind CSS v4**。

## 配置

项目当前不再通过 `tailwind.config.*` 文件维护 Tailwind 配置，主题与扫描范围都统一放在 CSS 与共享 Vite 配置中。

- 主题入口：`internal/tailwind-config/src/theme.css`
- Vite 集成：`internal/vite-config`

在 `global.css` 中你会看到当前项目使用的 Tailwind CSS v4 指令，例如：

- `@source`
- `@custom-variant`
- `@theme`
- `@theme inline`
- `@utility`

## 包使用 Tailwind CSS 的方式

当前项目不会根据某个包下是否存在 `tailwind.config.mjs` 来决定是否启用 Tailwind CSS。

应用和包统一复用 `@vben/vite-config`，并由该配置接入 `@tailwindcss/vite`。Tailwind 的扫描范围则统一在 `@vben/tailwind-config` 对应的 `internal/tailwind-config/src/theme.css` 中维护。

::: tip 包使用 Tailwind CSS 的说明

如果你是纯粹的 SDK 包，不需要使用 Tailwind CSS，则无需额外增加旧版 `tailwind.config.*` 文件。

:::

## Vue SFC 中的 `@apply`

项目对 Vue 单文件组件中的 `@apply` 做了统一处理，相关逻辑位于：

- `internal/vite-config/src/plugins/tailwind-reference.ts`

当组件样式中使用 `@apply` 时，会自动注入 `@reference "@vben/tailwind-config/theme"`，一般不需要手动补充。
