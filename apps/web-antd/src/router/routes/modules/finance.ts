import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:currency-cny', order: 300, title: '财务管理' },
    name: 'FinanceRoot',
    path: '/finance',
    redirect: '/finance/chat',
    children: [
      {
        name: 'FinanceChat',
        path: '/finance/chat',
        component: () => import('#/views/factoryos/finance/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'FinanceReports',
        path: '/finance/reports',
        component: () => import('#/views/factoryos/finance/reports/index.vue'),
        meta: { title: '报表（日/周/月）' },
      },
      {
        name: 'FinanceAlerts',
        path: '/finance/alerts',
        component: () => import('#/views/factoryos/finance/alerts/index.vue'),
        meta: { title: '指标预警' },
      },
      {
        name: 'FinanceProcurementCompare',
        path: '/finance/procurement-compare',
        component: () => import('#/views/factoryos/finance/procurement-compare/index.vue'),
        meta: { title: '历史采购对比' },
      },
      {
        name: 'FinanceDashboard',
        path: '/finance/dashboard',
        component: () => import('#/views/factoryos/finance/dashboard/index.vue'),
        meta: { title: '财务仪表盘' },
      },
    ],
  },
];

export default routes;
