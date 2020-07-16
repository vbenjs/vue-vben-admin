import { ref } from 'compatible-vue';
import { useTimeout } from '@/hooks/core/useTimeout';
export function useAsyncState<T>(
  promise: Promise<T>,
  defaultState: T,
  delay = 0,
  /* eslint-disable-next-line */
  catchFn = () => {}
) {
  const state = ref(defaultState);
  const ready = ref(false);

  function run() {
    promise
      .then((data) => {
        // @ts-ignore
        state.value = data;
        ready.value = true;
      })
      .catch(catchFn);
  }

  if (!delay) {
    run();
  } else {
    useTimeout(run, delay);
  }

  return { state, ready };
}
