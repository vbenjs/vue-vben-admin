import BasicDrawerLib from './src/BasicDrawer';
import { withInstall } from '../util';

export * from './src/types';
export { useDrawer, useDrawerInner } from './src/useDrawer';
export const BasicDrawer = withInstall(BasicDrawerLib);
