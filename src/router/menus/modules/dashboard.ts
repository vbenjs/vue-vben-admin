import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: 'routes.dashboard.dashboard',
    path: '/dashboard',
    children: [
      {
        path: '/workbench',
        name: 'routes.dashboard.workbench',
      },
      {
        path: '/analysis',
        name: 'routes.dashboard.analysis',
      },
    ],
  },
};
export default menu;
