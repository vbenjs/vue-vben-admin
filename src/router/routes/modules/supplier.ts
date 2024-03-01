import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const supplier: AppRouteModule = {
  path: '/supplier',
  name: 'Supplier',
  component: LAYOUT,
  redirect: '/supplier/index',
  meta: {
    orderNo: 30,
    title: '供应商管理',
    icon: '',
    roles: ['Supplier'],
  },
  children: [
    {
      path: 'list',
      name: 'SupplierList',
      component: () => import('@/views/sys/exception/Exception.vue'),
      meta: {
        title: '供应商列表',
        roles: ['SupplierList'],
      },
    },
  ],
};

export default supplier;
