import { NormMenuItem } from '@/router/types';

export const orderNo = 200;
export default {
  name: '图表',
  path: '/chart',

  children: [
    {
      name: '折线图',
      path: '/line',
    },
    {
      name: '柱状图',
      path: '/bar',
    },
    {
      name: '饼图',
      path: '/pie',
    },
    {
      name: '地图',
      path: '/map',
    },
    {
      name: '百度地图',
      path: '/baidu-map',
    },
  ],
} as NormMenuItem;
