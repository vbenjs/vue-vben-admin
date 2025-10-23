import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:target-variant', order: 700, title: '目标与 BI' },
    name: 'GoalsBIRoot',
    path: '/goals-bi',
    redirect: '/goals-bi/chat',
    children: [
      {
        name: 'GoalsBIChat',
        path: '/goals-bi/chat',
        component: () => import('#/views/factoryos/goals-bi/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'GoalsManage',
        path: '/goals-bi/manage',
        component: () => import('#/views/factoryos/goals-bi/manage/index.vue'),
        meta: { title: '目标管理' },
      },
      {
        name: 'GoalsReview',
        path: '/goals-bi/review',
        component: () => import('#/views/factoryos/goals-bi/review/index.vue'),
        meta: { title: '目标审核' },
      },
      {
        name: 'BizMining',
        path: '/goals-bi/mining',
        component: () => import('#/views/factoryos/goals-bi/mining/index.vue'),
        meta: { title: '业务数据挖掘' },
      },
      {
        name: 'PromoGen',
        path: '/goals-bi/promo',
        component: () => import('#/views/factoryos/goals-bi/promo/index.vue'),
        meta: { title: '宣传材料生成' },
      },
      {
        name: 'BizDashboard',
        path: '/goals-bi/dashboard',
        component: () => import('#/views/factoryos/goals-bi/dashboard/index.vue'),
        meta: { title: '业务智能仪表盘' },
      },
    ],
  },
];

export default routes;
