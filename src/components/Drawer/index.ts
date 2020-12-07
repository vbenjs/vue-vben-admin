import BasicDrawer from './src/BasicDrawer';
import { withInstall } from '../util';

withInstall(BasicDrawer);
export * from './src/types';
export { useDrawer, useDrawerInner } from './src/useDrawer';
export { BasicDrawer };
