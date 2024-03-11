import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const enterprise: AppRouteModule = {
  path: '/enterprise',
  name: 'Enterprise',
  component: LAYOUT,
  redirect: '/enterprise/list',
  meta: {
    orderNo: 10,
    title: '企业管理',
    // icon: 'bx:map',
    roles: ['Enterprise'],
  },
  children: [
    {
      path: 'group',
      name: 'Group',
      component: () => import('@/views/enterprise/group/index.vue'),
      meta: {
        title: '集团管理',
        roles: ['Group'],
      },
    },
    {
      path: 'brand',
      name: 'Brand',
      component: () => import('@/views/enterprise/brand/index.vue'),
      meta: {
        title: '品牌列表',
        roles: ['Brand'],
      },
    },
    {
      path: 'organization',
      name: 'Organization',
      component: () => import('@/views/enterprise/organization/index.vue'),
      meta: {
        title: '组织架构',
        roles: ['Organization'],
      },
    },
    {
      path: 'store',
      name: 'Store',
      component: import('@/views/enterprise/store/store.vue'),
      meta: {
        title: '地点管理',
        roles: ['Store'],
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'statistics/:id',
          name: 'StoreStatistics',
          component: () => import('@/views/enterprise/store/statistics/StoreStatistics.vue'),
          meta: {
            title: '分组统计',
            roles: ['StoreStatistics'],
          },
        },
        {
          path: 'turnover/:id',
          name: 'StoreTurnover',
          component: () => import('@/views/enterprise/store/turnover/StoreTurnover.vue'),
          meta: {
            title: '营业额明细',
            roles: ['StoreTurnover'],
          },
        },
      ],
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/enterprise/user/index.vue'),
      meta: {
        title: '用户管理',
        roles: ['User'],
      },
    },
  ],
};

export default enterprise;
