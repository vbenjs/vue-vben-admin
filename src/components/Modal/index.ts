import './src/index.less';
import BasicModalLib from './src/BasicModal';
import { withInstall } from '../util';

export { useModalContext } from './src/useModalContext';
export { useModal, useModalInner } from './src/useModal';
export * from './src/types';
export const BasicModal = withInstall(BasicModalLib);
