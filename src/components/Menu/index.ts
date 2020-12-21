import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicMenu = createAsyncComponent(() => import('./src/BasicMenu.vue'), {
  loading: false,
});

export const MenuTag = createAsyncComponent(() => import('./src/components/MenuItemTag.vue'), {
  loading: false,
});

withInstall(BasicMenu);
