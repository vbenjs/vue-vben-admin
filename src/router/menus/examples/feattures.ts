import { NormMenuItem } from '@/router/type';

export const orderNo = 20;
export default {
  name: '页面功能',
  path: '/feat',
  icon: 'home|svg',
  children: [
    {
      name: '标签页操作',
      path: '/multiple-tabs',
    },
    {
      name: '剪切板',
      path: '/copy',
    },
    {
      name: '水印',
      path: '/watermark',
    },
  ],
} as NormMenuItem;
