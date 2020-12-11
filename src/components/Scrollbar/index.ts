/**
 * copy from element-ui
 */

import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Scrollbar = createAsyncComponent(() => import('./src/Scrollbar'));

withInstall(Scrollbar);

export type { ScrollbarType } from './src/types';
