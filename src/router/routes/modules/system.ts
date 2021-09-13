import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const system2: AppRouteModule = {
  path: '/system2',
  name: 'System2',
  component: LAYOUT,
  redirect: '/system2/account',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.demo.system.moduleName'),
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement2',
      meta: {
        title: t('routes.demo.system.account'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/system/account/index.vue'),
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail2',
      meta: {
        hideMenu: true,
        title: t('routes.demo.system.account_detail'),
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system2/account',
      },
      component: () => import('/@/views/system/account/AccountDetail.vue'),
    },
    {
      path: 'role',
      name: 'RoleManagement2',
      meta: {
        title: t('routes.demo.system.role'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/role/index.vue'),
    },

    {
      path: 'menu',
      name: 'MenuManagement2',
      meta: {
        title: t('routes.demo.system.menu'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/menu/index.vue'),
    },
    {
      path: 'dept',
      name: 'DeptManagement2',
      meta: {
        title: t('routes.demo.system.dept'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/dept/index.vue'),
    },
    {
      path: 'changePassword',
      name: 'ChangePassword2',
      meta: {
        title: t('routes.demo.system.password'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/password/index.vue'),
    },
  ],
};

export default system2;
