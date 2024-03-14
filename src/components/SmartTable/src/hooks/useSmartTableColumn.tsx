import type { ComputedRef, VNode } from 'vue';
import { computed, unref } from 'vue';
import type { SmartColumn, SmartTableProps } from '@/components/SmartTable';
import type { VxeColumnSlotTypes } from 'vxe-table';
import { isBoolean, isFunction } from '@/utils/is';
import { getFormSize } from '../utils';
import { VxeTablePropTypes } from 'vxe-table/types/table';
import XEUtils from 'xe-utils';

const getComponentProps = (
  params: VxeColumnSlotTypes.DefaultSlotParams,
  column: SmartColumn,
): Recordable => {
  const componentProps = column.componentProps;
  let props;
  if (isFunction(componentProps)) {
    props = componentProps(params);
  } else {
    props = componentProps;
  }
  return props;
};

const componentMap: {
  [index: string]: (
    column: SmartColumn,
    t: Function,
  ) => (params: VxeColumnSlotTypes.DefaultSlotParams) => VNode | string;
} = {
  switch: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const props = {
        checked: params.row[params.column.field],
        ...getComponentProps(params, column),
      };
      return <a-switch {...props} />;
    };
  },
  tag: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const props = getComponentProps(params, column);
      const defaultValue = props?.default || params.row[params.column.field];
      return <a-tag {...props}>{defaultValue}</a-tag>;
    };
  },
  button: (column) => {
    return (params: VxeColumnSlotTypes.DefaultSlotParams) => {
      const props: Recordable = {
        size: params.$table.props.size,
        ...getComponentProps(params, column),
      };
      const defaultValue = props?.default || params.row[params.column.field];
      return <a-button {...props}>{defaultValue}</a-button>;
    };
  },
  booleanTag: (column, t) => {
    return (params) => {
      const componentProps = getComponentProps(params, column);
      const defaultValue = componentProps?.default || params.row[params.column.field];
      if (!isBoolean(defaultValue)) {
        return '';
      }
      const props: Recordable = {
        ...componentProps,
        color: defaultValue ? '#108ee9' : '#f50',
      };
      return <a-tag {...props}>{defaultValue ? t('common.form.yes') : t('common.form.no')}</a-tag>;
    };
  },
  useYnTag: (column, t) => {
    return (params) => {
      const componentProps = getComponentProps(params, column);
      const defaultValue = componentProps?.default || params.row[params.column.field];
      if (!isBoolean(defaultValue)) {
        return '';
      }
      const props: Recordable = {
        ...componentProps,
        color: defaultValue ? '#108ee9' : '#f50',
      };
      return (
        <a-tag {...props}>{defaultValue ? t('common.form.use') : t('common.form.noUse')}</a-tag>
      );
    };
  },
};

export const useSmartTableColumn = (tableProps: ComputedRef<SmartTableProps>, t: Function) => {
  const getTableColumns = computed<Array<SmartColumn>>((): SmartColumn[] => {
    const propsColumns = unref(tableProps).columns || [];
    const tableSize = unref(tableProps).size;
    const result = propsColumns.map((column) => {
      const { component, slots } = column;
      if (!component || slots) {
        return column;
      }
      const defaultSlot = componentMap[component];
      if (!defaultSlot) {
        return column;
      }
      return {
        ...column,
        slots: {
          default: defaultSlot(column, t),
        },
      };
    });
    convertEditRender(result, tableSize);
    return result;
  });

  /**
   * 可编辑表格计算属性
   */
  const computedEditRules = computed<VxeTablePropTypes.EditRules | null>(() => {
    const rules: VxeTablePropTypes.EditRules = {};
    const propsColumns = unref(tableProps).columns || [];
    for (const { editRender, field } of propsColumns) {
      if (!editRender) {
        continue;
      }
      if (editRender.rules) {
        rules[field!] = editRender.rules;
        continue;
      }
      if (!editRender.required) {
        continue;
      }
      rules[field!] = [
        {
          required: true,
          content: '请输入',
        },
      ];
    }
    if (Object.keys(rules).length === 0) {
      return null;
    }
    return rules;
  });
  return {
    getTableColumns,
    computedEditRules,
  };
};

/**
 * 转换可编辑列
 * @param columns
 * @param tableSize
 */
const convertEditRender = (columns: SmartColumn[], tableSize) => {
  for (const column of columns) {
    const convertProps: Recordable = {};
    const { editRender } = column;
    if (!editRender) {
      continue;
    }
    // 处理尺寸
    convertProps.size = getFormSize(tableSize);

    // 处理自动聚焦
    const { autofocus, name } = editRender;
    if (isBoolean(autofocus) && autofocus) {
      if (name === 'ASelect') {
        editRender.autofocus = '.ant-select-selection-search-input';
      } else if (name === 'ADatePicker') {
        editRender.autofocus = '.ant-picker-input input';
      } else {
        editRender.autofocus = undefined;
      }
    }
    // 处理事件冒泡
    if (editRender.stopEnterBubbling !== false) {
      convertProps.onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.stopPropagation();
        }
      };
    }
    if (XEUtils.isFunction(editRender.props)) {
      const defaultProps = editRender.props as Function;
      editRender.props = (row) => {
        return {
          ...convertProps,
          ...defaultProps(row),
        };
      };
    } else {
      editRender.props = {
        ...convertProps,
        ...(editRender.props || {}),
      };
    }
  }
};
