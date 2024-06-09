import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '@/layouts';
import { $t } from '@vben/locales/helper';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:lightbulb-error-outline',
      title: $t('page.fallback.page'),
    },
    name: 'FallbackLayout',
    path: '/fallback',
    redirect: '/fallback/403',
    children: [
      {
        name: 'Fallback403',
        path: '403',
        component: () => import('@/views/_essential/fallback/forbidden.vue'),
        meta: {
          icon: 'mdi:do-not-disturb-alt',
          title: '403',
        },
      },
      {
        name: 'Fallback404',
        path: '404',
        component: () => import('@/views/_essential/fallback/not-found.vue'),
        meta: {
          icon: 'mdi:table-off',
          title: '404',
        },
      },
      {
        name: 'Fallback500',
        path: '500',
        component: () =>
          import('@/views/_essential/fallback/internal-error.vue'),
        meta: {
          icon: 'mdi:server-network-off',
          title: '500',
        },
      },
      {
        name: 'FallbackOffline',
        path: 'offline',
        component: () => import('@/views/_essential/fallback/offline.vue'),
        meta: {
          icon: 'mdi:offline',
          title: $t('fallback.offline'),
        },
      },
    ],
  },
];

export default routes;
