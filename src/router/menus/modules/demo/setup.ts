import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const setup: MenuModule = {
  orderNo: 90000,
  menu: {
    path: '/setup/index',
    name: t('routes.demo.setup.page'),
    tag: {
      content: 'new',
    },
  },
};
export default setup;
