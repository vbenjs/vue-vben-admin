/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin({ enable }: { enable: boolean }) {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    enable,
  });
}
