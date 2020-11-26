import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 15,
  menu: {
    name: 'routes.demo.permission.permission',
    path: '/permission',
    children: [
      {
        path: 'front',
        name: 'routes.demo.permission.front',
        children: [
          {
            path: 'page',
            name: 'routes.demo.permission.frontPage',
          },
          {
            path: 'btn',
            name: 'routes.demo.permission.frontBtn',
          },
          {
            path: 'auth-pageA',
            name: 'routes.demo.permission.frontTestA',
          },
          {
            path: 'auth-pageB',
            name: 'routes.demo.permission.frontTestB',
          },
        ],
      },
      {
        path: 'back',
        name: 'routes.demo.permission.back',
        children: [
          {
            path: 'page',
            name: 'routes.demo.permission.backPage',
          },
          {
            path: 'btn',
            name: 'routes.demo.permission.backBtn',
          },
        ],
      },
    ],
  },
};
export default menu;
