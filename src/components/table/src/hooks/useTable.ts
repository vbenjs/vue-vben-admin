import { BasicTableProps, TableInstance, FetchParams, BasicColumn } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { ref, getCurrentInstance, onUnmounted, unref } from 'compatible-vue';
import { isProdMode } from '@/utils/envUtil';

export function useTable(
  tableProps?: Partial<BasicTableProps>
): [(instance: TableInstance) => void, TableInstance] {
  if (!getCurrentInstance()) {
    throw new Error('Please put useTable function in the setup function!');
  }

  const tableRef = ref<TableInstance | null>(null);
  const loadedRef = ref<boolean | null>(false);

  function register(instance: TableInstance) {
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

  const methods: TableInstance = {
    reload: (opt?: FetchParams) => {
      unref(tableRef)?.reload(opt);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      unref(tableRef)?.setProps(props);
    },
    redoHeight: () => {
      unref(tableRef)?.redoHeight();
    },
    setLoading: (loading: boolean) => {
      unref(tableRef)?.setLoading(loading);
    },
    getDataSource: () => {
      return unref(tableRef)?.getDataSource();
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean }) => {
      const columns = unref(tableRef)?.getColumns({ ignoreIndex }) || [];

      return columns;
    },
    setColumns: (columns: BasicColumn[]) => {
      unref(tableRef)?.setColumns(columns);
    },
    setTableData: (values: any[]) => {
      return unref(tableRef)?.setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return unref(tableRef)?.setPagination(info);
    },
    deleteSelectRowByKey: (key: string) => {
      unref(tableRef)?.deleteSelectRowByKey(key);
    },
    getSelectRowKeys: () => {
      return unref(tableRef)?.getSelectRowKeys();
    },
    getSelectRows: () => {
      return unref(tableRef)?.getSelectRows();
    },
    clearSelectedRowKeys: () => {
      unref(tableRef)?.clearSelectedRowKeys();
    },
    setSelectedRowKeys: (keys: string[]) => {
      unref(tableRef)?.setSelectedRowKeys(keys);
    },
    getPaginationRef: () => {
      return unref(tableRef)?.getPaginationRef();
    },
  } as TableInstance;

  return [register, methods];
}
