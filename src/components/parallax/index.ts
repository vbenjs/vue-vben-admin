import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const Parallax = getAsyncComponent(() => import('./src/BasicParallax.vue'));
