import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 50,
  menu: {
    path: '/tree',
    name: 'Tree',
    children: [
      {
        path: 'basic',
        name: '基础示例',
      },
      {
        path: 'editTree',
        name: '右键示例',
      },
      {
        path: 'actionTree',
        name: '函数操作示例',
      },
    ],
  },
};
export default menu;
