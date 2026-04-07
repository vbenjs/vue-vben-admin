import type { RouteRecordRaw } from 'vue-router';

// 系统管理 - 按功能分组归类菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 100,
      title: '系统管理',
    },
    name: 'SysManagement',
    path: '/sys',
    children: [
      // ========== 组织机构 ==========
      {
        name: 'SysOrganization',
        path: '/sys/org',
        meta: { icon: 'lucide:building', title: '组织机构' },
        children: [
          {
            name: 'SysDept',
            path: '/sys/org/dept',
            component: () => import('#/views/sys/dept/index.vue'),
            meta: { icon: 'lucide:network', title: '组织机构主数据' },
          },
          {
            name: 'SysTenant',
            path: '/sys/org/tenant',
            component: () => import('#/views/sys/tenant/index.vue'),
            meta: { icon: 'lucide:building-2', title: '账套维护' },
          },
        ],
      },
      // ========== 权限管理 ==========
      {
        name: 'SysPermission',
        path: '/sys/permission',
        meta: { icon: 'lucide:shield', title: '权限管理' },
        children: [
          {
            name: 'SysMenu',
            path: '/sys/permission/menu',
            component: () => import('#/views/sys/menu/index.vue'),
            meta: { icon: 'lucide:menu', title: '菜单管理' },
          },
          {
            name: 'SysRole',
            path: '/sys/permission/role',
            component: () => import('#/views/sys/role/index.vue'),
            meta: { icon: 'lucide:user-check', title: '角色管理' },
          },
          {
            name: 'SysUser',
            path: '/sys/permission/user',
            component: () => import('#/views/sys/user/index.vue'),
            meta: { icon: 'lucide:users', title: '用户管理' },
          },
        ],
      },
      // ========== 基础数据 ==========
      {
        name: 'SysBaseData',
        path: '/sys/base-data',
        meta: { icon: 'lucide:database', title: '基础数据' },
        children: [
          {
            name: 'SysDict',
            path: '/sys/base-data/dict',
            component: () => import('#/views/sys/dict/index.vue'),
            meta: { icon: 'lucide:book-marked', title: '基础要素设置' },
          },
          {
            name: 'SysPost',
            path: '/sys/base-data/post',
            component: () => import('#/views/sys/post/index.vue'),
            meta: { icon: 'lucide:briefcase', title: '岗位基础档案' },
          },
          {
            name: 'SysExpenseClaim',
            path: '/sys/base-data/expense-claim',
            component: () => import('#/views/sys/expense-claim/index.vue'),
            meta: { icon: 'lucide:receipt', title: '报销单' },
          },
        ],
      },
      // ========== 系统设置 ==========
      {
        name: 'SysSettings',
        path: '/sys/settings',
        meta: { icon: 'lucide:sliders-horizontal', title: '系统设置' },
        children: [
          {
            name: 'SysConfig',
            path: '/sys/settings/config',
            component: () => import('#/views/sys/config/index.vue'),
            meta: { icon: 'lucide:sliders-horizontal', title: '组织参数设置' },
          },
          {
            name: 'SysTenantParameter',
            path: '/sys/settings/tenant-parameter',
            component: () => import('#/views/sys/tenant-parameter/index.vue'),
            meta: { icon: 'lucide:sliders-vertical', title: '账套参数设置' },
          },
          {
            name: 'SysTenantPolicy',
            path: '/sys/settings/tenant-policy',
            component: () => import('#/views/sys/tenant-policy/index.vue'),
            meta: { icon: 'lucide:sliders', title: '租户策略设置' },
          },
        ],
      },
    ],
  },
];

export default routes;
