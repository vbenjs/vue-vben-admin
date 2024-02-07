import { onUnmounted, ref, unref, watch } from 'vue';
import type { WatchStopHandle } from 'vue';
import type { NamePath } from 'ant-design-vue/es/form/interface';

import type { FetchParams, SmartTableProps, TableActionType } from '../types/SmartTableType';
import type { FormActionType } from '@/components/Form';
import type { SmartSearchFormActionType } from '../types/SmartSearchFormType';

import { isProdMode } from '@/utils/env';
import type { DynamicProps } from '#/utils';
import { getDynamicProps } from '@/utils';
import { error } from '@/utils/log';
import { VxeGridPropTypes } from 'vxe-table';

type Props = Partial<DynamicProps<SmartTableProps>>;
type UseTableMethod = TableActionType & {
  getSearchForm: () => SmartSearchFormActionType;
  getAddEditForm: () => FormActionType | undefined;
};

export const useSmartTable = (
  tableProps?: Props,
): [
  (
    instance: TableActionType,
    formInstance: UseTableMethod,
    getAddEditForm: () => FormActionType,
  ) => void,
  UseTableMethod,
] => {
  // 表格是否加载
  const loadedRef = ref<Nullable<boolean>>(false);
  const tableRef = ref<Nullable<TableActionType>>(null);
  const searchFormRef = ref<Nullable<UseTableMethod>>(null);
  const addEditFormAction = ref<Nullable<() => FormActionType>>(null);

  let stopWatch: WatchStopHandle;

  const register = (
    instance: TableActionType,
    searchFormInstance: UseTableMethod,
    getAddEditForm: () => FormActionType,
  ) => {
    isProdMode() &&
      onUnmounted(() => {
        tableRef.value = null;
        searchFormRef.value = null;
        addEditFormAction.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return;

    tableRef.value = instance;
    searchFormRef.value = searchFormInstance;
    addEditFormAction.value = getAddEditForm;
    loadedRef.value = true;
    // 设置函数传递的props
    tableProps && instance.setProps(getDynamicProps(tableProps));

    /**
     * 监控table props变化
     */
    stopWatch?.();
    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        // todo:是否重复执行
        immediate: true,
        deep: true,
      },
    );
  };

  const getTableAction = (): TableActionType => {
    const table = unref(tableRef);
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      );
    }
    return table as TableActionType;
  };

  const methods: UseTableMethod = {
    setProps: (props: Partial<SmartTableProps>) => {
      getTableAction().setProps(props);
    },
    getSearchForm: () => {
      return unref(searchFormRef) as unknown as SmartSearchFormActionType;
    },
    getAddEditForm: () => {
      return unref(addEditFormAction)?.call(null);
    },
    reload: async (opt?: FetchParams) => {
      return await getTableAction().reload(opt);
    },
    query: async (opt?: FetchParams) => {
      return await getTableAction().query(opt);
    },
    setLoading: (loading: boolean) => {
      getTableAction().setLoading(loading);
    },
    setPagination: (info: Partial<VxeGridPropTypes.PagerConfig>) => {
      getTableAction().setPagination(info);
    },
    setShowPagination: async (show: boolean) => {
      await getTableAction().setShowPagination(show);
    },
    getPagination: () => getTableAction().getPagination(),
    getShowPagination: () => {
      return getTableAction().getShowPagination();
    },
    commitVxeProxy: (code, ...args) => {
      return getTableAction().commitVxeProxy(code, args);
    },
    deleteByCheckbox: () => {
      getTableAction().deleteByCheckbox();
    },
    getCheckboxRecords: (isFull: boolean) => {
      return getTableAction().getCheckboxRecords(isFull);
    },
    getRadioRecord: (isFull: boolean) => {
      return getTableAction().getRadioRecord(isFull);
    },
    showAddModal: (formData?: Recordable, selectData?: Recordable) => {
      getTableAction().showAddModal(formData, selectData);
    },
    editByCheckbox: () => {
      return getTableAction().editByCheckbox();
    },
    getAddEditFieldsValue: () => {
      return getTableAction().getAddEditFieldsValue();
    },
    resetAddEditFields: () => {
      return getTableAction().resetAddEditFields();
    },
    setAddEditFieldsValue: (data: any) => {
      return getTableAction().setAddEditFieldsValue(data);
    },
    editByRowModal: (data, formData) => {
      return getTableAction().editByRowModal(data, formData);
    },
    deleteByRow: (data) => {
      return getTableAction().deleteByRow(data);
    },
    setRadioRow: (row) => {
      return getTableAction().setRadioRow(row);
    },
    setCheckboxRow(rows: any, checked: boolean): Promise<any> {
      return getTableAction().setCheckboxRow(rows, checked);
    },
    validateAddEdit: (nameList?: NamePath[]) => {
      return getTableAction().validateAddEdit(nameList);
    },
    validateAddEditFields: (nameList?: NamePath[]) => {
      return getTableAction().validateAddEdit(nameList);
    },
    getTableInstance: () => {
      return getTableAction().getTableInstance();
    },
    getData: (rowIndex?: number) => {
      return getTableAction().getData(rowIndex);
    },
    useYnByCheckbox: (useYn: boolean) => {
      return getTableAction().useYnByCheckbox(useYn);
    },
    useYnByRow: (row: any | any[], useYn: boolean) => {
      return getTableAction().useYnByRow(row, useYn);
    },
  };
  return [register, methods];
};
