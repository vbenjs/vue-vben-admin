import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/charts',
    name: 'Charts',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/charts/apexChart',
    meta: {
      icon: 'ant-design:area-chart-outlined',
      title: '图表库',
    },
  },

  routes: [
    {
      path: '/echarts',
      name: 'Echarts',
      meta: {
        title: 'Echarts',
      },
      children: [
        {
          path: 'map',
          name: 'Map',
          component: () => import('/@/views/demo/echarts/Map.vue'),
          meta: {
            title: '地图',
          },
        },
        {
          path: 'line',
          name: 'Line',
          component: () => import('/@/views/demo/echarts/Line.vue'),
          meta: {
            title: '折线图',
          },
        },
        {
          path: 'pie',
          name: 'Pie',
          component: () => import('/@/views/demo/echarts/Pie.vue'),
          meta: {
            title: '饼图',
          },
        },
      ],
    },
    {
      path: '/apexChart',
      name: 'ApexChart',
      meta: {
        title: 'ApexChart',
      },
      component: () => import('/@/views/demo/echarts/apex/index.vue'),
    },
    // {
    //   path: '/excel',
    //   name: 'ExcelDemo',
    //   redirect: '/charts/excel/export',
    //   meta: {
    //     title: 'excel',
    //   },
    //   children: [
    {
      path: '/customExport',
      name: 'CustomExport',
      component: () => import('/@/views/demo/echarts/excel/CustomExport.vue'),
      meta: {
        title: '选择导出格式',
      },
    },
    {
      path: '/jsonExport',
      name: 'JsonExport',
      component: () => import('/@/views/demo/echarts/excel/JsonExport.vue'),
      meta: {
        title: 'JSON数据导出',
      },
    },
    {
      path: '/arrayExport',
      name: 'ArrayExport',
      component: () => import('/@/views/demo/echarts/excel/ArrayExport.vue'),
      meta: {
        title: 'Array数据导出',
      },
    },
    {
      path: '/importExcel',
      name: 'ImportExcel',
      component: () => import('/@/views/demo/echarts/excel/ImportExcel.vue'),
      meta: {
        title: '导入',
      },
    },
    //   ],
    // },
  ],
} as AppRouteModule;
