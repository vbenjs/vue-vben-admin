import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:check-decagram-outline', order: 400, title: '审批管理' },
    name: 'ApprovalsRoot',
    path: '/approvals',
    redirect: '/approvals/chat',
    children: [
      {
        name: 'ApprovalsChat',
        path: '/approvals/chat',
        component: () => import('#/views/factoryos/approvals/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'ApprovalsCreate',
        path: '/approvals/create',
        component: () => import('#/views/factoryos/approvals/create/index.vue'),
        meta: { title: '发起申请' },
      },
      {
        name: 'ApprovalsTodo',
        path: '/approvals/todo',
        component: () => import('#/views/factoryos/approvals/todo/index.vue'),
        meta: { title: '待我处理' },
      },
      {
        name: 'ApprovalsMine',
        path: '/approvals/mine',
        component: () => import('#/views/factoryos/approvals/mine/index.vue'),
        meta: { title: '我发起的' },
      },
      {
        name: 'ApprovalsHistory',
        path: '/approvals/history',
        component: () => import('#/views/factoryos/approvals/history/index.vue'),
        meta: { title: '审批历史' },
      },
      {
        name: 'ApprovalsRules',
        path: '/approvals/rules',
        component: () => import('#/views/factoryos/approvals/rules/index.vue'),
        meta: { title: '流程配置与规则' },
      },
    ],
  },
];

export default routes;
