import './src/indicator';
import Loading from './src/index.vue';
import { withInstall } from '../util';

withInstall(Loading);
export { useLoading } from './src/useLoading';
export { createLoading } from './src/createLoading';

export { Loading };
