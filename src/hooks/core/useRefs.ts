import { ref, onBeforeUpdate, Ref } from 'vue';

export function useRefs(): [Ref<HTMLElement[]>, (index: number) => (el: HTMLElement) => void] {
  const refs = ref<HTMLElement[]>([]);

  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: HTMLElement) => {
    refs.value[index] = el;
  };

  return [refs, setRefs];
}
