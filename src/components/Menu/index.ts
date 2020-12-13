import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicMenu = createAsyncComponent(() => import('./src/BasicMenu.vue'), {
  loading: false,
});

withInstall(BasicMenu);
