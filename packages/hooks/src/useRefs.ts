import type { Ref } from 'vue';
import { onBeforeUpdate, shallowRef } from 'vue';

function useRefs(): {
  refs: Ref<HTMLElement[]>;
  setRefs: (index: number) => (el: HTMLElement) => void;
} {
  const refs = shallowRef([]) as Ref<HTMLElement[]>;

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: HTMLElement) => {
    refs.value[index] = el;
  };

  return {
    refs,
    setRefs,
  };
}

export { useRefs };
