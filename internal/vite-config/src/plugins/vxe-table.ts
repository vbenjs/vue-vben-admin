import type { Plugin } from 'vite';

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';

async function viteVxeTableImportsPlugin(): Promise<Plugin> {
  // vite-plugin-lazy-import 未声明 vite peer，其类型里的 `import 'vite'` 从仓库
  // 根解析到 vite 8.3.0，而本包解析到 8.2.2；两份 Plugin 结构比较会展开到栈深
  // 超限（TS2321）。运行时产物就是标准 vite 插件，在边界经 unknown 显式中转。
  const vxeImportsPlugin = lazyImport({
    resolvers: [
      VxeResolver({
        libraryName: 'vxe-table',
      }),
      VxeResolver({
        libraryName: 'vxe-pc-ui',
      }),
    ],
  }) as unknown as Plugin;

  return vxeImportsPlugin;
}

export { viteVxeTableImportsPlugin };
