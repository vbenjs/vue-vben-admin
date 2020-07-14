import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';
import { ExceptionEnum } from '@/enums/exceptionEnum';

const ExceptionPage = () => createAsyncComponent(import('@/views/sys/exception/index.vue'));

const prefix = '/exception';

const layout: LayoutType = {
  path: '/exception',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '异常页',
    icon: 'home|svg',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/404',
    name: 'Error404',
    component: ExceptionPage,
    props: {
      status: ExceptionEnum.PAGE_NOT_FOUND,
    },
    meta: {
      title: '404错误',
    },
  },
  {
    path: '/500',
    name: 'Error500',
    component: ExceptionPage,
    props: {
      status: ExceptionEnum.ERROR,
    },
    meta: {
      title: '500错误',
    },
  },
  {
    path: '/net-work-error',
    name: 'NetWorkError',
    component: ExceptionPage,
    props: {
      status: ExceptionEnum.NET_WORK_ERROR,
    },
    meta: {
      title: '网络错误',
    },
  },
  {
    path: '/page-time-out',
    name: 'PageTimeOut',
    component: ExceptionPage,
    props: {
      status: ExceptionEnum.PAGE_TIMEOUT,
    },
    meta: {
      title: '页面超时',
    },
  },
  {
    path: '/not-data',
    name: 'NotData',
    component: ExceptionPage,
    props: {
      status: ExceptionEnum.PAGE_NOT_DATA,
    },
    meta: {
      title: '页面无数据',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
