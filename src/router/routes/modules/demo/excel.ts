import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/excel',
    name: 'Excel',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/excel/customExport',
    meta: {
      icon: 'mdi:microsoft-excel',
      title: 'Excel',
    },
  },

  routes: [
    {
      path: '/customExport',
      name: 'CustomExport',
      component: () => import('/@/views/demo/excel/CustomExport.vue'),
      meta: {
        title: '选择导出格式',
      },
    },
    {
      path: '/jsonExport',
      name: 'JsonExport',
      component: () => import('/@/views/demo/excel/JsonExport.vue'),
      meta: {
        title: 'JSON数据导出',
      },
    },
    {
      path: '/arrayExport',
      name: 'ArrayExport',
      component: () => import('/@/views/demo/excel/ArrayExport.vue'),
      meta: {
        title: 'Array数据导出',
      },
    },
    {
      path: '/importExcel',
      name: 'ImportExcel',
      component: () => import('/@/views/demo/excel/ImportExcel.vue'),
      meta: {
        title: '导入',
      },
    },
  ],
} as AppRouteModule;
