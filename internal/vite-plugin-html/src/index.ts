import consola from 'consola';
import type { PluginOption } from 'vite';

import { createPlugin } from './htmlPlugin';
import { createMinifyHtmlPlugin } from './minifyHtml';
import type { UserOptions } from './typing';

consola.wrapConsole();

export function createHtmlPlugin(userOptions: UserOptions = {}): PluginOption[] {
  return [createPlugin(userOptions), createMinifyHtmlPlugin(userOptions)];
}
