import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'NotificationsCenter',
    path: '/notifications',
    component: () => import('#/views/notifications/index.vue'),
    meta: {
      icon: 'lucide:bell-ring',
      order: 320,
      title: $t('page.notifications.center'),
    },
  },
  {
    name: 'NotificationTemplateManagement',
    path: '/notifications/templates',
    component: () => import('#/views/notifications/templates/index.vue'),
    meta: {
      icon: 'lucide:file-text',
      order: 321,
      title: $t('page.notifications.templates.navTitle'),
    },
  },
];

export default routes;
