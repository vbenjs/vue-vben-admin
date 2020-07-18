import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as CollapseTransition } from './src/Collapse.vue';

export const CollapseTransition = getAsyncComponent(() => import('./src/CollapseTransition.vue'));
