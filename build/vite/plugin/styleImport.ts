/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */
import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild: boolean) {
  if (!isBuild) {
    return [];
  }
  const styleImportPlugin = styleImport({
    libs: [
      {
        libraryName: 'ant-design-vue',
        esModule: true,
        resolveStyle: (name) => {
          // 这里是“子组件”列表，无需额外引入样式文件
          const ignoreList = [
            'typography-text',
            'typography-title',
            'typography-paragraph',
            'typography-link',
            'anchor-link',
            'sub-menu',
            'menu-item',
            'menu-item-group',
            'dropdown-button',
            'breadcrumb-item',
            'breadcrumb-separator',
            'input-password',
            'input-search',
            'input-group',
            'form-item',
            'radio-group',
            'checkbox-group',
            'layout-sider',
            'layout-content',
            'layout-footer',
            'layout-header',
            'step',
            'select-option',
            'select-opt-group',
            'card-grid',
            'card-meta',
            'collapse-panel',
            'descriptions-item',
            'list-item',
            'list-item-meta',
            'table-column',
            'table-column-group',
            'tab-pane',
            'tab-content',
            'timeline-item',
            'tree-node',
            'skeleton-input',
            'skeleton-avatar',
            'skeleton-title',
            'skeleton-paragraph',
            'skeleton-image',
            'skeleton-button',
          ];
          return ignoreList.includes(name) ? '' : `ant-design-vue/es/${name}/style/index`;
        },
      },
    ],
  });
  return styleImportPlugin;
}
