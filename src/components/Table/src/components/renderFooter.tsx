import { Table } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { unref, ComputedRef } from 'vue';
import { isFunction } from '/@/utils/is';
import type { BasicColumn, TableRowSelection } from '../types/table';

export default ({
  scroll = {},
  columnsRef,
  summaryFunc,
  rowKey = 'key',
  dataSourceRef,
  rowSelectionRef,
}: {
  scroll: { x?: number | true; y?: number };
  columnsRef: ComputedRef<BasicColumn[]>;
  summaryFunc: any;
  rowKey?: string;
  dataSourceRef: ComputedRef<any[]>;
  rowSelectionRef: ComputedRef<TableRowSelection | null>;
}) => {
  if (!summaryFunc) {
    return;
  }
  const dataSource: any[] = isFunction(summaryFunc) ? summaryFunc(unref(dataSourceRef)) : [];
  const columns: BasicColumn[] = cloneDeep(unref(columnsRef));
  const index = columns.findIndex((item) => item.flag === 'INDEX');
  const hasRowSummary = dataSource.some((item) => Reflect.has(item, '_row'));
  const hasIndexSummary = dataSource.some((item) => Reflect.has(item, '_index'));

  if (index !== -1) {
    if (hasIndexSummary) {
      columns[index].customRender = ({ record }) => record._index;
      columns[index].ellipsis = false;
    } else {
      Reflect.deleteProperty(columns[index], 'customRender');
    }
  }
  if (unref(rowSelectionRef) && hasRowSummary) {
    columns.unshift({
      width: 60,
      title: 'selection',
      key: 'selectionKey',
      align: 'center',
      customRender: ({ record }) => record._row,
    });
  }

  dataSource.forEach((item, i) => {
    item[rowKey] = i;
  });
  return (
    <Table
      showHeader={false}
      bordered={false}
      pagination={false}
      dataSource={dataSource}
      rowKey={rowKey}
      columns={columns}
      tableLayout="fixed"
      scroll={scroll as any}
    />
  );
};
