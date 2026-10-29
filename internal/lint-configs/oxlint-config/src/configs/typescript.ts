import type { OxlintConfig } from 'oxlint';

const typescript: OxlintConfig = {
  // 类型感知规则通道（tsgolint）：与 CLI --type-aware 等价，仅根配置支持，
  // 作为唯一真源（lefthook / vsh 不再传 CLI flag）。
  options: {
    typeAware: true,
  },
  rules: {
    // —— 从 @typescript-eslint strict 预设迁移而来（非类型感知，oxlint 原生支持）——
    // no-array-constructor / no-useless-constructor 已由 javascript 配置以核心规则覆盖。
    'typescript/ban-ts-comment': 'error',
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-dynamic-delete': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-extraneous-class': 'error',
    'typescript/no-invalid-void-type': 'error',
    'typescript/no-misused-new': 'error',
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-var-requires': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-literal-enum-member': 'error',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/triple-slash-reference': 'error',
    'typescript/unified-signatures': 'error',

    // —— tsgolint 类型感知规则（批 1：低噪音高自动修复率）——
    'typescript/await-thenable': 'error',
    'typescript/no-duplicate-type-constituents': 'error',
    'typescript/no-redundant-type-constituents': 'error',
    'typescript/no-unnecessary-boolean-literal-compare': 'error',
    'typescript/no-unnecessary-template-expression': 'error',
    'typescript/no-unnecessary-type-arguments': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unnecessary-type-conversion': 'error',

    // —— 依赖类型死锁，暂不可开启 ——
    // cz-git 的 UserConfig 自带仅类型的 RuleConfigSeverity 枚举（declare enum），
    // 其 ESM 产物未导出该枚举（CJS 有、ESM 无，属 cz-git 构建缺陷）。仓库内任何
    // 可用的枚举值（数字字面量或 @commitlint/types 的同名枚举）都因名义枚举
    // 身份不匹配被拦截，无法靠改码修复；待 cz-git 修复 ESM 导出后恢复开启。
    'typescript/no-unsafe-enum-assignment': 'off',

    // —— 命中量超出迁移承载，暂不可开启 ——
    // no-unsafe-type-assertion 禁止一切向下收窄断言（全仓实测 359 处：源码 225 +
    // 测试 134）。该规则不在 @typescript-eslint 任何预设中，官方文档也建议测试
    // stub 较多的项目慎用；且与批 1 为满足 vue-tsc 双端有效而补的边界收窄断言
    // （如 generate-menus 的 `as RouteMeta`）直接冲突。开启等同于一场独立的
    // 全仓类型安全重构，超出本次工具链迁移范围。
    'typescript/no-unsafe-type-assertion': 'off',

    // —— tsgolint 类型感知规则（批 2：高价值，需修码）——
    'typescript/no-floating-promises': 'error',
    'typescript/no-misused-spread': 'error',
    'typescript/no-unsafe-enum-comparison': 'error',
    'typescript/no-useless-default-assignment': 'error',
    'typescript/unbound-method': 'error',

    // —— 待开启（批 3：开完统计命中数再定去留）——
    'typescript/consistent-return': 'off',
    'typescript/no-base-to-string': 'off',
    'typescript/no-unnecessary-type-parameters': 'off',
    'typescript/restrict-template-expressions': 'off',
  },
};

export { typescript };
