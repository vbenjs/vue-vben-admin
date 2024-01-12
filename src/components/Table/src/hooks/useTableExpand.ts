import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';
import { computed, unref, ref, toRaw, nextTick } from 'vue';
import { ROW_KEY } from '../const';
import { parseRowKeyValue } from '../helper';

export function useTableExpand(
  propsRef: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitType,
) {
  const expandedRowKeys = ref<(string | number)[]>([]);

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  const getExpandOption = computed(() => {
    const { isTreeTable, expandRowByClick } = unref(propsRef);
    if (!isTreeTable && !expandRowByClick) return {};

    return {
      expandedRowKeys: unref(expandedRowKeys),
      onExpandedRowsChange: (keyValues: string[]) => {
        expandedRowKeys.value = keyValues;
        emit('expanded-rows-change', keyValues);
      },
    };
  });

  function expandAll() {
    const keyValues = getAllKeys();
    expandedRowKeys.value = keyValues;
  }

  function collapseAll() {
    expandedRowKeys.value = [];
  }

  function expandRows(keyValues: (string | number)[]) {
    // use row ID expands the specified table row
    const { isTreeTable, expandRowByClick } = unref(propsRef);
    if (!isTreeTable && !expandRowByClick) return;
    expandedRowKeys.value = [...expandedRowKeys.value, ...keyValues];
  }

  function collapseRows(keyValues: (string | number)[]) {
    // use row ID collapses the specified table row
    const { isTreeTable, expandRowByClick } = unref(propsRef);
    if (!isTreeTable && !expandRowByClick) return;
    expandedRowKeys.value = unref(expandedRowKeys).filter(
      (keyValue) => !keyValues.includes(keyValue),
    );
  }

  function getAllKeys(data?: Recordable[]) {
    const keyValues: Array<number | string> = [];
    const { childrenColumnName } = unref(propsRef);
    toRaw(data || unref(tableData)).forEach((item) => {
      keyValues.push(parseRowKeyValue(unref(getRowKey), item));
      const children = item[childrenColumnName || 'children'];
      if (children?.length) {
        keyValues.push(...getAllKeys(children));
      }
    });
    return keyValues;
  }

  // 获取展开路径 keyValues
  function getKeyPaths(
    records: Recordable[],
    childrenColumnName: string,
    keyValue: string | number,
    paths: Array<string | number>,
  ): boolean {
    if (
      records.findIndex((record) => parseRowKeyValue(unref(getRowKey), record) === keyValue) > -1
    ) {
      paths.push(keyValue);
      return true;
    } else {
      for (const record of records) {
        const children = record[childrenColumnName];
        if (Array.isArray(children) && getKeyPaths(children, childrenColumnName, keyValue, paths)) {
          paths.push(parseRowKeyValue(unref(getRowKey), record));
          return true;
        }
      }
    }
    return false;
  }

  // 手风琴展开
  function expandRowAccordion(keyValue: string | number) {
    const { childrenColumnName } = unref(propsRef);
    const paths: Array<string | number> = [];
    getKeyPaths(tableData.value, childrenColumnName || 'children', keyValue, paths);
    expandedRowKeys.value = paths;
  }

  // 监听展开事件，用于支持手风琴展开效果
  function handleTableExpand(expanded, record) {
    // 手风琴开关
    // isTreeTable 或 expandRowByClick 时支持
    // 展开操作
    if (
      propsRef.value.accordion &&
      (propsRef.value.isTreeTable || propsRef.value.expandRowByClick) &&
      expanded
    ) {
      nextTick(() => {
        expandRowAccordion(parseRowKeyValue(unref(getRowKey), record));
      });
    }
  }

  return {
    getExpandOption,
    expandAll,
    collapseAll,
    expandRows,
    collapseRows,
    expandRowAccordion,
    handleTableExpand,
  };
}
