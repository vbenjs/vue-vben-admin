import './src/indicator';
import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Loading = createAsyncComponent(() => import('./src/index.vue'));

withInstall(Loading);
export { useLoading } from './src/useLoading';
export { createLoading } from './src/createLoading';
