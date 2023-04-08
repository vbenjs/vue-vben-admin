import { shallowRef, unref } from 'vue';

interface UseScrollToOptions {
  /**
   * @description 需要滚动的 el dom节点
   */
  el: HTMLElement;
  /**
   * @description 滚动的目标值
   */
  to: number;
  /**
   * @description 滚动时间
   */
  duration?: number;
  /**
   * @description 执行完成之后的回调函数
   * @returns
   */
  callback?: () => void;
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

/**
 * @description dom节点滚动到指定位置
 * @param UseScrollToOptions
 * @returns
 */
function useScrollTo({ el, to, duration = 500, callback }: UseScrollToOptions) {
  const isActiveRef = shallowRef(false);
  const start = el.scrollTop;
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
      callback?.();
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
