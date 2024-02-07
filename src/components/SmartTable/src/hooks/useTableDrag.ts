import type { ComputedRef, Ref } from 'vue';
import type {
  SmartColumn,
  SmartTableProps,
  SmartTableRowDragConfig,
} from '@/components/SmartTable';
import type { VxeGridInstance } from 'vxe-table';

import { h, onMounted, nextTick, computed, onUnmounted, unref, watch } from 'vue';

import Sortable from 'sortablejs';

import { isBoolean } from '@/utils/is';
import { Icon } from '@/components/Icon';

export const TABLE_DRAG_SLOT_NAME = 'smart-table-drop-slot';

interface TableAction {
  getData: (rowIndex?: number) => any[];
  loadData: (data: any[]) => Promise<any>;
}

const defaultRowDragConfig: SmartTableRowDragConfig = {
  handle: 'smart-table-drop-handle',
  animation: 150,
  icon: 'ant-design:menu-outlined',
  ghostClass: 'blue-background-class',
  dataIdAttr: 'rowid',
};

/**
 * 支持行拖动功能
 */
export const useTableRowDrag = (
  tablePropsRef: ComputedRef<SmartTableProps>,
  tableRef: Ref<VxeGridInstance>,
  { getData }: TableAction,
) => {
  let sortable: Sortable | null = null;

  const getKeyField = computed(() => unref(tablePropsRef).rowConfig?.keyField);
  // 是否有左侧锁定列
  const getHasFixedLeft = computed(() => {
    const tableColumns = unref(tablePropsRef).columns;
    if (!tableColumns) {
      return false;
    }
    return tableColumns.some((item) => item.fixed === 'left');
  });

  /**
   * 获取拖拽配置
   */
  const getRowDragConfig = computed<SmartTableRowDragConfig | false>(() => {
    const { dragConfig } = unref(tablePropsRef).rowConfig || {};
    if (!dragConfig) {
      return false;
    }
    let config: SmartTableRowDragConfig;
    if (isBoolean(dragConfig)) {
      config = defaultRowDragConfig;
    } else {
      config = {
        ...defaultRowDragConfig,
        ...dragConfig,
      };
    }
    return {
      ...config,
      handle: `.${config.handle}`,
      onEnd: async ({ newIndex, oldIndex }) => {
        if (newIndex !== oldIndex) {
          const tableData = getData();
          // 记录原顺序
          const keySorts = tableData.map((item) => {
            return item[unref(getKeyField)!] + '';
          });
          const currentRow = tableData.splice(oldIndex!, 1)[0];
          tableData.splice(newIndex!, 0, currentRow);
          // 还原顺序
          sortable?.sort(keySorts);
          // 更新数据排序
          unref(tableRef).reactData.tableData = tableData;
        }
      },
    };
  });
  /**
   * 获取拖拽插槽
   */
  const getTableDragSlot = computed(() => {
    const dragConfig = unref(getRowDragConfig);
    if (!dragConfig) {
      return {};
    }
    if (dragConfig.custom) {
      // 自定义列，返回null
      return {};
    }
    const slots: Recordable = {};
    slots[TABLE_DRAG_SLOT_NAME] = ({ rowIndex }) => {
      return h(
        'div',
        { 'data-id': rowIndex, class: [dragConfig.handle?.slice(1)] },
        h(Icon, { icon: dragConfig.icon, 'data-id': rowIndex }),
      );
    };
    return slots;
  });
  /**
   * 获取拖拽列信息
   */
  const getTableDragColumn = computed<SmartColumn[]>(() => {
    const dragConfig = unref(getRowDragConfig);
    if (!dragConfig) {
      return [];
    }
    if (dragConfig.custom) {
      // 自定义列，返回null
      return [];
    }
    const column: SmartColumn = {
      title: '#',
      field: 'drag',
      width: 60,
      // fixed: 'left',
      slots: {
        default: TABLE_DRAG_SLOT_NAME,
      },
    };
    if (unref(getHasFixedLeft)) {
      column.fixed = 'left';
    }
    return [column];
  });

  /**
   * 开启拖拽功能
   */
  const openRowDrop = async () => {
    if (!unref(getKeyField)) {
      throw new Error('row-config.key-field无法开启行拖拽，请设置key-field');
    }
    if (sortable !== null) {
      sortable.destroy();
    }
    const el = unref(tableRef).$el;
    let sortEl;
    if (!unref(getHasFixedLeft)) {
      sortEl = el.querySelector('.body--wrapper>.vxe-table--body tbody');
    } else {
      const selector = '.fixed-left--wrapper>.vxe-table--body tbody';
      sortEl = el.querySelector(selector);
      if (sortEl == null) {
        while (sortEl === null) {
          await nextTick(() => (sortEl = el.querySelector(selector)));
        }
      }
    }
    sortable = Sortable.create(sortEl, unref(getRowDragConfig) as SmartTableRowDragConfig);
  };
  /**
   * 关闭行拖拽
   */
  const closeRowDrop = () => {
    if (sortable !== null) {
      sortable.destroy();
      sortable = null;
    }
  };

  onMounted(() => {
    if (unref(getRowDragConfig)) {
      openRowDrop();
    }
  });
  onUnmounted(() => closeRowDrop());

  watch(getRowDragConfig, (value) => {
    if (value) {
      if (sortable === null && unref(tableRef)) {
        openRowDrop();
      }
    } else {
      closeRowDrop();
    }
  });

  return {
    openRowDrop,
    closeRowDrop,
    getTableDragColumn,
    getTableDragSlot,
  };
};
