import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const store: AppRouteModule = {
  path: '/store',
  name: 'Store',
  component: LAYOUT,
  redirect: '/store/index',
  meta: {
    orderNo: 10,
    title: '地点管理',
    hideChildrenInMenu: true,
    icon: 'bx:map',
    roles: ['Store'],
  },
  children: [
    {
      path: 'index',
      name: 'StoreIndex',
      component: () => import('@/views/store/StoreIndex.vue'),
      meta: {
        title: '地点管理',
        roles: ['StoreManager'],
      },
    },
    {
      path: 'statistics/:id',
      name: 'StoreStatistics',
      component: () => import('@/views/store/statistics/StoreStatistics.vue'),
      meta: {
        title: '分组统计',
        roles: ['StoreStatistics'],
      },
    },
    {
      path: 'turnover/:id',
      name: 'StoreTurnover',
      component: () => import('@/views/store/turnover/StoreTurnover.vue'),
      meta: {
        title: '营业额明细',
        roles: ['StoreTurnover'],
      },
    },
  ],
};

export default store;
