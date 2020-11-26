import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const form: AppRouteModule = {
  layout: {
    path: '/form',
    name: 'FormDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/form/basic',
    meta: {
      icon: 'ant-design:table-outlined',
      title: 'routes.demo.form.form',
    },
  },

  routes: [
    {
      path: '/basic',
      name: 'FormBasicDemo',
      component: () => import('/@/views/demo/form/index.vue'),
      meta: {
        title: 'routes.demo.form.basic',
      },
    },
    {
      path: '/useForm',
      name: 'UseFormDemo',
      component: () => import('/@/views/demo/form/UseForm.vue'),
      meta: {
        title: 'routes.demo.form.useForm',
      },
    },
    {
      path: '/refForm',
      name: 'RefFormDemo',
      component: () => import('/@/views/demo/form/RefForm.vue'),
      meta: {
        title: 'routes.demo.form.refForm',
      },
    },
    {
      path: '/advancedForm',
      name: 'AdvancedFormDemo',
      component: () => import('/@/views/demo/form/AdvancedForm.vue'),
      meta: {
        title: 'routes.demo.form.advancedForm',
      },
    },
    {
      path: '/ruleForm',
      name: 'RuleFormDemo',
      component: () => import('/@/views/demo/form/RuleForm.vue'),
      meta: {
        title: 'routes.demo.form.ruleForm',
      },
    },
    {
      path: '/dynamicForm',
      name: 'DynamicFormDemo',
      component: () => import('/@/views/demo/form/DynamicForm.vue'),
      meta: {
        title: 'routes.demo.form.dynamicForm',
      },
    },
    {
      path: '/customerForm',
      name: 'CustomerFormDemo',
      component: () => import('/@/views/demo/form/CustomerForm.vue'),
      meta: {
        title: 'routes.demo.form.customerForm',
      },
    },
  ],
};
export default form;
