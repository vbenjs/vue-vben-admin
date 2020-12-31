import { ref, ComputedRef, unref, computed, watchEffect } from 'vue';
import type { BasicTableProps } from '../types/table';

export function useLoading(props: ComputedRef<BasicTableProps>) {
  const loadingRef = ref(unref(props).loading);

  watchEffect(() => {
    loadingRef.value = unref(props).loading;
  });

  const getLoading = computed(() => {
    return unref(loadingRef);
  });

  function setLoading(loading: boolean) {
    loadingRef.value = loading;
  }

  return { getLoading, setLoading };
}
