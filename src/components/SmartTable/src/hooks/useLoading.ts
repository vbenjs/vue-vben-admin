import { computed, ref, unref, watch } from 'vue';
import type { ComputedRef } from 'vue';

import type { SmartTableProps } from '@/components/SmartTable';

export const useLoading = (props: ComputedRef<SmartTableProps>) => {
  const loadingRef = ref(unref(props).loading);

  watch(
    () => unref(props).loading,
    (loading) => {
      loadingRef.value = loading;
    },
  );

  const getLoading = computed(() => unref(loadingRef));

  const setLoading = (loading: boolean) => {
    // getTableInstance().loading = loading
    loadingRef.value = loading;
  };

  return { getLoading, setLoading };
};
