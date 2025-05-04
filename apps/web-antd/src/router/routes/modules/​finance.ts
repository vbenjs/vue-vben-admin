import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi-light:chart-bar',
      order: 6,
      title: $t('finance.title'),
    },
    name: 'Finance',
    path: '/finance',
    children: [
      {
        name: 'BankRecord',
        path: '/finance/bankRecord',
        component: () => import('#/views/finance/bankRecord/index.vue'),
        meta: {
          title: $t('finance.bankRecord'),
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
