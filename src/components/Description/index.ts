import DescriptionLib from './src/index';

import { withInstall } from '../util';

export * from './src/types';
export { useDescription } from './src/useDescription';

export const Description = withInstall(DescriptionLib);
