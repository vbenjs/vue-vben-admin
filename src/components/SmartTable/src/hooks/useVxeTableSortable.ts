import { onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

import Sortable from 'sortablejs';

/**
 * vxe支持行拖动
 * @param tableRef
 * @param handle css
 * @param tableData 表格数据
 */
export const useVxeTableSortable = (tableRef: Ref, handle: string, tableData: Ref) => {
  let sortable: any = null;
  const handleRowDrop = () => {
    if (sortable !== null) {
      sortable.destroy();
    }
    sortable = Sortable.create(
      tableRef.value.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
      {
        handle: handle,
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: ({ newIndex, oldIndex }: any) => {
          const currentRow = tableData.value.splice(oldIndex, 1)[0];
          tableData.value.splice(newIndex, 0, currentRow);
        },
      },
    );
  };
  onUnmounted(() => {
    if (sortable !== null) {
      sortable.destroy();
    }
  });
  onMounted(handleRowDrop);
  return {
    handleRowDrop,
  };
};
