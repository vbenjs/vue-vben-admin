import './src/index.less';
import { withInstall } from '../util';
import BasicModal from './src/BasicModal';

withInstall(BasicModal);

export { BasicModal };
export { useModalContext } from './src/useModalContext';
export { useModal, useModalInner } from './src/useModal';
export * from './src/types';
