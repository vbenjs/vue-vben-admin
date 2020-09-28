import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 20,
  menu: {
    name: '权限管理',
    path: '/permission',
    children: [
      {
        path: '/front',
        name: '基于前端',
        children: [
          {
            path: '/page',
            name: '页面权限',
          },
          {
            path: '/btn',
            name: '按钮权限',
          },
          {
            path: '/auth-pageA',
            name: '权限测试页A',
          },
          {
            path: '/auth-pageB',
            name: '权限测试页B',
          },
        ],
      },
      {
        path: '/back',
        name: '基于后台',
        children: [
          {
            path: '/page',
            name: '页面权限',
          },
          {
            path: '/btn',
            name: '按钮权限',
          },
        ],
      },
    ],
  },
};
export default menu;
