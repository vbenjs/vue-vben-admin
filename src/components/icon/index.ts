// import Vue, { VueConstructor } from 'compatible-vue';
import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as Icon } from './src/index.vue';
// export { default as SvgIcon } from './src/SvgIcon.vue';

export const Icon = getAsyncComponent(() => import('./src/index.vue'));
export const SvgIcon = getAsyncComponent(() => import('./src/SvgIcon.vue'));
