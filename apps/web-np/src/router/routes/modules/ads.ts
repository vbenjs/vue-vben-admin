import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:ads',
      order: 50,
      title: 'Ads Management',
    },
    name: 'ads',
    path: '/ads',
    children: [
      {
        meta: {
          title: 'Ad Accounts',
          icon: 'ant-design:link-outlined',
        },
        name: 'ads.accounts',
        path: '/ads/accounts',
        component: () => import('#/views/ads/account/index.vue'),
      },
      {
        meta: {
          title: 'Ad Costs',
          icon: 'ant-design:dollar-circle-twotone',
        },
        name: 'ads.costs',
        path: '/ads/ad-costs',
        component: () => import('#/views/ads/ad-costs/index.vue'),
      },
    ],
  },
];

export default routes;
