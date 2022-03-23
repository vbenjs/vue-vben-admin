import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const meeting: AppRouteModule = {
  path: '/meeting',
  name: 'Meeting',
  component: LAYOUT,
  redirect: '/meeting/index',
  meta: {
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'index',
      name: 'MeetingIndex',
      component: () => import('/@/views/dashboard/home/index.vue'),
      meta: {
        title: t('routes.dashboard.home'),
      },
    },
  ],
};

export default meeting;
