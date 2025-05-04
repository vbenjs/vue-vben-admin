import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ant-design:database-filled',
      order: 5,
      title: $t('stock.title'),
    },
    name: 'Stock',
    path: '/stock',
    children: [
      {
        name: 'Current',
        path: '/stock/current',
        component: () => import('#/views/stock/current/index.vue'),
        meta: {
          title: $t('stock.current'),
          keepAlive: true,
        },
      },
      {
        name: 'ProductRecord',
        path: '/stock/productRecord',
        component: () => import('#/views/stock/productRecord/index.vue'),
        meta: {
          title: $t('stock.productRecord'),
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
