import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: '图表',
    path: '/charts',
    children: [
      {
        path: 'apexChart',
        name: 'ApexChart',
      },
      {
        path: 'echarts',
        name: 'Echarts',
        children: [
          {
            path: 'map',
            name: '地图',
          },
          {
            path: 'line',
            name: '折线图',
          },
          {
            path: 'pie',
            name: '饼图',
          },
        ],
      },
    ],
  },
};
export default menu;
