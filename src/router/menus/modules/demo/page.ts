import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 20,
  menu: {
    name: t('routes.demo.page.page'),
    path: '/page-demo',

    children: [
      {
        path: 'form',
        name: t('routes.demo.page.form'),

        children: [
          {
            path: 'basic',
            name: t('routes.demo.page.formBasic'),
          },
          {
            path: 'step',
            name: t('routes.demo.page.formStep'),
          },
          {
            path: 'high',
            name: t('routes.demo.page.formHigh'),
          },
        ],
      },
      {
        path: 'desc',
        name: t('routes.demo.page.desc'),

        children: [
          {
            path: 'basic',
            name: t('routes.demo.page.descBasic'),
          },
          {
            path: 'high',
            name: t('routes.demo.page.descHigh'),
          },
        ],
      },
      {
        path: 'result',
        name: t('routes.demo.page.result'),

        children: [
          {
            path: 'success',
            name: t('routes.demo.page.resultSuccess'),
          },
          {
            path: 'fail',
            name: t('routes.demo.page.resultFail'),
          },
        ],
      },
      {
        path: 'exception',
        name: t('routes.demo.page.exception'),
        children: [
          {
            path: '403',
            name: t('403'),
          },
          {
            path: '404',
            name: t('404'),
          },
          {
            path: '500',
            name: t('500'),
          },
          {
            path: 'net-work-error',
            name: t('routes.demo.page.netWorkError'),
          },
          {
            path: 'not-data',
            name: t('routes.demo.page.notData'),
          },
        ],
      },
      {
        path: 'account',
        name: t('routes.demo.page.account'),
        children: [
          {
            path: 'center',
            name: t('routes.demo.page.accountCenter'),
          },
          {
            path: 'setting',
            name: t('routes.demo.page.accountSetting'),
          },
        ],
      },
      {
        path: 'list',
        name: t('routes.demo.page.list'),
        children: [
          {
            path: 'basic',
            name: t('routes.demo.page.listBasic'),
          },
          {
            path: 'card',
            name: t('routes.demo.page.listCard'),
          },
          {
            path: 'search',
            name: t('routes.demo.page.listSearch'),
          },
        ],
      },
    ],
  },
};
export default menu;
