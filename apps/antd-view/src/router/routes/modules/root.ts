import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '@/layouts';

const rootRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      hideChildrenInMenu: true,
      title: '首页',
    },
    name: 'Home',
    path: '/',
    redirect: '/welcome',
    children: [
      {
        name: 'Welcome',
        path: '/welcome',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          affixTab: true,
          title: 'Welcome',
        },
      },
    ],
  },
];

export { rootRoutes };
