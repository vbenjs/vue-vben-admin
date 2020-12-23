import { withInstall } from '../util';
import CollapseContainer from './src/collapse/CollapseContainer.vue';
import ScrollContainer from './src/ScrollContainer.vue';
import LazyContainer from './src/LazyContainer.vue';

withInstall(ScrollContainer, CollapseContainer, LazyContainer);
export { CollapseContainer, ScrollContainer, LazyContainer };
export * from './src/types';
