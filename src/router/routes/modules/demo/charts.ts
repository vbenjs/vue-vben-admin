import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const charts: AppRouteModule = {
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
  ],
};

export default charts;
