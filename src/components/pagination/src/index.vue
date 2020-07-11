<script lang="tsx">
  // comp
  import { Pagination } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';

  import { defineComponent, ref, watch, unref } from '@/setup/vue';

  //
  import { useDesign } from '@/hooks/core/useDesign';

  import { PaginationEnum } from '@/enums/paginationEnum';

  import { paginationProps } from './props';
  import { PaginationProps } from './types';
  export default defineComponent({
    name: 'Pagination',
    props: paginationProps,
    setup(props: Readonly<PaginationProps>, { emit }) {
      const pageRef = ref(1);
      const pageSizeRef = ref(PaginationEnum.DEFAULT_PAGE_SIZE);
      const { prefixCls } = useDesign('pagination');

      function emitChange(
        page: number
        // @ts-ignore
        // pageSize: number
      ) {
        // console.log('======================');
        // console.log(pageSize);
        // console.log('======================');
        // emit('paginationChange', { page, pageSize });
        pageRef.value = page;
        emit('update:current', page);
      }

      function handleChange(page: number) {
        emitChange(page);
      }
      function handleSizeChange(page: number) {
        emitChange(page);
      }

      function itemRender(current: number, type: string, originalElement: Element) {
        if (type === 'prev') {
          if (current === 0) {
            return null;
          }
          return <Icon class={`${prefixCls}__action`} type="left" />;
        } else if (type === 'next') {
          const { total, pageSize } = props as { total: number; pageSize: number };
          const page = Math.ceil(total / pageSize);
          if (current === 1 && page === 1) {
            return null;
          }
          return <Icon class={`${prefixCls}__action`} type="right" />;
        }
        return originalElement;
      }

      watch(
        [() => props.current, () => props.pageSize],
        ([current, pageSize]) => {
          pageRef.value = current as number;
          pageSizeRef.value = pageSize as number;
          emit('paginationChange', { page: current, pageSize });
        },
        { immediate: false }
      );
      return () => (
        <div class={`${prefixCls}__wrap`}>
          <Pagination
            class={prefixCls}
            onChange={handleChange}
            onShowSizeChange={handleSizeChange}
            itemRender={itemRender}
            {...{
              props: {
                ...props,
                current: unref(pageRef),
                pageSize: unref(pageSizeRef),
              },
              on: {
                'update:pageSize': (page: number) => {
                  pageSizeRef.value = page;
                  emit('update:pageSize', page);
                },
              },
            }}
          />
        </div>
      );
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-pagination';

  .@{prefix-cls} {
    display: flex;

    &__wrap {
      position: relative;
      padding: 6px 6px 0 0;
      border-top: none;
    }
    // &__action {
    //   &:hover {
    //     color: @primary-color;
    //   }
    // }

    .ant-pagination-prev:empty,
    .ant-pagination-next:empty {
      min-width: 10px;
      border: none;
    }

    .ant-pagination-total-text {
      flex: 1;
      color: #606266;
    }
  }
</style>
