import type { Linter } from 'eslint';

import { interopDefault } from '../util';

const rulesCoveredByOxlint = new Set([
  '@typescript-eslint/ban-ts-comment',
  '@typescript-eslint/no-non-null-assertion',
  '@typescript-eslint/no-unused-expressions',
  '@typescript-eslint/no-unused-vars',
  '@typescript-eslint/triple-slash-reference',
]);

export async function typescript(): Promise<Linter.Config[]> {
  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);
  const strictRules = Object.fromEntries(
    Object.entries(pluginTs.configs.strict?.rules ?? {}).filter(
      ([ruleName]) => !rulesCoveredByOxlint.has(ruleName),
    ),
  );

  return [
    {
      files: ['**/*.?([cm])[jt]s?(x)'],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          createDefaultProgram: false,
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          extraFileExtensions: ['.vue'],
          jsxPragma: 'React',
          project: './tsconfig.*.json',
          sourceType: 'module',
        },
      },
      plugins: {
        '@typescript-eslint': pluginTs as any,
      },
      rules: {
        ...pluginTs.configs['eslint-recommended']?.overrides?.[0]?.rules,
        ...strictRules,
        // '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
}
