import type { ComputedRef, Ref } from 'vue';
import type { BasicTableProps } from '../types/table';
import { computed, unref, ref, toRaw, nextTick } from 'vue';
import { ROW_KEY } from '../const';

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
      onExpandedRowsChange: (keys: string[]) => {
        expandedRowKeys.value = keys;
        emit('expanded-rows-change', keys);
      },
    };
  });

  function expandAll() {
    const keys = getAllKeys();
    expandedRowKeys.value = keys;
  }

  function collapseAll() {
    expandedRowKeys.value = [];
  }

  function expandRows(keys: (string | number)[]) {
    // use row ID expands the specified table row
    const { isTreeTable, expandRowByClick } = unref(propsRef);
    if (!isTreeTable && !expandRowByClick) return;
    expandedRowKeys.value = [...expandedRowKeys.value, ...keys];
  }

  function collapseRows(keys: (string | number)[]) {
    // use row ID collapses the specified table row
    const { isTreeTable, expandRowByClick } = unref(propsRef);
    if (!isTreeTable && !expandRowByClick) return;
    expandedRowKeys.value = unref(expandedRowKeys).filter((key) => !keys.includes(key));
  }

  function getAllKeys(data?: Recordable[]) {
    const keys: string[] = [];
    const { childrenColumnName } = unref(propsRef);
    toRaw(data || unref(tableData)).forEach((item) => {
      keys.push(item[unref(getRowKey) as string]);
      const children = item[childrenColumnName || 'children'];
      if (children?.length) {
        keys.push(...getAllKeys(children));
      }
    });
    return keys;
  }

  // 获取展开路径 keys
  function getKeyPaths(
    records: Recordable[],
    rowKey: string,
    childrenColumnName: string,
    key: string | number,
    paths: Array<string | number>,
  ): boolean {
    if (records.findIndex((record) => record[rowKey] === key) > -1) {
      paths.push(key);
      return true;
    } else {
      for (const record of records) {
        const children = record[childrenColumnName];
        if (
          Array.isArray(children) &&
          getKeyPaths(children, rowKey, childrenColumnName, key, paths)
        ) {
          paths.push(record[rowKey]);
          return true;
        }
      }
    }
    return false;
  }

  // 手风琴展开
  function expandRowAccordion(key: string | number, rowKey: string) {
    const { childrenColumnName } = unref(propsRef);
    const paths: Array<string | number> = [];
    getKeyPaths(tableData.value, rowKey, childrenColumnName || 'children', key, paths);
    expandedRowKeys.value = paths;
  }

  // 监听展开事件，用于支持手风琴展开效果
  function handleTableExpand(expanded, record) {
    // 手风琴开关
    // isTreeTable 或 expandRowByClick 时支持
    // rowKey 是字符串时支持
    // 展开操作
    if (
      propsRef.value.accordion &&
      (propsRef.value.isTreeTable || propsRef.value.expandRowByClick) &&
      typeof getRowKey.value === 'string' &&
      expanded
    ) {
      const rowKey = getRowKey.value as string;
      nextTick(() => {
        expandRowAccordion(record[rowKey], rowKey);
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
