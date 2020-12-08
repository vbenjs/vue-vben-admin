import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 1000,
  menu: {
    name: t('routes.demo.iframe.frame'),
    path: '/frame',
    children: [
      {
        path: 'antv',
        name: t('routes.demo.iframe.antv'),
      },
      {
        path: 'doc',
        name: t('routes.demo.iframe.doc'),
      },
      {
        path: 'https://vvbin.cn/doc-next/',
        name: t('routes.demo.iframe.docExternal'),
      },
    ],
  },
};
export default menu;
