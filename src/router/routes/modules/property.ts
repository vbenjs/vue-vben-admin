import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const property: AppRouteModule = {
  path: '/property',
  name: 'Property',
  component: LAYOUT,
  redirect: '/property/index',
  meta: {
    orderNo: 20,
    title: '资产管理',
    icon: '',
    roles: ['Property'],
  },
  children: [
    {
      path: 'type',
      name: 'Property',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: '资产分类',
        roles: ['PropertyType'],
      },
    },
    {
      path: 'device',
      name: 'Device',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: '设备资产',
        roles: ['Device'],
      },
    },
    {
      path: 'project',
      name: 'Project',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: '工程资产',
        roles: ['Project'],
      },
    },
    {
      path: 'it',
      name: 'It',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: 'IT资产',
        roles: ['It'],
      },
    },
    {
      path: 'other',
      name: 'Other',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: '其他资产',
        roles: ['Other'],
      },
    },
  ],
};

export default property;
