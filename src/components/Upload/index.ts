import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const BasicUpload = createAsyncComponent(() => import('./src/BasicUpload.vue'));
