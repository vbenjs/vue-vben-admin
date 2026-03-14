# Oxlint JS Plugins 迁移可行性分析

更新时间：2026-03-14

## 结论

对当前仓库，`Oxlint + jsPlugins` 已经足以承接大部分 JS/TS lint 规则，但**现阶段无法在不丢失 lint 能力的前提下完全替换 ESLint**。

更准确的判断是：

- 可行：继续把 JS/TS 主体规则迁移到 Oxlint，并逐步缩小 ESLint 的职责范围。
- 不可行：立即删除 ESLint，并要求 Oxlint 100% 覆盖当前所有 Vue/JSONC/YAML/pnpm lint 规则。

## 官方能力边界

根据 Oxc 官方文档，Oxlint 的 JS Plugins 目前具备这些特征：

- 支持 ESLint v9+ 插件 API，文档表述为“大多数现有 ESLint 插件应可直接工作”。
- `jsPlugins` 仍处于 `alpha`，不受 semver 稳定性约束。
- 当前尚未支持两类关键能力：
  - 自定义文件格式和解析器，例如 Vue、Svelte、Angular。
  - 依赖 TypeScript type-aware 的 JS 插件规则。

另外，官方内建 `vue` 插件当前只覆盖“适用于 script tags 的规则”，并不等价于完整的 `eslint-plugin-vue` 模板规则集。

官方文档：

- JS Plugins: https://oxc.rs/docs/guide/usage/linter/js-plugins.html
- Linter Config: https://oxc.rs/docs/guide/usage/linter/config.html
- Built-in Plugins: https://oxc.rs/docs/guide/usage/linter/plugins

关键点摘录来源：

- JS Plugins 兼容 ESLint v9+，且目前为 alpha：`js-plugins.html`
- 暂不支持 custom file formats/parsers 与 type-aware JS plugin rules：`js-plugins.html`
- 内建 `vue` 仅覆盖 script tags 可用规则：`plugins`

## 仓库当前状态

当前仓库已经不是“Oxlint 还没开始接管”的状态，而是**Oxlint 已经承担主体，ESLint 负责补位**。

### 1. 根配置

- ESLint 入口：[eslint.config.mjs](./eslint.config.mjs)
- Oxlint 入口：[oxlint.config.ts](./oxlint.config.ts)

两者都只是薄封装：

- [eslint.config.mjs](./eslint.config.mjs) 直接使用 `@vben/eslint-config`
- [oxlint.config.ts](./oxlint.config.ts) 直接使用 `@vben/oxlint-config`

### 2. 当前 lint 流程是双跑

见 [scripts/vsh/src/lint/index.ts](./scripts/vsh/src/lint/index.ts)：

- 检查时同时执行 `oxlint .` 和 `eslint . --cache`
- 修复时同时执行 `oxlint . --fix` 和 `eslint . --cache --fix`

这说明工具链层面已经默认接受“Oxlint 负责大部分，ESLint 保留兜底”的模式。

### 3. Oxlint 已覆盖的能力

见 [internal/lint-configs/oxlint-config/src/configs/plugins.ts](./internal/lint-configs/oxlint-config/src/configs/plugins.ts)：

- 已启用内建插件：`import`、`node`、`oxc`、`typescript`、`unicorn`、`vitest`、`vue`

见 [internal/lint-configs/oxlint-config/src/configs/tailwindcss.ts](./internal/lint-configs/oxlint-config/src/configs/tailwindcss.ts)：

- 已通过 `jsPlugins` 接入 `eslint-plugin-better-tailwindcss`

这说明仓库已经验证过一个重要前提：**Oxlint 的 `jsPlugins` 在本项目里不是理论能力，而是已经在生产配置中使用。**

## 为什么现在还不能彻底删掉 ESLint

### 1. Vue 模板规则仍依赖 ESLint 生态

见 [internal/lint-configs/eslint-config/src/configs/vue.ts](./internal/lint-configs/eslint-config/src/configs/vue.ts)：

- 使用 `vue-eslint-parser`
- 使用 `pluginVue.processors?.['.vue']`
- 配置了大量模板/组件约束规则，例如：
  - `vue/attribute-hyphenation`
  - `vue/html-self-closing`
  - `vue/v-on-event-hyphenation`
  - `vue/block-order`
  - `vue/require-default-prop`
  - `vue/one-component-per-file`

这部分明显超出“只 lint `<script>` block”的范围。按官方当前说明，**这部分不能无损迁到 Oxlint**。

### 2. JSONC lint 依赖 ESLint 的专用语言层

见 [internal/lint-configs/eslint-config/src/configs/jsonc.ts](./internal/lint-configs/eslint-config/src/configs/jsonc.ts)：

- 使用 `language: 'jsonc/x'`
- 使用 `eslint-plugin-jsonc`
- 包含大量结构化排序和格式约束：
  - `jsonc/sort-keys`
  - `jsonc/sort-array-values`

这部分不是普通 JS 插件规则，而是建立在 JSONC 语言支持之上。当前不能假设 Oxlint 已可完全承接。

### 3. YAML 规则与 pnpm-workspace 校验仍依赖自定义解析器

见：

- [internal/lint-configs/eslint-config/src/configs/yaml.ts](./internal/lint-configs/eslint-config/src/configs/yaml.ts)
- [internal/lint-configs/eslint-config/src/configs/pnpm.ts](./internal/lint-configs/eslint-config/src/configs/pnpm.ts)

当前依赖：

- `yaml-eslint-parser`
- `eslint-plugin-yml`
- `eslint-plugin-pnpm`

并且覆盖了 `pnpm-workspace.yaml` 的专门规则，例如：

- `yaml/sort-keys`
- `pnpm/yaml-no-duplicate-catalog-item`
- `pnpm/yaml-no-unused-catalog-item`

这类场景正好命中官方当前未完成的“custom file formats and parsers”边界。

### 4. 一部分 ESLint-only 插件还未迁入 Oxlint

当前 ESLint 配置中仍有这些额外插件：

- `@eslint-community/eslint-plugin-eslint-comments`
- `eslint-plugin-command`
- `eslint-plugin-perfectionist`
- `eslint-plugin-pnpm`
- `eslint-plugin-jsonc`
- `eslint-plugin-yml`
- `eslint-config-turbo`

其中有些理论上可以尝试通过 `jsPlugins` 迁过去，但目前仓库还没有完成这一步。

## 迁移可行性分类

### A. 已经适合放到 Oxlint 的部分

这些已经在 Oxlint 中直接落地，或者已存在等价内建支持：

- 常规 JS 规则
- 常规 TS 规则
- `import`
- `node`
- `unicorn`
- `vitest`
- 一部分 `vue` script 规则
- `better-tailwindcss` 这类标准 ESLint JS 插件

对应配置位于：

- [internal/lint-configs/oxlint-config/src/configs/javascript.ts](./internal/lint-configs/oxlint-config/src/configs/javascript.ts)
- [internal/lint-configs/oxlint-config/src/configs/typescript.ts](./internal/lint-configs/oxlint-config/src/configs/typescript.ts)
- [internal/lint-configs/oxlint-config/src/configs/import.ts](./internal/lint-configs/oxlint-config/src/configs/import.ts)
- [internal/lint-configs/oxlint-config/src/configs/node.ts](./internal/lint-configs/oxlint-config/src/configs/node.ts)
- [internal/lint-configs/oxlint-config/src/configs/unicorn.ts](./internal/lint-configs/oxlint-config/src/configs/unicorn.ts)
- [internal/lint-configs/oxlint-config/src/configs/test.ts](./internal/lint-configs/oxlint-config/src/configs/test.ts)
- [internal/lint-configs/oxlint-config/src/configs/vue.ts](./internal/lint-configs/oxlint-config/src/configs/vue.ts)
- [internal/lint-configs/oxlint-config/src/configs/tailwindcss.ts](./internal/lint-configs/oxlint-config/src/configs/tailwindcss.ts)

### B. 理论上可继续试迁到 `jsPlugins` 的部分

这些不明显依赖自定义文件格式，值得单独实验：

- `@eslint-community/eslint-plugin-eslint-comments`
- `eslint-plugin-command`
- `eslint-plugin-perfectionist`

但是否能稳定接入，仍需实测：

- 插件是否完全遵守 ESLint v9 API
- 是否依赖 Oxlint 尚未补齐的边缘 API
- 是否需要和内建插件名称冲突时通过 alias 处理

### C. 当前应继续保留在 ESLint 的部分

这些是现阶段最明确的保留项：

- `eslint-plugin-vue` 的模板级规则
- `eslint-plugin-jsonc`
- `eslint-plugin-yml`
- `eslint-plugin-pnpm`
- 任何依赖自定义 parser / processor / file format 的 lint 规则

## 对当前仓库的建议路线

### 方案一：现实可落地方案，推荐

目标：**保留 ESLint，但把它压缩成“补位层”**。

执行方式：

1. 继续由 Oxlint 承担 JS/TS 主体规则。
2. 逐个验证 `eslint-comments`、`command`、`perfectionist` 是否能迁入 `jsPlugins`。
3. ESLint 最终只保留：
   - Vue 模板规则
   - JSONC
   - YAML
   - pnpm workspace/catalog 规则

这样做的收益：

- 性能提升仍然明显
- 风险可控
- 不会因为“强行全量迁移”导致 lint 能力倒退

### 方案二：激进方案，不推荐

目标：**立即删掉 ESLint，只保留 Oxlint**。

代价：

- Vue 模板规则大概率丢失
- JSONC/YAML/pnpm 专项规则大概率丢失
- 现有工程规范会退化

除非团队明确接受上述损失，否则不建议执行。

## 建议的下一步

如果要继续推进，建议按这个顺序做：

1. 盘点 ESLint 中剩余“非 Oxlint”规则的精确来源。
2. 先试迁：
   - `eslint-comments`
   - `command`
   - `perfectionist`
3. 验证后把 `scripts/vsh/src/lint/index.ts` 中 ESLint 的职责缩到最小。
4. 最后再决定是否拆分成两个命令：
   - `oxlint` 负责主 lint
   - `eslint` 只负责 Vue/JSONC/YAML/pnpm 补位

## 最终判断

对这个仓库，当前最合理的目标不是“ESLint 全量迁移到 Oxlint”，而是：

**把能迁的都迁到 Oxlint，把不能迁的留给一个精简后的 ESLint。**

这是当前官方能力边界、仓库已有配置、以及风险收益比三者共同决定的结论。
