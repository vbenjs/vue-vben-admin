<template>
  <div :class="prefixCls">
    <div v-show="!isEdit" :class="`${prefixCls}__normal`" @click="handleEdit">
      {{ getValues || '&nbsp;' }}
      <FormOutlined :class="`${prefixCls}__normal-icon`" v-if="!column.editRow" />
    </div>

    <div v-if="isEdit" :class="`${prefixCls}__wrapper`" v-click-outside="onClickOutside">
      <CellComponent
        v-bind="getComponentProps"
        :component="getComponent"
        :style="getWrapperStyle"
        :popoverVisible="getRuleVisible"
        :rule="getRule"
        :ruleMessage="ruleMessage"
        size="small"
        ref="elRef"
        @change="handleChange"
        @options-change="handleOptionsChange"
        @pressEnter="handleEnter"
      />
      <div :class="`${prefixCls}__action`" v-if="!getRowEditable">
        <CheckOutlined :class="[`${prefixCls}__icon`, 'mx-2']" @click="handleSubmit" />
        <CloseOutlined :class="`${prefixCls}__icon `" @click="handleCancel" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import type { BasicColumn } from '../../types/table';

  import { defineComponent, ref, unref, nextTick, computed, watchEffect } from 'vue';
  import { FormOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { isString, isBoolean, isFunction, isNumber, isArray } from '/@/utils/is';
  import clickOutside from '/@/directives/clickOutside';

  import { CellComponent } from './CellComponent';
  import { useTableContext } from '../../hooks/useTableContext';
  import { propTypes } from '/@/utils/propTypes';
  import { createPlaceholderMessage } from './helper';

  import type { EditRecordRow } from './index';

  export default defineComponent({
    name: 'EditableCell',
    components: { FormOutlined, CloseOutlined, CheckOutlined, CellComponent },
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
        default: {},
      },
      index: propTypes.number,
    },
    setup(props) {
      const table = useTableContext();
      const isEdit = ref(false);
      const elRef = ref<any>(null);
      const ruleVisible = ref(false);
      const ruleMessage = ref('');
      const optionsRef = ref<LabelValueOptions>([]);
      const currentValueRef = ref<any>(props.value);
      const defaultValueRef = ref<any>(props.value);

      const { prefixCls } = useDesign('editable-cell');

      const getComponent = computed(() => props.column?.editComponent || 'Input');
      const getRule = computed(() => props.column?.editRule);

      const getRuleVisible = computed(() => {
        return unref(ruleMessage) && unref(ruleVisible);
      });

      // const getSize = computed(() => {
      //   const size = table?.getSize?.();
      //   if (size === 'middle' || !size) {
      //     return;
      //   }

      //   if (size === 'default') {
      //     return 'large';
      //   }
      //   return size;
      // });

      const getIsCheckComp = computed(() => {
        const component = unref(getComponent);
        return ['Checkbox', 'Switch'].includes(component);
      });

      const getComponentProps = computed(() => {
        const compProps = props.column?.editComponentProps ?? {};
        const component = unref(getComponent);
        const apiSelectProps: Recordable = {};
        if (component === 'ApiSelect') {
          apiSelectProps.cache = true;
        }

        const isCheckValue = unref(getIsCheckComp);

        const valueField = isCheckValue ? 'checked' : 'value';
        const val = unref(currentValueRef);

        const value = isCheckValue ? (isNumber(val) && isBoolean(val) ? val : !!val) : val;

        return {
          placeholder: createPlaceholderMessage(unref(getComponent)),
          ...apiSelectProps,
          ...compProps,
          [valueField]: value,
        };
      });

      const getValues = computed(() => {
        const { editComponentProps, editValueMap } = props.column;

        const value = unref(currentValueRef);

        if (editValueMap && isFunction(editValueMap)) {
          return editValueMap(value);
        }

        const component = unref(getComponent);
        if (!component.includes('Select')) {
          return value;
        }
        const options: LabelValueOptions = editComponentProps?.options ?? (unref(optionsRef) || []);
        const option = options.find((item) => `${item.value}` === `${value}`);
        return option?.label;
      });

      const getWrapperStyle = computed(
        (): CSSProperties => {
          if (unref(getIsCheckComp) || unref(getRowEditable)) {
            return {};
          }
          return {
            width: 'calc(100% - 48px)',
          };
        }
      );

      const getRowEditable = computed(() => {
        const { editable } = props.record || {};
        return !!editable;
      });

      watchEffect(() => {
        defaultValueRef.value = props.value;
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
        if (e?.target && Reflect.has(e.target, 'value')) {
          currentValueRef.value = (e as ChangeEvent).target.value;
        }
        if (component === 'Checkbox') {
          currentValueRef.value = (e as ChangeEvent).target.checked;
        } else if (isString(e) || isBoolean(e) || isNumber(e)) {
          currentValueRef.value = e;
        }
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
            const message = createPlaceholderMessage(component);
            ruleMessage.value = message;
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

      async function handleSubmit(needEmit = true) {
        const isPass = await handleSubmiRule();
        if (!isPass) return false;
        const { column, index } = props;
        const { key, dataIndex } = column;
        const value = unref(currentValueRef);
        if (!key || !dataIndex) return;
        const dataKey = (dataIndex || key) as string;

        const record = await table.updateTableData(index, dataKey, value);
        needEmit && table.emit?.('edit-end', { record, index, key, value });
        isEdit.value = false;
      }

      async function handleEnter() {
        if (props.column?.editRow) {
          return;
        }
        handleSubmit();
      }

      function handleCancel() {
        isEdit.value = false;
        currentValueRef.value = defaultValueRef.value;
        table.emit?.('edit-cancel', unref(currentValueRef));
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

      // only ApiSelect
      function handleOptionsChange(options: LabelValueOptions) {
        optionsRef.value = options;
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

        /* eslint-disable  */
        props.record.onCancelEdit = () => {
          isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn) => fn());
        };
        /* eslint-disable */
        props.record.onSubmitEdit = async () => {
          if (isArray(props.record?.submitCbs)) {
            const validFns = (props.record?.validCbs || []).map((fn) => fn());

            const res = await Promise.all(validFns);
            const pass = res.every((item) => !!item);

            if (!pass) return;
            const submitFns = props.record?.submitCbs || [];
            submitFns.forEach((fn) => fn(false));
            table.emit?.('edit-row-end');
            return true;
          }
          // isArray(props.record?.submitCbs) && props.record?.submitCbs.forEach((fn) => fn());
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
        getRowEditable,
        getValues,
        handleEnter,
        // getSize,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-editable-cell';

  .edit-cell-rule-popover {
    // .ant-popover-arrow {
    //   // border-color: transparent @error-color @error-color transparent !important;
    // }

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
    }

    &__icon {
      &:hover {
        transform: scale(1.2);

        svg {
          color: @primary-color;
        }
      }
    }

    &__normal {
      padding-right: 48px;

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
