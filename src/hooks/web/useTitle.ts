import { useI18n } from '/@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';

import { REDIRECT_NAME } from '/@/router/constant';
import { listenerLastChangeTab } from '/@/logics/mitt/tabChange';

export function useTitle() {
  const { title } = useGlobSetting();
  const { t } = useI18n();

  const pageTitle = usePageTitle();

  listenerLastChangeTab((route) => {
    if (route.name === REDIRECT_NAME) {
      return;
    }

    const tTitle = t(route?.meta?.title as string);
    pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;
  });
}
