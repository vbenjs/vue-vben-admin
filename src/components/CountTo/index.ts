// Transform vue-count-to to support vue3 version

import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const CountTo = createAsyncComponent(() => import('./src/index.vue'));

withInstall(CountTo);
