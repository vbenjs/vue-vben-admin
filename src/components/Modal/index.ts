import './src/index.less';
import { withInstall } from '../util';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicModal = createAsyncComponent(() => import('./src/BasicModal'));

withInstall(BasicModal);

export { useModalContext } from './src/useModalContext';
export { useModal, useModalInner } from './src/useModal';
export * from './src/types';
