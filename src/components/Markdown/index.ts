import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const MarkDown = createAsyncComponent(() => import('./src/index.vue'));

withInstall(MarkDown);

export * from './src/types';
