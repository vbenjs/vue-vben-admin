import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const MarkDown = createAsyncComponent(() => import('./src/index.vue'));

export * from './src/types';
