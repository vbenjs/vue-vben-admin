import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi-light:cart',
      order: 3,
      title: $t('inbound.title'),
    },
    name: 'Inbound',
    path: '/inbound',
    children: [
      {
        name: 'Purchase',
        path: '/inbound/purchase',
        component: () => import('#/views/inbound/purchase/index.vue'),
        meta: {
          title: $t('inbound.purchase'),
          keepAlive: true,
        },
      },
      {
        name: 'PurchaseList',
        path: '/inbound/purchaseList',
        component: () => import('#/views/inbound/purchaseList/index.vue'),
        meta: {
          title: $t('inbound.purchaseList'),
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
