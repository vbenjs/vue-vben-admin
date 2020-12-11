import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicMenu = createAsyncComponent(() => import('./src/BasicMenu'), { loading: false });

withInstall(BasicMenu);
