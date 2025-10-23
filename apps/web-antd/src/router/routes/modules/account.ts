import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:account-circle-outline', order: 1100, title: '个人中心' },
    name: 'AccountRoot',
    path: '/account',
    redirect: '/account/profile',
    children: [
      {
        name: 'AccountProfile',
        path: '/account/profile',
        component: () => import('#/views/factoryos/account/profile/index.vue'),
        meta: { title: '我的资料' },
      },
      {
        name: 'AccountPreferences',
        path: '/account/preferences',
        component: () => import('#/views/factoryos/account/preferences/index.vue'),
        meta: { title: '偏好设置' },
      },
      {
        name: 'AccountFavorites',
        path: '/account/favorites',
        component: () => import('#/views/factoryos/account/favorites/index.vue'),
        meta: { title: '我的收藏' },
      },
      {
        name: 'AccountRecent',
        path: '/account/recent',
        component: () => import('#/views/factoryos/account/recent/index.vue'),
        meta: { title: '最近访问' },
      },
    ],
  },
];

export default routes;
