import type { Ref } from 'vue';
import { onBeforeUpdate, shallowRef } from 'vue';

function useRefs<T = HTMLElement>(): {
  refs: Ref<T[]>;
  setRefs: (index: number) => (el: T) => void;
} {
  const refs = shallowRef([]) as Ref<T[]>;

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: T) => {
    refs.value[index] = el;
  };

  return {
    refs,
    setRefs,
  };
}

export { useRefs };
