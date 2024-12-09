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
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.elementPlus'),
        },
        name: 'NaiveDemos',
        path: '/demos/element',
        component: () => import('#/views/demos/element/index.vue'),
      },
      {
        meta: {
          title: $t('demos.form'),
        },
        name: 'BasicForm',
        path: '/demos/form',
        component: () => import('#/views/demos/form/basic.vue'),
      },
    ],
  },
];

export default routes;
