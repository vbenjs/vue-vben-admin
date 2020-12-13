import { createMockServer } from 'vite-plugin-mock';
import type { Plugin } from 'vite';
import { isDevFn, ViteEnv } from '../../utils';

export function setupMockPlugin(plugins: Plugin[], env: ViteEnv) {
  const { VITE_USE_MOCK } = env;
  const mockPlugin = createMockServer({
    ignore: /^\_/,
    mockPath: 'mock',
    showTime: true,
  });
  if (isDevFn() && VITE_USE_MOCK) {
    plugins.push(mockPlugin);
  }
  return plugins;
}
