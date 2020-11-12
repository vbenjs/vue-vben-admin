import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 19,
  menu: {
    name: '功能',
    path: '/feat',
    children: [
      {
        path: 'icon',
        name: '图标',
      },
      {
        path: 'tabs',
        name: '标签页操作',
      },
      {
        path: 'context-menu',
        name: '右键菜单',
      },
      {
        path: 'click-out-side',
        name: 'ClickOutSide',
      },
      {
        path: 'img-preview',
        name: '图片预览',
      },
      {
        path: 'i18n',
        name: '国际化',
      },
      {
        path: 'copy',
        name: '剪切板',
      },
      {
        path: 'msg',
        name: '消息提示',
      },
      {
        path: 'watermark',
        name: '水印',
      },
      {
        path: 'full-screen',
        name: '全屏',
      },
      {
        path: 'error-log',
        name: '错误日志',
      },
      {
        path: 'testTab',
        name: '带参Tab',
        children: [
          {
            path: 'id1',
            name: '带参tab1',
          },
          {
            path: 'id2',
            name: '带参tab2',
          },
        ],
      },
    ],
  },
};
export default menu;
