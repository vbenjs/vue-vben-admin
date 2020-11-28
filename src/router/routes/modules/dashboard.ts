import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  layout: {
    path: '/dashboard',
    name: 'Dashboard',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/dashboard/welcome',
    meta: {
      icon: 'ant-design:home-outlined',
      title: 'routes.dashboard.dashboard',
    },
  },

  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('/@/views/dashboard/welcome/index.vue'),
      meta: {
        title: 'routes.dashboard.welcome',
        affix: true,
        icon: 'ant-design:home-outlined',
      },
    },
    {
      path: '/workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: 'routes.dashboard.workbench',
      },
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        title: 'routes.dashboard.analysis',
      },
    },
  ],
};

export default dashboard;
