import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const excel: AppRouteModule = {
  path: '/excel',
  name: 'Excel',
  component: LAYOUT,
  redirect: '/excel/customExport',
  meta: {
    icon: 'mdi:microsoft-excel',
    title: 'routes.demo.excel.excel',
  },

  children: [
    {
      path: 'customExport',
      name: 'CustomExport',
      component: () => import('/@/views/demo/excel/CustomExport.vue'),
      meta: {
        title: 'routes.demo.excel.customExport',
      },
    },
    {
      path: 'jsonExport',
      name: 'JsonExport',
      component: () => import('/@/views/demo/excel/JsonExport.vue'),
      meta: {
        title: 'routes.demo.excel.jsonExport',
      },
    },
    {
      path: 'arrayExport',
      name: 'ArrayExport',
      component: () => import('/@/views/demo/excel/ArrayExport.vue'),
      meta: {
        title: 'routes.demo.excel.arrayExport',
      },
    },
    {
      path: 'importExcel',
      name: 'ImportExcel',
      component: () => import('/@/views/demo/excel/ImportExcel.vue'),
      meta: {
        title: 'routes.demo.excel.importExcel',
      },
    },
  ],
};

export default excel;
