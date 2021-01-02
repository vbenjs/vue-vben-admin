import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const QrCode = createAsyncComponent(() => import('./src/index.vue'));

export * from './src/types';
