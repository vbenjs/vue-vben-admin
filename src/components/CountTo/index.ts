// Transform vue-count-to to support vue3 version

import CountToLib from './src/index.vue';
import { withInstall } from '../util';

export const CountTo = withInstall(CountToLib);
