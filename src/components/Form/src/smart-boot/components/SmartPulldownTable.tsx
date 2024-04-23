import { computed, defineComponent, nextTick, onMounted, ref, toRefs, unref, watch } from 'vue';
import { SmartTableProps, SmartTable } from '@/components/SmartTable';
import { propTypes } from '@/utils/propTypes';
import { type VxePulldownInstance, VxeGridInstance } from 'vxe-table';
import { Icon } from '@/components/Icon';

import './style/SmartPullownTable.less';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

/**
 * 下拉表格
 */
export default defineComponent({
  name: 'SmartPullownTable',
  props: {
    tableProps: {
      type: Object as PropType<SmartTableProps>,
    },
    showField: propTypes.string,
    showFunction: propTypes.func,
    dropdownWidth: propTypes.number.def(600),
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    valueField: propTypes.string.isRequired,
    // 是否每次都加载
    alwaysLoad: propTypes.bool.def(false),
    // 是否立即加载
    immediate: propTypes.bool.def(true),
    api: {
      type: Function as PropType<() => Promise<any>>,
    },
  },
  emits: ['select', 'change', 'update:value'],
  setup(props, { emit, slots, attrs }) {
    const { showField, dropdownWidth, value: valueRef } = toRefs(props);
    const pulldownRef = ref<VxePulldownInstance>();
    const dataLoadingRef = ref<boolean>(false);
    const tableDataRef = ref<Recordable[]>([]);
    const tableRef = ref();
    // 选中的行
    const selectRowRef = ref<Recordable | null>(null);
    const computedSelectRowValue = computed(() => {
      const showFieldValue = unref(showField);
      if (!props.showFunction && !showFieldValue) {
        throw new Error('未设置showField或showFunction');
      }
      const selectRow = unref(selectRowRef);
      if (!selectRow) {
        return null;
      }
      if (props.showFunction) {
        return props.showFunction(selectRow);
      }
      return selectRow[showFieldValue];
    });

    /**
     * 加载表格数据函数
     */
    const loadTableData = async () => {
      if (props.api) {
        try {
          dataLoadingRef.value = true;
          tableDataRef.value = await props.api();
        } finally {
          dataLoadingRef.value = false;
        }
      }
    };
    onMounted(async () => {
      if (props.immediate) {
        await loadTableData();
      }
    });

    const emitData = ref<Recordable[]>([]);
    const [state] = useRuleFormItem(props, 'value', 'change', emitData);
    watch(
      () => state.value,
      (v) => {
        emit('update:value', v);
      },
    );

    /**
     * 下拉容器样式
     */
    const computedDropdownContainerStyle = computed(() => {
      return {
        width: unref(dropdownWidth) + 'px',
      };
    });

    watch([valueRef, tableDataRef], ([value, tableData]) => {
      const tableInstance: VxeGridInstance = unref(tableRef)?.tableAction.getTableInstance();
      let row: Recordable | null = null;
      if (!value) {
        tableInstance && tableInstance.clearCurrentRow();
        selectRowRef.value = null;
        return;
      }
      const selectRows = tableData.filter(
        (item) => item[props.valueField].toString() === value.toString(),
      );
      if (selectRows.length === 0) {
        tableInstance && tableInstance.clearCurrentRow();
      } else {
        row = selectRows[0];
        tableInstance && tableInstance.setCurrentRow(selectRows[0]);
      }
      selectRowRef.value = row;
    });

    /**
     * 显示弹窗
     */
    const handleShow = async () => {
      unref(pulldownRef)?.showPanel();
      if (props.alwaysLoad) {
        await loadTableData();
      }
      nextTick(() => {
        const tableInstance: VxeGridInstance = unref(tableRef)?.tableAction.getTableInstance();
        const row = unref(selectRowRef);
        row && tableInstance && tableInstance.setCurrentRow(row);
      });
    };

    const dropdownTableProps = {
      size: 'mini',
      ...props.tableProps,
      rowConfig: {
        ...(props.tableProps?.rowConfig || {}),
        isCurrent: true,
      },
      onCellClick: ({ row }) => {
        changeValue(row);
        unref(pulldownRef)?.hidePanel();
      },
    };

    const changeValue = (row?: Recordable) => {
      emit('select', row);
      state.value = row?.[props.valueField];
    };

    const inputIconSlots = {
      addonAfter: () => <Icon onClick={handleShow} icon="ant-design:table-outlined" />,
      clearIcon: () => <Icon onClick={() => changeValue()} icon="ant-design:close-circle-filled" />,
    };

    const pulldownSlots = {
      default: () => (
        <a-input onFocus={handleShow} value={unref(computedSelectRowValue)} {...attrs}>
          {inputIconSlots}
        </a-input>
      ),
      dropdown: () => (
        <div style={unref(computedDropdownContainerStyle)}>
          <SmartTable data={unref(tableDataRef)} ref={tableRef} {...dropdownTableProps} />
        </div>
      ),
      ...slots,
    };
    return () => (
      <vxe-pulldown
        ref={pulldownRef}
        {...attrs}
        popup-class-name="smart-pullown-table"
        class-name="smart-pullown-input"
      >
        {pulldownSlots}
      </vxe-pulldown>
    );
  },
});
