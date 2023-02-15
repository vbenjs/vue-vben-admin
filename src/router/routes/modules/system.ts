import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/user',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.system.title'),
    permissions: ['system'],
  },
  children: [
    {
      path: 'user',
      name: 'User',
      meta: {
        title: t('routes.system.user.title'),
        ignoreKeepAlive: false,
        permissions: ['system:user:page'],
      },
      component: () => import('/@/views/system/user/index.vue'),
    },
    {
      path: 'role',
      name: 'Role',
      meta: {
        title: t('routes.system.role.title'),
        ignoreKeepAlive: true,
        permissions: ['system:role:page'],
      },
      component: () => import('/@/views/system/role/index.vue'),
    },

    {
      path: 'permission',
      name: 'Permission',
      meta: {
        title: t('routes.system.permission.title'),
        ignoreKeepAlive: true,
        permissions: ['system:permission:tree'],
      },
      component: () => import('/@/views/system/permission/index.vue'),
    },
    {
      path: 'department',
      name: 'Department',
      meta: {
        title: t('routes.system.department.title'),
        ignoreKeepAlive: true,
        permissions: ['system:department:tree'],
      },
      component: () => import('/@/views/system/department/index.vue'),
    },
    {
      path: 'dictionary',
      name: 'Dictionary',
      meta: {
        title: t('routes.system.dictionary.title'),
        ignoreKeepAlive: true,
        permissions: ['system:dictionary:page'],
      },
      component: () => import('/@/views/system/dictionary/index.vue'),
    },
  ],
};

export default system;
