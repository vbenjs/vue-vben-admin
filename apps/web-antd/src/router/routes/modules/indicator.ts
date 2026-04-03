import type { RouteRecordRaw } from 'vue-router';

// 指标管理模块 - 顶层菜单
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:bar-chart-3',
      order: 20,
      title: '指标管理',
    },
    name: 'IndicatorManagement',
    path: '/indicator',
    children: [
      {
        name: 'IndicatorBasicAccount',
        path: '/indicator/basic',
        component: () => import('#/views/sys/basic-indicator/index.vue'),
        meta: { icon: 'lucide:landmark', title: '基本户指标' },
      },
      {
        name: 'IndicatorProjectLevel1',
        path: '/indicator/project-level1',
        component: () => import('#/views/sys/project-level1/index.vue'),
        meta: { icon: 'lucide:folder-tree', title: '一级项目' },
      },
      {
        name: 'IndicatorProjectLevel2',
        path: '/indicator/project-level2',
        component: () => import('#/views/sys/project-level2/index.vue'),
        meta: { icon: 'lucide:folder-open', title: '二级项目' },
      },
      {
        name: 'IndicatorBudget',
        path: '/indicator/budget',
        component: () => import('#/views/sys/budget-indicator/index.vue'),
        meta: { icon: 'lucide:bar-chart-3', title: '部门指标' },
      },
      {
        name: 'IndicatorAuth',
        path: '/indicator/auth',
        component: () => import('#/views/sys/indicator-auth/index.vue'),
        meta: { icon: 'lucide:shield-check', title: '指标授权' },
      },
      {
        name: 'IndicatorAdjust',
        path: '/indicator/adjust',
        component: () => import('#/views/sys/indicator-adjust/index.vue'),
        meta: { icon: 'lucide:settings-2', title: '指标调整' },
      },
      {
        name: 'IndicatorTransfer',
        path: '/indicator/transfer',
        component: () => import('#/views/sys/indicator-transfer/index.vue'),
        meta: { icon: 'lucide:arrow-right-left', title: '指标调剂' },
      },
      {
        name: 'IndicatorAuthAdjustApply',
        path: '/indicator/auth-adjust-apply',
        component: () => import('#/views/sys/auth-adjust-apply/index.vue'),
        meta: { icon: 'lucide:file-plus-2', title: '授权调整申请' },
      },
      {
        name: 'IndicatorTemplate',
        path: '/indicator/template',
        component: () => import('#/views/sys/indicator-template/index.vue'),
        meta: { icon: 'lucide:layout-template', title: '指标模板' },
      },
    ],
  },
];

export default routes;
