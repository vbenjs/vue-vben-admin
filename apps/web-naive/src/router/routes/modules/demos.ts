import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('page.demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          icon: 'mdi:shield-key-outline',
          title: $t('page.demos.naive'),
        },
        name: 'NaiveDemos',
        path: '/demos/naive',
        component: () => import('#/views/demos/naive/index.vue'),
      },
    ],
  },
];

export default routes;
