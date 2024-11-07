import type { PluginOption } from 'vite';

import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';

async function viteVxeTableImportsPlugin(): Promise<PluginOption> {
  return [
    // {
    //   config() {
    //     return {
    //       optimizeDeps: {
    //         include: [
    //           'vxe-pc-ui/es/vxe-button/index.js',
    //           'vxe-pc-ui/es/vxe-checkbox/index.js',
    //           'vxe-pc-ui/es/vxe-icon/index.js',
    //           'vxe-pc-ui/es/vxe-input/index.js',
    //           'vxe-pc-ui/es/vxe-loading/index.js',
    //           'vxe-pc-ui/es/vxe-modal/index.js',
    //           'vxe-pc-ui/es/vxe-pager/index.js',
    //           'vxe-pc-ui/es/vxe-radio-group/index.js',
    //           'vxe-pc-ui/es/vxe-select/index.js',
    //           'vxe-pc-ui/es/vxe-tooltip/index.js',
    //           'vxe-pc-ui/es/vxe-ui/index.js',
    //           'vxe-pc-ui/es/vxe-upload/index.js',
    //           'vxe-table/es/vxe-colgroup/index.js',
    //           'vxe-table/es/vxe-column/index.js',
    //           'vxe-table/es/vxe-grid/index.js',
    //           'vxe-table/es/vxe-table/index.js',
    //           'vxe-table/es/vxe-toolbar/index.js',
    //           'vxe-table/es/vxe-ui/index.js',
    //         ],
    //       },
    //     };
    //   },
    //   name: 'vxe-table-adapter',
    // },
    lazyImport({
      resolvers: [
        VxeResolver({
          libraryName: 'vxe-table',
        }),
        VxeResolver({
          libraryName: 'vxe-pc-ui',
        }),
      ],
    }),
  ];
}

export { viteVxeTableImportsPlugin };
