/**
 * oxlint 的根级忽略清单（单一事实源）。
 *
 * 原生 extends 不合并 ignorePatterns 字段，因此该清单不能放进各配置模块，
 * 只能由根 oxlint.config.ts 集中声明；同时导出给 @vben/eslint-config 的
 * oxcCompat 桥接，把桥接产出的规则关停集合限定在 oxlint 实际检查的
 * 文件上（json/yaml/md/docs 等路径 eslint 独管，规则不应被关停）。
 */
const oxlintIgnorePatterns: string[] = [
  '**/dist/**',
  '**/node_modules/**',
  'docs/**',
  'playground/public/**',
  '**/*.json',
  '**/*.md',
  '**/*.svg',
  '**/*.yaml',
  '**/*.yml',
  // Generated shadcn-ui internals (radix wrappers under src/ui) are
  // intentionally left unmanaged; authored code in src/components stays linted.
  'packages/@core/ui-kit/shadcn-ui/src/ui/**',
];

export { oxlintIgnorePatterns };
