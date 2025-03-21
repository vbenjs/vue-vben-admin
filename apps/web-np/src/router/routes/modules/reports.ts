import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lsicon:column-line-outline',
      keepAlive: true,
      order: 1000,
      title: $t('reports.title'),
    },
    name: 'reports',
    path: '/reports',
    children: [
      {
        meta: {
          title: $t('reports.order.title'),
          icon: 'fluent-mdl2:reservation-orders',
        },
        name: 'reports.order',
        path: '/reports/order',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'P&L Report',
          icon: 'clarity:analytics-outline-badged',
        },
        name: 'PAndLReport',
        path: '/reports/p-and-l-report',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Product Analytics',
          icon: 'lsicon:goods-outline',
        },
        name: 'ProductAnalytics',
        path: '/reports/product-analytics',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Customer Analytics',
          icon: 'carbon:customer',
        },
        name: 'CustomerAnalytics',
        path: '/reports/customer-analytics',
        component: () => import('#/views/reports/order/index.vue'),
      },
    ],
  },
];

export default routes;
