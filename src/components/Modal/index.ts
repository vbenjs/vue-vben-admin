import './src/index.less';
import { withInstall } from '../util';
import BasicModal from './src/BasicModal.vue';

withInstall(BasicModal);

export { BasicModal };
export { useModalContext } from './src/hooks/useModalContext';
export { useModal, useModalInner } from './src/hooks/useModal';
export * from './src/types';
