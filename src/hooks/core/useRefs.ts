import { ref, onBeforeUpdate } from 'vue';

export function useRefs() {
  const refs = ref([] as Element[]);

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: Element) => {
    refs.value[index] = el;
  };

  return [refs, setRefs];
}
