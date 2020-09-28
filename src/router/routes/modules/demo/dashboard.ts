import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/dashboard',
    name: 'Dashboard',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/dashboard/welcome',
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
        title: '欢迎页',
        affix: true,
      },
    },
  ],
} as AppRouteModule;
