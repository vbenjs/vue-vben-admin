import './src/indicator';
import LoadingLib from './src/index.vue';
import { withInstall } from '../util';

export { useLoading } from './src/useLoading';
export { createLoading } from './src/createLoading';

export const Loading = withInstall(LoadingLib);
