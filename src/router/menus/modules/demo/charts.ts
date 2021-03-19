import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: t('routes.demo.charts.charts'),
    path: '/charts',
    tag: {
      content: 'new',
    },
    children: [
      {
        path: 'aMap',
        name: t('routes.demo.charts.aMap'),
        tag: {
          dot: true,
        },
      },

      {
        path: 'baiduMap',
        name: t('routes.demo.charts.baiduMap'),
        tag: {
          dot: true,
        },
      },
      {
        path: 'googleMap',
        name: t('routes.demo.charts.googleMap'),
        tag: {
          dot: true,
        },
      },
      {
        path: 'apexChart',
        name: t('routes.demo.charts.apexChart'),
      },

      {
        path: 'echarts',
        name: 'Echarts',
        children: [
          {
            path: 'map',
            name: t('routes.demo.charts.map'),
          },
          {
            path: 'line',
            name: t('routes.demo.charts.line'),
          },
          {
            path: 'pie',
            name: t('routes.demo.charts.pie'),
          },
        ],
      },
    ],
  },
};
export default menu;
