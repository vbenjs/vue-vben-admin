import { computed, ComputedRef, unref, ref } from 'compatible-vue';
import { Icon } from '@/components/icon/index';
import { BasicTableProps } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { isBoolean } from '@/utils/is/index';
import { useProps } from './useProps';

import { PAGE_SIZE } from '../const';
export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const { propsRef } = useProps(refProps);

  const configRef = ref<PaginationProps>({});

  // function handleChange(page: number) {
  //   console.log('======================');
  //   console.log(page);
  //   console.log('======================');
  // }
  // function handleSizeChange(page: number) {
  //   console.log('======================');
  //   console.log(page);
  //   console.log('======================');
  // }
  function itemRender(current: number, type: string, originalElement: Element) {
    if (type === 'prev') {
      if (current === 0) {
        return null;
      }
      return <Icon type="left" />;
    } else if (type === 'next') {
      if (current === 1) {
        return null;
      }
      return <Icon type="right" />;
    }
    return originalElement;
  }
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
      pageSizeOptions: ['10', '50', '80', '100'],
      itemRender: itemRender as any,
      showQuickJumper: true,
      ...pagination,
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
