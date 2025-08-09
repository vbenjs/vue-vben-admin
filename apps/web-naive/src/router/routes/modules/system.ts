import type {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '后台管理',
    },
    name: 'Systme',
    path: '/system',
    children: [
      {
        meta: {
          title: '用户管理',
        },
        name: 'SystemUser',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
      },
      {
        meta: {
          title: '身份管理',
        },
        name: 'SystemRole',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
      },
    ],
  },
];

export default routes;
