import { shallowRef, unref } from 'vue';

interface UseScrollToOptions {
  el: any;
  to: number;
  duration?: number;
  callback?: () => any;
}

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

function move(el: HTMLElement, amount: number) {
  el.scrollTop = amount;
}

const position = (el: HTMLElement) => {
  return el.scrollTop;
};
function useScrollTo({ el, to, duration = 500, callback }: UseScrollToOptions) {
  const isActiveRef = shallowRef(false);
  const start = position(el);
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    if (!unref(isActiveRef)) {
      return;
    }
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(el, val);
    if (currentTime < duration && unref(isActiveRef)) {
      requestAnimationFrame(animateScroll);
    } else {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };
  const run = () => {
    isActiveRef.value = true;
    animateScroll();
  };

  const stop = () => {
    isActiveRef.value = false;
  };

  return { start: run, stop };
}

export { useScrollTo, type UseScrollToOptions };
