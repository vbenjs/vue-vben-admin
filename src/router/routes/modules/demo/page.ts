import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';
import { ExceptionEnum } from '/@/enums/exceptionEnum';

const ExceptionPage = () => import('/@/views/sys/exception/Exception');

const page: AppRouteModule = {
  path: '/page-demo',
  name: 'PageDemo',
  component: PAGE_LAYOUT_COMPONENT,
  redirect: '/page-demo/exception',
  meta: {
    icon: 'mdi:page-next-outline',
    title: 'routes.demo.page.page',
  },
  children: [
    // =============================form start=============================
    {
      path: '/form',
      name: 'FormPage',
      redirect: '/page-demo/form/basic',
      meta: {
        title: 'routes.demo.page.form',
      },
      children: [
        {
          path: 'basic',
          name: 'FormBasicPage',
          component: () => import('/@/views/demo/page/form/basic/index.vue'),
          meta: {
            title: 'routes.demo.page.formBasic',
          },
        },
        {
          path: 'step',
          name: 'FormStepPage',
          component: () => import('/@/views/demo/page/form/step/index.vue'),
          meta: {
            title: 'routes.demo.page.formStep',
          },
        },
        {
          path: 'high',
          name: 'FormHightPage',
          component: () => import('/@/views/demo/page/form/high/index.vue'),
          meta: {
            title: 'routes.demo.page.formHigh',
          },
        },
      ],
    },
    // =============================form end=============================
    // =============================desc start=============================
    {
      path: '/desc',
      name: 'DescPage',
      redirect: '/page-demo/desc/basic',
      meta: {
        title: 'routes.demo.page.desc',
      },
      children: [
        {
          path: 'basic',
          name: 'DescBasicPage',
          component: () => import('/@/views/demo/page/desc/basic/index.vue'),
          meta: {
            title: 'routes.demo.page.descBasic',
          },
        },
        {
          path: 'high',
          name: 'DescHighPage',
          component: () => import('/@/views/demo/page/desc/high/index.vue'),
          meta: {
            title: 'routes.demo.page.descHigh',
          },
        },
      ],
    },
    // =============================desc end=============================

    // =============================result start=============================
    {
      path: '/result',
      name: 'ResultPage',
      redirect: '/page-demo/result/success',
      meta: {
        title: 'routes.demo.page.result',
      },
      children: [
        {
          path: 'success',
          name: 'ResultSuccessPage',
          component: () => import('/@/views/demo/page/result/success/index.vue'),
          meta: {
            title: 'routes.demo.page.resultSuccess',
          },
        },
        {
          path: 'fail',
          name: 'ResultFailPage',
          component: () => import('/@/views/demo/page/result/fail/index.vue'),
          meta: {
            title: 'routes.demo.page.resultFail',
          },
        },
      ],
    },
    // =============================result end=============================

    // =============================account start=============================
    {
      path: '/account',
      name: 'AccountPage',
      redirect: '/page-demo/account/setting',
      meta: {
        title: 'routes.demo.page.account',
      },
      children: [
        {
          path: 'center',
          name: 'AccountCenterPage',
          component: () => import('/@/views/demo/page/account/center/index.vue'),
          meta: {
            title: 'routes.demo.page.accountCenter',
          },
        },
        {
          path: 'setting',
          name: 'AccountSettingPage',
          component: () => import('/@/views/demo/page/account/setting/index.vue'),
          meta: {
            title: 'routes.demo.page.accountSetting',
          },
        },
      ],
    },
    // =============================account end=============================
    // =============================exception start=============================
    {
      path: '/exception',
      name: 'ExceptionPage',
      redirect: '/page-demo/exception/404',
      meta: {
        title: 'routes.demo.page.exception',
      },
      children: [
        {
          path: '403',
          name: 'PageNotAccess',
          component: ExceptionPage,
          props: {
            status: ExceptionEnum.PAGE_NOT_ACCESS,
          },
          meta: {
            title: '403',
            afterCloseLoading: true,
          },
        },
        {
          path: '404',
          name: 'PageNotFound',
          component: ExceptionPage,
          props: {
            status: ExceptionEnum.PAGE_NOT_FOUND,
          },
          meta: {
            title: '404',
            afterCloseLoading: true,
          },
        },
        {
          path: '500',
          name: 'ServiceError',
          component: ExceptionPage,
          props: {
            status: ExceptionEnum.ERROR,
          },
          meta: {
            title: '500',
            afterCloseLoading: true,
          },
        },
        {
          path: 'net-work-error',
          name: 'NetWorkError',
          component: ExceptionPage,
          props: {
            status: ExceptionEnum.NET_WORK_ERROR,
          },
          meta: {
            title: 'routes.demo.page.netWorkError',
            afterCloseLoading: true,
          },
        },
        {
          path: 'not-data',
          name: 'NotData',
          component: ExceptionPage,
          props: {
            status: ExceptionEnum.PAGE_NOT_DATA,
          },
          meta: {
            title: 'routes.demo.page.notData',
            afterCloseLoading: true,
          },
        },
      ],
    },
    // =============================exception end=============================
    // =============================list start=============================
    {
      path: '/list',
      name: 'ListPage',
      redirect: '/page-demo/list/card',
      meta: {
        title: 'routes.demo.page.list',
      },
      children: [
        {
          path: 'card',
          name: 'ListCardPage',
          component: () => import('/@/views/demo/page/list/card/index.vue'),
          meta: {
            title: 'routes.demo.page.listCard',
          },
        },
      ],
    },
    // =============================list end=============================
  ],
};

export default page;
