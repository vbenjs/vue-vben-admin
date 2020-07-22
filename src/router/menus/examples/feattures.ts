import { NormMenuItem } from '@/router/types';

export const orderNo = 20;
export default {
  name: '页面功能',
  path: '/feat-demo',
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
    {
      name: '图片裁剪',
      path: '/image-crop',
    },
  ],
} as NormMenuItem;
