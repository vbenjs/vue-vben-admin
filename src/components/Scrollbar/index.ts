/**
 * copy from element-ui
 */

import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Scrollbar = createAsyncComponent(() => import('./src/index.vue'));

withInstall(Scrollbar);

export type { ScrollbarType } from './src/types';
