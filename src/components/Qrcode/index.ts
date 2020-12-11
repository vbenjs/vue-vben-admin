import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const QrCode = createAsyncComponent(() => import('./src/index.vue'));

withInstall(QrCode);
export * from './src/types';
