import type { RouteRecordRaw } from 'vue-router';

// 审批流程模块 - 顶层菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:git-branch-plus',
      order: 60,
      title: '审批流程',
    },
    name: 'ApprovalManagement',
    path: '/approval',
    children: [
      {
        name: 'ApprovalMyTodo',
        path: '/approval/my-todo',
        component: () => import('#/views/sys/approval-process/my-approval.vue'),
        meta: { icon: 'lucide:clipboard-check', title: '我的审批' },
      },
      {
        name: 'ApprovalPending',
        path: '/approval/pending',
        component: () => import('#/views/sys/approval-process/pending.vue'),
        meta: { icon: 'lucide:clock-3', title: '待审流程' },
      },
      {
        name: 'ApprovalMySubmit',
        path: '/approval/my-submit',
        component: () => import('#/views/sys/approval-process/my-submit.vue'),
        meta: { icon: 'lucide:send', title: '我的提交' },
      },
      {
        name: 'ApprovalApproved',
        path: '/approval/approved',
        component: () => import('#/views/sys/approval-process/approved.vue'),
        meta: { icon: 'lucide:badge-check', title: '审批通过' },
      },
      {
        name: 'ApprovalCcToMe',
        path: '/approval/cc-to-me',
        component: () => import('#/views/sys/approval-process/cc-to-me.vue'),
        meta: { icon: 'lucide:mail-open', title: '抄送我的' },
      },
      {
        name: 'ApprovalAll',
        path: '/approval/all',
        component: () =>
          import('#/views/sys/approval-process/all-approval.vue'),
        meta: { icon: 'lucide:files', title: '全部审批' },
      },
      {
        name: 'ApprovalFlowConfig',
        path: '/approval/flow-config',
        component: () => import('#/views/sys/approval-process/flow-config.vue'),
        meta: { icon: 'lucide:git-branch-plus', title: '审批流程配置' },
      },
      {
        name: 'FlowTodo',
        path: '/approval/flow-todo',
        component: () => import('#/views/sys/form-design/todo.vue'),
        meta: { icon: 'lucide:list-todo', title: '待办流程' },
      },
      {
        name: 'FlowDone',
        path: '/approval/flow-done',
        component: () => import('#/views/sys/form-design/done.vue'),
        meta: { icon: 'lucide:check-check', title: '已办流程' },
      },
      {
        name: 'FlowCc',
        path: '/approval/flow-cc',
        component: () => import('#/views/sys/form-design/cc.vue'),
        meta: { icon: 'lucide:mail-plus', title: '抄送流程' },
      },
      {
        name: 'FlowInitiate',
        path: '/approval/flow-initiate',
        component: () => import('#/views/sys/form-design/initiate.vue'),
        meta: { icon: 'lucide:play-circle', title: '发起流程' },
      },
      {
        name: 'FlowMySubmit',
        path: '/approval/flow-my-submit',
        component: () => import('#/views/sys/form-design/my-submit.vue'),
        meta: { icon: 'lucide:file-clock', title: '流程我的提交' },
      },
      {
        name: 'FlowFormConfig',
        path: '/approval/form-config',
        component: () => import('#/views/sys/form-design/form-config.vue'),
        meta: { icon: 'lucide:layout-template', title: '表单配置' },
      },
      {
        name: 'FlowPageMeta',
        path: '/approval/page-meta',
        component: () => import('#/views/sys/form-design/page-meta.vue'),
        meta: { icon: 'lucide:panel-top-open', title: '页面自定义' },
      },
    ],
  },
];

export default routes;
