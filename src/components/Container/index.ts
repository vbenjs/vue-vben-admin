import ScrollContainerLib from './src/ScrollContainer.vue';
import CollapseContainerLib from './src/collapse/CollapseContainer.vue';
import LazyContainerLib from './src/LazyContainer.vue';
import { withInstall } from '../util';

export * from './src/types';

export const ScrollContainer = withInstall(ScrollContainerLib);
export const CollapseContainer = withInstall(CollapseContainerLib);
export const LazyContainer = withInstall(LazyContainerLib);
