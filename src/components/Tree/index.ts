import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import { withInstall } from '../util';

export const BasicTree = createAsyncComponent(() => import('./src/BasicTree'));

withInstall(BasicTree);

export type { ContextMenuItem } from '/@/hooks/web/useContextMenu';
export * from './src/types';
