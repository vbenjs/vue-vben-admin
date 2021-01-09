import { viteMockServe } from 'vite-plugin-mock';
import { ViteEnv } from '../../utils';

export function configMockPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK } = env;

  const useMock = !isBuild && VITE_USE_MOCK;

  if (useMock) {
    const mockPlugin = viteMockServe({
      ignore: /^\_/,
      mockPath: 'mock',
      showTime: true,
      localEnabled: useMock,
    });
    return mockPlugin;
  }
  return [];
}
