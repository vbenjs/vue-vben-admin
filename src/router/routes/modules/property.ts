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
    icon: 'eos-icons:products-outlined',
    roles: ['Property'],
  },
  children: [
    {
      path: 'type',
      name: 'Property',
      component: () => import('@/views/property/type/index.vue'),
      meta: {
        title: '资产分类',
        icon: 'mingcute:classify-3-line',
        roles: ['PropertyType'],
      },
    },
    {
      path: 'device',
      name: 'DeviceProperty',
      component: () => import('@/views/property/list/device.vue'),
      meta: {
        title: '设备资产',
        icon: 'akar-icons:devices',
        roles: ['DeviceProperty'],
      },
    },
    {
      path: 'project',
      name: 'ProjectProperty',
      component: () => import('@/views/property/list/project.vue'),
      meta: {
        title: '工程资产',
        icon: 'la:tools',
        roles: ['ProjectProperty'],
      },
    },
    {
      path: 'it',
      name: 'ITProperty',
      component: () => import('@/views/property/list/IT.vue'),
      meta: {
        title: 'IT资产',
        icon: 'fa-regular:file-code',
        roles: ['ITProperty'],
      },
    },
    {
      path: 'other',
      name: 'OtherProperty',
      component: () => import('@/views/property/list/other.vue'),
      meta: {
        title: '其他资产',
        icon: 'mingcute:file-more-line',
        roles: ['OtherProperty'],
      },
    },
  ],
};

export default property;
