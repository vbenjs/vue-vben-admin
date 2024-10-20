import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
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
        path: '/examples/form',
        meta: {
          icon: 'mdi:form-select',
          title: $t('examples.form.title'),
        },
        children: [
          {
            name: 'FormBasicExample',
            path: '/examples/form/basic',
            component: () => import('#/views/examples/form/basic.vue'),
            meta: {
              title: $t('examples.form.basic'),
            },
          },
          {
            name: 'FormQueryExample',
            path: '/examples/form/query',
            component: () => import('#/views/examples/form/query.vue'),
            meta: {
              title: $t('examples.form.query'),
            },
          },
          {
            name: 'FormRulesExample',
            path: '/examples/form/rules',
            component: () => import('#/views/examples/form/rules.vue'),
            meta: {
              title: $t('examples.form.rules'),
            },
          },
          {
            name: 'FormDynamicExample',
            path: '/examples/form/dynamic',
            component: () => import('#/views/examples/form/dynamic.vue'),
            meta: {
              title: $t('examples.form.dynamic'),
            },
          },
          {
            name: 'FormCustomExample',
            path: '/examples/form/custom',
            component: () => import('#/views/examples/form/custom.vue'),
            meta: {
              title: $t('examples.form.custom'),
            },
          },
          {
            name: 'FormApiExample',
            path: '/examples/form/api',
            component: () => import('#/views/examples/form/api.vue'),
            meta: {
              title: $t('examples.form.api'),
            },
          },
          {
            name: 'FormMergeExample',
            path: '/examples/form/merge',
            component: () => import('#/views/examples/form/merge.vue'),
            meta: {
              title: $t('examples.form.merge'),
            },
          },
        ],
      },
      {
        name: 'VxeTableExample',
        path: '/examples/vxe-table',
        meta: {
          icon: 'lucide:table',
          title: $t('examples.vxeTable.title'),
        },
        children: [
          {
            name: 'VxeTableBasicExample',
            path: '/examples/vxe-table/basic',
            component: () => import('#/views/examples/vxe-table/basic.vue'),
            meta: {
              title: $t('examples.vxeTable.basic'),
            },
          },
          {
            name: 'VxeTableRemoteExample',
            path: '/examples/vxe-table/remote',
            component: () => import('#/views/examples/vxe-table/remote.vue'),
            meta: {
              title: $t('examples.vxeTable.remote'),
            },
          },
          {
            name: 'VxeTableTreeExample',
            path: '/examples/vxe-table/tree',
            component: () => import('#/views/examples/vxe-table/tree.vue'),
            meta: {
              title: $t('examples.vxeTable.tree'),
            },
          },
          {
            name: 'VxeTableFixedExample',
            path: '/examples/vxe-table/fixed',
            component: () => import('#/views/examples/vxe-table/fixed.vue'),
            meta: {
              title: $t('examples.vxeTable.fixed'),
            },
          },
          {
            name: 'VxeTableCustomCellExample',
            path: '/examples/vxe-table/custom-cell',
            component: () =>
              import('#/views/examples/vxe-table/custom-cell.vue'),
            meta: {
              title: $t('examples.vxeTable.custom-cell'),
            },
          },
          {
            name: 'VxeTableFormExample',
            path: '/examples/vxe-table/form',
            component: () => import('#/views/examples/vxe-table/form.vue'),
            meta: {
              title: $t('examples.vxeTable.form'),
            },
          },
          {
            name: 'VxeTableEditCellExample',
            path: '/examples/vxe-table/edit-cell',
            component: () => import('#/views/examples/vxe-table/edit-cell.vue'),
            meta: {
              title: $t('examples.vxeTable.editCell'),
            },
          },
          {
            name: 'VxeTableEditRowExample',
            path: '/examples/vxe-table/edit-row',
            component: () => import('#/views/examples/vxe-table/edit-row.vue'),
            meta: {
              title: $t('examples.vxeTable.editRow'),
            },
          },
          {
            name: 'VxeTableVirtualExample',
            path: '/examples/vxe-table/virtual',
            component: () => import('#/views/examples/vxe-table/virtual.vue'),
            meta: {
              title: $t('examples.vxeTable.virtual'),
            },
          },
        ],
      },
      {
        name: 'CaptchaExample',
        path: '/examples/captcha',
        meta: {
          icon: 'logos:recaptcha',
          title: $t('examples.captcha.title'),
        },
        children: [
          {
            name: 'DragVerifyExample',
            path: '/examples/captcha/slider',
            component: () =>
              import('#/views/examples/captcha/slider-captcha.vue'),
            meta: {
              title: $t('examples.captcha.sliderCaptcha'),
            },
          },
          {
            name: 'RotateVerifyExample',
            path: '/examples/captcha/slider-rotate',
            component: () =>
              import('#/views/examples/captcha/slider-rotate-captcha.vue'),
            meta: {
              title: $t('examples.captcha.sliderRotateCaptcha'),
            },
          },
          {
            name: 'CaptchaPointSelectionExample',
            path: '/examples/captcha/point-selection',
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
        path: '/examples/modal',
        component: () => import('#/views/examples/modal/index.vue'),
        meta: {
          icon: 'system-uicons:window-content',
          title: $t('examples.modal.title'),
        },
      },
      {
        name: 'DrawerExample',
        path: '/examples/drawer',
        component: () => import('#/views/examples/drawer/index.vue'),
        meta: {
          icon: 'iconoir:drawer',
          title: $t('examples.drawer.title'),
        },
      },
      {
        name: 'EllipsisExample',
        path: '/examples/ellipsis',
        component: () => import('#/views/examples/ellipsis/index.vue'),
        meta: {
          icon: 'ion:ellipsis-horizontal',
          title: $t('examples.ellipsis.title'),
        },
      },
    ],
  },
];

export default routes;
