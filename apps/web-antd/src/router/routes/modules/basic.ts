import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi-light:sitemap',
      order: 2,
      title: $t('basic.title'),
    },
    name: 'Basic',
    path: '/basic',
    children: [
      {
        name: 'Brand',
        path: '/basic/brand',
        component: () => import('#/views/basic/brand/index.vue'),
        meta: {
          title: $t('basic.brand'),
          keepAlive: true,
        },
      },
      {
        name: 'Color',
        path: '/basic/color',
        component: () => import('#/views/basic/color/index.vue'),
        meta: {
          title: $t('basic.color'),
          keepAlive: true,
        },
      },
      {
        name: 'Unit',
        path: '/basic/unit',
        component: () => import('#/views/basic/unit/index.vue'),
        meta: {
          title: $t('basic.unit'),
          keepAlive: true,
        },
      },
      {
        name: 'Bank',
        path: '/basic/bank',
        component: () => import('#/views/basic/bank/index.vue'),
        meta: {
          title: $t('basic.bank'),
          keepAlive: true,
        },
      },
      {
        name: 'Customer',
        path: '/basic/customer',
        component: () => import('#/views/basic/customer/index.vue'),
        meta: {
          title: $t('basic.customer'),
          keepAlive: true,
        },
      },
      {
        name: 'Supplier',
        path: '/basic/supplier',
        component: () => import('#/views/basic/supplier/index.vue'),
        meta: {
          title: $t('basic.supplier'),
          keepAlive: true,
        },
      },
      {
        name: 'Store',
        path: '/basic/store',
        component: () => import('#/views/basic/store/index.vue'),
        meta: {
          title: $t('basic.store'),
          keepAlive: true,
        },
      },
      {
        name: 'Prodcut',
        path: '/basic/product',
        component: () => import('#/views/basic/product/index.vue'),
        meta: {
          title: $t('basic.product'),
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
