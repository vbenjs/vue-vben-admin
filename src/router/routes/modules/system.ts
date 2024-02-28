import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  // redirect: '/system/information',
  meta: {
    orderNo: 100,
    icon: 'ant-design:setting',
    title: '系统设置',
    roles: ['sysManager'],
  },
  children: [
    {
      path: 'authority',
      name: 'Authority',
      component: () => import('@/views/system/authority/Authority.vue'),
      meta: {
        title: '权限管理',
        icon: 'clarity:key-line',
        roles: ['permissionManager'],
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/Role.vue'),
      meta: {
        title: '角色管理',
        icon: 'mdi:account-edit-outline',
        roles: ['accountRoleManager'],
      },
    },
    {
      path: 'account',
      name: 'Account',
      component: () => import('@/views/system/account/Account.vue'),
      meta: {
        title: '账户管理',
        icon: 'ic:outline-manage-accounts',
        roles: ['accountManager'],
      },
    },
    {
      path: 'meslog',
      name: 'MesLog',
      component: () => import('@/views/system/log/MesLog.vue'),
      meta: {
        title: 'Mes日志',
        icon: 'ant-design:file-search-outlined',
        roles: ['MesLog'],
      },
    },
    {
      path: 'sync',
      name: 'Sync',
      component: () => import('@/views/system/sync/Sync.vue'),
      meta: {
        title: '数据同步',
        icon: 'ant-design:sync-outlined',
        roles: ['sync'],
      },
    },
  ],
};

export default system;
