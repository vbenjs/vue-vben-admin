import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const workorder: AppRouteModule = {
  path: '/workorder',
  name: 'Workorder',
  component: LAYOUT,
  redirect: '/workorder/index',
  meta: {
    orderNo: 40,
    title: '工单管理',
    icon: '',
    roles: ['Workorder'],
  },
  children: [
    {
      path: 'list',
      name: 'WorkorderList',
      component: () => import('@/views/workorder/list/index.vue'),
      meta: {
        title: '工单记录',
        roles: ['WorkorderList'],
      },
    },
  ],
};

export default workorder;
