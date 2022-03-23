import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const user: AppRouteModule = {
  path: '/user',
  name: 'User',
  component: LAYOUT,
  redirect: '/user/center',
  meta: {
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'center',
      name: 'UserCenter',
      component: () => import('/@/views/dashboard/home/index.vue'),
      meta: {
        title: t('routes.dashboard.home'),
      },
    },
  ],
};

export default user;
