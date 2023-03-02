import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userinfo: AppRouteModule = {
  path: '/userinfo',
  name: 'Userinfo',
  component: LAYOUT,
  redirect: '/userinfo/password',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.userinfo.title'),
  },
  children: [
    {
      path: 'password',
      name: 'Password',
      meta: {
        title: t('routes.userinfo.password.title'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/userinfo/password/index.vue'),
    },
  ],
};

export default userinfo;
