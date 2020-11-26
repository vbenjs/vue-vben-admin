import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 19,
  menu: {
    name: 'routes.demo.feat.feat',
    path: '/feat',

    children: [
      {
        path: 'icon',
        name: 'routes.demo.feat.icon',
      },
      {
        path: 'tabs',
        name: 'routes.demo.feat.tabs',
      },
      {
        path: 'context-menu',
        name: 'routes.demo.feat.contextMenu',
      },
      {
        path: 'download',
        name: 'routes.demo.feat.download',
      },
      {
        path: 'click-out-side',
        name: 'routes.demo.feat.clickOutSide',
      },
      {
        path: 'img-preview',
        name: 'routes.demo.feat.imgPreview',
      },
      {
        path: 'copy',
        name: 'routes.demo.feat.copy',
      },
      {
        path: 'msg',
        name: 'routes.demo.feat.msg',
      },
      {
        path: 'watermark',
        name: 'routes.demo.feat.watermark',
      },
      {
        path: 'full-screen',
        name: 'routes.demo.feat.fullScreen',
      },
      {
        path: 'error-log',
        name: 'routes.demo.feat.errorLog',
      },
      {
        path: 'testTab',
        name: 'routes.demo.feat.tab',
        children: [
          {
            path: 'id1',
            name: 'routes.demo.feat.tab1',
          },
          {
            path: 'id2',
            name: 'routes.demo.feat.tab2',
          },
        ],
      },
    ],
  },
};
export default menu;
