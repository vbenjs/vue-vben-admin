import type { BasicTableProps, TableActionType, FetchParams, BasicColumn } from '../types/table';
import type { PaginationProps } from '../types/pagination';

import { ref, getCurrentInstance, onUnmounted, unref } from 'vue';
import { isProdMode } from '/@/utils/env';

export function useTable(
  tableProps?: Partial<BasicTableProps>
): [(instance: TableActionType) => void, TableActionType] {
  if (!getCurrentInstance()) {
    throw new Error('Please put useTable function in the setup function!');
  }

  const tableRef = ref<TableActionType | null>(null);
  const loadedRef = ref<boolean | null>(false);

  function register(instance: TableActionType) {
    onUnmounted(() => {
      tableRef.value = null;
      loadedRef.value = null;
    });
    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) {
      return;
    }
    tableRef.value = instance;
    tableProps && instance.setProps(tableProps);
    loadedRef.value = true;
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef);
    if (!table) {
      throw new Error('table is undefined!');
    }
    return table;
  }

  const methods: TableActionType = {
    reload: (opt?: FetchParams) => {
      getTableInstance().reload(opt);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props);
    },
    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];

      return columns;
    },
    setColumns: (columns: BasicColumn[]) => {
      getTableInstance().setColumns(columns);
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    deleteSelectRowByKey: (key: string) => {
      getTableInstance().deleteSelectRowByKey(key);
    },
    getSelectRowKeys: () => {
      return getTableInstance().getSelectRowKeys();
    },
    getSelectRows: () => {
      return getTableInstance().getSelectRows();
    },
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    setSelectedRowKeys: (keys: string[] | number[]) => {
      getTableInstance().setSelectedRowKeys(keys);
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef();
    },
    getSize: () => {
      return getTableInstance().getSize();
    },
  } as TableActionType;

  return [register, methods];
}
