import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:lifebuoy', order: 1000, title: '帮助与支持' },
    name: 'HelpRoot',
    path: '/help',
    redirect: '/help/chat',
    children: [
      {
        name: 'HelpChat',
        path: '/help/chat',
        component: () => import('#/views/factoryos/help/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'HelpGuide',
        path: '/help/guide',
        component: () => import('#/views/factoryos/help/guide/index.vue'),
        meta: { title: '使用指南' },
      },
      {
        name: 'HelpTickets',
        path: '/help/tickets',
        component: () => import('#/views/factoryos/help/tickets/index.vue'),
        meta: { title: '反馈与工单' },
      },
      {
        name: 'HelpRelease',
        path: '/help/release',
        component: () => import('#/views/factoryos/help/release/index.vue'),
        meta: { title: '版本与更新' },
      },
      {
        name: 'HelpAbout',
        path: '/help/about',
        component: () => import('#/views/factoryos/help/about/index.vue'),
        meta: { title: '关于' },
      },
    ],
  },
];

export default routes;
