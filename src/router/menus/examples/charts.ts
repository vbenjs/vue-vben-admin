import { NormMenuItem } from '@/router/type';

export const orderNo = 100;
export default {
  name: '图表',
  path: '/chart',
  icon: 'home|svg',
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
  ],
} as NormMenuItem;
