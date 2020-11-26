import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 50,
  menu: {
    path: '/tree',
    name: 'routes.demo.tree.tree',
    children: [
      {
        path: 'basic',
        name: 'routes.demo.tree.basic',
      },
      {
        path: 'editTree',
        name: 'routes.demo.tree.editTree',
      },
      {
        path: 'actionTree',
        name: 'routes.demo.tree.actionTree',
      },
    ],
  },
};
export default menu;
