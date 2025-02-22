import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'codicon:settings',
      keepAlive: true,
      order: 90_000,
      title: 'Settings',
    },
    name: 'settings',
    path: '/settings',
    children: [
      {
        meta: {
          title: 'General',
          icon: 'ic:baseline-shopify',
        },
        name: 'settings.general',
        path: '/settings/general',
        component: () => import('#/views/settings/general/index.vue'),
      },
      {
        meta: {
          title: 'COGS & Handling',
          icon: 'lsicon:goods-outline',
        },
        name: 'COGSAndHandling',
        path: '/settings/cogs-and-handling',
        component: () =>
          import('#/views/settings/cogs-handling-fees/index.vue'),
      },
      {
        meta: {
          title: 'Shipping Costs',
          icon: 'carbon:car',
        },
        name: 'ShippingFees',
        path: '/settings/shipping-fees',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Transaction Fees',
          icon: 'mdi:account-payment-outline',
        },
        name: 'Transaction Fees',
        path: '/settings/transcation-fees',
        component: () => import('#/views/reports/order/index.vue'),
      },
      {
        meta: {
          title: 'Zones',
          icon: 'file-icons:moment-timezone',
        },
        name: 'settings.zones',
        path: '/settings/zones',
        component: () => import('#/views/reports/order/index.vue'),
      },
    ],
  },
];

export default routes;
