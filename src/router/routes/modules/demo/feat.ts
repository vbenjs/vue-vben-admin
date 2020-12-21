import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const feat: AppRouteModule = {
  path: '/feat',
  name: 'FeatDemo',
  component: LAYOUT,
  redirect: '/feat/icon',
  meta: {
    icon: 'ic:outline-featured-play-list',
    title: t('routes.demo.feat.feat'),
  },
  children: [
    {
      path: 'icon',
      name: 'IconDemo',
      component: () => import('/@/views/demo/feat/icon/index.vue'),
      meta: {
        title: t('routes.demo.feat.icon'),
      },
    },
    {
      path: 'tabs',
      name: 'TabsDemo',
      component: () => import('/@/views/demo/feat/tabs/index.vue'),
      meta: {
        title: t('routes.demo.feat.tabs'),
      },
    },

    {
      path: 'context-menu',
      name: 'ContextMenuDemo',
      component: () => import('/@/views/demo/feat/context-menu/index.vue'),
      meta: {
        title: t('routes.demo.feat.contextMenu'),
      },
    },
    {
      path: 'download',
      name: 'DownLoadDemo',
      component: () => import('/@/views/demo/feat/download/index.vue'),
      meta: {
        title: t('routes.demo.feat.download'),
      },
    },
    {
      path: 'click-out-side',
      name: 'ClickOutSideDemo',
      component: () => import('/@/views/demo/feat/click-out-side/index.vue'),
      meta: {
        title: t('routes.demo.feat.clickOutSide'),
      },
    },
    {
      path: 'img-preview',
      name: 'ImgPreview',
      component: () => import('/@/views/demo/feat/img-preview/index.vue'),
      meta: {
        title: t('routes.demo.feat.imgPreview'),
      },
    },
    {
      path: 'copy',
      name: 'CopyDemo',
      component: () => import('/@/views/demo/feat/copy/index.vue'),
      meta: {
        title: t('routes.demo.feat.copy'),
      },
    },
    {
      path: 'msg',
      name: 'MsgDemo',
      component: () => import('/@/views/demo/feat/msg/index.vue'),
      meta: {
        title: t('routes.demo.feat.msg'),
      },
    },
    {
      path: 'watermark',
      name: 'WatermarkDemo',
      component: () => import('/@/views/demo/feat/watermark/index.vue'),
      meta: {
        title: t('routes.demo.feat.watermark'),
      },
    },
    {
      path: 'ripple',
      name: 'RippleDemo',
      component: () => import('/@/views/demo/feat/ripple/index.vue'),
      meta: {
        title: t('routes.demo.feat.ripple'),
      },
    },
    {
      path: 'full-screen',
      name: 'FullScreenDemo',
      component: () => import('/@/views/demo/feat/full-screen/index.vue'),
      meta: {
        title: t('routes.demo.feat.fullScreen'),
      },
    },
    {
      path: 'error-log',
      name: 'ErrorLog',
      component: () => import('/@/views/sys/error-log/index.vue'),
      meta: {
        title: t('routes.demo.feat.errorLog'),
      },
    },
    {
      path: 'excel',
      name: 'Excel',
      redirect: '/feat/excel/customExport',
      component: getParentLayout('Excel'),
      meta: {
        // icon: 'mdi:microsoft-excel',
        title: t('routes.demo.excel.excel'),
      },

      children: [
        {
          path: 'customExport',
          name: 'CustomExport',
          component: () => import('/@/views/demo/excel/CustomExport.vue'),
          meta: {
            title: t('routes.demo.excel.customExport'),
          },
        },
        {
          path: 'jsonExport',
          name: 'JsonExport',
          component: () => import('/@/views/demo/excel/JsonExport.vue'),
          meta: {
            title: t('routes.demo.excel.jsonExport'),
          },
        },
        {
          path: 'arrayExport',
          name: 'ArrayExport',
          component: () => import('/@/views/demo/excel/ArrayExport.vue'),
          meta: {
            title: t('routes.demo.excel.arrayExport'),
          },
        },
        {
          path: 'importExcel',
          name: 'ImportExcel',
          component: () => import('/@/views/demo/excel/ImportExcel.vue'),
          meta: {
            title: t('routes.demo.excel.importExcel'),
          },
        },
      ],
    },
    {
      path: 'testTab/:id',
      name: 'TestTab',
      component: () => import('/@/views/demo/feat/tab-params/index.vue'),
      meta: {
        title: t('routes.demo.feat.tab'),
        carryParam: true,
      },
    },
  ],
};

export default feat;
