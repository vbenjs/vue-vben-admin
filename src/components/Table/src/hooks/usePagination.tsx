import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps } from '../types/table';

import { computed, unref, ref, ComputedRef } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

import { isBoolean } from '/@/utils/is';

import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';
import { useProps } from './useProps';
export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({});
  const { propsRef } = useProps(refProps);

  const getPaginationRef = computed((): PaginationProps | false => {
    const { pagination } = unref(propsRef);
    if (isBoolean(pagination) && !pagination) {
      return false;
    }
    return {
      current: 1,
      pageSize: PAGE_SIZE,
      size: 'small',
      defaultPageSize: PAGE_SIZE,
      showTotal: (total) => `共 ${total} 条数据`,
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      itemRender: ({ page, type, originalElement }) => {
        if (type === 'prev') {
          if (page === 0) {
            return null;
          }
          return <LeftOutlined />;
        } else if (type === 'next') {
          if (page === 1) {
            return null;
          }
          return <RightOutlined />;
        }
        return originalElement;
      },
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    };
  });

  function setPagination(info: Partial<PaginationProps>) {
    configRef.value = {
      ...unref(getPaginationRef),
      ...info,
    };
  }
  return { getPaginationRef, setPagination };
}
