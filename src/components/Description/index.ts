import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const Description = createAsyncComponent(() => import('./src/index'));

export * from './src/types';
export { useDescription } from './src/useDescription';
