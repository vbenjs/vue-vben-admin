import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/welcome',
  meta: {
    icon: 'ant-design:home-outlined',
    title: 'routes.dashboard.welcome',
  },
  children: [
    {
      path: 'welcome',
      name: 'Welcome',
      component: () => import('/@/views/dashboard/welcome/index.vue'),
      meta: {
        title: 'routes.dashboard.welcome',
        affix: true,
        icon: 'ant-design:home-outlined',
      },
    },
  ],
};

export default dashboard;
