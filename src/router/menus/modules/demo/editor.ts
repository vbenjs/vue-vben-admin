import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: 'routes.demo.editor.editor',
    path: '/editor',
    children: [
      {
        path: 'markdown',
        name: 'routes.demo.editor.markdown',
      },
      {
        path: 'tinymce',
        name: 'routes.demo.editor.tinymce',
        children: [
          {
            path: 'index',
            name: 'routes.demo.editor.tinymceBasic',
          },
          {
            path: 'editor',
            name: 'routes.demo.editor.tinymceForm',
          },
        ],
      },
    ],
  },
};
export default menu;
