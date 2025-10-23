import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:book-open-outline', order: 600, title: '资料库' },
    name: 'KnowledgeRoot',
    path: '/knowledge',
    redirect: '/knowledge/chat',
    children: [
      {
        name: 'KnowledgeChat',
        path: '/knowledge/chat',
        component: () => import('#/views/factoryos/knowledge/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'KnowledgeSolutions',
        path: '/knowledge/solutions',
        component: () => import('#/views/factoryos/knowledge/solutions/index.vue'),
        meta: { title: '方案资料库' },
      },
      {
        name: 'KnowledgeParts',
        path: '/knowledge/parts',
        component: () => import('#/views/factoryos/knowledge/parts/index.vue'),
        meta: { title: '设计零件资料库' },
      },
      {
        name: 'KnowledgePLC',
        path: '/knowledge/plc',
        component: () => import('#/views/factoryos/knowledge/plc/index.vue'),
        meta: { title: 'PLC 设计资料库' },
      },
      {
        name: 'KnowledgeSearch',
        path: '/knowledge/search',
        component: () => import('#/views/factoryos/knowledge/search/index.vue'),
        meta: { title: '智能检索' },
      },
      {
        name: 'KnowledgeUpload',
        path: '/knowledge/upload',
        component: () => import('#/views/factoryos/knowledge/upload/index.vue'),
        meta: { title: '上传与版本' },
      },
    ],
  },
];

export default routes;
