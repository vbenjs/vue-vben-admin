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
      title: 'routes.demo.charts.charts',
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
            title: 'routes.demo.charts.map',
          },
        },
        {
          path: 'line',
          name: 'Line',
          component: () => import('/@/views/demo/echarts/Line.vue'),
          meta: {
            title: 'routes.demo.charts.line',
          },
        },
        {
          path: 'pie',
          name: 'Pie',
          component: () => import('/@/views/demo/echarts/Pie.vue'),
          meta: {
            title: 'routes.demo.charts.pie',
          },
        },
      ],
    },
    {
      path: '/apexChart',
      name: 'ApexChart',
      meta: {
        title: 'routes.demo.charts.apexChart',
      },
      component: () => import('/@/views/demo/echarts/apex/index.vue'),
    },
  ],
};

export default charts;
