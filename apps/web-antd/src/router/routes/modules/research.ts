import type { RouteRecordRaw } from 'vue-router';

// 科研管理模块 - 顶层菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:flask-conical',
      order: 30,
      title: '科研管理',
    },
    name: 'ResearchManagement',
    path: '/research',
    children: [
      {
        name: 'ResearchProject',
        path: '/research/project',
        component: () => import('#/views/sys/research-project/index.vue'),
        meta: { icon: 'lucide:flask-conical', title: '科研项目' },
      },
      {
        name: 'ResearchFundArrival',
        path: '/research/fund-arrival',
        component: () => import('#/views/sys/research-fund-arrival/index.vue'),
        meta: { icon: 'lucide:banknote-arrow-down', title: '资金到账' },
      },
      {
        name: 'ResearchFundClaim',
        path: '/research/fund-claim',
        component: () => import('#/views/sys/research-fund-claim/index.vue'),
        meta: { icon: 'lucide:hand-coins', title: '资金认领' },
      },
      {
        name: 'ResearchIndicator',
        path: '/research/indicator',
        component: () => import('#/views/sys/research-indicator/index.vue'),
        meta: { icon: 'lucide:badge-dollar-sign', title: '科研指标' },
      },
      {
        name: 'ResearchExpenseScope',
        path: '/research/expense-scope',
        component: () => import('#/views/sys/research-expense-scope/index.vue'),
        meta: { icon: 'lucide:wallet-cards', title: '支出范围' },
      },
      {
        name: 'ResearchScopeAdjust',
        path: '/research/scope-adjust',
        component: () => import('#/views/sys/research-scope-adjust/index.vue'),
        meta: { icon: 'lucide:arrow-left-right', title: '范围调剂' },
      },
    ],
  },
];

export default routes;
