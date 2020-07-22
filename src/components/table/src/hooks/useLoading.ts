import { BasicTableProps } from '../types/table';
import { watch, ref, unref, ComputedRef } from 'compatible-vue';
export function useLoading(propsRef: ComputedRef<BasicTableProps>) {
  const loadingRef = ref(unref(propsRef).loading);

  watch(
    () => unref(propsRef).loading,
    (v) => {
      loadingRef.value = v;
    }
  );
  return { loadingRef };
}
