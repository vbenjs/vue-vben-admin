import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 40,
  menu: {
    path: '/form',
    name: 'routes.demo.form.form',

    children: [
      {
        path: 'basic',
        name: 'routes.demo.form.basic',
      },
      {
        path: 'useForm',
        name: 'routes.demo.form.useForm',
      },
      {
        path: 'refForm',
        name: 'routes.demo.form.refForm',
      },
      {
        path: 'advancedForm',
        name: 'routes.demo.form.advancedForm',
      },
      {
        path: 'ruleForm',
        name: 'routes.demo.form.ruleForm',
      },
      {
        path: 'dynamicForm',
        name: 'routes.demo.form.dynamicForm',
      },
      {
        path: 'customerForm',
        name: 'routes.demo.form.customerForm',
      },
    ],
  },
};
export default menu;
