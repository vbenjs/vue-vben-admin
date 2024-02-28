import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const statistics: AppRouteModule = {
  path: '/statistics',
  name: 'Statistics',
  component: LAYOUT,
  redirect: '/statistics/energy/rank',
  meta: {
    orderNo: 80,
    title: '数据统计',
    icon: 'mdi:chart-line',
    roles: ['Statistics'],
  },
  children: [
    {
      path: 'inBound',
      name: 'InBoundStatistics',
      component: () => import('@/views/statistics/Inbound.vue'),
      meta: {
        title: '入库统计',
        icon: 'lucide:file-line-chart',
        roles: ['inBoundStatistics'],
      },
    },
    {
      path: 'outBound',
      name: 'OutBoundStatistics',
      component: () => import('@/views/statistics/Outbound.vue'),
      meta: {
        title: '出库统计',
        icon: 'lucide:file-bar-chart',
        roles: ['outBoundStatistics'],
      },
    },
  ],
};

export default statistics;
