import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Dropdown = createAsyncComponent(() => import('./src/Dropdown'));

withInstall(Dropdown);
export * from './src/types';
