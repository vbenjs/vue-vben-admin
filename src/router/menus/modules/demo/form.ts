import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 40,
  menu: {
    path: '/form',
    name: 'Form',

    children: [
      {
        path: 'basic',
        name: '基础表单',
      },
      {
        path: 'useForm',
        name: 'useForm',
      },
      {
        path: 'refForm',
        name: 'RefForm',
      },
      {
        path: 'advancedForm',
        name: '可收缩表单',
      },
      {
        path: 'ruleForm',
        name: '表单校验',
      },
      {
        path: 'dynamicForm',
        name: '动态表单',
      },
      {
        path: 'customerForm',
        name: '自定义组件',
      },
    ],
  },
};
export default menu;
