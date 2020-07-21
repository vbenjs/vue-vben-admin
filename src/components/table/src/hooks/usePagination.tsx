import { computed } from 'compatible-vue';
import { Icon } from '@/components/icon/index';
import { BasicTableProps } from '../types/table';

export function usePagination(props: BasicTableProps) {
  const { pagination } = props;
  function handleChange(page: number) {
    console.log('======================');
    console.log(page);
    console.log('======================');
  }
  function handleSizeChange(page: number) {
    console.log('======================');
    console.log(page);
    console.log('======================');
  }
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
  const getPaginationConfig = computed(() => {
    return {
      size: 'small',
      defaultPageSize: 20,
      showTotal: (total) => `共 ${total} 条数据`,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      itemRender: itemRender,
      showQuickJumper: true,
      onChange: handleChange,
      onShowSizeChange: handleSizeChange,
      ...pagination,
    };
  });
  return { getPaginationConfig };
}
