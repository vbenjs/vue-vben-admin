import './src/index.less';
import BasicModal from './src/BasicModal';
import { withInstall } from '../util';

withInstall(BasicModal);

export { useModalContext } from './src/useModalContext';
export { useModal, useModalInner } from './src/useModal';
export * from './src/types';
export { BasicModal };
