import type { ComputedRef } from 'vue';
import type { SmartTableProps } from '@/components/SmartTable';
import type { VxeGridDefines, VxeGridInstance } from 'vxe-table';
import { computed, unref } from 'vue';

import { defaultCheckboxConfig } from '../defaultConfig';

export const useSmartTableCheckbox = (
  tableProps: ComputedRef<SmartTableProps>,
  emit: Function,
  getTableInstance: () => VxeGridInstance,
) => {
  let lastRowIndex: number | null = null;
  const computeCheckboxTableProps = computed<SmartTableProps>(() => {
    const checkboxConfig = {
      ...defaultCheckboxConfig,
      ...unref(tableProps).checkboxConfig,
    };
    const { rowTrigger, rowShift, rowCtrl } = checkboxConfig;
    if (!rowTrigger) {
      return {
        onCellClick: (params: VxeGridDefines.CellClickEventParams) => emit('cell-click', params),
      };
    }
    if (rowTrigger === 'multiple') {
      return {
        onCellClick: (params: VxeGridDefines.CellClickEventParams) => emit('cell-click', params),
        checkboxConfig: {
          ...checkboxConfig,
          trigger: 'row',
        },
      };
    }
    return {
      onCellClick: (params: VxeGridDefines.CellClickEventParams) =>
        handleCellClick(params, rowShift, rowCtrl),
      checkboxConfig: {
        ...checkboxConfig,
      },
    };
  });

  /**
   * 单元格被点击事件
   */
  const handleCellClick = async (
    params: VxeGridDefines.CellClickEventParams,
    rowShift: boolean | undefined,
    rowCtrl: boolean | undefined,
  ) => {
    emit('cell-click', params);

    const gridInstance = getTableInstance();
    const { row, $event, rowIndex } = params;
    const { ctrlKey, shiftKey } = $event as PointerEvent;
    if (rowCtrl && ctrlKey) {
      // 点击了ctrl
      gridInstance.toggleCheckboxRow(row);
    } else {
      gridInstance.clearCheckboxRow();
      gridInstance.setCheckboxRow(row, true);
    }
    if (rowShift && shiftKey) {
      if (lastRowIndex == null) {
        lastRowIndex = rowIndex;
      } else {
        // 第二次shift点击
        const tableData = gridInstance.getData();
        const indexList = [lastRowIndex, rowIndex];
        indexList.sort((a, b) => a - b);
        const checkboxList: any[] = [];
        for (let i = 0; i < tableData.length; i++) {
          if (i >= indexList[0] && i <= indexList[1]) {
            checkboxList.push(tableData[i]);
          }
        }
        gridInstance.clearCheckboxRow();
        gridInstance.setCheckboxRow(checkboxList, true);
      }
    } else {
      lastRowIndex = null;
    }
  };

  return {
    computeCheckboxTableProps,
  };
};
