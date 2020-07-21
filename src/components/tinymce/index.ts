import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const Tinymce = getAsyncComponent(() => import('./src/index.vue'));
