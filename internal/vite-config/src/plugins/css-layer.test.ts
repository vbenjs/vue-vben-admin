import type { Plugin } from 'vite';

import { readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findMonorepoRoot } from '@vben/node-utils';

import { build } from 'vite';
import { describe, expect, it } from 'vitest';

import {
  injectCssLayerOrder,
  LAYER_ORDER_STATEMENT,
  THIRD_PARTY_CSS_LAYER_RULES,
  viteCssLayerPlugin,
} from './css-layer';
import { viteHtmlPlugin } from './html';

/** 文件头 BOM。以转义序列书写，避免源码里出现不可见字符。 */
const BOM = '\uFEFF';

interface FakeAsset {
  fileName: string;
  source: string;
  type: string;
}

function createBundle(assets: FakeAsset[]) {
  return Object.fromEntries(assets.map((asset) => [asset.fileName, asset]));
}

/**
 * 以 rolldown 的 generateBundle 签名（this/outputOptions/bundle/isWrite 四参）
 * 调用插件钩子；测试不需要真实的 PluginContext 与 outputOptions。
 */
async function callGenerateBundle(
  hook: (outputOptions: never, bundle: never, isWrite: boolean) => unknown,
  bundle: object,
) {
  await hook.call(undefined as never, {} as never, bundle as never, false);
}

function callTransform(plugin: Plugin, code: string, id: string) {
  const { transform } = plugin;
  if (typeof transform !== 'function') {
    throw new TypeError('transform hook is missing');
  }
  return transform.call(undefined as never, code, id);
}

describe('viteCssLayerPlugin', () => {
  const [maybeCssPlugin, maybeScssPlugin, maybeOrderPlugin] =
    viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
  const [maybeThirdCssPlugin, maybeThirdScssPlugin] = viteCssLayerPlugin(
    THIRD_PARTY_CSS_LAYER_RULES,
  );
  if (
    !maybeCssPlugin ||
    !maybeScssPlugin ||
    !maybeOrderPlugin ||
    !maybeThirdCssPlugin ||
    !maybeThirdScssPlugin
  ) {
    throw new Error('viteCssLayerPlugin should return three plugin instances');
  }
  const cssPlugin = maybeCssPlugin;
  const scssPlugin = maybeScssPlugin;
  const orderPlugin = maybeOrderPlugin;
  const thirdCssPlugin = maybeThirdCssPlugin;
  const thirdScssPlugin = maybeThirdScssPlugin;

  it('places CSS transforms and HTML injection in their required phases', () => {
    expect(cssPlugin.name).toBe('vite-plugin-css-layer');
    expect(cssPlugin.enforce).toBe('pre');
    expect(scssPlugin.name).toBe('vite-plugin-css-layer-scss');
    // scss 插件必须在 normal 位（无 enforce）：enforce 'post' 会被
    // vite:css-post 抢先消费 css（dev 输出 JS 包装、build 返回空串），
    // 永远拿不到编译后的文本
    expect(scssPlugin.enforce).toBeUndefined();
    // 层序声明只由 css 插件注入，避免两实例重复处理同一产物
    expect(scssPlugin.generateBundle).toBeUndefined();
    expect(typeof cssPlugin.generateBundle).toBe('function');
    expect(orderPlugin.enforce).toBe('post');
    expect(orderPlugin.transformIndexHtml).toEqual({
      order: 'post',
      handler: injectCssLayerOrder,
    });
  });

  it('wraps matching css modules in the target layer', () => {
    const result = callTransform(
      cssPlugin,
      '.el-button { color: red; }',
      '/node_modules/element-plus/es/components/button/style/css/index.css?used',
    );

    expect(result).toEqual({
      code: '@layer el {\n.el-button { color: red; }\n}',
      map: null,
    });
  });

  it('strips a leading @charset before wrapping', () => {
    // vxe-table 等包的 es/**/style.css 首行就是 @charset，
    // 包进 @layer 会成为无效语句，须先剥除
    const result = callTransform(
      cssPlugin,
      '@charset "UTF-8";\n.el-button { color: red; }',
      '/node_modules/element-plus/es/components/button/style/index.css',
    );

    expect(result).toEqual({
      code: '@layer el {\n.el-button { color: red; }\n}',
      map: null,
    });
  });

  it('does not wrap css modules outside the target package', () => {
    expect(
      callTransform(
        cssPlugin,
        '.local { color: red; }',
        '/src/views/home/index.css',
      ),
    ).toBeUndefined();
  });

  it.each([
    '/packages/effects/plugins/src/vxe-table/style.css',
    '/src/vxe-table/styles/cssvar.scss',
    '/node_modules/custom-vxe-table/style.css',
  ])('keeps local and similarly named package styles outside vxe: %s', (id) => {
    expect(callTransform(thirdCssPlugin, '.local{}', id)).toBeUndefined();
    expect(callTransform(thirdScssPlugin, '.local{}', id)).toBeUndefined();
  });

  it.each(['raw', 'url', 'worker', 'sharedworker', 'used&raw', 'url=true'])(
    'preserves JavaScript asset modules with query %s',
    (query) => {
      const code = 'export default "asset";';
      expect(
        callTransform(
          thirdCssPlugin,
          code,
          `/node_modules/vxe-table/es/table/style.css?${query}`,
        ),
      ).toBeUndefined();
      expect(
        callTransform(
          thirdScssPlugin,
          code,
          `/node_modules/vxe-table/styles/cssvar.scss?${query}`,
        ),
      ).toBeUndefined();
    },
  );

  it.each([
    '/node_modules/.pnpm/vxe-table@4/node_modules/vxe-table/es/table/style.css',
    String.raw`C:\project\node_modules\vxe-table\es\table\style.css`,
    '/node_modules/vxe-table/es/table/style.css?inline',
  ])(
    'wraps package styles across package layouts and CSS queries: %s',
    (id) => {
      expect(callTransform(thirdCssPlugin, '.vxe-table{}', id)).toEqual({
        code: '@layer vxe {\n.vxe-table{}\n}',
        map: null,
      });
    },
  );

  it('keeps the css plugin away from sass/scss modules', () => {
    expect(
      callTransform(
        cssPlugin,
        '.el-button { color: red; }',
        '/node_modules/element-plus/theme/index.scss',
      ),
    ).toBeUndefined();
  });

  it('wraps compiled scss output in the scss plugin', () => {
    const result = callTransform(
      thirdScssPlugin,
      '.vxe-table { color: red; }',
      '/node_modules/vxe-table/styles/cssvar.scss?v=123',
    );

    expect(result).toEqual({
      code: '@layer vxe {\n.vxe-table { color: red; }\n}',
      map: null,
    });
  });

  it('strips a leading @charset in scss wrapping too', () => {
    const result = callTransform(
      thirdScssPlugin,
      '@charset "UTF-8";\n:root { --vxe-version: 4; }',
      '/node_modules/vxe-pc-ui/styles/cssvar.scss',
    );

    expect(result).toEqual({
      code: '@layer vxe {\n:root { --vxe-version: 4; }\n}',
      map: null,
    });
  });

  it('keeps the scss plugin away from css modules and covers .sass', () => {
    expect(
      callTransform(
        thirdScssPlugin,
        '.vxe-table { color: red; }',
        '/node_modules/vxe-table/es/table/style.css',
      ),
    ).toBeUndefined();
    expect(
      callTransform(
        thirdScssPlugin,
        '.a { color: red; }',
        '/node_modules/vxe-table/styles/legacy.sass',
      ),
    ).toEqual({
      code: '@layer vxe {\n.a { color: red; }\n}',
      map: null,
    });
  });

  it('maps every third-party rule to its layer', () => {
    expect(
      callTransform(
        thirdCssPlugin,
        '.vxe-table{}',
        '/node_modules/vxe-table/es/table/style.css',
      ),
    ).toEqual({ code: '@layer vxe {\n.vxe-table{}\n}', map: null });
    expect(
      callTransform(
        thirdCssPlugin,
        '.vxe-button{}',
        '/node_modules/vxe-pc-ui/es/button/style.css',
      ),
    ).toEqual({ code: '@layer vxe {\n.vxe-button{}\n}', map: null });
    expect(
      callTransform(
        thirdCssPlugin,
        '.tippy-box{}',
        '/node_modules/tippy.js/dist/tippy.css',
      ),
    ).toEqual({ code: '@layer lib {\n.tippy-box{}\n}', map: null });
    expect(
      callTransform(
        thirdCssPlugin,
        '.vjsv{}',
        '/node_modules/vue-json-pretty/lib/styles.css',
      ),
    ).toEqual({ code: '@layer lib {\n.vjsv{}\n}', map: null });
  });

  it('injects the layer order statement into matching css assets', async () => {
    const generateBundle = cssPlugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'element-x.css',
        source: '@layer el{.el-button{color:red}}',
        type: 'asset',
      },
      {
        fileName: 'theme-x.css',
        source: '.local { color: blue; }',
        type: 'asset',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['element-x.css']?.source).toBe(
      `${LAYER_ORDER_STATEMENT}\n@layer el{.el-button{color:red}}`,
    );
    expect(bundle['theme-x.css']?.source).toBe('.local { color: blue; }');
  });

  it('injects the statement into scss-derived layer assets too', async () => {
    const generateBundle = thirdCssPlugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'vxe-x.css',
        source: '@layer vxe{.vxe-table{color:red}}',
        type: 'asset',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['vxe-x.css']?.source).toBe(
      `${LAYER_ORDER_STATEMENT}\n@layer vxe{.vxe-table{color:red}}`,
    );
  });

  it('does not inject the statement twice when already present', async () => {
    const generateBundle = cssPlugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'element-x.css',
        source: `${LAYER_ORDER_STATEMENT}\n@layer el{.el-button{color:red}}`,
        type: 'asset',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['element-x.css']?.source).toBe(
      `${LAYER_ORDER_STATEMENT}\n@layer el{.el-button{color:red}}`,
    );
  });

  it('injects the statement even when the asset starts with a BOM', async () => {
    const generateBundle = cssPlugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'element-x.css',
        source: `${BOM}@layer el{.el-button{color:red}}`,
        type: 'asset',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['element-x.css']?.source).toBe(
      `${LAYER_ORDER_STATEMENT}\n${BOM}@layer el{.el-button{color:red}}`,
    );
  });

  it('ignores non-css assets', async () => {
    const generateBundle = cssPlugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'element-x.js',
        source: '@layer el{.el-button{color:red}}',
        type: 'chunk',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['element-x.js']?.source).toBe(
      '@layer el{.el-button{color:red}}',
    );
  });
});

describe('hTML layer order', () => {
  it('keeps one leading declaration after Vite and HTML minification', async () => {
    const root = await mkdtemp(join(tmpdir(), 'vben-css-layers-'));
    try {
      await writeFile(
        join(root, 'index.html'),
        '<html><head><link rel="stylesheet" href="/vendor.css"></head><body><script type="module">console.log("entry")</script></body></html>',
      );
      await writeFile(join(root, 'vendor.css'), '.vendor { padding: 12px; }');
      const result = await build({
        build: { write: false },
        configFile: false,
        logLevel: 'silent',
        plugins: [
          ...viteCssLayerPlugin(THIRD_PARTY_CSS_LAYER_RULES),
          ...viteCssLayerPlugin({
            layerName: 'el',
            packageName: 'element-plus',
          }),
          viteHtmlPlugin(),
        ],
        root,
      });
      if (!('output' in result)) {
        throw new Error('expected one Vite build output');
      }
      const htmlAsset = result.output.find(
        (asset) => asset.type === 'asset' && asset.fileName === 'index.html',
      );
      if (htmlAsset?.type !== 'asset') {
        throw new Error('expected the HTML build asset');
      }
      const html = htmlAsset.source.toString();
      expect(html).toContain(LAYER_ORDER_STATEMENT);
      expect(html.match(/data-vben-css-layer-order/g)).toHaveLength(1);
      expect(html.indexOf(LAYER_ORDER_STATEMENT)).toBeLessThan(
        html.indexOf('<link'),
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it('reserves layer order before existing styles and module scripts', () => {
    const html =
      '<html><head lang="en"><link rel="stylesheet" href="vendor.css"><script type="module" src="main.js"></script></head><body></body></html>';
    const injected = injectCssLayerOrder(html);

    expect(injected.indexOf(LAYER_ORDER_STATEMENT)).toBeGreaterThan(-1);
    expect(injected.indexOf(LAYER_ORDER_STATEMENT)).toBeLessThan(
      injected.indexOf('<link'),
    );
    expect(injectCssLayerOrder(injected)).toBe(injected);
  });
});

describe('layer order statement sync', () => {
  /**
   * theme.css 的层顺序声明与 css-layer.ts 的 LAYER_ORDER_STATEMENT 是同一
   * 事实的两份字面量(前者供开发期级联,后者在打包产物中兜底注入)。该测试
   * 保证二者永远一致:任何一侧改动而另一侧未同步时立即失败。
   */
  it('theme.css declares exactly the same layer order as LAYER_ORDER_STATEMENT', () => {
    const root = findMonorepoRoot(dirname(fileURLToPath(import.meta.url)));
    const css = readFileSync(
      join(root, 'internal/tailwind-config/src/theme.css'),
      'utf8',
    );
    // 取首个不含花括号的 @layer 纯声明(即层顺序声明;@layer 组件块带 {})
    const declared = css.match(/^@layer\s+[^;{}]+;/m)?.[0];

    expect(declared).toBeDefined();
    expect(declared).toBe(LAYER_ORDER_STATEMENT);
  });
});
