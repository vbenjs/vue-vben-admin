import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: '编辑器',
    path: '/editor',
    children: [
      {
        path: '/markdown',
        name: 'markdown编辑器',
      },
    ],
  },
};
export default menu;
