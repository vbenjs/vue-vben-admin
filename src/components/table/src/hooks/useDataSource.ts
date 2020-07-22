import { BasicTableProps } from '../types/table';
import { watch, ref, unref, ComputedRef, computed } from 'compatible-vue';
import { buildUUID } from '@/utils/uuid';

import { ROW_KEY } from '../const';
export function useDataSource(propsRef: ComputedRef<BasicTableProps>) {
  const dataSourceRef = ref<any[]>([]);
  watch(
    () => unref(propsRef).dataSource,
    (data: any[]) => {
      dataSourceRef.value = data;
    },
    { immediate: true }
  );

  const getDataSourceRef = computed(() => {
    const firstItem = unref(dataSourceRef)[0];

    if (firstItem) {
      if (!firstItem[ROW_KEY]) {
        unref(dataSourceRef).forEach((item) => {
          item[ROW_KEY] = buildUUID();
        });
      }
    }
    return unref(dataSourceRef);
  });
  return { getDataSourceRef, rowKey: ROW_KEY };
}
