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
        name: 'BreadcrumbLateralDemo',
        path: '/examples/strength-meter',
        component: () => import('#/views/examples/strength-meter/index.vue'),
        meta: {
          title: $t('page.examples.strengthMeter.title'),
        },
      },
    ],
  },
];

export default routes;
