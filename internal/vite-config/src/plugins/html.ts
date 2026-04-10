import type { Options as HtmlMinifierOptions } from 'html-minifier-terser';
import type { PluginOption } from 'vite';

import { minify } from 'html-minifier-terser';

const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
} as const;

function viteHtmlPlugin(options: HtmlMinifierOptions = {}): PluginOption {
  return {
    name: 'vben-native-html',
    transformIndexHtml: {
      order: 'post',
      async handler(html, ctx) {
        if (!ctx.bundle) {
          return html;
        }
        return await minify(html, {
          ...HTML_MINIFY_OPTIONS,
          ...options,
        });
      },
    },
  };
}

export { viteHtmlPlugin };
