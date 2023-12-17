/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { createHtmlPlugin } from '@vben/vite-plugin-html';
import type { PluginOption } from 'vite';

export function configHtmlPlugin({ isBuild }: { isBuild: boolean }) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
  });
  return htmlPlugin;
}
