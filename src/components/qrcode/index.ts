import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const QrCode = getAsyncComponent(() => import('./src/index.vue'));

export * from './src/types';
