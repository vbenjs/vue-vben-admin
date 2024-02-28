import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const dashboard: AppRouteModule = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/index',
  meta: {
    orderNo: 1,
    icon: 'material-symbols:home-outline-rounded',
    title: '首页',
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'HomeIndex',
      component: () => import('@/views/dashboard/home/home.vue'),
      meta: {
        // icon: 'ic:round-add-chart',
        title: '首页',
      },
    },
  ],
};

export default dashboard;
