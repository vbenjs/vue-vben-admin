import { watch, ref, ComputedRef, unref } from 'vue';
import { BasicTableProps } from '../types/table';
import { useProps } from './useProps';
export function useLoading(refProps: ComputedRef<BasicTableProps>) {
  const { propsRef } = useProps(refProps);

  const loadingRef = ref(unref(propsRef).loading);
  watch(
    () => unref(propsRef).loading,
    (v: boolean) => {
      loadingRef.value = v;
    }
  );
  return { loadingRef };
}
