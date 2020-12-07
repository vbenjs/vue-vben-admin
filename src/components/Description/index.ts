import Description from './src/index';

import { withInstall } from '../util';

withInstall(Description);

export * from './src/types';
export { useDescription } from './src/useDescription';
export { Description };
