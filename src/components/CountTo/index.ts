// Transform vue-count-to to support vue3 version

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const CountTo = createAsyncComponent(() => import('./src/index.vue'));
