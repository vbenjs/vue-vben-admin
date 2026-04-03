import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:wallet',
      order: 90,
      title: '财务管理',
    },
    name: 'FinanceManagement',
    path: '/finance',
    children: [
      {
        name: 'FinanceReimbursementApply',
        path: '/finance/reimbursement-apply',
        component: () => import('#/views/sys/expense-claim/index.vue'),
        meta: {
          icon: 'lucide:file-plus-2',
          title: '报账申请',
        },
      },
      {
        name: 'FinanceReimbursement',
        path: '/finance/reimbursement',
        component: () => import('#/views/finance/reimbursement/index.vue'),
        meta: {
          icon: 'lucide:receipt-text',
          title: '报销单查询',
        },
      },
      {
        name: 'FinanceReimbursementAudit',
        path: '/finance/reimbursement-audit',
        component: () => import('#/views/finance/reimbursement-audit/index.vue'),
        meta: {
          icon: 'lucide:clipboard-check',
          title: '报账审核台',
        },
      },
      {
        name: 'FinanceIncomeSettlement',
        path: '/finance/income-settlement',
        component: () => import('#/views/finance/income-settlement/index.vue'),
        meta: {
          icon: 'lucide:receipt',
          title: '收入结算单',
        },
      },
      {
        name: 'FinanceInvoiceFolder',
        path: '/finance/invoice-folder',
        component: () => import('#/views/finance/invoice-folder/index.vue'),
        meta: {
          icon: 'lucide:folder-open-dot',
          title: '发票夹',
        },
      },
      {
        name: 'FinancePayment',
        path: '/finance/payment',
        component: () => import('#/views/finance/payment/index.vue'),
        meta: {
          icon: 'lucide:banknote-arrow-up',
          title: '支付单查询',
        },
      },
      {
        name: 'FinanceVoucher',
        path: '/finance/voucher',
        component: () => import('#/views/finance/voucher/index.vue'),
        meta: {
          icon: 'lucide:file-text',
          title: '凭证查询',
        },
      },
    ],
  },
];

export default routes;
