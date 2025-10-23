import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:link-variant', order: 800, title: '数据与集成' },
    name: 'IntegrationRoot',
    path: '/integration',
    redirect: '/integration/chat',
    children: [
      {
        name: 'IntegrationChat',
        path: '/integration/chat',
        component: () => import('#/views/factoryos/integration/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'IntegrationDingtalk',
        path: '/integration/dingtalk',
        component: () => import('#/views/factoryos/integration/dingtalk/index.vue'),
        meta: { title: '钉钉集成' },
      },
      {
        name: 'IntegrationDbConnectors',
        path: '/integration/db-connectors',
        component: () => import('#/views/factoryos/integration/db-connectors/index.vue'),
        meta: { title: '数据库连接器' },
      },
      {
        name: 'IntegrationScheduler',
        path: '/integration/scheduler',
        component: () => import('#/views/factoryos/integration/scheduler/index.vue'),
        meta: { title: '同步调度' },
      },
      {
        name: 'IntegrationUnifiedAccess',
        path: '/integration/unified-access',
        component: () => import('#/views/factoryos/integration/unified-access/index.vue'),
        meta: { title: '统一数据访问层' },
      },
      {
        name: 'IntegrationDataQuality',
        path: '/integration/data-quality',
        component: () => import('#/views/factoryos/integration/data-quality/index.vue'),
        meta: { title: '数据质量' },
      },
    ],
  },
];

export default routes;
