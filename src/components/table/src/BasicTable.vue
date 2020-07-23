<script lang="tsx">
  import { defineComponent, unref, ref, computed } from 'compatible-vue';
  import { Table } from 'ant-design-vue';
  import TableTitle from './components/TableTitle.vue';

  import { usePagination } from './hooks/usePagination';
  import { useLoading } from './hooks/useLoading';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useDataSource } from './hooks/useDataSource';
  import { useColumns } from './hooks/useColumns';
  import { useDesign } from '@/hooks/core/useDesign';

  import { basicProps } from './props';
  import { BasicTableProps, TableInstance, FetchParams } from './types/table';
  import { PaginationProps } from './types/pagination';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { isFunction } from '@/utils/is/index';

  import { BasicForm, FormProps } from '@/components/form/index';
  export default defineComponent({
    name: 'BasicTable',
    props: basicProps,
    setup(props: BasicTableProps, ctx) {
      const { attrs, emit, slots, listeners } = ctx;
      const tableElRef = ref<any>(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();
      const lastPropsRef = ref<BasicTableProps>();
      const getPropsRef = computed(() => {
        lastPropsRef.value = {
          ...props,
          ...unref(lastPropsRef),
          ...unref(innerPropsRef),
        };
        return unref(lastPropsRef) as BasicTableProps;
      });
      const { getPaginationRef, setPagination } = usePagination(getPropsRef);
      const { loadingRef } = useLoading(getPropsRef);
      const { getDataSourceRef, setTableData, rowKey, fetch } = useDataSource(getPropsRef, ctx, {
        getPaginationRef,
        loadingRef,
        setPagination,
      });
      const { getColumnsRef } = useColumns(getPropsRef, getPaginationRef);
      const { getScrollRef, redoHeight } = useTableScroll(getPropsRef, tableElRef);
      const {
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getPropsRef, emit);
      const { prefixCls } = useDesign('basic-table');

      const renderTitle = () => {
        const title = unref(getPropsRef).title;

        return (
          getSlot(slots, 'title') || (
            <TableTitle
              helpMessage={unref(getPropsRef).titleHelpMessage}
              title={title}
              getSelectRows={getSelectRows}
            >
              {getSlot(slots, 'toolbar')}
            </TableTitle>
          )
        );
      };
      function handleTableChange(pagination: PaginationProps) {
        const { clearSelectOnPageChange } = unref(getPropsRef);
        if (clearSelectOnPageChange) {
          clearSelectedRowKeys();
        }
        setPagination(pagination);
        fetch();
      }

      function handleSearchInfoChange(info: any) {
        const { handleSearchInfoFn } = unref(getPropsRef);
        if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
          info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
      }
      emit('register', {
        reload: (opt?: FetchParams) => {
          fetch(opt);
        },
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        redoHeight,
        setSelectedRowKeys,
        getPaginationRef: () => {
          return unref(getPaginationRef);
        },
        getColumns: () => {
          return unref(getColumnsRef);
        },
        getDataSource: () => {
          return unref(getDataSourceRef);
        },
        setLoading: (loading: boolean) => {
          loadingRef.value = loading;
        },
        setProps: (props: Partial<BasicTableProps>) => {
          innerPropsRef.value = props;
        },
      } as TableInstance);
      return () => {
        const title = unref(getPropsRef).title;
        const titleData =
          !getSlot(slots, 'title') && !title && !getSlot(slots, 'toolbar')
            ? {}
            : { title: renderTitle };
        const propsData: BasicTableProps = {
          // @ts-ignore
          size: 'middle',
          ...attrs,
          ...unref(getPropsRef),
          ...titleData,
          columns: unref(getColumnsRef),
          dataSource: unref(getDataSourceRef),
          rowKey: rowKey,
          rowSelection: unref(getRowSelectionRef),
          loading: unref(loadingRef),
          scroll: unref(getScrollRef),
          pagination: unref(getPaginationRef) as PaginationProps,
          tableLayout: 'fixed',
        };
        const { useSearchForm, formConfig } = propsData;
        const formProps: FormProps = {
          showAdvancedButton: true,
          ...(formConfig as FormProps),
          compact: true,
        };
        return (
          <div class={prefixCls}>
            {useSearchForm && (
              <BasicForm
                submitButtonOptions={{ loading: unref(loadingRef) }}
                onChange={handleSearchInfoChange}
                {...{ props: formProps }}
                onAdvancedChange={redoHeight}
              />
            )}
            <Table
              ref={tableElRef}
              on={{ ...listeners, change: handleTableChange }}
              {...{
                props: propsData,
              }}
            ></Table>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-basic-table';
  @border-color: rgba(206, 206, 206, 0.3);
  .@{prefix-cls} {
    padding: 12px;

    .ant-table-title {
      padding: 10px 6px !important;
    }

    .ant-table-tbody > tr.ant-table-row-selected td {
      background: fade(@primary-color, 8%) !important;
    }

    .ant-table-bordered .ant-table-header > table,
    .ant-table-bordered .ant-table-body > table,
    .ant-table-bordered .ant-table-fixed-left table,
    .ant-table-bordered .ant-table-fixed-right table {
      border: 1px solid @border-color;
    }

    .ant-table-thead {
      th {
        border: none;
      }
    }

    .ant-table-bordered .ant-table-tbody > tr > td {
      border-bottom: 1px solid @border-color;

      &:last-child {
        border-right: none !important;
      }
    }

    .ant-table.ant-table-bordered .ant-table-footer,
    .ant-table.ant-table-bordered .ant-table-title {
      border: 1px solid @border-color !important;
    }

    .ant-table-bordered.ant-table-empty .ant-table-placeholder {
      border: 1px solid @border-color !important;
    }

    .ant-table td {
      white-space: nowrap;
    }

    .ant-table-row-cell-last {
      border-right: none !important;
    }

    .ant-table-bordered .ant-table-thead > tr > th,
    .ant-table-bordered .ant-table-tbody > tr > td {
      border-right: 1px solid @border-color;
    }

    .ant-pagination {
      margin: 10px 0 0 0;
    }

    .ant-table-body {
      overflow-x: auto !important;

      ::-webkit-scrollbar-button {
        display: none;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 48px;
        background: #d2d2d2;
        border: 3px solid #fff;
        border-radius: 5px;
        background-clip: padding-box;
      }

      ::-webkit-scrollbar-thumb:active {
        background: #888;
        border-width: 2px;
      }
    }

    .ant-radio {
      &-inner {
        border-color: @text-color-base;
      }
    }

    .ant-checkbox {
      &:not(.ant-checkbox-checked) {
        .ant-checkbox-inner {
          border-color: @text-color-base;
        }
      }
    }
  }
</style>
