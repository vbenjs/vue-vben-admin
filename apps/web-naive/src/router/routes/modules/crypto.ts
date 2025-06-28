import type { RouteRecordRaw } from 'vue-router';

import { LAYOUT } from '@vben/layouts';

const cryptoRoutes: RouteRecordRaw[] = [
  {
    path: '/crypto',
    name: 'Crypto',
    component: LAYOUT,
    redirect: '/crypto/recommendations',
    meta: {
      title: 'crypto.menu.name', // Localization key
      icon: 'icon-park-outline:bitcoin',
      sort: 50,
    },
    children: [
      {
        path: 'recommendations',
        name: 'CryptoRecommendations',
        component: () => import('#/views/crypto/Recommendations.vue'),
        meta: {
          title: 'crypto.menu.recommendations', // Localization key
          // icon: 'carbon:recommend',
        },
      },
      {
        path: 'portfolio',
        name: 'CryptoPortfolio',
        component: () => import('#/views/crypto/Portfolio.vue'),
        meta: {
          title: 'crypto.menu.portfolio', // Localization key
          // icon: 'carbon:wallet',
        },
      },
      {
        path: 'apikeys',
        name: 'CryptoApiKeys',
        component: () => import('#/views/crypto/ApiKeys.vue'),
        meta: {
          title: 'crypto.menu.apiKeys', // Localization key
          // icon: 'carbon:api',
        },
      },
      {
        path: 'recharge',
        name: 'CryptoRecharge',
        component: () => import('#/views/crypto/Recharge.vue'),
        meta: {
          title: 'crypto.menu.recharge', // Localization key
          // icon: 'carbon:money',
        },
      },
    ],
  },
];

export default cryptoRoutes;
