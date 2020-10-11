import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/dashboard',
    name: 'Dashboard',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/dashboard/workbench',
    meta: {
      icon: 'ant-design:home-outlined',
      title: 'Dashboard',
    },
  },

  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('/@/views/dashboard/welcome/index.vue'),
      meta: {
        title: '首页',
      },
    },
    {
      path: '/workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: '工作台',
        affix: true,
      },
    },
  ],
} as AppRouteModule;
