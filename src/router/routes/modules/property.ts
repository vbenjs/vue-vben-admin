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
  ],
};

export default property;
