import type { RouteRecordRaw } from 'vue-router';

import { isShopifyEmbedded } from '#/shared/utils';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'COGS & Handling',
      icon: 'lsicon:goods-outline',
      order: 50,
    },
    name: 'settings.cogs-handling-fees',
    path: '/settings/cogs-and-handling',
    component: () => import('#/views/settings/cogs-handling-fees/index.vue'),
  },
  {
    meta: {
      title: 'Transaction Fees',
      icon: 'mdi:account-payment-outline',
      order: 60,
    },
    name: 'settings.transaction-fees',
    path: '/settings/transcation-fees',
    component: () => import('#/views/settings/transaction-fees/index.vue'),
  },
  {
    meta: {
      title: 'Zone & Shipping',
      icon: 'carbon:car',
      order: 70,
    },
    name: 'settings.shipping-fees',
    path: '/settings/shipping-fees',
    component: () => import('#/views/settings/zone-shipping/index.vue'),
  },
  {
    meta: {
      title: 'Custom Costs',
      icon: 'ant-design:dollar-circle-twotone',
      order: 80,
    },
    name: 'settings.custom-costs',
    path: '/settings/custom-costs',
    component: () => import('#/views/settings/custom-costs/index.vue'),
  },
  {
    meta: {
      title: 'Shop Settings',
      icon: 'codicon:settings',
      order: 100,
    },
    name: 'settings.general',
    path: '/settings/general',
    component: () => import('#/views/settings/general/index.vue'),
  },
  {
    meta: {
      title: 'View Fullscreen',
      order: 100_000,
      icon: 'ant-design:fullscreen-outlined',
      hideInMenu: !isShopifyEmbedded(),
    },
    name: 'fullscreen',
    path: '/fullscreen',
    component: () => import('#/views/fullscreen.vue'),
  },
];

export default routes;
