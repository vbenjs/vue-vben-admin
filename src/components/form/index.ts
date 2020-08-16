import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

export const BasicForm = getAsyncComponent(() => import('./src/BasicForm.vue'));

export * from './src/types/index';
export * from './src/types/form';
export * from './src/types/formItem';

export { useForm } from './src/useForm';
