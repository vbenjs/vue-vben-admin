import { isServer } from '/@/utils/is';
import { onUnmounted, getCurrentInstance } from 'vue';
let lastTime = 0;
const prefixes = 'webkit moz ms o'.split(' '); // Each browser prefix

let requestAnimationFrame: any;
let cancelAnimationFrame: any;

/* eslint-disable-next-line */
const NO_LOOP = () => {};

const getWindowFrame = (name: string) => {
  return name as any;
};
if (isServer) {
  requestAnimationFrame = cancelAnimationFrame = NO_LOOP;
} else {
  requestAnimationFrame = window.requestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame;
  let prefix;
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame =
      requestAnimationFrame || window[getWindowFrame(prefix + 'RequestAnimationFrame')];
    cancelAnimationFrame =
      cancelAnimationFrame ||
      window[getWindowFrame(prefix + 'CancelAnimationFrame')] ||
      window[getWindowFrame(prefix + 'CancelRequestAnimationFrame')];
  }

  // If the current browser does not support requestAnimationFrame and cancelAnimationFrame, it will fall back to setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback: Fn) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        /* eslint-disable-next-line */
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function (id: number) {
      window.clearTimeout(id);
    };
  }
}
export function useRaf() {
  // if (getCurrentInstance()) {
  //   onUnmounted(() => {
  //     cancelAnimationFrame();
  //   });
  // }
  return { requestAnimationFrame, cancelAnimationFrame };
}

export function useRafFn(fn: (...arg: any) => any, options: { immediate?: boolean } = {}) {
  const { immediate = false } = options;
  let started = false;
  let id: ReturnType<typeof window.requestAnimationFrame>;

  function loop() {
    if (!started) return;
    fn();
    id = requestAnimationFrame(loop);
  }

  function start() {
    if (!started) {
      started = true;
      loop();
    }
  }

  function stop() {
    started = false;
  }

  if (immediate) {
    start();
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      cancelAnimationFrame(id);
      stop();
    });
  }

  return { stop, start };
}
