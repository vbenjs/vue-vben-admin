import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const StrengthMeter = createAsyncComponent(() => import('./src/index.vue'));
