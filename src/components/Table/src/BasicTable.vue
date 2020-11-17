<template>
  <div
    ref="wrapRef"
    class="basic-table"
    :class="{
      'table-form-container': getBindValues.useSearchForm,
      inset: getBindValues.inset,
    }"
  >
    <BasicForm
      :submitOnReset="true"
      v-bind="getFormProps"
      v-if="getBindValues.useSearchForm"
      :submitButtonOptions="{ loading }"
      :tableAction="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="`form-${item}`" v-bind="data" />
      </template>
    </BasicForm>
    <Table
      ref="tableElRef"
      v-bind="getBindValues"
      :rowClassName="getRowClassName"
      v-show="getEmptyDataIsShowTable"
      @change="handleTableChange"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
  import type {
    BasicTableProps,
    FetchParams,
    GetColumnsParams,
    TableActionType,
    SizeType,
    SorterResult,
    TableCustomRecord,
  } from './types/table';
  import { PaginationProps } from './types/pagination';

  import { defineComponent, ref, computed, unref, watch, nextTick, toRaw } from 'vue';
  import { Table } from 'ant-design-vue';
  import renderTitle from './components/renderTitle';
  import renderFooter from './components/renderFooter';
  import renderExpandIcon from './components/renderExpandIcon';
  import { BasicForm, FormProps, useForm } from '/@/components/Form/index';

  import { isFunction, isString } from '/@/utils/is';
  import { deepMerge } from '/@/utils';
  import { omit } from 'lodash-es';

  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useTableScroll } from './hooks/useTableScroll';
  import { provideTable } from './hooks/useProvinceTable';

  import { useEventListener } from '/@/hooks/event/useEventListener';
  import { basicProps } from './props';
  import { ROW_KEY } from './const';
  import './style/index.less';
  export default defineComponent({
    props: basicProps,
    components: { Table, BasicForm },
    emits: ['fetch-success', 'fetch-error', 'selection-change', 'register'],
    setup(props, { attrs, emit, slots }) {
      const tableElRef = ref<any>(null);
      const wrapRef = ref<Nullable<HTMLDivElement>>(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();
      const [registerForm, { getFieldsValue }] = useForm();

      const getMergeProps = computed(
        (): BasicTableProps => {
          return {
            ...props,
            ...unref(innerPropsRef),
          } as BasicTableProps;
        }
      );
      const { loadingRef } = useLoading(getMergeProps);
      const { getPaginationRef, setPagination } = usePagination(getMergeProps);
      const { getColumnsRef, setColumns } = useColumns(getMergeProps, getPaginationRef);
      const { getDataSourceRef, setTableData, fetch, getAutoCreateKey } = useDataSource(
        getMergeProps,
        {
          getPaginationRef,
          loadingRef,
          setPagination,
          getFieldsValue,
        },
        emit
      );

      const { getScrollRef, redoHeight } = useTableScroll(getMergeProps, tableElRef);
      const {
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getMergeProps, emit);

      const getRowKey = computed(() => {
        const { rowKey } = unref(getMergeProps);

        return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
      });

      const getBindValues = computed(() => {
        const { title, titleHelpMessage, showSummary, showTableSetting, tableSetting } = unref(
          getMergeProps
        );
        const hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting;
        const titleData: any =
          hideTitle && !isString(title)
            ? {}
            : {
                title: hideTitle
                  ? null
                  : renderTitle.bind(
                      null,
                      title,
                      titleHelpMessage,
                      slots,
                      showTableSetting,
                      tableSetting
                    ),
              };
        const pagination = unref(getPaginationRef);
        const rowSelection = unref(getRowSelectionRef);
        const scroll = unref(getScrollRef);
        const loading = unref(loadingRef);
        const rowKey = unref(getRowKey);
        const columns = unref(getColumnsRef);
        const dataSource = unref(getDataSourceRef);
        let propsData = {
          size: 'middle',
          ...(slots.expandedRowRender ? { expandIcon: renderExpandIcon() } : {}),
          ...attrs,
          ...unref(getMergeProps),
          ...titleData,
          scroll,
          loading,
          tableLayout: 'fixed',
          rowSelection,
          rowKey,
          columns,
          pagination,
          dataSource,
        };
        if (slots.expandedRowRender) {
          propsData = omit(propsData, 'scroll');
        }
        if (showSummary) {
          propsData.footer = renderFooter.bind(null, {
            scroll: scroll as any,
            columnsRef: getColumnsRef,
            summaryFunc: unref(getMergeProps).summaryFunc,
            dataSourceRef: getDataSourceRef,
            rowSelectionRef: getRowSelectionRef,
          });
        }
        return propsData;
      });

      const getFormProps = computed(() => {
        const { formConfig } = unref(getBindValues);
        const formProps: FormProps = {
          showAdvancedButton: true,
          ...(formConfig as FormProps),
          compact: true,
        };
        return formProps;
      });

      const getEmptyDataIsShowTable = computed(() => {
        const { emptyDataIsShowTable, useSearchForm } = unref(getMergeProps);
        if (emptyDataIsShowTable || !useSearchForm) {
          return true;
        }
        return !!unref(getDataSourceRef).length;
      });

      watch(
        () => unref(getDataSourceRef),
        () => {
          handleSummary();
        },
        { immediate: true }
      );

      function getRowClassName(record: TableCustomRecord, index: number) {
        const { striped, rowClassName } = unref(getMergeProps);
        if (!striped) return;
        if (rowClassName && isFunction(rowClassName)) {
          return rowClassName(record);
        }
        return (index || 0) % 2 === 1 ? 'basic-table-row__striped' : '';
      }

      function handleSearchInfoChange(info: any) {
        const { handleSearchInfoFn } = unref(getMergeProps);
        if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
          info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
      }

      function handleTableChange(
        pagination: PaginationProps,
        // @ts-ignore
        filters: Partial<Record<string, string[]>>,
        sorter: SorterResult
      ) {
        const { clearSelectOnPageChange, sortFn } = unref(getMergeProps);
        if (clearSelectOnPageChange) {
          clearSelectedRowKeys();
        }
        setPagination(pagination);

        if (sorter && isFunction(sortFn)) {
          const sortInfo = sortFn(sorter);
          fetch({ sortInfo });
          return;
        }
        fetch();
      }

      function handleSummary() {
        if (unref(getMergeProps).showSummary) {
          nextTick(() => {
            const tableEl = unref(tableElRef);
            if (!tableEl) {
              return;
            }
            const bodyDomList = tableEl.$el.querySelectorAll('.ant-table-body') as HTMLDivElement[];
            const bodyDom = bodyDomList[0];
            useEventListener({
              el: bodyDom,
              name: 'scroll',
              listener: () => {
                const footerBodyDom = tableEl.$el.querySelector(
                  '.ant-table-footer .ant-table-body'
                ) as HTMLDivElement;
                if (!footerBodyDom || !bodyDom) return;
                footerBodyDom.scrollLeft = bodyDom.scrollLeft;
              },
              wait: 0,
              options: true,
            });
          });
        }
      }

      function setProps(props: Partial<BasicTableProps>) {
        innerPropsRef.value = deepMerge(unref(innerPropsRef) || {}, props);
      }

      const tableAction: TableActionType = {
        reload: async (opt?: FetchParams) => {
          await fetch(opt);
        },
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        redoHeight,
        setSelectedRowKeys,
        setColumns,
        getPaginationRef: () => {
          return unref(getPaginationRef);
        },
        getColumns: (opt?: GetColumnsParams) => {
          const { ignoreIndex, ignoreAction } = opt || {};
          let columns = toRaw(unref(getColumnsRef));
          if (ignoreIndex) {
            columns = columns.filter((item) => item.flag !== 'INDEX');
          }
          if (ignoreAction) {
            columns = columns.filter((item) => item.flag !== 'ACTION');
          }
          return columns;
        },
        getDataSource: () => {
          return unref(getDataSourceRef);
        },
        setLoading: (loading: boolean) => {
          loadingRef.value = loading;
        },
        setProps,
        getSize: (): SizeType => {
          return unref(getBindValues).size;
        },
      };

      provideTable({
        ...tableAction,
        wrapRef,
      });

      emit('register', tableAction);
      return {
        tableElRef,
        getBindValues,
        loading: loadingRef,
        registerForm,
        handleSearchInfoChange,
        getFormProps,
        getEmptyDataIsShowTable,
        handleTableChange,
        getRowClassName,
        wrapRef,
        tableAction,
        ...tableAction,
      };
    },
  });
</script>
