// export { default as Description } from './src/index.vue';
import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export * from './src/type';
export { useDescription } from './src/useDescription';

export const Description = getAsyncComponent(() => import('./src/index.vue'));
