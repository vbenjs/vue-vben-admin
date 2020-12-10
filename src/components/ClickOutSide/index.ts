import { withInstall } from '../util';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const ClickOutSide = createAsyncComponent(() => import('./src/index.vue'));

withInstall(ClickOutSide);
