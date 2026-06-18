import { defineConfig as defineOxfmtConfig } from 'oxfmt';

type OxfmtConfig = Parameters<typeof defineOxfmtConfig>[0];

/**
 * oxfmt 配置文件，详见下方链接
 * https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html
 */
const oxfmtConfig: OxfmtConfig = defineOxfmtConfig({
  /**
   * 单行长度 oxfmt，适配 prettier 的 80
   * Default：100
   */
  printWidth: 80,
  /**
   * 缩进宽度
   * Default：2
   */
  tabWidth: 2,
  /**
   * Markdown、MDX、YAML 文件格式化包裹
   * type: always | never | preserve
   * Default: preserve
   */
  proseWrap: 'never',
  /**
   * 结尾添加分号
   * Default：true
   */
  semi: true,
  /**
   * 使用单引号
   * Default：false
   */
  singleQuote: true,
  /**
   * 对象属性添加引号
   * Default：as-needed
   */
  quoteProps: 'as-needed',
  /**
   * 将多行元素的 > 放在最后一行的末尾，而不是单独放在下一行
   * Default：false
   */
  bracketSameLine: false,
  /**
   * 对象字面量的大括号间添加空格
   * Default：true
   */
  bracketSpacing: true,
  /**
   * 箭头函数参数总是使用括号
   * type: always | avoid
   * Default：always
   */
  arrowParens: 'always',
  /**
   * 配置 package.json 排序，但是 oxfmt 不支持 pnpm-workspace
   * 现使用 eslint 搭配 eslint-plugin-pnpm eslint-plugin-yml 支持 package.json 和 pnpm-workspace.yaml 但排序风格不太一致
   * Default：true
   */
  sortPackageJson: false,
  /**
   * 配置 import 排序，现在 使用 eslint-plugin-perfectionist，但是 oxfmt 不支持 export 等
   * 并且 customGroups 不支持 ts-equals-import
   * Default：false
   */
  sortImports: false,
  /**
   * 多行结构中的后置逗号
   * Default：all
   */
  trailingComma: 'all',
  /**
   * 行尾换行符
   * type: lf | crlf | cr
   * Default: lf
   */
  endOfLine: 'lf',
  /**
   * 在文件最后插入一个换行
   * Default：true
   */
  insertFinalNewline: true,
  /**
   * 控制格式化文件中例如，CSS-in-JS 或 JS-in-Vue 等
   * Default：auto
   */
  embeddedLanguageFormatting: 'auto',
  /**
   * Vue/HTML/Angular/Handlebars 的空白敏感度（oxfmt 现会格式化 <template>）
   * type: css | strict | ignore
   * Default：css
   */
  htmlWhitespaceSensitivity: 'css',
  /**
   * 暂时关闭，改动较多，后续可以考虑开启，支持 vue 但与现有的 eslint-plugin-better-tailwindcss 格式化会冲突
   * eslint-plugin-better-tailwindcss配置在 oxlint，在 vue文 件暂时不生效，ts等正常
   * Default：关闭
   */
  // sortTailwindcss: {
  //   functions: ['clsx', 'cn', 'cva', 'tw'],
  //   stylesheet: './internal/tailwind-config/src/theme.css',
  //   preserveWhitespace: true,
  // },
  overrides: [
    {
      files: [
        '*.json',
        '*.json5',
        '*.jsonc',
        '*.code-workspace',
        '**/*.json',
        '**/*.json5',
        '**/*.jsonc',
        '**/*.code-workspace',
      ],
      options: {
        trailingComma: 'none',
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
  ],
});

function defineConfig(config: OxfmtConfig = {}): OxfmtConfig {
  return defineOxfmtConfig({
    ...oxfmtConfig,
    ...config,
  });
}

export { defineConfig, oxfmtConfig };
export type { OxfmtConfig };
