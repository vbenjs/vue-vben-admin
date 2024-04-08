import { computed, defineComponent, ref, toRefs, unref, watch } from 'vue';
import { SmartTableProps, SmartTable } from '@/components/SmartTable';
import { propTypes } from '@/utils/propTypes';
import { type VxePulldownInstance, VxeGridInstance } from 'vxe-table';
import { Icon } from '@/components/Icon';

import './style/SmartPullownTable.less';

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
  },
  emits: ['select', 'change'],
  setup(props, { emit, slots, attrs }) {
    const { showField, dropdownWidth, value: valueRef } = toRefs(props);
    const pulldownRef = ref<VxePulldownInstance>();
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
     * 下拉容器样式
     */
    const computedDropdownContainerStyle = computed(() => {
      return {
        width: unref(dropdownWidth) + 'px',
      };
    });

    watch(valueRef, (value) => {
      const tableInstance: VxeGridInstance = unref(tableRef)?.tableAction.getTableInstance();
      let row = null;
      if (!tableInstance) {
        return false;
      }
      if (!value) {
        tableInstance.clearCurrentRow();
      }
      const fullData = tableInstance.getTableData().fullData;
      const selectRows = fullData.filter((item) => item[props.valueField] === value);
      if (selectRows.length === 0) {
        tableInstance.clearCurrentRow();
      } else {
        row = selectRows[0];
        tableInstance.setCurrentRow(selectRows[0]);
      }
      selectRowRef.value = row;
    });

    /**
     * 显示弹窗
     */
    const handleShow = () => {
      unref(pulldownRef)?.showPanel();
      if (props.alwaysLoad) {
        unref(tableRef)?.tableAction.query();
      }
    };

    const dropdownTableProps = {
      size: 'mini',
      ...props.tableProps,
      rowConfig: {
        ...(props.tableProps?.rowConfig || {}),
        isCurrent: true,
      },
      onCellClick: ({ row }) => {
        emit('select', row);
        emit('change', row[props.valueField]);
        unref(pulldownRef)?.hidePanel();
      },
    };

    const inputIconSlots = {
      addonAfter: () => <Icon onClick={handleShow} icon="ant-design:table-outlined" />,
    };

    const pulldownSlots = {
      default: () => (
        <a-input onFocus={handleShow} value={unref(computedSelectRowValue)} {...attrs}>
          {inputIconSlots}
        </a-input>
      ),
      dropdown: () => (
        <div style={unref(computedDropdownContainerStyle)}>
          <SmartTable ref={tableRef} {...dropdownTableProps} />
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
