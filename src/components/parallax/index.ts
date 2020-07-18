import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as CollapseTransition } from './src/Collapse.vue';

export const Parallax = getAsyncComponent(() => import('./src/BasicParallax.vue'));
