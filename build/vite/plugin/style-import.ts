import styleImport from 'vite-plugin-style-import';

export function configStyleImportConfig() {
  const pwaPlugin = styleImport({
    libs: [
      {
        libraryName: 'ant-design-vue',
        resolveStyle: (name) => {
          // ! col row popconfirm These three components have no corresponding css files after packaging. Need special treatment

          if (['col', 'row'].includes(name)) {
            return 'ant-design-vue/lib/grid/style/index.css';
          }

          if (['popconfirm'].includes(name)) {
            return [
              'ant-design-vue/lib/popover/style/index.css',
              'ant-design-vue/lib/button/style/index.css',
            ];
          }
          return `ant-design-vue/lib/${name}/style/index.css`;
        },
      },
    ],
  });
  return pwaPlugin;
}
