import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const ScrollContainer = createAsyncComponent(() => import('./src/ScrollContainer.vue'));
export const CollapseContainer = createAsyncComponent(
  () => import('./src/collapse/CollapseContainer.vue')
);
export const LazyContainer = createAsyncComponent(() => import('./src/LazyContainer.vue'));

withInstall(ScrollContainer, CollapseContainer, LazyContainer);

export * from './src/types';
