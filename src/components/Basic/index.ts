import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import BasicArrow from './src/BasicArrow.vue';

export { BasicArrow };

// export const BasicArrow = createAsyncComponent(() => import('./src/BasicArrow.vue'));
export const BasicHelp = createAsyncComponent(() => import('./src/BasicHelp.vue'));
export const BasicTitle = createAsyncComponent(() => import('./src/BasicTitle.vue'));
