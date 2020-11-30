import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: '异常页',
    path: '/exception',
    children: [
      {
        path: '404',
        name: '404',
      },
      {
        path: '500',
        name: '500',
      },
      {
        path: 'net-work-error',
        name: '网络错误',
      },
      {
        path: 'page-time-out',
        name: '页面超时',
      },
      {
        path: 'not-data',
        name: '无数据',
      },
    ],
  },
};
export default menu;
