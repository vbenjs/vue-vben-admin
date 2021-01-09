import dynamicImport from 'vite-plugin-import-context';
import type { ViteEnv } from '../../utils';
import type { Plugin } from 'vite';

export function configDynamicImport(env: ViteEnv) {
  const { VITE_DYNAMIC_IMPORT } = env;
  const dynamicImportPlugin: Plugin = dynamicImport({
    include: ['**/*.ts'],
    autoImportRoute: VITE_DYNAMIC_IMPORT,
  });
  return dynamicImportPlugin;
}
