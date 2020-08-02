import { BasicTableProps } from '../types/table';
import { watch, ref, unref, ComputedRef } from 'compatible-vue';
import { useProps } from './useProps';

export function useLoading(refProps: ComputedRef<BasicTableProps>) {
  const { propsRef } = useProps(refProps);

  const loadingRef = ref(unref(propsRef).loading);

  watch(
    () => unref(propsRef).loading,
    (v) => {
      loadingRef.value = v;
    }
  );
  return { loadingRef };
}
