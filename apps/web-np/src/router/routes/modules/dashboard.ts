import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';
import { DefaultRoutes } from '#/shared/constants';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'carbon:dashboard',
      order: -1,
      title: $t('page.dashboard.title'),
      hideChildrenInMenu: true,
    },
    name: 'dashboard',
    path: DefaultRoutes.HOME,
    children: [
      {
        name: 'dashboard.main',
        path: '',
        component: () => import('#/views/dashboard/index.vue'),
        meta: {
          title: $t('page.dashboard.title'),
        },
      },
      {
        name: 'dashboard.pricing',
        path: DefaultRoutes.PRICING,
        component: () => import('#/views/dashboard/index.vue'),
        meta: {
          activePath: DefaultRoutes.HOME,
          title: $t('page.dashboard.title'),
        },
      },
    ],
  },
];

export default routes;
