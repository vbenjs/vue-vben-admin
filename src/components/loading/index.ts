import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as BasicLoading } from './src/BasicLoading.vue';
// export { default as FullLoading } from './src/FullLoading.vue';

export const BasicLoading = getAsyncComponent(() => import('./src/BasicLoading.vue'));
export const FullLoading = getAsyncComponent(() => import('./src/FullLoading.vue'));
