import { viteMockServe } from 'vite-plugin-mock';
import { ViteEnv } from '../../utils';

export function configMockPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK } = env;

  const useLocalMock = !isBuild && VITE_USE_MOCK;
  const useProdMock = isBuild && VITE_USE_MOCK;

  if (useLocalMock || useProdMock) {
    const mockPlugin = viteMockServe({
      ignore: /^\_/,
      mockPath: 'mock',
      showTime: true,
      localEnabled: useLocalMock,
      prodEnabled: useProdMock,
      injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
    });
    return mockPlugin;
  }
  return [];
}
