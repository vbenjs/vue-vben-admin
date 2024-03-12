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
      component: () => import('@/views/property/type/index.vue'),
      meta: {
        title: '资产分类',
        roles: ['PropertyType'],
      },
    },
    {
      path: 'device',
      name: 'DeviceProperty',
      component: () => import('@/views/property/list/device.vue'),
      meta: {
        title: '设备资产',
        roles: ['DeviceProperty'],
      },
    },
    {
      path: 'project',
      name: 'ProjectProperty',
      component: () => import('@/views/property/list/project.vue'),
      meta: {
        title: '工程资产',
        roles: ['ProjectProperty'],
      },
    },
    {
      path: 'it',
      name: 'ITProperty',
      component: () => import('@/views/property/list/IT.vue'),
      meta: {
        title: 'IT资产',
        roles: ['ITProperty'],
      },
    },
    {
      path: 'other',
      name: 'OtherProperty',
      component: () => import('@/views/property/list/other.vue'),
      meta: {
        title: '其他资产',
        roles: ['OtherProperty'],
      },
    },
  ],
};

export default property;
