import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as Description } from './src/index.vue';
export const Description = getAsyncComponent(() => import('./src/index.vue'));

export * from './src/type';
export { useDescription } from './src/useDescription';
