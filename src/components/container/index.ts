import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as ScrollContainer } from './src/ScrollContainer.vue';
// export { default as CollapseContainer } from './src/CollapseContainer.vue';

export const CollapseContainer = getAsyncComponent(() => import('./src/CollapseContainer.vue'));
export const ScrollContainer = getAsyncComponent(() => import('./src/ScrollContainer.vue'));

export * from './src/types';
