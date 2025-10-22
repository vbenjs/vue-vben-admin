import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:robot',
      order: 0,
      title: $t('page.aiAssistant.title'),
      ignoreAccess: true,
    },
    name: 'AIAssistant',
    path: '/ai-assistant',
    component: () => import('#/views/ai-assistant/index.vue'),
    children: [
      {
        name: 'AIAssistantHub',
        path: '',
        component: () => import('#/views/ai-assistant/hub/index.vue'),
        meta: {
          icon: 'mdi:robot-happy',
          title: $t('page.aiAssistant.hub'),
          ignoreAccess: true,
        },
      },
      {
        name: 'AIAssistantChat',
        path: 'chat',
        component: () => import('#/views/ai-assistant/chat/index.vue'),
        meta: {
          hideInMenu: true,
          icon: 'mdi:chat',
          title: $t('page.aiAssistant.chat'),
          ignoreAccess: true,
        },
      },
      {
        name: 'AIAssistantTest',
        path: 'test',
        component: () => import('#/views/ai-assistant/test/index.vue'),
        meta: {
          hideInMenu: true,
          icon: 'mdi:test-tube',
          title: 'AI助手测试',
          ignoreAccess: true,
        },
      },
    ],
  },
];

export default routes;