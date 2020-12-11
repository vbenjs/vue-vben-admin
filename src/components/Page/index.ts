import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const PageFooter = createAsyncComponent(() => import('./src/PageFooter.vue'));

withInstall(PageFooter);
