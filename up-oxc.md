# OXC 迁移计划

> 本文档记录将项目中可替代的工具链逐步迁移到 [oxc](https://oxc.rs/) 生态的计划。

## 当前现状

项目 ESLint 体系依赖约 20+ 个包，包括：

- `eslint` ^10.0.3
- `@typescript-eslint/parser` ^8.57.0
- `@typescript-eslint/eslint-plugin` ^8.57.0
- `eslint-plugin-unicorn` ^63.0.0
- `eslint-plugin-import-x` ^4.16.2
- `eslint-plugin-unused-imports` ^4.4.1
- `eslint-plugin-regexp` ^3.1.0
- `eslint-plugin-jsdoc` ^62.8.0
- `eslint-plugin-n` ^17.24.0
- `eslint-plugin-no-only-tests` ^3.3.0
- `eslint-plugin-perfectionist` ^5.6.0
- `eslint-plugin-prettier` ^5.5.5
- `eslint-plugin-vue` ^10.8.0
- `eslint-plugin-better-tailwindcss` ^4.3.2
- `eslint-plugin-jsonc` ^3.1.2
- `eslint-plugin-yml` ^3.3.1
- `eslint-plugin-command` ^3.5.2
- `eslint-plugin-pnpm` ^1.6.0
- `@eslint-community/eslint-plugin-eslint-comments` ^4.7.1
- `@vitest/eslint-plugin` ^1.6.11
- `vue-eslint-parser` ^10.4.0
- `yaml-eslint-parser` ^2.0.0
- `globals` ^17.4.0
- `prettier` ^3.8.1
- `esbuild` ^0.27.4
- `html-minifier-terser` ^7.2.0

---

## 第一阶段：引入 oxlint，与 ESLint 共存

**目标**：将通用 JS/TS lint 规则交给 oxlint，ESLint 仅保留 oxlint 无法覆盖的特殊规则，大幅减少依赖数量并提升 lint 速度。

### 1.1 安装 oxlint

```bash
pnpm add -Dw oxlint
```

### 1.2 可移除的 ESLint 插件

以下插件与规则在 oxlint 中已有对应能力，但“有能力承接”不等于“现在就能删依赖”。这里区分为“已移除 / 已迁出 ESLint”和“仍需保留”两类：

| 插件 | 当前状态 | 说明 |
| --- | --- | --- |
| `eslint-plugin-regexp` | 已移除 | 由 oxlint 内建能力承接 |
| `eslint-plugin-jsdoc` | 已移除 | 由 oxlint 内建能力承接 |
| `eslint-plugin-no-only-tests` | 已移除 | 测试规则已迁到 oxlint / vitest |
| `eslint-plugin-better-tailwindcss` | 已迁出 ESLint | 仍然保留依赖，但已通过 oxlint `jsPlugins` 运行 |
| `@typescript-eslint/eslint-plugin` | 仍需保留 | 还有一批 TS 规则未迁移 |
| `@typescript-eslint/parser` | 仍需保留 | ESLint 侧 TS / Vue 规则仍依赖它 |
| `eslint-plugin-unicorn` | 仍需保留 | ESLint 侧仍使用其 recommended 规则补充 |
| `eslint-plugin-import-x` | 仍需保留 | `import/newline-after-import`、`import/no-webpack-loader-syntax` 尚未迁移 |
| `eslint-plugin-unused-imports` | 仍需保留 | `no-unused-imports` 仍由 ESLint 负责 |
| `eslint-plugin-n` | 仍需保留 | 多条 Node 规则在 oxlint 中暂无等价承接 |
| `eslint-plugin-perfectionist` | 仍需保留 | 排序规则策略不同，不建议强迁 |
| `@eslint-community/eslint-plugin-eslint-comments` | 仍需保留 | 当前尚未迁移 |

### 1.3 必须保留的 ESLint 插件

以下插件 oxlint 目前不支持或不完全支持，需继续由 ESLint 处理：

| 插件 | 原因 |
| --- | --- |
| `eslint-plugin-vue` + `vue-eslint-parser` | Vue SFC 模板 lint，oxlint Vue 支持尚未完善 |
| `eslint-plugin-jsonc` + `eslint-plugin-yml` | JSON/YAML 文件 lint，oxlint 不支持 |
| `eslint-plugin-pnpm` | pnpm workspace 规则，oxlint 无对应 |
| `eslint-plugin-command` | 魔法注释命令，oxlint 无对应 |
| `@vitest/eslint-plugin` | Vitest 特定规则（oxlint vitest 分类可能部分覆盖，需验证） |
| `yaml-eslint-parser` | YAML 解析，配合 eslint-plugin-yml 使用 |
| `eslint-plugin-prettier` | Prettier 集成（第二阶段替换 Prettier 后可移除） |

### 1.4 配置 oxlint

当前实现已调整为与 ESLint 一致的 workspace 包组织方式：

- 根目录使用 [oxlint.config.ts](./oxlint.config.ts) 作为薄入口
- 实际规则配置位于 `internal/lint-configs/oxlint-config`
- ESLint 兼容层通过 `eslint-plugin-oxlint` 直接消费 `@vben/oxlint-config` 导出的配置对象，确保 oxlint 与 ESLint 共用同一份规则源

示例结构：

```ts
// oxlint.config.ts
import { defineConfig } from '@vben/oxlint-config';

export default defineConfig();
```

```ts
// internal/lint-configs/oxlint-config/src/index.ts
import { defineConfig as defineOxlintConfig } from 'oxlint';
import { mergeOxlintConfigs, oxlintConfig } from './configs';

export function defineConfig(config = {}) {
  const { extends: extendedConfigs = [], ...restConfig } = config;
  return defineOxlintConfig(
    mergeOxlintConfigs(oxlintConfig, ...extendedConfigs, restConfig),
  );
}
```

不再使用根目录 `.oxlintrc.json`。

### 1.5 当前已完成项

截至目前，第一阶段已完成以下工作：

1. 根 `lint` 已调整为先跑 `oxlint` 再跑 `vsh lint`
2. `lefthook` 已接入 `oxlint --fix`
3. 已新增 `@vben/oxlint-config`，并将 oxlint 规则集中到 `internal/lint-configs/oxlint-config`
4. `eslint-plugin-oxlint` 已接入 `@vben/eslint-config`
5. 已移除 `eslint-plugin-jsdoc`、`eslint-plugin-regexp`、`eslint-plugin-no-only-tests`
6. `better-tailwindcss` 已迁移到 `@vben/oxlint-config` 的 `jsPlugins` 方案
7. `unicorn` 插件已在 oxlint 侧显式启用，并补齐仓库内所需的 override
8. 当前 `pnpm run lint:oxc`、`pnpm run lint:eslint`、`pnpm run lint` 均可通过

### 1.6 当前 oxlint 基线策略

当前 `@vben/oxlint-config` 采用“先收敛噪音，再逐步接管规则”的策略：

- 先启用 `correctness` 和 `suspicious`
- 保留 `import`、`node`、`typescript`、`unicorn`、`vitest`、`vue` 插件
- 通过 `jsPlugins` 在 oxlint 侧承接 `better-tailwindcss`
- 对当前仓库内高噪音且不准备立即批量整改的规则先显式关闭
- 通过 `overrides` 为 `.d.ts` 等特殊文件保留例外配置

### 1.7 已确认可迁移到 oxlint 的规则

以下规则已确认可由当前版本 `oxlint` 接管，后续应从 `@vben/eslint-config` 逐步迁移到 `@vben/oxlint-config`：

#### JavaScript / core

- `eqeqeq`
- `no-alert`
- `no-array-constructor`
- `no-caller`
- `no-case-declarations`
- `no-control-regex`
- `no-debugger`
- `no-empty-function`
- `no-eval`
- `no-iterator`
- `no-new-wrappers`
- `no-shadow`
- `no-shadow-restricted-names`
- `no-unused-expressions`
- `no-unused-vars`
- `prefer-const`

#### import

- `import/consistent-type-specifier-style`
- `import/first`
- `import/no-duplicates`
- `import/no-mutable-exports`
- `import/no-named-default`
- `import/no-self-import`

#### TypeScript

- `@typescript-eslint/no-non-null-assertion`
- `@typescript-eslint/no-empty-function`
- `@typescript-eslint/no-shadow`
- `@typescript-eslint/no-unused-expressions`
- `@typescript-eslint/no-unused-vars`
- `@typescript-eslint/no-var-requires`

> `@typescript-eslint/ban-ts-comment` 虽然 oxlint 已支持，但当前仓库中存在多处 `@ts-ignore`，直接迁移会新增报错，暂不建议在这一阶段接管。

#### Vitest

- `vitest/no-focused-tests`
- `vitest/no-identical-title`
- `vitest/prefer-hooks-in-order`
- `vitest/prefer-lowercase-title`

#### Node

- `n/no-exports-assign`
- `n/no-new-require`
- `n/no-path-concat`

#### Unicorn

- `unicorn/consistent-function-scoping`
- `unicorn/no-process-exit`
- `unicorn/prefer-global-this`
- `unicorn/prefer-module`

#### Tailwind CSS

- `better-tailwindcss/enforce-consistent-class-order`
- `better-tailwindcss/enforce-consistent-line-wrapping`
- `better-tailwindcss/no-unknown-classes`

#### Vue

- `vue/prefer-import-from-vue`

### 1.8 暂时仍需保留在 ESLint 的部分

以下内容当前不建议从 ESLint 侧移除：

1. Vue SFC/template 主体规则
2. `perfectionist`
3. `jsonc` / `yml`
4. `pnpm`
5. `command`
6. `prettier`
7. `eslint-comments`
8. `unused-imports`

其中 Vue 相关规则尤其需要保留，至少包括：

- `vue/block-order`
- `vue/component-name-in-template-casing`
- `vue/component-options-name-casing`
- `vue/custom-event-name-casing`
- `vue/define-macros-order`
- `vue/no-unused-refs`
- `vue/no-useless-v-bind`
- `vue/require-default-prop`
- `vue/require-explicit-emits`
- `vue/v-on-event-hyphenation`
- `vue/prefer-separate-static-class`
- `vue/prefer-template`

### 1.9 推荐的下一步执行顺序

为降低回归风险，后续规则迁移建议按以下顺序推进：

1. `import.ts`
2. `javascript.ts` 中剩余的低风险 1:1 规则
3. `typescript.ts`
4. `node.ts`
5. `test.ts`
6. 最后再评估 `import.ts` 中剩余规则是否值得继续下沉
7. 最后处理 `vue.ts` 中的个别确认项

每迁移一组后都执行：

```bash
pnpm run lint:oxc
pnpm run lint:eslint
pnpm run lint
```

### 1.10 更新 scripts

```jsonc
// package.json
{
  "scripts": {
    "lint": "pnpm run lint:oxc && pnpm run lint:eslint",
    "lint:oxc": "oxlint .",
    "lint:eslint": "vsh lint",
  },
}
```

### 1.11 更新 lefthook

在 pre-commit 中将 oxlint 加入暂存文件检查：

```yaml
pre-commit:
  commands:
    lint-vue:
      glob: '*.vue'
      run: pnpm prettier --write {staged_files} && pnpm oxlint --fix {staged_files} && pnpm eslint --cache --fix {staged_files} && pnpm stylelint --fix --allow-empty-input {staged_files}
    lint-js:
      glob: '*.{js,jsx,ts,tsx}'
      run: pnpm prettier --cache --ignore-unknown --write {staged_files} && pnpm oxlint --fix {staged_files} && pnpm eslint --cache --fix {staged_files}
```

### 1.12 验证步骤

1. 安装 oxlint 后全量运行 `pnpm lint:oxc`，记录所有报告
2. 对比当前 ESLint 规则覆盖情况，调整 oxlint 配置使两者对齐
3. 逐个移除可替代的 ESLint 插件，每次移除后运行完整 lint 验证无遗漏
4. CI 中同时运行 oxlint 和 ESLint，确保双重覆盖期间无回归

### 1.13 待修复问题与改进项

> 以下问题通过代码审查发现，按优先级排列。

#### [高] `unicorn` 插件启用后要同时收敛默认规则与 override

这个问题已经修复，但需要记录经验：

- `plugins` 一旦显式声明，必须手动包含 `unicorn`
- 启用后不只会打开我们手写的 `unicorn/no-process-exit`、`unicorn/prefer-module`
- 还会带出 oxlint 默认启用的一部分 `unicorn` 规则，需要按仓库现状显式关闭噪音项
- OXC `overrides.files` 不要继续使用 `?([cm])[jt]s?(x)` 这类 ESLint 风格的 extglob，当前仓库已改为显式文件后缀列表

#### [高] 使用 `@oxlint/migrate` 仅做审计，不直接落地配置

官方提供了 [`@oxlint/migrate`](https://github.com/oxc-project/oxlint-migrate) 工具，可自动读取 ESLint flat config 生成对应 oxlint 配置：

也可以参考 [`oxlint-migration-inspector`](https://github.com/joris-gallot/oxlint-migration-inspector) `npx oxlint-migration-inspector` 命令，查看哪些规则无法迁移。

```bash
# 查看哪些规则无法迁移
npx @oxlint/migrate --details

# 与已有配置合并（而非覆盖）
npx @oxlint/migrate --merge
```

对于当前仓库，`@oxlint/migrate` 更适合做“审计工具”，不适合直接生成或合并为最终配置，原因是：

1. 当前仓库已经不是简单的 `.oxlintrc.json` 形态，而是 workspace 包 + 模块化 `configs/*`
2. `@vben/oxlint-config` 依赖自定义 `mergeOxlintConfigs(...)` 来保证 `settings`、`ignorePatterns`、`jsPlugins` 正确合并
3. Tailwind 规则依赖手写 `jsPlugins` 和 `settings`
4. 现有迁移流程还包含 ESLint 兼容层 `eslint-plugin-oxlint`

因此更合理的用法是：

```bash
# 只做对账，不直接采纳输出
npx @oxlint/migrate --details
```

不建议直接使用 `--merge` 覆盖当前仓库的真实配置结构。

#### [中] `mergeOxlintConfigs` 函数重复定义

`mergeOxlintConfigs` 在两处有几乎相同的实现：

- `oxlint-config/src/configs/index.ts` — 包含 `jsPlugins` 合并逻辑
- `eslint-config/src/configs/oxlint.ts` — 缺少 `jsPlugins` 合并逻辑

这个问题已经修复。ESLint 侧的 `oxlint.ts` 已直接导入 `@vben/oxlint-config` 的 `mergeOxlintConfigs`，避免实现不一致：

```ts
// eslint-config/src/configs/oxlint.ts
import { mergeOxlintConfigs, oxlintConfig } from '@vben/oxlint-config';
import oxlint from 'eslint-plugin-oxlint';

export async function oxcCompat(): Promise<Linter.Config[]> {
  return oxlint.buildFromOxlintConfig(mergeOxlintConfigs(oxlintConfig));
}
```

#### [中] 验证 `oxcCompat()` 是否正确关闭 ESLint 重复规则

ESLint 侧 `javascript.ts` 约有 **70+ 条规则**，很多已被 oxlint 的 `correctness`/`suspicious` category 覆盖（如 `no-debugger`、`no-dupe-keys`、`no-unreachable` 等），但 ESLint 侧并未手动关闭。

`eslint-plugin-oxlint` 的 `buildFromOxlintConfig()` 理论上会自动关闭 ESLint 中被 oxlint 覆盖的规则。需要验证 `oxcCompat()` 确实生效——如果正常工作，则 ESLint 侧无需手动清理这些规则。

**验证方法**：

```bash
# 临时在 oxlint 中 warn 一个 ESLint 也有的规则（如 no-debugger），
# 确认 ESLint 不再报告该规则
```

#### [中] `eslint-plugin-import-x` 迁移不完全

ESLint 侧 `import.ts` 仍保留 3 条规则：

| 规则                              | 状态                              |
| --------------------------------- | --------------------------------- |
| `import/newline-after-import`     | 未迁移到 oxlint，需检查是否已支持 |
| `import/no-unresolved`            | 已 off，无需处理                  |
| `import/no-webpack-loader-syntax` | 未迁移到 oxlint，需检查是否已支持 |

如果这两条规则被 oxlint 支持，则 `eslint-plugin-import-x` 可从 ESLint 依赖中完全移除。

#### [中] `eslint-plugin-n` 实际不能完全移除

1.2 表格中标记 `eslint-plugin-n` 为"可移除"，但 ESLint 侧 `node.ts` 仍有以下规则未被 oxlint 接管：

可参考 https://github.com/oxc-project/oxc/issues/481 查看 Tasks 列表，oxlint 正在逐步接管 ESLint 的规则。

| 规则 | 备注 |
| --- | --- |
| `n/handle-callback-err` | oxlint 未支持 |
| `n/no-deprecated-api` | oxlint 未支持 |
| `n/no-extraneous-import` | 有自定义 `allowModules`，oxlint 未支持 |
| `n/no-unsupported-features/es-syntax` | oxlint 未支持 |
| `n/prefer-global/buffer` | oxlint 未支持 |
| `n/prefer-global/process` | oxlint 未支持 |
| `n/process-exit-as-throw` | oxlint 未支持 |

**结论**：`eslint-plugin-n` 当前仍需保留在 ESLint 侧，1.2 表格需修正。

#### [低] 考虑启用 `--type-aware` 规则

ESLint 侧 `typescript.ts` 已配置 `project: './tsconfig.*.json'`，即已使用 type-aware linting。oxlint 也支持 `--type-aware` 选项，启用后可迁移更多依赖类型信息的规则（如 `@typescript-eslint/no-floating-promises` 等），进一步减少对 ESLint TypeScript 插件的依赖。

```bash
# 测试 type-aware 模式
oxlint --type-aware --tsconfig tsconfig.json
```

#### [低] `--replace-eslint-comments` 批量转换注释

代码中存在的 `// eslint-disable` 注释虽然 oxlint 兼容，但在第四阶段移除 ESLint 后会变得语义不清。官方迁移工具提供了批量转换选项：

```bash
npx @oxlint/migrate --replace-eslint-comments
```

建议在第一阶段完成后或第四阶段开始前执行。

#### [低] `jsPlugins` 特性可减少 ESLint 依赖

oxlint 支持通过 `jsPlugins` 字段加载外部 ESLint 插件。对于 `eslint-plugin-pnpm`、`eslint-plugin-command` 等 oxlint 不内置的插件，未来可评估通过 `jsPlugins` 在 oxlint 中直接加载，从而减少对 ESLint 的依赖：

```json
{
  "jsPlugins": ["eslint-plugin-pnpm"],
  "rules": {
    "pnpm/some-rule": "warn"
  }
}
```

---

## 第二阶段：oxfmt 替换 Prettier

**前提**：oxfmt 已发布，支持 JS/TS/Vue SFC 格式化，CSS/HTML/YAML/Markdown 等通过内部委托 Prettier 处理。

> 参考文档：[oxfmt CLI](https://oxc.rs/docs/guide/usage/formatter/cli.html) | [Config Reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html)

### 2.1 当前 Prettier 引用全景

迁移前需清楚 Prettier 在仓库中的所有触点：

| 位置 | 用途 | 迁移动作 |
| --- | --- | --- |
| `internal/lint-configs/prettier-config/` | `@vben/prettier-config` 包，导出共享配置 | **改写为 `@vben/oxfmt-config`** |
| `.prettierrc.mjs` | 根配置入口，`export { default } from '@vben/prettier-config'` | **替换为 `.oxfmtrc.json`** |
| `.prettierignore` | 格式化忽略文件 | **迁移到 `.oxfmtrc.json` 的 `ignorePatterns`** |
| `eslint-config/src/configs/prettier.ts` | ESLint 中 `eslint-plugin-prettier` 集成 | **移除整个配置文件** |
| `eslint-config/src/index.ts` | 引用 `prettier()` 配置 | **移除 `prettier()` 调用** |
| `eslint-config/package.json` | 依赖 `eslint-plugin-prettier` | **移除该依赖** |
| `stylelint-config/index.mjs` | 插件 `stylelint-prettier`，规则 `prettier/prettier: true` | **移除 `stylelint-prettier` 插件和规则** |
| `stylelint-config/package.json` | 依赖 `prettier`、`stylelint-prettier` | **移除这两个依赖** |
| `internal/node-utils/src/prettier.ts` | `prettierFormat()` 函数，供构建工具调用 | **改写为调用 oxfmt** |
| `internal/node-utils/package.json` | 依赖 `prettier` | **替换为 `oxfmt`** |
| `scripts/vsh/src/lint/index.ts` | `prettier . --write --cache` / `prettier . --check --cache` | **替换为 `oxfmt` / `oxfmt --check`** |
| `lefthook.yml` | 多处 `pnpm prettier --write/--cache` | **替换为 `pnpm oxfmt`** |
| `pnpm-workspace.yaml` catalog | `prettier: ^3.8.1`、`eslint-plugin-prettier`、`stylelint-prettier` | **移除这三项** |
| `package.json` 根 | 依赖 `@vben/prettier-config` | **替换为 `@vben/oxfmt-config`** |
| `vben-admin.code-workspace` | workspace 引用 `prettier-config` | **更新** |

### 2.2 自动迁移配置

oxfmt 内置了从 Prettier 迁移的能力：

```bash
npx oxfmt@latest --migrate prettier
```

该命令会：

- 读取当前 `.prettierrc.mjs`（通过 `@vben/prettier-config` 解析）
- 生成 `.oxfmtrc.json`
- 将 `.prettierignore` 的模式迁移到 `ignorePatterns`
- 如果检测到 `prettier-plugin-tailwindcss` 会自动启用 `sortTailwindcss`
- 如果检测到 `prettier-plugin-packagejson` 会启用 `sortPackageJson`

> **注意**：如果 `.oxfmtrc.json` 已存在会报错，需先删除再重新运行。

### 2.3 配置对照与预期输出

当前 Prettier 配置（`@vben/prettier-config`）：

```js
{
  endOfLine: 'auto',
  printWidth: 80,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    { files: ['*.json5'], options: { quoteProps: 'preserve', singleQuote: false } }
  ]
}
```

预期 oxfmt 配置（`.oxfmtrc.json`）：

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "proseWrap": "never",
  "endOfLine": "lf",
  "ignorePatterns": [
    "dist",
    "dev-dist",
    ".local",
    ".claude",
    ".agent",
    ".agents",
    ".codex",
    ".output.js",
    "node_modules",
    ".nvmrc",
    "coverage",
    "CODEOWNERS",
    ".nitro",
    ".output",
    "**/*.svg",
    "**/*.sh",
    "public",
    ".npmrc",
    "*-lock.yaml",
    "skills-lock.json"
  ],
  "overrides": [
    {
      "files": ["*.json5"],
      "options": { "quoteProps": "preserve", "singleQuote": false }
    }
  ]
}
```

关键差异说明：

| Prettier 选项 | oxfmt 处理 |
| --- | --- |
| `endOfLine: 'auto'` | **不支持 `auto`**，需显式设为 `"lf"`（与 `.editorconfig` 的 `end_of_line=lf` 一致） |
| `printWidth: 80` | 直接映射（oxfmt 默认 100，需显式设 80 保持一致） |
| `overrides` | **自动迁移不支持 `overrides`**，需手动编写 |

### 2.4 `@vben/oxfmt-config` workspace 包

保持与 `@vben/prettier-config` 一致的 workspace 包组织模式：

```text
internal/lint-configs/oxfmt-config/
  package.json
  index.mjs          # 导出 oxfmt 配置对象（供程序化调用）
```

```json
// internal/lint-configs/oxfmt-config/package.json
{
  "name": "@vben/oxfmt-config",
  "version": "5.6.0",
  "private": true,
  "type": "module",
  "main": "./index.mjs",
  "module": "./index.mjs",
  "exports": {
    ".": { "default": "./index.mjs" }
  },
  "dependencies": {
    "oxfmt": "catalog:"
  }
}
```

> **注意**：oxfmt 的配置文件 `.oxfmtrc.json` 不像 Prettier 那样支持 JS 配置的 `export default`。 `@vben/oxfmt-config` 包的作用是：
>
> 1. 集中管理 `oxfmt` 版本依赖
> 2. 导出配置对象供 `internal/node-utils` 等程序化场景使用
> 3. 根目录直接使用 `.oxfmtrc.json` 文件（oxfmt 会自动读取）

### 2.5 替换范围详表

| 当前依赖 | 替代方案 |
| --- | --- |
| `prettier` ^3.8.1 | `oxfmt`（JS/TS 原生格式化，CSS/HTML/YAML/MD 内部委托 Prettier） |
| `eslint-plugin-prettier` | 移除（不再需要 ESLint-Prettier 集成） |
| `stylelint-prettier` | 移除（Stylelint 不再需要 Prettier 集成） |
| `@vben/prettier-config` | 改写为 `@vben/oxfmt-config` |

### 2.6 操作步骤

#### 第一步：生成 oxfmt 配置

```bash
# 自动迁移（生成 .oxfmtrc.json）
npx oxfmt@latest --migrate prettier

# 手动补充 overrides（自动迁移不支持）
# 手动将 endOfLine: 'auto' 改为 "lf"
# 手动添加 ignorePatterns（从 .prettierignore 迁移）
```

#### 第二步：创建 `@vben/oxfmt-config` 包

```bash
mkdir -p internal/lint-configs/oxfmt-config
# 创建 package.json 和 index.mjs
```

#### 第三步：全量格式化并对比

```bash
# 先用 prettier 格式化一遍作为基线
pnpm prettier . --write

# 再用 oxfmt 格式化
npx oxfmt@latest

# 查看差异
git diff --stat
```

检查差异是否可接受。已知的可能差异：

- oxfmt 的 `sortPackageJson` 排序算法可能与 Prettier 不同
- 嵌入语言格式化（CSS-in-JS）可能有细微差异

#### 第四步：更新 `scripts/vsh/src/lint/index.ts`

```ts
// Before
await execaCommand(`prettier . --write --cache --log-level warn`, {
  stdio: 'inherit',
});
await execaCommand(`prettier . --ignore-unknown --check --cache`, {
  stdio: 'inherit',
});

// After
await execaCommand(`oxfmt`, { stdio: 'inherit' });
await execaCommand(`oxfmt --check`, { stdio: 'inherit' });
```

#### 第五步：更新 `lefthook.yml`

```yaml
pre-commit:
  parallel: true
  commands:
    lint-md:
      run: pnpm oxfmt {staged_files}
      glob: '*.md'
    lint-vue:
      run: pnpm oxfmt {staged_files} && pnpm oxlint --fix {staged_files} && pnpm eslint --cache --fix {staged_files} && pnpm stylelint --fix --allow-empty-input {staged_files}
      glob: '*.vue'
    lint-js:
      run: pnpm oxfmt {staged_files} && pnpm oxlint --fix {staged_files} && pnpm eslint --cache --fix {staged_files}
      glob: '*.{js,jsx,ts,tsx}'
    lint-style:
      run: pnpm oxfmt {staged_files} && pnpm stylelint --fix --allow-empty-input {staged_files}
      glob: '*.{scss,less,styl,html,vue,css}'
    lint-package:
      run: pnpm oxfmt {staged_files}
      glob: 'package.json'
    lint-json:
      run: pnpm oxfmt {staged_files}
      glob: '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}'
```

#### 第六步：清理 ESLint 中的 Prettier 集成

1. 删除 `eslint-config/src/configs/prettier.ts`
2. 从 `eslint-config/src/configs/index.ts` 移除 `export * from './prettier'`
3. 从 `eslint-config/src/index.ts` 移除 `prettier()` 调用
4. 从 `eslint-config/package.json` 移除 `eslint-plugin-prettier` 依赖

#### 第七步：清理 Stylelint 中的 Prettier 集成

1. 从 `stylelint-config/index.mjs` 的 `plugins` 数组移除 `'stylelint-prettier'`
2. 从 `stylelint-config/index.mjs` 的 `rules` 移除 `'prettier/prettier': true`
3. 从 `stylelint-config/package.json` 移除 `prettier` 和 `stylelint-prettier` 依赖

#### 第八步：更新 `internal/node-utils/src/prettier.ts`

```ts
// 重命名为 formatter.ts 或保留文件名
import { execaCommand } from 'execa';

async function formatFile(filepath: string) {
  await execaCommand(`oxfmt ${filepath}`, { stdio: 'inherit' });
}

export { formatFile };
```

或者如果 oxfmt 提供了 Node API，则使用程序化调用。

#### 第九步：移除旧依赖

```bash
# 移除根目录文件
rm .prettierrc.mjs
rm .prettierignore

# 从 pnpm-workspace.yaml catalog 移除
# - prettier: ^3.8.1
# - eslint-plugin-prettier: ^5.5.5
# - stylelint-prettier: ^5.0.3

# 移除 @vben/prettier-config 包
rm -rf internal/lint-configs/prettier-config

# 更新 package.json 根，移除 @vben/prettier-config 依赖
# 更新 vben-admin.code-workspace，移除 prettier-config workspace 引用
```

#### 第十步：全量验证

```bash
pnpm install
pnpm run lint
pnpm run lint:oxc
pnpm run lint:eslint
```

### 2.7 oxfmt 额外能力评估

oxfmt 提供了 Prettier 没有的扩展特性，可选启用：

| 特性 | 说明 | 建议 |
| --- | --- | --- |
| `sortImports` | import 语句排序，灵感来自 `eslint-plugin-perfectionist/sort-imports` | 评估是否可替代 ESLint 侧 perfectionist 的 import 排序 |
| `sortTailwindcss` | 替代 `prettier-plugin-tailwindcss` | 当前项目已通过 oxlint `jsPlugins` 处理，需评估是否切换 |
| `sortPackageJson` | 自动排序 `package.json` 字段 | 默认启用，排序算法与 prettier-plugin-packagejson 不同 |
| `insertFinalNewline` | 文件末尾添加换行 | 默认启用，与 `.editorconfig` 的 `insert_final_newline=true` 一致 |

### 2.8 文件类型覆盖说明

oxfmt 对不同文件类型的处理方式：

| 文件类型                  | 格式化方式                                    |
| ------------------------- | --------------------------------------------- |
| JS / TS / JSX / TSX       | oxfmt 原生格式化                              |
| Vue SFC                   | oxfmt 原生格式化（`<script>` / `<template>`） |
| TOML                      | oxfmt 原生格式化（via taplo）                 |
| CSS / SCSS / Less         | 内部委托 Prettier                             |
| HTML                      | 内部委托 Prettier                             |
| YAML / Markdown / GraphQL | 内部委托 Prettier                             |

> **重要**：CSS 等非 JS/TS 文件仍然通过 oxfmt 内部委托 Prettier 处理，因此 `npx oxfmt` 一个命令即可覆盖所有文件类型。不需要单独安装 Prettier——oxfmt 自带内嵌版本。

### 2.9 迁移风险

1. **格式化差异**：oxfmt 与 Prettier 的输出可能存在细微差异，首次全量格式化会产生大量 diff，建议单独一个 commit
2. **嵌套配置不支持**：oxfmt 不支持子目录级别的配置文件，如有需要需用 `overrides` 替代
3. **`endOfLine: 'auto'` 不支持**：必须改为显式值，建议统一为 `"lf"`
4. **`node-utils/prettier.ts`**：如果有其他包或脚本通过 `prettierFormat()` 调用格式化，需逐一排查
5. **IDE 配置**：团队成员需安装 oxfmt VS Code 扩展，或配置 LSP（`oxfmt --lsp`）

---

## 第三阶段：Vite / Rolldown 自动集成 oxc

**前提**：Vite 通过 Rolldown 自动集成 oxc 能力后，以下依赖将被自然替代，无需手动操作。

| 当前依赖                      | 替代方式                                 |
| ----------------------------- | ---------------------------------------- |
| `esbuild` ^0.27.4             | Rolldown 内置 oxc-transform / oxc-parser |
| `html-minifier-terser` ^7.2.0 | oxc-minifier（或 Rolldown 内置 minify）  |

### 3.1 操作步骤

1. 跟踪 Vite / Rolldown 版本更新，确认 oxc 集成进度
2. 升级 Vite 到集成 Rolldown 的版本后，移除显式的 `esbuild` 依赖
3. 验证构建产物体积和功能无回归
4. 评估 `html-minifier-terser` 是否可被 Rolldown 内置能力替代

---

## 第四阶段：完全移除 ESLint（远期）

**前提**：oxlint 完全支持 Vue SFC 模板 lint 及所有保留插件的功能。

### 4.1 替换范围

| 当前依赖 | 替代方案 |
| --- | --- |
| `eslint` | 移除 |
| `eslint-plugin-vue` + `vue-eslint-parser` | oxlint Vue 支持 |
| `eslint-plugin-better-tailwindcss` | oxlint tailwindcss 支持或其他方案 |
| `eslint-plugin-jsonc` / `eslint-plugin-yml` | oxlint 或独立 linter |
| `eslint-config-turbo` | 移除 |
| `eslint-plugin-pnpm` | oxlint 或独立检查 |
| `eslint-plugin-command` | oxlint 或移除 |
| `@vitest/eslint-plugin` | oxlint vitest 分类 |
| `@vben/eslint-config` | 改写为 `@vben/oxlint-config` 或移除 |

### 4.2 操作步骤

1. 持续跟踪 oxlint 的 Vue / JSON / YAML 支持进展
2. 当 oxlint 规则覆盖度满足要求时，全面切换
3. 移除 `internal/lint-configs/eslint-config/` 及所有 ESLint 相关依赖
4. 更新 CI 和 lefthook 配置

---

## 迁移风险与注意事项

1. **规则对齐**：oxlint 的规则命名和行为可能与 ESLint 插件不完全一致，需逐条验证
2. **Vue SFC 支持**：oxlint 对 `<template>` 的 lint 能力是最大瓶颈，第一阶段务必保留 `eslint-plugin-vue`
3. **CI 稳定性**：共存期间两套工具可能对同一问题重复报告，需通过配置互相排除
4. **团队习惯**：IDE 插件（如 VS Code ESLint 扩展）需要同步配置 oxlint 扩展
5. **版本锁定**：oxc 生态仍在快速迭代，建议锁定 minor 版本，升级时做全量验证

---

## 预期收益

| 指标      | 预期改善                                    |
| --------- | ------------------------------------------- |
| lint 速度 | 通用规则部分提升 50-100x                    |
| 依赖数量  | 第一阶段减少约 11 个包，最终可减少 20+ 个包 |
| 安装体积  | 显著减少（ESLint 插件依赖树庞大）           |
| CI 时间   | lint 阶段耗时大幅缩短                       |
| 维护成本  | 减少 ESLint 插件版本兼容性问题              |
