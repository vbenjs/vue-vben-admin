/**
 * @see https://github.com/antfu/unplugin-auto-import
 */
import type { Plugin } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'

export function configAutoImport(): Plugin | Plugin[] {
  const plugins: Plugin[] = [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'typings/auto-imports.d.ts',
    }),
  ]

  return plugins
}
