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
          // 这里是“子组件”样式引入替换列表，单独引入子组件时需引入组件样式，否则会在打包后导致子组件样式丢失
          const replaceList = {
            'typography-text': 'typography',
            'typography-title': 'typography',
            'typography-paragraph': 'typography',
            'typography-link': 'typography',
            'anchor-link': 'anchor',
            'sub-menu': 'menu',
            'menu-item': 'menu',
            'menu-item-group': 'menu',
            'dropdown-button': 'dropdown',
            'breadcrumb-item': 'breadcrumb',
            'breadcrumb-separator': 'breadcrumb',
            'input-password': 'input',
            'input-search': 'input',
            'input-group': 'input',
            'form-item': 'form',
            'radio-group': 'radio',
            'checkbox-group': 'checkbox',
            'layout-sider': 'layout',
            'layout-content': 'layout',
            'layout-footer': 'layout',
            'layout-header': 'layout',
            step: 'steps',
            'select-option': 'select',
            'select-opt-group': 'select',
            'card-grid': 'card',
            'card-meta': 'card',
            'collapse-panel': 'collapse',
            'descriptions-item': 'descriptions',
            'list-item': 'list',
            'list-item-meta': 'list',
            'table-column': 'table',
            'table-column-group': 'table',
            'tab-pane': 'tabs',
            'tab-content': 'tabs',
            'timeline-item': 'timeline',
            'tree-node': 'tree',
            'skeleton-input': 'skeleton',
            'skeleton-avatar': 'skeleton',
            'skeleton-title': 'skeleton',
            'skeleton-paragraph': 'skeleton',
            'skeleton-image': 'skeleton',
            'skeleton-button': 'skeleton',
            'month-picker': 'date-picker',
          };

          return replaceList.hasOwnProperty(name)
            ? `ant-design-vue/es/${replaceList[name]}/style/index`
            : `ant-design-vue/es/${name}/style/index`;
        },
      },
    ],
  });
  return styleImportPlugin;
}
