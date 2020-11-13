import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: '编辑器',
    path: '/editor',
    children: [
      {
        path: 'markdown',
        name: 'markdown编辑器',
      },
      {
        path: 'tinymce',
        name: '富文本',
        children: [
          {
            path: 'index',
            name: '基础使用',
          },
          {
            path: 'editor',
            name: '嵌入form使用',
          },
        ],
      },
    ],
  },
};
export default menu;
