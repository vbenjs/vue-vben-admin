import { withInstall } from '../util';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const Authority = createAsyncComponent(() => import('./src/index.vue'));

withInstall(Authority);
