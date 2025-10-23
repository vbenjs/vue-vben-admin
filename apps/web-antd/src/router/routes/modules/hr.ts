import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:account-group-outline', order: 500, title: '员工管理' },
    name: 'HRRoot',
    path: '/hr',
    redirect: '/hr/chat',
    children: [
      {
        name: 'HRChat',
        path: '/hr/chat',
        component: () => import('#/views/factoryos/hr/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'HROrg',
        path: '/hr/org',
        component: () => import('#/views/factoryos/hr/org/index.vue'),
        meta: { title: '组织架构' },
      },
      {
        name: 'HREmployees',
        path: '/hr/employees',
        component: () => import('#/views/factoryos/hr/employees/index.vue'),
        meta: { title: '员工档案' },
      },
      {
        name: 'HREfficiency',
        path: '/hr/efficiency',
        component: () => import('#/views/factoryos/hr/efficiency/index.vue'),
        meta: { title: '效率评估' },
      },
      {
        name: 'HRReports',
        path: '/hr/reports',
        component: () => import('#/views/factoryos/hr/reports/index.vue'),
        meta: { title: '报告生成（周报/月报）' },
      },
      {
        name: 'HRSkills',
        path: '/hr/skills',
        component: () => import('#/views/factoryos/hr/skills/index.vue'),
        meta: { title: '技能矩阵' },
      },
    ],
  },
];

export default routes;
