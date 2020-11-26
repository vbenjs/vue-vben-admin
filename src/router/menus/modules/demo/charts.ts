import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: 'routes.demo.charts.charts',
    path: '/charts',
    children: [
      {
        path: 'apexChart',
        name: 'routes.demo.charts.apexChart',
      },
      {
        path: 'echarts',
        name: 'Echarts',
        children: [
          {
            path: 'map',
            name: 'routes.demo.charts.map',
          },
          {
            path: 'line',
            name: 'routes.demo.charts.line',
          },
          {
            path: 'pie',
            name: 'routes.demo.charts.pie',
          },
        ],
      },
    ],
  },
};
export default menu;
