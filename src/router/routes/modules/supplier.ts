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
    icon: 'material-symbols:shield-person-outline',
    roles: ['Supplier'],
  },
  children: [
    {
      path: 'list',
      name: 'SupplierList',
      component: () => import('@/views/supplier/list/index.vue'),
      meta: {
        title: '供应商列表',
        icon: 'material-symbols:shield-person-outline',
        roles: ['SupplierList'],
      },
    },
  ],
};

export default supplier;
