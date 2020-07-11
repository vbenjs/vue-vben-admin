import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const Pagination = getAsyncComponent(() => import('./src/index.vue'));

// export { default as Pagination } from './src/index.vue';
