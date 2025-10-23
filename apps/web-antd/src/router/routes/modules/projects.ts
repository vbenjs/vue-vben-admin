import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:clipboard-text-outline', order: 200, title: '项目管理' },
    name: 'ProjectsRoot',
    path: '/projects',
    redirect: '/projects/chat',
    children: [
      {
        name: 'ProjectsChat',
        path: '/projects/chat',
        component: () => import('#/views/factoryos/projects/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'ProjectsList',
        path: '/projects/list',
        component: () => import('#/views/factoryos/projects/list/index.vue'),
        meta: { title: '项目列表' },
      },
      {
        name: 'ProjectsGantt',
        path: '/projects/gantt',
        component: () => import('#/views/factoryos/projects/gantt/index.vue'),
        meta: { title: '甘特图' },
      },
      {
        name: 'ProjectsBoard',
        path: '/projects/board',
        component: () => import('#/views/factoryos/projects/board/index.vue'),
        meta: { title: '看板' },
      },
      {
        name: 'ProjectsCost',
        path: '/projects/cost',
        component: () => import('#/views/factoryos/projects/cost/index.vue'),
        meta: { title: '成本分析' },
      },
      {
        name: 'ProjectsWeekly',
        path: '/projects/weekly',
        component: () => import('#/views/factoryos/projects/weekly/index.vue'),
        meta: { title: '周交付' },
      },
      {
        name: 'ProjectsReports',
        path: '/projects/reports',
        component: () => import('#/views/factoryos/projects/reports/index.vue'),
        meta: { title: '报表与仪表盘' },
      },
      {
        name: 'ProjectsTemplates',
        path: '/projects/templates',
        component: () => import('#/views/factoryos/projects/templates/index.vue'),
        meta: { title: '模板中心' },
      },
    ],
  },
];

export default routes;
