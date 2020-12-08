import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 40,
  menu: {
    path: '/form',
    name: t('routes.demo.form.form'),

    children: [
      {
        path: 'basic',
        name: t('routes.demo.form.basic'),
      },
      {
        path: 'useForm',
        name: t('routes.demo.form.useForm'),
      },
      {
        path: 'refForm',
        name: t('routes.demo.form.refForm'),
      },
      {
        path: 'advancedForm',
        name: t('routes.demo.form.advancedForm'),
      },
      {
        path: 'ruleForm',
        name: t('routes.demo.form.ruleForm'),
      },
      {
        path: 'dynamicForm',
        name: t('routes.demo.form.dynamicForm'),
      },
      {
        path: 'customerForm',
        name: t('routes.demo.form.customerForm'),
      },
    ],
  },
};
export default menu;
