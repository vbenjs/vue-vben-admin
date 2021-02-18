import windiCSS from 'vite-plugin-windicss';

import type { Plugin } from 'vite';

export function configWindiCssPlugin(): Plugin[] {
  return windiCSS({
    safelist: 'shadow shadow-xl',
    preflight: {
      enableAll: true,
    },
  });
}
