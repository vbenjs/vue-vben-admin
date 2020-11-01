import type { BasicTableProps, TableRowSelection } from '../types/table';

import { computed, ref, unref, ComputedRef } from 'vue';
import { useProps } from './useProps';

/* eslint-disable */
export function useRowSelection(refProps: ComputedRef<BasicTableProps>, emit: EmitType) {
  const { propsRef } = useProps(refProps);

  const selectedRowKeysRef = ref<string[]>([]);
  const selectedRowRef = ref<any[]>([]);

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const rowSelection = unref(propsRef).rowSelection;
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
  function getSelectRows() {
    return unref(selectedRowRef);
  }

  return {
    getRowSelectionRef,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
  };
}
