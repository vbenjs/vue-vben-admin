import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ion:layers-outline',
      keepAlive: true,
      order: 1000,
      title: $t('page.examples.title'),
    },
    name: 'Examples',
    path: '/examples',
    children: [
      {
        name: 'EllipsisDemo',
        path: 'ellipsis',
        component: () => import('#/views/examples/ellipsis/index.vue'),
        meta: {
          title: $t('page.examples.ellipsis.title'),
        },
      },
      {
        name: 'FullScreenDemo',
        path: 'full-screen',
        component: () => import('#/views/examples/full-screen/index.vue'),
        meta: {
          title: $t('page.examples.fullScreen.title'),
        },
      },
    ],
  },
];

export default routes;
