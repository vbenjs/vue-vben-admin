import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:ads',
      title: 'Ad Management',
      order: 90,
    },
    name: 'ads',
    path: '/ads',
    children: [
      {
        meta: {
          title: 'Ad Connections',
          icon: 'ant-design:link-outlined',
        },
        name: 'ads.accounts',
        path: '/ads/accounts',
        component: () => import('#/views/ads/account/index.vue'),
      },
      {
        meta: {
          title: 'Ad Cost Rules',
          icon: 'ant-design:dollar-circle-twotone',
        },
        name: 'ads.costs',
        path: '/ads/ad-costs',
        component: () => import('#/views/ads/ad-costs/index.vue'),
      },
      {
        meta: {
          title: 'Ad Cost Insights',
          order: 20,
          icon: 'clarity:analytics-outline-badged',
        },
        name: 'ads.insights',
        path: '/ads/ad-insights',
        component: () => import('#/views/ads/ad-insights/index.vue'),
      },
    ],
  },
];

export default routes;
