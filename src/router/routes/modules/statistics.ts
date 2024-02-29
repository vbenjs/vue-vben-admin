import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const statistics: AppRouteModule = {
  path: '/statistics',
  name: 'Statistics',
  component: LAYOUT,
  redirect: '/statistics/energy/rank',
  meta: {
    orderNo: 90,
    title: '数据统计',
    icon: 'mdi:chart-line',
    roles: ['Statistics'],
  },
  children: [
    {
      path: 'energy',
      name: 'EnergyStatistics',
      redirect: '/statistics/energy/rank',
      meta: {
        title: '能耗统计',
        roles: ['EnergyStatistics'],
      },
      children: [
        {
          path: 'rank',
          name: 'StoreRank',
          component: () => import('@/views/statistics/energy/StoreRanking.vue'),
          meta: {
            title: '能效统计',
            roles: ['EnergyStatistics_StoreRank'],
          },
        },
        {
          path: 'yoy',
          name: 'StoreYoy',
          component: () => import('@/views/statistics/energy/yoy.vue'),
          meta: {
            title: '能耗同比',
            roles: ['EnergyStatistics_StoreYoy'],
          },
        },
        {
          path: 'qoq',
          name: 'StoreQoq',
          component: () => import('@/views/statistics/energy/qoq.vue'),
          meta: {
            title: '能耗环比',
            roles: ['EnergyStatistics_StoreQoq'],
          },
        },
      ],
    },
    {
      path: 'alarm',
      name: 'AlarmStatistics',
      redirect: '/statistics/alarm/rank',
      meta: {
        title: '告警统计',
        roles: ['AlarmStatistics'],
      },
      children: [
        {
          path: 'index',
          name: 'AlarmStatisticsIndex',
          component: () => import('@/views/statistics/alarm/AlarmStatistics.vue'),
          meta: {
            title: '告警统计',
            roles: ['AlarmStatistics_Index'],
          },
        },
        {
          path: 'yoy',
          name: 'AlarmYoy',
          component: () => import('@/views/statistics/alarm/yoy.vue'),
          meta: {
            title: '告警同比',
            roles: ['AlarmStatistics_AlarmYoy'],
          },
        },
        {
          path: 'qoq',
          name: 'AlarmQoq',
          component: () => import('@/views/statistics/alarm/qoq.vue'),
          meta: {
            title: '告警环比',
            roles: ['AlarmStatistics_AlarmQoq'],
          },
        },
      ],
    },
  ],
};

export default statistics;
