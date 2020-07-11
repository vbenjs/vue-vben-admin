import { onUnmounted, getCurrentInstance, ref, unref } from 'compatible-vue';

export function useCountdown(count: number) {
  const countRef = ref(count);

  // 是否已经启动
  const startRef = ref(false);

  let timerId: ReturnType<typeof setInterval>;

  function clear() {
    timerId && window.clearInterval(timerId);
  }
  /**
   * @description: 停止
   */
  function stop() {
    startRef.value = false;
    // @ts-ignore
    timerId = null;
    clear();
  }

  // 执行
  function start() {
    // 已启动
    if (unref(startRef) || !!timerId) {
      return;
    }
    startRef.value = true;
    timerId = setInterval(() => {
      if (unref(countRef) === 1) {
        stop();
        countRef.value = count;
      } else {
        countRef.value -= 1;
      }
    }, 1000);
  }
  /**
   * @description: 重新执行
   */
  function reset() {
    countRef.value = count;
    stop();
  }

  function restart() {
    reset();
    start();
  }

  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    onUnmounted(() => {
      reset();
    });
  }
  return { start, reset, restart, clear, stop, countRef, startRef };
}
