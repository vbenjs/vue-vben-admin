import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const BaseHelp = getAsyncComponent(() => import('./src/Help.vue'));
export const BaseArrow = getAsyncComponent(() => import('./src/Arrow.vue'));
export const BaseTitle = getAsyncComponent(() => import('./src/Title.vue'));
