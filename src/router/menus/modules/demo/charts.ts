import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: t('routes.demo.charts.charts'),
    path: '/charts',
    children: [
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
