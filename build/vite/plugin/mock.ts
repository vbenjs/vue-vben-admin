import { createMockServer } from 'vite-plugin-mock';
import type { Plugin } from 'vite';
import { isDevFn, ViteEnv } from '../../utils';

export function setupMockPlugin(
  plugins: Plugin[],
  env: ViteEnv,
  mode: 'development' | 'production'
) {
  const { VITE_USE_MOCK } = env;

  const useMock = isDevFn(mode) && VITE_USE_MOCK;

  if (useMock) {
    const mockPlugin = createMockServer({
      ignore: /^\_/,
      mockPath: 'mock',
      showTime: true,
      localEnabled: useMock,
    });
    plugins.push(mockPlugin);
  }
  return plugins;
}
