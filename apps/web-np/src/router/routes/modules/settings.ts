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
          title: 'Transaction Fees',
          icon: 'mdi:account-payment-outline',
        },
        name: 'Transaction Fees',
        path: '/settings/transcation-fees',
        component: () => import('#/views/settings/transaction-fees/index.vue'),
      },
      {
        meta: {
          title: 'Zone & Shipping',
          icon: 'carbon:car',
        },
        name: 'settings.shipping-fees',
        path: '/settings/shipping-fees',
        component: () => import('#/views/settings/zone-shipping/index.vue'),
      },
      {
        meta: {
          title: 'General',
          icon: 'ic:baseline-shopify',
        },
        name: 'settings.general',
        path: '/settings/general',
        component: () => import('#/views/settings/general/index.vue'),
      },
    ],
  },
];

export default routes;
