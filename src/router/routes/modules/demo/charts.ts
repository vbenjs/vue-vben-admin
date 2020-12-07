import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';

const charts: AppRouteModule = {
  path: '/charts',
  name: 'Charts',
  component: LAYOUT,
  redirect: '/charts/apexChart',
  meta: {
    icon: 'vaadin:spline-area-chart',
    title: 'routes.demo.charts.charts',
  },
  children: [
    {
      path: 'echarts',
      name: 'Echarts',
      component: getParentLayout('Echarts'),
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
      path: 'apexChart',
      name: 'ApexChart',
      meta: {
        title: 'routes.demo.charts.apexChart',
      },
      component: () => import('/@/views/demo/echarts/apex/index.vue'),
    },
  ],
};

export default charts;
