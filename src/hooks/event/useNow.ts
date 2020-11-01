import { ref } from 'vue';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';

function getTimestamp() {
  return +Date.now();
}

export function useNow() {
  const now = ref(getTimestamp());
  let started = false;

  const update = () => {
    requestAnimationFrame(() => {
      now.value = getTimestamp();
      if (started) update();
    });
  };

  const start = () => {
    if (!started) {
      started = true;
      update();
    }
  };

  const stop = () => {
    started = false;
  };

  start();

  tryOnUnmounted(stop);

  return now;
}
