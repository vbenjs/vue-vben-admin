import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const BasicDrawer = createAsyncComponent(() => import('./src/BasicDrawer'));

withInstall(BasicDrawer);
export * from './src/types';
export { useDrawer, useDrawerInner } from './src/useDrawer';
