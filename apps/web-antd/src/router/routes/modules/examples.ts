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
          icon: 'lucide:navigation',
          title: '密码强度组件',
        },
      },
    ],
  },
];

export default routes;
