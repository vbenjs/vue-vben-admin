import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        path: '/workbench',
        name: '工作台',
      },
      {
        path: '/welcome',
        name: '首页',
      },
    ],
  },
};
export default menu;
