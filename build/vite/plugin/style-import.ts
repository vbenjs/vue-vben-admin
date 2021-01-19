import styleImport from 'vite-plugin-style-import';

export function configStyleImportConfig() {
  const pwaPlugin = styleImport({
    libs: [
      {
        libraryName: 'ant-design-vue',
        esModule: true,
        resolveStyle: (name) => {
          return `ant-design-vue/es/${name}/style/css`;
        },
      },
    ],
  });
  return pwaPlugin;
}
