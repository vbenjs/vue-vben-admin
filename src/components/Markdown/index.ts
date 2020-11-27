import MarkDownLib from './src/index.vue';

import { withInstall } from '../util';

export * from './src/types';

export const MarkDown = withInstall(MarkDownLib);
