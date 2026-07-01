import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:layers-outline',
      keepAlive: true,
      order: 1000,
      title: $t('examples.title'),
    },
    name: 'Examples',
    path: '/examples',
    children: [
      {
        name: 'FormExample',
        path: 'form',
        meta: {
          icon: 'mdi:form-select',
          title: $t('examples.form.title'),
        },
        children: [
          {
            name: 'FormBasicExample',
            path: 'basic',
            component: () => import('#/views/examples/form/basic.vue'),
            meta: {
              title: $t('examples.form.basic'),
            },
          },
          {
            name: 'FormQueryExample',
            path: 'query',
            component: () => import('#/views/examples/form/query.vue'),
            meta: {
              title: $t('examples.form.query'),
            },
          },
          {
            name: 'FormValueFormatExample',
            path: 'value-format',
            component: () => import('#/views/examples/form/value-format.vue'),
            meta: {
              title: $t('examples.form.valueFormat'),
            },
          },
          {
            name: 'FormRulesExample',
            path: 'rules',
            component: () => import('#/views/examples/form/rules.vue'),
            meta: {
              title: $t('examples.form.rules'),
            },
          },
          {
            name: 'FormDynamicExample',
            path: 'dynamic',
            component: () => import('#/views/examples/form/dynamic.vue'),
            meta: {
              title: $t('examples.form.dynamic'),
            },
          },
          {
            name: 'FormLayoutExample',
            path: 'custom-layout',
            component: () => import('#/views/examples/form/custom-layout.vue'),
            meta: {
              title: $t('examples.form.layout'),
            },
          },
          {
            name: 'FormCustomExample',
            path: 'custom',
            component: () => import('#/views/examples/form/custom.vue'),
            meta: {
              title: $t('examples.form.custom'),
            },
          },
          {
            name: 'FormApiExample',
            path: 'api',
            component: () => import('#/views/examples/form/api.vue'),
            meta: {
              title: $t('examples.form.api'),
            },
          },
          {
            name: 'FormMergeExample',
            path: 'merge',
            component: () => import('#/views/examples/form/merge.vue'),
            meta: {
              title: $t('examples.form.merge'),
            },
          },
          {
            name: 'FormScrollToErrorExample',
            path: 'scroll-to-error-test',
            component: () =>
              import('#/views/examples/form/scroll-to-error-test.vue'),
            meta: {
              title: $t('examples.form.scrollToError'),
            },
          },
          {
            name: 'FormCollapsibleExample',
            path: 'collapsible-test',
            component: () => import('#/views/examples/form/collapsible.vue'),
            meta: {
              title: $t('examples.form.collapsible'),
            },
          },
        ],
      },
      {
        name: 'VxeTableExample',
        path: 'vxe-table',
        meta: {
          icon: 'lucide:table',
          title: $t('examples.vxeTable.title'),
        },
        children: [
          {
            name: 'VxeTableBasicExample',
            path: 'basic',
            component: () => import('#/views/examples/vxe-table/basic.vue'),
            meta: {
              title: $t('examples.vxeTable.basic'),
            },
          },
          {
            name: 'VxeTableRemoteExample',
            path: 'remote',
            component: () => import('#/views/examples/vxe-table/remote.vue'),
            meta: {
              title: $t('examples.vxeTable.remote'),
            },
          },
          {
            name: 'VxeTableTreeExample',
            path: 'tree',
            component: () => import('#/views/examples/vxe-table/tree.vue'),
            meta: {
              title: $t('examples.vxeTable.tree'),
            },
          },
          {
            name: 'VxeTableFixedExample',
            path: 'fixed',
            component: () => import('#/views/examples/vxe-table/fixed.vue'),
            meta: {
              title: $t('examples.vxeTable.fixed'),
            },
          },
          {
            name: 'VxeTableCustomCellExample',
            path: 'custom-cell',
            component: () =>
              import('#/views/examples/vxe-table/custom-cell.vue'),
            meta: {
              title: $t('examples.vxeTable.custom-cell'),
            },
          },
          {
            name: 'VxeTableFormExample',
            path: 'form',
            component: () => import('#/views/examples/vxe-table/form.vue'),
            meta: {
              title: $t('examples.vxeTable.form'),
            },
          },
          {
            name: 'VxeTableEditCellExample',
            path: 'edit-cell',
            component: () => import('#/views/examples/vxe-table/edit-cell.vue'),
            meta: {
              title: $t('examples.vxeTable.editCell'),
            },
          },
          {
            name: 'VxeTableEditRowExample',
            path: 'edit-row',
            component: () => import('#/views/examples/vxe-table/edit-row.vue'),
            meta: {
              title: $t('examples.vxeTable.editRow'),
            },
          },
          {
            name: 'VxeTableVirtualExample',
            path: 'virtual',
            component: () => import('#/views/examples/vxe-table/virtual.vue'),
            meta: {
              title: $t('examples.vxeTable.virtual'),
            },
          },
          {
            name: 'VxeTableViewedExample',
            path: 'viewed',
            component: () => import('#/views/examples/vxe-table/viewed.vue'),
            meta: {
              title: $t('examples.vxeTable.viewed'),
            },
          },
        ],
      },
      {
        name: 'CaptchaExample',
        path: 'captcha',
        meta: {
          icon: 'logos:recaptcha',
          title: $t('examples.captcha.title'),
        },
        children: [
          {
            name: 'DragVerifyExample',
            path: 'slider',
            component: () =>
              import('#/views/examples/captcha/slider-captcha.vue'),
            meta: {
              title: $t('examples.captcha.sliderCaptcha'),
            },
          },
          {
            name: 'RotateVerifyExample',
            path: 'slider-rotate',
            component: () =>
              import('#/views/examples/captcha/slider-rotate-captcha.vue'),
            meta: {
              title: $t('examples.captcha.sliderRotateCaptcha'),
            },
          },
          {
            name: 'TranslateVerifyExample',
            path: 'slider-translate',
            component: () =>
              import('#/views/examples/captcha/slider-translate-captcha.vue'),
            meta: {
              title: $t('examples.captcha.sliderTranslateCaptcha'),
            },
          },
          {
            name: 'CaptchaPointSelectionExample',
            path: 'point-selection',
            component: () =>
              import('#/views/examples/captcha/point-selection-captcha.vue'),
            meta: {
              title: $t('examples.captcha.pointSelection'),
            },
          },
        ],
      },
      {
        name: 'ModalExample',
        path: 'modal',
        component: () => import('#/views/examples/modal/index.vue'),
        meta: {
          icon: 'system-uicons:window-content',
          keepAlive: true,
          title: $t('examples.modal.title'),
        },
      },
      {
        name: 'DrawerExample',
        path: 'drawer',
        component: () => import('#/views/examples/drawer/index.vue'),
        meta: {
          icon: 'iconoir:drawer',
          keepAlive: true,
          title: $t('examples.drawer.title'),
        },
      },
      {
        name: 'EllipsisExample',
        path: 'ellipsis',
        component: () => import('#/views/examples/ellipsis/index.vue'),
        meta: {
          icon: 'ion:ellipsis-horizontal',
          title: $t('examples.ellipsis.title'),
        },
      },
      {
        name: 'VueResizeDemo',
        path: 'resize/basic',
        component: () => import('#/views/examples/resize/basic.vue'),
        meta: {
          icon: 'material-symbols:resize',
          title: $t('examples.resize.title'),
        },
      },
      {
        name: 'ColPageDemo',
        path: 'layout/col-page',
        component: () => import('#/views/examples/layout/col-page.vue'),
        meta: {
          badge: 'Alpha',
          badgeVariants: 'destructive',
          icon: 'material-symbols:horizontal-distribute',
          title: $t('examples.layout.col-page'),
        },
      },
      {
        name: 'TippyDemo',
        path: 'tippy',
        component: () => import('#/views/examples/tippy/index.vue'),
        meta: {
          icon: 'mdi:message-settings-outline',
          title: 'Tippy',
        },
      },
      {
        name: 'JsonViewer',
        path: 'json-viewer',
        component: () => import('#/views/examples/json-viewer/index.vue'),
        meta: {
          icon: 'tabler:json',
          title: 'JsonViewer',
        },
      },
      {
        name: 'Motion',
        path: 'motion',
        component: () => import('#/views/examples/motion/index.vue'),
        meta: {
          icon: 'mdi:animation-play',
          title: 'Motion',
        },
      },
      {
        name: 'CountTo',
        path: 'count-to',
        component: () => import('#/views/examples/count-to/index.vue'),
        meta: {
          icon: 'mdi:animation-play',
          title: 'CountTo',
        },
      },
      {
        name: 'Loading',
        path: 'loading',
        component: () => import('#/views/examples/loading/index.vue'),
        meta: {
          icon: 'mdi:circle-double',
          title: 'Loading',
        },
      },
      {
        name: 'ButtonGroup',
        path: 'button-group',
        component: () => import('#/views/examples/button-group/index.vue'),
        meta: {
          icon: 'mdi:check-circle',
          title: $t('examples.button-group.title'),
        },
      },
      {
        name: 'ContextMenu',
        path: 'context-menu',
        component: () => import('#/views/examples/context-menu/index.vue'),
        meta: {
          icon: 'mdi:menu',
          title: $t('examples.function.contentMenu'),
        },
      },
      {
        name: 'CropperDemo',
        path: 'cropper',
        component: () => import('#/views/examples/cropper/index.vue'),
        meta: {
          icon: 'mdi:crop',
          title: $t('examples.cropper.title'),
        },
      },
      {
        name: 'TiptapExample',
        path: 'tiptap',
        component: () => import('#/views/examples/tiptap/index.vue'),
        meta: {
          icon: 'lucide:square-pen',
          title: $t('examples.tiptap.title'),
        },
      },
    ],
  },
];

export default routes;
