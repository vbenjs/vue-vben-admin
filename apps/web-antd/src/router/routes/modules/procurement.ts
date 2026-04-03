import type { RouteRecordRaw } from 'vue-router';

// 采购管理模块 - 顶层菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-cart',
      order: 50,
      title: '采购管理',
    },
    name: 'ProcurementManagement',
    path: '/procurement',
    children: [
      {
        name: 'ProcurementApply',
        path: '/procurement/apply',
        component: () => import('#/views/sys/procurement-apply/index.vue'),
        meta: { icon: 'lucide:shopping-cart', title: '采购申报' },
      },
      {
        name: 'ProcurementResult',
        path: '/procurement/result',
        component: () => import('#/views/sys/procurement-result/index.vue'),
        meta: { icon: 'lucide:clipboard-check', title: '采购结果' },
      },
      {
        name: 'ProcurementBidNotice',
        path: '/procurement/bid-notice',
        component: () => import('#/views/sys/bid-notice/index.vue'),
        meta: { icon: 'lucide:megaphone', title: '招标公告' },
      },
    ],
  },
];

export default routes;
