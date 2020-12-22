import { withInstall } from '../util';
import CollapseContainer from './src/collapse/CollapseContainer.vue';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const ScrollContainer = createAsyncComponent(() => import('./src/ScrollContainer.vue'));

// export const CollapseContainer = createAsyncComponent(
//   () => import('./src/collapse/CollapseContainer.vue')
// );
export const LazyContainer = createAsyncComponent(() => import('./src/LazyContainer.vue'));

withInstall(ScrollContainer, CollapseContainer, LazyContainer);

export { CollapseContainer };
export * from './src/types';
