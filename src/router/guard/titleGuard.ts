import type { Router } from 'vue-router';

import { useGlobSetting } from '/@/hooks/setting';

import { setTitle } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';

import { REDIRECT_NAME } from '/@/router/constant';

const globSetting = useGlobSetting();

export function createTitleGuard(router: Router) {
  router.afterEach(async (to) => {
    const { t } = useI18n();
    to.name !== REDIRECT_NAME && setTitle(t(to.meta.title as string), globSetting.title);
    return true;
  });
}
