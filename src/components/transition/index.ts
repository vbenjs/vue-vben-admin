import { getAsyncComponent, transformComponents } from '@/common/factory/getAsyncComponent';
import { createSimpleTransition, createJavascriptTransition } from './src/createTransition';

import ExpandTransitionGenerator from './src/expandTransition';

// export { default as CollapseTransition } from './src/Collapse.vue';

export const CollapseTransition = getAsyncComponent(() => import('./src/CollapseTransition.vue'));
// Component specific transitions
export const FadeTransition = transformComponents(createSimpleTransition('fade-transition'));
export const ScaleTransition = transformComponents(createSimpleTransition('scale-transition'));
export const SlideYTransition = transformComponents(createSimpleTransition('slide-y-transition'));
export const ScrollYTransition = transformComponents(createSimpleTransition('scroll-y-transition'));
export const SlideYReverseTransition = transformComponents(
  createSimpleTransition('slide-y-reverse-transition')
);
export const ScrollYReverseTransition = transformComponents(
  createSimpleTransition('scroll-y-reverse-transition')
);
export const SlideXTransition = transformComponents(createSimpleTransition('slide-x-transition'));
export const ScrollXTransition = transformComponents(createSimpleTransition('scroll-x-transition'));
export const SlideXReverseTransition = transformComponents(
  createSimpleTransition('slide-x-reverse-transition')
);
export const ScrollXReverseTransition = transformComponents(
  createSimpleTransition('scroll-x-reverse-transition')
);
export const ScaleRotateTransition = transformComponents(
  createSimpleTransition('scale-rotate-transition')
);

// Javascript transitions
export const ExpandTransition = transformComponents(
  createJavascriptTransition('expand-transition', ExpandTransitionGenerator())
);
export const ExpandXTransition = transformComponents(
  createJavascriptTransition('expand-x-transition', ExpandTransitionGenerator('', true))
);
