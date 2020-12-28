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
      :submitButtonOptions="{ loading: getLoading }"
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
  import type { BasicTableProps, TableActionType, SizeType, SorterResult } from './types/table';
  import { PaginationProps } from './types/pagination';

  import { defineComponent, ref, computed, unref, watch, nextTick } from 'vue';
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
  import { useCustomRow } from './hooks/useCustomRow';
  import { useTableStyle } from './hooks/useTableStyle';

  import { useEventListener } from '/@/hooks/event/useEventListener';
  import { basicProps } from './props';
  import { useExpose } from '/@/hooks/core/useExpose';

  import './style/index.less';
  export default defineComponent({
    props: basicProps,
    components: { Table, BasicForm },
    emits: [
      'fetch-success',
      'fetch-error',
      'selection-change',
      'register',
      'row-click',
      'row-dbClick',
      'row-contextmenu',
      'row-mouseenter',
      'row-mouseleave',
    ],
    setup(props, { attrs, emit, slots }) {
      const tableElRef = ref<ComponentRef>(null);

      const wrapRef = ref<Nullable<HTMLDivElement>>(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();

      const [registerForm, { getFieldsValue }] = useForm();

      const getProps = computed(() => {
        return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
      });

      const { getLoading, setLoading } = useLoading(getProps);
      const { getPaginationInfo, getPagination, setPagination } = usePagination(getProps);
      const { getColumnsRef, getColumns, setColumns } = useColumns(getProps, getPaginationInfo);
      const {
        getDataSourceRef,
        getDataSource,
        setTableData,
        fetch,
        getRowKey,
        reload,
        getAutoCreateKey,
      } = useDataSource(
        getProps,
        {
          getPaginationInfo,
          setLoading,
          setPagination,
          getFieldsValue,
        },
        emit
      );

      const { getScrollRef, redoHeight } = useTableScroll(getProps, tableElRef);

      const {
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getProps, emit);

      const { customRow } = useCustomRow(getProps, {
        setSelectedRowKeys,
        getSelectRowKeys,
        clearSelectedRowKeys,
        getAutoCreateKey,
        emit,
      });

      const { getRowClassName } = useTableStyle(getProps);

      const getTitleProps = computed(
        (): Recordable => {
          const { title, showTableSetting, titleHelpMessage, tableSetting } = unref(getProps);
          const hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting;
          if (hideTitle && !isString(title)) {
            return {};
          }
          return {
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
        }
      );

      const getBindValues = computed(() => {
        const { showSummary } = unref(getProps);

        let propsData: Recordable = {
          size: 'middle',
          ...(slots.expandedRowRender ? { expandIcon: renderExpandIcon() } : {}),
          ...attrs,
          customRow,
          ...unref(getProps),
          ...unref(getTitleProps),
          scroll: unref(getScrollRef),
          loading: unref(getLoading),
          tableLayout: 'fixed',
          rowSelection: unref(getRowSelectionRef),
          rowKey: unref(getRowKey),
          columns: unref(getColumnsRef),
          pagination: unref(getPaginationInfo),
          dataSource: unref(getDataSourceRef),
        };
        if (slots.expandedRowRender) {
          propsData = omit(propsData, 'scroll');
        }
        if (showSummary) {
          propsData.footer = renderFooter.bind(null, {
            scroll: scroll as any,
            columnsRef: getColumnsRef,
            summaryFunc: unref(getProps).summaryFunc,
            dataSourceRef: getDataSourceRef,
            rowSelectionRef: getRowSelectionRef,
          });
        }
        return propsData;
      });

      const getFormProps = computed(() => {
        const { formConfig } = unref(getProps);
        const formProps: Partial<FormProps> = {
          showAdvancedButton: true,
          ...formConfig,
          compact: true,
        };
        return formProps;
      });

      const getEmptyDataIsShowTable = computed(() => {
        const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
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

      function handleSearchInfoChange(info: any) {
        const { handleSearchInfoFn } = unref(getProps);
        if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
          info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
      }

      function handleTableChange(
        pagination: PaginationProps,
        // @ts-ignore
        filters: Partial<Recordable<string[]>>,
        sorter: SorterResult
      ) {
        const { clearSelectOnPageChange, sortFn } = unref(getProps);
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
        if (unref(getProps).showSummary) {
          nextTick(() => {
            const tableEl = unref(tableElRef);
            if (!tableEl) return;
            const bodyDomList = tableEl.$el.querySelectorAll('.ant-table-body');
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
        reload,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        redoHeight,
        setSelectedRowKeys,
        setColumns,
        setLoading,
        getDataSource,
        setProps,
        getPaginationRef: getPagination,
        getColumns,
        getSize: () => {
          return unref(getBindValues).size as SizeType;
        },
      };

      provideTable({
        ...tableAction,
        wrapRef,
      });

      useExpose<TableActionType>(tableAction);

      emit('register', tableAction);

      return {
        tableElRef,
        getBindValues,
        getLoading,
        registerForm,
        handleSearchInfoChange,
        getFormProps,
        getEmptyDataIsShowTable,
        handleTableChange,
        getRowClassName,
        wrapRef,
        tableAction,
        redoHeight,
      };
    },
  });
</script>
