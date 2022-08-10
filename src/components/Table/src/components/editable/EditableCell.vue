<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, nextTick, ref, toRaw, unref, watchEffect } from 'vue';
  import type { BasicColumn } from '../../types/table';
  import type { EditRecordRow } from './index';
  import { CheckOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { CellComponent } from './CellComponent';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../../hooks/useTableContext';

  import clickOutside from '/@/directives/clickOutside';

  import { propTypes } from '/@/utils/propTypes';
  import { isArray, isBoolean, isFunction, isNumber, isString } from '/@/utils/is';
  import { createPlaceholderMessage } from './helper';
  import { omit, pick, set } from 'lodash-es';
  import { treeToList } from '/@/utils/helper/treeHelper';
  import { Spin } from 'ant-design-vue';

  export default defineComponent({
    name: 'EditableCell',
    components: { FormOutlined, CloseOutlined, CheckOutlined, CellComponent, Spin },
    directives: {
      clickOutside,
    },
    props: {
      value: {
        type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Recordable>,
        default: '',
      },
      record: {
        type: Object as PropType<EditRecordRow>,
      },
      column: {
        type: Object as PropType<BasicColumn>,
        default: () => ({}),
      },
      index: propTypes.number,
    },
    setup(props) {
      const table = useTableContext();
      const isEdit = ref(false);
      const elRef = ref();
      const ruleVisible = ref(false);
      const ruleMessage = ref('');
      const optionsRef = ref<LabelValueOptions>([]);
      const currentValueRef = ref<any>(props.value);
      const defaultValueRef = ref<any>(props.value);
      const spinning = ref<boolean>(false);

      const { prefixCls } = useDesign('editable-cell');

      const getComponent = computed(() => props.column?.editComponent || 'Input');
      const getRule = computed(() => props.column?.editRule);

      const getRuleVisible = computed(() => {
        return unref(ruleMessage) && unref(ruleVisible);
      });

      const getIsCheckComp = computed(() => {
        const component = unref(getComponent);
        return ['Checkbox', 'Switch'].includes(component);
      });

      const getComponentProps = computed(() => {
        const isCheckValue = unref(getIsCheckComp);

        const valueField = isCheckValue ? 'checked' : 'value';
        const val = unref(currentValueRef);

        const value = isCheckValue ? (isNumber(val) && isBoolean(val) ? val : !!val) : val;

        let compProps = props.column?.editComponentProps ?? {};
        const { record, column, index } = props;

        if (isFunction(compProps)) {
          compProps = compProps({ text: val, record, column, index }) ?? {};
        }
        const component = unref(getComponent);
        const apiSelectProps: Recordable = {};
        if (component === 'ApiSelect') {
          apiSelectProps.cache = true;
        }
        upEditDynamicDisabled(record, column, value);
        return {
          size: 'small',
          getPopupContainer: () => unref(table?.wrapRef.value) ?? document.body,
          placeholder: createPlaceholderMessage(unref(getComponent)),
          ...apiSelectProps,
          ...compProps,
          [valueField]: value,
          disabled: unref(getDisable),
        } as any;
      });
      function upEditDynamicDisabled(record, column, value) {
        if (!record) return false;
        const { key, dataIndex } = column;
        if (!key && !dataIndex) return;
        const dataKey = (dataIndex || key) as string;
        set(record, dataKey, value);
      }
      const getDisable = computed(() => {
        const { editDynamicDisabled } = props.column;
        let disabled = false;
        if (isBoolean(editDynamicDisabled)) {
          disabled = editDynamicDisabled;
        }
        if (isFunction(editDynamicDisabled)) {
          const { record } = props;
          disabled = editDynamicDisabled({ record });
        }
        return disabled;
      });
      const getValues = computed(() => {
        const { editValueMap } = props.column;

        const value = unref(currentValueRef);

        if (editValueMap && isFunction(editValueMap)) {
          return editValueMap(value);
        }

        const component = unref(getComponent);
        if (!component.includes('Select')) {
          return value;
        }

        const options: LabelValueOptions =
          unref(getComponentProps)?.options ?? (unref(optionsRef) || []);
        const option = options.find((item) => `${item.value}` === `${value}`);

        return option?.label ?? value;
      });

      const getWrapperStyle = computed((): CSSProperties => {
        if (unref(getIsCheckComp) || unref(getRowEditable)) {
          return {};
        }
        return {
          width: 'calc(100% - 48px)',
        };
      });

      const getWrapperClass = computed(() => {
        const { align = 'center' } = props.column;
        return `edit-cell-align-${align}`;
      });

      const getRowEditable = computed(() => {
        const { editable } = props.record || {};
        return !!editable;
      });

      watchEffect(() => {
        defaultValueRef.value = props.value;
        currentValueRef.value = props.value;
      });

      watchEffect(() => {
        const { editable } = props.column;
        if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
          isEdit.value = !!editable || unref(getRowEditable);
        }
      });

      function handleEdit() {
        if (unref(getRowEditable) || unref(props.column?.editRow)) return;
        ruleMessage.value = '';
        isEdit.value = true;
        nextTick(() => {
          const el = unref(elRef);
          el?.focus?.();
        });
      }

      async function handleChange(e: any) {
        const component = unref(getComponent);
        if (!e) {
          currentValueRef.value = e;
        } else if (component === 'Checkbox') {
          currentValueRef.value = (e as ChangeEvent).target.checked;
        } else if (component === 'Switch') {
          currentValueRef.value = e;
        } else if (e?.target && Reflect.has(e.target, 'value')) {
          currentValueRef.value = (e as ChangeEvent).target.value;
        } else if (isString(e) || isBoolean(e) || isNumber(e) || isArray(e)) {
          currentValueRef.value = e;
        }
        const onChange = unref(getComponentProps)?.onChange;
        if (onChange && isFunction(onChange)) onChange(...arguments);

        table.emit?.('edit-change', {
          column: props.column,
          value: unref(currentValueRef),
          record: toRaw(props.record),
        });
        handleSubmiRule();
      }

      async function handleSubmiRule() {
        const { column, record } = props;
        const { editRule } = column;
        const currentValue = unref(currentValueRef);

        if (editRule) {
          if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
            ruleVisible.value = true;
            const component = unref(getComponent);
            ruleMessage.value = createPlaceholderMessage(component);
            return false;
          }
          if (isFunction(editRule)) {
            const res = await editRule(currentValue, record as Recordable);
            if (!!res) {
              ruleMessage.value = res;
              ruleVisible.value = true;
              return false;
            } else {
              ruleMessage.value = '';
              return true;
            }
          }
        }
        ruleMessage.value = '';
        return true;
      }

      async function handleSubmit(needEmit = true, valid = true) {
        if (valid) {
          const isPass = await handleSubmiRule();
          if (!isPass) return false;
        }

        const { column, index, record } = props;
        if (!record) return false;
        const { key, dataIndex } = column;
        const value = unref(currentValueRef);
        if (!key && !dataIndex) return;

        const dataKey = (dataIndex || key) as string;

        if (!record.editable) {
          const { getBindValues } = table;

          const { beforeEditSubmit, columns } = unref(getBindValues);

          if (beforeEditSubmit && isFunction(beforeEditSubmit)) {
            spinning.value = true;
            const keys: string[] = columns
              .map((_column) => _column.dataIndex)
              .filter((field) => !!field) as string[];
            let result: any = true;
            try {
              result = await beforeEditSubmit({
                record: pick(record, keys),
                index,
                key: dataKey as string,
                value,
              });
            } catch (e) {
              result = false;
            } finally {
              spinning.value = false;
            }
            if (result === false) {
              return;
            }
          }
        }

        set(record, dataKey, value);
        //const record = await table.updateTableData(index, dataKey, value);
        needEmit && table.emit?.('edit-end', { record, index, key: dataKey, value });
        isEdit.value = false;
      }

      async function handleEnter() {
        if (props.column?.editRow) {
          return;
        }
        handleSubmit();
      }

      function handleSubmitClick() {
        handleSubmit();
      }

      function handleCancel() {
        isEdit.value = false;
        currentValueRef.value = defaultValueRef.value;
        const { column, index, record } = props;
        const { key, dataIndex } = column;
        table.emit?.('edit-cancel', {
          record,
          index,
          key: dataIndex || key,
          value: unref(currentValueRef),
        });
      }

      function onClickOutside() {
        if (props.column?.editable || unref(getRowEditable)) {
          return;
        }
        const component = unref(getComponent);

        if (component.includes('Input')) {
          handleCancel();
        }
      }

      // only ApiSelect or TreeSelect
      function handleOptionsChange(options: LabelValueOptions) {
        const { replaceFields } = unref(getComponentProps);
        const component = unref(getComponent);
        if (component === 'ApiTreeSelect') {
          const { title = 'title', value = 'value', children = 'children' } = replaceFields || {};
          let listOptions: Recordable[] = treeToList(options, { children });
          listOptions = listOptions.map((item) => {
            return {
              label: item[title],
              value: item[value],
            };
          });
          optionsRef.value = listOptions as LabelValueOptions;
        } else {
          optionsRef.value = options;
        }
      }

      function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: Fn) {
        if (props.record) {
          /* eslint-disable  */
          isArray(props.record[cbs])
            ? props.record[cbs]?.push(handle)
            : (props.record[cbs] = [handle]);
        }
      }

      if (props.record) {
        initCbs('submitCbs', handleSubmit);
        initCbs('validCbs', handleSubmiRule);
        initCbs('cancelCbs', handleCancel);

        if (props.column.dataIndex) {
          if (!props.record.editValueRefs) props.record.editValueRefs = {};
          props.record.editValueRefs[props.column.dataIndex as any] = currentValueRef;
        }
        /* eslint-disable  */
        props.record.onCancelEdit = () => {
          isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn) => fn());
        };
        /* eslint-disable */
        props.record.onSubmitEdit = async () => {
          if (isArray(props.record?.submitCbs)) {
            if (!props.record?.onValid?.()) return;
            const submitFns = props.record?.submitCbs || [];
            submitFns.forEach((fn) => fn(false, false));
            table.emit?.('edit-row-end');
            return true;
          }
        };
      }

      return {
        isEdit,
        prefixCls,
        handleEdit,
        currentValueRef,
        handleSubmit,
        handleChange,
        handleCancel,
        elRef,
        getComponent,
        getRule,
        onClickOutside,
        ruleMessage,
        getRuleVisible,
        getComponentProps,
        handleOptionsChange,
        getWrapperStyle,
        getWrapperClass,
        getRowEditable,
        getValues,
        handleEnter,
        handleSubmitClick,
        spinning,
      };
    },
    render() {
      return (
        <div class={this.prefixCls}>
          <div
            v-show={!this.isEdit}
            class={{ [`${this.prefixCls}__normal`]: true, 'ellipsis-cell': this.column.ellipsis }}
            onClick={this.handleEdit}
          >
            <div class="cell-content" title={this.column.ellipsis ? this.getValues ?? '' : ''}>
              {this.column.editRender
                ? this.column.editRender({
                    text: this.value,
                    record: this.record as Recordable,
                    column: this.column,
                    index: this.index,
                  })
                : this.getValues
                ? this.getValues
                : '\u00A0'}
            </div>
            {!this.column.editRow && <FormOutlined class={`${this.prefixCls}__normal-icon`} />}
          </div>
          {this.isEdit && (
            <Spin spinning={this.spinning}>
              <div class={`${this.prefixCls}__wrapper`} v-click-outside={this.onClickOutside}>
                <CellComponent
                  {...this.getComponentProps}
                  component={this.getComponent}
                  style={this.getWrapperStyle}
                  popoverVisible={this.getRuleVisible}
                  rule={this.getRule}
                  ruleMessage={this.ruleMessage}
                  class={this.getWrapperClass}
                  ref="elRef"
                  onChange={this.handleChange}
                  onOptionsChange={this.handleOptionsChange}
                  onPressEnter={this.handleEnter}
                />
                {!this.getRowEditable && (
                  <div class={`${this.prefixCls}__action`}>
                    <CheckOutlined
                      class={[`${this.prefixCls}__icon`, 'mx-2']}
                      onClick={this.handleSubmitClick}
                    />
                    <CloseOutlined class={`${this.prefixCls}__icon `} onClick={this.handleCancel} />
                  </div>
                )}
              </div>
            </Spin>
          )}
        </div>
      );
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-editable-cell';

  .edit-cell-align-left {
    text-align: left;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: left;
    }
  }

  .edit-cell-align-center {
    text-align: center;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: center;
    }
  }

  .edit-cell-align-right {
    text-align: right;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: right;
    }
  }

  .edit-cell-rule-popover {
    .ant-popover-inner-content {
      padding: 4px 8px;
      color: @error-color;
      // border: 1px solid @error-color;
      border-radius: 2px;
    }
  }
  .@{prefix-cls} {
    position: relative;

    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      > .ant-select {
        min-width: calc(100% - 50px);
      }
    }

    &__icon {
      &:hover {
        transform: scale(1.2);

        svg {
          color: @primary-color;
        }
      }
    }

    .ellipsis-cell {
      .cell-content {
        overflow-wrap: break-word;
        word-break: break-word;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &__normal {
      &-icon {
        position: absolute;
        top: 4px;
        right: 0;
        display: none;
        width: 20px;
        cursor: pointer;
      }
    }

    &:hover {
      .@{prefix-cls}__normal-icon {
        display: inline-block;
      }
    }
  }
</style>
