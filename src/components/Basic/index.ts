import { withInstall } from '../util';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicArrow = createAsyncComponent(() => import('./src/BasicArrow.vue'));
export const BasicHelp = createAsyncComponent(() => import('./src/BasicHelp.vue'));
export const BasicTitle = createAsyncComponent(() => import('./src/BasicTitle.vue'));

withInstall(BasicArrow, BasicHelp, BasicTitle);
