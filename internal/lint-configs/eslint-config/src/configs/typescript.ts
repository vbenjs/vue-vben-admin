import type { Linter } from 'eslint';

import { interopDefault } from '../util';

/**
 * @typescript-eslint 的规则已迁移到 oxlint（typescript 插件）。
 * 这里仅保留 TS 解析器，供其它 eslint 插件（perfectionist、n 等）解析 TS/TSX 文件。
 * 因不再有类型感知规则，已移除 parserOptions.project，eslint 解析更快。
 *
 * 注意：移除 @typescript-eslint 插件后，unused-imports/no-unused-vars 会退回核心实现，
 * 无法识别 TS 类型签名里的形参（会误报）。故对 TS/TSX/Vue 统一关闭该规则，
 * 未使用变量改由 oxlint 的 no-unused-vars（类型感知）负责。
 */
export async function typescript(): Promise<Linter.Config[]> {
  const parserTs = await interopDefault(import('@typescript-eslint/parser'));

  return [
    {
      files: ['**/*.?([cm])[jt]s?(x)'],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          extraFileExtensions: ['.vue'],
          jsxPragma: 'React',
          sourceType: 'module',
        },
      },
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      // Vue `<script>` 的未使用变量同样交给 oxlint，避免核心规则误报 TS 类型签名形参
      files: ['**/*.vue'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
}
