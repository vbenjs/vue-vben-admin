import { getAsyncComponent } from '@/common/factory/getAsyncComponent';

// fade/zoom 等
import './src/transition.less';

// export { default as CollapseTransition } from './src/Collapse.vue';

export const CollapseTransition = getAsyncComponent(() => import('./src/Collapse.vue'));
