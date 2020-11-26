import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const feat: AppRouteModule = {
  layout: {
    path: '/feat',
    name: 'FeatDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/feat/icon',
    meta: {
      icon: 'ic:outline-featured-play-list',
      title: 'routes.demo.feat.feat',
    },
  },

  routes: [
    {
      path: '/icon',
      name: 'IconDemo',
      component: () => import('/@/views/demo/feat/icon/index.vue'),
      meta: {
        title: 'routes.demo.feat.icon',
      },
    },
    {
      path: '/tabs',
      name: 'TabsDemo',
      component: () => import('/@/views/demo/feat/tabs/index.vue'),
      meta: {
        title: 'routes.demo.feat.tabs',
      },
    },

    {
      path: '/context-menu',
      name: 'ContextMenuDemo',
      component: () => import('/@/views/demo/feat/context-menu/index.vue'),
      meta: {
        title: 'routes.demo.feat.contextMenu',
      },
    },
    {
      path: '/download',
      name: 'DownLoadDemo',
      component: () => import('/@/views/demo/feat/download/index.vue'),
      meta: {
        title: 'routes.demo.feat.download',
      },
    },
    {
      path: '/click-out-side',
      name: 'ClickOutSideDemo',
      component: () => import('/@/views/demo/feat/click-out-side/index.vue'),
      meta: {
        title: 'routes.demo.feat.clickOutSide',
      },
    },
    {
      path: '/img-preview',
      name: 'ImgPreview',
      component: () => import('/@/views/demo/feat/img-preview/index.vue'),
      meta: {
        title: 'routes.demo.feat.imgPreview',
      },
    },
    {
      path: '/copy',
      name: 'CopyDemo',
      component: () => import('/@/views/demo/feat/copy/index.vue'),
      meta: {
        title: 'routes.demo.feat.copy',
      },
    },
    {
      path: '/msg',
      name: 'MsgDemo',
      component: () => import('/@/views/demo/feat/msg/index.vue'),
      meta: {
        title: 'routes.demo.feat.msg',
      },
    },
    {
      path: '/watermark',
      name: 'WatermarkDemo',
      component: () => import('/@/views/demo/feat/watermark/index.vue'),
      meta: {
        title: 'routes.demo.feat.watermark',
      },
    },
    {
      path: '/full-screen',
      name: 'FullScreenDemo',
      component: () => import('/@/views/demo/feat/full-screen/index.vue'),
      meta: {
        title: 'routes.demo.feat.fullScreen',
      },
    },
    {
      path: '/error-log',
      name: 'ErrorLog',
      component: () => import('/@/views/sys/error-log/index.vue'),
      meta: {
        title: 'routes.demo.feat.errorLog',
      },
    },
    {
      path: '/testTab/:id',
      name: 'TestTab',
      component: () => import('/@/views/demo/feat/tab-params/index.vue'),
      meta: {
        title: 'routes.demo.feat.tab',
        carryParam: true,
      },
    },
  ],
};

export default feat;
