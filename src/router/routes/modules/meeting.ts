import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const meeting: AppRouteModule = {
  path: '/meeting',
  name: 'Meeting',
  component: LAYOUT,
  redirect: '/meeting/manager',
  meta: {
    title: t('routes.meeting.MeetingManager'),
  },
  children: [
    {
      path: 'manager',
      name: 'MeetingManager',
      component: () => import('/@/views/meeting/index.vue'),
      meta: {
        title: t('routes.meeting.MeetingManager'),
      },

      children: [
        {
          path: 'add/:id',
          name: 'MeetingManagerAdd',
          component: () => import('/@/views/meeting/add/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingManagerAdd'),
          },
        },

        {
          path: 'show/:id',
          name: 'MeetingManagerShow',
          component: () => import('/@/views/meeting/show/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingManagerShow'),
          },
        },
      ],
    },
  ],
};

export default meeting;
