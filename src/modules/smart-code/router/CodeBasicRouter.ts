import { AppRouteRecordRaw } from '@/router/types';

export const CREATE_CODE_ROUTER: AppRouteRecordRaw = {
  path: '/codeCreateView',
  name: 'CodeCreateView',
  meta: {
    title: '生成代码',
  },
  component: () => import('/@/modules/codeGenerator/views/codeCreate/CodeCreateView.vue'),
  props: (route) => route.query,
};
