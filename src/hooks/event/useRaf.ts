import { isServer } from '@/utils/is/index';
import { onUnmounted, getCurrentInstance } from 'compatible-vue';
let lastTime = 0;
const prefixes = 'webkit moz ms o'.split(' '); // 各浏览器前缀

let requestAnimationFrame;
let cancelAnimationFrame;

/* eslint-disable-next-line */
const NO_LOOP = () => {};

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
    requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
    cancelAnimationFrame =
      cancelAnimationFrame ||
      window[prefix + 'CancelAnimationFrame'] ||
      window[prefix + 'CancelRequestAnimationFrame'];
  }

  // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        /* eslint-disable-next-line */
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function (id) {
      window.clearTimeout(id);
    };
  }
}

export function useRaf() {
  if (getCurrentInstance()) {
    onUnmounted(() => {
      cancelAnimationFrame();
    });
  }
  return { requestAnimationFrame };
}
