import type {
  VxeGridProps,
  VxeGridPropTypes,
  VxeColumnPropTypes,
  VxeGridInstance,
  VxeButtonProps,
  VxePulldownInstance,
  VxeTableDefines,
} from 'vxe-table';

import { t as vxeI18n } from 'vxe-table';

import { computed, defineComponent, inject, nextTick, Ref, ref, unref } from 'vue';
import type { SmartTableToolbarColumnConfig } from '@/components/SmartTable';

import Sortable from 'sortablejs';

const DRAG_CLASS = 'smart-table-column-config--drag';

/**
 * 表格列设置组件
 */
export default defineComponent({
  name: 'SmartTableColumnConfig',
  props: {
    config: {
      type: Object as PropType<SmartTableToolbarColumnConfig>,
      default: (): SmartTableToolbarColumnConfig => {
        return {
          trigger: 'click',
          buttonProps: {
            icon: 'vxe-icon-chart-radar',
          },
          columnOrder: false,
        };
      },
    },
    setColumnSortConfig: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const getTableInstance = inject('getTableInstance') as () => VxeGridInstance;
    const pullDownRef = ref<VxePulldownInstance>();
    const configGridRef = ref<VxeGridInstance>();

    /**
     * 添加行顺序调整
     */
    const { openDrag } = useDrag(configGridRef, getTableInstance, props.setColumnSortConfig);
    /**
     * 显示弹窗面板
     */
    const showPanel = () => {
      unref(pullDownRef)?.showPanel();
      nextTick(() => {
        if (props.config.columnOrder) {
          openDrag();
        }
      });
    };

    const computedTableColumns = computed(() => {
      return getTableInstance()?.getTableColumn().fullColumn;
    });

    /**
     * FIX变更触发
     * @param event
     * @param fixed
     * @param row
     */
    const handleFixedChange = (event: MouseEvent, fixed: VxeColumnPropTypes.Fixed, row: any) => {
      event.preventDefault();
      if (fixed === row.fixed) {
        //@ts-ignore
        getTableInstance().extendTableMethods(['clearColumnFixed']).clearColumnFixed(row.field);
      } else {
        //@ts-ignore
        getTableInstance().extendTableMethods(['setColumnFixed']).setColumnFixed(row.field, fixed);
      }
    };

    const { handleShowHideOk, handleRestShowHide, handleCheckboxChange } =
      useColumnShowHide(getTableInstance);

    /**
     * 表格props
     */
    const computedGridProps = computed<VxeGridProps>(() => {
      return {
        columns: getGridColumns(props.config.columnOrder || false, handleFixedChange),
        size: 'mini',
        height: '396px',
        headerAlign: 'center',
        checkboxConfig: {
          // trigger: 'row',
          checkField: 'checked',
        },
        rowConfig: {
          keyField: 'field',
        },
        onCheckboxChange: handleCheckboxChange,
        data: unref(computedTableColumns)?.map((item) => {
          const { visible, fixed, field } = item;
          return {
            title: item.getTitle(),
            checked: visible,
            fixed,
            field,
            id: item.id,
            column: item,
          };
        }),
      };
    });

    /**
     * 按钮时间，触发下拉显示
     */
    const buttonEvent = {
      onClick: () => {
        const trigger = props.config.trigger;
        if (trigger === 'click') {
          showPanel();
        }
      },
      onMouseover: () => {
        const trigger = props.config.trigger;
        if (trigger === 'hover') {
          showPanel();
        }
      },
    };
    return {
      buttonEvent,
      pullDownRef,
      computedTableColumns,
      computedGridProps,
      configGridRef,
      handleShowHideOk,
      handleRestShowHide,
    };
  },
  render() {
    const { config, buttonEvent, computedGridProps, handleShowHideOk, handleRestShowHide } = this;
    const slots = {
      default: renderButton(config, buttonEvent),
      dropdown: renderDropdown(computedGridProps, handleShowHideOk, handleRestShowHide),
    };
    return (
      <vxe-pulldown popupClassName="smart-table-column-config" transfer={true} ref="pullDownRef">
        {slots}
      </vxe-pulldown>
    );
  },
});

/**
 * 渲染按钮
 * @param config
 * @param event
 */
const renderButton = (config: SmartTableToolbarColumnConfig, event: any) => {
  const props: VxeButtonProps = {
    circle: true,
    icon: 'vxe-icon-chart-radar',
    ...event,
    ...config.buttonProps,
  };
  return () => {
    return <vxe-button title={vxeI18n('vxe.toolbar.custom')} {...props}></vxe-button>;
  };
};

/**
 * 渲染下拉表格
 * @param props
 * @param handleShowHideOk
 * @param handleRestShowHide
 */
const renderDropdown = (props: VxeGridProps, handleShowHideOk, handleRestShowHide) => {
  return () => {
    return (
      <div>
        <vxe-grid ref="configGridRef" {...props} />
        <div class="bottom-button">
          <vxe-button type="text" onClick={handleRestShowHide}>
            {vxeI18n('vxe.toolbar.customRestore')}
          </vxe-button>
          <vxe-button type="text" onClick={handleShowHideOk}>
            {vxeI18n('vxe.toolbar.customConfirm')}
          </vxe-button>
        </div>
      </div>
    );
  };
};

const getGridColumns = (columnOrder: boolean, changeFixed: Function): VxeGridPropTypes.Columns => {
  const columns: VxeGridPropTypes.Columns = [];

  if (columnOrder) {
    columns.push({
      title: '#',
      field: 'drag',
      align: 'left',
      width: '40',
      slots: {
        default: ({ rowIndex, row }) => {
          const fixed = !(row.fixed === undefined || row.fixed === null);
          return (
            <div
              data-id={rowIndex}
              title={fixed ? '锁定列不可调整顺序' : '拖动调整顺序'}
              class={fixed ? 'smart-table-column-config--drag-fixed' : DRAG_CLASS}
            >
              <i data-id={rowIndex} class="vxe-icon-num-list" />
            </div>
          );
        },
      },
    });
  }
  columns.push(
    ...([
      {
        type: 'checkbox',
        width: '60',
        headerAlign: 'left',
      },
      {
        field: 'title',
        width: 100,
        title: '列名',
      },
      {
        field: 'fixed',
        width: 80,
        title: '列冻结',
        slots: {
          default: ({ row }) => {
            return (
              <div class="smart-table-column-config-fixed-option">
                <span
                  onClick={(event) => changeFixed(event, 'left', row)}
                  class={[
                    row.fixed === 'left' ? 'vxe-icon-fixed-left-fill' : 'vxe-icon-fixed-left',
                    'fixed-span',
                    {
                      'is--checked': row.fixed === 'left',
                    },
                  ]}
                  title={vxeI18n(
                    row.fixed === 'left' ? 'vxe.toolbar.cancelfixed' : 'vxe.toolbar.fixedLeft',
                  )}
                />
                <span
                  onClick={(event) => changeFixed(event, 'right', row)}
                  class={[
                    row.fixed === 'right' ? 'vxe-icon-fixed-right-fill' : 'vxe-icon-fixed-right',
                    'fixed-span',
                    {
                      'is--checked': row.fixed === 'right',
                    },
                  ]}
                  title={vxeI18n(
                    row.fixed === 'right' ? 'vxe.toolbar.cancelfixed' : 'vxe.toolbar.fixedRight',
                  )}
                />
              </div>
            );
          },
        },
      },
    ] as VxeGridPropTypes.Columns),
  );
  return columns;
};

interface ChangeColumn {
  column: VxeTableDefines.ColumnInfo;
  checked: boolean;
}

const useColumnShowHide = (getTable: () => VxeGridInstance) => {
  /**
   * 变更的列
   */
  const changeColumnsRef = ref<Recordable<ChangeColumn | null>>({});

  /**
   * 显示隐藏变更触发
   * @param row
   * @param checked
   */
  const handleCheckboxChange = ({ row, checked }) => {
    const { column } = row;
    const changeColumn = unref(changeColumnsRef)[column.id];
    if (changeColumn === null || changeColumn === undefined) {
      changeColumnsRef.value[column.id] = { column, checked };
    } else {
      changeColumnsRef.value[column.id] = null;
    }
  };

  /**
   * 重置列显示隐藏
   */
  const handleRestShowHide = () => {
    getTable().resetColumn({});
    changeColumnsRef.value = {};
  };

  /**
   * 点击确定显示隐藏列
   */
  const handleShowHideOk = () => {
    const table = getTable();
    Object.entries(unref(changeColumnsRef)).forEach(([_, column]) => {
      if (column !== null) {
        if (column.checked) {
          table.showColumn(column.column);
        } else {
          table.hideColumn(column.column);
        }
      }
    });
    changeColumnsRef.value = {};
  };

  return {
    changeColumnsRef,
    handleCheckboxChange,
    handleRestShowHide,
    handleShowHideOk,
  };
};

const useDrag = (
  configTableRef: Ref<VxeGridInstance | undefined>,
  getTable: () => VxeGridInstance,
  setColumnSortConfig: Function,
) => {
  let sortable: Sortable | null = null;
  const selector = '.body--wrapper>.vxe-table--body tbody';
  const openDrag = async () => {
    if (sortable != null) {
      return false;
    }
    const sortEl = unref(configTableRef)?.$el.querySelector(selector);
    sortable = Sortable.create(sortEl, {
      handle: `.${DRAG_CLASS}`,
      dataIdAttr: 'rowid',
      onEnd: ({ newIndex, oldIndex }) => {
        const table = getTable();
        const fullColumn = table.getTableColumn().fullColumn;
        const keySorts = fullColumn.map((item) => item.field);
        const currentRow = fullColumn.splice(oldIndex!, 1)[0];
        fullColumn.splice(newIndex!, 0, currentRow);
        sortable?.sort(keySorts);
        table.reloadColumn(fullColumn);
        nextTick(() => {
          if (table.id && table.customConfig?.storage === true) {
            setColumnSortConfig();
          }
        });
      },
    });
  };
  return {
    openDrag,
  };
};
