import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const Authority = getAsyncComponent(() => import('./src/index.vue'));
