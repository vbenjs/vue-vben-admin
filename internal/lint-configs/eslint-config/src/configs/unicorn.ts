import type { Linter } from 'eslint';

import { interopDefault } from '../util';

const rulesCoveredByOxlint = new Set([
  'unicorn/consistent-function-scoping',
  'unicorn/no-process-exit',
  'unicorn/prefer-global-this',
  'unicorn/prefer-module',
]);

export async function unicorn(): Promise<Linter.Config[]> {
  const pluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'));
  const recommendedRules = Object.fromEntries(
    Object.entries(pluginUnicorn.configs.recommended.rules ?? {}).filter(
      ([ruleName]) => !rulesCoveredByOxlint.has(ruleName),
    ),
  );

  return [
    {
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...recommendedRules,

        'unicorn/better-regex': 'off',
        'unicorn/consistent-destructuring': 'off',
        'unicorn/expiring-todo-comments': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/import-style': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/prefer-at': 'off',
        'unicorn/prefer-dom-node-text-content': 'off',
        'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
      },
    },
  ];
}
