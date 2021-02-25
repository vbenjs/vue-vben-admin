import type { Plugin } from 'vite';

import windiCSS from 'vite-plugin-windicss';

export function configWindiCssPlugin(): Plugin[] {
  return windiCSS({
    safelist: 'no-select',
    preflight: {
      enableAll: true,
    },
  });
}
