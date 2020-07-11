import { addClass, removeClass } from '@/utils/domUtils';
import { VueConstructor } from 'compatible-vue';

const ZERO = '0px';
const Transition = {
  beforeEnter(el: HTMLElement) {
    addClass(el, 'collapse-transition');
    if (!el.dataset) {
      (el as any).dataset = {};
    }

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = ZERO;
    el.style.paddingTop = ZERO;
    el.style.paddingBottom = ZERO;
  },

  enter(el: HTMLElement) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop || ZERO;
      el.style.paddingBottom = el.dataset.oldPaddingBottom || ZERO;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop || ZERO;
      el.style.paddingBottom = el.dataset.oldPaddingBottom || ZERO;
    }

    el.style.overflow = 'hidden';
  },

  afterEnter(el: HTMLElement) {
    // for safari: remove class then reset height is necessary
    removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow || ZERO;
  },

  beforeLeave(el: HTMLElement) {
    if (!el.dataset) {
      (el as any).dataset = {};
    }
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
  },

  leave(el: HTMLElement) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition');
      el.style.height = ZERO;
      el.style.paddingTop = ZERO;
      el.style.paddingBottom = ZERO;
    }
  },

  afterLeave(el: HTMLElement) {
    removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow || ZERO;
    el.style.paddingTop = el.dataset.oldPaddingTop || ZERO;
    el.style.paddingBottom = el.dataset.oldPaddingBottom || ZERO;
  },
};

export default ({
  name: 'CollapseTransition',
  functional: true,
  render(h, { children }) {
    const data = {
      on: Transition,
    };

    return h('transition', data, children);
  },
} as unknown) as VueConstructor;
