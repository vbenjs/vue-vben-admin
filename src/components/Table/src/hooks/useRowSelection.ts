import type { BasicTableProps, TableRowSelection } from '../types/table';

import { computed, ref, unref, ComputedRef, Ref, toRaw } from 'vue';
import { ROW_KEY } from '../const';

export function useRowSelection(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType
) {
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
      onChange: (selectedRowKeys: string[], selectedRows: Recordable[]) => {
        selectedRowKeysRef.value = selectedRowKeys;
        selectedRowRef.value = selectedRows;
        emit('selection-change', {
          keys: selectedRowKeys,
          rows: selectedRows,
        });
      },
      ...(rowSelection === undefined ? {} : rowSelection),
    };
  });

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  function setSelectedRowKeys(rowKeys: string[]) {
    selectedRowKeysRef.value = rowKeys;

    const rows = toRaw(unref(tableData)).filter((item) =>
      rowKeys.includes(item[unref(getRowKey) as string])
    );
    selectedRowRef.value = rows;
  }

  function setSelectedRows(rows: Recordable[]) {
    selectedRowRef.value = rows;
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
    setSelectedRows,
  };
}
