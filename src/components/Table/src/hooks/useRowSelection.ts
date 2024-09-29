import { isFunction } from '@/utils/is';
import type { BasicTableProps, TableRowSelection } from '../types/table';
import { computed, ComputedRef, nextTick, Ref, ref, toRaw, unref, watch } from 'vue';
import { ROW_KEY } from '../const';
import { omit } from 'lodash-es';
import { findNodeAll } from '@/utils/helper/treeHelper';
import type { Key } from 'ant-design-vue/lib/table/interface';
import { parseRowKey, parseRowKeyValue } from '../helper';

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
      onChange: (selectedRowKeys: Key[], selectedRows: any[], isClickCustomRow?: boolean) => {
        if (isClickCustomRow) {
          // 点击行触发

          // 维持外部定义的 onChange 回调
          rowSelection.onChange?.(selectedRowKeys, selectedRows);
        } else {
          // 点击 checkbox/radiobox 触发

          // 取出【当前页】所有 keyValues
          const currentPageKeys = getCcurrentPageKeys();

          // 从【所有分页】已选的 keyValues，且属于【当前页】的部分
          for (const selectedKey of selectedRowKeysRef.value.filter((k) =>
            currentPageKeys.includes(k),
          )) {
            // 判断是否已经不存在于【当前页】
            if (selectedRowKeys.findIndex((k) => k === selectedKey) < 0) {
              // 不存在 = 取消勾选
              const removeIndex = selectedRowKeysRef.value.findIndex((k) => k === selectedKey);
              if (removeIndex > -1) {
                // 取消勾选
                selectedRowKeysRef.value.splice(removeIndex, 1);
                selectedRowRef.value.splice(removeIndex, 1);
              }
            }
          }

          // 存在于【当前页】，但不存在于【所有分页】，则认为是新增的
          for (const selectedKey of selectedRowKeys) {
            const existIndex = selectedRowKeysRef.value.findIndex((k) => k === selectedKey);
            if (existIndex < 0) {
              // 新增勾选
              selectedRowKeysRef.value.push(selectedKey);
              const record = selectedRows.find(
                (o) => parseRowKeyValue(unref(getRowKey), o) === selectedKey,
              );
              if (record) {
                selectedRowRef.value.push(record);
              }
            }
          }

          // 赋值调整过的值
          setSelectedRowKeys(selectedRowKeysRef.value);

          // 维持外部定义的onChange回调
          rowSelection.onChange?.(selectedRowKeysRef.value, selectedRowRef.value);
        }
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
          if (onChange && isFunction(onChange)) onChange(getSelectRowKeys(), getSelectRows(), true);
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
	function getCcurrentPageKeys() {
		const { childrenColumnName = 'children' } = unref(propsRef);
		const keys: Key[] = [];
		const extractKeys = (record: Recordable) => {
			keys.push(parseRowKeyValue(unref(getRowKey), record));
			if (record[childrenColumnName]?.length) {
				record[childrenColumnName].forEach(extractKeys);
			}
		};
		tableData.value.forEach(extractKeys);
		return keys;
	}

  function setSelectedRowKeys(keyValues?: Key[]) {
    selectedRowKeysRef.value = keyValues || [];
    const rows = toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef)));
    const allSelectedRows = findNodeAll(
      rows,
      (item) => keyValues?.includes(parseRowKeyValue(unref(getRowKey), item)),
      {
        children: propsRef.value.childrenColumnName ?? 'children',
      },
    );
    const trueSelectedRows: any[] = [];
    keyValues?.forEach((keyValue: Key) => {
      const found = allSelectedRows.find(
        (item) => parseRowKeyValue(unref(getRowKey), item) === keyValue,
      );
      if (found) {
        trueSelectedRows.push(found);
      } else {
        // 跨页的时候，非本页数据无法得到，暂如此处理
        // tableData or selectedRowRef 总有数据
        if (rows[0]) {
          trueSelectedRows.push({ [parseRowKey(unref(getRowKey), rows[0])]: keyValue });
        }
      }
    });
    selectedRowRef.value = trueSelectedRows;
  }

  function setSelectedRows(rows: Recordable[]) {
    selectedRowRef.value = rows;
    selectedRowKeysRef.value = selectedRowRef.value.map((o) =>
      parseRowKeyValue(unref(getRowKey), o),
    );
  }

  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
  }

  function deleteSelectRowByKey(key: Key) {
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
