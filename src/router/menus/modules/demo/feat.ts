import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 19,
  menu: {
    name: t('routes.demo.feat.feat'),
    path: '/feat',
    tag: {
      dot: true,
    },
    children: [
      {
        path: 'icon',
        name: t('routes.demo.feat.icon'),
      },
      {
        path: 'ws',
        name: t('routes.demo.feat.ws'),
      },
      {
        name: t('routes.demo.feat.sessionTimeout'),
        path: 'session-timeout',
        tag: {
          content: 'new',
        },
      },
      {
        path: 'tabs',
        name: t('routes.demo.feat.tabs'),
      },

      {
        path: 'context-menu',
        name: t('routes.demo.feat.contextMenu'),
      },
      {
        path: 'download',
        name: t('routes.demo.feat.download'),
      },
      {
        path: 'print',
        name: t('routes.demo.feat.print'),
      },
      {
        path: 'click-out-side',
        name: t('routes.demo.feat.clickOutSide'),
      },
      {
        path: 'img-preview',
        name: t('routes.demo.feat.imgPreview'),
      },
      {
        path: 'copy',
        name: t('routes.demo.feat.copy'),
      },
      {
        path: 'msg',
        name: t('routes.demo.feat.msg'),
      },
      {
        path: 'watermark',
        name: t('routes.demo.feat.watermark'),
      },
      {
        path: 'ripple',
        name: t('routes.demo.feat.ripple'),
      },
      {
        path: 'full-screen',
        name: t('routes.demo.feat.fullScreen'),
      },
      {
        path: 'error-log',
        name: t('routes.demo.feat.errorLog'),
      },

      {
        name: t('routes.demo.excel.excel'),
        path: 'excel',
        children: [
          {
            path: 'customExport',
            name: t('routes.demo.excel.customExport'),
          },
          {
            path: 'jsonExport',
            name: t('routes.demo.excel.jsonExport'),
          },
          {
            path: 'arrayExport',
            name: t('routes.demo.excel.arrayExport'),
          },
          {
            path: 'importExcel',
            name: t('routes.demo.excel.importExcel'),
          },
        ],
      },
      {
        name: t('routes.demo.feat.breadcrumb'),
        path: 'breadcrumb',

        children: [
          // {
          //   path: 'flat',
          //   name: t('routes.demo.feat.breadcrumbFlat'),
          // },
          // {
          //   path: 'flatDetail',
          //   name: t('routes.demo.feat.breadcrumbFlatDetail'),
          // },
          {
            path: 'children',
            name: t('routes.demo.feat.breadcrumbChildren'),
          },
        ],
      },
      {
        path: 'testTab',
        name: t('routes.demo.feat.tab'),
        children: [
          {
            path: 'id1',
            name: t('routes.demo.feat.tab1'),
          },
          {
            path: 'id2',
            name: t('routes.demo.feat.tab2'),
          },
        ],
      },
    ],
  },
};
export default menu;
