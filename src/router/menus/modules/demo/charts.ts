import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: t('routes.demo.charts.charts'),
    path: '/charts',

    children: [
      {
        path: 'aMap',
        name: t('routes.demo.charts.aMap'),
      },

      {
        path: 'baiduMap',
        name: t('routes.demo.charts.baiduMap'),
      },
      {
        path: 'googleMap',
        name: t('routes.demo.charts.googleMap'),
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
