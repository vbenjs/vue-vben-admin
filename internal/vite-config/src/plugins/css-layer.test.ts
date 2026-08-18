import { describe, expect, it } from 'vitest';

import { viteCssLayerPlugin } from './css-layer';

interface FakeAsset {
  fileName: string;
  source: string;
  type: string;
}

function createBundle(assets: FakeAsset[]) {
  return Object.fromEntries(assets.map((asset) => [asset.fileName, asset]));
}

const LAYER_ORDER_STATEMENT =
  '@layer properties, theme, base, ant, antd, el, td, components, utilities;';

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

  it('injects the layer order statement into matching css assets', () => {
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

    generateBundle.call(undefined as never, {} as never, bundle);

    expect(bundle['element-x.css'].source).toBe(
      `${LAYER_ORDER_STATEMENT}\n@layer el{.el-button{color:red}}`,
    );
    expect(bundle['theme-x.css'].source).toBe('.local { color: blue; }');
  });

  it('does not inject the statement twice when already present', () => {
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

    generateBundle.call(undefined as never, {} as never, bundle);

    expect(bundle['element-x.css'].source).toBe(
      `${LAYER_ORDER_STATEMENT}\n@layer el{.el-button{color:red}}`,
    );
  });

  it('injects the statement even when the asset starts with a BOM', () => {
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

    generateBundle.call(undefined as never, {} as never, bundle);

    expect(bundle['element-x.css'].source).toBe(
      `${LAYER_ORDER_STATEMENT}\n\uFEFF@layer el{.el-button{color:red}}`,
    );
  });

  it('ignores non-css assets', () => {
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

    generateBundle.call(undefined as never, {} as never, bundle);

    expect(bundle['element-x.js'].source).toBe(
      '@layer el{.el-button{color:red}}',
    );
  });
});
