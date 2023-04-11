import { isFunction } from '@vben/shared';
import type { ComputedRef } from 'vue';
import { unref } from 'vue';

import type { BasicTableProps, TableCustomRecord } from '../types/table';

export function useTableStyle(propsRef: ComputedRef<BasicTableProps>, prefixCls: string) {
  function getRowClassName(record: TableCustomRecord, index: number) {
    const { striped, rowClassName } = unref(propsRef);
    const classNames: string[] = [];
    if (striped) {
      classNames.push((index || 0) % 2 === 1 ? `${prefixCls}-row__striped` : '');
    }
    if (rowClassName && isFunction(rowClassName)) {
      classNames.push(rowClassName(record, index));
    }
    return classNames.filter((cls) => !!cls).join(' ');
  }

  return { getRowClassName };
}
