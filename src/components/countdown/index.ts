import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// export { default as CodeCountdown } from './src/CodeCountdown.vue';
// export { default as InputCountDown } from './src/InputCountDown.vue';

export const CodeCountdown = getAsyncComponent(() => import('./src/CodeCountdown.vue'));
export const InputCountDown = getAsyncComponent(() => import('./src/InputCountDown.vue'));
