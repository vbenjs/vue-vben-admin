import type { RouteRecordRaw } from 'vue-router';

import { DefaultRoutes } from '#/constants';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -100,
      title: 'Onboard',
      hideInMenu: true,
      noBasicLayout: true,
    },
    name: 'Onboard',
    path: DefaultRoutes.ONBOARS,
    component: () => import('#/views/onboard/index.vue'),
  },
];

export default routes;
