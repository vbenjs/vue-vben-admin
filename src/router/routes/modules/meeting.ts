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
          path: 'show/:id',
          name: 'MeetingManagerShow',
          component: () => import('/@/views/meeting/show/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingManagerShow'),
          },
        },
      ],
    },

    {
      path: 'register',
      name: 'MeetingRegister',
      component: () => import('/@/views/meeting/register/index.vue'),
      meta: {
        title: t('routes.meeting.MeetingRegister'),
      },
      children: [
        {
          path: 'add/:id',
          name: 'MeetingRegisterAdd',
          component: () => import('/@/views/meeting/register/add/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingRegisterAdd'),
          },
        },

        {
          path: 'edit/:id',
          name: 'MeetingRegisterEdit',
          component: () => import('/@/views/meeting/register/edit/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingRegisterEdit'),
          },
        },

        {
          path: 'pay/:id',
          name: 'MeetingRegisterPay',
          component: () => import('/@/views/meeting/register/pay/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingRegisterPay'),
          },
        },

        {
          path: 'show/:id',
          name: 'MeetingRegisterShow',
          component: () => import('/@/views/meeting/register/show/index.vue'),
          meta: {
            title: t('routes.meeting.MeetingRegisterShow'),
          },
        },
      ],
    },
  ],
};

export default meeting;
