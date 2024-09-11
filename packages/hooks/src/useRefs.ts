import type { ComponentPublicInstance, Ref } from 'vue';
import { onBeforeUpdate, shallowRef } from 'vue';

function useRefs<T = HTMLElement>(): {
  refs: Ref<T[]>;
  setRefs: (index: number) => (el: Element | ComponentPublicInstance | null) => void;
} {
  const refs = shallowRef([]) as Ref<T[]>;

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: Element | ComponentPublicInstance | null) => {
    refs.value[index] = el as T;
  };

  return {
    refs,
    setRefs,
  };
}

export { useRefs };
