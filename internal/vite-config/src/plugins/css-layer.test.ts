import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findMonorepoRoot } from '@vben/node-utils';

import { describe, expect, it } from 'vitest';

import { LAYER_ORDER_STATEMENT, viteCssLayerPlugin } from './css-layer';

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

describe('viteCssLayerPlugin', () => {
  it('wraps matching css modules in the target layer', () => {
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const transform = plugin.transform;

    if (typeof transform !== 'function') return;

    const result = transform.call(
      undefined as never,
      '.el-button { color: red; }',
      '/node_modules/element-plus/es/components/button/style/css/index.css?used',
    );

    expect(result).toEqual({
      code: '@layer el {\n.el-button { color: red; }\n}',
      map: null,
    });
  });

  it('does not wrap css modules outside the target package', () => {
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const transform = plugin.transform;

    if (typeof transform !== 'function') return;

    const result = transform.call(
      undefined as never,
      '.local { color: red; }',
      '/src/views/home/index.css',
    );

    expect(result).toBeUndefined();
  });

  it('injects the layer order statement into matching css assets', async () => {
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const generateBundle = plugin.generateBundle;

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

  it('does not inject the statement twice when already present', async () => {
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const generateBundle = plugin.generateBundle;

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
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const generateBundle = plugin.generateBundle;

    if (typeof generateBundle !== 'function') return;

    const bundle = createBundle([
      {
        fileName: 'element-x.css',
        source: `\uFEFF@layer el{.el-button{color:red}}`,
        type: 'asset',
      },
    ]);

    await callGenerateBundle(generateBundle, bundle);

    expect(bundle['element-x.css']?.source).toBe(
      `${LAYER_ORDER_STATEMENT}\n\uFEFF@layer el{.el-button{color:red}}`,
    );
  });

  it('ignores non-css assets', async () => {
    const plugin = viteCssLayerPlugin({
      layerName: 'el',
      packageName: 'element-plus',
    });
    const generateBundle = plugin.generateBundle;

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
