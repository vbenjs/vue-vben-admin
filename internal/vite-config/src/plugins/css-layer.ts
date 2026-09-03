import type { Plugin } from 'vite';

interface CssLayerRule {
  /** 层名，需在 css 中先于 @import 'tailwindcss' 声明层顺序（见 internal/tailwind-config/theme.css） */
  layerName: string;
  /** 需要包层的包名（匹配该包在 node_modules 下的 css 模块 id） */
  packageName: string;
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * 与 internal/tailwind-config/src/theme.css 中的层顺序保持一致：
 * properties(Tailwind 的 --tw-* 回退变量层) < preflight(base) <
 * UI 库组件样式(antd / el / td) < Tailwind 工具类。
 * 该声明必须在打包后注入：生产构建下 css 按 chunk 注入，若组件库的 css
 * chunk 先于含层顺序声明的 theme.css 加载，层名会先被注册为最低优先级，
 * 导致 Tailwind base/utilities 覆盖组件样式。打包后在每个含组件库层的
 * css 产物顶部补上该声明，无论 chunk 加载顺序如何，层优先级都正确
 * （theme.css 先加载时该声明是幂等的 no-op）。
 * 注意 properties 必须排在首位：它是 Tailwind 为不支持 @property 的旧
 * 浏览器准备的 --tw-* 回退变量层，必须始终是最低优先级，否则其回退声明
 * 会覆盖工具类写入的变量。
 */
const LAYER_ORDER_STATEMENT =
  '@layer properties, theme, base, ant, antd, el, td, components, utilities;';

/**
 * 把指定包内的 css 包进 @layer：
 * 组件库的 css 是无层样式，无层样式在级联中永远压过 @layer 内的 Tailwind 工具类；
 * 包层后由 theme.css 的层声明决定顺序（utilities 排在组件库层之后），
 * 使 Tailwind 工具类可以覆盖组件库样式。
 *
 * 注意：层顺序声明不能在 transform 阶段随包层 css 一起输出——rolldown-vite
 * 的 css 合并会将「层顺序声明 + @layer 规则」形式的模块拆层（规则被脱层），
 * 且产物压缩阶段也会丢弃该声明。因此改在 generateBundle 阶段对最终 css
 * 产物统一注入（见 LAYER_ORDER_STATEMENT）。
 *
 * @example
 * ```ts
 * plugins: [viteCssLayerPlugin({ packageName: 'element-plus', layerName: 'el' })]
 * ```
 */
export function viteCssLayerPlugin(
  rules: CssLayerRule | CssLayerRule[],
): Plugin {
  const list = Array.isArray(rules) ? rules : [rules];
  const matchers = list.map(({ layerName, packageName }) => ({
    layerName,
    regex: new RegExp(`${escapeRegExp(packageName)}[\\\\/].+\\.css$`, 'i'),
  }));
  return {
    name: 'vite-plugin-css-layer',
    enforce: 'pre',
    transform(code, id) {
      const [file] = id.split('?', 1);
      if (!file) return;
      const matched = matchers.find((m) => m.regex.test(file));
      if (matched) {
        return { code: `@layer ${matched.layerName} {\n${code}\n}`, map: null };
      }
    },
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) {
          continue;
        }
        const css = file.source.toString();
        const matched = matchers.some((m) =>
          css.includes(`@layer ${m.layerName}`),
        );
        if (!matched) {
          continue;
        }
        // 先去除可能的 BOM 再判断，避免重复注入层顺序声明
        const hasStatement = css
          .replace(/^\uFEFF/, '')
          .trimStart()
          .startsWith(LAYER_ORDER_STATEMENT);
        if (hasStatement) {
          continue;
        }
        file.source = `${LAYER_ORDER_STATEMENT}\n${css}`;
      }
    },
  };
}
