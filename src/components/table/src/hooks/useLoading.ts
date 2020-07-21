import { BasicTableProps } from '../types/table';
import { watch, ref } from 'compatible-vue';
export function useLoading(props: BasicTableProps) {
  const loadingRef = ref(props.loading);

  watch(
    () => props.loading,
    (v) => {
      loadingRef.value = v;
    }
  );
  return { loadingRef };
}
