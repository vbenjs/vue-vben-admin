import { createSimpleTransition, createJavascriptTransition } from './src/CreateTransition';

import ExpandTransitionGenerator from './src/ExpandTransition';

export { default as CollapseTransition } from './src/CollapseTransition';
// export { default as CollapseTransition } from './src/CollapseTransition';

export const FadeTransition = createSimpleTransition('fade-transition');
export const ScaleTransition = createSimpleTransition('scale-transition');
export const SlideYTransition = createSimpleTransition('slide-y-transition');
export const ScrollYTransition = createSimpleTransition('scroll-y-transition');
export const SlideYReverseTransition = createSimpleTransition('slide-y-reverse-transition');
export const ScrollYReverseTransition = createSimpleTransition('scroll-y-reverse-transition');
export const SlideXTransition = createSimpleTransition('slide-x-transition');
export const ScrollXTransition = createSimpleTransition('scroll-x-transition');
export const SlideXReverseTransition = createSimpleTransition('slide-x-reverse-transition');
export const ScrollXReverseTransition = createSimpleTransition('scroll-x-reverse-transition');
export const ScaleRotateTransition = createSimpleTransition('scale-rotate-transition');

// Javascript transitions
// export const ExpandTransition = createJavascriptTransition(
//   'expand-transition',
//   ExpandTransitionGenerator()
// );

export const ExpandXTransition = createJavascriptTransition(
  'expand-x-transition',
  ExpandTransitionGenerator('', true)
);

export { default as ExpandTransition } from './src/ExpandTransition.vue';
