import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const PageFooter = createAsyncComponent(() => import('./src/PageFooter.vue'));

export { default as PageWrapper } from './src/PageWrapper.vue';
