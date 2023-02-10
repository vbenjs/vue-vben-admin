import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const permission: AppRouteModule = {
  path: '/form-designer',
  name: 'Form-designer',
  component: LAYOUT,
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: '表单设计',
  },
  children: [
    {
      path: 'design',
      name: 'Design',
      meta: {
        title: '表单设计',
      },
      component: () => import('/@/views/form-design/index.vue'),
    },
    {
      path: 'example1',
      name: 'Example1',
      meta: {
        title: '示例',
      },
      component: () => import('/@/views/form-design/examples/baseForm.vue'),
    },
  ],
};

export default permission;
