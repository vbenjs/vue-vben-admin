import { isFunction } from '/@/utils/is';
import type { BasicTableProps, TableRowSelection } from '../types/table';
import { computed, ComputedRef, nextTick, Ref, ref, toRaw, unref, watch } from 'vue';
import { ROW_KEY } from '../const';
import { omit } from 'lodash-es';
import { findNodeAll } from '/@/utils/helper/treeHelper';
import type { Key } from 'ant-design-vue/lib/table/interface';

export function useRowSelection(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType,
) {
  const selectedRowKeysRef = ref<Key[]>([]);
  const selectedRowRef = ref<Recordable[]>([]);

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const { rowSelection } = unref(propsRef);
    if (!rowSelection) {
      return null;
    }

    return {
      selectedRowKeys: unref(selectedRowKeysRef),
      onChange: (selectedRowKeys: Key[]) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      ...omit(rowSelection, ['onChange']),
    };
  });

  watch(
    () => unref(propsRef).rowSelection?.selectedRowKeys,
    (v?: Key[]) => {
      setSelectedRowKeys(v);
    },
  );

  watch(
    () => unref(selectedRowKeysRef),
    () => {
      nextTick(() => {
        const { rowSelection } = unref(propsRef);
        if (rowSelection) {
          const { onChange } = rowSelection;
          if (onChange && isFunction(onChange)) onChange(getSelectRowKeys(), getSelectRows());
        }
        emit('selection-change', {
          keys: getSelectRowKeys(),
          rows: getSelectRows(),
        });
      });
    },
    { deep: true },
  );

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  function setSelectedRowKeys(rowKeys?: Key[]) {
    selectedRowKeysRef.value = rowKeys || [];
    const allSelectedRows = findNodeAll(
      toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef))),
      (item) => rowKeys?.includes(item[unref(getRowKey) as string]),
      {
        children: propsRef.value.childrenColumnName ?? 'children',
      },
    );
    const trueSelectedRows: any[] = [];
    rowKeys?.forEach((key: Key) => {
      const found = allSelectedRows.find((item) => item[unref(getRowKey) as string] === key);
      found && trueSelectedRows.push(found);
    });
    selectedRowRef.value = trueSelectedRows;
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
