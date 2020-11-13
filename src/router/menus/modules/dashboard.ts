import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: 'Dashboard',
    path: '/dashboard',
    // tag: {
    //   dot: true,
    // },
    children: [
      {
        path: '/workbench',
        name: '工作台',
        // tag: {
        //   content: 'new',
        // },
      },
      {
        path: '/analysis',
        name: '分析页',
      },
      {
        path: '/welcome',
        name: '首页',
      },
    ],
  },
};
export default menu;
