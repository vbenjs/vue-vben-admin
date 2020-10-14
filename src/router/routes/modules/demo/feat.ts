import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/feat',
    name: 'FeatDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/feat/icon',
    meta: {
      icon: 'ic:outline-featured-play-list',
      title: '页面功能',
    },
  },

  routes: [
    {
      path: '/icon',
      name: 'IconDemo',
      component: () => import('/@/views/demo/comp/icon/index.vue'),
      meta: {
        title: '图标',
      },
    },
    {
      path: '/tabs',
      name: 'TabsDemo',
      component: () => import('/@/views/demo/feat/tabs/index.vue'),
      meta: {
        title: '标签页操作',
      },
    },

    {
      path: '/context-menu',
      name: 'ContextMenuDemo',
      component: () => import('/@/views/demo/feat/context-menu/index.vue'),
      meta: {
        title: '右键菜单',
      },
    },
    {
      path: '/click-out-side',
      name: 'ClickOutSideDemo',
      component: () => import('/@/views/demo/comp/click-out-side/index.vue'),
      meta: {
        title: 'ClickOutSide组件',
      },
    },
    {
      path: '/img-preview',
      name: 'ImgPreview',
      component: () => import('/@/views/demo/feat/img-preview/index.vue'),
      meta: {
        title: '图片预览',
      },
    },
    {
      path: '/copy',
      name: 'CopyDemo',
      component: () => import('/@/views/demo/feat/copy/index.vue'),
      meta: {
        title: '剪切板',
      },
    },
    {
      path: '/msg',
      name: 'MsgDemo',
      component: () => import('/@/views/demo/feat/msg/index.vue'),
      meta: {
        title: '消息提示',
      },
    },
    {
      path: '/i18n',
      name: 'I18nDemo',
      component: () => import('/@/views/demo/feat/i18n/index.vue'),
      meta: {
        title: '国际化',
      },
    },
    {
      path: '/watermark',
      name: 'WatermarkDemo',
      component: () => import('/@/views/demo/feat/watermark/index.vue'),
      meta: {
        title: '水印',
      },
    },
    {
      path: '/full-screen',
      name: 'FullScreenDemo',
      component: () => import('/@/views/demo/feat/full-screen/index.vue'),
      meta: {
        title: '全屏',
      },
    },
    {
      path: '/testTab/:id',
      name: 'TestTab',
      component: () => import('/@/views/demo/feat/tab-params/index.vue'),
      meta: {
        title: 'Tab带参',
        carryParam: true,
      },
    },
  ],
} as AppRouteModule;
