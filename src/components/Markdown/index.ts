import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const MarkDown = createAsyncComponent(() => import('./src/Markdown.vue'));

export * from './src/types';
