import { RouteConfigEx } from '@/router/type';
import { DEFAULT_LAYOUT_COMPONENT } from '@/router/constant';
import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
/**
 * @description: 主框架内路由
 */
export const mainInRoutes: RouteConfigEx = {
  path: '/',
  name: 'Index',
  component: DEFAULT_LAYOUT_COMPONENT,
  meta: {
    title: '首页',
  },
};

export const basicRoutes: RouteConfigEx[] = [
  {
    path: '*',
    name: 'Exception',
    component: DEFAULT_LAYOUT_COMPONENT,
    redirect: '/error-page',
    meta: {
      title: '异常',
    },
    children: [
      {
        path: '/error-page',
        name: 'ErrorPage',
        component: () => createAsyncComponent(import('@/views/sys/exception/index.vue')),
        meta: {
          title: '错误页',
        },
      },
    ],
  },
];
