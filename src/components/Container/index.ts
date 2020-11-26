import ScrollContainer from './src/ScrollContainer.vue';
import CollapseContainer from './src/collapse/CollapseContainer.vue';
import LazyContainer from './src/LazyContainer.vue';
import { withInstall } from '../util';

export * from './src/types';

export { ScrollContainer, CollapseContainer, LazyContainer };

export default withInstall(ScrollContainer, CollapseContainer, LazyContainer);
