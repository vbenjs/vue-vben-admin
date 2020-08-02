<script lang="tsx">
  import { defineComponent, unref, ref, computed } from 'compatible-vue';
  import { Table } from 'ant-design-vue';
  import TableTitle from './components/TableTitle.vue';
  import BodyWarpper from './components/BodyWarpper.vue';
  import CellResize from './components/CellResize.vue';

  import { usePagination } from './hooks/usePagination';
  import { useLoading } from './hooks/useLoading';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useDataSource } from './hooks/useDataSource';
  import { useColumns } from './hooks/useColumns';
  import { useDesign } from '@/hooks/core/useDesign';
  import { provideTable } from './hooks/useProvinceTable';

  import { basicProps } from './props';
  import { BasicTableProps, TableInstance, FetchParams, getColumnsParams } from './types/table';
  import { PaginationProps } from './types/pagination';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { isFunction, isString } from '@/utils/is/index';

  import { BasicForm, FormProps } from '@/components/form/index';
  export default defineComponent({
    name: 'BasicTable',
    props: basicProps,
    setup(props: BasicTableProps, ctx) {
      const { attrs, emit, slots, listeners } = ctx;
      const tableElRef = ref<any>(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();
      // const lastPropsRef = ref<BasicTableProps>();

      const getMergeProps = computed(() => {
        return {
          ...props,
          ...unref(innerPropsRef),
        };
      });
      // const getPropsRef = computed(() => {
      //   lastPropsRef.value = {
      //     ...props,
      //     ...unref(lastPropsRef),
      //     ...unref(innerPropsRef),
      //   };
      //   return unref(lastPropsRef) as BasicTableProps;
      // });
      const getComponentsRef = computed(() => {
        const res: any = {};

        if (unref(getMergeProps).canRowDrag) {
          res.body = {
            wrapper: BodyWarpper,
          };
        }
        if (unref(getMergeProps).canColDrag) {
          res.header = {
            cell: CellResize,
          };
        }

        return res;
      });
      const { getPaginationRef, setPagination } = usePagination(getMergeProps);
      const { loadingRef } = useLoading(getMergeProps);
      const { getDataSourceRef, setTableData, rowKey, fetch } = useDataSource(getMergeProps, ctx, {
        getPaginationRef,
        loadingRef,
        setPagination,
      });
      const { getColumnsRef, setColumns } = useColumns(getMergeProps, getPaginationRef);
      const { getScrollRef, redoHeight } = useTableScroll(getMergeProps, tableElRef);
      const {
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getMergeProps, emit);
      const { prefixCls } = useDesign('basic-table');

      const renderTitle = () => {
        const title = unref(getMergeProps).title;
        return (
          getSlot(slots, 'title') || (
            <TableTitle
              helpMessage={unref(getMergeProps).titleHelpMessage}
              title={title}
              getSelectRows={getSelectRows}
            >
              {getSlot(slots, 'toolbar')}
            </TableTitle>
          )
        );
      };
      function handleTableChange(pagination: PaginationProps) {
        const { clearSelectOnPageChange } = unref(getMergeProps);
        if (clearSelectOnPageChange) {
          clearSelectedRowKeys();
        }
        setPagination(pagination);
        fetch();
      }

      function handleSearchInfoChange(info: any) {
        const { handleSearchInfoFn } = unref(getMergeProps);
        if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
          info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
      }
      const instance = {
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
        setColumns,
        getPaginationRef: () => {
          return unref(getPaginationRef);
        },
        getColumns: (opt?: getColumnsParams) => {
          const { ignoreIndex } = opt || {};
          let columns = unref(getColumnsRef);
          if (ignoreIndex) {
            columns = columns.filter((item) => item.flag !== 'INDEX');
          }
          return columns;
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
      } as TableInstance;
      provideTable(instance);
      emit('register', instance);

      return () => {
        const title = unref(getMergeProps).title;
        const titleData: any =
          !getSlot(slots, 'title') && !isString(title) && !title && !getSlot(slots, 'toolbar')
            ? {}
            : { title: !getSlot(slots, 'title') && !title ? null : renderTitle };
        const propsData: BasicTableProps = {
          // @ts-ignore
          size: 'middle',
          ...attrs,
          ...unref(getMergeProps),
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
              components={unref(getComponentsRef)}
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
