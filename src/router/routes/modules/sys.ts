import type { AppRouteRecordRaw } from '/@/router/types';

const routes: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: '登录',
  },
};

export default routes;
