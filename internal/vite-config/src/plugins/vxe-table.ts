import type { Plugin } from 'vite';

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';

function viteVxeTableImportsPlugin(): Plugin {
  return lazyImport({
    resolvers: [
      VxeResolver({
        libraryName: 'vxe-table',
      }),
      VxeResolver({
        libraryName: 'vxe-pc-ui',
      }),
    ],
  });
}

export { viteVxeTableImportsPlugin };
