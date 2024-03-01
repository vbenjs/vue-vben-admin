import type { VxeGridInstance } from 'vxe-table';
import { computed } from 'vue';

const SMART_TABLE_CUSTOM_COLUMN_SORT = 'SMART_TABLE_CUSTOM_COLUMN_SORT';

export const useSmartTableColumnConfig = (getTableInstance: () => VxeGridInstance) => {
  const setColumnSortConfig = () => {
    const fullColumnList = getTableInstance()?.getTableColumn()?.fullColumn || [];
    const tableId = getTableInstance()?.id;
    if (!tableId) {
      return;
    }
    const columns = fullColumnList
      .map((item) => {
        const field = item.field;
        if (!field) {
          console.warn(item);
          console.warn('SMART-TABLE：列未设置field，列顺序设置无法正常使用');
        }
        return field;
      })
      .filter((item) => item !== undefined && item !== null);
    // TODO:使用统一缓存
    const allConfig =
      JSON.parse(localStorage.getItem(SMART_TABLE_CUSTOM_COLUMN_SORT) || '{}') || {};
    allConfig[tableId] = columns;
    localStorage.setItem(SMART_TABLE_CUSTOM_COLUMN_SORT, JSON.stringify(allConfig));
  };

  const getColumnSortConfig = (tableId: string) => {
    return JSON.parse(localStorage.getItem(SMART_TABLE_CUSTOM_COLUMN_SORT) || '{}')[tableId];
  };

  const computedColumnSort = computed(() => {
    const tableId = getTableInstance()?.id;
    if (!tableId) {
      return null;
    }
    if (getTableInstance()?.customConfig?.storage !== true) {
      return null;
    }
    return getColumnSortConfig(tableId);
  });

  return {
    setColumnSortConfig,
    computedColumnSort,
  };
};
