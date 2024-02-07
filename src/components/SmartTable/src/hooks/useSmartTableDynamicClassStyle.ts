import type { ComputedRef } from 'vue';
import type {
  SmartTableProps,
  SmartColumnDynamicClass,
  SmartColumnDynamicStyle,
  SmartColumnAutoClass,
} from '@/components/SmartTable';
import type { VxeTablePropTypes } from 'vxe-table';

import { computed, unref } from 'vue';
import { warn } from '@/utils/log';
import { isObject, isString } from '@/utils/is';

const autoClass: { [index in SmartColumnAutoClass]: SmartColumnDynamicClass } = {
  Boolean: ({ row, column }) => {
    const value = row[column.field];
    if (value === null || value === undefined) {
      return '';
    }
    if (value) {
      return 'text-color--success-bold';
    }
    return 'text-color--danger-bold';
  },
};

export const useSmartTableDynamicClassStyle = (tablePropsRef: ComputedRef<SmartTableProps>) => {
  /**
   * 动态class计算属性
   */
  const computedClassName = computed<VxeTablePropTypes.CellClassName | undefined>(() => {
    const tableProps = unref(tablePropsRef);
    const tableDynamicClass: Recordable<SmartColumnDynamicClass> = {};
    tableProps.columns?.forEach((column) => {
      if (column.dynamicClass) {
        if (!column.field) {
          warn('列未设置field，dynamicClass失效');
          console.warn(column);
        } else {
          tableDynamicClass[column.field] = column.dynamicClass;
        }
      } else if (column.autoClass) {
        if (!column.field) {
          warn('列未设置field，dynamicClass失效');
          console.warn(column);
        } else {
          tableDynamicClass[column.field] = autoClass[column.autoClass];
        }
      }
    });
    if (tableProps.cellClassName || tableProps.rowClassName) {
      if (Object.keys(tableDynamicClass).length > 0) {
        warn('表格设置了cellClassName或rowClassName，列dynamicClass失效');
      }
      return undefined;
    }
    if (Object.keys(tableDynamicClass).length === 0) {
      return undefined;
    }
    return (params) => {
      const { column } = params;
      const field = column.field;
      const dynamicClass = tableDynamicClass[field];
      if (!dynamicClass) {
        return undefined;
      }
      if (isString(dynamicClass)) {
        return dynamicClass;
      }
      return dynamicClass(params);
    };
  });

  const computedStyle = computed(() => {
    const tableProps = unref(tablePropsRef);
    const tableDynamicStyle: Recordable<SmartColumnDynamicStyle> = {};
    tableProps.columns?.forEach((column) => {
      if (column.dynamicStyle) {
        if (!column.field) {
          warn('列未设置field，dynamicStyle失效');
          console.warn(column);
        } else {
          tableDynamicStyle[column.field] = column.dynamicStyle;
        }
      }
    });
    if (tableProps.cellStyle || tableProps.rowStyle) {
      if (Object.keys(tableDynamicStyle).length > 0) {
        warn('表格设置了cellStyle或rowStyle，列dynamicStyle失效');
      }
      return undefined;
    }
    if (Object.keys(tableDynamicStyle).length === 0) {
      return undefined;
    }
    return (params) => {
      const { column } = params;
      const field = column.field;
      const dynamicStyle = tableDynamicStyle[field];
      if (!dynamicStyle) {
        return undefined;
      }
      if (isObject(dynamicStyle)) {
        return dynamicStyle;
      }
      return dynamicStyle(params);
    };
  });

  const computedTableClassStyle = computed(() => {
    const props: SmartTableProps = {};
    if (unref(computedClassName)) {
      props.cellClassName = unref(computedClassName);
    }
    if (unref(computedStyle)) {
      props.cellStyle = unref(computedStyle);
    }
    return props;
  });

  return {
    computedTableClassStyle,
  };
};
