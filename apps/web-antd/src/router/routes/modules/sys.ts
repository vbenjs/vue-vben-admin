import type { RouteRecordRaw } from 'vue-router';

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
      {
        name: 'SysConfig',
        path: '/sys/config',
        component: () => import('#/views/sys/config/index.vue'),
        meta: {
          icon: 'lucide:sliders-horizontal',
          title: '基础设置',
        },
      },
      {
        name: 'SysDict',
        path: '/sys/dict',
        component: () => import('#/views/sys/dict/index.vue'),
        meta: {
          icon: 'lucide:book-marked',
          title: '字典管理',
        },
      },
      {
        name: 'SysUser',
        path: '/sys/user',
        component: () => import('#/views/sys/user/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: '用户管理',
        },
      },
      {
        name: 'SysRole',
        path: '/sys/role',
        component: () => import('#/views/sys/role/index.vue'),
        meta: {
          icon: 'lucide:user-check',
          title: '角色管理',
        },
      },
      {
        name: 'SysDept',
        path: '/sys/dept',
        component: () => import('#/views/sys/dept/index.vue'),
        meta: {
          icon: 'lucide:network',
          title: '组织架构',
        },
      },
      {
        name: 'SysPost',
        path: '/sys/post',
        component: () => import('#/views/sys/post/index.vue'),
        meta: {
          icon: 'lucide:briefcase',
          title: '岗位管理',
        },
      },
      {
        name: 'SysMenu',
        path: '/sys/menu',
        component: () => import('#/views/sys/menu/index.vue'),
        meta: {
          icon: 'lucide:menu',
          title: '菜单管理',
        },
      },
      {
        name: 'SysTenant',
        path: '/sys/tenant',
        component: () => import('#/views/sys/tenant/index.vue'),
        meta: {
          icon: 'lucide:building-2',
          title: '租户管理',
        },
      },
      {
        name: 'SysOperLog',
        path: '/sys/operlog',
        component: () => import('#/views/sys/oper-log/index.vue'),
        meta: {
          icon: 'lucide:clipboard-list',
          title: '操作日志',
        },
      },
      {
        name: 'SysLogininfor',
        path: '/sys/logininfor',
        component: () => import('#/views/sys/logininfor/index.vue'),
        meta: {
          icon: 'lucide:log-in',
          title: '登录日志',
        },
      },
      {
        name: 'SysJob',
        path: '/sys/job',
        component: () => import('#/views/sys/job/index.vue'),
        meta: {
          icon: 'lucide:clock',
          title: '定时任务',
        },
      },
      {
        name: 'SysDocCode',
        path: '/sys/doc-code',
        component: () => import('#/views/sys/doc-code/index.vue'),
        meta: {
          icon: 'lucide:file-code',
          title: '单据编码',
        },
      },
      {
        name: 'SysMonitor',
        path: '/sys/monitor',
        component: () => import('#/views/sys/monitor/index.vue'),
        meta: {
          icon: 'lucide:activity',
          title: '服务监控',
        },
      },
      {
        name: 'SysFormDesign',
        path: '/sys/form-design',
        component: () => import('#/views/sys/form-design/index.vue'),
        meta: {
          icon: 'lucide:layout-template',
          title: '表单设计',
        },
      },
      {
        name: 'SysApprovalProcess',
        path: '/sys/approval-process',
        component: () => import('#/views/sys/approval-process/index.vue'),
        meta: {
          icon: 'lucide:git-merge',
          title: '审批流程',
        },
      },
      {
        name: 'SysPrintDesign',
        path: '/sys/print-design',
        component: () => import('#/views/sys/print-design/index.vue'),
        meta: {
          icon: 'lucide:printer',
          title: '打印设计',
        },
      },
    ],
  },
];

export default routes;
