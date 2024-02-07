import type { SmartTableProps, TableActionType } from './types/SmartTableType';
import type { VxeGridInstance } from 'vxe-table';

import { computed, defineComponent, provide, Ref, ref, unref } from 'vue';

import { TableSearchLayout } from '@/components/Layout';
import { BasicForm } from '@/components/Form';
import { useModal } from '@/components/Modal';
import { useI18n } from '@/hooks/web/useI18n';

import { smartTableProps } from './props';
import { useTableSearchForm } from './hooks/useTableSearchForm';
import { useLoading } from './hooks/useLoading';
import { usePagination } from './hooks/usePagination';
import { useTableAjax } from './hooks/useTableAjax';
import { useTableToolbarConfig } from './hooks/useTableToolbarConfig';
import { useTableModalAddEditConfig } from './hooks/useTableModalAddEdit';
import { createTableContext } from './hooks/userSmartTableContext';
import { useTableRowDrag } from './hooks/useTableDrag';
import { useSmartTableColumn } from './hooks/useSmartTableColumn';
import SmartTableAddEditModal from './components/SmartTableAddEditModal';
import './renderer/VxeTableButtonRenderer';
import { error } from '@/utils/log';

import './SmartTable.less';
import { useToolbarEvent } from './hooks/useToolbarEvent';
import { useSmartTableCheckbox } from './hooks/useSmartTableCheckbox';
import { useSmartTableDynamicClassStyle } from './hooks/useSmartTableDynamicClassStyle';
import { useSmartTableColumnConfig } from '@/components/SmartTable/src/hooks/useSmartTableColumnConfig';

export default defineComponent({
  name: 'SmartTable',
  props: smartTableProps,
  emits: [
    'register',
    'toolbar-tool-click',
    'proxy-query',
    'proxy-delete',
    'add-edit-modal-show',
    'cell-click',
  ],
  setup(props, { emit, slots, attrs }) {
    const { t } = useI18n();
    const tableElRef = ref<VxeGridInstance>() as Ref<VxeGridInstance>;
    const wrapRef = ref(null);

    const innerPropsRef = ref<Partial<SmartTableProps>>();
    /**
     * 表格计算属性
     */
    const getTableProps = computed(() => {
      return {
        ...props,
        ...unref(innerPropsRef),
      };
    });

    const setProps = (props: Partial<SmartTableProps>) => {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    };

    // -------------- 分页 ---------------------------
    const {
      getPaginationInfo,
      getPagination,
      setPagination,
      getShowPagination,
      setShowPagination,
    } = usePagination(getTableProps);

    /**
     * vxe-table函数
     */
    const getTableInstance = () => unref(tableElRef);
    provide('getTableInstance', getTableInstance);
    const commitVxeProxy = (code, ...args) => getTableInstance()?.commitProxy(code, args);
    const getCheckboxRecords = (isFull: boolean) =>
      getTableInstance()?.getCheckboxRecords(isFull) || [];
    const getRadioRecord = (isFull: boolean) => getTableInstance()?.getRadioRecord(isFull);
    const setRadioRow = (row: any) => getTableInstance()!.setRadioRow(row);
    const setCheckboxRow = (rows: any | any[], checked: boolean) =>
      getTableInstance()!.setCheckboxRow(rows, checked);

    /**
     * 加载状态
     */
    const { getLoading, setLoading } = useLoading(getTableProps);

    // -------------- 搜索表单 ------------------------
    const {
      getSearchFormProps,
      handleSearchInfoChange,
      getSearchFormSlot,
      getSearchFormColumnSlot,
      registerSearchForm,
      searchFormAction,
      getSearchFormVisible,
    } = useTableSearchForm(
      getTableProps,
      slots,
      (params) => query(params),
      getLoading,
      setPagination,
    );

    // -------------- 加载函数 ------------------------
    const {
      reload,
      query,
      getProxyConfigRef,
      deleteByRow,
      deleteByCheckbox,
      getProxyEvents,
      useYnByCheckbox,
      useYnByRow,
    } = useTableAjax(getTableProps, tableElRef, emit, {
      commitVxeProxy,
      getSearchFormParameter: searchFormAction.getSearchFormParameter,
      getCheckboxRecords,
      setLoading,
    });

    // -------------- 添加修改操作 ---------------------
    const [registerAddEditModal, { openModal: openAddEditModal }] = useModal();
    const addEditModalRef = ref();
    const getAddEditFieldsValue = () => unref(addEditModalRef).getFieldsValue();
    const resetAddEditFields = () => unref(addEditModalRef).resetFields();
    const setAddEditFieldsValue = (data: Recordable) => unref(addEditModalRef).setFieldsValue(data);
    const validateAddEdit = () => unref(addEditModalRef).validate();
    const validateAddEditFields = () => unref(addEditModalRef).validateFields();
    const getAddEditForm = () => unref(addEditModalRef).getFormAction();
    const {
      getHasAddEdit,
      showAddModal,
      editByCheckbox,
      editByRowModal,
      getAddEditFormProps,
      getAddEditModalProps,
      getAddEditFormSlots,
    } = useTableModalAddEditConfig(emit, getTableProps, slots, {
      getCheckboxRecords,
      openAddEditModal,
      query,
    });

    const getCustomConfig = computed(() => {
      const tableProps = unref(getTableProps);
      if (tableProps.customConfig) {
        return tableProps.customConfig;
      }
      return {
        storage: {
          visible: true,
          resizable: true,
        },
      };
    });

    /**
     * 列排序存储
     */
    const { setColumnSortConfig, computedColumnSort } = useSmartTableColumnConfig(getTableInstance);

    // ------------- toolbar配置 ----------------------

    const { getToolbarConfigInfo } = useTableToolbarConfig(getTableProps, t, {
      deleteByCheckbox,
      showAddModal,
      editByCheckbox,
      query,
      getSearchFormVisible: searchFormAction.getSearchFormVisible,
      useYnByCheckbox,
      setColumnSortConfig,
    });

    /**
     * 表格事件
     */
    const { getToolbarEvents } = useToolbarEvent(emit, {
      setSearchFormVisible: searchFormAction.setSearchFormVisible,
    });
    const getTableEvents = computed(() => {
      return {
        ...unref(getToolbarEvents),
        ...getProxyEvents,
      };
    });

    /**
     * 表格拖拽支持
     */
    const { getTableDragColumn, getTableDragSlot } = useTableRowDrag(getTableProps, tableElRef, {
      getData: () => getTableInstance().getData(),
      loadData: (data) => getTableInstance().loadData(data),
    });

    /**
     * checkbox 功能加强
     */
    const { computeCheckboxTableProps } = useSmartTableCheckbox(
      getTableProps,
      emit,
      getTableInstance,
    );

    const { getTableColumns, computedEditRules } = useSmartTableColumn(getTableProps, t);

    /**
     * 列动态class style支持
     */
    const { computedTableClassStyle } = useSmartTableDynamicClassStyle(getTableProps);

    /**
     * 获取table v-bing
     */
    const getTableBindValues = computed<SmartTableProps>(() => {
      const tableProps = unref(getTableProps);
      return {
        ...attrs,
        editRules: unref(computedEditRules),
        ...tableProps,
        // loading: unref(getLoading),
        ...unref(computeCheckboxTableProps),
        // data: dataSource,
        toolbarConfig: unref(getToolbarConfigInfo),
        proxyConfig: unref(getProxyConfigRef),
        customConfig: unref(getCustomConfig),
        ...unref(getTableEvents),
        ...unref(computedTableClassStyle),
      };
    });

    const getTableSlots = computed(() => {
      return {
        ...slots,
        ...unref(getTableDragSlot),
      };
    });

    /**
     *
     */
    const tableAction: TableActionType = {
      reload,
      query,
      setProps,
      setLoading,
      // 分页
      getPagination,
      setPagination,
      commitVxeProxy,
      getShowPagination,
      setShowPagination,
      deleteByCheckbox,
      getCheckboxRecords,
      getRadioRecord,
      // openAddEditModal,
      showAddModal,
      editByCheckbox,
      editByRowModal,
      getAddEditFieldsValue,
      resetAddEditFields,
      setAddEditFieldsValue,
      deleteByRow,
      setRadioRow,
      setCheckboxRow,
      validateAddEdit,
      validateAddEditFields,
      getTableInstance,
      getData: (rowIndex?: number) => {
        if (rowIndex) {
          return getTableInstance().getData(rowIndex);
        }
        return getTableInstance().getData();
      },
      useYnByCheckbox,
      useYnByRow,
    };

    const computedTableColumns = computed(() => {
      const columns = [...unref(getTableDragColumn), ...unref(getTableColumns)];
      const columnSort = unref(computedColumnSort);
      if (!columnSort) {
        return columns;
      }
      return columns.sort((a, b) => {
        if (!a.field) {
          return 0;
        }
        if (columnSort.indexOf(a.field) === -1) {
          return 0;
        }
        return columnSort.indexOf(a.field) - columnSort.indexOf(b.field);
      });
    });

    createTableContext({ ...tableAction, wrapRef, getBindValues: getTableBindValues });

    emit('register', tableAction, searchFormAction, getAddEditForm);

    return {
      registerSearchForm,
      getSearchFormProps,
      getTableProps,
      tableAction,
      getTableBindValues,
      getPaginationInfo,
      tableElRef,
      handleSearchInfoChange,
      getSearchFormSlot,
      getSearchFormColumnSlot,
      getHasAddEdit,
      registerAddEditModal,
      getAddEditFormProps,
      getAddEditModalProps,
      addEditModalRef,
      wrapRef,
      getAddEditFormSlots,
      getSearchFormVisible,
      getTableEvents,
      getTableSlots,
      tableColumns: computedTableColumns,
      pagerConfig: getPaginationInfo,
      setColumnSortConfig,
    };
  },
  render() {
    const {
      getTableProps: { useSearchForm },
      getSearchFormVisible,
    } = this;

    // const $this = this

    const slots: any = {
      default: renderTable(this),
    };
    /**
     * 渲染搜索表格
     */
    if (useSearchForm) {
      slots.search = renderSearchForm(this);
    }
    // @ts-ignore
    return (
      <TableSearchLayout showSearch={getSearchFormVisible} class="smart-table" ref="wrapRef">
        {slots}
      </TableSearchLayout>
    );
  },
});

/**
 * 渲染搜索表单
 * @param smartTableInstance
 */
const renderSearchForm = (smartTableInstance) => {
  return () => {
    const {
      registerSearchForm,
      getSearchFormProps,
      handleSearchInfoChange,
      getSearchFormSlot,
      getSearchFormColumnSlot,
      id,
    } = smartTableInstance;
    const formAttrs = {
      ...getSearchFormProps,
      onSubmit: handleSearchInfoChange,
      submitOnReset: true,
      onRegister: registerSearchForm,
    };
    // 获取插槽
    const searchFormSlots = {
      ...getSearchFormSlot,
      ...getSearchFormColumnSlot,
    };
    if (
      Object.keys(getSearchFormSlot).length + Object.keys(getSearchFormColumnSlot).length >
      Object.keys(searchFormSlots).length
    ) {
      error('搜索表单插槽命名重复');
    }
    return (
      <BasicForm name={`${id}_search_form`} {...formAttrs}>
        {searchFormSlots}
      </BasicForm>
    );
  };
};

/**
 * 渲染表格
 */
const renderTable = (instance) => {
  return () => {
    const {
      getTableBindValues,
      getTableSlots,
      getHasAddEdit,
      registerAddEditModal,
      getAddEditFormProps,
      getAddEditModalProps,
      getAddEditFormSlots,
      id,
      tableColumns,
      pagerConfig,
    } = instance;
    const tableProps = {
      ...getTableBindValues,
      columns: tableColumns,
      pagerConfig,
    };
    const result = [
      <vxe-grid ref="tableElRef" {...tableProps}>
        {{ ...getTableSlots }}
      </vxe-grid>,
    ];
    if (getHasAddEdit) {
      result.push(
        <SmartTableAddEditModal
          ref="addEditModalRef"
          {...getAddEditModalProps}
          tableId={id}
          onRegister={registerAddEditModal}
          formConfig={getAddEditFormProps}
        >
          {getAddEditFormSlots}
        </SmartTableAddEditModal>,
      );
    }
    return result;
  };
};
