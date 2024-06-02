import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '@/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      hideChildrenInMenu: true,
      orderNo: -1,
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

export default routes;
