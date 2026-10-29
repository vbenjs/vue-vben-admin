import type { Plugin } from 'vite';

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';

function viteVxeTableImportsPlugin(): Plugin {
  // 曾因仓库内两份 vite 实例（根 8.3.0 / 本包 lockfile 漂移到 8.2.2）导致
  // Plugin 结构比较栈深超限（TS2321），需经 unknown 中转；现已对齐单一
  // vite 8.3.0 实例，可直接返回。
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
