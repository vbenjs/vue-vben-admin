# OXC 迁移计划

> 本文档记录将项目中可替代的工具链逐步迁移到 [oxc](https://oxc.rs/) 生态的计划。
>
> 说明：本文档已按当前仓库状态校准。第一阶段已完成大部分工作，第二阶段的 formatter 迁移也已大部分落地。

## 当前现状

当前仓库的 lint / format 体系已经从“纯 ESLint + Prettier”演进为 “oxlint + ESLint 共存，oxfmt 替换 Prettier”。

当前与 lint / format 直接相关的核心依赖包括：

- `eslint` ^10.0.3
- `oxlint` ^1.55.0
- `oxfmt` ^0.40.0
- `eslint-plugin-oxlint` ^1.55.0
- `@typescript-eslint/parser` ^8.57.0
- `@typescript-eslint/eslint-plugin` ^8.57.0
- `eslint-plugin-unicorn` ^63.0.0
- `eslint-plugin-unused-imports` ^4.4.1
- `eslint-plugin-n` ^17.24.0
- `eslint-plugin-perfectionist` ^5.6.0
- `eslint-plugin-vue` ^10.8.0
- `eslint-plugin-better-tailwindcss` ^4.3.2
- `eslint-plugin-jsonc` ^3.1.2
- `eslint-plugin-yml` ^3.3.1
- `eslint-plugin-command` ^3.5.2
- `eslint-plugin-pnpm` ^1.6.0
- `@eslint-community/eslint-plugin-eslint-comments` ^4.7.1
- `vue-eslint-parser` ^10.4.0
- `yaml-eslint-parser` ^2.0.0
- `globals` ^17.4.0
- `esbuild` ^0.27.4
- `html-minifier-terser` ^7.2.0

以下依赖已不再存在于当前仓库的 lint / format 链路中：

- `eslint-plugin-import-x`
- `eslint-plugin-regexp`
- `eslint-plugin-jsdoc`
- `eslint-plugin-no-only-tests`
- `@vitest/eslint-plugin`
- `eslint-plugin-prettier`
- `stylelint-prettier`
- `prettier`

---

## 第一阶段：引入 oxlint，与 ESLint 共存

**目标**：将通用 JS/TS lint 规则交给 oxlint，ESLint 仅保留 oxlint 无法覆盖的特殊规则，减少依赖数量并提升 lint 速度。

### 1.1 安装 oxlint

```bash
pnpm add -Dw oxlint
```

### 1.2 已迁出或已移除的 ESLint 插件

以下插件与规则已经完成迁移，或者已从当前仓库移除：

| 插件 | 当前状态 | 说明 |
| --- | --- | --- |
| `eslint-plugin-regexp` | 已移除 | 由 oxlint 内建能力承接 |
| `eslint-plugin-jsdoc` | 已移除 | 由 oxlint 内建能力承接 |
| `eslint-plugin-no-only-tests` | 已移除 | 测试规则已迁到 oxlint / vitest 分类 |
| `eslint-plugin-import-x` | 已移除 | `import` 规则已集中迁入 `@vben/oxlint-config` |
| `@vitest/eslint-plugin` | 已移除 | Vitest 规则已迁入 `@vben/oxlint-config` |
| `eslint-plugin-prettier` | 已移除 | formatter 已切换到 oxfmt |
| `eslint-plugin-better-tailwindcss` | 已迁出 ESLint | 仍保留依赖，但已通过 oxlint `jsPlugins` 运行 |
| `@typescript-eslint/eslint-plugin` | 仍需保留 | 还有一批 TS 规则未迁移 |
| `@typescript-eslint/parser` | 仍需保留 | ESLint 侧 TS / Vue 规则仍依赖它 |
| `eslint-plugin-unicorn` | 仍需保留 | ESLint 侧仍使用其 recommended 规则补充 |
| `eslint-plugin-unused-imports` | 仍需保留 | `no-unused-imports` 仍由 ESLint 负责 |
| `eslint-plugin-n` | 仍需保留 | 多条 Node 规则在 oxlint 中暂无等价承接 |
| `eslint-plugin-perfectionist` | 仍需保留 | 排序规则策略不同，不建议强迁 |
| `@eslint-community/eslint-plugin-eslint-comments` | 仍需保留 | 当前尚未迁移 |

### 1.3 当前仍需保留在 ESLint 侧的插件 / 能力

以下插件或能力当前仍需继续由 ESLint 处理：

| 插件 / 能力 | 原因 |
| --- | --- |
| `eslint-plugin-vue` + `vue-eslint-parser` | Vue SFC template lint，oxlint Vue 支持尚未完善 |
| `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` | 仍有一批 TS strict / type-aware 规则保留在 ESLint 侧 |
| `eslint-plugin-unused-imports` | `no-unused-imports` 仍由 ESLint 负责 |
| `eslint-plugin-n` | 多条 Node 规则尚无等价承接 |
| `eslint-plugin-perfectionist` | 当前仍负责排序策略 |
| `eslint-plugin-jsonc` + `eslint-plugin-yml` + `yaml-eslint-parser` | JSON / YAML 文件 lint 仍在 ESLint 侧 |
| `eslint-plugin-pnpm` | pnpm workspace 规则，oxlint 无对应 |
| `eslint-plugin-command` | 魔法注释命令，oxlint 无对应 |
| `@eslint-community/eslint-plugin-eslint-comments` | 当前尚未迁移 |

### 1.4 配置 oxlint

当前实现已经调整为与 ESLint 一致的 workspace 包组织方式：

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

截至当前仓库状态，第一阶段与其配套的 formatter 迁移已完成以下工作：

1. 根 `lint` 已统一委托给 `vsh lint`
2. 保留 `lint:oxc`、`lint:oxc:type-aware`、`lint:eslint`、`lint:style` 作为独立入口
3. `lefthook` 已接入 `oxfmt`、`oxlint --fix`、`eslint --cache --fix`、`stylelint --fix`
4. 已新增 `@vben/oxlint-config`，并将 oxlint 规则集中到 `internal/lint-configs/oxlint-config`
5. 已新增 `@vben/oxfmt-config`，并使用根级 `oxfmt.config.ts` 作为格式化配置入口
6. `eslint-plugin-oxlint` 已接入 `@vben/eslint-config`
7. 已移除 `eslint-plugin-jsdoc`、`eslint-plugin-regexp`、`eslint-plugin-no-only-tests`
8. `import` 与 `vitest` 规则已迁入 oxlint，相关 ESLint 插件已移除
9. `better-tailwindcss` 已迁移到 `@vben/oxlint-config` 的 `jsPlugins` 方案
10. `unicorn` 插件已在 oxlint 侧显式启用，并补齐仓库内所需的 override
11. Prettier 相关根配置与 ESLint / Stylelint 集成已移除
12. `internal/node-utils` 已改为调用 `oxfmt`

### 1.6 当前 oxlint 基线策略

当前 `@vben/oxlint-config` 采用“先收敛噪音，再逐步接管规则”的策略：

- 启用 `correctness` 和 `suspicious`
- 显式启用 `import`、`node`、`oxc`、`typescript`、`unicorn`、`vitest`、`vue` 插件
- 通过 `jsPlugins` 在 oxlint 侧承接 `better-tailwindcss`
- 对当前仓库内高噪音且不准备立即批量整改的规则先显式关闭
- 通过 `overrides` 为 `.d.ts`、测试文件、脚本目录等特殊场景保留例外配置
- `overrides.files` 已避免继续使用 ESLint 风格的 extglob，改为显式文件后缀列表

### 1.7 当前已迁入 oxlint 的规则

以下规则已在当前仓库的 `@vben/oxlint-config` 中落地：

#### JavaScript / core

- `eqeqeq`
- `no-alert`
- `no-array-constructor`
- `no-caller`
- `no-case-declarations`
- `no-debugger`
- `no-eval`
- `no-iterator`
- `no-new-wrappers`
- `no-shadow-restricted-names`
- `no-unused-expressions`
- `prefer-const`
- 以及一批额外的 core 规则，例如 `no-console`、`no-template-curly-in-string`、`prefer-template`、`object-shorthand`

#### import

- `import/consistent-type-specifier-style`
- `import/first`
- `import/no-duplicates`
- `import/no-mutable-exports`
- `import/no-named-default`
- `import/no-self-import`
- `import/no-webpack-loader-syntax`

#### TypeScript

- `typescript/ban-ts-comment`
- `typescript/no-non-null-assertion`
- `typescript/no-var-requires`
- `typescript/triple-slash-reference`

> 当前仓库已开始为 type-aware 规则预留位置，但 `no-floating-promises`、`await-thenable` 等高噪音规则仍显式关闭，等待后续逐步接管。

#### Vitest

- `vitest/consistent-test-it`
- `vitest/no-focused-tests`
- `vitest/no-identical-title`
- `vitest/no-import-node-test`
- `vitest/prefer-hooks-in-order`
- `vitest/prefer-lowercase-title`

#### Node

- `node/no-exports-assign`
- `node/no-new-require`
- `node/no-path-concat`

#### Unicorn

- `unicorn/no-process-exit`
- `unicorn/prefer-module`

#### Tailwind CSS

- `better-tailwindcss/enforce-consistent-class-order`

> `better-tailwindcss/enforce-consistent-line-wrapping` 与 `better-tailwindcss/no-unknown-classes` 当前仍因噪音 / 与 formatter 冲突而关闭。

#### Vue

- `vue/prefer-import-from-vue`

### 1.8 暂时仍需保留在 ESLint 的部分

以下内容当前不建议从 ESLint 侧移除：

1. Vue SFC / template 主体规则
2. `perfectionist`
3. `jsonc` / `yml`
4. `pnpm`
5. `command`
6. `eslint-comments`
7. `unused-imports`
8. `node.ts` 中尚未被 oxlint 覆盖的规则
9. `typescript.ts` 中暂不适合直接迁移的 strict / type-aware 规则

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

为降低回归风险，建议按当前真实代码结构推进：

1. 验证 `oxcCompat()` 是否正确关闭 ESLint 重复规则
2. 继续清理 `eslint-config/src/configs/javascript.ts` 中已被 oxlint 明确覆盖的低风险规则
3. 继续从 `eslint-config/src/configs/typescript.ts` 向 `@vben/oxlint-config` 下沉规则，并结合 `lint:oxc:type-aware` 逐步启用 type-aware 规则
4. 评估 `eslint-config/src/configs/unicorn.ts` 中剩余规则是否值得继续保留
5. 保留并持续观察 `eslint-config/src/configs/node.ts`、`vue.ts`、`perfectionist.ts`、`jsonc.ts`、`yaml.ts`、`pnpm.ts`、`command.ts`
6. 最后再评估是否要重新启用 tailwind 的 wrapping / unknown classes 规则

每迁移一组后都执行：

```bash
pnpm run lint:oxc
pnpm run lint:eslint
pnpm run lint
```

### 1.10 当前 scripts

```jsonc
// package.json
{
  "scripts": {
    "format": "vsh lint --format",
    "lint": "vsh lint",
    "lint:oxc": "oxlint .",
    "lint:oxc:type-aware": "oxlint . --type-aware",
    "lint:eslint": "eslint . --cache",
    "lint:style": "stylelint \"**/*.{vue,css,less,scss}\" --cache",
  },
}
```

### 1.11 当前 lefthook

当前 `pre-commit` 已包含如下链路：

```yaml
pre-commit:
  parallel: true
  commands:
    code-workspace:
      run: pnpm vsh code-workspace --auto-commit
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

### 1.12 验证步骤

1. 全量运行 `pnpm run lint:oxc`，记录 oxlint 报告
2. 对比当前 ESLint 规则覆盖情况，调整 oxlint 配置使两者对齐
3. 逐个移除可替代的 ESLint 插件或规则组，每次移除后运行完整 lint 验证
4. CI 中同时运行 oxlint 和 ESLint，确保双重覆盖期间无回归

### 1.13 待修复问题与改进项

> 以下问题按当前仓库状态重新整理。

#### [高] `unicorn` 插件启用后要同时收敛默认规则与 override

这个问题已经修复，但需要保留经验：

- `plugins` 一旦显式声明，必须手动包含 `unicorn`
- 启用后不只会打开我们手写的 `unicorn/no-process-exit`、`unicorn/prefer-module`
- 还会带出 oxlint 默认启用的一部分 `unicorn` 规则，需要按仓库现状显式关闭噪音项
- OXC `overrides.files` 不要继续使用 `?([cm])[jt]s?(x)` 这类 ESLint 风格的 extglob

#### [高] 使用 `@oxlint/migrate` 仅做审计，不直接落地配置

官方提供了 [`@oxlint/migrate`](https://github.com/oxc-project/oxlint-migrate) 工具，可自动读取 ESLint flat config 生成对应 oxlint 配置。

对于当前仓库，`@oxlint/migrate` 更适合做“审计工具”，不适合直接生成或合并为最终配置，原因是：

1. 当前仓库已经不是简单的 `.oxlintrc.json` 形态，而是 workspace 包 + 模块化 `configs/*`
2. `@vben/oxlint-config` 依赖自定义 `mergeOxlintConfigs(...)` 来保证 `settings`、`ignorePatterns`、`jsPlugins` 正确合并
3. Tailwind 规则依赖手写 `jsPlugins` 和 `settings`
4. 现有迁移流程还包含 ESLint 兼容层 `eslint-plugin-oxlint`

更合理的用法是：

```bash
npx @oxlint/migrate --details
```

不建议直接使用 `--merge` 覆盖当前仓库的真实配置结构。

#### [中] `mergeOxlintConfigs` 函数重复定义

这个问题已经修复。ESLint 侧的 `oxlint.ts` 已直接导入 `@vben/oxlint-config` 的 `mergeOxlintConfigs`，并在传入 `buildFromOxlintConfig()` 前剥离 `extends`：

```ts
import { mergeOxlintConfigs, oxlintConfig } from '@vben/oxlint-config';
import oxlint from 'eslint-plugin-oxlint';

export async function oxcCompat(): Promise<Linter.Config[]> {
  const { extends: _extends, ...config } = mergeOxlintConfigs(oxlintConfig);

  return oxlint.buildFromOxlintConfig(
    config as Parameters<typeof oxlint.buildFromOxlintConfig>[0],
  );
}
```

#### [中] 验证 `oxcCompat()` 是否正确关闭 ESLint 重复规则

ESLint 侧 `javascript.ts` 仍有较多规则，而其中很多已被 oxlint 的 `correctness` / `suspicious` category 覆盖。

`eslint-plugin-oxlint` 的 `buildFromOxlintConfig()` 理论上会自动关闭 ESLint 中被 oxlint 覆盖的规则。仍需验证 `oxcCompat()` 确实生效。如果正常工作，则 ESLint 侧无需手动清理这批重复规则。

建议验证方法：

```bash
# 临时在 oxlint 中启用一个 ESLint 也有的规则（如 no-debugger）
# 确认 ESLint 不再重复报告该规则
```

#### [中] `eslint-plugin-import-x` 已从当前仓库移除

`eslint-plugin-import-x` 相关迁移已经落地，当前仓库不再保留该依赖，`import` 规则集中定义在 `internal/lint-configs/oxlint-config/src/configs/import.ts`。

当前未再单独保留 `import/newline-after-import`。如未来仍需这类纯风格规则，应单独评估是否值得重新引入。

#### [中] `eslint-plugin-n` 仍不能完全移除

当前 ESLint 侧 `node.ts` 仍保留以下规则，尚未被 oxlint 接管：

| 规则 | 备注 |
| --- | --- |
| `n/handle-callback-err` | oxlint 未支持 |
| `n/no-deprecated-api` | oxlint 未支持 |
| `n/no-extraneous-import` | 有自定义 `allowModules`，oxlint 未支持 |
| `n/no-unsupported-features/es-syntax` | oxlint 未支持 |
| `n/prefer-global/buffer` | oxlint 未支持 |
| `n/prefer-global/process` | oxlint 未支持 |
| `n/process-exit-as-throw` | oxlint 未支持 |

**结论**：`eslint-plugin-n` 当前仍需保留在 ESLint 侧。

#### [低] 已增加 `lint:oxc:type-aware` 入口，后续逐步启用规则

当前根 `package.json` 已提供：

```bash
pnpm run lint:oxc:type-aware
```

当前 `@vben/oxlint-config` 已显式保留一批关闭状态的 type-aware 规则，例如：

- `typescript/no-floating-promises`
- `typescript/await-thenable`
- `typescript/no-base-to-string`
- `typescript/no-unnecessary-type-assertion`

后续建议基于实际报告量逐条开启，而不是一次性打开全部 type-aware 规则。

#### [低] `--replace-eslint-comments` 批量转换注释

代码中存在的 `// eslint-disable` 注释虽然 oxlint 兼容，但在第四阶段移除 ESLint 后会变得语义不清。官方迁移工具提供了批量转换选项：

```bash
npx @oxlint/migrate --replace-eslint-comments
```

建议在第一阶段完成后或第四阶段开始前执行。

#### [低] `jsPlugins` 已在仓库中使用，后续可继续减少 ESLint 依赖

当前仓库已经通过 `jsPlugins` 在 oxlint 侧接入 `eslint-plugin-better-tailwindcss`。对于 `eslint-plugin-pnpm`、`eslint-plugin-command` 等 oxlint 不内置的插件，未来仍可评估采用同样方式进一步减少对 ESLint 的依赖：

```json
{
  "jsPlugins": ["eslint-plugin-pnpm"],
  "rules": {
    "pnpm/some-rule": "warn"
  }
}
```

---

## 第二阶段：oxfmt 替换 Prettier（大部分已完成）

**当前状态**：第二阶段的大部分工作已经落地，下面记录的是“当前仓库真实状态”和仍需继续验证的事项，而不是最初的待办清单。

> 参考文档：[oxfmt CLI](https://oxc.rs/docs/guide/usage/formatter/cli.html) | [Config Reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html)

### 2.1 当前 formatter 触点全景

| 位置 | 当前状态 | 说明 |
| --- | --- | --- |
| `internal/lint-configs/oxfmt-config/` | 已完成 | 新增 `@vben/oxfmt-config` workspace 包 |
| `oxfmt.config.ts` | 已完成 | 根级 formatter 配置入口，负责追加 `ignorePatterns` |
| `.prettierrc.mjs` | 已移除 | 不再作为根入口 |
| `.prettierignore` | 已移除 | 忽略模式已迁入 `oxfmt.config.ts` |
| `eslint-config/src/configs/prettier.ts` | 已移除 | ESLint 不再集成 Prettier |
| `eslint-config/src/index.ts` | 已完成 | 已无 `prettier()` 调用 |
| `eslint-config/package.json` | 已完成 | 已移除 `eslint-plugin-prettier` 依赖 |
| `stylelint-config/index.mjs` | 已完成 | 已移除 `stylelint-prettier` 插件和规则 |
| `stylelint-config/package.json` | 已完成 | 已移除 `prettier` / `stylelint-prettier` 依赖 |
| `internal/node-utils/src/formatter.ts` | 已完成 | 格式化工具已改为调用 `oxfmt` |
| `scripts/vsh/src/lint/index.ts` | 已完成 | 已改为调用 `oxfmt` |
| `lefthook.yml` | 已完成 | 已统一切换为 `pnpm oxfmt` |
| `pnpm-workspace.yaml` catalog | 已完成 | 已移除 `prettier`、`eslint-plugin-prettier`、`stylelint-prettier`，并新增 `oxfmt` |
| `package.json` 根 | 已完成 | 已依赖 `@vben/oxfmt-config` 与 `oxfmt` |
| `vben-admin.code-workspace` | 已完成 | 已更新 workspace 引用 |

### 2.2 当前实际配置

当前仓库并未使用 `.oxfmtrc.json`，而是采用 “共享包 + 根入口” 的组织方式。

共享配置位于 `internal/lint-configs/oxfmt-config/src/index.ts`：

```ts
import { defineConfig as defineOxfmtConfig } from 'oxfmt';

const oxfmtConfig = defineOxfmtConfig({
  printWidth: 80,
  proseWrap: 'never',
  semi: true,
  singleQuote: true,
  sortPackageJson: false,
  trailingComma: 'all',
});
```

根级入口位于 `oxfmt.config.ts`：

```ts
import { defineConfig } from '@vben/oxfmt-config';

export default defineConfig({
  ignorePatterns: [
    'dist',
    'dev-dist',
    '.local',
    '.claude',
    '.agent',
    '.agents',
    '.codex',
    '.output.js',
    'node_modules',
    '.nvmrc',
    'coverage',
    'CODEOWNERS',
    '.nitro',
    '.output',
    '**/*.svg',
    '**/*.sh',
    'public',
    '.npmrc',
    '*-lock.yaml',
    'skills-lock.json',
  ],
});
```

需要注意两点：

1. 当前 formatter 的 `printWidth` 明确设为 `80`
2. `.editorconfig` 的 `max_line_length` 仍为 `100`

也就是说，当前仓库实际上采用的是“oxfmt 显式配置优先于 `.editorconfig`”的策略，这一点需要在后续验证中保持一致。

### 2.3 `@vben/oxfmt-config` workspace 包

当前包结构与其他 lint-config 包保持一致：

```text
internal/lint-configs/oxfmt-config/
  package.json
  src/index.ts
```

```json
{
  "name": "@vben/oxfmt-config",
  "version": "5.6.0",
  "private": true,
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.mjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "dependencies": {
    "oxfmt": "catalog:"
  }
}
```

这个包当前承担三件事：

1. 集中管理 `oxfmt` 版本依赖
2. 导出共享格式化配置对象
3. 供根级 `oxfmt.config.ts` 和其他程序化场景复用

### 2.4 已完成的替换范围

| 原方案                   | 当前状态                      |
| ------------------------ | ----------------------------- |
| `prettier`               | 已移除，当前统一使用 `oxfmt`  |
| `eslint-plugin-prettier` | 已移除                        |
| `stylelint-prettier`     | 已移除                        |
| `@vben/prettier-config`  | 已替换为 `@vben/oxfmt-config` |

### 2.5 已完成的操作

以下动作已在当前仓库完成：

1. 创建 `@vben/oxfmt-config` workspace 包
2. 新增根级 `oxfmt.config.ts`
3. 将 `scripts/vsh/src/lint/index.ts` 切换到 `oxfmt`
4. 将 `lefthook.yml` 切换到 `pnpm oxfmt`
5. 删除 ESLint 中的 Prettier 集成
6. 删除 Stylelint 中的 Prettier 集成
7. 将 `internal/node-utils` 中的格式化能力切换到 `oxfmt`
8. 删除 `.prettierrc.mjs`、`.prettierignore` 和旧的 `@vben/prettier-config`
9. 更新根 `package.json`、`pnpm-workspace.yaml`、`vben-admin.code-workspace`

### 2.6 下一步只保留验证项

第二阶段当前不再需要按“迁移步骤”执行，剩余工作主要是验证和收口：

1. 重新全量运行 `pnpm run lint`，确认 `vsh lint` 当前默认行为与预期一致
2. 明确 `oxfmt.config.ts` 是否作为 CLI 与编辑器共同入口；如团队工具链存在兼容性差异，再决定是否需要补 `.oxfmtrc.json`
3. 决定 `printWidth: 80` 与 `.editorconfig` 的 `max_line_length = 100` 是否继续并存
4. 评估是否启用 oxfmt 的额外能力，例如 `sortImports`、`sortTailwindcss`

### 2.7 oxfmt 额外能力评估

oxfmt 提供了 Prettier 没有的扩展特性，可选启用：

| 特性 | 说明 | 当前状态 / 建议 |
| --- | --- | --- |
| `sortImports` | import 语句排序，灵感来自 `eslint-plugin-perfectionist/sort-imports` | 可评估是否替代 ESLint 侧部分排序职责 |
| `sortTailwindcss` | 替代 `prettier-plugin-tailwindcss` | 当前仓库仍优先使用 oxlint `jsPlugins` 方案 |
| `sortPackageJson` | 自动排序 `package.json` 字段 | 当前共享配置显式设为 `false` |
| `insertFinalNewline` | 文件末尾添加换行 | 与 `.editorconfig` 的 `insert_final_newline=true` 一致 |

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

> **重要**：CSS 等非 JS/TS 文件仍然通过 oxfmt 内部委托 Prettier 处理，因此 `oxfmt` 一个命令即可覆盖主要文件类型；仓库中不需要再单独安装 `prettier`。

### 2.9 当前风险与注意事项

1. **配置入口一致性**：当前实际入口是 `oxfmt.config.ts`，需确认 CLI、编辑器、CI 是否都按这份配置执行
2. **行宽来源不一致**：`oxfmt` 显式 `printWidth: 80`，`.editorconfig` 为 `100`，需要明确这是有意保留还是待统一
3. **格式化差异**：首次重新全量格式化时，仍可能出现与历史 Prettier 输出不同的 diff
4. **扩展能力取舍**：`sortImports`、`sortTailwindcss` 是否启用会直接影响 ESLint / oxlint 的职责边界
5. **IDE 配置**：团队成员仍需统一使用 oxfmt 对应扩展或 LSP（`oxfmt --lsp`）

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

**前提**：oxlint 完全支持 Vue SFC 模板 lint 及所有当前保留插件的功能。

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
| `@vben/eslint-config` | 改写为 `@vben/oxlint-config` 或移除 |

### 4.2 操作步骤

1. 持续跟踪 oxlint 的 Vue / JSON / YAML 支持进展
2. 当 oxlint 规则覆盖度满足要求时，全面切换
3. 移除 `internal/lint-configs/eslint-config/` 及所有 ESLint 相关依赖
4. 更新 CI 和 `lefthook` 配置

---

## 迁移风险与注意事项

1. **规则对齐**：oxlint 的规则命名和行为可能与 ESLint 插件不完全一致，需逐条验证
2. **Vue SFC 支持**：oxlint 对 `<template>` 的 lint 能力仍是最大瓶颈，第一阶段务必保留 `eslint-plugin-vue`
3. **CI 稳定性**：共存期间两套工具可能对同一问题重复报告，需通过配置互相排除
4. **团队习惯**：IDE 插件需要同步配置 oxlint / oxfmt 对应扩展
5. **版本锁定**：oxc 生态仍在快速迭代，建议锁定 minor 版本，升级时做全量验证

---

## 预期收益

| 指标      | 预期改善                              |
| --------- | ------------------------------------- |
| lint 速度 | 通用规则部分显著提升                  |
| 依赖数量  | 第一阶段已明显减少，最终可继续下降    |
| 安装体积  | 显著减少（ESLint 插件依赖树庞大）     |
| CI 时间   | lint 阶段耗时大幅缩短                 |
| 维护成本  | 减少 ESLint / Prettier 插件兼容性问题 |
