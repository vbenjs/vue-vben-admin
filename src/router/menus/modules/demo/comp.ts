import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 30,
  menu: {
    name: t('routes.demo.comp.comp'),
    path: '/comp',
    tag: {
      dot: true,
    },
    children: [
      {
        path: 'basic',
        name: t('routes.demo.comp.basic'),
      },
      {
        path: 'countTo',
        name: t('routes.demo.comp.countTo'),
      },
      {
        path: 'transition',
        name: t('routes.demo.comp.transition'),
      },

      {
        path: 'modal',
        name: t('routes.demo.comp.modal'),
      },
      {
        path: 'drawer',
        name: t('routes.demo.comp.drawer'),
      },
      {
        path: 'desc',
        name: t('routes.demo.comp.desc'),
      },
      {
        path: 'qrcode',
        name: t('routes.demo.comp.qrcode'),
      },
      {
        path: 'strength-meter',
        name: t('routes.demo.comp.strength'),
      },
      {
        path: 'upload',
        name: t('routes.demo.comp.upload'),
      },
      {
        path: 'loading',
        name: t('routes.demo.comp.loading'),
        tag: {
          content: 'new',
        },
      },
      {
        path: 'scroll',
        name: t('routes.demo.comp.scroll'),
        children: [
          {
            path: 'basic',
            name: t('routes.demo.comp.scrollBasic'),
          },
          {
            path: 'action',
            name: t('routes.demo.comp.scrollAction'),
          },
          {
            path: 'virtualScroll',
            name: t('routes.demo.comp.virtualScroll'),
          },
        ],
      },
      {
        path: 'lazy',
        name: t('routes.demo.comp.lazy'),
        children: [
          {
            path: 'basic',
            name: t('routes.demo.comp.lazyBasic'),
          },
          {
            path: 'transition',
            name: t('routes.demo.comp.lazyTransition'),
          },
        ],
      },
      {
        path: 'verify',
        name: t('routes.demo.comp.verify'),
        children: [
          {
            path: 'drag',
            name: t('routes.demo.comp.verifyDrag'),
          },
          {
            path: 'rotate',
            name: t('routes.demo.comp.verifyRotate'),
          },
        ],
      },
    ],
  },
};
export default menu;
