export default {
  extends: ['@vben', 'plugin:import/recommended'],
  rules: {
    eqeqeq: 'error',

    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',

    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
      },
    ],

    /**
     * 【强制】关键字前后有一个空格
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
     */
    'keyword-spacing': 'off',
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],

    /**
     * 禁止出现空函数，普通函数（非 async/await/generator）、箭头函数、类上的方法除外
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
     */
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],

    /**
     * 优先使用 interface 而不是 type 定义对象类型
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
     */
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-types': 'error',

    'vue/attributes-order': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-explicit-emits': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/attribute-hyphenation': 'error',
    'vue/multiline-html-element-content-newline': 'error',
    'vue/html-closing-bracket-newline': 'error',
    'vue/one-component-per-file': 'error',
    'vue/custom-event-name-casing': 'error',
  },

  settings: {
    'import/resolver': {
      node: { extensions: ['.ts', '.d.ts', '.tsx'] },
    },
    'import/ignore': ['node_modules'],
  },
};
