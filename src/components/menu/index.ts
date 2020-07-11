import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const BasicMenu = getAsyncComponent(() => import('./src/BasicMenu.vue'));

export { default as Sidebar } from './src/BasicMenu.vue';
export * from './src/type';
