import { ref, watch, Ref } from '@/setup/vue';

export default function usePrevious<T>(state: Ref<T> | (() => T)) {
  const previous = ref<T>();

  watch(
    state,
    (_, oldVal) => {
      previous.value = oldVal;
    },
    {
      immediate: true,
    }
  );

  return previous;
}
