import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Description = createAsyncComponent(() => import('./src/index'));

withInstall(Description);

export * from './src/types';
export { useDescription } from './src/useDescription';
