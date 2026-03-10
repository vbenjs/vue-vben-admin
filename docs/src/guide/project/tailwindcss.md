# Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一个实用性优先的CSS框架，用于快速构建自定义设计。

## 配置

项目的配置文件位于 `packages/@core/base/design/src/global.css` 下，你可以在这里修改 Tailwind CSS 的配置。

::: tip 包使用 tailwindcss 的限制

当前只有对应的包下面存在 `@vben/styles` 赖，并且在 main.ts 中引入 `import '@vben/styles';` 才会启用 tailwindcss ，否则不会启用 tailwindcss。如果你是纯粹的 SDK 包，不需要使用 tailwindcss，可以不用引入 `@vben/styles` 依赖。

:::

## 提示

现`tailwindcss`已至v4.x版本，使用方法与`tailwindcss: ^3.4.17`有差异，v4.0无法与v3.x版本兼容，在开发前请确认`package.json`中的`tailwindcss`版本。
