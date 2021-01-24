import type { BasicTableProps, TableRowSelection } from '../types/table';

import { computed, ref, unref, ComputedRef } from 'vue';

/* eslint-disable */
export function useRowSelection(propsRef: ComputedRef<BasicTableProps>, emit: EmitType) {
  const selectedRowKeysRef = ref<string[]>([]);
  const selectedRowRef = ref<Recordable[]>([]);

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const { rowSelection } = unref(propsRef);
    if (!rowSelection) {
      return null;
    }
    return {
      selectedRowKeys: unref(selectedRowKeysRef),
      hideDefaultSelections: false,
      onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
        selectedRowKeysRef.value = selectedRowKeys;
        selectedRowRef.value = selectedRows;
        emit('selection-change', {
          keys: selectedRowKeys,
          rows: selectedRows,
        });
      },
      ...rowSelection,
    };
  });

  function setSelectedRowKeys(rowKeys: string[]) {
    selectedRowKeysRef.value = rowKeys;
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
  }

  function deleteSelectRowByKey(key: string) {
    const selectedRowKeys = unref(selectedRowKeysRef);
    const index = selectedRowKeys.findIndex((item) => item === key);
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1);
    }
  }

  function getSelectRowKeys() {
    return unref(selectedRowKeysRef);
  }

  function getSelectRows<T = Recordable>() {
    // const ret = toRaw(unref(selectedRowRef)).map((item) => toRaw(item));
    return unref(selectedRowRef) as T[];
  }

  function getRowSelection() {
    return unref(getRowSelectionRef)!;
  }

  return {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
  };
}
