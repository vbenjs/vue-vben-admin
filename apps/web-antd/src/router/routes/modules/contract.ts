import type { RouteRecordRaw } from 'vue-router';

// 合同管理模块 - 顶层菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:file-signature',
      order: 40,
      title: '合同管理',
    },
    name: 'ContractManagement',
    path: '/contract',
    children: [
      {
        name: 'ContractLedger',
        path: '/contract/ledger',
        component: () => import('#/views/sys/contract/index.vue'),
        meta: { icon: 'lucide:file-signature', title: '合同台账' },
      },
      {
        name: 'ContractReceipt',
        path: '/contract/receipt',
        component: () => import('#/views/sys/contract-receipt/index.vue'),
        meta: { icon: 'lucide:badge-check', title: '合同到账' },
      },
    ],
  },
];

export default routes;
