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
        meta: { icon: 'lucide:sliders-horizontal', title: '基础设置' },
      },
      {
        name: 'SysDict',
        path: '/sys/dict',
        component: () => import('#/views/sys/dict/index.vue'),
        meta: { icon: 'lucide:book-marked', title: '字典管理' },
      },
      {
        name: 'SysUser',
        path: '/sys/user',
        component: () => import('#/views/sys/user/index.vue'),
        meta: { icon: 'lucide:users', title: '用户管理' },
      },
      {
        name: 'SysRole',
        path: '/sys/role',
        component: () => import('#/views/sys/role/index.vue'),
        meta: { icon: 'lucide:user-check', title: '角色管理' },
      },
      {
        name: 'SysDept',
        path: '/sys/dept',
        component: () => import('#/views/sys/dept/index.vue'),
        meta: { icon: 'lucide:network', title: '组织架构' },
      },
      {
        name: 'SysPost',
        path: '/sys/post',
        component: () => import('#/views/sys/post/index.vue'),
        meta: { icon: 'lucide:briefcase', title: '岗位管理' },
      },
      {
        name: 'SysMenu',
        path: '/sys/menu',
        component: () => import('#/views/sys/menu/index.vue'),
        meta: { icon: 'lucide:menu', title: '菜单管理' },
      },
      {
        name: 'SysTenant',
        path: '/sys/tenant',
        component: () => import('#/views/sys/tenant/index.vue'),
        meta: { icon: 'lucide:building-2', title: '租户管理' },
      },
      {
        name: 'SysOperLog',
        path: '/sys/operlog',
        component: () => import('#/views/sys/oper-log/index.vue'),
        meta: { icon: 'lucide:clipboard-list', title: '操作日志' },
      },
      {
        name: 'SysLogininfor',
        path: '/sys/logininfor',
        component: () => import('#/views/sys/logininfor/index.vue'),
        meta: { icon: 'lucide:log-in', title: '登录日志' },
      },
      {
        name: 'SysJob',
        path: '/sys/job',
        component: () => import('#/views/sys/job/index.vue'),
        meta: { icon: 'lucide:clock', title: '定时任务' },
      },
      {
        name: 'SysDocCode',
        path: '/sys/doc-code',
        component: () => import('#/views/sys/doc-code/index.vue'),
        meta: { icon: 'lucide:file-code', title: '单据编码' },
      },
      {
        name: 'SysMonitor',
        path: '/sys/monitor',
        component: () => import('#/views/sys/monitor/index.vue'),
        meta: { icon: 'lucide:activity', title: '服务监控' },
      },
      // ===================== 审批流程（含7个子菜单）=====================
      {
        meta: { icon: 'lucide:git-merge', title: '审批流程' },
        name: 'SysApprovalGroup',
        path: '/sys/approval',
        children: [
          {
            name: 'SysApprovalFlowConfig',
            path: '/sys/approval/flow-config',
            component: () => import('#/views/sys/approval-process/flow-config.vue'),
            meta: { icon: 'lucide:settings-2', title: '流程配置' },
          },
          {
            name: 'SysApprovalMyApproval',
            path: '/sys/approval/my-approval',
            component: () => import('#/views/sys/approval-process/my-approval.vue'),
            meta: { icon: 'lucide:check-circle', title: '我的审批' },
          },
          {
            name: 'SysApprovalMySubmit',
            path: '/sys/approval/my-submit',
            component: () => import('#/views/sys/approval-process/my-submit.vue'),
            meta: { icon: 'lucide:send', title: '我的提交' },
          },
          {
            name: 'SysApprovalPending',
            path: '/sys/approval/pending',
            component: () => import('#/views/sys/approval-process/pending.vue'),
            meta: { icon: 'lucide:hourglass', title: '待审流程' },
          },
          {
            name: 'SysApprovalApproved',
            path: '/sys/approval/approved',
            component: () => import('#/views/sys/approval-process/approved.vue'),
            meta: { icon: 'lucide:badge-check', title: '审批通过' },
          },
          {
            name: 'SysApprovalCcToMe',
            path: '/sys/approval/cc-to-me',
            component: () => import('#/views/sys/approval-process/cc-to-me.vue'),
            meta: { icon: 'lucide:mail', title: '抄送我的' },
          },
          {
            name: 'SysApprovalAll',
            path: '/sys/approval/all',
            component: () => import('#/views/sys/approval-process/all-approval.vue'),
            meta: { icon: 'lucide:list', title: '全部审批' },
          },
        ],
      },
      // ===================== 表单流程（含6个子菜单）=====================
      {
        meta: { icon: 'lucide:layout-template', title: '表单流程' },
        name: 'SysFormFlowGroup',
        path: '/sys/form',
        children: [
          {
            name: 'SysFormFlowManage',
            path: '/sys/form/flow-manage',
            component: () => import('#/views/sys/form-design/flow-manage.vue'),
            meta: { icon: 'lucide:workflow', title: '流程管理' },
          },
          {
            name: 'SysFormFlowInitiate',
            path: '/sys/form/initiate',
            component: () => import('#/views/sys/form-design/initiate.vue'),
            meta: { icon: 'lucide:play-circle', title: '发起流程' },
          },
          {
            name: 'SysFormFlowTodo',
            path: '/sys/form/todo',
            component: () => import('#/views/sys/form-design/todo.vue'),
            meta: { icon: 'lucide:clipboard-check', title: '待办流程' },
          },
          {
            name: 'SysFormFlowDone',
            path: '/sys/form/done',
            component: () => import('#/views/sys/form-design/done.vue'),
            meta: { icon: 'lucide:check-square', title: '已办流程' },
          },
          {
            name: 'SysFormFlowCc',
            path: '/sys/form/cc',
            component: () => import('#/views/sys/form-design/cc.vue'),
            meta: { icon: 'lucide:mail', title: '抄送流程' },
          },
          {
            name: 'SysFormFlowMySubmit',
            path: '/sys/form/my-submit',
            component: () => import('#/views/sys/form-design/my-submit.vue'),
            meta: { icon: 'lucide:send', title: '我的提交' },
          },
        ],
      },
      // ===================== 打印设计 =====================
      {
        name: 'SysPrintDesign',
        path: '/sys/print-design',
        component: () => import('#/views/sys/print-design/index.vue'),
        meta: { icon: 'lucide:printer', title: '打印设计' },
      },
    ],
  },
];

export default routes;
