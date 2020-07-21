<script lang="tsx">
  import { defineComponent, unref, ref } from 'compatible-vue';

  import { Table } from 'ant-design-vue';

  import { usePagination } from './hooks/usePagination';
  import { useLoading } from './hooks/useLoading';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useDesign } from '@/hooks/core/useDesign';

  import { basicProps } from './props';
  import { BasicTableProps } from './types/table';
  export default defineComponent({
    name: 'BasicTable',
    props: basicProps,
    setup(props: BasicTableProps, { attrs }) {
      const tableElRef = ref<any>(null);

      const { getPaginationConfig } = usePagination(props);
      const { loadingRef } = useLoading(props);
      const { getScrollRef } = useTableScroll(props, tableElRef);
      const { prefixCls } = useDesign('basic-table');
      return () => {
        return (
          <div class={prefixCls}>
            <Table
              ref={tableElRef}
              size="middle"
              {...{
                props: {
                  ...attrs,
                  ...props,
                  loading: unref(loadingRef),
                  scroll: unref(getScrollRef),
                  pagination: unref(getPaginationConfig),
                  tableLayout: 'fixed',
                },
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

  .@{prefix-cls} {
    padding: 12px;

    .ant-table td {
      white-space: nowrap;
    }

    .ant-pagination {
      margin: 0;
    }

    .ant-table-body {
      overflow: scroll;

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
  }
</style>
