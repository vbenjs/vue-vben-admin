import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/form',
    name: 'FormDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/form/basic',
    meta: {
      icon: 'ant-design:table-outlined',
      title: 'Form',
    },
  },

  routes: [
    {
      path: '/basic',
      name: 'FormBasicDemo',
      component: () => import('/@/views/demo/form/index.vue'),
      meta: {
        title: '基础表单',
      },
    },
    {
      path: '/useForm',
      name: 'UseFormDemo',
      component: () => import('/@/views/demo/form/UseForm.vue'),
      meta: {
        title: 'useForm',
      },
    },
    {
      path: '/refForm',
      name: 'RefFormDemo',
      component: () => import('/@/views/demo/form/RefForm.vue'),
      meta: {
        title: 'RefForm',
      },
    },
    {
      path: '/advancedForm',
      name: 'AdvancedFormDemo',
      component: () => import('/@/views/demo/form/AdvancedForm.vue'),
      meta: {
        title: '可收缩表单',
      },
    },
    {
      path: '/ruleForm',
      name: 'RuleFormDemo',
      component: () => import('/@/views/demo/form/RuleForm.vue'),
      meta: {
        title: '表单验证',
      },
    },
    {
      path: '/dynamicForm',
      name: 'DynamicFormDemo',
      component: () => import('/@/views/demo/form/DynamicForm.vue'),
      meta: {
        title: '动态表单',
      },
    },
    {
      path: '/customerForm',
      name: 'CustomerFormDemo',
      component: () => import('/@/views/demo/form/CustomerForm.vue'),
      meta: {
        title: '自定义组件',
      },
    },
  ],
} as AppRouteModule;
