import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: '页面功能',
    path: '/feat',
    children: [
      {
        path: '/tabs',
        name: '标签页操作',
      },
      {
        path: '/context-menu',
        name: '右键菜单',
      },
      {
        path: '/img-preview',
        name: '图片预览',
      },
      {
        path: '/i18n',
        name: '国际化',
      },
      {
        path: '/copy',
        name: '剪切板',
      },
      {
        path: '/msg',
        name: '消息提示',
      },
      {
        path: '/watermark',
        name: '水印',
      },
      {
        path: '/full-screen',
        name: '全屏',
      },
    ],
  },
};
export default menu;
