import { computed, defineComponent, nextTick, onMounted, ref, toRefs, unref, watch } from 'vue';
import { SmartTableProps, SmartTable } from '@/components/SmartTable';
import { propTypes } from '@/utils/propTypes';
import { type VxePulldownInstance, VxeGridInstance } from 'vxe-table';
import { Icon } from '@/components/Icon';

import './style/SmartPullownTable.less';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { Row, Col } from 'ant-design-vue';

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
    showSearch: propTypes.bool.def(true),
    allowClear: propTypes.bool.def(true),
    filterOption: {
      type: Function as PropType<(searchValue: string, row: Recordable) => boolean>,
    },
    searchIgnoreCase: propTypes.bool.def(true),
    // 弹窗高度
    height: propTypes.number,
  },
  emits: ['select', 'change', 'update:value', 'visible-change'],
  setup(props, { emit, slots, attrs }) {
    const {
      showField,
      dropdownWidth,
      value: valueRef,
      showSearch: showSearchRef,
      allowClear: allowClearRef,
      height: heightRef,
    } = toRefs(props);
    const pulldownRef = ref<VxePulldownInstance>();
    const dataLoadingRef = ref<boolean>(false);
    const tableDataRef = ref<Recordable[]>([]);
    const tableRef = ref();
    const searchValueRef = ref<string>('');

    const filterOptionFunction = props.filterOption
      ? props.filterOption
      : (searchValue: string, row: Recordable) => {
          if (!searchValue || searchValue.trim().length === 0) {
            return true;
          }
          const searchValueTrim = searchValue.trim();
          let showValue = '';
          if (props.showFunction) {
            showValue = props.showFunction(row);
          } else {
            showValue = row[props.showField];
          }
          if (
            (props.searchIgnoreCase ? showValue.toUpperCase() : showValue).includes(searchValueTrim)
          ) {
            return true;
          }
          const fieldValue: string = row[props.valueField].toString();
          return (props.searchIgnoreCase ? fieldValue.toUpperCase() : fieldValue).includes(
            searchValueTrim,
          );
        };
    const computeTableData = computed(() => {
      const tableData = unref(tableDataRef);
      if (tableData.length === 0) {
        return tableData;
      }
      const searchValue = unref(searchValueRef);
      if (!searchValue) {
        return tableData;
      }
      return tableData.filter((item) =>
        filterOptionFunction(
          props.searchIgnoreCase ? searchValue.toUpperCase() : searchValue,
          item,
        ),
      );
    });
    /**
     * 下拉框是否显示
     */
    const isVisibleRef = ref(false);
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
      const style: Recordable = {
        width: unref(dropdownWidth) + 'px',
      };
      const height = unref(heightRef);
      if (height) {
        style.height = `${height}px`;
      }
      return style;
    });

    watch([valueRef, tableDataRef], ([value, tableData]) => {
      let row: Recordable | null = null;
      if (value) {
        const selectRows = tableData.filter(
          (item) => item[props.valueField].toString() === value.toString(),
        );
        if (selectRows.length > 0) {
          row = selectRows[0];
        }
      }
      selectRowRef.value = row;
      setCurrentRow();
    });

    /**
     * 显示弹窗
     */
    const handleShow = async () => {
      isVisibleRef.value = true;
      unref(pulldownRef)?.showPanel();
      if (props.alwaysLoad) {
        await loadTableData();
      }
      emit('visible-change', true);
      setCurrentRow();
    };

    /**
     * 设置当前行
     */
    const setCurrentRow = () => {
      nextTick(() => {
        const tableInstance: VxeGridInstance = unref(tableRef)?.tableAction.getTableInstance();
        if (!tableInstance) {
          return;
        }
        const row = unref(selectRowRef);
        if (!row) {
          tableInstance.clearCurrentRow();
        } else {
          tableInstance.setCurrentRow(row);
        }
      });
    };

    const handleHide = () => {
      isVisibleRef.value = false;
      searchValueRef.value = '';
      emit('visible-change', false);
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
        handleHide();
      },
    };

    const changeValue = (row?: Recordable) => {
      emit('select', row);
      state.value = row?.[props.valueField];
    };

    /**
     * 搜索框变化触发
     * @param value
     */
    const handleSearchChange = (value: string) => {
      searchValueRef.value = value;
      setCurrentRow();
    };

    // const inputIconSlots = {
    //   addonAfter: () => <Icon onClick={handleShow} icon="ant-design:table-outlined" />,
    //   clearIcon: () => <Icon onClick={() => changeValue()} icon="ant-design:close-circle-filled" />,
    // };
    //
    // const selectSlots = {
    //   suffixIcon: () => <Icon onClick={handleShow} icon="ant-design:table-outlined" />,
    // };

    const handleUpdateValue = () => {
      changeValue();
      handleShow();
    };

    const pulldownSlots = {
      default: () => (
        // <div>
        //   <a-input onFocus={handleShow} value={unref(computedSelectRowValue)} {...attrs}>
        //     {inputIconSlots}
        //   </a-input>
        //   <span>abc</span>
        // </div>
        <Row type="flex" class={unref(isVisibleRef) ? 'smart-pulldown-open' : ''}>
          <Col class="select">
            <a-select
              allowClear={unref(allowClearRef)}
              showSearch={unref(showSearchRef)}
              onFocus={handleShow}
              open={false}
              onUpdate:value={handleUpdateValue}
              searchValue={unref(searchValueRef)}
              onSearch={handleSearchChange}
              value={unref(computedSelectRowValue)}
            ></a-select>
          </Col>
          <Col class="suffix-icon">
            <Icon onClick={handleShow} icon="ant-design:table-outlined" />
          </Col>
        </Row>
      ),
      dropdown: () => (
        <div style={unref(computedDropdownContainerStyle)}>
          <SmartTable data={unref(computeTableData)} ref={tableRef} {...dropdownTableProps} />
        </div>
      ),
      ...slots,
    };
    return () => (
      <vxe-pulldown
        ref={pulldownRef}
        onHidePanel={handleHide}
        {...attrs}
        popup-class-name="smart-pullown-table"
        class-name="smart-pullown-input"
      >
        {pulldownSlots}
      </vxe-pulldown>
    );
  },
});
