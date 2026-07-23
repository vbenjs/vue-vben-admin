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
 * 把指定包内的 css 包进 @layer：
 * 组件库的 css 是无层样式，无层样式在级联中永远压过 @layer 内的 Tailwind 工具类；
 * 包层后由 theme.css 的层声明决定顺序（utilities 排在组件库层之后），
 * 使 Tailwind 工具类可以覆盖组件库样式。
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
  };
}
