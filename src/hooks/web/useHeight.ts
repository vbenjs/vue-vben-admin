import { Ref, ref, onMounted, nextTick } from 'vue';
import { useRect } from '/@/hooks/web/useRect';
export const useHeight = (element: Element | Ref<Element>) => {
  const height = ref();

  onMounted(() => {
    nextTick(() => {
      height.value = useRect(element).height;
    });
  });

  return height;
};
