import type { Plugin } from 'vite';

interface CssLayerRule {
  /** 层名，需包含在统一层序中（见 internal/tailwind-config/src/theme.css） */
  layerName: string;
  /** 需要包层的包名（匹配该包在 node_modules 下的 css 模块 id） */
  packageName: string;
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/** 文件头可能的 BOM。以转义序列书写，避免源码里出现不可见字符。 */
const BOM = '\uFEFF';

/** 这些请求由 Vite 加载为 JavaScript，不能按样式文本包层。 */
const NON_STYLE_QUERY_RE = /[?&](?:raw|url|worker|sharedworker)(?:[=&]|$)/;
const LAYER_ORDER_ATTRIBUTE = 'data-vben-css-layer-order';

function getStyleFile(id: string): string | undefined {
  if (id.startsWith('\0') || NON_STYLE_QUERY_RE.test(id)) {
    return undefined;
  }
  return id.split('?', 1)[0]?.replaceAll('\\', '/');
}

/**
 * @charset 只在样式表最开头有效，包进 @layer 后成为无效语句
 * （build 时 vite 的 hoistAtRules 会自愈，dev 时则残留），包层前统一剥除。
 * vxe-table 的 es 目录 style.css 首行就是 @charset。
 */
function stripCharset(css: string): string {
  const withoutBom = css.startsWith(BOM) ? css.slice(1) : css;
  return withoutBom.replace(/^@charset[^;]*;\s*/, '');
}

function wrapInLayer(layerName: string, code: string): string {
  return `@layer ${layerName} {\n${stripCharset(code)}\n}`;
}

/**
 * 与应用无关的第三方样式包层规则：统一在 loadApplicationPlugins 注册
 * （internal/vite-config/src/plugins/index.ts），docs 的 vitepress 配置
 * （docs/.vitepress/config/shared.mts）复用同一份。
 * - vxe：vxe-table / vxe-pc-ui。组件样式经 VxeResolver 懒加载为包内 es
 *   目录下的 style.css（由 pre 实例包层），主题变量经 styles/cssvar.scss
 *   引入（由 scss 实例包层）。
 * - lib：tippy.js / vue-json-pretty 等散装第三方样式。
 */
const THIRD_PARTY_CSS_LAYER_RULES: CssLayerRule[] = [
  { layerName: 'lib', packageName: 'tippy.js' },
  { layerName: 'lib', packageName: 'vue-json-pretty' },
  { layerName: 'vxe', packageName: 'vxe-pc-ui' },
  { layerName: 'vxe', packageName: 'vxe-table' },
];

/**
 * 与 internal/tailwind-config/src/theme.css 中的层顺序保持一致：
 * properties(Tailwind 的 --tw-* 回退变量层) < preflight(base) <
 * UI 库与第三方库样式(antd / el / td / vxe / lib) < vben 自有组件样式
 * (components) < Tailwind 工具类。
 * 普通声明中，vxe / lib 位于 components 之前，自有组件和工具类可以覆盖
 * 第三方样式；!important 声明的层优先级相反。
 * HTML 入口最先声明层序，避免开发期依赖先注入组件样式时提前注册层名。
 * 生产构建还需保留 CSS 产物兜底：若组件库的 css
 * chunk 先于含层顺序声明的 theme.css 加载，层名会先被注册为最低优先级，
 * 导致 Tailwind base/utilities 覆盖组件样式。打包后在每个含组件库层的
 * css 产物顶部补上该声明，无论 chunk 加载顺序如何，层优先级都正确
 * （theme.css 先加载时该声明是幂等的 no-op）。
 * 注意 properties 必须排在首位：它是 Tailwind 为不支持 @property 的旧
 * 浏览器准备的 --tw-* 回退变量层，必须始终是最低优先级，否则其回退声明
 * 会覆盖工具类写入的变量。
 * __vitepress_base：vitepress 2.x 的 theme-default base.css 自带
 * @layer __vitepress_base（内含一份 preflight 拷贝）。必须在声明中固定
 * 它的位置（紧邻 base、靠前）：HTML 预注册十个层名后，它若不列入声明，
 * 会按首现顺序落到 utilities 之后，其中的 * 重置（padding/margin/border
 * 归零）将反压 antd 层与工具类（docs 的输入框会掉边框、表单控件塌高）。
 * 应用侧不存在该层，声明空层无副作用。
 */
export const LAYER_ORDER_STATEMENT =
  '@layer properties, theme, __vitepress_base, base, antd, el, td, vxe, lib, components, utilities;';

/** Vite 与 VitePress 共用，在任何模块样式或外链样式之前确定层序。 */
export function injectCssLayerOrder(html: string): string {
  if (html.includes(LAYER_ORDER_ATTRIBUTE)) {
    return html;
  }
  return html.replace(
    /<head\b[^>]*>/i,
    (head) =>
      `${head}\n<style ${LAYER_ORDER_ATTRIBUTE}>${LAYER_ORDER_STATEMENT}</style>`,
  );
}

/**
 * 把指定包内的 css 包进 @layer：
 * 普通声明中，无层的组件库样式优先于 @layer 内的 Tailwind 工具类；
 * 包层后由 theme.css 的层声明决定顺序（utilities 排在组件库层之后），
 * 使工具类可以覆盖组件库的普通声明；!important 声明的层顺序相反。
 *
 * 返回 [css 插件, scss 插件, HTML 层序插件]：
 * - css 插件（enforce: 'pre'）匹配包内 `*.css` 模块。
 * - scss 插件（无 enforce，normal 位）匹配包内 `*.sass / *.scss` 模块，
 *   包住的是 vite:css 编译后的 css。必须放 normal 位：vite 的插件序为
 *   pre → vite:css（sass 编译）→ normal → vite:css-post → post，normal
 *   位恰好拿到编译产物且先于 css-post 消费；enforce 'post' 不可行——
 *   dev 下 vite:css-post 会把 css 模块改写成 JS 样式更新包装，build 下
 *   把 css 收进闭包并返回空串，post 位的 transform 永远拿不到 css 文本。
 * - HTML 层序插件（enforce: 'post'）在内联 CSS 编译及 HTML 压缩后注入，
 *   避免纯层序声明被优化掉。
 *
 * 注意：层顺序声明不能在 transform 阶段随包层 css 一起输出——rolldown-vite
 * 的 css 合并会将「层顺序声明 + @layer 规则」形式的模块拆层（规则被脱层），
 * 且产物压缩阶段也会丢弃该声明。因此改在 generateBundle 阶段（仅 css
 * 插件携带）对最终 css 产物统一注入（见 LAYER_ORDER_STATEMENT）。
 *
 * @example
 * ```ts
 * plugins: [viteCssLayerPlugin({ packageName: 'element-plus', layerName: 'el' })]
 * ```
 */
export function viteCssLayerPlugin(
  rules: CssLayerRule | CssLayerRule[],
): Plugin[] {
  const list = Array.isArray(rules) ? rules : [rules];
  const matchers = list.map(({ layerName, packageName }) => {
    const packagePath = `(?:^|/)node_modules/${escapeRegExp(packageName)}/`;
    return {
      layerName,
      cssRegex: new RegExp(`${packagePath}.+\\.css$`, 'i'),
      scssRegex: new RegExp(`${packagePath}.+\\.s[ac]ss$`, 'i'),
    };
  });

  return [
    {
      name: 'vite-plugin-css-layer',
      enforce: 'pre',
      transform(code, id) {
        const file = getStyleFile(id);
        const matched = file
          ? matchers.find((m) => m.cssRegex.test(file))
          : undefined;
        if (matched) {
          return { code: wrapInLayer(matched.layerName, code), map: null };
        }
        return undefined;
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
          const normalized = css.startsWith(BOM) ? css.slice(1) : css;
          const hasStatement = normalized
            .trimStart()
            .startsWith(LAYER_ORDER_STATEMENT);
          if (hasStatement) {
            continue;
          }
          file.source = `${LAYER_ORDER_STATEMENT}\n${css}`;
        }
      },
    },
    {
      name: 'vite-plugin-css-layer-scss',
      transform(code, id) {
        const file = getStyleFile(id);
        const matched = file
          ? matchers.find((m) => m.scssRegex.test(file))
          : undefined;
        if (matched) {
          return { code: wrapInLayer(matched.layerName, code), map: null };
        }
        return undefined;
      },
    },
    {
      name: 'vite-plugin-css-layer-order',
      enforce: 'post',
      transformIndexHtml: {
        order: 'post',
        handler: injectCssLayerOrder,
      },
    },
  ];
}

export { THIRD_PARTY_CSS_LAYER_RULES };
