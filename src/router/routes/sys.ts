import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { USER_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '';

const layout: LayoutType = {
  component: USER_LAYOUT_COMPONENT,
  meta: {
    title: '系统相关',
  },
};
const routes: RouteConfigEx[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/sys/login/index.vue'),
    meta: {
      title: '用户登录',
      // 忽略权限
      ignoreAuth: true,
    },
  },
];

export default {
  routes,
  prefix,
  layout,
} as ModuleRouteConfig;
