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
    icon: 'ci:building-04',
    roles: ['Enterprise'],
  },
  children: [
    {
      path: 'group',
      name: 'Group',
      component: () => import('@/views/enterprise/group/index.vue'),
      meta: {
        title: '集团管理',
        icon: 'tabler:building-community',
        roles: ['Group'],
      },
      children: [
        {
          path: 'form/:id',
          name: 'GroupFrom',
          component: () => import('@/views/enterprise/group/GroupForm.vue'),
          meta: {
            title: '集团表单',
            roles: ['Group'],
            hideMenu: true,
            currentActiveMenu: '/enterprise/group',
          },
        },
      ],
    },
    {
      path: 'brand',
      name: 'Brand',
      component: () => import('@/views/enterprise/brand/index.vue'),
      meta: {
        title: '品牌列表',
        icon: 'uil:tag-alt',
        roles: ['Brand'],
      },
    },
    {
      path: 'organization',
      name: 'Organization',
      component: () => import('@/views/enterprise/organization/index.vue'),
      meta: {
        title: '组织架构',
        icon: 'ph:tree-structure',
        roles: ['Organization'],
      },
    },
    {
      path: 'store',
      name: 'Store',
      component: import('@/views/enterprise/store/store.vue'),
      meta: {
        title: '地点管理',
        icon: 'ant-design:shop-outlined',
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
            currentActiveMenu: '/enterprise/store',
          },
        },
        {
          path: 'turnover/:id',
          name: 'StoreTurnover',
          component: () => import('@/views/enterprise/store/turnover/StoreTurnover.vue'),
          meta: {
            title: '营业额明细',
            roles: ['StoreTurnover'],
            currentActiveMenu: '/enterprise/store',
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
        icon: 'mdi:person-outline',
        roles: ['User'],
      },
    },
  ],
};

export default enterprise;
