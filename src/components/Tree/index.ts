import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicTree = createAsyncComponent(() => import('./src/BasicTree'));

export type { ContextMenuItem } from '/@/hooks/web/useContextMenu';
export * from './src/types';
