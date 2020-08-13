<script lang="tsx">
  import { defineComponent, unref, ref, computed, watch, nextTick } from 'compatible-vue';
  import { Table } from 'ant-design-vue';
  import TableTitle from './components/TableTitle.vue';
  import BodyWarpper from './components/BodyWarpper.vue';
  import CellResize from './components/CellResize.vue';
  import { BaseArrow } from '@/components/base';

  import { usePagination } from './hooks/usePagination';
  import { useLoading } from './hooks/useLoading';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useDataSource } from './hooks/useDataSource';
  import { useColumns } from './hooks/useColumns';
  import { useDesign } from '@/hooks/core/useDesign';
  import { provideTable } from './hooks/useProvinceTable';
  import { useEvent } from '@/hooks/event/useEvent';

  import { basicProps } from './props';
  import {
    BasicTableProps,
    TableInstance,
    FetchParams,
    getColumnsParams,
    BasicColumn,
  } from './types/table';
  import { PaginationProps } from './types/pagination';
  import { getSlot, extendSlots, getSlotFunc } from '@/utils/helper/tsxHelper';
  import { isFunction, isString } from '@/utils/is/index';
  import { omit, cloneDeep } from '@/utils/lodashChunk';

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

      const renderExpandIcon = !slots.expandedRowRender
        ? undefined
        : (props: any) => {
            return (
              <BaseArrow
                onClick={(e: Event) => {
                  props.onExpand(props.record, e);
                }}
                expand={props.expanded}
                class="right"
              />
            );
          };

      const renderFooter = () => {
        const { summaryFunc } = props;
        if (!summaryFunc) {
          return;
        }
        const dataSource: any[] = isFunction(summaryFunc)
          ? summaryFunc(unref(getDataSourceRef))
          : [];
        const columns: BasicColumn[] = cloneDeep(unref(getColumnsRef));
        const index = columns.findIndex((item) => item.flag === 'INDEX');
        if (index !== -1) {
          Reflect.deleteProperty(columns[index], 'customRender');
        }
        if (unref(getRowSelectionRef)) {
          columns.unshift({
            width: 60,
            title: 'total',
            key: 'total',
            customRender: () => '合计',
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
          ></Table>
        );
      };
      watch(
        () => unref(getDataSourceRef),
        () => {
          if (props.showSummary) {
            nextTick(() => {
              const tableEl = unref(tableElRef);
              if (!tableEl) {
                return;
              }
              const bodyDomList = tableEl.$el.querySelectorAll(
                '.ant-table-body'
              ) as HTMLDivElement[];
              const bodyDom = bodyDomList[0];
              useEvent({
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
        },
        { immediate: true }
      );

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
          !slots.tableTitle && !isString(title) && !title && !slots.toolbar
            ? {}
            : { title: !slots.tableTitle && !title ? null : renderTitle };
        let propsData: BasicTableProps = {
          // @ts-ignore
          size: 'middle',
          // @ts-ignore
          // expandRowByClick: true,
          // @ts-ignore
          expandIcon: renderExpandIcon,
          ...attrs,
          ...unref(getMergeProps),
          ...titleData,
          columns: unref(getColumnsRef),
          dataSource: unref(getDataSourceRef),
          rowKey: rowKey,
          scroll: unref(getScrollRef),
          rowSelection: unref(getRowSelectionRef),
          loading: unref(loadingRef),
          pagination: unref(getPaginationRef) as PaginationProps,
          tableLayout: 'fixed',
        };
        if (slots.expandedRowRender) {
          propsData = omit(propsData, 'scroll');
        }
        if (props.showSummary) {
          propsData.footer = renderFooter;
        }

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
              >
                {extendSlots(slots)}
              </BasicForm>
            )}
            <Table
              components={unref(getComponentsRef)}
              ref={tableElRef}
              on={{ ...listeners, change: handleTableChange }}
              {...{
                props: propsData,
              }}
              scopedSlots={getSlotFunc(slots)}
            >
              {extendSlots(slots, ['expandedRowRender'])}
            </Table>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-basic-table';
  @border-color: hsla(0, 0%, 80.8%, 0.3);
  .@{prefix-cls} {
    padding: 12px;

    // .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    //   overflow-y: hidden !important;
    // }

    .ant-table-thead > tr > th {
      background: #f1f3f4;
    }

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

    .ant-table-body,
    .ant-table-body-inner {
      overflow-x: auto !important;
      overflow-y: scroll !important;
    }

    .ant-table-header {
      margin-bottom: 0 !important;
      overflow-x: hidden !important;
      overflow-y: scroll !important;
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

    .ant-table-bordered .ant-table-thead > tr:not(:last-child) > th,
    .ant-table-tbody > tr > td {
      word-break: break-word;
      // white-space: break-spaces;
      // border-bottom: none;
      border-color: @border-color;
    }

    .ant-table-footer {
      padding: 0;

      table {
        border: none !important;
      }

      .ant-table-body {
        overflow: hidden !important;
      }

      td {
        padding: 12px 8px;
      }
    }
  }
</style>
