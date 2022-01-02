/**
 * @see https://github.com/antfu/unplugin-auto-import
 */
import type { Plugin } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'

export const configAutoImport = (): Plugin | Plugin[] => {
  return [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'typings/auto-imports.d.ts',
    }),
  ]
}
